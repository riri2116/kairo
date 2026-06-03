import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth, handleRouteError } from "@/lib/auth";
import { slugify } from "@/lib/workspace";

const onboardingSchema = z.object({
  workspaceName: z.string().min(1).max(80),
  industry: z.string().max(100).optional(),
  role: z.string().max(100).optional(),
});

/** GET — return current onboarding status */
export async function GET() {
  try {
    const userId = await requireAuth();

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        onboardingCompleted: true,
        memberships: {
          orderBy: { joinedAt: "asc" },
          take: 1,
          include: { workspace: { select: { id: true, name: true, slug: true } } },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        onboardingCompleted: user?.onboardingCompleted ?? false,
        defaultWorkspace: user?.memberships[0]?.workspace ?? null,
      },
    });
  } catch (error) {
    return handleRouteError(error);
  }
}

/** POST — complete onboarding: name workspace + set industry */
export async function POST(req: NextRequest) {
  try {
    const userId = await requireAuth();
    const body = await req.json();
    const parsed = onboardingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { workspaceName, industry } = parsed.data;

    const membership = await prisma.workspaceMember.findFirst({
      where: { userId },
      orderBy: { joinedAt: "asc" },
      include: { workspace: true },
    });

    if (!membership) {
      return NextResponse.json(
        { success: false, error: "No workspace found" },
        { status: 404 }
      );
    }

    const newSlug = slugify(workspaceName);
    const slugConflict = await prisma.workspace.findFirst({
      where: { slug: newSlug, id: { not: membership.workspaceId } },
    });

    const [workspace] = await prisma.$transaction([
      prisma.workspace.update({
        where: { id: membership.workspaceId },
        data: {
          name: workspaceName.trim(),
          slug: slugConflict
            ? `${newSlug}-${Math.random().toString(36).slice(2, 6)}`
            : newSlug,
        },
      }),
      prisma.user.update({
        where: { id: userId },
        data: { onboardingCompleted: true },
      }),
      ...(industry
        ? [
            prisma.product.updateMany({
              where: { workspaceId: membership.workspaceId },
              data: { industry },
            }),
          ]
        : []),
    ]);

    return NextResponse.json({
      success: true,
      message: "Onboarding complete",
      data: { workspaceId: workspace.id, workspaceName: workspace.name, slug: workspace.slug },
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
