import { stateData, slugToAbbr, type StateData } from "@/data";

/** Canonical hyphenated state slug from a 2-letter abbr (e.g. "CA" → "california"). */
export function stateSlug(abbr: string): string {
  return stateData[abbr].name.toLowerCase().replace(/[^a-z]+/g, "-");
}

export interface ResolvedState {
  abbr: string;
  data: StateData;
  slug: string;
  cityKey: string;
}

/** Resolve a state segment (abbr or full hyphenated name). Mirrors `CP.resolveState()`. */
export function resolveState(seg: string): ResolvedState | null {
  const abbr = slugToAbbr(seg);
  if (!abbr) return null;
  return {
    abbr,
    data: stateData[abbr],
    slug: stateSlug(abbr),
    cityKey: abbr.toLowerCase(),
  };
}
