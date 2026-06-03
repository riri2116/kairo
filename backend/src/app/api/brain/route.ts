import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireWorkspaceAccessBySlug, handleRouteError } from "@/lib/auth";
import { runBrainAnalysis } from "@/lib/openai";
import { BrainSubmissionType, BrainStatus } from "@prisma/client";
import { paginationArgs, paginationMeta } from "@/lib/db";

const createSchema = z.object({
  workspaceSlug: z.string().min(1),
  productId: z.string().uuid().optional(),
  submissionType: z.nativeEnum(BrainSubmissionType),
  title: z.string().min(1).max(200),
  input: z.string().min(10).max(5000),
});

/** GET /api/brain?workspaceSlug=xxx&page=1&limit=20&type=FEATURE_IDEA */
export async function GET(req: NextRequest) {
  try {
    const userId = await requireAuth();
    const { searchParams } = req.nextUrl;
    const workspaceSlug = searchParams.get("workspaceSlug");
    if (!workspaceSlug) {
      return NextResponse.json({ success: false, error: "workspaceSlug is required" }, { status: 400 });
    }

    const { workspace } = await requireWorkspaceAccessBySlug(userId, workspaceSlug);

    const page  = Math.max(1, Number(searchParams.get("page")  ?? 1));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? 20)));
    const type  = searchParams.get("type") as BrainSubmissionType | null;

    const where = {
      workspaceId: workspace.id,
      deletedAt: null,
      ...(type ? { submissionType: type } : {}),
    };

    const [analyses, total] = await Promise.all([
      prisma.productBrainAnalysis.findMany({
        where,
        ...paginationArgs({ page, limit }),
        orderBy: { createdAt: "desc" },
        include: { product: { select: { id: true, name: true } } },
      }),
      prisma.productBrainAnalysis.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: analyses,
      pagination: paginationMeta(total, { page, limit }),
    });
  } catch (error) {
    return handleRouteError(error);
  }
}

/** POST /api/brain — create and run analysis */
export async function POST(req: NextRequest) {
  try {
    const userId = await requireAuth();
    const body   = await req.json();
    const parsed = createSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { workspaceSlug, productId, submissionType, title, input } = parsed.data;
    const { workspace } = await requireWorkspaceAccessBySlug(userId, workspaceSlug);

    // Create record in RUNNING state
    const analysis = await prisma.productBrainAnalysis.create({
      data: {
        workspaceId: workspace.id,
        productId: productId ?? null,
        submissionType,
        title,
        input,
        status: BrainStatus.RUNNING,
      },
    });

    // Call OpenAI (synchronous for simplicity — P99 ~3s with gpt-4o)
    try {
      const result = await runBrainAnalysis(submissionType, title, input);

      const completed = await prisma.productBrainAnalysis.update({
        where: { id: analysis.id },
        data: {
          status: BrainStatus.COMPLETED,
          impactAnalysis:      result.impactAnalysis,
          riskAssessment:      result.riskAssessment,
          technicalComplexity: result.technicalComplexity,
          revenueImpact:       result.revenueImpact,
          retentionImpact:     result.retentionImpact,
          recommendation:      result.recommendation,
          confidenceScore:     result.confidenceScore,
          riskLevel:           result.riskLevel as any,
          rawResponse:         result as any,
          completedAt:         new Date(),
        },
        include: { product: { select: { id: true, name: true } } },
      });

      return NextResponse.json({ success: true, data: completed }, { status: 201 });
    } catch (aiError: any) {
      await prisma.productBrainAnalysis.update({
        where: { id: analysis.id },
        data: { status: BrainStatus.FAILED },
      });

      // Surface meaningful OpenAI errors to the client
      const status = aiError?.status ?? 500;
      const code   = aiError?.code ?? aiError?.type ?? "ai_error";
      const msg =
        code === "insufficient_quota"
          ? "OpenAI quota exceeded — please add billing credits to your OpenAI account."
          : code === "invalid_api_key"
          ? "Invalid OpenAI API key — please check your OPENAI_API_KEY secret."
          : aiError?.message ?? "AI analysis failed. Please try again.";

      console.error("[Brain AI Error]", aiError?.message ?? aiError);
      return NextResponse.json({ success: false, error: msg, code }, { status: status === 429 ? 429 : 502 });
    }
  } catch (error) {
    return handleRouteError(error);
  }
}
