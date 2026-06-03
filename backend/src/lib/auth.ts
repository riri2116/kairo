import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { jwtVerify } from "jose";
import type { User, WorkspaceMember, Workspace } from "@prisma/client";

// ─── Session helpers ──────────────────────────────────────────────────────────

export async function getSession() {
  return auth();
}

export async function getSessionUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

function jwtSecret() {
  return new TextEncoder().encode(process.env.NEXTAUTH_SECRET!);
}

/**
 * Resolves the authenticated user ID from either:
 *  1. A NextAuth session cookie (browser / same-origin)
 *  2. An `Authorization: Bearer <token>` header (external API clients / SPA)
 *
 * Throws 401 if neither is valid.
 */
export async function requireAuth(): Promise<string> {
  // 1 — NextAuth session (cookie-based)
  const session = await auth();
  if (session?.user?.id) return session.user.id;

  // 2 — Bearer JWT
  const headersList = headers();
  const authHeader = headersList.get("authorization") ?? "";
  if (authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    try {
      const { payload } = await jwtVerify(token, jwtSecret());
      if (typeof payload.sub === "string" && payload.sub) return payload.sub;
    } catch {
      // fall through to 401
    }
  }

  throw new AuthError("Unauthorized", 401);
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

// ─── Workspace access guards ──────────────────────────────────────────────────

export async function requireWorkspaceAccess(userId: string, workspaceId: string) {
  const membership = await prisma.workspaceMember.findUnique({
    where: { userId_workspaceId: { userId, workspaceId } },
    include: { workspace: true },
  });

  if (!membership || membership.workspace.deletedAt) {
    throw new AuthError("Forbidden", 403);
  }
  return membership;
}

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
