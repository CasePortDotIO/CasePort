import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { injuries, injuryOrder, injurySpokes } from "@/data";
import { InjuryTypePage, injuryTypeMeta } from "@/components/accidents-pages/InjuryTypePage";
import { InjurySpokePage, injurySpokeMeta } from "@/components/accidents-pages/InjurySpokePage";
import {
  DelayedSymptomsPage,
  delayedSymptomsMeta,
  WhenToSeeDoctorPage,
  whenToSeeDoctorMeta,
} from "@/components/accidents-pages/StandaloneInjuryPages";

export const dynamicParams = false;

type Resolved =
  | { kind: "delayed" }
  | { kind: "whenToSee" }
  | { kind: "type"; slug: string }
  | { kind: "spoke"; slug: string; spoke: string };

const isSpoke = (s: string) => injurySpokes.some((sp) => sp.slug === s);

/** Mirrors router.js /injuries dispatch. */
function resolve(slug: string[]): Resolved | null {
  if (slug.length === 1) {
    const a = slug[0];
    if (a === "delayed-symptoms-after-car-accident") return { kind: "delayed" };
    if (a === "when-to-see-doctor-after-accident") return { kind: "whenToSee" };
    if (injuries[a]) return { kind: "type", slug: a };
  } else if (slug.length === 2) {
    if (injuries[slug[0]] && isSpoke(slug[1])) return { kind: "spoke", slug: slug[0], spoke: slug[1] };
  }
  return null;
}

export function generateStaticParams() {
  const params: { slug: string[] }[] = [
    { slug: ["delayed-symptoms-after-car-accident"] },
    { slug: ["when-to-see-doctor-after-accident"] },
  ];
  injuryOrder.forEach((slug) => {
    params.push({ slug: [slug] });
    injurySpokes.forEach((sp) => params.push({ slug: [slug, sp.slug] }));
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
  if (r?.kind === "delayed") meta = delayedSymptomsMeta;
  else if (r?.kind === "whenToSee") meta = whenToSeeDoctorMeta;
  else if (r?.kind === "type") meta = injuryTypeMeta(r.slug);
  else if (r?.kind === "spoke") meta = injurySpokeMeta(r.slug, r.spoke);
  if (!meta) return {};
  return { title: meta.title, description: meta.description, alternates: { canonical: meta.canonical } };
}

export default async function InjuriesCatchAll({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const r = resolve(slug);
  if (!r) notFound();
  switch (r.kind) {
    case "delayed":
      return <DelayedSymptomsPage />;
    case "whenToSee":
      return <WhenToSeeDoctorPage />;
    case "type":
      return <InjuryTypePage slug={r.slug} />;
    case "spoke":
      return <InjurySpokePage slug={r.slug} spokeSlug={r.spoke} />;
  }
}
