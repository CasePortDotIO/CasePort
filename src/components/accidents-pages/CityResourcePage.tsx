import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Breadcrumbs, type Crumb } from "@/components/article/Breadcrumbs";
import { HeroPhoto } from "@/components/article/HeroPhoto";
import { Byline } from "@/components/article/Byline";
import { KeyTakeaways } from "@/components/article/KeyTakeaways";
import { Capsule } from "@/components/article/Capsule";
import { SectionTOC } from "@/components/article/SectionTOC";
import { Sources } from "@/components/article/Sources";
import { ArticleOverlays } from "@/components/article/ArticleOverlays";
import { ReportBlock } from "@/components/AccidentsReportBlock";
import { ActionKit } from "@/components/AccidentsActionKit";
import { FAQ } from "@/components/AccidentsFAQ";
import { CTABand } from "@/components/AccidentsCTABand";
import { JsonLd } from "@/components/AccidentsJsonLd";
import { article, faqSchema, breadcrumb, howto, speakable, orgGraph } from "@/lib/accidents-schema";
import { crashFor, type City } from "@/data";
import { reviewer } from "@/lib/accidents-constants";
import { readingMinutes } from "@/lib/accidents-article";
import { firstHourSteps } from "@/lib/accidents-firstHour";
import type { ResolvedState } from "@/lib/accidents-state";

const num = (v: string) => <span className="num">{v}</span>;

export const CITY_SPECIALS = ["what-to-do-after", "police-report", "dangerous-roads"];

export function cityResourceMeta(r: ResolvedState, city: City, kind: string) {
  const s = r.data;
  let title: string | null = null;
  if (kind === "what-to-do-after") title = `What to Do After an Accident in ${city.name}, ${s.abbr}`;
  else if (kind === "police-report") title = `Get Your ${city.name}, ${s.abbr} Crash Report — Step by Step`;
  else if (kind === "dangerous-roads") title = `Most Dangerous Roads in ${city.name}, ${s.abbr} — Crash Data`;
  if (!title) return null;
  return {
    title: `${title} | CasePort`,
    description: `Local accident guidance for ${city.name}, ${s.abbr}.`,
    canonical: `/accidents/${r.cityKey}/${city.slug}/${kind}`,
  };
}

export function CityResourcePage({
  r,
  city,
  kind,
}: {
  r: ResolvedState;
  city: City;
  kind: string;
}) {
  const s = r.data;
  const base: Crumb[] = [
    { label: "Accidents", href: "/accidents" },
    { label: s.name, href: `/accidents/${r.slug}` },
    { label: city.name, href: `/accidents/${r.cityKey}/${city.slug}` },
  ];
  const cr = crashFor(s.abbr);

  if (kind === "what-to-do-after") {
    const lead = `After a crash in ${city.name}: (1) call 911 and get police on scene; (2) photograph everything before it moves; (3) get witness names and numbers; (4) say nothing that admits fault and give no recorded statement; (5) see a doctor the same day; and (6) request your ${s.name} crash report and preserve any nearby video within 72 hours. ${s.name} gives you ${s.statuteYears} year${s.statuteYears > 1 ? "s" : ""} to file, but evidence disappears in days.`;
    const faqs = [
      { q: `What is the first thing to do after a car accident in ${city.name}?`, a: `Call 911 and request police, even for a minor crash. The police report is the single most important document in your claim. Then, if you can do so safely, photograph the scene before vehicles are moved.` },
      { q: `Should I go to the hospital after a ${city.name} accident even if I feel fine?`, a: `Yes. Adrenaline masks injuries, and conditions like concussions and internal injuries can take hours or days to appear. A same-day medical record also creates the documentation your claim depends on.` },
      { q: `How do I get my crash report in ${city.name}?`, a: `Request it from ${cr.a}. ${cr.h}` },
    ];
    const title = `What to do after an accident in ${city.name}, ${s.abbr}`;
    return (
      <>
        <HeroPhoto
          crumbs={<Breadcrumbs items={[...base, { label: "What To Do After" }]} />}
          eyebrow={`After an accident · ${city.name}`}
          title={title}
          sub="The exact steps to take in the minutes, hours, and days after a crash — and the scripts to send today."
          scene={`${city.name}, ${s.abbr}`}
          img="/accidents/img/evidence.png"
          byline={<Byline reviewerName={reviewer.name} minutes={readingMinutes(lead)} onDark />}
        />
        <KeyTakeaways items={["Call 911", "Document", "Guard your words", "Act in 72 hours"]} />
        <Capsule heading={`After an accident in ${city.name}, do these six things`} lead={lead} />
        <SectionTOC />
        <section className="section bg-cream">
          <div className="container-4">
            <div className="section-head">
              <h2 className="section-h">The first hour, step by step</h2>
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
          </div>
        </section>
        <ActionKit bg="bg-white" title={`Send these today — ${city.name} Action Kit`} />
        <ReportBlock state={s.abbr} name={s.name} statuteYears={s.statuteYears} bg="bg-cream" />
        <FAQ faqs={faqs} bg="bg-white" title="Frequently Asked Questions" />
        <Sources citeTitle={`What to Do After an Accident in ${city.name}, ${s.abbr}`} citeUrl={`/accidents/${r.cityKey}/${city.slug}/what-to-do-after`} />
        <CTABand title={`Injured in ${city.name}?`} sub="Get a free, confidential case review — understand what your accident is worth before you talk to any insurer." btn="Get Free Case Review" />
        <ArticleOverlays />
        <JsonLd
          data={[
            howto({ name: `What to do after an accident in ${city.name}`, description: `Step-by-step actions to protect your claim after a crash in ${city.name}.`, steps: firstHourSteps.map((st) => ({ name: st[0], text: st[1] })) }),
            faqSchema(faqs),
            breadcrumb([{ name: "Home", url: "/" }, ...base.map((b) => ({ name: b.label, url: b.href! })), { name: "What To Do After", url: `/accidents/${r.cityKey}/${city.slug}/what-to-do-after` }]),
            speakable(`/accidents/${r.cityKey}/${city.slug}/what-to-do-after`),
            ...orgGraph(),
          ]}
        />
      </>
    );
  }

  if (kind === "police-report") {
    const lead = `To get your crash report after an accident in ${city.name}, request it from ${cr.a}. ${cr.h} Reports are typically ready 3–10 business days after the crash. You will usually need the date, location, and the parties' names (and the report number, if you have it).`;
    const faqs = [
      { q: `How much does a ${city.name} crash report cost?`, a: `Fees vary by agency, typically from free to about $20. ${cr.a} will list the current fee and accepted payment methods. Confirm before you request.` },
      { q: `How long does it take to get a crash report in ${s.name}?`, a: `Most reports are available 3 to 10 business days after the crash, once the responding officer files it. Online portals are usually fastest.` },
      { q: `Can I get the report if I was not the driver?`, a: `Parties to the crash — including passengers and, in many states, their representatives — can request the report. The agency will specify who is eligible and what ID is required.` },
    ];
    return (
      <>
        <HeroPhoto
          crumbs={<Breadcrumbs items={[...base, { label: "Crash Report" }]} />}
          eyebrow={`Crash report · ${city.name}`}
          title={`How to get your ${city.name} crash report`}
          sub="The exact agency, the steps, and a ready-to-send request — so you have the most important document in your claim."
          scene={`${city.name}, ${s.abbr}`}
          img="/accidents/img/city.png"
          byline={<Byline reviewerName={reviewer.name} minutes={readingMinutes(lead)} onDark />}
        />
        <KeyTakeaways items={["Where", "How", "When", "Why it matters"]} />
        <Capsule heading={`Where to get your ${city.name}, ${s.abbr} crash report`} lead={lead} />
        <ReportBlock state={s.abbr} name={s.name} statuteYears={s.statuteYears} bg="bg-cream" />
        <ActionKit bg="bg-white" title="Copy-paste your crash-report request" />
        <FAQ faqs={faqs} bg="bg-cream" title={`Crash Report FAQ — ${city.name}`} />
        <Sources citeTitle={`Get Your ${city.name}, ${s.abbr} Crash Report — Step by Step`} citeUrl={`/accidents/${r.cityKey}/${city.slug}/police-report`} />
        <CTABand title="Have your report? Know what it’s worth." sub={`A free case review reads your crash report and explains what your ${city.name} claim may be worth — at no cost.`} btn="Get Free Case Review" />
        <ArticleOverlays />
        <JsonLd
          data={[
            howto({ name: `How to get your crash report in ${city.name}`, description: `Steps to obtain your ${s.name} crash/police report.`, steps: [{ name: "Identify the agency", text: `Contact ${cr.a}.` }, { name: "Submit your request", text: cr.h }, { name: "Pay any fee and collect the report", text: "Reports are usually ready 3–10 business days after the crash." }] }),
            faqSchema(faqs),
            breadcrumb([{ name: "Home", url: "/" }, ...base.map((b) => ({ name: b.label, url: b.href! })), { name: "Crash Report", url: `/accidents/${r.cityKey}/${city.slug}/police-report` }]),
            speakable(`/accidents/${r.cityKey}/${city.slug}/police-report`),
            ...orgGraph(),
          ]}
        />
      </>
    );
  }

  // dangerous-roads
  const lead = `${city.name} carries a ${city.accidentRate.toLowerCase()} accident rate for its ${city.population} residents. Its most dangerous corridors are driven by the factors below — the same high-traffic interchanges and arterials where serious-injury crashes concentrate. ${s.name}'s ${s.label.toLowerCase()} rule and ${s.statuteYears}-year filing deadline govern any claim arising on these roads.`;
  const drFacts: [string, string][] = city.keyFacts.map((f) => {
    const p = f.split(/[—–:]/);
    return [(p[0] || f).trim(), p.length > 1 ? p.slice(1).join(" ").trim() : ""];
  });
  return (
    <>
      <HeroPhoto
        crumbs={<Breadcrumbs items={[...base, { label: "Dangerous Roads" }]} />}
        eyebrow={`Local crash data · ${city.name}`}
        title={`The most dangerous roads in ${city.name}, ${s.abbr}`}
        sub={`Where ${city.name} crashes cluster — and why these corridors drive the city's injury claims.`}
        scene={`${city.name}, ${s.abbr}`}
        img="/accidents/img/road.png"
        byline={<Byline reviewerName={reviewer.name} minutes={readingMinutes(lead)} onDark />}
      />
      <KeyTakeaways items={drFacts.map((f) => f[0])} />
      <Capsule
        heading={`${city.name}'s highest-risk crash corridors`}
        lead={lead}
        table={{
          label: `${city.name} crash-risk snapshot`,
          head: ["Factor", "Detail"],
          rows: [
            ["Accident rate", city.accidentRate],
            ["Population", num(city.population)],
            ["State fatal-crash rate", num(`${s.fatalCrashRate} / 100K`)],
            ["Uninsured-motorist rate", num(`${s.uninsuredRate}%`)],
            [`Leading cause (${s.abbr})`, s.topCause],
          ],
        }}
      />
      <section className="section bg-white" style={{ paddingTop: "2rem" }}>
        <div className="container-4">
          <p className="sample-label">
            Illustrative local profile · verify current DOT crash data before relying on specific figures
          </p>
        </div>
      </section>
      <section className="section bg-cream">
        <div className="container-5">
          <div className="section-head">
            <h2 className="section-h">Other {s.name} cities</h2>
          </div>
          <div className="city-col" style={{ maxWidth: "46rem" }}>
            <div className="city-link-wrap" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".65rem" }}>
              {/* sibling cities handled by caller via city list */}
              <SiblingCities r={r} citySlug={city.slug} />
            </div>
          </div>
        </div>
      </section>
      <Sources citeTitle={`Most Dangerous Roads in ${city.name}, ${s.abbr} — Crash Data`} citeUrl={`/accidents/${r.cityKey}/${city.slug}/dangerous-roads`} />
      <CTABand title="Hurt on one of these roads?" sub={`Get a free case review to understand your rights and what your ${city.name} claim may be worth.`} btn="Get Free Case Review" />
      <ArticleOverlays />
      <JsonLd
        data={[
          article({ headline: `The Most Dangerous Roads in ${city.name}, ${s.abbr}`, description: `${city.name} crash-risk corridors and local accident data.` }),
          breadcrumb([{ name: "Home", url: "/" }, ...base.map((b) => ({ name: b.label, url: b.href! })), { name: "Dangerous Roads", url: `/accidents/${r.cityKey}/${city.slug}/dangerous-roads` }]),
          speakable(`/accidents/${r.cityKey}/${city.slug}/dangerous-roads`),
          ...orgGraph(),
        ]}
      />
    </>
  );
}

import { cityData } from "@/data";
function SiblingCities({ r, citySlug }: { r: ResolvedState; citySlug: string }) {
  const sd = cityData[r.cityKey];
  return (
    <>
      {sd.cities
        .filter((c) => c.slug !== citySlug)
        .map((c) => (
          <Link key={c.slug} href={`/accidents/${r.cityKey}/${c.slug}/dangerous-roads`} className="city-link">
            {c.name}
          </Link>
        ))}
    </>
  );
}
