import { prisma } from "@/lib/prisma";
import { WorkspaceRole } from "@prisma/client";

/**
 * Generates a URL-safe slug from any string.
 * Ensures uniqueness by appending a short random suffix if needed.
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 48);
}

async function uniqueSlug(base: string): Promise<string> {
  const candidate = slugify(base) || "workspace";
  const existing = await prisma.workspace.findUnique({
    where: { slug: candidate },
    select: { id: true },
  });
  if (!existing) return candidate;
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${candidate}-${suffix}`;
}

/**
 * Called on first sign-in for a brand-new user.
 * Creates a default Workspace and assigns the OWNER role.
 * Idempotent — safe to call multiple times; skips if workspace already exists.
 */
export async function provisionNewUser(
  userId: string,
  displayName: string
): Promise<void> {
  const existingMembership = await prisma.workspaceMember.findFirst({
    where: { userId },
  });
  if (existingMembership) return;

  const slug = await uniqueSlug(displayName.split("@")[0] ?? displayName);

  await prisma.$transaction(async (tx) => {
    const workspace = await tx.workspace.create({
      data: {
        name: `${displayName.split(" ")[0]}'s Workspace`,
        slug,
      },
    });

    await tx.workspaceMember.create({
      data: {
        userId,
        workspaceId: workspace.id,
        role: WorkspaceRole.OWNER,
      },
    });
  });
}

/**
 * Creates a new workspace for an existing user and assigns them OWNER.
 */
export async function createWorkspace(
  userId: string,
  name: string,
  description?: string
) {
  const slug = await uniqueSlug(name);

  return prisma.$transaction(async (tx) => {
    const workspace = await tx.workspace.create({
      data: { name: name.trim(), slug },
    });

    const membership = await tx.workspaceMember.create({
      data: {
        userId,
        workspaceId: workspace.id,
        role: WorkspaceRole.OWNER,
      },
    });

    return { workspace, membership };
  });
}
