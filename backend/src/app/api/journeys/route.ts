import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireWorkspaceAccessBySlug, handleRouteError } from "@/lib/auth";
import { JourneyType } from "@prisma/client";
import { paginationArgs, paginationMeta } from "@/lib/db";

const stepSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(2000).optional().nullable(),
});

const createSchema = z.object({
  workspaceSlug: z.string().min(1),
  productId: z.string().uuid().optional(),
  name: z.string().min(1).max(200),
  type: z.nativeEnum(JourneyType).optional(),
  description: z.string().max(2000).optional().nullable(),
  steps: z.array(stepSchema).min(1).max(30),
});

const latestAnalysisInclude = {
  steps: { orderBy: { order: "asc" as const } },
  analyses: {
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" as const },
    take: 1,
    include: {
      risks: { orderBy: { createdAt: "asc" as const } },
      suggestions: { orderBy: { createdAt: "asc" as const } },
    },
  },
  product: { select: { id: true, name: true } },
  _count: { select: { analyses: { where: { deletedAt: null } } } },
};

/** GET /api/journeys?workspaceSlug=xxx&page=1&limit=20&type=ONBOARDING */
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
    const type  = searchParams.get("type") as JourneyType | null;

    const where = {
      workspaceId: workspace.id,
      deletedAt: null,
      ...(type ? { type } : {}),
    };

    const [journeys, total] = await Promise.all([
      prisma.journey.findMany({
        where,
        ...paginationArgs({ page, limit }),
        orderBy: { updatedAt: "desc" },
        include: latestAnalysisInclude,
      }),
      prisma.journey.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: journeys,
      pagination: paginationMeta(total, { page, limit }),
    });
  } catch (error) {
    return handleRouteError(error);
  }
}

/** POST /api/journeys — create a journey with steps */
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

    const { workspaceSlug, productId, name, type, description, steps } = parsed.data;
    const { workspace } = await requireWorkspaceAccessBySlug(userId, workspaceSlug);

    // Ensure any linked product belongs to this workspace (tenant boundary).
    if (productId) {
      const product = await prisma.product.findFirst({
        where: { id: productId, workspaceId: workspace.id, deletedAt: null },
        select: { id: true },
      });
      if (!product) {
        return NextResponse.json(
          { success: false, error: "Product not found in this workspace" },
          { status: 400 }
        );
      }
    }

    const journey = await prisma.journey.create({
      data: {
        workspaceId: workspace.id,
        productId: productId ?? null,
        name,
        type: type ?? "CUSTOM",
        description: description ?? null,
        steps: {
          create: steps.map((s, i) => ({
            order: i + 1,
            title: s.title,
            description: s.description ?? null,
          })),
        },
      },
      include: latestAnalysisInclude,
    });

    return NextResponse.json({ success: true, data: journey }, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
