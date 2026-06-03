import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireProductAccess, handleRouteError, AuthError } from "@/lib/auth";
import { RoadmapStatus, RoadmapItemStatus, Priority, WorkspaceRole } from "@prisma/client";
import { paginationArgs, paginationMeta } from "@/lib/db";

const createRoadmapSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  quarter: z.string().max(20).optional(),
  status: z.nativeEnum(RoadmapStatus).default(RoadmapStatus.DRAFT),
  goals: z.array(z.string()).default([]),
});

const createItemSchema = z.object({
  roadmapId: z.string().uuid(),
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  priority: z.nativeEnum(Priority).default(Priority.MEDIUM),
  status: z.nativeEnum(RoadmapItemStatus).default(RoadmapItemStatus.PLANNED),
  dueDate: z.string().datetime().nullable().optional(),
});

const updateItemSchema = createItemSchema.partial().omit({ roadmapId: true });

/** GET /api/products/[id]/roadmaps — returns roadmaps with their items */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await requireAuth();
    await requireProductAccess(userId, params.id);

    const pagination = paginationArgs({
      page: Number(req.nextUrl.searchParams.get("page") ?? 1),
      limit: Number(req.nextUrl.searchParams.get("limit") ?? 20),
    });
    const where = { productId: params.id, deletedAt: null };

    const [roadmaps, total] = await Promise.all([
      prisma.roadmap.findMany({
        where,
        ...pagination,
        orderBy: { createdAt: "desc" },
        include: {
          items: {
            where: { deletedAt: null },
            orderBy: [{ priority: "desc" }, { dueDate: "asc" }],
          },
          _count: { select: { items: true } },
        },
      }),
      prisma.roadmap.count({ where }),
    ]);

    return NextResponse.json({ success: true, data: roadmaps, pagination: paginationMeta(total, pagination) });
  } catch (error) {
    return handleRouteError(error);
  }
}

/** POST /api/products/[id]/roadmaps — create roadmap or add item */
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await requireAuth();
    const { membership } = await requireProductAccess(userId, params.id);
    if (membership.role === WorkspaceRole.VIEWER) throw new AuthError("Forbidden", 403);

    const body = await req.json();
    const isItem = Boolean(body.roadmapId);

    if (isItem) {
      const parsed = createItemSchema.safeParse(body);
      if (!parsed.success) {
        return NextResponse.json(
          { success: false, error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
          { status: 422 }
        );
      }
      const { dueDate, ...rest } = parsed.data;
      const item = await prisma.roadmapItem.create({
        data: { ...rest, ...(dueDate ? { dueDate: new Date(dueDate) } : {}) },
      });
      return NextResponse.json({ success: true, data: item }, { status: 201 });
    }

    const parsed = createRoadmapSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }
    const roadmap = await prisma.roadmap.create({ data: { productId: params.id, ...parsed.data } });
    return NextResponse.json({ success: true, data: roadmap }, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}

/** PATCH /api/products/[id]/roadmaps?itemId=xxx — update a roadmap item */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await requireAuth();
    const { membership } = await requireProductAccess(userId, params.id);
    if (membership.role === WorkspaceRole.VIEWER) throw new AuthError("Forbidden", 403);

    const itemId = req.nextUrl.searchParams.get("itemId");
    if (!itemId) return NextResponse.json({ success: false, error: "itemId required" }, { status: 400 });

    const parsed = updateItemSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }
    const { dueDate, ...rest } = parsed.data;
    const item = await prisma.roadmapItem.update({
      where: { id: itemId },
      data: { ...rest, ...(dueDate !== undefined ? { dueDate: dueDate ? new Date(dueDate) : null } : {}) },
    });
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    return handleRouteError(error);
  }
}
