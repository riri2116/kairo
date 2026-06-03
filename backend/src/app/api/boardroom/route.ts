import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireWorkspaceAccessBySlug, handleRouteError } from "@/lib/auth";
import { mockBoardroomSession } from "@/lib/mockAI";
import { SessionStatus } from "@prisma/client";
import { paginationArgs, paginationMeta } from "@/lib/db";

const createSchema = z.object({
  workspaceSlug: z.string().min(1),
  productId: z.string().uuid().optional(),
  topic: z.string().min(1).max(300),
  question: z.string().min(10).max(2000),
});

/** GET /api/boardroom?workspaceSlug=xxx */
export async function GET(req: NextRequest) {
  try {
    const userId = await requireAuth();
    const { searchParams } = req.nextUrl;
    const workspaceSlug = searchParams.get("workspaceSlug");
    if (!workspaceSlug) return NextResponse.json({ success: false, error: "workspaceSlug required" }, { status: 400 });

    const { workspace } = await requireWorkspaceAccessBySlug(userId, workspaceSlug);
    const page  = Math.max(1, Number(searchParams.get("page")  ?? 1));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? 20)));
    const where = { workspaceId: workspace.id, deletedAt: null };

    const [sessions, total] = await Promise.all([
      prisma.boardroomSession.findMany({
        where,
        ...paginationArgs({ page, limit }),
        orderBy: { createdAt: "desc" },
        include: { product: { select: { id: true, name: true } } },
      }),
      prisma.boardroomSession.count({ where }),
    ]);

    return NextResponse.json({ success: true, data: sessions, pagination: paginationMeta(total, { page, limit }) });
  } catch (e) { return handleRouteError(e); }
}

/** POST /api/boardroom */
export async function POST(req: NextRequest) {
  try {
    const userId = await requireAuth();
    const body   = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ success: false, error: "Validation failed", issues: parsed.error.flatten().fieldErrors }, { status: 422 });

    const { workspaceSlug, productId, topic, question } = parsed.data;
    const { workspace } = await requireWorkspaceAccessBySlug(userId, workspaceSlug);

    // Run mock boardroom
    await new Promise(r => setTimeout(r, 900));
    const result = mockBoardroomSession(topic, question);

    const session = await prisma.boardroomSession.create({
      data: {
        workspaceId: workspace.id,
        productId: productId ?? null,
        topic,
        status: SessionStatus.COMPLETED,
        summary:   result.summary,
        consensus: result.consensus,
        votes:     result.votes as any,
        transcript: result.transcript as any,
      },
      include: { product: { select: { id: true, name: true } } },
    });

    return NextResponse.json({ success: true, data: session }, { status: 201 });
  } catch (e) { return handleRouteError(e); }
}
