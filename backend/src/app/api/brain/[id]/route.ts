import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireWorkspaceAccess, handleRouteError, AuthError } from "@/lib/auth";

async function resolveAnalysis(id: string, userId: string) {
  const analysis = await prisma.productBrainAnalysis.findUnique({
    where: { id, deletedAt: null },
    include: { product: { select: { id: true, name: true } } },
  });
  if (!analysis) throw new AuthError("Not Found", 404);
  await requireWorkspaceAccess(userId, analysis.workspaceId);
  return analysis;
}

/** GET /api/brain/:id */
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId   = await requireAuth();
    const analysis = await resolveAnalysis(params.id, userId);
    return NextResponse.json({ success: true, data: analysis });
  } catch (error) {
    return handleRouteError(error);
  }
}

/** DELETE /api/brain/:id — soft delete */
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await requireAuth();
    await resolveAnalysis(params.id, userId);

    await prisma.productBrainAnalysis.update({
      where: { id: params.id },
      data:  { deletedAt: new Date() },
    });

    return NextResponse.json({ success: true, message: "Analysis deleted" });
  } catch (error) {
    return handleRouteError(error);
  }
}
