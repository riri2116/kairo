import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireWorkspaceAccess, handleRouteError, AuthError } from "@/lib/auth";

async function resolveAnalysis(id: string, userId: string) {
  const analysis = await prisma.emotionAnalysis.findUnique({
    where: { id, deletedAt: null },
  });
  if (!analysis) throw new AuthError("Not Found", 404);
  await requireWorkspaceAccess(userId, analysis.workspaceId);
  return analysis;
}

/** GET /api/emotion/analyses/:id */
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await requireAuth();
    await resolveAnalysis(params.id, userId);
    const analysis = await prisma.emotionAnalysis.findUnique({
      where: { id: params.id },
      include: {
        risks: { orderBy: { createdAt: "asc" } },
        suggestions: { orderBy: { createdAt: "asc" } },
        journey: { include: { steps: { orderBy: { order: "asc" } } } },
      },
    });
    return NextResponse.json({ success: true, data: analysis });
  } catch (error) {
    return handleRouteError(error);
  }
}

/** DELETE /api/emotion/analyses/:id — soft delete an analysis from history */
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await requireAuth();
    await resolveAnalysis(params.id, userId);

    await prisma.emotionAnalysis.update({
      where: { id: params.id },
      data:  { deletedAt: new Date() },
    });

    return NextResponse.json({ success: true, message: "Analysis deleted" });
  } catch (error) {
    return handleRouteError(error);
  }
}
