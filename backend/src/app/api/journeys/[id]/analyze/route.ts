import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireWorkspaceAccess, handleRouteError, AuthError } from "@/lib/auth";
import { runEmotionAnalysis } from "@/lib/emotionAI";
import { SimulationStatus } from "@prisma/client";

/** POST /api/journeys/:id/analyze — run a real AI emotion analysis on the journey */
export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await requireAuth();

    const journey = await prisma.journey.findUnique({
      where: { id: params.id, deletedAt: null },
      include: {
        steps: { orderBy: { order: "asc" } },
        product: { select: { name: true } },
      },
    });
    if (!journey) throw new AuthError("Not Found", 404);
    await requireWorkspaceAccess(userId, journey.workspaceId);

    if (journey.steps.length === 0) {
      return NextResponse.json(
        { success: false, error: "Add at least one step before analyzing this journey." },
        { status: 400 }
      );
    }

    // Create the analysis record in RUNNING state for history.
    const analysis = await prisma.emotionAnalysis.create({
      data: {
        workspaceId: journey.workspaceId,
        journeyId: journey.id,
        productId: journey.productId,
        status: SimulationStatus.RUNNING,
      },
    });

    try {
      const result = await runEmotionAnalysis({
        name: journey.name,
        type: journey.type,
        description: journey.description,
        productName: journey.product?.name ?? null,
        steps: journey.steps.map((s) => ({
          order: s.order,
          title: s.title,
          description: s.description,
        })),
      });

      const completed = await prisma.emotionAnalysis.update({
        where: { id: analysis.id },
        data: {
          status: SimulationStatus.COMPLETED,
          avgFrictionScore:    result.metrics.avgFrictionScore,
          dropOffRisk:         result.metrics.dropOffRisk,
          confidenceScore:     result.metrics.confidenceScore,
          delightScore:        result.metrics.delightScore,
          activationPotential: result.metrics.activationPotential,
          overallRisk:         result.overallRisk,
          summary:             result.summary,
          timeline:            result.timeline as any,
          optimizedJourney:    result.optimizedJourney as any,
          rawResponse:         result as any,
          completedAt:         new Date(),
          risks: {
            create: result.risks.map((r) => ({
              area: r.area,
              level: r.level,
              description: r.description,
              stepReference: r.stepReference,
            })),
          },
          suggestions: {
            create: result.suggestions.map((s) => ({
              category: s.category,
              title: s.title,
              description: s.description,
              expectedImpact: s.expectedImpact,
              priority: s.priority as any,
            })),
          },
        },
        include: {
          risks: { orderBy: { createdAt: "asc" } },
          suggestions: { orderBy: { createdAt: "asc" } },
        },
      });

      // Touch the journey so it sorts to the top of the list.
      await prisma.journey.update({
        where: { id: journey.id },
        data: { updatedAt: new Date() },
      });

      return NextResponse.json({ success: true, data: completed }, { status: 201 });
    } catch (aiError: any) {
      await prisma.emotionAnalysis.update({
        where: { id: analysis.id },
        data: { status: SimulationStatus.FAILED },
      });

      const code = aiError?.code ?? aiError?.type ?? "ai_error";
      const status = aiError?.status ?? 500;
      const msg =
        code === "insufficient_quota"
          ? "OpenAI quota exceeded — please add billing credits to your OpenAI account."
          : code === "invalid_api_key"
          ? "Invalid OpenAI API key — please check your OPENAI_API_KEY secret."
          : aiError?.message ?? "Emotion analysis failed. Please try again.";

      console.error("[Emotion AI Error]", aiError?.message ?? aiError);
      return NextResponse.json({ success: false, error: msg, code }, { status: status === 429 ? 429 : 502 });
    }
  } catch (error) {
    return handleRouteError(error);
  }
}
