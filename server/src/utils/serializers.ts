import type { Prisma } from '@prisma/client';
import { AuthUser, CafeSummary, OpenStatus } from '@cafefinder/shared';

type UserRow = {
  id: string;
  email: string;
  passwordHash?: string;
  name: string | null;
  avatarUrl: string | null;
  role: 'USER' | 'OWNER' | 'ADMIN';
  createdAt: Date | string;
};

/** Strip the password hash and shape a user into the public DTO. */
export function serializeUser(user: UserRow): AuthUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
    role: user.role,
    createdAt: new Date(user.createdAt).toISOString(),
  };
}

/** A Prisma Café row preloaded with review count/avg for a list row. */
export type CafeWithRating = Prisma.CafeGetPayload<{
  include: { images: true };
}> & {
  _count?: { reviews: number };
  reviews?: Array<{ rating: number }>;
  isSaved?: boolean;
};

/** Pick the cover image from a café's images array. */
export function coverOf(cafe: CafeWithRating): string | null {
  if (!cafe.images || cafe.images.length === 0) return null;
  return cafe.images.find((i) => i.isCover)?.url ?? cafe.images[0]?.url ?? null;
}

/**
 * Whether a café is currently open, based on its stored openingHours and the
 * current time in Davao (Asia/Manila, UTC+8). Returns UNKNOWN when there is no
 * hour data to reason about.
 */
export function openStatusOf(cafe: CafeWithRating): OpenStatus {
  const raw = cafe.openingHours;
  if (!raw || typeof raw !== 'object') return 'UNKNOWN';

  const hours = raw as {
    [day: string]: { open?: string; close?: string } | null | undefined;
  };

  // Asia/Manila is fixed at UTC+8 (no DST) — derive the local weekday/hour directly.
  const local = new Date(Date.now() + 8 * 60 * 60_000);
  const dayKey = DAY_KEYS[local.getUTCDay()];
  const today = hours[dayKey];

  if (!today?.open || !today?.close) return 'CLOSED';

  const nowMin = local.getUTCHours() * 60 + local.getUTCMinutes();
  const [oh, om] = today.open.split(':').map(Number);
  const [ch, cm] = today.close.split(':').map(Number);
  const openMin = oh * 60 + om;
  const closeMin = ch * 60 + cm;

  // Support an overnight shift (e.g. open 17:00 → close 02:00).
  if (closeMin < openMin) {
    return nowMin >= openMin || nowMin < closeMin ? 'OPEN' : 'CLOSED';
  }
  return nowMin >= openMin && nowMin < closeMin ? 'OPEN' : 'CLOSED';
}

const DAY_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

/** Shape a full café row (with reviews preloaded) into a list summary DTO. */
export function toSummary(cafe: CafeWithRating): CafeSummary {
  const reviews = cafe.reviews ?? [];
  const total = reviews.length;
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  const avg = total ? sum / total : null;

  return {
    id: cafe.id,
    name: cafe.name,
    slug: cafe.slug,
    tagline: cafe.tagline,
    coverImageUrl: coverOf(cafe),
    district: cafe.district,
    city: cafe.city,
    averageRating: avg ? Number(avg.toFixed(1)) : null,
    reviewCount: cafe._count?.reviews ?? total,
    priceLevel: normalizePrice(cafe.priceLevel),
    openStatus: openStatusOf(cafe),
    status: cafe.status,
    createdAt: cafe.createdAt.toISOString(),
  };
}

/** Clamp price level to the allowed 1|2|3 range. */
export function normalizePrice(value: number): 1 | 2 | 3 {
  if (value <= 1) return 1;
  if (value >= 3) return 3;
  return 2;
}