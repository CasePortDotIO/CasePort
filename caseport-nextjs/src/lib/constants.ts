/* Site-wide constants and tiny pure helpers (ported from source). */

export const SITE_URL = "https://www.caseport.io";

/** The named reviewer entity (E-E-A-T) — legal pages. */
export const reviewer = {
  name: "Martha Kechicha",
  title: "Co-Founder & Chief Case Intelligence Officer",
  creds: "10 years law-firm operations · 1,400+ PI cases managed · PhD research credential",
  org: "CasePort",
} as const;

/** Scene-image mapping (manufactured editorial backgrounds). */
export const sceneImg: Record<string, string> = {
  "car-accident": "road",
  "truck-accident": "road",
  "rideshare-accident": "city",
  "motorcycle-accident": "road",
  "pedestrian-accident": "crosswalk",
  "wrongful-death": "memorial",
  "slip-and-fall": "premises",
  "dog-bite": "home",
  "bicycle-accident": "crosswalk",
  "drunk-driving-accident": "evidence",
  "hit-and-run": "evidence",
  "workplace-injury": "premises",
};

export function sceneFor(key: string): string {
  return `/accidents/img/${sceneImg[key] || "road"}.png`;
}

export function imgPath(name: string): string {
  return `/accidents/img/${name}.png`;
}

export function titleCase(s: string): string {
  return String(s || "")
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
