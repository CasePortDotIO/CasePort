import { Icon } from "@/components/Icon";
import { Breadcrumbs } from "@/components/article/Breadcrumbs";
import { Byline } from "@/components/article/Byline";
import { Expert } from "@/components/article/Expert";
import { Sources } from "@/components/article/Sources";
import { ArticleOverlays } from "@/components/article/ArticleOverlays";
import { GlossaryBrowser } from "@/components/accidents-widgets/GlossaryBrowser";
import { CTABand } from "@/components/AccidentsCTABand";
import { JsonLd } from "@/components/AccidentsJsonLd";
import { definedTermSet, faqSchema, breadcrumb, speakable, orgGraph } from "@/lib/accidents-schema";
import { glossary, guideFAQ } from "@/data";
import { reviewer } from "@/lib/accidents-constants";

/* ---------- Glossary ---------- */
export const glossaryMeta = {
  title: "Personal Injury Glossary — Plain-English Definitions | CasePort",
  description: "Every claim term in plain English, linked to the guide that goes deeper.",
  canonical: "/guide/glossary",
};

export function GuideGlossaryPage() {
  return (
    <>
      <section className="page-intro">
        <div className="container-4">
          <Breadcrumbs items={[{ label: "Guide", href: "/guide" }, { label: "Glossary" }]} />
          <div className="eyebrow" style={{ marginTop: "1.25rem" }}>
            Plain-Language Definitions
          </div>
          <h1>Personal Injury Glossary</h1>
          <p className="section-sub" style={{ marginTop: ".9rem" }}>
            Every term you&rsquo;ll hear during a claim, defined in plain English — and linked to the
            guide that goes deeper.
          </p>
          <Byline reviewerName={reviewer.name} minutes={2} />
        </div>
      </section>

      <GlossaryBrowser />

      <Sources citeTitle="Personal Injury Glossary — Plain-English Definitions" citeUrl="/guide/glossary" />

      <CTABand
        title="Still Have Questions?"
        sub="Get a free, confidential case review and ask in plain English — no cost, no obligation."
        btn="Get Free Case Review"
      />

      <ArticleOverlays />

      <JsonLd
        data={[
          definedTermSet("Personal Injury Glossary", glossary),
          faqSchema(glossary.slice(0, 10).map((g) => ({ q: `What is ${g.term}?`, a: g.def }))),
          breadcrumb([
            { name: "Home", url: "/" },
            { name: "Guide", url: "/guide" },
            { name: "Glossary", url: "/guide/glossary" },
          ]),
          ...orgGraph(),
        ]}
      />
    </>
  );
}

/* ---------- FAQ pillar ---------- */
export const guideFaqMeta = {
  title: "Injury Claim FAQ — Direct Answers | CasePort",
  description: "Direct, structured answers to the questions people — and AI assistants — ask most.",
  canonical: "/guide/faq",
};

export function GuideFAQPage() {
  const f = guideFAQ;
  const allFaqs = f.groups.flatMap((g) => g.items);
  return (
    <>
      <section className="page-intro">
        <div className="container-4">
          <Breadcrumbs items={[{ label: "Guide", href: "/guide" }, { label: f.name }]} />
          <div className="eyebrow" style={{ marginTop: "1.25rem" }}>
            {f.category}
          </div>
          <h1>{f.name}</h1>
          <p className="section-sub" style={{ marginTop: ".9rem" }}>
            {f.subtitle}
          </p>
          <Byline reviewerName={reviewer.name} minutes={2} />
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-3">
          <div className="faq-stack">
            {f.groups.map((grp, gi) => (
              <div className="faq-group" key={gi}>
                <h2 className="section-h" style={{ fontSize: "clamp(1.4rem,2.6vw,1.8rem)", marginBottom: "1.25rem" }}>
                  {grp.title}
                </h2>
                <div className="faq-list">
                  {grp.items.map((it, i) => (
                    <details className="faq-item r" key={i} open={i === 0}>
                      <summary className="faq-summary">
                        <span className="q">{it.q}</span>
                        <span className="faq-ic">
                          <Icon name="chev" />
                        </span>
                      </summary>
                      <div className="faq-answer">{it.a}</div>
                    </details>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Expert bg="bg-cream" />

      <Sources citeTitle="Injury Claim FAQ — Direct Answers" citeUrl="/guide/faq" />

      <CTABand
        title="Didn’t Find Your Answer?"
        sub="Get a free, confidential case review and ask directly — no cost, no obligation."
        btn="Get Free Case Review"
      />

      <ArticleOverlays />

      <JsonLd
        data={[
          faqSchema(allFaqs),
          breadcrumb([
            { name: "Home", url: "/" },
            { name: "Guide", url: "/guide" },
            { name: f.name, url: "/guide/faq" },
          ]),
          speakable("/guide/faq"),
          ...orgGraph(),
        ]}
      />
    </>
  );
}
