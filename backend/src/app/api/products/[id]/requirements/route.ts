import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireProductAccess, handleRouteError, AuthError } from "@/lib/auth";
import { RequirementType, RequirementStatus, Priority, WorkspaceRole } from "@prisma/client";
import { paginationArgs, paginationMeta } from "@/lib/db";

const createSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  type: z.nativeEnum(RequirementType).default(RequirementType.FEATURE),
  priority: z.nativeEnum(Priority).default(Priority.MEDIUM),
  status: z.nativeEnum(RequirementStatus).default(RequirementStatus.DRAFT),
  acceptanceCriteria: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
});

const updateSchema = createSchema.partial();

/** GET /api/products/[id]/requirements */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await requireAuth();
    await requireProductAccess(userId, params.id);

    const { searchParams } = req.nextUrl;
    const pagination = paginationArgs({
      page: Number(searchParams.get("page") ?? 1),
      limit: Number(searchParams.get("limit") ?? 20),
    });

    const typeFilter = searchParams.get("type") as RequirementType | null;
    const statusFilter = searchParams.get("status") as RequirementStatus | null;
    const priorityFilter = searchParams.get("priority") as Priority | null;

    const where = {
      productId: params.id,
      deletedAt: null,
      ...(typeFilter ? { type: typeFilter } : {}),
      ...(statusFilter ? { status: statusFilter } : {}),
      ...(priorityFilter ? { priority: priorityFilter } : {}),
    };

    const [items, total] = await Promise.all([
      prisma.productRequirement.findMany({
        where,
        ...pagination,
        orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
      }),
      prisma.productRequirement.count({ where }),
    ]);

    return NextResponse.json({ success: true, data: items, pagination: paginationMeta(total, pagination) });
  } catch (error) {
    return handleRouteError(error);
  }
}

/** POST /api/products/[id]/requirements */
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

    const item = await prisma.productRequirement.create({ data: { productId: params.id, ...parsed.data } });
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}

/** PATCH /api/products/[id]/requirements?requirementId=xxx */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await requireAuth();
    const { membership } = await requireProductAccess(userId, params.id);
    if (membership.role === WorkspaceRole.VIEWER) throw new AuthError("Forbidden", 403);

    const requirementId = req.nextUrl.searchParams.get("requirementId");
    if (!requirementId) return NextResponse.json({ success: false, error: "requirementId required" }, { status: 400 });

    const parsed = updateSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const item = await prisma.productRequirement.update({
      where: { id: requirementId, productId: params.id },
      data: parsed.data,
    });
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    return handleRouteError(error);
  }
}

/** DELETE /api/products/[id]/requirements?requirementId=xxx */
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await requireAuth();
    const { membership } = await requireProductAccess(userId, params.id);
    if (membership.role === WorkspaceRole.VIEWER || membership.role === WorkspaceRole.MEMBER) {
      throw new AuthError("Forbidden", 403);
    }

    const requirementId = req.nextUrl.searchParams.get("requirementId");
    if (!requirementId) return NextResponse.json({ success: false, error: "requirementId required" }, { status: 400 });

    await prisma.productRequirement.update({
      where: { id: requirementId, productId: params.id },
      data: { deletedAt: new Date() },
    });
    return NextResponse.json({ success: true, message: "Requirement deleted" });
  } catch (error) {
    return handleRouteError(error);
  }
}
