import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import {
  accidentTypeOrder,
  quickAnswerOrder,
  stateData,
  stateLawTopics,
  cityData,
  cityAccidentTypes,
  injuryOrder,
  injurySpokes,
  guidePillars,
  guideSpokePillars,
  guideSpokeDefs,
} from "@/data";
import { stateSlug } from "@/lib/state";

const CITY_SPECIALS = ["what-to-do-after", "police-report", "dangerous-roads"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const urls: string[] = [];
  const add = (p: string) => urls.push(p);

  // hubs + top-level
  ["/accidents", "/injuries", "/guide", "/checkmycase"].forEach(add);

  // accidents
  accidentTypeOrder.forEach((k) => add(`/accidents/${k}`));
  quickAnswerOrder.forEach((id) => add(`/accidents/${id}`));
  add("/accidents/resources");
  Object.keys(stateData).forEach((abbr) => {
    const s = stateSlug(abbr);
    add(`/accidents/${s}`);
    stateLawTopics.forEach((t) => add(`/accidents/${s}/${t.slug}`));
    add(`/data/${s}-car-accident-statistics`);
  });
  Object.keys(cityData).forEach((ck) => {
    cityData[ck].cities.forEach((c) => {
      add(`/accidents/${ck}/${c.slug}`);
      cityAccidentTypes.forEach((at) => add(`/accidents/${ck}/${c.slug}/${at.slug}`));
      CITY_SPECIALS.forEach((sp) => add(`/accidents/${ck}/${c.slug}/${sp}`));
    });
  });

  // injuries
  injuryOrder.forEach((slug) => {
    add(`/injuries/${slug}`);
    injurySpokes.forEach((sp) => add(`/injuries/${slug}/${sp.slug}`));
  });
  add("/injuries/delayed-symptoms-after-car-accident");
  add("/injuries/when-to-see-doctor-after-accident");

  // guide
  guidePillars.forEach((p) => {
    if (p.slug === "faq") return;
    add(`/guide/${p.slug}`);
  });
  add("/guide/faq");
  add("/guide/glossary");
  guideSpokePillars.forEach((slug) => {
    guideSpokeDefs.forEach((sp) => add(`/guide/${slug}/${sp.slug}`));
  });

  const seen = new Set<string>();
  return urls
    .filter((u) => (seen.has(u) ? false : (seen.add(u), true)))
    .map((path) => ({
      url: SITE_URL + path,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: path === "/accidents" ? 1 : 0.7,
    }));
}
