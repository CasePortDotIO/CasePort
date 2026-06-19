/* Helpers for the article stack: section normalization, reading time. */

export interface ArticleSection {
  id: string;
  title: string;
  paras: string[];
}

/** Stable heading id, matching the source's `enhanceArticle` slug scheme. */
export function sectionId(title: string, i: number): string {
  return (
    "sec-" +
    (i + 1) +
    "-" +
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 36)
  );
}

/** Normalize raw data sections (content as string or string[]) into the stack shape. */
export function toSections(
  raw: { title: string; content: string | string[] }[]
): ArticleSection[] {
  return raw.map((s, i) => ({
    id: sectionId(s.title, i),
    title: s.title,
    paras: Array.isArray(s.content) ? s.content : [s.content],
  }));
}

/** Bold label of a fact split on a dash (accident-type capsule facts). */
export function dashLabel(f: string): string {
  const p = f.split(/[—–-]/);
  return (p[0] || f).trim().replace(/[.:]$/, "");
}

/** Bold label of a fact split on a colon (quick-answer capsule facts). */
export function colonLabel(f: string): string {
  const p = f.split(":");
  return (p[0] || f).trim();
}

/** Reading time in minutes (words ÷ ~210, floored at 2) — mirrors the source. */
export function readingMinutes(...texts: (string | string[] | undefined)[]): number {
  let words = 0;
  for (const t of texts) {
    if (!t) continue;
    const arr = Array.isArray(t) ? t : [t];
    for (const s of arr) words += String(s).trim().split(/\s+/).filter(Boolean).length;
  }
  return Math.max(2, Math.round(words / 210));
}
