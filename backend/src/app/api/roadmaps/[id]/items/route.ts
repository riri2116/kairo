import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireWorkspaceAccess, handleRouteError, AuthError } from "@/lib/auth";
import { Priority, RoadmapItemStatus } from "@prisma/client";

const createSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  priority: z.nativeEnum(Priority).default(Priority.MEDIUM),
  status: z.nativeEnum(RoadmapItemStatus).default(RoadmapItemStatus.PLANNED),
  dueDate: z.string().datetime().optional(),
});

async function resolveRoadmap(id: string, userId: string) {
  const roadmap = await prisma.roadmap.findUnique({ where: { id, deletedAt: null } });
  if (!roadmap) throw new AuthError("Not Found", 404);
  await requireWorkspaceAccess(userId, roadmap.workspaceId);
  return roadmap;
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await requireAuth();
    await resolveRoadmap(params.id, userId);
    const items = await prisma.roadmapItem.findMany({
      where: { roadmapId: params.id, deletedAt: null },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json({ success: true, data: items });
  } catch (e) { return handleRouteError(e); }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await requireAuth();
    await resolveRoadmap(params.id, userId);
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ success: false, error: "Validation failed", issues: parsed.error.flatten().fieldErrors }, { status: 422 });

    const item = await prisma.roadmapItem.create({
      data: {
        roadmapId: params.id,
        ...parsed.data,
        dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,
      },
    });
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (e) { return handleRouteError(e); }
}
