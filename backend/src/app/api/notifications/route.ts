import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth, handleRouteError } from "@/lib/auth";
import { paginationArgs, paginationMeta } from "@/lib/db";

const markReadSchema = z.object({
  notificationIds: z.array(z.string().uuid()).min(1),
});

/** GET /api/notifications?unreadOnly=true&page=1&limit=20 */
export async function GET(req: NextRequest) {
  try {
    const userId = await requireAuth();
    const { searchParams } = req.nextUrl;

    const unreadOnly = searchParams.get("unreadOnly") === "true";
    const pagination = paginationArgs({
      page: Number(searchParams.get("page") ?? 1),
      limit: Number(searchParams.get("limit") ?? 30),
    });

    const where = {
      userId,
      deletedAt: null,
      ...(unreadOnly ? { read: false } : {}),
    };

    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({ where, ...pagination, orderBy: { createdAt: "desc" } }),
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { userId, read: false, deletedAt: null } }),
    ]);

    return NextResponse.json({
      success: true,
      data: notifications,
      unreadCount,
      pagination: paginationMeta(total, pagination),
    });
  } catch (error) {
    return handleRouteError(error);
  }
}

/** POST /api/notifications/read — mark notifications as read */
export async function POST(req: NextRequest) {
  try {
    const userId = await requireAuth();

    const body = await req.json();
    const { action } = body;

    if (action === "markAllRead") {
      await prisma.notification.updateMany({
        where: { userId, read: false, deletedAt: null },
        data: { read: true, readAt: new Date() },
      });
      return NextResponse.json({ success: true, message: "All notifications marked as read" });
    }

    const parsed = markReadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "Provide notificationIds array or action: markAllRead" },
        { status: 422 }
      );
    }

    await prisma.notification.updateMany({
      where: { id: { in: parsed.data.notificationIds }, userId, deletedAt: null },
      data: { read: true, readAt: new Date() },
    });

    return NextResponse.json({ success: true, message: "Notifications marked as read" });
  } catch (error) {
    return handleRouteError(error);
  }
}

/** DELETE /api/notifications?notificationId=xxx — soft delete */
export async function DELETE(req: NextRequest) {
  try {
    const userId = await requireAuth();

    const notificationId = req.nextUrl.searchParams.get("notificationId");
    if (!notificationId) {
      return NextResponse.json({ success: false, error: "notificationId required" }, { status: 400 });
    }

    await prisma.notification.update({
      where: { id: notificationId, userId },
      data: { deletedAt: new Date() },
    });

    return NextResponse.json({ success: true, message: "Notification deleted" });
  } catch (error) {
    return handleRouteError(error);
  }
}
