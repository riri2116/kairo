import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireWorkspaceAccessBySlug, handleRouteError } from "@/lib/auth";
import { RoadmapStatus } from "@prisma/client";
import { paginationArgs, paginationMeta } from "@/lib/db";

const createSchema = z.object({
  workspaceSlug: z.string().min(1),
  productId: z.string().uuid().optional(),
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  quarter: z.string().max(20).optional(),
  status: z.nativeEnum(RoadmapStatus).default(RoadmapStatus.DRAFT),
  goals: z.array(z.string()).default([]),
});

export async function GET(req: NextRequest) {
  try {
    const userId = await requireAuth();
    const { searchParams } = req.nextUrl;
    const workspaceSlug = searchParams.get("workspaceSlug");
    if (!workspaceSlug) return NextResponse.json({ success: false, error: "workspaceSlug required" }, { status: 400 });

    const { workspace } = await requireWorkspaceAccessBySlug(userId, workspaceSlug);
    const page  = Math.max(1, Number(searchParams.get("page")  ?? 1));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? 20)));
    const where = { workspaceId: workspace.id, deletedAt: null };

    const [items, total] = await Promise.all([
      prisma.roadmap.findMany({
        where,
        ...paginationArgs({ page, limit }),
        orderBy: { createdAt: "desc" },
        include: {
          product: { select: { id: true, name: true } },
          items: { where: { deletedAt: null }, orderBy: { createdAt: "asc" } },
        },
      }),
      prisma.roadmap.count({ where }),
    ]);

    return NextResponse.json({ success: true, data: items, pagination: paginationMeta(total, { page, limit }) });
  } catch (e) { return handleRouteError(e); }
}

export async function POST(req: NextRequest) {
  try {
    const userId = await requireAuth();
    const body   = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ success: false, error: "Validation failed", issues: parsed.error.flatten().fieldErrors }, { status: 422 });

    const { workspaceSlug, productId, title, description, quarter, status, goals } = parsed.data;
    const { workspace } = await requireWorkspaceAccessBySlug(userId, workspaceSlug);

    const roadmap = await prisma.roadmap.create({
      data: { workspaceId: workspace.id, productId: productId ?? null, title, description: description ?? null, quarter: quarter ?? null, status, goals },
      include: {
        product: { select: { id: true, name: true } },
        items: { where: { deletedAt: null } },
      },
    });

    return NextResponse.json({ success: true, data: roadmap }, { status: 201 });
  } catch (e) { return handleRouteError(e); }
}
