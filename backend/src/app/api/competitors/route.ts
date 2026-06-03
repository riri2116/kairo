import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireWorkspaceAccessBySlug, handleRouteError } from "@/lib/auth";
import { mockCompetitorAnalysis } from "@/lib/mockAI";
import { paginationArgs, paginationMeta } from "@/lib/db";

const createSchema = z.object({
  workspaceSlug: z.string().min(1),
  productId: z.string().uuid().optional(),
  competitorName: z.string().min(1).max(150),
  competitorUrl: z.string().url().optional().or(z.literal("")),
  notes: z.string().max(2000).optional(),
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
      prisma.competitorAnalysis.findMany({
        where,
        ...paginationArgs({ page, limit }),
        orderBy: { createdAt: "desc" },
        include: { product: { select: { id: true, name: true } } },
      }),
      prisma.competitorAnalysis.count({ where }),
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

    const { workspaceSlug, productId, competitorName, competitorUrl, notes } = parsed.data;
    const { workspace } = await requireWorkspaceAccessBySlug(userId, workspaceSlug);

    await new Promise(r => setTimeout(r, 800));
    const result = mockCompetitorAnalysis(competitorName, competitorUrl);

    const item = await prisma.competitorAnalysis.create({
      data: {
        workspaceId:    workspace.id,
        productId:      productId ?? null,
        competitorName,
        competitorUrl:  competitorUrl || null,
        strengths:      result.strengths,
        weaknesses:     result.weaknesses,
        opportunities:  result.opportunities,
        threats:        result.threats,
        score:          result.score,
        rawData:        { notes, ...result } as any,
        analyzedAt:     new Date(),
      },
      include: { product: { select: { id: true, name: true } } },
    });

    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (e) { return handleRouteError(e); }
}
