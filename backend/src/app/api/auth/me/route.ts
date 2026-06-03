import { NextResponse } from "next/server";
import { requireAuth, getDbUser, handleRouteError } from "@/lib/auth";

export async function GET() {
  try {
    const userId = await requireAuth();
    const user = await getDbUser(userId);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.avatarUrl ?? user.image,
        emailVerified: user.emailVerified,
        onboardingCompleted: user.onboardingCompleted,
        createdAt: user.createdAt,
        workspaces: user.memberships.map((m) => ({
          id: m.workspace.id,
          name: m.workspace.name,
          slug: m.workspace.slug,
          plan: m.workspace.plan,
          logoUrl: m.workspace.logoUrl,
          role: m.role,
          joinedAt: m.joinedAt,
        })),
      },
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
