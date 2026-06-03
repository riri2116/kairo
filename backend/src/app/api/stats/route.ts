import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireWorkspaceAccessBySlug, handleRouteError } from "@/lib/auth";

/** GET /api/stats?workspaceSlug=xxx — workspace-wide aggregate stats */
export async function GET(req: NextRequest) {
  try {
    const userId = await requireAuth();
    const { searchParams } = req.nextUrl;
    const workspaceSlug = searchParams.get("workspaceSlug");
    if (!workspaceSlug) return NextResponse.json({ success: false, error: "workspaceSlug required" }, { status: 400 });

    const { workspace } = await requireWorkspaceAccessBySlug(userId, workspaceSlug);
    const wId = workspace.id;
    const base = { workspaceId: wId, deletedAt: null };

    const [
      products,
      brainAnalyses,
      boardroomSessions,
      competitors,
      sandboxes,
      roadmaps,
      requirements,
      openRequirements,
      completedBrain,
      completedSandboxes,
    ] = await Promise.all([
      prisma.product.count({ where: base }),
      prisma.productBrainAnalysis.count({ where: base }),
      prisma.boardroomSession.count({ where: base }),
      prisma.competitorAnalysis.count({ where: base }),
      prisma.featureSandbox.count({ where: base }),
      prisma.roadmap.count({ where: base }),
      prisma.productRequirement.count({ where: base }),
      prisma.productRequirement.count({ where: { ...base, status: { in: ["DRAFT", "REVIEW", "APPROVED", "IN_PROGRESS"] } } }),
      prisma.productBrainAnalysis.count({ where: { ...base, status: "COMPLETED" } }),
      prisma.featureSandbox.count({ where: { ...base, status: "COMPLETED" } }),
    ]);

    // Avg confidence from completed brain analyses
    const confAgg = await prisma.productBrainAnalysis.aggregate({
      where: { ...base, status: "COMPLETED", confidenceScore: { not: null } },
      _avg: { confidenceScore: true },
    });
    const avgConfidence = confAgg._avg.confidenceScore
      ? Math.round(confAgg._avg.confidenceScore)
      : null;

    // Avg sandbox retention impact
    const sandboxAgg = await prisma.featureSandbox.aggregate({
      where: { ...base, status: "COMPLETED", retentionImpact: { not: null } },
      _avg: { retentionImpact: true },
    });
    const avgRetentionImpact = sandboxAgg._avg.retentionImpact
      ? Math.round(sandboxAgg._avg.retentionImpact)
      : null;

    // Recent activity (last 10 items across all feature areas)
    const [recentBrain, recentBoards, recentComps, recentSandboxes, recentReqs] = await Promise.all([
      prisma.productBrainAnalysis.findMany({ where: base, orderBy: { createdAt: "desc" }, take: 3, select: { id: true, title: true, submissionType: true, status: true, createdAt: true } }),
      prisma.boardroomSession.findMany({ where: base, orderBy: { createdAt: "desc" }, take: 3, select: { id: true, topic: true, status: true, consensus: true, createdAt: true } }),
      prisma.competitorAnalysis.findMany({ where: base, orderBy: { createdAt: "desc" }, take: 3, select: { id: true, competitorName: true, score: true, createdAt: true } }),
      prisma.featureSandbox.findMany({ where: base, orderBy: { createdAt: "desc" }, take: 3, select: { id: true, featureName: true, retentionImpact: true, riskLevel: true, createdAt: true } }),
      prisma.productRequirement.findMany({ where: base, orderBy: { createdAt: "desc" }, take: 3, select: { id: true, title: true, priority: true, status: true, createdAt: true } }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        counts: {
          products,
          brainAnalyses,
          boardroomSessions,
          competitors,
          sandboxes,
          roadmaps,
          requirements,
          openRequirements,
          completedBrain,
          completedSandboxes,
        },
        metrics: {
          avgConfidence,
          avgRetentionImpact,
        },
        recentActivity: {
          brain: recentBrain,
          boardroom: recentBoards,
          competitors: recentComps,
          sandboxes: recentSandboxes,
          requirements: recentReqs,
        },
      },
    });
  } catch (e) { return handleRouteError(e); }
}
