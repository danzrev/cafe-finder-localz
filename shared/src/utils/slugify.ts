/**
 * Slugify a string into a URL-safe slug.
 * Example: "Blue Wonder Coffee Bar" -> "blue-wonder-coffee-bar"
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '') // strip diacritics
    .replace(/[^a-z0-9\s-]/g, '') // remove non-alphanumeric
    .replace(/[\s_-]+/g, '-') // collapse whitespace/underscores to dashes
    .replace(/^-+|-+$/g, ''); // trim leading/trailing dashes
}