import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireWorkspaceAccess, handleRouteError, AuthError } from "@/lib/auth";

async function resolve(id: string, userId: string) {
  const session = await prisma.boardroomSession.findUnique({
    where: { id, deletedAt: null },
    include: { product: { select: { id: true, name: true } } },
  });
  if (!session) throw new AuthError("Not Found", 404);
  await requireWorkspaceAccess(userId, session.workspaceId);
  return session;
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await requireAuth();
    const session = await resolve(params.id, userId);
    return NextResponse.json({ success: true, data: session });
  } catch (e) { return handleRouteError(e); }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await requireAuth();
    await resolve(params.id, userId);
    await prisma.boardroomSession.update({ where: { id: params.id }, data: { deletedAt: new Date() } });
    return NextResponse.json({ success: true, message: "Session deleted" });
  } catch (e) { return handleRouteError(e); }
}
