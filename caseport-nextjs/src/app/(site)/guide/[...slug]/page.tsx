import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { guidePillars, guidePillar, guideSpokeDefs, guideSpokePillars, hasGuideSpokes } from "@/data";
import { GuidePillarPage, guidePillarMeta } from "@/components/pages/GuidePillarPage";
import { GuideSpokePage, guideSpokeMeta } from "@/components/pages/GuideSpokePage";
import { GuideGlossaryPage, glossaryMeta, GuideFAQPage, guideFaqMeta } from "@/components/pages/GuideMiscPages";

export const dynamicParams = false;

type Resolved =
  | { kind: "glossary" }
  | { kind: "faq" }
  | { kind: "pillar"; slug: string }
  | { kind: "spoke"; slug: string; spoke: string };

const isSpoke = (s: string) => guideSpokeDefs.some((d) => d.slug === s);

/** Mirrors router.js /guide dispatch. */
function resolve(slug: string[]): Resolved | null {
  if (slug.length === 1) {
    const a = slug[0];
    if (a === "glossary") return { kind: "glossary" };
    if (a === "faq") return { kind: "faq" };
    if (guidePillar(a)) return { kind: "pillar", slug: a };
  } else if (slug.length === 2) {
    if (hasGuideSpokes(slug[0]) && isSpoke(slug[1])) return { kind: "spoke", slug: slug[0], spoke: slug[1] };
  }
  return null;
}

export function generateStaticParams() {
  const params: { slug: string[] }[] = [{ slug: ["glossary"] }, { slug: ["faq"] }];
  guidePillars.forEach((p) => {
    if (p.slug === "faq") return;
    params.push({ slug: [p.slug] });
  });
  guideSpokePillars.forEach((slug) => {
    guideSpokeDefs.forEach((sp) => params.push({ slug: [slug, sp.slug] }));
  });
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  const r = resolve(slug);
  let meta: { title: string; description: string; canonical: string } | null = null;
  if (r?.kind === "glossary") meta = glossaryMeta;
  else if (r?.kind === "faq") meta = guideFaqMeta;
  else if (r?.kind === "pillar") meta = guidePillarMeta(r.slug);
  else if (r?.kind === "spoke") meta = guideSpokeMeta(r.slug, r.spoke);
  if (!meta) return {};
  return { title: meta.title, description: meta.description, alternates: { canonical: meta.canonical } };
}

export default async function GuideCatchAll({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const r = resolve(slug);
  if (!r) notFound();
  switch (r.kind) {
    case "glossary":
      return <GuideGlossaryPage />;
    case "faq":
      return <GuideFAQPage />;
    case "pillar":
      return <GuidePillarPage slug={r.slug} />;
    case "spoke":
      return <GuideSpokePage pillarSlug={r.slug} spokeSlug={r.spoke} />;
  }
}
