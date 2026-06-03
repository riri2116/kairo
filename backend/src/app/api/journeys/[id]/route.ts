import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireWorkspaceAccess, handleRouteError, AuthError } from "@/lib/auth";
import { JourneyType } from "@prisma/client";

const stepSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional().nullable(),
});

const updateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  type: z.nativeEnum(JourneyType).optional(),
  description: z.string().max(2000).optional().nullable(),
  productId: z.string().uuid().optional().nullable(),
  steps: z.array(stepSchema).min(1).max(30).optional(),
});

const fullInclude = {
  steps: { orderBy: { order: "asc" as const } },
  analyses: {
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" as const },
    include: {
      risks: { orderBy: { createdAt: "asc" as const } },
      suggestions: { orderBy: { createdAt: "asc" as const } },
    },
  },
  product: { select: { id: true, name: true } },
};

async function resolveJourney(id: string, userId: string) {
  const journey = await prisma.journey.findUnique({
    where: { id, deletedAt: null },
  });
  if (!journey) throw new AuthError("Not Found", 404);
  await requireWorkspaceAccess(userId, journey.workspaceId);
  return journey;
}

/** GET /api/journeys/:id — journey with steps and full analysis history */
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await requireAuth();
    await resolveJourney(params.id, userId);
    const journey = await prisma.journey.findUnique({
      where: { id: params.id },
      include: fullInclude,
    });
    return NextResponse.json({ success: true, data: journey });
  } catch (error) {
    return handleRouteError(error);
  }
}

/** PATCH /api/journeys/:id — update journey; replaces steps when provided */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await requireAuth();
    const journey = await resolveJourney(params.id, userId);

    const body   = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { name, type, description, productId, steps } = parsed.data;

    // Ensure any linked product belongs to the journey's workspace (tenant boundary).
    if (productId) {
      const product = await prisma.product.findFirst({
        where: { id: productId, workspaceId: journey.workspaceId, deletedAt: null },
        select: { id: true },
      });
      if (!product) {
        return NextResponse.json(
          { success: false, error: "Product not found in this workspace" },
          { status: 400 }
        );
      }
    }

    await prisma.$transaction(async (tx) => {
      await tx.journey.update({
        where: { id: params.id },
        data: {
          ...(name !== undefined ? { name } : {}),
          ...(type !== undefined ? { type } : {}),
          ...(description !== undefined ? { description } : {}),
          ...(productId !== undefined ? { productId } : {}),
        },
      });

      if (steps) {
        await tx.journeyStep.deleteMany({ where: { journeyId: params.id } });
        await tx.journeyStep.createMany({
          data: steps.map((s, i) => ({
            journeyId: params.id,
            order: i + 1,
            title: s.title,
            description: s.description ?? null,
          })),
        });
      }
    });

    const updated = await prisma.journey.findUnique({
      where: { id: params.id },
      include: fullInclude,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return handleRouteError(error);
  }
}

/** DELETE /api/journeys/:id — soft delete */
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await requireAuth();
    await resolveJourney(params.id, userId);

    const now = new Date();
    await prisma.$transaction([
      prisma.emotionAnalysis.updateMany({
        where: { journeyId: params.id, deletedAt: null },
        data:  { deletedAt: now },
      }),
      prisma.journey.update({
        where: { id: params.id },
        data:  { deletedAt: now },
      }),
    ]);

    return NextResponse.json({ success: true, message: "Journey deleted" });
  } catch (error) {
    return handleRouteError(error);
  }
}
