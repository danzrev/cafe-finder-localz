/** Small formatting helpers for dates, prices, and star ratings. */

/** Human-friendly date, e.g. "Nov 4, 2025". */
export function formatDate(value: string | Date, opts?: Intl.DateTimeFormatOptions): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en-PH', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...opts,
  }).format(date);
}

/** Relative time like "3 days ago". */
export function timeAgo(value: string | Date): string {
  const date = typeof value === 'string' ? new Date(value) : value;
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const units: Array<[number, string]> = [
    [60, 'second'],
    [60, 'minute'],
    [24, 'hour'],
    [7, 'day'],
    [4.345, 'week'],
    [12, 'month'],
    [Infinity, 'year'],
  ];
  let divisor = 1;
  let unit = 'year';
  for (const [d, u] of units) {
    unit = u;
    if (seconds < d) break;
    divisor = d;
  }
  const count = Math.max(1, Math.floor(seconds / divisor));
  return `${count} ${unit}${count === 1 ? '' : 's'} ago`;
}

/** Map a numeric rating to full/empty star proportions (0–5). */
export function ratingToStars(rating: number): { full: number; half: boolean; empty: number } {
  const rounded = Math.min(5, Math.max(0, rating));
  const full = Math.floor(rounded);
  const half = rounded - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return { full, half, empty };
}

/** Price level to labeled string. */
export function priceLabel(level: 1 | 2 | 3): string {
  return '$'.repeat(level);
}

/** Truncate a string at word boundaries. */
export function truncate(text: string, max = 140): string {
  if (text.length <= max) return text;
  return `${text.slice(0, text.lastIndexOf(' ', max))}…`;
}