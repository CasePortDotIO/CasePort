import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Capsule } from "@/components/article/Capsule";
import { Expert } from "@/components/article/Expert";
import { ClaimRoadmap } from "@/components/widgets/ClaimRoadmap";
import { TakeHome } from "@/components/widgets/TakeHome";
import { FAQ } from "@/components/FAQ";
import { CTABand } from "@/components/CTABand";
import { JsonLd } from "@/components/JsonLd";
import { article, faqSchema, breadcrumb, orgGraph, type Faq } from "@/lib/schema";
import { guidePillars } from "@/data";

export const metadata: Metadata = {
  title: "The Complete Guide to Injury Claims | CasePort",
  description:
    "National, attorney-reviewed guides to every accident type and every step of an injury claim.",
  alternates: { canonical: "/guide" },
};

const faqs: Faq[] = [
  { q: "What is the difference between the Guide, Accidents, and Injuries sections?", a: "The Guide is the national education layer — plain-English explainers of each accident type and each step of a claim. The Accidents hub covers your state’s specific negligence rules, deadlines, and city-level guidance. The Injuries hub covers the medical side — symptoms, treatment, and recovery. Together they answer \"what happened,\" \"where it happened,\" and \"what it did to me.\"" },
  { q: "Are these guides legal advice?", a: "No. They are general educational information, attorney-reviewed and updated quarterly, designed to help you understand your situation. They do not create an attorney-client relationship and are not a substitute for advice about your specific case." },
  { q: "How much does it cost to talk to a lawyer about my claim?", a: "Most personal-injury lawyers offer a free case review and work on contingency — no upfront fee, and no attorney fee unless they recover for you. A consultation costs nothing and carries no obligation." },
];

export default function GuideHub() {
  return (
    <>
      <section className="hero">
        <div className="container-5">
          <div className="eyebrow center" style={{ marginBottom: "1rem" }}>
            National Education &amp; Answer Engine
          </div>
          <h1 className="hero-h1">
            The Complete Guide
            <br />
            to Injury Claims
          </h1>
          <p className="hero-lede">
            Plain-English, attorney-reviewed guides to every kind of accident and every step of a
            claim — built to answer the question, whether it&rsquo;s asked in a search bar or to an
            AI assistant. Start here, then go as deep as you need.
          </p>
          <div className="cred-row">
            <span className="cred-item">
              <Icon name="award" />
              Attorney-Reviewed
            </span>
            <span className="cred-item">
              <Icon name="cal" />
              Updated June 2026
            </span>
            <span className="cred-item">
              <Icon name="check" />
              National Coverage
            </span>
          </div>
        </div>
      </section>

      <Capsule
        container="container-5"
        heading="Everything an injury claim involves, in one place"
        lead="A personal-injury claim has three layers: the kind of accident (which decides liability), the injury itself (which decides medical value), and the process (insurance, evidence, fees, and liens). This guide hub covers all three. Each pillar below is a complete national explainer; from any of them you can drop into your state’s specific rules or your injury’s medical detail. No jargon, no sales pitch — just the answer."
        facts={[
          ["Accident type sets liability", "Car, truck, premises, and malpractice claims each prove fault differently."],
          ["Injury sets medical value", "Severity, permanence, and documentation drive what a claim is worth."],
          ["Process protects the value", "Insurance handling, evidence, fees, and liens decide what you keep."],
          ["Built to be cited", "Structured, sourced answers for search engines and AI assistants alike."],
        ]}
      />

      <ClaimRoadmap bg="bg-cream" />

      <section className="section bg-cream">
        <div className="container">
          <div className="section-head">
            <h2 className="section-h">Browse the Guides</h2>
            <p className="section-sub">
              Twelve accident pillars, five claim-process guides, and a plain-language glossary —
              each a complete national resource.
            </p>
          </div>
          <div className="guide-grid">
            {guidePillars.map((p) => (
              <Link key={p.slug} href={`/guide/${p.slug}`} className="guide-card r">
                <div className="guide-card-top">
                  <div className="guide-card-title">
                    <span className="dot dot-gold"></span>
                    <h3>{p.name}</h3>
                  </div>
                  <span className="scope scope-both">National</span>
                </div>
                <p className="guide-card-path">
                  /guide/<b>{p.slug}</b>
                </p>
                <div className="tags" style={{ margin: ".5rem 0 .75rem" }}>
                  {p.tags.map((t) => (
                    <span key={t} className={"tag tag-" + t.toLowerCase()}>
                      {t}
                    </span>
                  ))}
                </div>
                <p className="guide-card-desc">{p.short}</p>
                <span className="card-link" style={{ marginTop: ".9rem" }}>
                  Read the guide <Icon name="arrow" />
                </span>
              </Link>
            ))}
            <Link href="/guide/glossary" className="guide-card r">
              <div className="guide-card-top">
                <div className="guide-card-title">
                  <span className="dot dot-gold"></span>
                  <h3>Personal Injury Glossary</h3>
                </div>
                <span className="scope scope-both">National</span>
              </div>
              <p className="guide-card-path">
                /guide/<b>glossary</b>
              </p>
              <div className="tags" style={{ margin: ".5rem 0 .75rem" }}>
                <span className="tag tag-aeo">AEO</span>
                <span className="tag tag-voice">VOICE</span>
              </div>
              <p className="guide-card-desc">
                Every claim term in plain English. AI &quot;define this&quot; bait with
                DefinedTermSet schema.
              </p>
              <span className="card-link" style={{ marginTop: ".9rem" }}>
                Open the glossary <Icon name="arrow" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      <TakeHome bg="bg-white" />

      <section className="section bg-white">
        <div className="container-5">
          <div className="section-head center">
            <h2 className="section-h">Go Deeper</h2>
            <p className="section-sub center">
              The guides explain the concepts. When you&rsquo;re ready for specifics, two sister
              hubs take you the rest of the way.
            </p>
          </div>
          <div className="rel-grid" style={{ maxWidth: "48rem", margin: "0 auto" }}>
            <Link href="/accidents" className="card link r">
              <div className="card-ic">
                <Icon name="scale" />
              </div>
              <h3>Your State&rsquo;s Accident Laws</h3>
              <p style={{ fontSize: ".95rem", marginTop: ".4rem" }}>
                Negligence rules, filing deadlines, and city guides for all 50 states &amp; DC.
              </p>
              <span className="card-link" style={{ marginTop: ".9rem" }}>
                Open the Accidents hub <Icon name="arrow" />
              </span>
            </Link>
            <Link href="/injuries" className="card link r">
              <div className="card-ic">
                <Icon name="steth" />
              </div>
              <h3>Your Injury, Medically Explained</h3>
              <p style={{ fontSize: ".95rem", marginTop: ".4rem" }}>
                Symptoms, treatment, recovery timelines, and claim value by injury.
              </p>
              <span className="card-link" style={{ marginTop: ".9rem" }}>
                Open the Injuries hub <Icon name="arrow" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      <Expert bg="bg-cream" />

      <FAQ faqs={faqs} bg="bg-white" title="About These Guides" />

      <CTABand
        title="Have a Specific Question?"
        sub="Get a free, confidential case review. No cost, no obligation — just answers about your situation."
        btn="Get Free Case Review"
      />

      <JsonLd
        data={[
          article({
            headline: "The Complete Guide to Injury Claims",
            description: "National, attorney-reviewed guides to every accident type and every step of an injury claim.",
          }),
          faqSchema(faqs),
          breadcrumb([
            { name: "Home", url: "/" },
            { name: "Guide", url: "/guide" },
          ]),
          ...orgGraph(),
        ]}
      />
    </>
  );
}
