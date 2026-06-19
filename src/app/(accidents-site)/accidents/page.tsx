import { AdjusterPlaybook } from '@/components/accidents-widgets/AdjusterPlaybook'
import { CityFinder } from '@/components/accidents-widgets/CityFinder'
import { HubSearch } from '@/components/accidents-widgets/HubSearch'
import { SettlementEstimator } from '@/components/accidents-widgets/SettlementEstimator'
import { StateComparison } from '@/components/accidents-widgets/StateComparison'
import { StateMap } from '@/components/accidents-widgets/StateMap'
import { StatuteCountdown } from '@/components/accidents-widgets/StatuteCountdown'
import { CTABand } from '@/components/AccidentsCTABand'
import { FAQ } from '@/components/AccidentsFAQ'
import { ImageBand } from '@/components/AccidentsImageBand'
import { JsonLd } from '@/components/AccidentsJsonLd'
import { Icon } from '@/components/Icon'
import {
  accidentTypeOrder,
  accidentTypes,
  negColor,
  quickAnswerOrder,
  quickAnswers,
  stateData,
  statesSorted,
} from '@/data'
import { article, breadcrumb, faqSchema, orgGraph, type Faq } from '@/lib/accidents-schema'
import { stateSlug } from '@/lib/accidents-state'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Accident Law by State — The Definitive Source | CasePort',
  description:
    "After a U.S. accident, four things decide your claim value: your state's negligence rule, the filing deadline, evidence preserved in the first 72 hours, and how the settlement is calculated. State-specific negligence rules, city-level guides, and first-hour actions — attorney-reviewed, updated quarterly.",
  alternates: { canonical: '/accidents' },
}

const negRows: [string, string, string][] = [
  ['Pure contributory', 'Any fault — even 1% — bars all recovery', 'VA · MD · DC · NC · AL'],
  ['Modified (50% bar)', 'Barred once you are 50% or more at fault', 'GA · CO · TN · UT · KS · …'],
  ['Modified (51% bar)', 'Barred once you are 51% or more at fault', 'TX · FL · IL · PA · OH · …'],
  [
    'Pure comparative',
    'Recover at any fault %, reduced by your share',
    'CA · NY · FL* · WA · AZ · …',
  ],
]
const negRowRules = ['pure-contributory', 'modified-50', 'modified-51', 'pure-comparative']

const trustItems: [string, string, string][] = [
  ['star', 'State-Specific', 'Every Rule Localized'],
  ['chart', 'Updated Quarterly', 'Latest Laws'],
  ['check', 'ABA Compliant', 'Attorney-Reviewed'],
  ['award', 'Zero Cost', 'Always Free'],
  ['scale', '100% Confidential', 'Privacy Protected'],
]

const mistakes = [
  'Saying "I am fine" or "I am sorry" at the scene',
  'Giving a recorded statement to the insurance company',
  'Waiting more than 72 hours to photograph evidence',
  'Posting about your accident on social media',
  'Accepting the first settlement offer without legal review',
  'Missing the statute of limitations deadline',
]

const hubFaqs: Faq[] = [
  {
    q: 'What is contributory negligence and how does it affect my accident claim?',
    a: 'Contributory negligence is a legal rule used in select jurisdictions (VA, MD, DC, NC, AL) that bars you from recovering any compensation if you are found even one percent at fault. Insurance adjusters in these states are trained to find any evidence of shared fault to deny your entire claim. This makes what you say in the first hours after an accident critically important.',
  },
  {
    q: 'How long do I have to file a personal injury claim after an accident?',
    a: 'The statute of limitations varies by state, typically ranging from 1 to 6 years depending on your jurisdiction. Missing this deadline permanently bars your claim regardless of injury severity. However, evidence disappears much faster — surveillance footage is overwritten within days and witnesses become unreachable within weeks.',
  },
  {
    q: "Should I talk to the other driver's insurance company?",
    a: "No. You are not legally required to give a statement to the other driver's insurance company. Their adjuster is trained to ask questions designed to establish your fault or minimize your injuries. Anything you say is recorded and can be used to reduce or deny your claim. Direct all communication through a personal injury representative.",
  },
  {
    q: 'What should I do in the first hour after an accident?',
    a: 'Call 911 and request police. Photograph everything: license plates, vehicle damage, the intersection, traffic signals, skid marks, and your injuries. Collect witness names and phone numbers. Do not say "I am fine" or "I am sorry." Do not give a recorded statement to any insurance company. Send your information to a representative immediately.',
  },
  {
    q: 'How do recent tort reform laws affect my accident claim?',
    a: 'Multiple states have enacted tort reform in 2024–2025 that limits phantom damages, changes seatbelt evidence admissibility, and raises comparative fault thresholds. These changes directly impact settlement values and trial outcomes, making early legal guidance more important than ever.',
  },
]

export default function AccidentsHub() {
  const featured = ['CA', 'TX', 'GA', 'VA']

  return (
    <>
      {/* 1. Hook + search */}
      <section className="hero">
        <div className="container-5">
          <div className="eyebrow center" style={{ marginBottom: '1rem' }}>
            Accident Resources
          </div>
          <h1 className="hero-h1">
            The Definitive Source
            <br />
            for Accident Law by State
          </h1>
          <p className="hero-lede">
            State-specific negligence rules. City-level guides. Step-by-step first-hour actions.
            Attorney-reviewed, updated quarterly. No jargon. No sales pitch.
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
              ABA Compliant
            </span>
          </div>
          <HubSearch />
        </div>
      </section>

      {/* 2. Direct Answer capsule */}
      <section
        className="section bg-white"
        style={{ paddingTop: '3.5rem', paddingBottom: '3.5rem' }}
      >
        <div className="container-5">
          <div className="capsule r">
            <div className="cap-label">Direct Answer</div>
            <h2>What every accident victim needs to know — before talking to anyone</h2>
            <p className="cap-lead">
              After a U.S. accident, four things decide what your claim is worth: your state&apos;s
              negligence rule, the filing deadline, the evidence you preserve in the first 72 hours,
              and how the settlement is calculated. Get these right and you protect the full value
              of your case.
            </p>
            <div className="cap-grid">
              <div className="cap-fact">
                <Icon name="check2" />
                <span>
                  <b>Negligence rule decides everything.</b> Your state&apos;s fault rule is applied{' '}
                  <b>before</b> any payment. In contributory-negligence states (VA, MD, DC, NC, AL)
                  even <b>1% fault bars 100%</b> of recovery.
                </span>
              </div>
              <div className="cap-fact">
                <Icon name="check2" />
                <span>
                  <b>Deadlines are hard and vary.</b> The statute of limitations runs{' '}
                  <b>1 to 6 years</b> by state. Miss it and the claim is permanently barred — but
                  evidence disappears far sooner.
                </span>
              </div>
              <div className="cap-fact">
                <Icon name="check2" />
                <span>
                  <b>The first 72 hours are decisive.</b> Surveillance footage is overwritten within{' '}
                  <b>72 hours</b>; witness memory fades within days. What you document and say early
                  sets the ceiling on your claim.
                </span>
              </div>
              <div className="cap-fact">
                <Icon name="check2" />
                <span>
                  <b>Settlements follow a formula.</b> Adjusters multiply economic damages by{' '}
                  <b>1.5×–5×</b> for severity. First offers run <b>40–60% below</b> final value by
                  design.
                </span>
              </div>
            </div>
            <div className="cap-table-label">Negligence rules in plain English</div>
            <div className="table-wrap">
              <table className="data">
                <thead>
                  <tr>
                    <th>Rule</th>
                    <th>What it means for your recovery</th>
                    <th>Example states</th>
                  </tr>
                </thead>
                <tbody>
                  {negRows.map((r, i) => (
                    <tr key={i}>
                      <td className="strong">
                        <span
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '.5rem' }}
                        >
                          <span
                            style={{
                              width: 9,
                              height: 9,
                              borderRadius: '50%',
                              background: negColor(negRowRules[i]),
                            }}
                          ></span>
                          {r[0]}
                        </span>
                      </td>
                      <td>{r[1]}</td>
                      <td className="num">{r[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="cap-foot">
              <span className="ci">
                <Icon name="award" />
                Attorney-reviewed
              </span>
              <span className="ci">
                <Icon name="file" />
                Sourced from state statutes, NHTSA &amp; the Insurance Research Council
              </span>
              <span className="ci">
                <Icon name="cal" />
                Last updated June 2026
              </span>
              <span className="ci">
                <Icon name="shield" />
                Editorially independent
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Trust strip */}
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

      {/* 4. Quick Answers */}
      <section className="section bg-cream">
        <div className="container-5">
          <div className="section-head">
            <h2 className="section-h">Quick Answers</h2>
          </div>
          <div className="grid grid-2">
            {quickAnswerOrder.map((id) => {
              const qa = quickAnswers[id]
              return (
                <Link key={id} href={`/accidents/${id}`} className="card link r">
                  <h3>{qa.question}</h3>
                  <p style={{ fontWeight: 500, color: 'var(--text-2)' }}>{qa.directAnswer}</p>
                  <div className="keyfacts" style={{ marginTop: '1rem' }}>
                    {qa.keyFacts.slice(0, 2).map((f, i) => (
                      <div className="keyfact" key={i}>
                        <Icon name="check2" style={{ color: '#4a8c7e' }} />
                        <span style={{ fontWeight: 600, fontSize: '.95rem', lineHeight: 1.5 }}>
                          {f}
                        </span>
                      </div>
                    ))}
                  </div>
                  <span className="card-link" style={{ marginTop: '1.1rem' }}>
                    Learn more
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* 5. Personalize */}
      <StateMap />

      {/* 6. Urgency */}
      <StatuteCountdown />

      {/* 7. Emotional stakes */}
      <ImageBand
        line="The moments after an accident decide everything that follows."
        scene="Accident scene"
        img="/accidents/img/evidence.png"
      />

      {/* 8. Threat */}
      <AdjusterPlaybook />

      {/* 9. Desire */}
      <SettlementEstimator />

      {/* 10. Proof */}
      <StateComparison />

      {/* 11. Segment — accident types */}
      <section className="section bg-cream">
        <div className="container-5">
          <div className="section-head">
            <h2 className="section-h">Featured Accident Guides</h2>
          </div>
          <div className="grid grid-3">
            {accidentTypeOrder.map((k) => {
              const t = accidentTypes[k]
              return (
                <Link key={k} href={`/accidents/${k}`} className="card link r">
                  <div className="card-ic">
                    <Icon name={t.icon} />
                  </div>
                  <h3>{t.category}</h3>
                  <p>{t.subtitle}</p>
                  <span className="card-link" style={{ marginTop: '1rem' }}>
                    Learn more
                  </span>
                </Link>
              )
            })}
            <Link href="/accidents/resources" className="card link r">
              <div className="card-ic">
                <Icon name="list" />
              </div>
              <h3>All Resources &amp; Deadlines</h3>
              <p>
                Browse every quick answer, statute deadline, and negligence rule across all 50
                states and DC.
              </p>
              <span className="card-link" style={{ marginTop: '1rem' }}>
                Learn more
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* 12. Localize — by state */}
      <section className="section bg-white">
        <div className="container-5">
          <div className="section-head">
            <h2 className="section-h">Accident Law in All 50 States &amp; DC</h2>
            <p className="section-sub">
              Every state sets its own negligence rule, filing deadline, damage caps, and accident
              statistics. The four below show the four fault systems that exist in America — open
              any state for its full profile, with city-level guides rolling out nationwide.
            </p>
          </div>
          <div className="grid grid-4" style={{ marginBottom: '1.75rem' }}>
            {featured.map((ab) => {
              const s = stateData[ab]
              const color = negColor(s.rule)
              return (
                <Link key={ab} href={`/accidents/${stateSlug(ab)}`} className="card link r">
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '.6rem',
                    }}
                  >
                    <h3>{s.name}</h3>
                    <span
                      className="pill-rule"
                      style={{ background: color + '18', color, fontSize: '.72rem' }}
                    >
                      {s.abbr}
                    </span>
                  </div>
                  <p style={{ marginTop: 0, fontWeight: 600, color }}>{s.label}</p>
                  <p style={{ marginTop: '.5rem', fontSize: '.92rem' }}>
                    {s.statuteNote} · Avg settlement ${s.avgSettlement}K
                  </p>
                  <span className="card-link" style={{ marginTop: '.9rem' }}>
                    Open {s.name} guide
                  </span>
                </Link>
              )
            })}
          </div>
          <div className="state-pills">
            {statesSorted().map((s) => {
              const color = negColor(s.rule)
              return (
                <Link
                  key={s.abbr}
                  href={`/accidents/${stateSlug(s.abbr)}`}
                  className="state-pill"
                  title={`${s.name} — ${s.label}`}
                >
                  <span className="state-pill-dot" style={{ background: color }}></span>
                  {s.abbr}
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* 13. Localize — city finder */}
      <CityFinder />

      {/* 14. Educate — common mistakes */}
      <section className="section bg-white">
        <div className="container-3">
          <div className="section-head">
            <h2 className="section-h">Common Mistakes to Avoid</h2>
          </div>
          <div className="mistakes">
            {mistakes.map((m, i) => (
              <div className="mistake r" key={i}>
                <Icon name="alertC" />
                <span>{m}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 15. Objections */}
      <FAQ faqs={hubFaqs} />

      {/* 16. Close */}
      <CTABand
        title="Ready to Protect Your Claim?"
        sub="You do not need to decide anything today except one thing: get your information to someone who is legally obligated to protect it."
      />

      <JsonLd
        data={[
          article({
            headline: 'The Definitive Source for Accident Law by State',
            description:
              "After a U.S. accident, four things decide your claim value: your state's negligence rule, the filing deadline, evidence preserved in the first 72 hours, and how the settlement is calculated. State-specific negligence rules, city-level guides, and first-hour actions — attorney-reviewed, updated quarterly.",
          }),
          faqSchema(hubFaqs),
          breadcrumb([
            { name: 'Home', url: '/' },
            { name: 'Accidents', url: '/accidents' },
          ]),
          ...orgGraph(),
        ]}
      />
    </>
  )
}
