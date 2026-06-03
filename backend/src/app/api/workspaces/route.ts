import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth, handleRouteError } from "@/lib/auth";
import { createWorkspace } from "@/lib/workspace";

const createSchema = z.object({
  name: z.string().min(1).max(80),
});

/** GET /api/workspaces — list all workspaces the current user belongs to */
export async function GET() {
  try {
    const userId = await requireAuth();

    const memberships = await prisma.workspaceMember.findMany({
      where: { userId, workspace: { deletedAt: null } },
      include: {
        workspace: {
          include: {
            _count: { select: { members: true, products: true } },
          },
        },
      },
      orderBy: { joinedAt: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: memberships.map((m) => ({
        id: m.workspace.id,
        name: m.workspace.name,
        slug: m.workspace.slug,
        plan: m.workspace.plan,
        logoUrl: m.workspace.logoUrl,
        role: m.role,
        joinedAt: m.joinedAt,
        memberCount: m.workspace._count.members,
        productCount: m.workspace._count.products,
      })),
    });
  } catch (error) {
    return handleRouteError(error);
  }
}

/** POST /api/workspaces — create a new workspace */
export async function POST(req: NextRequest) {
  try {
    const userId = await requireAuth();
    const body = await req.json();
    const parsed = createSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { workspace, membership } = await createWorkspace(userId, parsed.data.name);

    return NextResponse.json(
      {
        success: true,
        data: {
          id: workspace.id,
          name: workspace.name,
          slug: workspace.slug,
          plan: workspace.plan,
          role: membership.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return handleRouteError(error);
  }
}
