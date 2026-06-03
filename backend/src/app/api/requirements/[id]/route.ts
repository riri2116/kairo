import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAuth, requireWorkspaceAccess, handleRouteError, AuthError } from "@/lib/auth";
import { RequirementType, RequirementStatus, Priority } from "@prisma/client";

const updateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(5000).optional(),
  type: z.nativeEnum(RequirementType).optional(),
  priority: z.nativeEnum(Priority).optional(),
  status: z.nativeEnum(RequirementStatus).optional(),
  acceptanceCriteria: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

async function resolve(id: string, userId: string) {
  const item = await prisma.productRequirement.findUnique({
    where: { id, deletedAt: null },
    include: { product: { select: { id: true, name: true } } },
  });
  if (!item) throw new AuthError("Not Found", 404);
  await requireWorkspaceAccess(userId, item.workspaceId);
  return item;
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await requireAuth();
    return NextResponse.json({ success: true, data: await resolve(params.id, userId) });
  } catch (e) { return handleRouteError(e); }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await requireAuth();
    await resolve(params.id, userId);
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ success: false, error: "Validation failed" }, { status: 422 });

    const updated = await prisma.productRequirement.update({
      where: { id: params.id },
      data: parsed.data,
      include: { product: { select: { id: true, name: true } } },
    });
    return NextResponse.json({ success: true, data: updated });
  } catch (e) { return handleRouteError(e); }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = await requireAuth();
    await resolve(params.id, userId);
    await prisma.productRequirement.update({ where: { id: params.id }, data: { deletedAt: new Date() } });
    return NextResponse.json({ success: true, message: "Requirement deleted" });
  } catch (e) { return handleRouteError(e); }
}
