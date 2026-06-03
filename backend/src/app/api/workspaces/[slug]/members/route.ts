import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireWorkspaceAccessBySlug, handleRouteError, AuthError } from "@/lib/auth";
import { WorkspaceRole } from "@prisma/client";

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.nativeEnum(WorkspaceRole).default(WorkspaceRole.MEMBER),
});

const updateRoleSchema = z.object({
  memberId: z.string().uuid(),
  role: z.nativeEnum(WorkspaceRole),
});

/** GET /api/workspaces/[slug]/members */
export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const userId = await requireAuth();
    const { workspace } = await requireWorkspaceAccessBySlug(userId, params.slug);

    const members = await prisma.workspaceMember.findMany({
      where: { workspaceId: workspace.id },
      include: {
        user: { select: { id: true, name: true, email: true, avatarUrl: true, image: true, createdAt: true } },
      },
      orderBy: { joinedAt: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: members.map((m) => ({
        memberId: m.id,
        role: m.role,
        joinedAt: m.joinedAt,
        user: m.user,
      })),
    });
  } catch (error) {
    return handleRouteError(error);
  }
}

/** POST /api/workspaces/[slug]/members — invite by email */
export async function POST(
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
    const parsed = inviteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const invitee = await prisma.user.findUnique({
      where: { email: parsed.data.email.toLowerCase(), deletedAt: null },
      select: { id: true, email: true, name: true },
    });

    if (!invitee) {
      return NextResponse.json(
        { success: false, error: "No user found with that email" },
        { status: 404 }
      );
    }

    const existing = await prisma.workspaceMember.findUnique({
      where: { userId_workspaceId: { userId: invitee.id, workspaceId: workspace.id } },
    });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "User is already a member of this workspace" },
        { status: 409 }
      );
    }

    const newMembership = await prisma.workspaceMember.create({
      data: { userId: invitee.id, workspaceId: workspace.id, role: parsed.data.role },
    });

    return NextResponse.json(
      { success: true, data: { memberId: newMembership.id, role: newMembership.role, user: invitee } },
      { status: 201 }
    );
  } catch (error) {
    return handleRouteError(error);
  }
}

/** PATCH /api/workspaces/[slug]/members — update member role */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const userId = await requireAuth();
    const { workspace, membership } = await requireWorkspaceAccessBySlug(userId, params.slug);

    if (membership.role !== WorkspaceRole.OWNER && membership.role !== WorkspaceRole.ADMIN) {
      throw new AuthError("Forbidden", 403);
    }

    const body = await req.json();
    const parsed = updateRoleSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed" },
        { status: 422 }
      );
    }

    const updated = await prisma.workspaceMember.update({
      where: { id: parsed.data.memberId, workspaceId: workspace.id },
      data: { role: parsed.data.role },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return handleRouteError(error);
  }
}

/** DELETE /api/workspaces/[slug]/members?memberId=xxx */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const userId = await requireAuth();
    const { workspace, membership } = await requireWorkspaceAccessBySlug(userId, params.slug);

    const memberId = req.nextUrl.searchParams.get("memberId");
    if (!memberId) {
      return NextResponse.json({ success: false, error: "memberId required" }, { status: 400 });
    }

    const target = await prisma.workspaceMember.findUnique({
      where: { id: memberId, workspaceId: workspace.id },
    });
    if (!target) {
      return NextResponse.json({ success: false, error: "Member not found" }, { status: 404 });
    }

    const isSelf = target.userId === userId;
    const isOwnerAction = membership.role === WorkspaceRole.OWNER;
    const isAdminAction = membership.role === WorkspaceRole.ADMIN && target.role !== WorkspaceRole.OWNER;

    if (!isSelf && !isOwnerAction && !isAdminAction) {
      throw new AuthError("Forbidden", 403);
    }

    await prisma.workspaceMember.delete({ where: { id: memberId } });

    return NextResponse.json({ success: true, message: "Member removed" });
  } catch (error) {
    return handleRouteError(error);
  }
}
