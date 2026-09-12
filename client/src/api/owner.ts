import { api } from './client';
import { CafeSummary, OwnershipClaim, Paginated } from '@cafefinder/shared';

export const ownerApi = {
  /** List cafés owned by / managed by the current user. */
  mine(params: { page?: number; pageSize?: number } = {}): Promise<Paginated<CafeSummary>> {
    return api.request('/owner/cafes', { query: { ...params } });
  },

  /** Submit an ownership claim request for a café. */
  claim(cafeId: string, message?: string): Promise<OwnershipClaim> {
    return api.request('/owner/claims', { method: 'POST', body: { cafeId, message } });
  },

  /** List the current user's ownership claims. */
  myClaims(): Promise<OwnershipClaim[]> {
    return api.request('/owner/claims');
  },
};