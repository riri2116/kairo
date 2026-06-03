import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireProductAccess, handleRouteError, AuthError } from "@/lib/auth";
import { SessionStatus, WorkspaceRole } from "@prisma/client";
import { paginationArgs, paginationMeta } from "@/lib/db";

const createSchema = z.object({
  topic: z.string().min(1).max(500),
});

const updateSchema = z.object({
  topic: z.string().min(1).max(500).optional(),
  summary: z.string().max(3000).nullable().optional(),
  consensus: z.string().max(1000).nullable().optional(),
  status: z.nativeEnum(SessionStatus).optional(),
  votes: z.record(z.number()).nullable().optional(),
  transcript: z.array(z.record(z.unknown())).nullable().optional(),
});

/** GET /api/products/[id]/boardroom */
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
    const [sessions, total] = await Promise.all([
      prisma.boardroomSession.findMany({ where, ...pagination, orderBy: { createdAt: "desc" } }),
      prisma.boardroomSession.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: sessions,
      pagination: paginationMeta(total, pagination),
    });
  } catch (error) {
    return handleRouteError(error);
  }
}

/** POST /api/products/[id]/boardroom */
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

    const session = await prisma.boardroomSession.create({
      data: { productId: params.id, ...parsed.data },
    });

    return NextResponse.json({ success: true, data: session }, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}

/** PATCH /api/products/[id]/boardroom?sessionId=xxx */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await requireAuth();
    const { membership } = await requireProductAccess(userId, params.id);
    if (membership.role === WorkspaceRole.VIEWER) throw new AuthError("Forbidden", 403);

    const sessionId = req.nextUrl.searchParams.get("sessionId");
    if (!sessionId) return NextResponse.json({ success: false, error: "sessionId required" }, { status: 400 });

    const parsed = updateSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", issues: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const session = await prisma.boardroomSession.update({
      where: { id: sessionId, productId: params.id },
      data: parsed.data,
    });

    return NextResponse.json({ success: true, data: session });
  } catch (error) {
    return handleRouteError(error);
  }
}
