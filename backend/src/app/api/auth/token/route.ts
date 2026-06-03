import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { SignJWT } from "jose";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

/**
 * POST /api/auth/token
 *
 * Issues a long-lived JWT for API clients (e.g. the separate React frontend).
 * Body: { email, password }
 * Returns: { success, token, user: { id, email, name }, workspaces: [...] }
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 422 }
      );
    }

    const { email, password } = parsed.data;
    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail, deletedAt: null },
    });

    if (!user?.passwordHash) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Sign a JWT with the same secret NextAuth uses
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET!);
    const token = await new SignJWT({ email: user.email })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(user.id)
      .setIssuedAt()
      .setExpirationTime("30d")
      .sign(secret);

    // Fetch workspaces for this user
    const memberships = await prisma.workspaceMember.findMany({
      where: { userId: user.id, workspace: { deletedAt: null } },
      include: { workspace: true },
      orderBy: { joinedAt: "asc" },
    });

    const workspaces = memberships.map((m) => ({
      id: m.workspace.id,
      name: m.workspace.name,
      slug: m.workspace.slug,
      plan: m.workspace.plan,
      role: m.role,
    }));

    return NextResponse.json({
      success: true,
      token,
      user: { id: user.id, email: user.email, name: user.name, image: user.avatarUrl },
      workspaces,
    });
  } catch (error) {
    console.error("[POST /api/auth/token]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
