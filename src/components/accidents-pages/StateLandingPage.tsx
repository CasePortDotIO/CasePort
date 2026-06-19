import { StateComparison } from '@/components/accidents-widgets/StateComparison'
import { ActionKit } from '@/components/AccidentsActionKit'
import { CTABand } from '@/components/AccidentsCTABand'
import { FAQ } from '@/components/AccidentsFAQ'
import { JsonLd } from '@/components/AccidentsJsonLd'
import { ReportBlock } from '@/components/AccidentsReportBlock'
import { ArticleOverlays } from '@/components/article/ArticleOverlays'
import { Breadcrumbs } from '@/components/article/Breadcrumbs'
import { Byline } from '@/components/article/Byline'
import { Capsule } from '@/components/article/Capsule'
import { Expert } from '@/components/article/Expert'
import { KeyTakeaways } from '@/components/article/KeyTakeaways'
import { SectionTOC } from '@/components/article/SectionTOC'
import { Sources } from '@/components/article/Sources'
import { cityData, NATIONAL, negColor, stateLawFor, stateLawTopics } from '@/data'
import { readingMinutes } from '@/lib/accidents-article'
import { reviewer } from '@/lib/accidents-constants'
import { article, breadcrumb, faqSchema, orgGraph, speakable } from '@/lib/accidents-schema'
import type { ResolvedState } from '@/lib/accidents-state'
import Link from 'next/link'

const num = (v: string) => <span className="num">{v}</span>
const lcFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1)

export function stateLandingMeta(s: ResolvedState['data'], slug: string) {
  return {
    title: `Accident Law in ${s.name} — Negligence, Deadlines & Caps | CasePort`,
    description: `${s.name} applies ${s.label}. Filing deadline ${s.statuteYears} years. Average settlement $${s.avgSettlement}K.`,
    canonical: `/accidents/${slug}`,
  }
}

export function StateLandingPage({ r }: { r: ResolvedState }) {
  const s = r.data
  const color = negColor(s.rule)
  const N = NATIONAL
  const isLaunch = !!cityData[r.cityKey]

  const lead = `In ${s.name}, the ${s.label.toLowerCase()} rule governs every accident claim: ${lcFirst(
    s.faultThreshold,
  )}. You have ${s.statuteYears} year${s.statuteYears > 1 ? 's' : ''} from the date of injury to file, the average settlement is about $${s.avgSettlement}K, and the rule on damages is: ${lcFirst(
    s.damageCap,
  )}.`
  const minutes = readingMinutes(lead)

  const law = stateLawFor(s.abbr)
  const sFaqs = [
    {
      q: `What is the statute of limitations for an accident claim in ${s.name}?`,
      a: law.statute_of_limitations.direct_answer,
    },
    { q: `What negligence rule does ${s.name} use?`, a: law.fault_rules.direct_answer },
    { q: `Is there a cap on damages in ${s.name}?`, a: law.damage_caps.direct_answer },
    {
      q: `Do I need a lawyer for an accident claim in ${s.name}?`,
      a: law.do_i_need_a_lawyer.direct_answer,
    },
  ]

  const cd = cityData[r.cityKey]

  return (
    <>
      <section className="page-intro">
        <div className="container-5">
          <Breadcrumbs items={[{ label: 'Accidents', href: '/accidents' }, { label: s.name }]} />
          <div className="eyebrow" style={{ marginTop: '1.25rem' }}>
            State Law · {s.abbr}
          </div>
          <h1>Accident Law in {s.name}</h1>
          <p className="section-sub" style={{ marginTop: '1rem' }}>
            {s.name} applies {s.label}. Here is the negligence rule, filing deadline, damage caps,
            and local data that determine your recovery.
          </p>
          <Byline reviewerName={reviewer.name} minutes={minutes} />
        </div>
      </section>

      {/* localized data panel */}
      <section style={{ padding: '0 1.5rem 2.5rem' }}>
        <div className="container-5">
          <div
            className="card r"
            style={{ borderColor: color + '40', borderLeft: '3px solid ' + color }}
          >
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '.75rem',
                marginBottom: '1.25rem',
              }}
            >
              <span className="pill-rule" style={{ background: color + '18', color }}>
                {s.label}
              </span>
              <span className="sample-label">Localized legal data · Illustrative</span>
            </div>
            <div className="stat-tiles">
              <div className="stat-tile">
                <div className="lbl">Filing Deadline</div>
                <div className="val">{s.statuteYears}yr</div>
              </div>
              <div className="stat-tile">
                <div className="lbl">Fault Threshold</div>
                <div className="val" style={{ fontSize: '1.15rem' }}>
                  {s.faultThreshold.split('—')[0].trim()}
                </div>
              </div>
              <div className="stat-tile">
                <div className="lbl">Avg Settlement</div>
                <div className="val terra">${s.avgSettlement}K</div>
              </div>
              <div className="stat-tile">
                <div className="lbl">Top Cause</div>
                <div className="val" style={{ fontSize: '1.05rem' }}>
                  {s.topCause}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <KeyTakeaways
        items={['Negligence rule', 'Filing deadline', 'Fault threshold', 'Damage cap']}
      />

      <Capsule
        container="container-5"
        heading={`Accident law in ${s.name}, in one place`}
        lead={lead}
        table={{
          label: `${s.name} vs. the national average`,
          head: ['Metric', s.name, 'National avg'],
          rows: [
            ['Average settlement', num(`$${s.avgSettlement}K`), num(`$${N.avgSettlement}K`)],
            ['Median jury verdict', num(`$${s.medianJuryVerdict}K`), num(`$${N.medianVerdict}K`)],
            ['Statute of limitations', num(`${s.statuteYears} yr`), num('2–3 yr')],
            ['Uninsured-motorist rate', num(`${s.uninsuredRate}%`), num(`${N.uninsuredRate}%`)],
            ['Fatal crash rate (per 100K)', num(`${s.fatalCrashRate}`), num(`${N.fatalCrashRate}`)],
          ],
        }}
      />

      <SectionTOC />

      {/* The five legal questions */}
      <section className="section bg-white">
        <div className="container-5">
          <div className="section-head">
            <h2 className="section-h">The Five Legal Questions for {s.name}</h2>
          </div>
          <div className="grid grid-3">
            {stateLawTopics.map((tp) => (
              <Link key={tp.slug} href={`/accidents/${r.slug}/${tp.slug}`} className="layer-card r">
                <div className="layer-top">
                  <div className="layer-title">
                    <span className="dot dot-gold"></span>
                    <h4>{tp.label}</h4>
                  </div>
                </div>
                <p className="layer-path">
                  /accidents/{r.slug}/{tp.slug}
                </p>
                <div className="tags" style={{ marginBottom: '.6rem' }}>
                  {tp.tags.map((tg) => (
                    <span key={tg} className={'tag tag-' + tg.toLowerCase()}>
                      {tg}
                    </span>
                  ))}
                </div>
                <span className="card-link" style={{ fontSize: '.85rem' }}>
                  Open
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* cities */}
      {isLaunch ? (
        <section className="section bg-cream">
          <div className="container-5">
            <div className="section-head">
              <h2 className="section-h">{s.name} Cities</h2>
              <p className="section-sub">
                Local accident data and first-hour actions for {s.name} metros.
              </p>
            </div>
            <div className="city-col" style={{ maxWidth: '46rem' }}>
              <div
                className="city-link-wrap"
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.65rem' }}
              >
                {cd.cities.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/accidents/${r.cityKey}/${c.slug}`}
                    className="city-link"
                  >
                    {c.name}{' '}
                    <span style={{ color: 'var(--text-5)', fontSize: '.82rem' }}>
                      · {c.accidentRate}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="section bg-cream">
          <div className="container-5">
            <div className="card r center" style={{ maxWidth: '40rem', margin: '0 auto' }}>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-2)' }}>
                City-level money pages for {s.name} are rolling out now. Full statewide legal
                coverage is live above. See a finished example of a city guide:
              </p>
              <Link
                href="/accidents/virginia/richmond"
                className="card-link"
                style={{ justifyContent: 'center', marginTop: '1rem' }}
              >
                See a live city page
              </Link>
            </div>
          </div>
        </section>
      )}

      <StateComparison initialA={s.abbr} />

      <ReportBlock state={s.abbr} name={s.name} statuteYears={s.statuteYears} bg="bg-white" />

      <ActionKit bg="bg-cream" title={`Your ${s.name} Action Kit — Copy, Paste, Send`} />

      <FAQ
        faqs={sFaqs}
        bg="bg-white"
        container="container-4"
        title={`Frequently Asked Questions — ${s.name}`}
      />

      <Expert bg="bg-cream" />

      <Sources
        citeTitle={`Accident Law in ${s.name} — Negligence, Deadlines & Caps`}
        citeUrl={`/accidents/${r.slug}`}
      />

      <CTABand
        title={`Protect Your ${s.name} Claim`}
        sub={`Get a free, confidential case review from a representative who understands ${s.name}'s ${s.label.toLowerCase()} rule.`}
      />

      <ArticleOverlays />

      <JsonLd
        data={[
          article({
            headline: `Accident Law in ${s.name}`,
            description: `${s.name} applies ${s.label}. Filing deadline ${s.statuteYears} years. Average settlement $${s.avgSettlement}K.`,
          }),
          faqSchema(sFaqs),
          breadcrumb([
            { name: 'Home', url: '/' },
            { name: 'Accidents', url: '/accidents' },
            { name: s.name, url: `/accidents/${r.slug}` },
          ]),
          speakable(`/accidents/${r.slug}`),
          ...orgGraph(),
        ]}
      />
    </>
  )
}
