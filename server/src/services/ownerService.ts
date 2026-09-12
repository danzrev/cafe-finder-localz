import { ClaimStatus } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/ApiError.js';
import { getPagination, paginate } from '../utils/pagination.js';
import { toSummary } from '../utils/serializers.js';

export const ownerService = {
  /** Cafés the current user owns/administers. */
  async mine(userId: string, opts: { page?: number; pageSize?: number } = {}) {
    const { page, pageSize, skip, take } = getPagination(opts);
    const where = { ownerId: userId };

    const [cafes, total] = await Promise.all([
      prisma.cafe.findMany({
        where,
        include: {
          images: true,
          reviews: { select: { rating: true } },
          _count: { select: { reviews: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.cafe.count({ where }),
    ]);

    return paginate(cafes.map(toSummary), total, { page, pageSize });
  },

  /** Request ownership of a café. One active claim per café+user. */
  async claim(userId: string, cafeId: string, message?: string) {
    const cafe = await prisma.cafe.findUnique({ where: { id: cafeId }, select: { id: true, status: true } });
    if (!cafe) throw ApiError.notFound('That café could not be found.');

    // Already own it? Nothing to claim.
    if ((await prisma.cafe.count({ where: { id: cafeId, ownerId: userId } })) > 0) {
      throw ApiError.conflict('You already own this café.');
    }

    const existing = await prisma.ownershipClaim.findUnique({
      where: { cafeId_userId: { cafeId, userId } },
    });
    if (existing) {
      if (existing.status === ClaimStatus.PENDING) {
        throw ApiError.conflict('You already have a pending claim for this café.');
      }
      // Re-open a previously rejected claim so owners can try again.
      return prisma.ownershipClaim.update({
        where: { id: existing.id },
        data: { status: ClaimStatus.PENDING, message: message?.trim() || null },
      });
    }

    return prisma.ownershipClaim.create({
      data: { cafeId, userId, status: ClaimStatus.PENDING, message: message?.trim() || null },
    });
  },

  async myClaims(userId: string) {
    return prisma.ownershipClaim.findMany({
      where: { userId },
      include: { cafe: { select: { id: true, name: true, slug: true } } },
      orderBy: { createdAt: 'desc' },
    });
  },
};