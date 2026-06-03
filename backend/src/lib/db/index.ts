export { default as prisma } from "../prisma";
export * from "@prisma/client";

// ─── Soft-delete helpers ──────────────────────────────────────────────────────

/** Where clause that filters out soft-deleted rows */
export const notDeleted = { deletedAt: null } as const;

/** Soft-delete a record by setting deletedAt to now */
export function softDeleteInput() {
  return { deletedAt: new Date() };
}

// ─── Pagination helpers ───────────────────────────────────────────────────────

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export function paginationArgs(params: PaginationParams = {}) {
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.min(100, Math.max(1, params.limit ?? 20));
  return {
    skip: (page - 1) * limit,
    take: limit,
  };
}

export function paginationMeta(total: number, params: PaginationParams = {}) {
  const page = Math.max(1, params.page ?? 1);
  const limit = Math.min(100, Math.max(1, params.limit ?? 20));
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    hasNextPage: page * limit < total,
    hasPrevPage: page > 1,
  };
}

// ─── Workspace tenant guard ───────────────────────────────────────────────────

/**
 * Returns a Prisma where clause that scopes a query to a specific workspace.
 * Use this on any model that has a workspaceId field.
 */
export function tenantScope(workspaceId: string) {
  return { workspaceId, deletedAt: null } as const;
}
