import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireProductAccess, handleRouteError, AuthError } from "@/lib/auth";
import { SimulationStatus, RiskLevel, WorkspaceRole } from "@prisma/client";
import { paginationArgs, paginationMeta } from "@/lib/db";

const createSchema = z.object({
  name: z.string().min(1).max(200),
  question: z.string().min(1).max(1000),
});

const updateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  question: z.string().min(1).max(1000).optional(),
  status: z.nativeEnum(SimulationStatus).optional(),
  confidence: z.number().min(0).max(1).optional(),
  retentionImpact: z.number().min(-1).max(1).optional(),
  riskScore: z.nativeEnum(RiskLevel).optional(),
  result: z.record(z.unknown()).optional(),
  runAt: z.string().datetime().optional(),
});

/** GET /api/products/[id]/simulations */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await requireAuth();
    await requireProductAccess(userId, params.id);

    const { searchParams } = req.nextUrl;
    const pagination = paginationArgs({
      page: Number(searchParams.get("page") ?? 1),
      limit: Number(searchParams.get("limit") ?? 20),
    });

    const statusFilter = searchParams.get("status") as SimulationStatus | null;
    const where = {
      productId: params.id,
      deletedAt: null,
      ...(statusFilter ? { status: statusFilter } : {}),
    };

    const [simulations, total] = await Promise.all([
      prisma.simulation.findMany({
        where,
        ...pagination,
        orderBy: { createdAt: "desc" },
      }),
      prisma.simulation.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: simulations,
      pagination: paginationMeta(total, pagination),
    });
  } catch (error) {
    return handleRouteError(error);
  }
}

/** POST /api/products/[id]/simulations */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await requireAuth();
    const { membership } = await requireProductAccess(userId, params.id);

    if (membership.role === WorkspaceRole.VIEWER) {
      throw new AuthError("Forbidden", 403);
    }

    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const simulation = await prisma.simulation.create({
      data: { productId: params.id, ...parsed.data },
    });

    return NextResponse.json({ success: true, data: simulation }, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}

/** PATCH /api/products/[id]/simulations?simulationId=xxx */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await requireAuth();
    const { membership } = await requireProductAccess(userId, params.id);

    if (membership.role === WorkspaceRole.VIEWER) {
      throw new AuthError("Forbidden", 403);
    }

    const simulationId = req.nextUrl.searchParams.get("simulationId");
    if (!simulationId) {
      return NextResponse.json({ success: false, error: "simulationId required" }, { status: 400 });
    }

    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const simulation = await prisma.simulation.update({
      where: { id: simulationId, productId: params.id },
      data: {
        ...parsed.data,
        ...(parsed.data.runAt ? { runAt: new Date(parsed.data.runAt) } : {}),
      },
    });

    return NextResponse.json({ success: true, data: simulation });
  } catch (error) {
    return handleRouteError(error);
  }
}
