import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Breadcrumbs } from "@/components/article/Breadcrumbs";
import { Byline } from "@/components/article/Byline";
import { KeyTakeaways } from "@/components/article/KeyTakeaways";
import { Capsule } from "@/components/article/Capsule";
import { InGuideTOC } from "@/components/article/InGuideTOC";
import { ProseSections } from "@/components/article/ProseSections";
import { Expert } from "@/components/article/Expert";
import { Sources } from "@/components/article/Sources";
import { ArticleOverlays } from "@/components/article/ArticleOverlays";
import { ActionKit } from "@/components/AccidentsActionKit";
import { QaVisual } from "./QaVisual";
import { CTABand } from "@/components/AccidentsCTABand";
import { JsonLd } from "@/components/AccidentsJsonLd";
import {
  faqSchema,
  breadcrumb,
  speakable,
  itemList,
  orgGraph,
} from "@/lib/accidents-schema";
import { quickAnswers, qaAlias, quickAnswerOrder, accidentTypes } from "@/data";
import { reviewer } from "@/lib/accidents-constants";
import { toSections, colonLabel, readingMinutes } from "@/lib/accidents-article";

const KIT_SLUGS = ["first-hour", "evidence-preservation", "insurance-statement"];

export function quickAnswerMeta(slug: string) {
  const realSlug = qaAlias[slug] || slug;
  const qa = quickAnswers[realSlug];
  if (!qa) return null;
  return {
    title: `${qa.title} | CasePort`,
    description: qa.directAnswer.slice(0, 180),
    canonical: `/accidents/${realSlug}`,
  };
}

export function QuickAnswerPage({ slug }: { slug: string }) {
  const realSlug = qaAlias[slug] || slug;
  const qa = quickAnswers[realSlug];
  const eyebrow = qa.eyebrow || "Quick Answer";
  const sections = toSections(qa.sections);
  const minutes = readingMinutes(
    qa.directAnswer,
    qa.sections.map((s) => s.content)
  );
  const takeaways = (qa.keyFacts || []).slice(0, 4).map(colonLabel);

  const paa = quickAnswerOrder.filter((id) => id !== realSlug).slice(0, 5);
  const rel = ["car-accident", "truck-accident", "pedestrian-accident", "wrongful-death"];

  const faqs = [{ q: qa.question, a: qa.directAnswer }].concat(
    qa.sections.map((s) => ({ q: s.title, a: s.content }))
  );

  return (
    <>
      <section className="page-intro">
        <div className="container-4">
          <Breadcrumbs
            items={[
              { label: "Accidents", href: "/accidents" },
              { label: eyebrow },
            ]}
          />
          <div className="eyebrow" style={{ marginTop: "1.25rem" }}>
            {eyebrow}
          </div>
          <h1>{qa.title}</h1>
          <Byline reviewerName={reviewer.name} minutes={minutes} />
        </div>
      </section>

      <KeyTakeaways items={takeaways} />

      <Capsule lead={qa.directAnswer} />

      <InGuideTOC sections={sections} />

      {qa.visual && <QaVisual kind={qa.visual} />}

      <ProseSections sections={sections} />

      {KIT_SLUGS.includes(realSlug) && <ActionKit bg="bg-cream" />}

      {/* People Also Ask */}
      <section className="section bg-cream">
        <div className="container-3">
          <div className="section-head">
            <h2 className="section-h">People Also Ask</h2>
          </div>
          <div className="faq-list">
            {paa.map((id, i) => {
              const o = quickAnswers[id];
              return (
                <details className="faq-item r" key={id} open={i === 0}>
                  <summary className="faq-summary">
                    <span className="q">{o.question}</span>
                    <span className="faq-ic">
                      <Icon name="chev" />
                    </span>
                  </summary>
                  <div className="faq-answer">
                    {o.directAnswer.slice(0, 240)}…{" "}
                    <Link href={`/accidents/${id}`} className="card-link" style={{ marginTop: ".6rem" }}>
                      Read the full answer <Icon name="arrow" />
                    </Link>
                  </div>
                </details>
              );
            })}
          </div>
        </div>
      </section>

      <Expert bg="bg-white" />

      <section className="section bg-cream">
        <div className="container-4">
          <div className="section-head">
            <h2 className="section-h">Explore by Accident Type</h2>
          </div>
          <div className="rel-grid">
            {rel.map((k) => {
              const o = accidentTypes[k];
              return (
                <Link key={k} href={`/accidents/${k}`} className="card link r">
                  <h3>{o.category} Claims</h3>
                  <p style={{ fontSize: ".95rem", marginTop: ".5rem" }}>{o.subtitle}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <Sources citeTitle={qa.title} citeUrl={`/accidents/${realSlug}`} />

      <CTABand
        title="Protect Your Rights Today"
        sub="Get a free, confidential case review from a representative who understands accident claims and your state's rules."
      />

      <ArticleOverlays />

      <JsonLd
        data={[
          faqSchema(faqs),
          breadcrumb([
            { name: "Home", url: "/" },
            { name: "Accidents", url: "/accidents" },
            { name: eyebrow, url: `/accidents/${realSlug}` },
          ]),
          speakable(`/accidents/${realSlug}`),
          itemList(sections.map((s) => s.title)),
          ...orgGraph(),
        ]}
      />
    </>
  );
}
