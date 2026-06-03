import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireProductAccess, handleRouteError, AuthError } from "@/lib/auth";
import { PredictionType, PredictionHorizon, WorkspaceRole } from "@prisma/client";
import { paginationArgs, paginationMeta } from "@/lib/db";

const createSchema = z.object({
  title: z.string().min(1).max(200),
  type: z.nativeEnum(PredictionType),
  confidence: z.number().min(0).max(1),
  horizon: z.nativeEnum(PredictionHorizon),
  predictedValue: z.record(z.unknown()).nullable().optional(),
  metadata: z.record(z.unknown()).nullable().optional(),
});

const updateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  confidence: z.number().min(0).max(1).optional(),
  actualValue: z.record(z.unknown()).nullable().optional(),
  accuracy: z.number().min(0).max(1).optional(),
  resolvedAt: z.string().datetime().nullable().optional(),
  metadata: z.record(z.unknown()).nullable().optional(),
});

/** GET /api/products/[id]/predictions */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await requireAuth();
    await requireProductAccess(userId, params.id);

    const pagination = paginationArgs({
      page: Number(req.nextUrl.searchParams.get("page") ?? 1),
      limit: Number(req.nextUrl.searchParams.get("limit") ?? 20),
    });
    const typeFilter = req.nextUrl.searchParams.get("type") as PredictionType | null;
    const horizonFilter = req.nextUrl.searchParams.get("horizon") as PredictionHorizon | null;

    const where = {
      productId: params.id,
      deletedAt: null,
      ...(typeFilter ? { type: typeFilter } : {}),
      ...(horizonFilter ? { horizon: horizonFilter } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.prediction.findMany({ where, ...pagination, orderBy: { createdAt: "desc" } }),
      prisma.prediction.count({ where }),
    ]);

    return NextResponse.json({ success: true, data: items, pagination: paginationMeta(total, pagination) });
  } catch (error) {
    return handleRouteError(error);
  }
}

/** POST /api/products/[id]/predictions */
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await requireAuth();
    const { membership } = await requireProductAccess(userId, params.id);
    if (membership.role === WorkspaceRole.VIEWER) throw new AuthError("Forbidden", 403);

    const parsed = createSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const item = await prisma.prediction.create({ data: { productId: params.id, ...parsed.data } });
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}

/** PATCH /api/products/[id]/predictions?predictionId=xxx */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await requireAuth();
    const { membership } = await requireProductAccess(userId, params.id);
    if (membership.role === WorkspaceRole.VIEWER) throw new AuthError("Forbidden", 403);

    const predictionId = req.nextUrl.searchParams.get("predictionId");
    if (!predictionId) return NextResponse.json({ success: false, error: "predictionId required" }, { status: 400 });

    const parsed = updateSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { resolvedAt, ...rest } = parsed.data;
    const item = await prisma.prediction.update({
      where: { id: predictionId, productId: params.id },
      data: { ...rest, ...(resolvedAt !== undefined ? { resolvedAt: resolvedAt ? new Date(resolvedAt) : null } : {}) },
    });
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    return handleRouteError(error);
  }
}
