import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireWorkspaceAccessBySlug, handleRouteError, AuthError } from "@/lib/auth";
import { ProductStage, WorkspaceRole } from "@prisma/client";
import { paginationArgs, paginationMeta } from "@/lib/db";

const createSchema = z.object({
  workspaceSlug: z.string().min(1),
  name: z.string().min(1).max(120),
  description: z.string().max(2000).optional(),
  industry: z.string().max(100).optional(),
  stage: z.nativeEnum(ProductStage).default(ProductStage.IDEA),
});

/** GET /api/products?workspaceSlug=xxx&page=1&limit=20 */
export async function GET(req: NextRequest) {
  try {
    const userId = await requireAuth();
    const { searchParams } = req.nextUrl;
    const workspaceSlug = searchParams.get("workspaceSlug");

    if (!workspaceSlug) {
      return NextResponse.json(
        { success: false, error: "workspaceSlug is required" },
        { status: 400 }
      );
    }

    const { workspace } = await requireWorkspaceAccessBySlug(userId, workspaceSlug);

    const pagination = paginationArgs({
      page: Number(searchParams.get("page") ?? 1),
      limit: Number(searchParams.get("limit") ?? 20),
    });

    const where = { workspaceId: workspace.id, deletedAt: null };
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        ...pagination,
        orderBy: { createdAt: "desc" },
        include: {
          _count: {
            select: {
              simulations: true,
              predictions: true,
              boardroomSessions: true,
              competitorAnalyses: true,
              requirements: true,
            },
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: products,
      pagination: paginationMeta(total, pagination),
    });
  } catch (error) {
    return handleRouteError(error);
  }
}

/** POST /api/products */
export async function POST(req: NextRequest) {
  try {
    const userId = await requireAuth();
    const body = await req.json();
    const parsed = createSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const { workspaceSlug, ...data } = parsed.data;
    const { workspace, membership } = await requireWorkspaceAccessBySlug(userId, workspaceSlug);

    if (membership.role === WorkspaceRole.VIEWER) {
      throw new AuthError("Forbidden: write access required", 403);
    }

    const product = await prisma.product.create({
      data: { workspaceId: workspace.id, ...data },
    });

    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
