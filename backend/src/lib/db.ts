/** Shared database helpers */

export function paginationArgs({ page, limit }: { page: number; limit: number }) {
  return { skip: (page - 1) * limit, take: limit };
}

export function paginationMeta(total: number, { page, limit }: { page: number; limit: number }) {
  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    hasMore: page * limit < total,
  };
}
