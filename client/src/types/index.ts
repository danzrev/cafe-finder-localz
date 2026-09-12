import { CafeSummary, OpeningHours } from '@cafefinder/shared';

/** Re-export the shared types so feature code imports from a single place. */
export * from '@cafefinder/shared';

/** Shape of a form submission for a new café. */
export interface SubmitFormValues {
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
  amenities: string[];
  tags: string[];
  images: Array<{ url: string; alt?: string; isCover?: boolean }>;
}

/** Filter state for the Explore page. */
export interface ExploreFilters {
  q?: string;
  district?: string;
  minRating?: number;
  sort: 'newest' | 'top' | 'name';
}

/** Café card click handler payload. */
export interface CafeCardProps extends CafeSummary {
  rank?: number;
  onSelect?: (slug: string) => void;
}