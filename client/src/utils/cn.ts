/** Join class names, filtering falsy values. Tiny `clsx` alternative. */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}