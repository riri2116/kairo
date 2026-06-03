import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { User, WorkspaceMember, Workspace } from "@prisma/client";

// ─── Session helpers ──────────────────────────────────────────────────────────

export async function getSession() {
  return auth();
}

export async function getSessionUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

/** Throws a 401 JSON response if not authenticated. Use in route handlers. */
export async function requireAuth(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new AuthError("Unauthorized", 401);
  }
  return session.user.id;
}

// ─── Database user helpers ────────────────────────────────────────────────────

export type UserWithMemberships = User & {
  memberships: (WorkspaceMember & { workspace: Workspace })[];
};

export async function getDbUser(userId: string): Promise<UserWithMemberships | null> {
  return prisma.user.findUnique({
    where: { id: userId, deletedAt: null },
    include: {
      memberships: {
        where: { workspace: { deletedAt: null } },
        include: { workspace: true },
      },
    },
  });
}

// ─── Workspace access guard ───────────────────────────────────────────────────

/**
 * Verifies the current session user is a member of the given workspace.
 * Returns the membership record, or throws 403 if not a member.
 */
export async function requireWorkspaceAccess(userId: string, workspaceId: string) {
  const membership = await prisma.workspaceMember.findUnique({
    where: {
      userId_workspaceId: { userId, workspaceId },
    },
    include: { workspace: true },
  });

  if (!membership || membership.workspace.deletedAt) {
    throw new AuthError("Forbidden", 403);
  }

  return membership;
}

/** Same as requireWorkspaceAccess but looks up workspace by slug. */
export async function requireWorkspaceAccessBySlug(userId: string, slug: string) {
  const workspace = await prisma.workspace.findUnique({
    where: { slug, deletedAt: null },
  });
  if (!workspace) throw new AuthError("Not Found", 404);

  const membership = await prisma.workspaceMember.findUnique({
    where: { userId_workspaceId: { userId, workspaceId: workspace.id } },
  });
  if (!membership) throw new AuthError("Forbidden", 403);

  return { workspace, membership };
}

/**
 * Verifies the user has access to a product via its workspace.
 */
export async function requireProductAccess(userId: string, productId: string) {
  const product = await prisma.product.findUnique({
    where: { id: productId, deletedAt: null },
    include: { workspace: true },
  });
  if (!product) throw new AuthError("Not Found", 404);

  const membership = await prisma.workspaceMember.findUnique({
    where: { userId_workspaceId: { userId, workspaceId: product.workspaceId } },
  });
  if (!membership) throw new AuthError("Forbidden", 403);

  return { product, membership };
}

// ─── Error helpers ────────────────────────────────────────────────────────────

export class AuthError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export function handleRouteError(error: unknown) {
  if (error instanceof AuthError) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: error.status }
    );
  }
  console.error("[Route Error]", error);
  return NextResponse.json(
    { success: false, error: "Internal server error" },
    { status: 500 }
  );
}
