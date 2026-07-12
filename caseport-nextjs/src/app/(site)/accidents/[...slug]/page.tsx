import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  accidentTypes,
  accidentTypeOrder,
  quickAnswers,
  quickAnswerOrder,
  qaAlias,
  stateData,
  stateLawTopics,
  cityData,
  cityAccidentTypes,
  type City,
} from "@/data";
import { resolveState, stateSlug, type ResolvedState } from "@/lib/state";
import { AccidentTypePage, accidentTypeMeta } from "@/components/pages/AccidentTypePage";
import { QuickAnswerPage, quickAnswerMeta } from "@/components/pages/QuickAnswerPage";
import { ResourcesPage, resourcesMeta } from "@/components/pages/ResourcesPage";
import { StateLandingPage, stateLandingMeta } from "@/components/pages/StateLandingPage";
import { StateTopicPage, stateTopicMeta } from "@/components/pages/StateTopicPage";
import { CityPage, cityMeta } from "@/components/pages/CityPage";
import { CityResourcePage, cityResourceMeta, CITY_SPECIALS } from "@/components/pages/CityResourcePage";

function findCity(r: ResolvedState, citySlug: string): City | null {
  const sd = cityData[r.cityKey];
  if (!sd) return null;
  return sd.cities.find((c) => c.slug === citySlug) ?? null;
}

// Canonical full-name forms are pre-rendered; abbr forms (/accidents/ca) and
// other valid slugs resolve on demand. Invalid slugs → notFound().
export const dynamicParams = true;

type Resolved =
  | { kind: "resources" }
  | { kind: "quick"; slug: string }
  | { kind: "type"; slug: string }
  | { kind: "state"; r: ResolvedState }
  | { kind: "stateTopic"; r: ResolvedState; topic: string }
  | { kind: "city"; r: ResolvedState; city: City; typeSlug?: string }
  | { kind: "cityResource"; r: ResolvedState; city: City; special: string };

const isTopic = (slug: string) => stateLawTopics.some((t) => t.slug === slug);

/** Resolve an /accidents/* path. Mirrors router.js disambiguation:
 *  depth-2: resources → quick-answer → type → state | city;
 *  depth-3: topic-slug → else city;
 *  depth-4: city-special → else city-type. */
function resolve(slug: string[]): Resolved | null {
  if (slug.length === 1) {
    const a = slug[0];
    if (a === "resources") return { kind: "resources" };
    if (quickAnswers[a] || qaAlias[a]) return { kind: "quick", slug: a };
    if (accidentTypes[a]) return { kind: "type", slug: a };
    const r = resolveState(a);
    if (r) return { kind: "state", r };
  } else if (slug.length === 2) {
    const r = resolveState(slug[0]);
    if (!r) return null;
    if (isTopic(slug[1])) return { kind: "stateTopic", r, topic: slug[1] };
    const city = findCity(r, slug[1]);
    if (city) return { kind: "city", r, city };
  } else if (slug.length === 3) {
    const r = resolveState(slug[0]);
    if (!r) return null;
    const city = findCity(r, slug[1]);
    if (!city) return null;
    if (CITY_SPECIALS.includes(slug[2])) return { kind: "cityResource", r, city, special: slug[2] };
    if (accidentTypes[slug[2]]) return { kind: "city", r, city, typeSlug: slug[2] };
  }
  return null;
}

export function generateStaticParams() {
  const params: { slug: string[] }[] = [];
  accidentTypeOrder.forEach((k) => params.push({ slug: [k] }));
  quickAnswerOrder.forEach((id) => params.push({ slug: [id] }));
  Object.keys(qaAlias).forEach((a) => params.push({ slug: [a] }));
  params.push({ slug: ["resources"] });
  // canonical full-name state landings + topics
  Object.keys(stateData).forEach((abbr) => {
    const slug = stateSlug(abbr);
    params.push({ slug: [slug] });
    stateLawTopics.forEach((t) => params.push({ slug: [slug, t.slug] }));
  });
  // cities (state segment = abbr-lowercase cityKey): landing + types + specials
  Object.keys(cityData).forEach((cityKey) => {
    cityData[cityKey].cities.forEach((c) => {
      params.push({ slug: [cityKey, c.slug] });
      cityAccidentTypes.forEach((at) => params.push({ slug: [cityKey, c.slug, at.slug] }));
      CITY_SPECIALS.forEach((sp) => params.push({ slug: [cityKey, c.slug, sp] }));
    });
  });
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const r = resolve(slug);
  let meta: { title: string; description: string; canonical: string } | null = null;
  if (r?.kind === "resources") meta = resourcesMeta;
  else if (r?.kind === "quick") meta = quickAnswerMeta(r.slug);
  else if (r?.kind === "type") meta = accidentTypeMeta(r.slug);
  else if (r?.kind === "state") meta = stateLandingMeta(r.r.data, r.r.slug);
  else if (r?.kind === "stateTopic") meta = stateTopicMeta(r.r, r.topic);
  else if (r?.kind === "city") meta = cityMeta(r.r, r.city, r.typeSlug);
  else if (r?.kind === "cityResource") meta = cityResourceMeta(r.r, r.city, r.special);
  if (!meta) return {};
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: meta.canonical },
  };
}

export default async function AccidentsCatchAll({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const r = resolve(slug);
  if (!r) notFound();
  switch (r.kind) {
    case "resources":
      return <ResourcesPage />;
    case "quick":
      return <QuickAnswerPage slug={r.slug} />;
    case "type":
      return <AccidentTypePage slug={r.slug} />;
    case "state":
      return <StateLandingPage r={r.r} />;
    case "stateTopic":
      return <StateTopicPage r={r.r} topicSlug={r.topic} />;
    case "city":
      return <CityPage r={r.r} city={r.city} typeSlug={r.typeSlug} />;
    case "cityResource":
      return <CityResourcePage r={r.r} city={r.city} kind={r.special} />;
  }
}
