import { z } from 'zod';
import { CafeStatus } from '@prisma/client';

const priceLevel = z.union([z.literal(1), z.literal(2), z.literal(3)]).default(2);

/** 24h "HH:MM" time string, e.g. "09:00". */
const time24 = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Use 24-hour time like "09:00".');

/** A single day's hours; null/absent means closed that day. */
export const dayHoursSchema = z
  .object({
    open: time24,
    close: time24,
  })
  .nullish();

/** Per-day opening hours; a null day means closed. */
export const openingHoursSchema = z.object({
  monday: dayHoursSchema,
  tuesday: dayHoursSchema,
  wednesday: dayHoursSchema,
  thursday: dayHoursSchema,
  friday: dayHoursSchema,
  saturday: dayHoursSchema,
  sunday: dayHoursSchema,
});

export const createCafeSchema = z.object({
  name: z.string().trim().min(2, 'Give the café a name of at least 2 characters.').max(80),
  tagline: z.string().trim().max(120).optional(),
  description: z.string().trim().max(2000).optional(),
  address: z.string().trim().max(200).optional(),
  district: z.string().trim().max(80).optional(),
  city: z.string().trim().max(80).default('Davao City'),
  phone: z.string().trim().max(30).optional(),
  website: z.string().trim().url('Enter a valid URL.').max(200).optional().or(z.literal('')),
  priceLevel,
  openingHours: openingHoursSchema.optional(),
  amenities: z.array(z.string().trim().max(40)).max(20).default([]),
  tags: z.array(z.string().trim().max(40)).max(20).default([]),
  images: z
    .array(
      z.object({
        url: z.string().url(),
        alt: z.string().max(200).optional(),
        isCover: z.boolean().optional(),
      })
    )
    .max(12)
    .optional(),
});

export const updateCafeSchema = createCafeSchema.partial();

export const cafeStatusSchema = z.object({
  status: z.enum([CafeStatus.APPROVED, CafeStatus.REJECTED, CafeStatus.PENDING, CafeStatus.CLOSED]),
});

/** Query filters for the public cafés list. */
export const listCafesQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().max(50).optional(),
  q: z.string().trim().max(120).optional(),
  district: z.string().trim().max(80).optional(),
  minRating: z.coerce.number().min(1).max(5).optional(),
  sort: z.enum(['newest', 'top', 'name']).optional(),
});

export const slugParamSchema = z.object({
  slug: z.string().trim().min(1),
});

/**
 * Editable fields an admin may update on an existing café. Deliberately omits
 * images/owner/status — those are managed by dedicated endpoints.
 */
export const adminUpdateCafeSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  tagline: z.string().trim().max(120).nullish(),
  description: z.string().trim().max(2000).nullish(),
  address: z.string().trim().max(200).nullish(),
  district: z.string().trim().max(80).nullish(),
  city: z.string().trim().max(80).optional(),
  phone: z.string().trim().max(30).nullish(),
  website: z.string().trim().url().max(200).nullish().or(z.literal('')),
  priceLevel: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
  amenities: z.array(z.string().trim().max(40)).max(20).optional(),
  tags: z.array(z.string().trim().max(40)).max(20).optional(),
  openingHours: openingHoursSchema.nullish(),
});

export type AdminUpdateCafeBody = z.infer<typeof adminUpdateCafeSchema>;

/** Body for creating a review of a café. */
export const createReviewSchema = z.object({
  rating: z.coerce.number().int().min(1, 'Pick a rating between 1 and 5.').max(5),
  body: z.string().trim().max(1000).optional(),
});

export type CreateReviewBody = z.infer<typeof createReviewSchema>;

export type CreateCafeBody = z.infer<typeof createCafeSchema>;
export type UpdateCafeBody = z.infer<typeof updateCafeSchema>;