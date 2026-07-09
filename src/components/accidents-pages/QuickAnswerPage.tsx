/**
 * QuickAnswerPage.tsx
 *
 * Quick answer pages (e.g. /accidents/what-to-do-after-accident).
 * Content is driven entirely by doc.blocks[] from the accidentPages CMS collection.
 */

import Link from 'next/link'
import { Icon } from '@/components/Icon'
import { Breadcrumbs } from '@/components/article/Breadcrumbs'
import { Byline } from '@/components/article/Byline'
import { KeyTakeaways } from '@/components/article/KeyTakeaways'
import { StatTiles } from '@/components/article/StatTiles'
import { Capsule } from '@/components/article/Capsule'
import { InGuideTOC } from '@/components/article/InGuideTOC'
import { ProseSections } from '@/components/article/ProseSections'
import { Expert } from '@/components/article/Expert'
import { Sources } from '@/components/article/Sources'
import { ArticleOverlays } from '@/components/article/ArticleOverlays'
import { ActionKit } from '@/components/AccidentsActionKit'
import { QaVisual } from './QaVisual'
import { CTABand } from '@/components/AccidentsCTABand'
import { JsonLd } from '@/components/AccidentsJsonLd'
import { generateAccidentJsonLd } from '@/lib/accidents-schema'
import { reviewer } from '@/lib/accidents-constants'
import { toSections } from '@/lib/accidents-article'

type Block = {
  id?: string
  blockType: string
  [key: string]: any
}

type Doc = {
  quickAnswerSlug?: string
  fullSlug?: string
  title?: string
  blocks?: Block[]
  [key: string]: any
}

const KIT_SLUGS = ['first-hour', 'evidence-preservation', 'insurance-statement']

// ─── Block Renderer ───────────────────────────────────────────────────────────

function BlockRenderer({ blocks = [], realSlug }: { blocks: Block[]; realSlug: string }) {
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
                      { label: block.eyebrow || 'Quick Answer' },
                    ]}
                  />
                  <div className="eyebrow" style={{ marginTop: '1.25rem' }}>
                    {block.eyebrow}
                  </div>
                  <h1>{block.heroTitle || block.heading}</h1>
                  <Byline reviewerName={reviewer.name} minutes={0} />
                </div>
              </section>
            )

          case 'quickAnswerStats': {
            const { average, successRate, timeline, upfront } = block
            const stats = [
              average && { label: 'Avg Settlement', value: average },
              successRate && { label: 'Success Rate', value: successRate },
              timeline && { label: 'Timeline', value: timeline },
              upfront && { label: 'Upfront Cost', value: upfront },
            ].filter(Boolean) as { label: string; value: string }[]
            if (stats.length === 0) return null
            return <StatTiles key={block.id || i} category="National guide" stats={stats} />
          }

          case 'keyTakeaways': {
            const items = block.items || []
            if (!items || items.length === 0) return null
            const takeaways = items.map((it: any) => it.item)
            return <KeyTakeaways key={block.id || i} items={takeaways} />
          }

          case 'directAnswer':
            if (!block.lead && !block.text) return null
            return (
              <Capsule
                key={block.id || i}
                lead={block.lead || block.text}
              />
            )

          case 'proseSections': {
            const sections2 = block.sections || []
            if (!sections2 || sections2.length === 0) return null
            const parsed = toSections(sections2.map((s: any) => ({ title: s.title, content: [s.content] })))
            return (
              <>
                <InGuideTOC key={`toc-${block.id || i}`} sections={parsed} />
                <ProseSections key={`prose-${block.id || i}`} sections={parsed} />
              </>
            )
          }

          case 'qaVisual':
            if (!block.kind) return null
            return <QaVisual key={block.id || i} kind={block.kind} />

          case 'faq': {
            const items = block.items || []
            if (!items || items.length === 0) return null
            return (
              <section key={block.id || i} className="section bg-cream">
                <div className="container-3">
                  <div className="section-head">
                    <h2 className="section-h">People Also Ask</h2>
                  </div>
                  <div className="faq-list">
                    {items.map((it: any, idx: number) => (
                      <details className="faq-item r" key={idx} open={idx === 0}>
                        <summary className="faq-summary">
                          <span className="q">{it.question}</span>
                          <span className="faq-ic"><Icon name="chev" /></span>
                        </summary>
                        <div className="faq-answer">
                          {String(it.answerText).slice(0, 240)}{String(it.answerText).length > 240 ? '…' : ''}{' '}
                          {it.slug && (
                            <Link href={`/accidents/${it.slug}`} className="card-link" style={{ marginTop: '.6rem' }}>
                              Read the full answer <Icon name="arrow" />
                            </Link>
                          )}
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              </section>
            )
          }

          case 'exploreMore': {
            const rawPages: any[] = block.pages || []
            const pageDocs = rawPages
              .map((p) => (typeof p === 'object' && p !== null ? p : null))
              .filter(Boolean) as any[]
            if (!pageDocs || pageDocs.length === 0) return null
            return (
              <section key={block.id || i} className="section bg-cream">
                <div className="container-4">
                  <div className="section-head">
                    <h2 className="section-h">{block.category || 'Explore by Accident Type'}</h2>
                  </div>
                  <div className="rel-grid">
                    {pageDocs.map((lk: any, idx: number) => {
                      const title = lk.title || lk.heroTitle || lk.fullSlug || ''
                      const href = `/accidents/${lk.fullSlug}` || '#'
                      const pageType = lk.pageType || ''
                      return (
                        <Link key={lk.id || idx} href={href} className="card link r">
                          {pageType && (
                            <div style={{ fontSize: '0.7rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                              {pageType}
                            </div>
                          )}
                          <h3>{title}</h3>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </section>
            )
          }

          case 'sources': {
            const srcs = block.sources || []
            if (!srcs || srcs.length === 0) return null
            return (
              <Sources
                key={block.id || i}
                citeTitle={block.citeTitle}
                citeUrl={block.citeUrl}
              />
            )
          }

          case 'cta':
            if (!block.title && !block.sub && !block.subtitle) return null
            return (
              <CTABand
                key={block.id || i}
                title={block.title}
                sub={block.sub || block.subtitle}
                link={block.link}
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

export function QuickAnswerPage({ doc }: { doc: Doc }) {
  const slug = doc.quickAnswerSlug || doc.fullSlug || ''
  const blocks = doc.blocks || []

  return (
    <>
      {/* CMS-driven blocks */}
      <BlockRenderer blocks={blocks} realSlug={slug} />

      {/* ActionKit for specific quick answers */}
      {KIT_SLUGS.includes(slug) && <ActionKit bg="bg-cream" />}

      <Expert bg="bg-white" />
      <ArticleOverlays />
      <JsonLd data={generateAccidentJsonLd(doc)} />
    </>
  )
}
