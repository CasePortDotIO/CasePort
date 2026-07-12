import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { stateData } from "@/data";
import { resolveState, stateSlug } from "@/lib/state";
import { StateTopicPage, stateTopicMeta } from "@/components/pages/StateTopicPage";

// /data/[state]-car-accident-statistics → state "statistics" topic (alias).
export const dynamicParams = true;

const SUFFIX = "-car-accident-statistics";

function resolveStateFromSlug(slug: string) {
  const m = slug.match(/^(.*)-car-accident-statistics$/);
  if (!m) return null;
  return resolveState(m[1]);
}

export function generateStaticParams() {
  return Object.keys(stateData).map((abbr) => ({ slug: stateSlug(abbr) + SUFFIX }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const r = resolveStateFromSlug(slug);
  if (!r) return {};
  const meta = stateTopicMeta(r, "statistics");
  if (!meta) return {};
  return {
    title: meta.title,
    description: meta.description,
    // canonical points to the real topic URL, not the alias
    alternates: { canonical: meta.canonical },
  };
}

export default async function StatisticsAlias({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const r = resolveStateFromSlug(slug);
  if (!r) notFound();
  return <StateTopicPage r={r} topicSlug="statistics" />;
}
