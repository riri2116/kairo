import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireWorkspaceAccess, handleRouteError, AuthError } from "@/lib/auth";
import { RoadmapStatus } from "@prisma/client";

const updateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  quarter: z.string().max(20).optional(),
  status: z.nativeEnum(RoadmapStatus).optional(),
  goals: z.array(z.string()).optional(),
});

async function resolve(id: string, userId: string) {
  const roadmap = await prisma.roadmap.findUnique({
    where: { id, deletedAt: null },
    include: {
      product: { select: { id: true, name: true } },
      items: { where: { deletedAt: null }, orderBy: { createdAt: "asc" } },
    },
  });
  if (!roadmap) throw new AuthError("Not Found", 404);
  await requireWorkspaceAccess(userId, roadmap.workspaceId);
  return roadmap;
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await requireAuth();
    return NextResponse.json({ success: true, data: await resolve(params.id, userId) });
  } catch (e) { return handleRouteError(e); }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await requireAuth();
    await resolve(params.id, userId);
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ success: false, error: "Validation failed" }, { status: 422 });

    const updated = await prisma.roadmap.update({
      where: { id: params.id },
      data: parsed.data,
      include: {
        product: { select: { id: true, name: true } },
        items: { where: { deletedAt: null }, orderBy: { createdAt: "asc" } },
      },
    });
    return NextResponse.json({ success: true, data: updated });
  } catch (e) { return handleRouteError(e); }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await requireAuth();
    await resolve(params.id, userId);
    await prisma.roadmap.update({ where: { id: params.id }, data: { deletedAt: new Date() } });
    return NextResponse.json({ success: true, message: "Roadmap deleted" });
  } catch (e) { return handleRouteError(e); }
}
