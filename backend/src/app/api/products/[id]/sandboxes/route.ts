import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireProductAccess, handleRouteError, AuthError } from "@/lib/auth";
import { SandboxStatus, RiskLevel, WorkspaceRole } from "@prisma/client";
import { paginationArgs, paginationMeta } from "@/lib/db";

const createSchema = z.object({
  featureName: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  retentionImpact: z.number().min(-1).max(1).optional(),
  revenueImpact: z.number().min(-1).max(1).optional(),
  engagementImpact: z.number().min(-1).max(1).optional(),
  effortEstimateDays: z.number().int().positive().optional(),
  riskLevel: z.nativeEnum(RiskLevel).optional(),
  status: z.nativeEnum(SandboxStatus).default(SandboxStatus.DRAFT),
  parameters: z.record(z.unknown()).nullable().optional(),
  results: z.record(z.unknown()).nullable().optional(),
});

const updateSchema = createSchema.partial();

/** GET /api/products/[id]/sandboxes */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await requireAuth();
    await requireProductAccess(userId, params.id);

    const pagination = paginationArgs({
      page: Number(req.nextUrl.searchParams.get("page") ?? 1),
      limit: Number(req.nextUrl.searchParams.get("limit") ?? 20),
    });
    const statusFilter = req.nextUrl.searchParams.get("status") as SandboxStatus | null;
    const where = { productId: params.id, deletedAt: null, ...(statusFilter ? { status: statusFilter } : {}) };

    const [items, total] = await Promise.all([
      prisma.featureSandbox.findMany({ where, ...pagination, orderBy: { createdAt: "desc" } }),
      prisma.featureSandbox.count({ where }),
    ]);

    return NextResponse.json({ success: true, data: items, pagination: paginationMeta(total, pagination) });
  } catch (error) {
    return handleRouteError(error);
  }
}

/** POST /api/products/[id]/sandboxes */
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

    const item = await prisma.featureSandbox.create({ data: { productId: params.id, ...parsed.data } });
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}

/** PATCH /api/products/[id]/sandboxes?sandboxId=xxx */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await requireAuth();
    const { membership } = await requireProductAccess(userId, params.id);
    if (membership.role === WorkspaceRole.VIEWER) throw new AuthError("Forbidden", 403);

    const sandboxId = req.nextUrl.searchParams.get("sandboxId");
    if (!sandboxId) return NextResponse.json({ success: false, error: "sandboxId required" }, { status: 400 });

    const parsed = updateSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const item = await prisma.featureSandbox.update({
      where: { id: sandboxId, productId: params.id },
      data: parsed.data,
    });
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    return handleRouteError(error);
  }
}

/** DELETE /api/products/[id]/sandboxes?sandboxId=xxx */
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await requireAuth();
    const { membership } = await requireProductAccess(userId, params.id);
    if (membership.role === WorkspaceRole.VIEWER || membership.role === WorkspaceRole.MEMBER) {
      throw new AuthError("Forbidden", 403);
    }

    const sandboxId = req.nextUrl.searchParams.get("sandboxId");
    if (!sandboxId) return NextResponse.json({ success: false, error: "sandboxId required" }, { status: 400 });

    await prisma.featureSandbox.update({
      where: { id: sandboxId, productId: params.id },
      data: { deletedAt: new Date() },
    });
    return NextResponse.json({ success: true, message: "Sandbox deleted" });
  } catch (error) {
    return handleRouteError(error);
  }
}
