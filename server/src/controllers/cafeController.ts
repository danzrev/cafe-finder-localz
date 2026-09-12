import type { Request, Response } from 'express';
import { cafeService } from '../services/cafeService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/** Public cafés list with search/filter/sort. */
export const listCafes = asyncHandler(async (req: Request, res: Response) => {
  const { q, district, minRating, sort, page, pageSize } = req.query as Record<string, string>;
  const cafes = await cafeService.list({
    q,
    district,
    minRating: minRating ? Number(minRating) : undefined,
    sort: (sort as 'newest' | 'top' | 'name') ?? 'newest',
    page: page ? Number(page) : undefined,
    pageSize: pageSize ? Number(pageSize) : undefined,
  });
  res.json(cafes);
});

/** Single café by slug. */
export const getCafe = asyncHandler(async (req: Request, res: Response) => {
  const slug = req.params.slug;
  const cafe = await cafeService.bySlug(slug, req.user?.id);
  res.json(cafe);
});

/** Create a new café listing (auth required). */
export const createCafe = asyncHandler(async (req: Request, res: Response) => {
  const cafe = await cafeService.create(req.body, req.user!.id);
  res.status(201).json(cafe);
});

/** Reviews for a café. */
export const getCafeReviews = asyncHandler(async (req: Request, res: Response) => {
  const reviews = await cafeService.reviewsBySlug(req.params.slug);
  res.json(reviews);
});

/** Create a review (auth required). */
export const createCafeReview = asyncHandler(async (req: Request, res: Response) => {
  const review = await cafeService.createReview(req.user!.id, req.params.slug, req.body);
  res.status(201).json(review);
});