import { UserRole, CafeStatus } from '../enums';

/** Authenticated user as exposed to the rest of the app (never includes password hash). */
export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

/** Payload embedded inside the JWT / identification token. */
export interface AuthJwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}

/** Response returned after login/registration. */
export interface AuthResponse {
  user: UserProfile;
  token: string;
  expiresAt: string;
}

/** Minimal café object used in lists (explore grid, search results). */
export interface CafeListItem {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  coverImageUrl: string | null;
  district: string | null;
  city: string;
  averageRating: number | null;
  reviewCount: number;
  priceLevel: 1 | 2 | 3;
  status: CafeStatus;
  createdAt: string;
}