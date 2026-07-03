import { CTABand } from '@/components/AccidentsCTABand'
import { JsonLd } from '@/components/AccidentsJsonLd'
import { Icon } from '@/components/Icon'
import { ArticleOverlays } from '@/components/article/ArticleOverlays'
import { Breadcrumbs } from '@/components/article/Breadcrumbs'
import { Byline } from '@/components/article/Byline'
import { Sources } from '@/components/article/Sources'
import {
  accidentTypeOrder,
  accidentTypes,
  quickAnswerOrder,
  quickAnswers,
  stateLawTopics,
} from '@/data'
import { reviewer } from '@/lib/accidents-constants'
import { article, breadcrumb, orgGraph } from '@/lib/accidents-schema'
import Link from 'next/link'

export const resourcesMeta = {
  title: 'All Accident Resources & Deadlines | CasePort',
  description: 'Index of every quick answer, accident-type guide, and state law profile.',
  canonical: '/accidents/resources',
}

export function ResourcesPage() {
  return (
    <>
      <section className="page-intro">
        <div className="container-5">
          <Breadcrumbs
            items={[{ label: 'Accidents', href: '/accidents' }, { label: 'All Resources' }]}
          />
          <div className="eyebrow" style={{ marginTop: '1.25rem' }}>
            Resource Index
          </div>
          <h1>All Accident Resources &amp; Deadlines</h1>
          <p className="section-sub" style={{ marginTop: '1rem' }}>
            Every quick answer, accident-type guide, state law profile, and city guide in one place
            — attorney-reviewed and updated quarterly.
          </p>
          <Byline reviewerName={reviewer.name} minutes={2} />
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-5">
          <div className="section-head">
            <h2 className="section-h">Quick Answers</h2>
          </div>
          <div className="grid grid-2">
            {quickAnswerOrder.map((id) => {
              const o = quickAnswers[id]
              return (
                <Link key={id} href={`/accidents/${id}`} className="card link r">
                  <h3>{o.question}</h3>
                  <p style={{ fontSize: '.95rem', marginTop: '.5rem' }}>
                    {o.directAnswer.slice(0, 110)}…
                  </p>
                  <span className="card-link" style={{ marginTop: '.9rem' }}>
                    Read
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section bg-cream">
        <div className="container-5">
          <div className="section-head">
            <h2 className="section-h">Accident Type Guides</h2>
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
                  <p style={{ fontSize: '.92rem', marginTop: '.4rem' }}>{t.subtitle}</p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container-5">
          <div className="section-head">
            <h2 className="section-h">State Law — All 50 States &amp; DC</h2>
            <p className="section-sub">
              Each state has a full profile plus five legal-question pages.
            </p>
          </div>
          <div className="card r">
            <ul className="keyfacts" style={{ listStyle: 'none' }}>
              {stateLawTopics.map((t) => (
                <li className="keyfact" key={t.slug}>
                  <Icon name="chev" style={{ color: '#4a8c7e', width: 18, height: 18 }} />
                  <span>
                    <b style={{ color: 'var(--teal)' }}>{t.label}</b> — available for all 50 states
                    &amp; DC at{' '}
                    <code style={{ fontFamily: 'var(--code)', fontSize: '.85rem' }}>
                      /accidents/[state]/{t.slug}
                    </code>
                  </span>
                </li>
              ))}
            </ul>
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '.75rem', flexWrap: 'wrap' }}>
              <Link href="/accidents/california" className="btn btn-teal btn-sm">
                Browse by state
              </Link>
              <Link href="/accidents/ga/atlanta" className="btn btn-ghost btn-sm">
                Find your city
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Sources citeTitle="All Accident Resources & Deadlines" citeUrl="/accidents/resources" />

      <CTABand
        title="Not sure where to start?"
        sub="A free, confidential case review points you to exactly what applies to your accident — at no cost."
      />

      <ArticleOverlays />

      <JsonLd
        data={[
          breadcrumb([
            { name: 'Home', url: '/' },
            { name: 'Accidents', url: '/accidents' },
            { name: 'All Resources', url: '/accidents/resources' },
          ]),
          article({
            headline: 'All Accident Resources & Deadlines',
            description: 'Index of every quick answer, accident-type guide, and state law profile.',
          }),
          ...orgGraph(),
        ]}
      />
    </>
  )
}
