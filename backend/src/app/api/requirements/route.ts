import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireWorkspaceAccessBySlug, handleRouteError } from "@/lib/auth";
import { RequirementType, RequirementStatus, Priority } from "@prisma/client";
import { paginationArgs, paginationMeta } from "@/lib/db";

const createSchema = z.object({
  workspaceSlug: z.string().min(1),
  productId: z.string().uuid().optional(),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(5000),
  type: z.nativeEnum(RequirementType).default(RequirementType.FEATURE),
  priority: z.nativeEnum(Priority).default(Priority.MEDIUM),
  status: z.nativeEnum(RequirementStatus).default(RequirementStatus.DRAFT),
  acceptanceCriteria: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
});

export async function GET(req: NextRequest) {
  try {
    const userId = await requireAuth();
    const { searchParams } = req.nextUrl;
    const workspaceSlug = searchParams.get("workspaceSlug");
    if (!workspaceSlug) return NextResponse.json({ success: false, error: "workspaceSlug required" }, { status: 400 });

    const { workspace } = await requireWorkspaceAccessBySlug(userId, workspaceSlug);
    const page   = Math.max(1, Number(searchParams.get("page")   ?? 1));
    const limit  = Math.min(50, Math.max(1, Number(searchParams.get("limit")  ?? 20)));
    const status = searchParams.get("status") as RequirementStatus | null;
    const type   = searchParams.get("type")   as RequirementType   | null;

    const where = {
      workspaceId: workspace.id,
      deletedAt: null,
      ...(status ? { status } : {}),
      ...(type   ? { type   } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.productRequirement.findMany({
        where,
        ...paginationArgs({ page, limit }),
        orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
        include: { product: { select: { id: true, name: true } } },
      }),
      prisma.productRequirement.count({ where }),
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

    const { workspaceSlug, productId, ...data } = parsed.data;
    const { workspace } = await requireWorkspaceAccessBySlug(userId, workspaceSlug);

    const item = await prisma.productRequirement.create({
      data: { workspaceId: workspace.id, productId: productId ?? null, ...data },
      include: { product: { select: { id: true, name: true } } },
    });

    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (e) { return handleRouteError(e); }
}
