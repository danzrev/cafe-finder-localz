import { api } from './client';
import { CafeSummary, Paginated } from '@cafefinder/shared';

export const savedApi = {
  /** List cafés saved by the current user. */
  list(params: { page?: number; pageSize?: number } = {}): Promise<Paginated<CafeSummary>> {
    return api.request('/saved', { query: { ...params } });
  },

  /** Toggle the saved state for a café; returns the new state. */
  toggle(cafeId: string): Promise<{ saved: boolean }> {
    return api.request(`/saved/${cafeId}`, { method: 'PUT' });
  },

  /** True if the current user has saved the café. */
  status(cafeId: string): Promise<{ saved: boolean }> {
    return api.request(`/saved/${cafeId}/status`);
  },
};