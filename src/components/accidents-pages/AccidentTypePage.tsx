import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Breadcrumbs } from "@/components/article/Breadcrumbs";
import { HeroPhoto } from "@/components/article/HeroPhoto";
import { Byline } from "@/components/article/Byline";
import { KeyTakeaways } from "@/components/article/KeyTakeaways";
import { Capsule } from "@/components/article/Capsule";
import { InGuideTOC } from "@/components/article/InGuideTOC";
import { ProseSections } from "@/components/article/ProseSections";
import { StatTiles } from "@/components/article/StatTiles";
import { Expert } from "@/components/article/Expert";
import { Sources } from "@/components/article/Sources";
import { ArticleOverlays } from "@/components/article/ArticleOverlays";
import { SettlementEstimator } from "@/components/accidents-widgets/SettlementEstimator";
import { FAQ } from "@/components/AccidentsFAQ";
import { CTABand } from "@/components/AccidentsCTABand";
import { JsonLd } from "@/components/AccidentsJsonLd";
import {
  article,
  faqSchema,
  breadcrumb,
  speakable,
  itemList,
  orgGraph,
  type Faq,
} from "@/lib/accidents-schema";
import { accidentTypes, accidentTypeOrder } from "@/data";
import { reviewer, sceneFor } from "@/lib/accidents-constants";
import { toSections, dashLabel, readingMinutes } from "@/lib/accidents-article";
import { severityTable } from "@/lib/accidents-accident";

export function accidentTypeMeta(slug: string) {
  const t = accidentTypes[slug];
  if (!t) return null;
  return {
    title: `${t.title} | CasePort`,
    description: t.directAnswer.slice(0, 180),
    canonical: `/accidents/${slug}`,
  };
}

export function AccidentTypePage({ slug }: { slug: string }) {
  const t = accidentTypes[slug];
  const heroTitle = (t.title.split(":")[0] || t.title).trim();
  const sections = toSections(t.sections);
  const minutes = readingMinutes(
    t.directAnswer,
    t.sections.flatMap((s) => s.content)
  );
  const takeaways = t.keyFacts.slice(0, 4).map(dashLabel);

  const faqs: Faq[] = [
    { q: `How much is a ${t.category.toLowerCase()} claim worth?`, a: t.directAnswer },
    ...t.sections.map((s) => ({
      q: s.title.replace(/\.$/, "") + (/\?$/.test(s.title) ? "" : "?"),
      a: s.content[0],
    })),
  ];

  const others = accidentTypeOrder.filter((k) => k !== slug).slice(0, 4);

  return (
    <>
      <HeroPhoto
        crumbs={
          <Breadcrumbs
            items={[
              { label: "Accidents", href: "/accidents" },
              { label: t.category },
            ]}
          />
        }
        eyebrow={t.category}
        title={heroTitle}
        sub={t.subtitle}
        scene={t.scene}
        img={sceneFor(slug)}
        byline={
          <Byline reviewerName={reviewer.name} minutes={minutes} onDark />
        }
      />

      <StatTiles category={t.category} stats={t.stats} />

      <KeyTakeaways items={takeaways} />

      <Capsule
        heading={`How ${t.category.toLowerCase()} claims work — and what yours may be worth`}
        lead={t.directAnswer}
        table={severityTable(t)}
      />

      <InGuideTOC sections={sections} />

      <ProseSections sections={sections} />

      <SettlementEstimator />

      <FAQ
        faqs={faqs}
        bg="bg-cream"
        title={`Frequently Asked Questions About ${t.category} Claims`}
      />

      <Expert bg="bg-white" />

      <section className="section bg-cream">
        <div className="container-5">
          <div className="section-head">
            <h2 className="section-h">Other Accident Types</h2>
          </div>
          <div className="grid grid-4">
            {others.map((k) => {
              const o = accidentTypes[k];
              return (
                <Link key={k} href={`/accidents/${k}`} className="card link r">
                  <div className="card-ic">
                    <Icon name={o.icon} />
                  </div>
                  <h3>{o.category}</h3>
                  <p style={{ fontSize: ".95rem" }}>{o.subtitle}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <Sources citeTitle={t.title} citeUrl={`/accidents/${slug}`} />

      <CTABand
        title="Ready to Protect Your Rights?"
        sub={`Get a free case review from a representative who understands ${t.category.toLowerCase()} claims and your state's negligence rule.`}
      />

      <ArticleOverlays />

      <JsonLd
        data={[
          article({ headline: t.title, description: t.directAnswer.slice(0, 180) }),
          faqSchema(faqs),
          breadcrumb([
            { name: "Home", url: "/" },
            { name: "Accidents", url: "/accidents" },
            { name: t.category, url: `/accidents/${slug}` },
          ]),
          speakable(`/accidents/${slug}`),
          itemList(sections.map((s) => s.title)),
          ...orgGraph(),
        ]}
      />
    </>
  );
}
