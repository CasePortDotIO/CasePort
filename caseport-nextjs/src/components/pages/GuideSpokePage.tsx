import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Breadcrumbs } from "@/components/article/Breadcrumbs";
import { HeroPhoto } from "@/components/article/HeroPhoto";
import { Byline } from "@/components/article/Byline";
import { KeyTakeaways } from "@/components/article/KeyTakeaways";
import { Capsule } from "@/components/article/Capsule";
import { SectionTOC } from "@/components/article/SectionTOC";
import { Expert } from "@/components/article/Expert";
import { Sources } from "@/components/article/Sources";
import { ArticleOverlays } from "@/components/article/ArticleOverlays";
import { TakeHome } from "@/components/widgets/TakeHome";
import { FAQ } from "@/components/FAQ";
import { CTABand } from "@/components/CTABand";
import { JsonLd } from "@/components/JsonLd";
import { article, medicalWebPage, faqSchema, breadcrumb, howto, speakable, orgGraph } from "@/lib/schema";
import { guidePillar, guideSpokeDefs, accidentTypes, guides, hasGuideSpokes, medReviewer } from "@/data";
import { reviewer } from "@/lib/constants";
import { guideScene } from "@/lib/guide";
import { readingMinutes } from "@/lib/article";
import { firstHourSteps } from "@/lib/firstHour";

interface SpokeMeta {
  h1: string;
  title: string;
  sub: string;
  lead: string;
  facts: [string, string][];
  faq: { q: string; a: string }[];
  ctaTitle: string;
  ctaSub: string;
}

const STATUTE_BARS: [string, string, number][] = [
  ["1 year", "KY · LA · TN", 18],
  ["2 years", "VA · GA · TX · CA · FL", 40],
  ["3 years", "MD · DC · NY · WA", 62],
  ["4–6 years", "NE · WY · UT · MO · ME · ND", 100],
];

function spokeContent(slug: string, spokeSlug: string, name: string, lc: string, avg: number): { meta: SpokeMeta; body: React.ReactNode } {
  if (spokeSlug === "what-to-do") {
    return {
      meta: {
        h1: `What To Do After a ${name}`,
        title: `What To Do After a ${name} — Step by Step`,
        sub: `The exact steps to take in the minutes and days after a ${lc} — to protect your health and your claim.`,
        lead: `After a ${lc}: make sure everyone is safe and call 911; get a police report; photograph everything before it moves; collect witness names and numbers; do not admit fault or say "I’m fine"; see a doctor the same day; and preserve any nearby video within 72 hours. These first steps matter more than almost anything that follows — evidence fades within days, long before any filing deadline.`,
        facts: [
          ["Call 911 & get a report", "The police report anchors the entire claim."],
          ["Document everything", "Photos, video, witnesses, and the other party’s info."],
          ["Guard your words", "No fault admissions, no recorded statement to the insurer."],
          ["Act within 72 hours", "Surveillance footage is often overwritten by then."],
        ],
        ctaTitle: `Just Had a ${name}?`,
        ctaSub: "See a doctor first. Then get a free, confidential case review to protect your rights — at no cost.",
        faq: [
          { q: `What is the first thing to do after a ${lc}?`, a: `Ensure everyone is safe and call 911 — request police even for a minor incident. The official report is the single most important document in your claim. Then, if it is safe, photograph the scene before anything is moved.` },
          { q: `Should I see a doctor after a ${lc} even if I feel fine?`, a: `Yes. Adrenaline masks injuries, and some conditions take hours or days to appear. A same-day medical record also connects your injuries to the event, which protects a claim.` },
          { q: `What should I not do after a ${lc}?`, a: `Do not admit fault, apologize, or say "I’m fine"; do not give the other side’s insurer a recorded statement; and do not accept a quick settlement before you know the full extent of your injuries.` },
        ],
      },
      body: (
        <section className="section bg-white">
          <div className="container-4">
            <div className="section-head">
              <h2 className="section-h">The first hour after a {lc}, step by step</h2>
            </div>
            <div className="tl">
              {firstHourSteps.map((st, i) => (
                <div className="tl-step r" key={i}>
                  <div className="tl-num">{i + 1}</div>
                  <div>
                    <h3>{st[0]}</h3>
                    <p>{st[1]}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="note" style={{ marginTop: "1.5rem" }}>
              <Icon name="alertC" />
              <span>If anyone is seriously hurt, call 911 first. This is general guidance, not legal or medical advice.</span>
            </p>
          </div>
        </section>
      ),
    };
  }

  if (spokeSlug === "settlement-amounts") {
    const rng = (a: number, b: number) => `$${Math.round(avg * a)}K–$${Math.round(avg * b)}K`;
    const rows: [string, string, string][] = [
      ["Minor", "Soft-tissue, full recovery in weeks", rng(0.2, 0.5)],
      ["Moderate", "Fractures, ongoing treatment", rng(0.6, 1.3)],
      ["Severe", "Permanent impairment, surgery", rng(1.6, 3.2)],
      ["Catastrophic", "Disability, lifelong care", rng(3.5, 8)],
    ];
    return {
      meta: {
        h1: `${name} Settlement Amounts`,
        title: `${name} Settlement Amounts — What Claims Are Worth`,
        sub: `How ${lc} settlements are calculated, the typical ranges by severity, and what you actually take home.`,
        lead: `There is no flat ${lc} settlement figure — value is driven by injury severity, clear liability, and your state’s negligence rule, which is applied before any payout. Adjusters multiply economic damages (medical bills, lost wages) by roughly 1.5x–5x for severity, then your state’s fault rule adjusts the result. First offers commonly arrive 40–60% below real value, and what you keep depends further on the attorney fee and any medical liens.`,
        facts: [
          ["Severity drives value", "Minor strains and catastrophic injuries are worlds apart."],
          ["The multiplier method", "Economic damages × 1.5x–5x estimates pain and suffering."],
          ["Your state’s rule applies", "Fault reduces — or in some states bars — recovery."],
          ["Net ≠ gross", "Fees and liens come out; use the calculator below."],
        ],
        ctaTitle: `What Is Your ${name} Claim Worth?`,
        ctaSub: "No one can value a claim without the records. Get a free, confidential review to find out.",
        faq: [
          { q: `How much is the average ${lc} settlement?`, a: `There is no reliable "average" because value depends on severity, liability, and state law. Minor injuries may settle in the low five figures; severe and catastrophic cases reach six and seven figures. The multiplier method (economic damages × 1.5x–5x) drives the non-economic portion.` },
          { q: `How is a ${lc} settlement calculated?`, a: `Adjusters total your economic damages (medical bills, lost wages) and multiply by roughly 1.5x to 5x based on severity to estimate pain and suffering. Your state’s negligence rule is then applied, reducing or barring recovery based on your share of fault.` },
          { q: `Why is the first settlement offer so low?`, a: `Insurers expect negotiation, so first offers commonly come in 40–60% below real value — often before your full injuries are known. Accepting ends the claim permanently, so it is wise to understand complete value, including future care, first.` },
        ],
      },
      body: (
        <section className="section bg-white">
          <div className="container-4">
            <div className="section-head">
              <h2 className="section-h">{name} settlement ranges by severity</h2>
            </div>
            <div className="table-wrap">
              <table className="data">
                <thead>
                  <tr>
                    <th>Severity</th>
                    <th>What it looks like</th>
                    <th>Illustrative range</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i}>
                      <td className="strong">{r[0]}</td>
                      <td>{r[1]}</td>
                      <td className="num">{r[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="sample-label" style={{ marginTop: "1rem" }}>
              Illustrative only · your state’s fault rule is applied before any payout
            </p>
          </div>
        </section>
      ),
    };
  }

  if (spokeSlug === "do-i-need-a-lawyer") {
    return {
      meta: {
        h1: `Do I Need a Lawyer for a ${name}?`,
        title: `Do I Need a Lawyer for a ${name}?`,
        sub: "An honest answer: when representation helps, when it may not, and why asking costs nothing.",
        lead: `You are not required to hire a lawyer for a ${lc}, but representation usually increases outcomes when injuries are serious, liability is disputed, or your state’s fault rule is harsh — even after the fee. Because personal-injury lawyers work on contingency (no upfront cost, no fee unless they win), a free consultation lets you find out where your case stands at no risk. For a truly minor, no-injury, clear-fault incident with a fair offer, you may be able to handle it yourself.`,
        facts: [
          ["Serious or lasting injury", "Representation strongly recommended."],
          ["Disputed liability", "A lawyer protects you from a shifted-fault denial."],
          ["Contingency = no upfront cost", "You pay a fee only from a recovery."],
          ["Free to ask", "A consultation costs nothing and carries no obligation."],
        ],
        ctaTitle: "Not Sure If You Need a Lawyer?",
        ctaSub: `Find out in minutes. A free, confidential case review tells you exactly where your ${lc} claim stands.`,
        faq: [
          { q: `Do I need a lawyer for a ${lc}?`, a: `Not always, but it usually helps when there are injuries, disputed fault, or a harsh state fault rule. Represented claimants often net more even after fees, because insurers value unrepresented claims lower. Since consultations are free and lawyers work on contingency, asking costs nothing.` },
          { q: `How much does a ${lc} lawyer cost?`, a: `Most work on contingency: about one-third (33%) of the recovery, often around 40% if the case goes to trial. You pay no upfront fee, and if there is no recovery you generally owe no attorney fee. Case costs are separate.` },
          { q: `Is it worth getting a lawyer for a minor ${lc}?`, a: `For a truly minor incident with no injuries, clear liability, and a fair offer, you may not need one. But if there is any injury, treatment, or fault dispute, a free consultation is worth it to avoid leaving money on the table.` },
        ],
      },
      body: (
        <section className="section bg-white">
          <div className="container-4">
            <div className="prose">
              <h2>When you likely do</h2>
              <p>Representation tends to pay for itself when injuries are serious or lasting, when liability is disputed, when multiple parties or insurers are involved, or when you are in a harsh-fault state. Studies and industry data consistently show represented claimants net more even after fees, because insurers value unrepresented claims lower and use tactics that counsel neutralizes.</p>
              <h2>When you might not</h2>
              <p>For a truly minor {lc} with no injuries, a clear-liability property-damage-only claim, and a fair early offer, you may be able to handle it yourself. The honest test: if there is any injury, any treatment, or any fault dispute, a free consultation costs nothing and clarifies the stakes.</p>
              <h2>It costs nothing to ask</h2>
              <p>Personal-injury lawyers work on contingency — no upfront fee, and no attorney fee unless they recover for you. A consultation is free and carries no obligation, so the downside of asking is zero.</p>
            </div>
          </div>
        </section>
      ),
    };
  }

  // statute-of-limitations
  return {
    meta: {
      h1: `How Long Do I Have to File a ${name} Claim?`,
      title: `How Long to File a ${name} Claim — Deadlines by State`,
      sub: `Your filing deadline (statute of limitations) for a ${lc} — why it varies, and why evidence expires long before it does.`,
      lead: `The deadline to file a ${lc} lawsuit — the statute of limitations — is set by each state and typically runs 1 to 6 years from the date of injury (most commonly 2–3). Miss it and your claim is permanently barred, no matter how strong. But evidence disappears far sooner: surveillance footage within 72 hours, witness memory within weeks. Acting early protects both your deadline and the proof your claim depends on. Government claims often carry much shorter notice windows.`,
      facts: [
        ["1–6 years by state", "Most are 2–3 years from the date of injury."],
        ["Hard cutoff", "Miss it and the claim is barred permanently."],
        ["Evidence expires first", "Footage and witnesses fade within days to weeks."],
        ["Government claims differ", "Short notice windows — sometimes months."],
      ],
      ctaTitle: `Worried About Your ${name} Deadline?`,
      ctaSub: "Don’t risk it. A free, confidential case review confirms your deadline and what to do now.",
      faq: [
        { q: `How long do I have to file a ${lc} claim?`, a: `It depends on your state — typically 1 to 6 years from the date of injury, most commonly 2 to 3. The deadline is a hard cutoff: miss it and the claim is permanently barred. Check your state’s page for the exact figure.` },
        { q: `What happens if I miss the deadline to file?`, a: `If you file after the statute of limitations expires, the court will dismiss the case and you lose the right to recover, regardless of how clear the liability is. A few narrow exceptions exist, but you cannot rely on them.` },
        { q: `When does the filing clock start?`, a: `Usually on the date of the injury. Some states use a "discovery rule" that starts it when the harm was discovered, and claims involving minors may be paused until adulthood. Government claims often require notice within months.` },
      ],
    },
    body: (
      <section className="section bg-white">
        <div className="container-4">
          <div className="section-head">
            <h2 className="section-h">Filing deadlines vary by state</h2>
          </div>
          <div className="card" style={{ maxWidth: "42rem" }}>
            {STATUTE_BARS.map((r, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "7rem 1fr", gap: "1rem", alignItems: "center", marginBottom: ".75rem" }}>
                <div style={{ fontFamily: "var(--code)", fontSize: ".8rem", fontWeight: 700, color: "var(--ink)" }}>{r[0]}</div>
                <div>
                  <div className="cd-bar" style={{ height: 14 }}>
                    <div style={{ width: r[2] + "%", background: "linear-gradient(90deg,#1a4a5a,#4a8c7e)" }}></div>
                  </div>
                  <div style={{ fontSize: ".74rem", color: "var(--text-4)", marginTop: ".25rem" }}>{r[1]}</div>
                </div>
              </div>
            ))}
            <p className="sample-label" style={{ marginTop: ".5rem" }}>
              Illustrative · confirm your exact deadline on the state page
            </p>
          </div>
          <div style={{ marginTop: "1.5rem" }}>
            <Link href="/accidents/california" className="card-link">
              Find your state’s exact deadline <Icon name="arrow" />
            </Link>
          </div>
        </div>
      </section>
    ),
  };
}

function nameFor(pillarSlug: string) {
  const at = accidentTypes[pillarSlug];
  if (at) return at.category;
  if (guides[pillarSlug]) return guides[pillarSlug].name;
  return guidePillar(pillarSlug)?.name || pillarSlug;
}

export function guideSpokeMeta(pillarSlug: string, spokeSlug: string) {
  if (!hasGuideSpokes(pillarSlug)) return null;
  if (!guideSpokeDefs.some((s) => s.slug === spokeSlug)) return null;
  const name = nameFor(pillarSlug);
  const at = accidentTypes[pillarSlug];
  const avg = at?.stats?.[0]?.value && /(\d+)/.exec(at.stats[0].value) ? parseInt(/(\d+)/.exec(at.stats[0].value)![1], 10) : 50;
  const { meta } = spokeContent(pillarSlug, spokeSlug, name, name.toLowerCase(), avg);
  return { title: `${meta.title} | CasePort`, description: meta.lead.slice(0, 180), canonical: `/guide/${pillarSlug}/${spokeSlug}` };
}

export function GuideSpokePage({ pillarSlug, spokeSlug }: { pillarSlug: string; spokeSlug: string }) {
  const p = guidePillar(pillarSlug)!;
  const spoke = guideSpokeDefs.find((s) => s.slug === spokeSlug)!;
  const at = accidentTypes[pillarSlug];
  const name = nameFor(pillarSlug);
  const lc = name.toLowerCase();
  const avg = at?.stats?.[0]?.value && /(\d+)/.exec(at.stats[0].value) ? parseInt(/(\d+)/.exec(at.stats[0].value)![1], 10) : 50;
  const { meta, body } = spokeContent(pillarSlug, spokeSlug, name, lc, avg);
  const isMedical = pillarSlug === "medical-malpractice";
  const takeaways = meta.facts.map((f) => f[0]);

  return (
    <>
      <HeroPhoto
        crumbs={<Breadcrumbs items={[{ label: "Guide", href: "/guide" }, { label: name, href: `/guide/${pillarSlug}` }, { label: spoke.label }]} />}
        eyebrow={`${name} · National`}
        title={meta.h1}
        sub={meta.sub}
        scene={p.scene}
        img={guideScene(pillarSlug)}
        byline={<Byline reviewerName={isMedical ? medReviewer.name : reviewer.name} isMedical={isMedical} minutes={readingMinutes(meta.lead)} onDark />}
      />

      <KeyTakeaways items={takeaways} />

      <Capsule lead={meta.lead} />

      <SectionTOC />

      {body}

      {spokeSlug === "settlement-amounts" && <TakeHome bg="bg-warm" />}

      <section className="section bg-white">
        <div className="container-5">
          <div className="section-head">
            <h2 className="section-h">More on {name}</h2>
          </div>
          <div className="grid grid-4">
            {guideSpokeDefs
              .filter((s) => s.slug !== spokeSlug)
              .map((s) => (
                <Link key={s.slug} href={`/guide/${pillarSlug}/${s.slug}`} className="card link r">
                  <h3>{name}: {s.label}</h3>
                  <p style={{ fontSize: ".9rem", marginTop: ".4rem" }}>{s.note}</p>
                </Link>
              ))}
            <Link href={`/guide/${pillarSlug}`} className="card link r">
              <h3>{name} — full guide</h3>
              <p style={{ fontSize: ".9rem", marginTop: ".4rem" }}>The complete national overview.</p>
            </Link>
          </div>
        </div>
      </section>

      <Expert bg="bg-cream" medical={isMedical} />

      <FAQ faqs={meta.faq} bg="bg-cream" title="Frequently Asked Questions" />

      <Sources medical={isMedical} citeTitle={meta.title} citeUrl={`/guide/${pillarSlug}/${spokeSlug}`} />

      <CTABand title={meta.ctaTitle} sub={meta.ctaSub} btn="Get Free Case Review" />

      <ArticleOverlays />

      <JsonLd
        data={[
          isMedical
            ? medicalWebPage({ headline: meta.title, description: meta.lead.slice(0, 180) })
            : article({ headline: meta.title, description: meta.lead.slice(0, 180) }),
          faqSchema(meta.faq),
          breadcrumb([
            { name: "Home", url: "/" },
            { name: "Guide", url: "/guide" },
            { name, url: `/guide/${pillarSlug}` },
            { name: spoke.label, url: `/guide/${pillarSlug}/${spokeSlug}` },
          ]),
          ...(spokeSlug === "what-to-do"
            ? [howto({ name: `What to do after a ${lc}`, description: `Step-by-step actions to protect a ${lc} claim.`, steps: firstHourSteps.map((st) => ({ name: st[0], text: st[1] })) })]
            : []),
          speakable(`/guide/${pillarSlug}/${spokeSlug}`),
          ...orgGraph(),
        ]}
      />
    </>
  );
}
