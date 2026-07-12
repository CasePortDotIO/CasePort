/**
 * StateTopicPage.tsx
 *
 * State topic page (e.g. /accidents/california/statute-of-limitations).
 * Content is driven by doc.blocks[] from the accidentPages CMS collection.
 * Falls back to static stateLaw[] data when block fields are empty.
 */

import { CTABand } from '@/components/AccidentsCTABand'
import { FAQ } from '@/components/AccidentsFAQ'
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
import { generateAccidentJsonLd } from '@/lib/accidents-schema'
import { resolveState } from '@/lib/accidents-state'
import type { ResolvedState } from '@/lib/accidents-state'
import Link from 'next/link'

type Block = {
  id?: string
  blockType: string
  [key: string]: any
}

type Doc = {
  state?: string
  stateTopic?: string
  fullSlug?: string
  title?: string
  heroTitle?: string
  heroSubtitle?: string
  eyebrow?: string
  blocks?: Block[]
  [key: string]: any
}

interface Topic {
  slug: string
  key: string
  label: string
}

// ─── Block Renderer ───────────────────────────────────────────────────────────

function BlockRenderer({ blocks = [], r, topic }: { blocks: Block[]; r: ResolvedState; topic: Topic }) {
  const s = r.data

  return (
    <>
      {blocks.map((block, i) => {
        switch (block.blockType) {
          case 'hero':
          case 'topSection':
            return (
              <section key={block.id || i} className="page-intro">
                <div className="container-4">
                  <Breadcrumbs
                    items={[
                      { label: 'Accidents', href: '/accidents' },
                      { label: s.name, href: `/accidents/${r.cityKey}` },
                      { label: topic.label },
                    ]}
                  />
                  <div className="eyebrow" style={{ marginTop: '1.25rem' }}>
                    {block.eyebrow || `${s.name} · ${topic.label}`}
                  </div>
                  <h1>{block.heroTitle || block.heading}</h1>
                  <p className="section-sub" style={{ marginTop: '.9rem' }}>
                    {block.heroSubtitle || block.text}
                  </p>
                  <Byline reviewerName={reviewer.name} minutes={0} />
                </div>
              </section>
            )

          case 'directAnswer': {
            const lead = block.lead || block.text
            const facts = block.facts?.length > 0
              ? block.facts.map((f: any) => [f.label, f.value] as [string, string])
              : []
            return (
              <Capsule
                key={block.id || i}
                lead={lead}
                facts={facts.length > 0 ? facts : undefined}
              />
            )
          }

          case 'proseSections': {
            const sections = block.sections || []
            if (!sections || sections.length === 0) return null
            const parsed = toSections(sections.map((s: any) => ({ title: s.title, content: [s.content] })))
            return (
              <>
                <InGuideTOC key={`toc-${block.id || i}`} sections={parsed} />
                <ProseSections key={`prose-${block.id || i}`} sections={parsed} />
              </>
            )
          }

          case 'faq': {
            const items = block.items || []
            if (!items || items.length === 0) return null
            const faqs = items.map((it: any) => ({ q: it.question, a: it.answerText }))
            return (
              <FAQ
                key={block.id || i}
                faqs={faqs}
                bg="bg-cream"
                title={block.title || `Frequently Asked Questions About ${s.name} Accident Law`}
              />
            )
          }

          case 'cta':
            if (!block.title && !block.sub && !block.subtitle) return null
            return (
              <CTABand
                key={block.id || i}
                title={block.title || `Questions About Your ${s.name} Claim?`}
                sub={block.sub || block.subtitle || 'A free, confidential case review takes minutes and costs nothing.'}
                link={block.link}
              />
            )

          case 'sources': {
            const srcs = block.sources || []
            if (!srcs || srcs.length === 0) return null
            return (
              <Sources
                key={block.id || i}
                citeTitle={block.citeTitle}
                citeUrl={block.citeUrl}
                sources={srcs}
              />
            )
          }

          case 'expert':
            return (
              <Expert
                key={block.id || i}
                author={block.author}
                reviewType={block.reviewType}
                sourceText={block.sourceText}
                bg="bg-cream"
              />
            )

          default:
            return null
        }
      })}
    </>
  )
}

// ─── Page Component ───────────────────────────────────────────────────────────

export function StateTopicPage({ doc }: { doc: Doc }) {
  const state = doc.state
  const topicSlug = doc.stateTopic
  if (!state || !topicSlug) return null
  const r = resolveState(state)
  if (!r) return null

  const s = r.data
  const topic = stateLawTopics.find((t) => t.slug === topicSlug) as Topic | undefined
  if (!topic) return null

  const c = stateLawFor(r.abbr)[topic.key] || {}
  const sections = c.sections ? toSections(c.sections) : []
  const minutes = readingMinutes(c.direct_answer || '', (c.sections || []).map((x: any) => x.content))
  const otherTopics = stateLawTopics.filter((t) => t.slug !== topicSlug)
  const blocks = doc.blocks || []

  const faqs = [
    { q: c.title || topic.label, a: c.direct_answer || '' },
    ...(c.sections || []).map((x: any) => ({ q: x.title, a: x.content })),
  ]

  return (
    <>
      {/* CMS-driven blocks */}
      <BlockRenderer blocks={blocks} r={r} topic={topic} />

      {/* "More [State] Accident Law" grid — not yet block-ified, keep static */}
      <section className="section bg-cream">
        <div className="container-5">
          <div className="section-head">
            <h2 className="section-h">More {s.name} Accident Law</h2>
          </div>
          <div className="grid grid-4">
            {otherTopics.map((t) => (
              <Link key={t.slug} href={`/accidents/${r.cityKey}/${t.slug}`} className="card link r">
                <h3>{t.label}</h3>
                <p style={{ fontSize: '.92rem', marginTop: '.4rem' }}>
                  {s.name} · {t.label.toLowerCase()}
                </p>
              </Link>
            ))}
          </div>
          <div style={{ marginTop: '1.5rem' }}>
            <Link href={`/accidents/${r.cityKey}`} className="card-link">
              Back to the {s.name} overview
            </Link>
          </div>
        </div>
      </section>

      <ArticleOverlays />

      <JsonLd data={generateAccidentJsonLd(doc)} />
    </>
  )
}
