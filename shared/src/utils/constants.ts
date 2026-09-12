/** City the app is scoped to. */
export const APP_CITY = 'Davao City';

/** Common Davao café districts/business districts for filtering. */
export const DAVAO_DISTRICTS = [
  'Poblacion District',
  'Buhangin',
  'Bajada',
  'Obrero',
  'Uyanguren',
  'Matina',
  'Juna Subdivision',
  'Ecoland',
  'Lanang',
  'Mintal',
  'Toril',
  'Calinan',
  'Buhangin',
] as const;

/** Accessibility labels for price levels. */
export const PRICE_LABELS: Record<1 | 2 | 3, string> = {
  1: '$',
  2: '$$',
  3: '$$$',
};

/** Password policy minimum length. */
export const PASSWORD_MIN_LENGTH = 8;

/** Default items per page for list endpoints. */
export const DEFAULT_PAGE_SIZE = 12;

/** Max items per page accepted by list endpoints. */
export const MAX_PAGE_SIZE = 50;

/** Allowed file extensions for image uploads. */
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

/** Max upload size in bytes (8 MB). */
export const MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024;

/** Auth token lifetime, in seconds (7 days for the long-lived cookie). */
export const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7;