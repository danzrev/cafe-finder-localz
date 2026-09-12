import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from '@cafefinder/shared';

export interface PageParams {
  page: number;
  pageSize: number;
  skip: number;
  take: number;
}

/** Parse and clamp pagination params from a request query. */
export function getPagination(query: {
  page?: unknown;
  pageSize?: unknown;
}): PageParams {
  const rawPage = Number(query.page);
  const rawSize = Number(query.pageSize);

  const page = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;
  const pageSize =
    Number.isFinite(rawSize) && rawSize > 0
      ? Math.min(Math.floor(rawSize), MAX_PAGE_SIZE)
      : DEFAULT_PAGE_SIZE;

  return { page, pageSize, skip: (page - 1) * pageSize, take: pageSize };
}

/** Build a stable pagination envelope from a list + total. */
export function paginate<T>(
  items: T[],
  total: number,
  { page, pageSize }: { page: number; pageSize: number }
): { items: T[]; total: number; page: number; pageSize: number; hasMore: boolean } {
  return {
    items,
    total,
    page,
    pageSize,
    hasMore: page * pageSize < total,
  };
}