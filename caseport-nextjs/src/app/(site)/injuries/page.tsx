import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Capsule } from "@/components/article/Capsule";
import { Expert } from "@/components/article/Expert";
import { SymptomMatcher } from "@/components/widgets/SymptomMatcher";
import { EmergencyTriage } from "@/components/widgets/EmergencyTriage";
import { InvisibleInjury } from "@/components/widgets/InvisibleInjury";
import { FAQ } from "@/components/FAQ";
import { CTABand } from "@/components/CTABand";
import { JsonLd } from "@/components/JsonLd";
import { medicalWebPage, faqSchema, breadcrumb, orgGraph, type Faq } from "@/lib/schema";
import { injuryOrder, injuries } from "@/data";

export const metadata: Metadata = {
  title: "Accident Injuries — Symptoms, Treatment & Claim Value | CasePort",
  description: "Medically-reviewed guides to every major collision injury.",
  alternates: { canonical: "/injuries" },
};

const num = (v: string) => <span className="num">{v}</span>;

const trustItems: [string, string, string][] = [
  ["steth", "Medically Reviewed", "By an MD"],
  ["chart", "Evidence-Based", "Clinical Sources"],
  ["check", "Updated Quarterly", "Current Guidelines"],
  ["shield", "Educational", "Not a Diagnosis"],
  ["heart", "Patient-First", "Plain Language"],
];

const urgent: [string, string, string, string][] = [
  ["/injuries/delayed-symptoms-after-car-accident", "clock", "Delayed Symptoms After a Car Accident", "Feeling pain days later is normal — and it matters. The symptoms that surface 24–72 hours after a crash."],
  ["/injuries/when-to-see-doctor-after-accident", "steth", "When to See a Doctor After an Accident", "Not sure if you need care? The red flags, the timeline, and why a same-day record protects you."],
];

const faqs: Faq[] = [
  { q: "Why do injury symptoms appear days after a car accident?", a: "Adrenaline and the body’s stress response mask pain at the scene. As they wear off over 6 to 72 hours, inflammation builds and injuries like whiplash, concussions, and soft-tissue damage become apparent. Delayed symptoms are medically normal — which is why prompt evaluation matters even if you feel fine." },
  { q: "Can I have a serious injury that doesn’t show on an X-ray?", a: "Yes. X-rays show bone, not soft tissue. Whiplash, herniated discs, rotator-cuff tears, brain injuries, and PTSD often don’t appear on X-ray and require MRI, specialist evaluation, or clinical documentation to diagnose. \"Invisible\" does not mean minor — these are fully compensable injuries." },
  { q: "How soon should I see a doctor after an accident?", a: "As soon as possible, ideally the same day — even if you feel okay. Some injuries are dangerous precisely because symptoms are delayed (internal bleeding, brain injury). A same-day medical record also creates the documentation your claim depends on; gaps in care are the most common way insurers reduce a claim." },
  { q: "Does the type of injury affect how much my claim is worth?", a: "Significantly. Claim value is driven by severity, whether surgery is required, permanence, and lasting impairment. A surgical disc or a brain injury is worth far more than a resolved strain. Within any injury type, consistent treatment and clear documentation are the biggest value factors." },
];

export default function InjuriesHub() {
  return (
    <>
      <section className="hero">
        <div className="container-5">
          <div className="eyebrow center" style={{ marginBottom: "1rem" }}>
            Medical &amp; Injury Authority
          </div>
          <h1 className="hero-h1">
            Accident Injuries,
            <br />
            Explained by the Body
          </h1>
          <p className="hero-lede">
            Medically-reviewed guides to every major collision injury — symptoms, treatment,
            recovery timelines, and what drives a claim&rsquo;s value. Know what you&rsquo;re
            dealing with before anyone tells you it&rsquo;s &quot;minor.&quot;
          </p>
          <div className="cred-row">
            <span className="cred-item">
              <Icon name="steth" />
              Medically Reviewed
            </span>
            <span className="cred-item">
              <Icon name="cal" />
              Updated June 2026
            </span>
            <span className="cred-item">
              <Icon name="check" />
              Not Medical Advice
            </span>
          </div>
        </div>
      </section>

      <Capsule
        container="container-5"
        heading="What you need to know about accident injuries"
        lead="After a collision, four things shape both your recovery and your claim: the type of injury, whether symptoms are immediate or delayed, the treatment you document, and how those facts translate into value. Many serious injuries — whiplash, soft-tissue damage, even brain injury — don’t show on an X-ray and feel &quot;minor&quot; at the scene. Understanding what you’re dealing with, and documenting it from day one, protects your health and your case."
        facts={[
          ["Symptoms are often delayed", "Adrenaline masks injury. Whiplash, concussion, and internal bleeding can take hours to days to appear."],
          ['"Invisible" isn’t "minor"', "Soft-tissue, brain, and psychological injuries rarely show on X-ray — but are fully compensable."],
          ["Documentation is everything", "Consistent, early treatment is the strongest evidence that an injury is real and serious."],
          ["Severity drives value", "Surgery, permanence, and lasting impairment are the biggest factors in any injury claim."],
        ]}
        table={{
          label: "Injury types at a glance",
          head: ["Injury", "Shows on X-ray?", "Typical recovery"],
          rows: [
            ["Whiplash / soft-tissue", num("No (MRI)"), num("Weeks–3 mo")],
            ["Herniated disc", num("No (MRI)"), num("6–12 wk+")],
            ["Broken bones", num("Yes"), num("6 wk–months")],
            ["Brain injury (TBI)", num("Sometimes"), num("Weeks–lifelong")],
            ["PTSD / emotional", num("No"), num("Months–years")],
          ],
        }}
      />

      <section className="trust">
        <div className="trust-grid">
          {trustItems.map((t, i) => (
            <div className="trust-item" key={i}>
              <Icon name={t[0]} />
              <div className="trust-label">{t[1]}</div>
              <div className="trust-val">{t[2]}</div>
            </div>
          ))}
        </div>
      </section>

      <SymptomMatcher />

      <EmergencyTriage />

      <section className="section bg-cream">
        <div className="container-5">
          <div className="section-head">
            <h2 className="section-h">Browse by Injury Type</h2>
            <p className="section-sub">
              Twelve medically-reviewed injury guides — each with symptoms, treatment, a recovery
              timeline, and the factors that drive claim value.
            </p>
          </div>
          <div className="inj-grid">
            {injuryOrder.map((slug) => {
              const inj = injuries[slug];
              return (
                <Link key={slug} href={`/injuries/${slug}`} className="card link r">
                  <div className="card-ic">
                    <Icon name={inj.icon} />
                  </div>
                  <h3>{inj.name}</h3>
                  <p style={{ fontSize: ".95rem" }}>{inj.category}</p>
                  <span className="card-link" style={{ marginTop: "1rem" }}>
                    Symptoms, treatment &amp; value <Icon name="arrow" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <InvisibleInjury />

      <section className="section bg-white">
        <div className="container-4">
          <div className="section-head">
            <h2 className="section-h">Start Here If You Were Just in a Crash</h2>
          </div>
          <div className="rel-grid">
            {urgent.map((x) => (
              <Link key={x[0]} href={x[0]} className="card link r">
                <div className="card-ic">
                  <Icon name={x[1]} />
                </div>
                <h3>{x[2]}</h3>
                <p>{x[3]}</p>
                <span className="card-link" style={{ marginTop: "1rem" }}>
                  Read <Icon name="arrow" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Expert bg="bg-cream" medical />

      <FAQ faqs={faqs} bg="bg-white" title="Frequently Asked Questions About Accident Injuries" />

      <CTABand
        title="Injured in an Accident?"
        sub="Understanding your injury is the first step. Get a free, confidential case review to learn what your claim may be worth — at no cost."
        btn="Get Free Case Review"
      />

      <JsonLd
        data={[
          medicalWebPage({
            headline: "Accident Injuries — Symptoms, Treatment & Claim Value",
            description: "Medically-reviewed guides to every major collision injury.",
          }),
          faqSchema(faqs),
          breadcrumb([
            { name: "Home", url: "/" },
            { name: "Injuries", url: "/injuries" },
          ]),
          ...orgGraph(),
        ]}
      />
    </>
  );
}
