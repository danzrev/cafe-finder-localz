import { CafeStatus, ClaimStatus, Prisma } from '@prisma/client';
import type { AdminUpdateCafeBody } from '../validators/cafe.js';
import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/ApiError.js';
import { getPagination, paginate } from '../utils/pagination.js';
import { toSummary } from '../utils/serializers.js';

export const adminService = {
  /** Moderated count: all cafés, optionally filtered by status. */
  async listCafes(opts: { status?: string; page?: number; pageSize?: number } = {}) {
    const { page, pageSize, skip, take } = getPagination(opts);
    const where: Prisma.CafeWhereInput = opts.status
      ? { status: opts.status as CafeStatus }
      : {};

    const cafes = await prisma.cafe.findMany({
      where,
      include: {
        images: true,
        reviews: { select: { rating: true } },
        _count: { select: { reviews: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });
    return paginate(cafes.map(toSummary), cafes.length, { page, pageSize });
  },

  /** Move a café to a new moderation status. */
  async updateCafeStatus(cafeId: string, status: CafeStatus) {
    const cafe = await prisma.cafe.findUnique({ where: { id: cafeId }, select: { id: true } });
    if (!cafe) throw ApiError.notFound('That café could not be found.');
    return prisma.cafe.update({ where: { id: cafeId }, data: { status } });
  },

  /** Update the editable fields of a café (admin). */
  async updateCafe(cafeId: string, input: AdminUpdateCafeBody) {
    const cafe = await prisma.cafe.findUnique({ where: { id: cafeId }, select: { id: true } });
    if (!cafe) throw ApiError.notFound('That café could not be found.');

    // Undefined = leave unchanged; null = clear the field; value = set it.
    const data: Prisma.CafeUpdateInput = {};

    if (input.name !== undefined) data.name = input.name;
    if (input.tagline !== undefined) data.tagline = input.tagline ?? null;
    if (input.description !== undefined) data.description = input.description ?? null;
    if (input.address !== undefined) data.address = input.address ?? null;
    if (input.district !== undefined) data.district = input.district ?? null;
    if (input.city !== undefined) data.city = input.city;
    if (input.phone !== undefined) data.phone = input.phone ?? null;
    if (input.website !== undefined) data.website = input.website ?? null;
    if (input.priceLevel !== undefined) data.priceLevel = input.priceLevel;
    if (input.amenities !== undefined) data.amenities = input.amenities;
    if (input.tags !== undefined) data.tags = input.tags;
    if (input.openingHours !== undefined) data.openingHours = input.openingHours ?? Prisma.DbNull;

    return prisma.cafe.update({ where: { id: cafeId }, data });
  },

  /** All ownership claims, optionally by status. */
  async listClaims(opts: { status?: ClaimStatus; page?: number; pageSize?: number } = {}) {
    const { page, pageSize, skip, take } = getPagination(opts);
    const where: Prisma.OwnershipClaimWhereInput = opts.status ? { status: opts.status } : {};

    const [claims, total] = await Promise.all([
      prisma.ownershipClaim.findMany({
        where,
        include: {
          cafe: { select: { id: true, name: true, slug: true } },
          user: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: 'asc' },
        skip,
        take,
      }),
      prisma.ownershipClaim.count({ where }),
    ]);
    return paginate(claims, total, { page, pageSize });
  },

  /** Approve or reject an ownership claim. */
  async decideClaim(claimId: string, decision: 'APPROVED' | 'REJECTED') {
    const claim = await prisma.ownershipClaim.findUnique({ where: { id: claimId } });
    if (!claim) throw ApiError.notFound('That claim could not be found.');

    if (decision === 'APPROVED') {
      // Grant ownership and transfer the café to the claimant.
      await prisma.$transaction([
        prisma.cafe.update({ where: { id: claim.cafeId }, data: { ownerId: claim.userId } }),
        prisma.ownershipClaim.update({
          where: { id: claimId },
          data: { status: ClaimStatus.APPROVED },
        }),
      ]);
      return { ...claim, status: ClaimStatus.APPROVED };
    }

    return prisma.ownershipClaim.update({
      where: { id: claimId },
      data: { status: ClaimStatus.REJECTED },
    });
  },

  async listUsers(opts: { page?: number; pageSize?: number } = {}) {
    const { page, pageSize, skip, take } = getPagination(opts);
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          avatarUrl: true,
          role: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.user.count(),
    ]);
    return paginate(
      users.map((u) => ({ ...u, createdAt: u.createdAt.toISOString() })),
      total,
      { page, pageSize }
    );
  },
};