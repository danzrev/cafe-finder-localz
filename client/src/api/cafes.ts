import { api } from './client';
import {
  CafeDetail,
  CafeSummary,
  CreateCafeInput,
  Paginated,
  Review,
} from '@cafefinder/shared';

export interface ListCafesParams {
  page?: number;
  pageSize?: number;
  q?: string;
  district?: string;
  minRating?: number;
  sort?: 'newest' | 'top' | 'name';
}

export const cafesApi = {
  list(params: ListCafesParams = {}): Promise<Paginated<CafeSummary>> {
    return api.request('/cafes', { query: { ...params } });
  },

  bySlug(slug: string): Promise<CafeDetail> {
    return api.request(`/cafes/${slug}`);
  },

  create(input: CreateCafeInput): Promise<CafeDetail> {
    return api.request('/cafes', { method: 'POST', body: input });
  },

  reviews(slug: string): Promise<Review[]> {
    return api.request(`/cafes/${slug}/reviews`);
  },

  createReview(slug: string, input: { rating: number; body?: string }): Promise<Review> {
    return api.request(`/cafes/${slug}/reviews`, { method: 'POST', body: input });
  },
};