import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireWorkspaceAccessBySlug, handleRouteError } from "@/lib/auth";
import { SimulationStatus } from "@prisma/client";

/**
 * GET /api/emotion/metrics?workspaceSlug=xxx
 * Aggregate dashboard metrics from the latest completed analysis of each journey.
 */
export async function GET(req: NextRequest) {
  try {
    const userId = await requireAuth();
    const { searchParams } = req.nextUrl;
    const workspaceSlug = searchParams.get("workspaceSlug");
    if (!workspaceSlug) {
      return NextResponse.json({ success: false, error: "workspaceSlug is required" }, { status: 400 });
    }

    const { workspace } = await requireWorkspaceAccessBySlug(userId, workspaceSlug);

    const [journeysCount, analysesCount, completed] = await Promise.all([
      prisma.journey.count({ where: { workspaceId: workspace.id, deletedAt: null } }),
      prisma.emotionAnalysis.count({
        where: { workspaceId: workspace.id, deletedAt: null, status: SimulationStatus.COMPLETED, journey: { deletedAt: null } },
      }),
      prisma.emotionAnalysis.findMany({
        where: { workspaceId: workspace.id, deletedAt: null, status: SimulationStatus.COMPLETED, journey: { deletedAt: null } },
        orderBy: { createdAt: "desc" },
        select: {
          journeyId: true,
          avgFrictionScore: true,
          dropOffRisk: true,
          confidenceScore: true,
          delightScore: true,
          activationPotential: true,
        },
      }),
    ]);

    // Keep only the latest completed analysis per journey.
    const latestByJourney = new Map<string, (typeof completed)[number]>();
    for (const a of completed) {
      if (!latestByJourney.has(a.journeyId)) latestByJourney.set(a.journeyId, a);
    }
    const rows = Array.from(latestByJourney.values());

    const avg = (key: keyof (typeof rows)[number]) => {
      const vals = rows.map((r) => Number(r[key])).filter((n) => Number.isFinite(n));
      if (vals.length === 0) return null;
      return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
    };

    return NextResponse.json({
      success: true,
      data: {
        journeysCount,
        analysesCount,
        analyzedJourneys: rows.length,
        metrics: {
          avgFrictionScore:    avg("avgFrictionScore"),
          dropOffRisk:         avg("dropOffRisk"),
          confidenceScore:     avg("confidenceScore"),
          delightScore:        avg("delightScore"),
          activationPotential: avg("activationPotential"),
        },
      },
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
