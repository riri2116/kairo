import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireWorkspaceAccessBySlug, handleRouteError, AuthError } from "@/lib/auth";
import { WorkspaceRole } from "@prisma/client";

const updateSchema = z.object({
  name: z.string().min(1).max(80).optional(),
  logoUrl: z.string().url().nullable().optional(),
});

/** GET /api/workspaces/[slug] */
export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const userId = await requireAuth();
    const { workspace, membership } = await requireWorkspaceAccessBySlug(userId, params.slug);

    const full = await prisma.workspace.findUnique({
      where: { id: workspace.id },
      include: {
        _count: { select: { members: true, products: true } },
        members: {
          include: { user: { select: { id: true, name: true, email: true, avatarUrl: true, image: true } } },
          orderBy: { joinedAt: "asc" },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        ...full,
        role: membership.role,
      },
    });
  } catch (error) {
    return handleRouteError(error);
  }
}

/** PATCH /api/workspaces/[slug] */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const userId = await requireAuth();
    const { workspace, membership } = await requireWorkspaceAccessBySlug(userId, params.slug);

    if (membership.role === WorkspaceRole.VIEWER || membership.role === WorkspaceRole.MEMBER) {
      throw new AuthError("Forbidden: admin or owner required", 403);
    }

    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const updated = await prisma.workspace.update({
      where: { id: workspace.id },
      data: {
        ...(parsed.data.name && { name: parsed.data.name }),
        ...(parsed.data.logoUrl !== undefined && { logoUrl: parsed.data.logoUrl }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return handleRouteError(error);
  }
}

/** DELETE /api/workspaces/[slug] — soft delete, owner only */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const userId = await requireAuth();
    const { workspace, membership } = await requireWorkspaceAccessBySlug(userId, params.slug);

    if (membership.role !== WorkspaceRole.OWNER) {
      throw new AuthError("Forbidden: owner required", 403);
    }

    await prisma.workspace.update({
      where: { id: workspace.id },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({ success: true, message: "Workspace deleted" });
  } catch (error) {
    return handleRouteError(error);
  }
}
