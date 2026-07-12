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
import { InvisibleInjury } from "@/components/widgets/InvisibleInjury";
import { RecoveryViz } from "@/components/RecoveryViz";
import { FAQ } from "@/components/FAQ";
import { CTABand } from "@/components/CTABand";
import { JsonLd } from "@/components/JsonLd";
import { medicalWebPage, faqSchema, breadcrumb, speakable, itemList, orgGraph } from "@/lib/schema";
import { injuries, injuryOrder, injurySpokes, medReviewer } from "@/data";
import { imgPath } from "@/lib/constants";
import { toSections, dashLabel, readingMinutes } from "@/lib/article";

const INVISIBLE = ["whiplash", "herniated-disc", "soft-tissue-injury", "neck-injury", "back-injury", "shoulder-injury"];

const SPOKE_DESC: Record<string, (name: string) => string> = {
  symptoms: () => "Immediate, delayed, and emergency symptoms to watch for.",
  treatment: () => "The standard medical treatment path, step by step.",
  "recovery-timeline": () => "How long recovery takes, phase by phase.",
  "settlement-factors": (name) => `What drives the value of a ${name.toLowerCase()} claim.`,
};

function injuryScene(slug: string) {
  const inj = injuries[slug];
  return imgPath(inj?.sceneImg || "clinical");
}

export function injuryTypeMeta(slug: string) {
  const inj = injuries[slug];
  if (!inj) return null;
  return {
    title: `${inj.name} — Symptoms, Treatment, Recovery & Claim Value | CasePort`,
    description: inj.directAnswer.slice(0, 180),
    canonical: `/injuries/${slug}`,
  };
}

export function InjuryTypePage({ slug }: { slug: string }) {
  const inj = injuries[slug];
  const sections = toSections(inj.sections);
  const minutes = readingMinutes(inj.directAnswer, inj.sections.flatMap((s) => s.content));
  const takeaways = inj.keyFacts.slice(0, 4).map(dashLabel);

  const faqs = [
    {
      q: `What are the symptoms of ${inj.name.toLowerCase()}?`,
      a: `Common symptoms include ${inj.symptoms.immediate.join(", ").toLowerCase()}. Some symptoms are delayed, appearing hours to days later: ${inj.symptoms.delayed.slice(0, 3).join(", ").toLowerCase()}.`,
    },
    { q: `How is ${inj.name.toLowerCase()} treated?`, a: `${inj.treatment[0].desc} ${inj.treatment[1].desc}` },
    {
      q: `How long does it take to recover from ${inj.name.toLowerCase()}?`,
      a: `Recovery varies by severity. ${inj.recovery[0].phase} (${inj.recovery[0].time}): ${inj.recovery[0].desc} Most patients progress through ${inj.recovery.length} phases, with the most severe cases involving lasting effects.`,
    },
    {
      q: `How much is a ${inj.name.toLowerCase()} claim worth?`,
      a:
        inj.directAnswer.split(". ").filter((s) => /settlement|\$/.test(s))[0] ||
        `Value depends on severity, treatment, and permanence. ${inj.settlement[0].desc}`,
    },
  ];

  const others = injuryOrder.filter((k) => k !== slug).slice(0, 4);

  return (
    <>
      <HeroPhoto
        crumbs={<Breadcrumbs items={[{ label: "Injuries", href: "/injuries" }, { label: inj.name }]} />}
        eyebrow={inj.category}
        title={inj.name}
        sub={inj.directAnswer.split(". ").slice(0, 1)[0] + "."}
        scene={inj.category}
        img={injuryScene(slug)}
        byline={<Byline reviewerName={medReviewer.name} isMedical minutes={minutes} onDark />}
      />

      <StatTiles category={inj.category} stats={inj.stats} />

      <KeyTakeaways items={takeaways} />

      <Capsule heading={`What ${inj.name} is — and what it means for your claim`} lead={inj.directAnswer} />

      <InGuideTOC sections={sections} />

      {INVISIBLE.includes(slug) && <InvisibleInjury />}

      <ProseSections sections={sections} />

      <section className="section bg-cream">
        <div className="container-5">
          <div className="section-head">
            <h2 className="section-h">Go Deeper on {inj.name}</h2>
          </div>
          <div className="grid grid-4">
            {injurySpokes.map((sp) => (
              <Link key={sp.slug} href={`/injuries/${slug}/${sp.slug}`} className="card link r">
                <h3>
                  {inj.name} {sp.label}
                </h3>
                <p style={{ fontSize: ".92rem", marginTop: ".4rem" }}>
                  {SPOKE_DESC[sp.slug](inj.name)}
                </p>
                <span className="card-link" style={{ marginTop: ".9rem" }}>
                  Open <Icon name="arrow" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-4">
          <div className="section-head">
            <h2 className="section-h">{inj.name} Recovery Timeline</h2>
          </div>
          <RecoveryViz phases={inj.recovery} />
          <div style={{ marginTop: "1.5rem" }}>
            <Link href={`/injuries/${slug}/recovery-timeline`} className="card-link">
              Full recovery timeline <Icon name="arrow" />
            </Link>
          </div>
        </div>
      </section>

      <Expert bg="bg-cream" medical />

      <FAQ faqs={faqs} bg="bg-white" title={`Frequently Asked Questions — ${inj.name}`} />

      <section className="section bg-cream">
        <div className="container-5">
          <div className="section-head">
            <h2 className="section-h">Other Injuries</h2>
          </div>
          <div className="grid grid-4">
            {others.map((k) => {
              const o = injuries[k];
              return (
                <Link key={k} href={`/injuries/${k}`} className="card link r">
                  <div className="card-ic">
                    <Icon name={o.icon} />
                  </div>
                  <h3>{o.name}</h3>
                  <p style={{ fontSize: ".92rem", marginTop: ".4rem" }}>{o.category}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <Sources medical citeTitle={`${inj.name} — Symptoms, Treatment, Recovery & Claim Value`} citeUrl={`/injuries/${slug}`} />

      <CTABand
        title={`Living With ${inj.name}?`}
        sub="Get a free, confidential case review to understand what your injury and your claim may be worth."
        btn="Get Free Case Review"
      />

      <ArticleOverlays />

      <JsonLd
        data={[
          medicalWebPage({ headline: inj.name, description: inj.directAnswer.slice(0, 180) }),
          faqSchema(faqs),
          breadcrumb([
            { name: "Home", url: "/" },
            { name: "Injuries", url: "/injuries" },
            { name: inj.name, url: `/injuries/${slug}` },
          ]),
          speakable(`/injuries/${slug}`),
          itemList(sections.map((s) => s.title)),
          ...orgGraph(),
        ]}
      />
    </>
  );
}
