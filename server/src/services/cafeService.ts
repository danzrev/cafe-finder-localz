import { CafeStatus, Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import { ApiError } from '../utils/ApiError.js';
import { getPagination, paginate } from '../utils/pagination.js';
import { slugify } from '@cafefinder/shared';
import { normalizePrice, toSummary, type CafeWithRating } from '../utils/serializers.js';
import type { CreateCafeBody, CreateReviewBody } from '../validators/cafe.js';

const approvedInclude = {
  images: true,
  reviews: { select: { rating: true } },
  _count: { select: { reviews: true } },
} satisfies Prisma.CafeInclude;

export interface ListOptions {
  page?: number;
  pageSize?: number;
  q?: string;
  district?: string;
  minRating?: number;
  sort?: 'newest' | 'top' | 'name';
  adminView?: boolean;
}

export const cafeService = {
  async list(opts: ListOptions = {}) {
    const { page, pageSize, skip, take } = getPagination({ page: opts.page, pageSize: opts.pageSize });

    const where: Prisma.CafeWhereInput = {
      // Non-public statuses hidden unless an admin is inspecting the queue.
      status: opts.adminView ? undefined : CafeStatus.APPROVED,
      ...(opts.district ? { district: opts.district } : {}),
      ...(opts.q
        ? {
            OR: [
              { name: { contains: opts.q, mode: 'insensitive' } },
              { tagline: { contains: opts.q, mode: 'insensitive' } },
              { district: { contains: opts.q, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const cafes = await prisma.cafe.findMany({
      where,
      include: approvedInclude,
      orderBy:
        opts.sort === 'name'
          ? { name: 'asc' }
          : opts.sort === 'top'
            ? { reviews: { _count: 'desc' } }
            : { createdAt: 'desc' },
      skip,
      take,
    });

    // Rating-aware filtering + sorting has to happen after fetching since
    // averages are computed from related reviews.
    let rows: CafeWithRating[] = cafes as CafeWithRating[];
    const rated = rows.map((c) => ({ cafe: c, avg: averageOf(c) }));

    let filtered = opts.minRating ? rated.filter((r) => r.avg !== null && r.avg >= (opts.minRating ?? 0)) : rated;
    if (opts.sort === 'top') {
      filtered = [...filtered].sort((a, b) => (b.avg ?? 0) - (a.avg ?? 0));
    }
    rows = filtered.slice(0, take).map((r) => r.cafe);

    const total = await prisma.cafe.count({ where });
    return paginate(rows.map(toSummary), total, { page, pageSize });
  },

  async bySlug(slug: string, userId?: string) {
    const cafe = await prisma.cafe.findUnique({
      where: { slug },
      include: {
        images: true,
        reviews: { select: { rating: true } },
        _count: { select: { reviews: true } },
        owner: { select: { id: true, name: true } },
        bookmarks: userId ? { where: { userId }, select: { id: true } } : false,
      },
    });

    if (!cafe) throw ApiError.notFound('That café could not be found.');
    if (cafe.status !== CafeStatus.APPROVED) throw ApiError.notFound('That café is not available.');

    const summary = toSummary(cafe as CafeWithRating);
    return {
      ...summary,
      description: cafe.description,
      address: cafe.address,
      phone: cafe.phone,
      website: cafe.website,
      openingHours: cafe.openingHours,
      amenities: cafe.amenities,
      tags: cafe.tags,
      featured: cafe.featured,
      latitude: cafe.latitude,
      longitude: cafe.longitude,
      images: cafe.images.map((i) => ({
        id: i.id,
        url: i.url,
        alt: i.alt,
        width: i.width,
        height: i.height,
        isCover: i.isCover,
      })),
      owner: cafe.owner,
      isSaved: Boolean(cafe.bookmarks && cafe.bookmarks.length > 0),
    };
  },

  /** Create a brand-new listing, initially PENDING review. */
  async create(body: CreateCafeBody, authorId: string) {
    const baseSlug = slugify(body.name) || 'cafe';
    const existing = await prisma.cafe.findUnique({ where: { slug: baseSlug } });
    if (existing) throw ApiError.conflict('A café with that name appears to exist already.');

    const cafe = await prisma.cafe.create({
      data: {
        name: body.name.trim(),
        slug: baseSlug,
        tagline: body.tagline?.trim() || null,
        description: body.description?.trim() || null,
        address: body.address?.trim() || null,
        district: body.district?.trim() || null,
        city: body.city,
        phone: body.phone?.trim() || null,
        website: body.website?.trim() || null,
        priceLevel: normalizePrice(body.priceLevel ?? 2),
        status: CafeStatus.PENDING,
        amenities: body.amenities ?? [],
        tags: body.tags ?? [],
        openingHours: body.openingHours ?? null,
        ownerId: authorId,
        images: body.images?.length
          ? { create: body.images.map((i) => ({ url: i.url, alt: i.alt, isCover: i.isCover })) }
          : undefined,
      },
      include: { images: true, reviews: { select: { rating: true } }, _count: { select: { reviews: true } } },
    });

    return this.bySlug(cafe.slug, authorId);
  },

  async reviewsBySlug(slug: string) {
    const cafe = await prisma.cafe.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!cafe) throw ApiError.notFound('That café could not be found.');

    const reviews = await prisma.review.findMany({
      where: { cafeId: cafe.id },
      include: { author: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      body: r.body,
      author: r.author,
      createdAt: r.createdAt.toISOString(),
    }));
  },

  /** Submit a review for a café. One review per user per café. */
  async createReview(
    reviewerId: string,
    slug: string,
    input: CreateReviewBody
  ) {
    const cafe = await prisma.cafe.findUnique({ where: { slug }, select: { id: true } });
    if (!cafe) throw ApiError.notFound('That café could not be found.');

    try {
      const review = await prisma.review.create({
        data: {
          rating: input.rating,
          body: input.body?.trim() || null,
          authorId: reviewerId,
          cafeId: cafe.id,
        },
        include: { author: { select: { id: true, name: true } } },
      });
      return {
        id: review.id,
        rating: review.rating,
        body: review.body,
        author: review.author,
        createdAt: review.createdAt.toISOString(),
      };
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw ApiError.conflict('You’ve already reviewed this café.');
      }
      throw err;
    }
  },
};

function averageOf(cafe: CafeWithRating): number | null {
  const reviews = cafe.reviews ?? [];
  if (!reviews.length) return null;
  return Number((reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1));
}