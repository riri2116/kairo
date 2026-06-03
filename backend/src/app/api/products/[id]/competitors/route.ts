import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireProductAccess, handleRouteError, AuthError } from "@/lib/auth";
import { WorkspaceRole } from "@prisma/client";
import { paginationArgs, paginationMeta } from "@/lib/db";

const createSchema = z.object({
  competitorName: z.string().min(1).max(200),
  competitorUrl: z.string().url().optional(),
  strengths: z.array(z.string()).default([]),
  weaknesses: z.array(z.string()).default([]),
  opportunities: z.array(z.string()).default([]),
  threats: z.array(z.string()).default([]),
  score: z.number().int().min(0).max(100).optional(),
  rawData: z.record(z.unknown()).nullable().optional(),
  analyzedAt: z.string().datetime().nullable().optional(),
});

const updateSchema = createSchema.partial();

/** GET /api/products/[id]/competitors */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await requireAuth();
    await requireProductAccess(userId, params.id);

    const pagination = paginationArgs({
      page: Number(req.nextUrl.searchParams.get("page") ?? 1),
      limit: Number(req.nextUrl.searchParams.get("limit") ?? 20),
    });
    const where = { productId: params.id, deletedAt: null };
    const [items, total] = await Promise.all([
      prisma.competitorAnalysis.findMany({ where, ...pagination, orderBy: { createdAt: "desc" } }),
      prisma.competitorAnalysis.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: items,
      pagination: paginationMeta(total, pagination),
    });
  } catch (error) {
    return handleRouteError(error);
  }
}

/** POST /api/products/[id]/competitors */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { analyzedAt, ...rest } = parsed.data;
    const item = await prisma.competitorAnalysis.create({
      data: {
        productId: params.id,
        ...rest,
        ...(analyzedAt ? { analyzedAt: new Date(analyzedAt) } : {}),
      },
    });

    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}

/** PATCH /api/products/[id]/competitors?analysisId=xxx */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await requireAuth();
    const { membership } = await requireProductAccess(userId, params.id);
    if (membership.role === WorkspaceRole.VIEWER) throw new AuthError("Forbidden", 403);

    const analysisId = req.nextUrl.searchParams.get("analysisId");
    if (!analysisId) return NextResponse.json({ success: false, error: "analysisId required" }, { status: 400 });

    const parsed = updateSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { analyzedAt, ...rest } = parsed.data;
    const item = await prisma.competitorAnalysis.update({
      where: { id: analysisId, productId: params.id },
      data: {
        ...rest,
        ...(analyzedAt ? { analyzedAt: new Date(analyzedAt) } : {}),
      },
    });

    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    return handleRouteError(error);
  }
}

/** DELETE /api/products/[id]/competitors?analysisId=xxx */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await requireAuth();
    const { membership } = await requireProductAccess(userId, params.id);
    if (membership.role === WorkspaceRole.VIEWER || membership.role === WorkspaceRole.MEMBER) {
      throw new AuthError("Forbidden", 403);
    }

    const analysisId = req.nextUrl.searchParams.get("analysisId");
    if (!analysisId) return NextResponse.json({ success: false, error: "analysisId required" }, { status: 400 });

    await prisma.competitorAnalysis.update({
      where: { id: analysisId, productId: params.id },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({ success: true, message: "Analysis deleted" });
  } catch (error) {
    return handleRouteError(error);
  }
}
