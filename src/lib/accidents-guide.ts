import { guideSceneImg } from "@/data";
import { sceneImg } from "./accidents-constants";

/** Guide hero scene image. Mirrors source `CP.guideScene()`. */
export function guideScene(slug: string): string {
  if (guideSceneImg[slug]) return `/accidents/img/${guideSceneImg[slug]}.png`;
  if (sceneImg[slug]) return `/accidents/img/${sceneImg[slug]}.png`;
  return "/accidents/img/road.png";
}

/** Education-framed lead for accident guide pillars (distinct from /accidents claim angle). */
export function guidePillarLead(name: string): string {
  const lc = name.toLowerCase();
  return `This is the national starting point for understanding a ${lc} — what it involves, who is typically responsible, and how a claim works from the first hour through settlement. Use it to get oriented, then go deeper: the guides below answer the four questions people ask most, your state's specific rules live in the Accidents hub, and the medical side lives in the Injuries hub. No jargon, no pressure — just the lay of the land before you decide anything.`;
}
