/**
 * Service layer.
 *
 * The transport layer lives in `/api`; these thin service modules re-export the
 * domain-specific clients so feature code can import from a stable, single place
 * (`@/services/api`). As the app grows, this seam is where side effects like
 * caching, retries, and request deduplication get added.
 */
export { authApi } from '@/api/auth';
export { cafesApi } from '@/api/cafes';
export { blogApi } from '@/api/blog';
export { savedApi } from '@/api/saved';
export { ownerApi } from '@/api/owner';
export { adminApi } from '@/api/admin';
export { api, ApiError, API_BASE_URL } from '@/api/client';

/** Convenience object grouping every service for default imports. */
import { authApi } from '@/api/auth';
import { cafesApi } from '@/api/cafes';
import { blogApi } from '@/api/blog';
import { savedApi } from '@/api/saved';
import { ownerApi } from '@/api/owner';
import { adminApi } from '@/api/admin';

export const apiService = {
  auth: authApi,
  cafes: cafesApi,
  blog: blogApi,
  saved: savedApi,
  owner: ownerApi,
  admin: adminApi,
};

export default apiService;