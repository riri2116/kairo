import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireWorkspaceAccess, handleRouteError, AuthError } from "@/lib/auth";

async function resolve(id: string, userId: string) {
  const item = await prisma.competitorAnalysis.findUnique({
    where: { id, deletedAt: null },
    include: { product: { select: { id: true, name: true } } },
  });
  if (!item) throw new AuthError("Not Found", 404);
  await requireWorkspaceAccess(userId, item.workspaceId);
  return item;
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await requireAuth();
    return NextResponse.json({ success: true, data: await resolve(params.id, userId) });
  } catch (e) { return handleRouteError(e); }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await requireAuth();
    await resolve(params.id, userId);
    await prisma.competitorAnalysis.update({ where: { id: params.id }, data: { deletedAt: new Date() } });
    return NextResponse.json({ success: true, message: "Competitor deleted" });
  } catch (e) { return handleRouteError(e); }
}
