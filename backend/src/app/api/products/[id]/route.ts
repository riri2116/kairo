import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireProductAccess, handleRouteError, AuthError } from "@/lib/auth";
import { ProductStage, WorkspaceRole } from "@prisma/client";

const updateSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  description: z.string().max(2000).nullable().optional(),
  targetAudience: z.string().max(500).nullable().optional(),
  businessGoal: z.string().max(500).nullable().optional(),
  pricingModel: z.string().max(200).nullable().optional(),
  industry: z.string().max(100).nullable().optional(),
  stage: z.nativeEnum(ProductStage).optional(),
});

/** GET /api/products/[id] */
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await requireAuth();
    await requireProductAccess(userId, params.id);

    const product = await prisma.product.findUnique({
      where: { id: params.id, deletedAt: null },
      include: {
        workspace: { select: { id: true, name: true, slug: true, plan: true } },
        _count: {
          select: {
            simulations: true,
            predictions: true,
            boardroomSessions: true,
            competitorAnalyses: true,
            featureSandboxes: true,
            roadmaps: true,
            requirements: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return handleRouteError(error);
  }
}

/** PATCH /api/products/[id] */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await requireAuth();
    const { membership } = await requireProductAccess(userId, params.id);

    if (membership.role === WorkspaceRole.VIEWER) {
      throw new AuthError("Forbidden: write access required", 403);
    }

    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const product = await prisma.product.update({
      where: { id: params.id },
      data: parsed.data,
    });

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    return handleRouteError(error);
  }
}

/** DELETE /api/products/[id] — soft delete */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await requireAuth();
    const { membership } = await requireProductAccess(userId, params.id);

    if (membership.role === WorkspaceRole.VIEWER || membership.role === WorkspaceRole.MEMBER) {
      throw new AuthError("Forbidden: admin or owner required", 403);
    }

    await prisma.product.update({
      where: { id: params.id },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({ success: true, message: "Product deleted" });
  } catch (error) {
    return handleRouteError(error);
  }
}
