import { CTABand } from '@/components/AccidentsCTABand'
import { JsonLd } from '@/components/AccidentsJsonLd'
import { ArticleOverlays } from '@/components/article/ArticleOverlays'
import { Breadcrumbs } from '@/components/article/Breadcrumbs'
import { Byline } from '@/components/article/Byline'
import { Capsule } from '@/components/article/Capsule'
import { Expert } from '@/components/article/Expert'
import { InGuideTOC } from '@/components/article/InGuideTOC'
import { ProseSections } from '@/components/article/ProseSections'
import { Sources } from '@/components/article/Sources'
import { stateLawFor, stateLawTopics } from '@/data'
import { readingMinutes, toSections } from '@/lib/accidents-article'
import { reviewer } from '@/lib/accidents-constants'
import {
  article,
  breadcrumb,
  faqSchema,
  itemList,
  orgGraph,
  speakable,
} from '@/lib/accidents-schema'
import type { ResolvedState } from '@/lib/accidents-state'
import Link from 'next/link'

interface Topic {
  slug: string
  key: string
  label: string
}

export function stateTopicMeta(r: ResolvedState, topicSlug: string) {
  const topic = stateLawTopics.find((t) => t.slug === topicSlug)
  if (!topic) return null
  const c = stateLawFor(r.abbr)[topic.key]
  if (!c) return null
  return {
    title: `${c.title} | CasePort`,
    description: c.direct_answer.slice(0, 180),
    canonical: `/accidents/${r.slug}/${topic.slug}`,
  }
}

export function StateTopicPage({ r, topicSlug }: { r: ResolvedState; topicSlug: string }) {
  const s = r.data
  const topic = stateLawTopics.find((t) => t.slug === topicSlug) as Topic
  const c = stateLawFor(r.abbr)[topic.key]
  const sections = c.sections ? toSections(c.sections) : []
  const minutes = readingMinutes(
    c.direct_answer,
    (c.sections || []).map((x) => x.content),
  )
  const facts: [string, string][] = (c.key_facts || []).map((f) => [f.label, f.value])

  const faqs = [{ q: c.title, a: c.direct_answer }].concat(
    (c.sections || []).map((x) => ({ q: x.title, a: x.content })),
  )

  const otherTopics = stateLawTopics.filter((t) => t.slug !== topicSlug)

  return (
    <>
      <section className="page-intro">
        <div className="container-4">
          <Breadcrumbs
            items={[
              { label: 'Accidents', href: '/accidents' },
              { label: s.name, href: `/accidents/${r.slug}` },
              { label: topic.label },
            ]}
          />
          <div className="eyebrow" style={{ marginTop: '1.25rem' }}>
            {s.name} · {topic.label}
          </div>
          <h1>{c.title}</h1>
          <p className="section-sub" style={{ marginTop: '.9rem' }}>
            {c.subtitle}
          </p>
          <Byline reviewerName={reviewer.name} minutes={minutes} />
        </div>
      </section>

      <Capsule lead={c.direct_answer} facts={facts} />

      <InGuideTOC sections={sections} />

      {sections.length > 0 && <ProseSections sections={sections} />}

      <section className="section bg-cream">
        <div className="container-5">
          <div className="section-head">
            <h2 className="section-h">More {s.name} Accident Law</h2>
          </div>
          <div className="grid grid-4">
            {otherTopics.map((t) => (
              <Link key={t.slug} href={`/accidents/${r.slug}/${t.slug}`} className="card link r">
                <h3>{t.label}</h3>
                <p style={{ fontSize: '.92rem', marginTop: '.4rem' }}>
                  {s.name} · {t.label.toLowerCase()}
                </p>
              </Link>
            ))}
          </div>
          <div style={{ marginTop: '1.5rem' }}>
            <Link href={`/accidents/${r.slug}`} className="card-link">
              Back to the {s.name} overview
            </Link>
          </div>
        </div>
      </section>

      <Expert bg="bg-white" />

      <Sources citeTitle={c.title} citeUrl={`/accidents/${r.slug}/${topic.slug}`} />

      <CTABand
        title={`Questions About Your ${s.name} Claim?`}
        sub="A free, confidential case review takes minutes and costs nothing."
      />

      <ArticleOverlays />

      <JsonLd
        data={[
          breadcrumb([
            { name: 'Home', url: '/' },
            { name: 'Accidents', url: '/accidents' },
            { name: s.name, url: `/accidents/${r.slug}` },
            { name: topic.label, url: `/accidents/${r.slug}/${topic.slug}` },
          ]),
          faqSchema(faqs),
          article({ headline: c.title, description: c.direct_answer.slice(0, 180) }),
          speakable(`/accidents/${r.slug}/${topic.slug}`),
          ...(sections.length >= 3 ? [itemList(sections.map((x) => x.title))] : []),
          ...orgGraph(),
        ]}
      />
    </>
  )
}
