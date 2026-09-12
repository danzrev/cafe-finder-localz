import { api } from './client';
import { CafeDetail, ClaimStatus, OwnershipClaim, Paginated, UserProfile } from '@cafefinder/shared';

/** Status a café can be moved to by an admin. */
export type AdminCafeStatus = 'APPROVED' | 'REJECTED' | 'PENDING' | 'CLOSED';

export const adminApi = {
  /** List cafés for moderation, with an optional status filter. */
  listCafes(params: {
    status?: string;
    page?: number;
    pageSize?: number;
  } = {}): Promise<Paginated<CafeDetail>> {
    return api.request('/admin/cafes', { query: { ...params } });
  },

  /** Update a café's moderation status. */
  updateCafeStatus(cafeId: string, status: AdminCafeStatus): Promise<CafeDetail> {
    return api.request(`/admin/cafes/${cafeId}/status`, { method: 'PATCH', body: { status } });
  },

  /** Edit a café's editable fields (name, hours, photos, etc.). */
  updateCafe(cafeId: string, body: Record<string, unknown>): Promise<CafeDetail> {
    return api.request(`/admin/cafes/${cafeId}`, { method: 'PATCH', body });
  },

  /** Review pending ownership claims. */
  listClaims(params: { status?: ClaimStatus; page?: number; pageSize?: number } = {}): Promise<
    Paginated<OwnershipClaim>
  > {
    return api.request('/admin/claims', { query: { ...params } });
  },

  /** Approve or reject a claim. */
  decideClaim(
    claimId: string,
    decision: 'APPROVED' | 'REJECTED'
  ): Promise<OwnershipClaim> {
    return api.request(`/admin/claims/${claimId}`, { method: 'PATCH', body: { decision } });
  },

  /** List all users (admin). */
  listUsers(params: { page?: number; pageSize?: number } = {}): Promise<Paginated<UserProfile>> {
    return api.request('/admin/users', { query: { ...params } });
  },
};