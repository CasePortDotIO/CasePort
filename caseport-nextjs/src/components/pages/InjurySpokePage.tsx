import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Breadcrumbs } from "@/components/article/Breadcrumbs";
import { Byline } from "@/components/article/Byline";
import { KeyTakeaways } from "@/components/article/KeyTakeaways";
import { Capsule } from "@/components/article/Capsule";
import { SectionTOC } from "@/components/article/SectionTOC";
import { Expert } from "@/components/article/Expert";
import { Sources } from "@/components/article/Sources";
import { ArticleOverlays } from "@/components/article/ArticleOverlays";
import { RecoveryViz } from "@/components/RecoveryViz";
import { CTABand } from "@/components/CTABand";
import { JsonLd } from "@/components/JsonLd";
import { medicalWebPage, faqSchema, breadcrumb, speakable, orgGraph } from "@/lib/schema";
import { injuries, injurySpokes, medReviewer, type Injury } from "@/data";
import { readingMinutes } from "@/lib/article";

interface SpokeMeta {
  title: string;
  sub: string;
  lead: string;
  takeaways: string[];
  faq: { q: string; a: string }[];
}

function ProseBlock({ sections }: { sections: { title: string; content: string }[] }) {
  return (
    <section className="section bg-cream">
      <div className="container-4">
        {sections.map((s, i) => (
          <div className="prose-sec" key={i}>
            <div className="prose">
              <h2>{s.title}</h2>
              <p>{s.content}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Mirrors source `CP._injurySpokeContent` — text bits + the spoke body. */
function spokeContent(inj: Injury, spokeSlug: string): { meta: SpokeMeta; body: React.ReactNode } {
  const name = inj.name;
  const lc = name.toLowerCase();

  if (spokeSlug === "symptoms") {
    const col = (title: string, ic: string, cls: string, items: string[]) => (
      <div className={"sym-col " + cls}>
        <div className="sym-col-h">
          <Icon name={ic} />
          {title}
        </div>
        <ul>
          {items.map((s, i) => (
            <li key={i}>
              <Icon name={cls === "emergency" ? "alert" : "check2"} />
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>
    );
    const body = (
      <>
        <section className="section bg-white">
          <div className="container">
            <div className="sym-grid">
              {col("Immediate symptoms", "clock", "", inj.symptoms.immediate)}
              {col("Delayed symptoms (hours–days)", "steth", "", inj.symptoms.delayed)}
              {col("Emergency — call 911", "alert", "emergency", inj.symptoms.emergency)}
            </div>
            <p className="note" style={{ marginTop: "1.5rem" }}>
              <Icon name="alertC" />
              <span>
                This is educational information, not a diagnosis. If you have any emergency
                symptom, call 911 or go to the ER immediately.
              </span>
            </p>
          </div>
        </section>
        <ProseBlock
          sections={[
            { title: `Why ${name} Symptoms Are Often Delayed`, content: `After a collision, adrenaline and the body’s acute stress response suppress pain — which is why many people genuinely feel "fine" at the scene of a crash that injured them. As those stress hormones wear off over the following 6 to 72 hours, inflammation builds around the injured tissue and symptoms emerge, often peaking the next morning. With ${lc}, this delay is the rule rather than the exception, and it creates a trap: anything you said at the scene ("I’m okay") and any gap before you sought care will be used to argue you were never really hurt. The medical reality — delayed onset is normal — is on your side, but only if you document the symptoms promptly when they appear.` },
            { title: `How ${name} Is Diagnosed`, content: `Diagnosing ${lc} starts with a clinical exam — your physician evaluates pain, range of motion, neurological signs, and the mechanism of the crash. Imaging is ordered based on those findings: ${inj.symptoms.emergency.length ? "emergency symptoms like " + inj.symptoms.emergency[0].toLowerCase() + " demand immediate evaluation, while " : ""}persistent or radiating symptoms typically warrant advanced imaging. The diagnostic record this creates does double duty: it directs your treatment and it becomes the objective evidence that connects your injury to the crash. Keeping every appointment and reporting every symptom — even ones that seem minor — builds the complete picture that both your recovery and any claim depend on.` },
          ]}
        />
      </>
    );
    return {
      meta: {
        title: `${name} Symptoms: Immediate, Delayed & Emergency Signs`,
        sub: `The symptoms of ${lc} to watch for after a collision — including the delayed signs that appear hours to days later.`,
        lead: `The symptoms of ${lc} include ${inj.symptoms.immediate.slice(0, 3).join(", ").toLowerCase()} immediately, and delayed signs such as ${inj.symptoms.delayed.slice(0, 2).join(" and ").toLowerCase()} that can appear hours to days later. Seek emergency care for ${inj.symptoms.emergency[0].toLowerCase()}. Because symptoms can be delayed, prompt evaluation matters even if you feel okay at first.`,
        takeaways: inj.symptoms.immediate.slice(0, 4),
        faq: [
          { q: `What are the first symptoms of ${lc}?`, a: `Immediately after the injury: ${inj.symptoms.immediate.join(", ").toLowerCase()}.` },
          { q: `Can ${lc} symptoms be delayed?`, a: `Yes. Delayed symptoms include ${inj.symptoms.delayed.join(", ").toLowerCase()}, often appearing hours to days after the crash as inflammation builds.` },
          { q: `When is ${lc} an emergency?`, a: `Seek emergency care immediately for: ${inj.symptoms.emergency.join(", ").toLowerCase()}.` },
        ],
      },
      body,
    };
  }

  if (spokeSlug === "treatment") {
    const body = (
      <>
        <section className="section bg-white">
          <div className="container-4">
            <div className="section-head">
              <h2 className="section-h">The {name} treatment path</h2>
            </div>
            <div className="tx-list">
              {inj.treatment.map((t, i) => (
                <div className="tx-item r" key={i}>
                  <div className="tx-num">{i + 1}</div>
                  <div>
                    <h3>{t.name}</h3>
                    <p>{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <ProseBlock
          sections={[
            { title: "Why Following the Full Treatment Plan Matters", content: `With ${lc}, the single most common mistake is stopping treatment when the acute pain fades rather than when the clinician says recovery is complete. Premature return to full activity can turn a healing injury into a chronic one, and gaps in the treatment record are the leading way insurers argue an injury "resolved" or "wasn’t serious." Your treatment plan is both a medical roadmap and the evidence trail of your injury: attending every appointment, completing prescribed therapy, and reporting ongoing symptoms protects your recovery and the integrity of any claim simultaneously. If a treatment isn’t working, the answer is to tell your provider — not to quietly stop.` },
            { title: "When Conservative Care Isn’t Enough", content: `Most ${lc} cases respond to conservative treatment, but a subset require escalation. Warning signs that more aggressive intervention may be needed include symptoms that fail to improve on the expected timeline, pain that worsens despite therapy, or new neurological signs such as spreading numbness or weakness. When that happens, the next step is usually advanced imaging and a specialist referral to determine whether injections or surgery are warranted. These escalated cases take longer to resolve and carry greater lasting impact — which is precisely why thorough documentation at every stage matters so much to both treatment decisions and claim value.` },
          ]}
        />
      </>
    );
    return {
      meta: {
        title: `${name} Treatment: The Standard Medical Path`,
        sub: `How ${lc} is treated, step by step — from initial evaluation through rehabilitation.`,
        lead: `Treatment for ${lc} typically progresses through ${inj.treatment.length} stages: ${inj.treatment.map((t) => t.name.toLowerCase()).join(", ")}. ${inj.treatment[0].desc} Following the full course of care protects both your recovery and the documentation your claim depends on.`,
        takeaways: inj.treatment.map((t) => t.name),
        faq: inj.treatment.slice(0, 3).map((t) => ({ q: `${t.name} for ${lc}?`, a: t.desc })),
      },
      body,
    };
  }

  if (spokeSlug === "recovery-timeline") {
    const body = (
      <>
        <section className="section bg-white">
          <div className="container-4">
            <div className="section-head">
              <h2 className="section-h">{name} recovery, phase by phase</h2>
            </div>
            <RecoveryViz phases={inj.recovery} />
            <p className="note" style={{ marginTop: "1.5rem" }}>
              <Icon name="alertC" />
              <span>
                Recovery timelines are typical ranges, not guarantees. Your course depends on
                severity and individual factors — follow your clinician’s guidance.
              </span>
            </p>
          </div>
        </section>
        <ProseBlock
          sections={[
            { title: "What Affects How Fast You Heal", content: `The phases above describe a typical course, but several factors move an individual’s ${lc} recovery faster or slower. Severity is the largest: a mild case and a severe one can differ by months. Age, overall health, and pre-existing conditions matter, as does how quickly treatment began — early, consistent care generally produces faster, more complete recovery. Adherence is decisive too; patients who complete prescribed therapy tend to recover more fully than those who stop early. Because of this variation, treat any timeline as a planning guide, not a promise, and let your clinician’s assessment of your specific progress set expectations.` },
            { title: `When ${name} Becomes a Long-Term Injury`, content: `Most patients improve substantially, but a meaningful minority develop lasting effects from ${lc} — chronic pain, reduced function, or permanent impairment. ${inj.recovery[inj.recovery.length - 1].desc} Lasting effects change everything about a claim: they introduce future medical costs, possible lost earning capacity, and a quantifiable impact on daily life. Documenting the transition from acute injury to chronic condition — through ongoing treatment records, functional assessments, and specialist opinions — is what captures that long-term reality. If your symptoms are not following the expected timeline, that is itself important information for both your care and your claim.` },
          ]}
        />
      </>
    );
    return {
      meta: {
        title: `${name} Recovery Time: How Long Does It Take to Heal?`,
        sub: `The typical ${lc} recovery timeline, from the acute phase through long-term outcomes.`,
        lead: `Most ${lc} recovery progresses through ${inj.recovery.length} phases. ${inj.recovery[0].phase} (${inj.recovery[0].time}): ${inj.recovery[0].desc} By the ${inj.recovery[inj.recovery.length - 2].phase.toLowerCase()} phase, many patients improve substantially — though the most severe cases can involve lasting effects, which significantly affect a claim.`,
        takeaways: inj.recovery.map((p) => `${p.phase} — ${p.time}`),
        faq: [
          { q: `How long does ${lc} take to heal?`, a: inj.recovery.map((p) => `${p.phase} (${p.time}): ${p.desc}`).join(" ") },
          { q: `Can ${lc} cause permanent damage?`, a: `In some cases, yes. ${inj.recovery[inj.recovery.length - 1].desc} Lasting effects are a major factor in claim value.` },
        ],
      },
      body,
    };
  }

  // settlement-factors
  const body = (
    <>
      <section className="section bg-white">
        <div className="container-4">
          <div className="section-head">
            <h2 className="section-h">What drives the value of a {lc} claim</h2>
          </div>
          <div className="card r">
            {inj.settlement.map((f, i) => (
              <div className="keyfact" style={{ marginBottom: "1rem" }} key={i}>
                <span className="cap-fact" style={{ display: "flex", gap: ".7rem", alignItems: "flex-start" }}>
                  <Icon name="check2" style={{ color: "#4a8c7e", flexShrink: 0, marginTop: 3 }} />
                  <span>
                    <b style={{ color: "var(--teal)" }}>{f.factor}.</b> {f.desc}
                  </span>
                </span>
              </div>
            ))}
          </div>
          <p className="note" style={{ marginTop: "1.25rem" }}>
            <Icon name="alertC" />
            <span>
              These are the factors that influence value — not an estimate of your specific
              claim. No one can value a claim without reviewing your records.
            </span>
          </p>
        </div>
      </section>
      <ProseBlock
        sections={[
          { title: `How Insurers Value (and Undervalue) a ${name} Claim`, content: `Insurance adjusters begin with your documented economic damages — medical bills and lost wages — and apply a multiplier for severity to estimate non-economic damages like pain and suffering. With ${lc}, the factors above push that multiplier up or down. The adjuster’s job, though, is to find reasons to keep it low: a gap in treatment, a pre-existing condition, a quick initial recovery, or any hint of shared fault. The first offer almost always lands well below true value precisely because it assumes you don’t know how the calculation works. Understanding the levers — and having the records to support each one — is what moves a claim from the lowball range toward full value.` },
          { title: "Why No One Can Quote You a Number Online", content: `Be wary of any tool or site that promises a specific dollar figure for ${lc} — your claim’s value depends on facts no calculator can see: the exact severity of your injury, your treatment course, whether surgery or permanence is involved, your state’s negligence and damage-cap rules, and the insurance available. Two people with the "same" injury can have very different claims. That is why a real valuation requires a review of your medical records and the specifics of your crash. Anyone quoting a precise number sight-unseen is guessing — the honest answer is a range that only narrows once the documentation is examined.` },
        ]}
      />
    </>
  );
  return {
    meta: {
      title: `${name} Settlement Factors: What Drives Claim Value`,
      sub: `The documented factors that increase or decrease the value of a ${lc} claim.`,
      lead: `The value of a ${lc} claim is driven by ${inj.settlement.length} main factors: ${inj.settlement.map((f) => f.factor.toLowerCase()).join(", ")}. Severity, surgery, permanence, and consistent documentation matter most. CasePort never estimates a specific claim value — only a full review of your medical records can do that.`,
      takeaways: inj.settlement.slice(0, 4).map((f) => f.factor),
      faq: inj.settlement.slice(0, 3).map((f) => ({ q: `Does ${f.factor.toLowerCase()} affect a ${lc} claim?`, a: f.desc })),
    },
    body,
  };
}

export function injurySpokeMeta(slug: string, spokeSlug: string) {
  const inj = injuries[slug];
  const spoke = injurySpokes.find((s) => s.slug === spokeSlug);
  if (!inj || !spoke) return null;
  const { meta } = spokeContent(inj, spokeSlug);
  return { title: `${meta.title} | CasePort`, description: meta.lead.slice(0, 180), canonical: `/injuries/${slug}/${spokeSlug}` };
}

export function InjurySpokePage({ slug, spokeSlug }: { slug: string; spokeSlug: string }) {
  const inj = injuries[slug];
  const spoke = injurySpokes.find((s) => s.slug === spokeSlug)!;
  const { meta, body } = spokeContent(inj, spokeSlug);

  return (
    <>
      <section className="page-intro">
        <div className="container-4">
          <Breadcrumbs
            items={[
              { label: "Injuries", href: "/injuries" },
              { label: inj.name, href: `/injuries/${slug}` },
              { label: spoke.label },
            ]}
          />
          <div className="eyebrow" style={{ marginTop: "1.25rem" }}>
            {inj.name} · {spoke.label}
          </div>
          <h1>{meta.title}</h1>
          <p className="section-sub" style={{ marginTop: ".9rem" }}>
            {meta.sub}
          </p>
          <Byline reviewerName={medReviewer.name} isMedical minutes={readingMinutes(meta.lead)} />
        </div>
      </section>

      <KeyTakeaways items={meta.takeaways} />

      <Capsule lead={meta.lead} />

      <SectionTOC />

      {body}

      <section className="section bg-cream">
        <div className="container-5">
          <div className="section-head">
            <h2 className="section-h">More on {inj.name}</h2>
          </div>
          <div className="grid grid-4">
            {injurySpokes
              .filter((s) => s.slug !== spokeSlug)
              .map((s) => (
                <Link key={s.slug} href={`/injuries/${slug}/${s.slug}`} className="card link r">
                  <h3>
                    {inj.name} {s.label}
                  </h3>
                </Link>
              ))}
            <Link href={`/injuries/${slug}`} className="card link r">
              <h3>{inj.name} Overview</h3>
            </Link>
          </div>
        </div>
      </section>

      <Expert bg="bg-white" medical />

      <Sources medical citeTitle={meta.title} citeUrl={`/injuries/${slug}/${spokeSlug}`} />

      <CTABand
        title={`Questions About Your ${inj.name} Claim?`}
        sub="A free, confidential case review takes minutes and costs nothing."
        btn="Get Free Case Review"
      />

      <ArticleOverlays />

      <JsonLd
        data={[
          medicalWebPage({ headline: meta.title, description: meta.lead.slice(0, 180) }),
          faqSchema(meta.faq.length ? meta.faq : [{ q: meta.title, a: meta.lead }]),
          breadcrumb([
            { name: "Home", url: "/" },
            { name: "Injuries", url: "/injuries" },
            { name: inj.name, url: `/injuries/${slug}` },
            { name: spoke.label, url: `/injuries/${slug}/${spokeSlug}` },
          ]),
          speakable(`/injuries/${slug}/${spokeSlug}`),
          ...orgGraph(),
        ]}
      />
    </>
  );
}
