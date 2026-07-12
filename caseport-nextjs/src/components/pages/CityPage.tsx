import Link from "next/link";
import { Icon } from "@/components/Icon";
import { Breadcrumbs, type Crumb } from "@/components/article/Breadcrumbs";
import { HeroPhoto } from "@/components/article/HeroPhoto";
import { Byline } from "@/components/article/Byline";
import { KeyTakeaways } from "@/components/article/KeyTakeaways";
import { Capsule } from "@/components/article/Capsule";
import { SectionTOC } from "@/components/article/SectionTOC";
import { Expert } from "@/components/article/Expert";
import { Sources } from "@/components/article/Sources";
import { ArticleOverlays } from "@/components/article/ArticleOverlays";
import { SettlementEstimator } from "@/components/widgets/SettlementEstimator";
import { ReportBlock } from "@/components/ReportBlock";
import { ActionKit } from "@/components/ActionKit";
import { FAQ } from "@/components/FAQ";
import { CTABand } from "@/components/CTABand";
import { JsonLd } from "@/components/JsonLd";
import { article, faqSchema, breadcrumb, howto, speakable, orgGraph } from "@/lib/schema";
import { negColor, accidentTypes, cityAccidentTypes, stateLawFor, type City } from "@/data";
import { reviewer, sceneFor } from "@/lib/constants";
import { lcFirst } from "@/lib/text";
import { readingMinutes } from "@/lib/article";
import { firstHourSteps } from "@/lib/firstHour";
import type { ResolvedState } from "@/lib/state";

const num = (v: string) => <span className="num">{v}</span>;

const CITY_SPECIALS: [string, string, string, string][] = [
  ["what-to-do-after", "doc", "What to Do After an Accident in", "The exact steps and copy-paste scripts for the first hours."],
  ["police-report", "file", "Get Your", "The exact agency, process, and a ready-to-send request."],
  ["dangerous-roads", "pin", "Most Dangerous Roads in", "Where {city} crashes cluster — local crash data."],
];

export function cityMeta(r: ResolvedState, city: City, typeSlug?: string) {
  const s = r.data;
  const typeObj = typeSlug ? accidentTypes[typeSlug] : null;
  const typeName = typeObj ? typeObj.category : "Accidents";
  const title = typeObj
    ? `${typeName} in ${city.name}, ${s.abbr}`
    : `Accidents in ${city.name}, ${s.abbr}`;
  return {
    title: `${title} — Local Accident Guide | CasePort`,
    description: `Local accident data and ${s.name} law for ${city.name}. ${s.label}, ${s.statuteYears}-year filing deadline.`,
    canonical: `/accidents/${r.cityKey}/${city.slug}${typeSlug ? "/" + typeSlug : ""}`,
  };
}

export function CityPage({
  r,
  city,
  typeSlug,
}: {
  r: ResolvedState;
  city: City;
  typeSlug?: string;
}) {
  const s = r.data;
  const typeObj = typeSlug ? accidentTypes[typeSlug] : null;
  const typeName = typeObj ? typeObj.category : "Accidents";

  const crumbItems: Crumb[] = [
    { label: "Accidents", href: "/accidents" },
    { label: s.name, href: `/accidents/${r.slug}` },
    { label: city.name, href: `/accidents/${r.cityKey}/${city.slug}` },
  ];
  if (typeObj) crumbItems.push({ label: typeName });

  const title = typeObj
    ? `${typeName} in ${city.name}, ${s.abbr}`
    : `Accidents in ${city.name}, ${s.abbr}`;

  const lead =
    (typeObj
      ? `If you were injured in a ${typeName.toLowerCase()} in ${city.name}, `
      : `If you were in an accident in ${city.name}, `) +
    `${s.name} law controls your claim: ${s.name} uses the ${s.label.toLowerCase()} rule (${lcFirst(
      s.faultThreshold
    )}), and you have ${s.statuteYears} year${s.statuteYears > 1 ? "s" : ""} from the date of injury to file. ${city.name} is a ${city.accidentRate.toLowerCase()}-accident-rate area, so evidence and witnesses move fast — the first 72 hours matter most.`;

  const minutes = readingMinutes(lead);

  const table = typeObj
    ? {
        label: `Typical ${typeObj.category.toLowerCase()} settlement range by injury severity`,
        head: ["Injury severity", "What it looks like", "Illustrative range"],
        rows: severityRows(typeObj),
      }
    : {
        label: `${city.name} at a glance`,
        head: ["Factor", "Detail"],
        rows: [
          ["City", `${city.name}, ${s.abbr}`],
          ["Population", num(city.population)],
          ["Accident rate", city.accidentRate],
          ["Negligence rule", s.label],
          ["Filing deadline", num(`${s.statuteYears} year${s.statuteYears > 1 ? "s" : ""}`)],
          [`Avg ${s.name} settlement`, num(`$${s.avgSettlement}K`)],
        ],
      };

  const law = stateLawFor(s.abbr);
  const cFaqs = [
    {
      q: `What should I do after a ${typeName.toLowerCase()} in ${city.name}?`,
      a: `Call 911 and request police. Photograph everything — vehicles, the scene, road conditions, and your injuries. Collect witness names and numbers. Do not admit fault or give a recorded statement to any insurer. Seek medical care the same day, then contact a representative within 24 hours. In ${city.name}, surveillance footage is often overwritten within 72 hours, so act fast.`,
    },
    {
      q: `How long do I have to file a claim after an accident in ${city.name}?`,
      a: law.statute_of_limitations.direct_answer,
    },
    { q: `What negligence rule applies to a ${city.name} accident?`, a: law.fault_rules.direct_answer },
    {
      q: `How much is a ${typeName.toLowerCase()} claim worth in ${city.name}?`,
      a: `There is no flat figure — value depends on injury severity, clear liability, and ${s.name}'s ${s.label.toLowerCase()} rule, which is applied before any payment. The average ${s.name} settlement is around $${s.avgSettlement}K, but severe and catastrophic injuries recover multiples of that. Use the estimator above for an illustrative range.`,
    },
  ];

  return (
    <>
      <HeroPhoto
        crumbs={<Breadcrumbs items={crumbItems} />}
        eyebrow={`${typeName} · ${city.name}`.toUpperCase()}
        title={title}
        sub={`Local accident data, ${s.name} law, and what to do immediately after an accident in ${city.name}.`}
        scene={`${city.name}, ${s.abbr}`}
        img={typeObj ? sceneFor(typeSlug!) : "/accidents/img/city.png"}
        byline={<Byline reviewerName={reviewer.name} minutes={minutes} onDark />}
      />

      <KeyTakeaways
        items={["Controlling law", "Filing deadline", "Fault threshold", "Local accident rate"]}
      />

      <Capsule heading={`${typeName} claims in ${city.name}, ${s.abbr}`} lead={lead} table={table} />

      <SectionTOC />

      {/* city overview */}
      <section className="section bg-cream">
        <div className="container-4">
          <div className="section-head">
            <h2 className="section-h">
              {typeName} in {city.name}
            </h2>
          </div>
          <div className="card r">
            <p style={{ fontSize: "1.05rem", color: "var(--text-2)", lineHeight: 1.7, marginBottom: "1.25rem" }}>
              {city.description}
            </p>
            <h3 style={{ fontFamily: "var(--sans)", fontSize: "1.2rem", color: "var(--teal)", fontWeight: 700, marginBottom: ".9rem" }}>
              Key Accident Factors in {city.name}
            </h3>
            <ul className="keyfacts" style={{ listStyle: "none" }}>
              {city.keyFacts.map((f, i) => (
                <li className="keyfact" key={i}>
                  <Icon name="chev" style={{ color: "#4a8c7e", width: 18, height: 18 }} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* state law applies */}
      <section className="section bg-white">
        <div className="container-4">
          <div className="section-head">
            <h2 className="section-h">
              {s.name} Law Applies in {city.name}
            </h2>
          </div>
          <div className="law-callout">
            <div className="law-box sage">
              <h3>Negligence Rule</h3>
              <p>
                <strong>{s.label}.</strong> {s.faultThreshold}.
              </p>
              <Link href={`/accidents/${r.slug}/fault-rules`}>
                Learn more <Icon name="arrow" />
              </Link>
            </div>
            <div className="law-box terra">
              <h3>Statute of Limitations</h3>
              <p>
                You have{" "}
                <strong>
                  {s.statuteYears} year{s.statuteYears > 1 ? "s" : ""}
                </strong>{" "}
                to file from the date of your accident in {s.name}.
              </p>
              <Link href={`/accidents/${r.slug}/statute-of-limitations`}>
                Learn more <Icon name="arrow" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* first hour */}
      <section className="section bg-cream">
        <div className="container-4">
          <div className="section-head">
            <h2 className="section-h">The First Hour After an Accident in {city.name}</h2>
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

      <ReportBlock state={s.abbr} name={s.name} statuteYears={s.statuteYears} bg="bg-cream" />

      <ActionKit
        bg="bg-white"
        title={`Your ${city.name} Action Kit — Copy, Paste, Send`}
        intro={`Four scripts that protect your ${city.name} claim in the first days — written for you, ready to send today. Replace the brackets and go.`}
      />

      <SettlementEstimator />

      {/* other accident types in city */}
      <section className="section bg-white">
        <div className="container-5">
          <div className="section-head">
            <h2 className="section-h">Other Accident Types in {city.name}</h2>
          </div>
          <div className="grid grid-4">
            {cityAccidentTypes.map((at) => {
              const active = at.slug === typeSlug;
              return (
                <Link
                  key={at.slug}
                  href={`/accidents/${r.cityKey}/${city.slug}/${at.slug}`}
                  className="card link r"
                  style={active ? { borderColor: "var(--sage)", background: "rgba(74,140,126,0.05)" } : undefined}
                >
                  <div className="card-ic">
                    <Icon name={at.icon} />
                  </div>
                  <h3>
                    {at.name} in {city.name}
                  </h3>
                  <p style={{ fontSize: ".92rem", marginTop: ".4rem" }}>
                    Local {at.name.toLowerCase()} data and your legal rights.
                  </p>
                </Link>
              );
            })}
          </div>
          <div style={{ marginTop: "1.5rem" }}>
            <Link href={`/accidents/${r.slug}`} className="card-link">
              All {s.name} cities &amp; law <Icon name="arrow" />
            </Link>
          </div>
        </div>
      </section>

      {/* local resources */}
      <section className="section bg-cream">
        <div className="container-5">
          <div className="section-head">
            <h2 className="section-h">{city.name} Resources</h2>
          </div>
          <div className="grid grid-3">
            {CITY_SPECIALS.map(([slug, icon, titlePrefix, desc]) => {
              const cardTitle =
                slug === "police-report"
                  ? `Get Your ${city.name} Crash Report`
                  : `${titlePrefix} ${city.name}`;
              return (
                <Link
                  key={slug}
                  href={`/accidents/${r.cityKey}/${city.slug}/${slug}`}
                  className="card link r"
                >
                  <div className="card-ic">
                    <Icon name={icon} />
                  </div>
                  <h3>{cardTitle}</h3>
                  <p style={{ fontSize: ".92rem", marginTop: ".4rem" }}>
                    {desc.replace("{city}", city.name)}
                  </p>
                  <span className="card-link" style={{ marginTop: ".9rem" }}>
                    Open <Icon name="arrow" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <FAQ faqs={cFaqs} bg="bg-cream" container="container-4" title={`Frequently Asked Questions — ${city.name}`} />

      <Expert bg="bg-white" />

      <Sources
        citeTitle={`${title} — Local Accident Guide`}
        citeUrl={`/accidents/${r.cityKey}/${city.slug}${typeSlug ? "/" + typeSlug : ""}`}
      />

      <CTABand
        title={`Injured in ${city.name}?`}
        sub={`Understanding your rights is the first step. Get a free case review to learn what your accident is worth — confidentially, at no cost.`}
        btn="Get Free Case Review"
      />

      <ArticleOverlays />

      <JsonLd
        data={[
          article({
            headline: title,
            description: `Local accident data and ${s.name} law for ${city.name}. ${s.label}, ${s.statuteYears}-year filing deadline.`,
          }),
          faqSchema(cFaqs),
          breadcrumb([
            { name: "Home", url: "/" },
            ...crumbItems.map((ci, i) => ({
              name: ci.label,
              url:
                ci.href ??
                `/accidents/${r.cityKey}/${city.slug}${typeSlug ? "/" + typeSlug : ""}`,
            })),
          ]),
          howto({
            name: `What to do in the first hour after an accident in ${city.name}`,
            description: "Step-by-step actions to protect your claim.",
            steps: firstHourSteps.map((st) => ({ name: st[0], text: st[1] })),
          }),
          speakable(`/accidents/${r.cityKey}/${city.slug}${typeSlug ? "/" + typeSlug : ""}`),
          ...orgGraph(),
        ]}
      />
    </>
  );
}

function severityRows(t: { category: string; stats?: { value: string }[] }) {
  const m = t.stats?.[0]?.value ? /(\d+)/.exec(t.stats[0].value) : null;
  const avg = m ? parseInt(m[1], 10) : 50;
  const rng = (a: number, b: number) => `$${Math.round(avg * a)}K – $${Math.round(avg * b)}K`;
  return [
    ["Minor", "Soft-tissue, full recovery in weeks", rng(0.2, 0.5)],
    ["Moderate", "Fractures, ongoing treatment", rng(0.6, 1.3)],
    ["Severe", "Permanent impairment, surgery", rng(1.6, 3.2)],
    ["Catastrophic", "Disability, lifelong care", rng(3.5, 8)],
  ];
}
