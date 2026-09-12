import { api } from './client';
import { Paginated, PostDetail, PostSummary } from '@cafefinder/shared';

export const blogApi = {
  list(params: { page?: number; pageSize?: number } = {}): Promise<Paginated<PostSummary>> {
    return api.request('/blog', { query: { ...params } });
  },

  bySlug(slug: string): Promise<PostDetail> {
    return api.request(`/blog/${slug}`);
  },
};