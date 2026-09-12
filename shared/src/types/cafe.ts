import {
  CafeStatus,
  ClaimStatus,
  OpenStatus,
  UserRole,
} from '../enums';

/** A café as it appears on the browse / discover screens. */
export interface CafeSummary {
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
  openStatus: OpenStatus;
  status: CafeStatus;
  createdAt: string;
}

/** Fully detailed café (individual café page). */
export interface CafeDetail extends CafeSummary {
  description: string | null;
  address: string | null;
  phone: string | null;
  website: string | null;
  openingHours: OpeningHours | null;
  amenities: string[];
  tags: string[];
  featured: boolean;
  latitude: number | null;
  longitude: number | null;
  images: CachedImage[];
  owner: { id: string; name: string | null } | null;
  isSaved: boolean;
}

/** Per-day opening hours; null means closed that day. */
export interface DayHours {
  open: string; // "08:00"
  close: string; // "22:00"
}

export interface OpeningHours {
  monday: DayHours | null;
  tuesday: DayHours | null;
  wednesday: DayHours | null;
  thursday: DayHours | null;
  friday: DayHours | null;
  saturday: DayHours | null;
  sunday: DayHours | null;
}

/** An image stored in the external storage provider. */
export interface CachedImage {
  id: string;
  url: string;
  alt: string | null;
  width: number | null;
  height: number | null;
  isCover: boolean;
}

/** A single review/rating left by a user. */
export interface Review {
  id: string;
  rating: number;
  body: string | null;
  author: { id: string; name: string | null };
  createdAt: string;
}

/** Pagination envelope returned by list endpoints. */
export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/** DTO for submitting a new café (used by the /submit form). */
export interface CreateCafeInput {
  name: string;
  tagline?: string;
  description?: string;
  address?: string;
  district?: string;
  city: string;
  phone?: string;
  website?: string;
  priceLevel: 1 | 2 | 3;
  openingHours?: OpeningHours;
  amenities?: string[];
  tags?: string[];
}

/** DTO for an ownership claim. */
export interface OwnershipClaim {
  id: string;
  cafeId: string;
  userId: string;
  status: ClaimStatus;
  message: string | null;
  createdAt: string;
}

/** Minimal profile info useful across the app. */
export interface Profile {
  id: string;
  name: string | null;
  email: string;
  avatarUrl: string | null;
  role: UserRole;
}