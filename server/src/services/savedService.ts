import { prisma } from '../config/prisma.js';
import { getPagination, paginate } from '../utils/pagination.js';
import { ApiError } from '../utils/ApiError.js';
import { toSummary } from '../utils/serializers.js';
import { CafeStatus } from '@prisma/client';

/** The current user's saved cafés. */
export const savedService = {
  async list(userId: string, opts: { page?: number; pageSize?: number } = {}) {
    const { page, pageSize, skip, take } = getPagination(opts);

    const where = { userId, cafe: { status: CafeStatus.APPROVED } };
    const [bookmarks, total] = await Promise.all([
      prisma.bookmark.findMany({
        where,
        include: {
          cafe: {
            include: {
              images: true,
              reviews: { select: { rating: true } },
              _count: { select: { reviews: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.bookmark.count({ where }),
    ]);

    return paginate(
      bookmarks.map((b) => toSummary(b.cafe)),
      total,
      { page, pageSize }
    );
  },

  /** Add the café to the user's saved list; never double-saves. */
  async save(userId: string, cafeId: string) {
    await ensureCafeExists(cafeId);
    await prisma.bookmark.upsert({
      where: { userId_cafeId: { userId, cafeId } },
      update: {},
      create: { userId, cafeId },
    });
    return { saved: true };
  },

  /** Remove a café from the user's saved list. */
  async unsave(userId: string, cafeId: string) {
    await prisma.bookmark.deleteMany({ where: { userId, cafeId } });
    return { saved: false };
  },

  async status(userId: string, cafeId: string) {
    const existing = await prisma.bookmark.findUnique({
      where: { userId_cafeId: { userId, cafeId } },
      select: { id: true },
    });
    return { saved: Boolean(existing) };
  },
};

async function ensureCafeExists(cafeId: string) {
  const cafe = await prisma.cafe.findUnique({ where: { id: cafeId }, select: { id: true } });
  if (!cafe) throw ApiError.notFound('That café could not be found.');
}