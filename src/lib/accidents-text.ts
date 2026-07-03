/** Lowercase the first character (keeps the rest), for inlining sentences. */
export function lcFirst(s: string): string {
  return s.charAt(0).toLowerCase() + s.slice(1);
}
