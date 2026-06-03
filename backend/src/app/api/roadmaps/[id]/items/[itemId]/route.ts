import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireWorkspaceAccess, handleRouteError, AuthError } from "@/lib/auth";
import { Priority, RoadmapItemStatus } from "@prisma/client";

const updateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  priority: z.nativeEnum(Priority).optional(),
  status: z.nativeEnum(RoadmapItemStatus).optional(),
  dueDate: z.string().datetime().nullable().optional(),
});

async function resolveItem(roadmapId: string, itemId: string, userId: string) {
  const item = await prisma.roadmapItem.findUnique({ where: { id: itemId, deletedAt: null } });
  if (!item || item.roadmapId !== roadmapId) throw new AuthError("Not Found", 404);
  const roadmap = await prisma.roadmap.findUnique({ where: { id: roadmapId } });
  if (!roadmap) throw new AuthError("Not Found", 404);
  await requireWorkspaceAccess(userId, roadmap.workspaceId);
  return item;
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string; itemId: string } }) {
  try {
    const userId = await requireAuth();
    await resolveItem(params.id, params.itemId, userId);
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ success: false, error: "Validation failed" }, { status: 422 });

    const { dueDate, ...rest } = parsed.data;
    const updated = await prisma.roadmapItem.update({
      where: { id: params.itemId },
      data: { ...rest, ...(dueDate !== undefined ? { dueDate: dueDate ? new Date(dueDate) : null } : {}) },
    });
    return NextResponse.json({ success: true, data: updated });
  } catch (e) { return handleRouteError(e); }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string; itemId: string } }) {
  try {
    const userId = await requireAuth();
    await resolveItem(params.id, params.itemId, userId);
    await prisma.roadmapItem.update({ where: { id: params.itemId }, data: { deletedAt: new Date() } });
    return NextResponse.json({ success: true, message: "Item deleted" });
  } catch (e) { return handleRouteError(e); }
}
