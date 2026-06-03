import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireWorkspaceAccessBySlug, handleRouteError } from "@/lib/auth";
import { mockFeatureSandbox } from "@/lib/mockAI";
import { SandboxStatus, RiskLevel } from "@prisma/client";
import { paginationArgs, paginationMeta } from "@/lib/db";

const createSchema = z.object({
  workspaceSlug: z.string().min(1),
  productId: z.string().uuid().optional(),
  featureName: z.string().min(1).max(150),
  description: z.string().max(2000).optional(),
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
      prisma.featureSandbox.findMany({
        where,
        ...paginationArgs({ page, limit }),
        orderBy: { createdAt: "desc" },
        include: { product: { select: { id: true, name: true } } },
      }),
      prisma.featureSandbox.count({ where }),
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

    const { workspaceSlug, productId, featureName, description } = parsed.data;
    const { workspace } = await requireWorkspaceAccessBySlug(userId, workspaceSlug);

    await new Promise(r => setTimeout(r, 1000));
    const result = mockFeatureSandbox(featureName, description);

    const item = await prisma.featureSandbox.create({
      data: {
        workspaceId:        workspace.id,
        productId:          productId ?? null,
        featureName,
        description:        description ?? null,
        retentionImpact:    result.retentionImpact,
        revenueImpact:      result.revenueImpact,
        engagementImpact:   result.engagementImpact,
        effortEstimateDays: result.effortEstimateDays,
        riskLevel:          result.riskLevel as RiskLevel,
        status:             SandboxStatus.COMPLETED,
        parameters:         result.parameters as any,
        results:            result.results as any,
      },
      include: { product: { select: { id: true, name: true } } },
    });

    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (e) { return handleRouteError(e); }
}
