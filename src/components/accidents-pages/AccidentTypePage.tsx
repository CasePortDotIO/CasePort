/**
 * AccidentTypePage.tsx
 *
 * Accident type page (e.g. /accidents/car-accident).
 * Content is driven by doc.blocks[] from the accidentPages CMS collection.
 * Falls back to static accidentTypes[] data when block fields are empty.
 */

import Link from 'next/link'
import { Icon } from '@/components/Icon'
import { Breadcrumbs } from '@/components/article/Breadcrumbs'
import { HeroPhoto } from '@/components/article/HeroPhoto'
import { Byline } from '@/components/article/Byline'
import { KeyTakeaways } from '@/components/article/KeyTakeaways'
import { Capsule } from '@/components/article/Capsule'
import { InGuideTOC } from '@/components/article/InGuideTOC'
import { ProseSections } from '@/components/article/ProseSections'
import React from 'react'
import { StatTiles } from '@/components/article/StatTiles'
import { Expert } from '@/components/article/Expert'
import { Sources } from '@/components/article/Sources'
import { ArticleOverlays } from '@/components/article/ArticleOverlays'
import { SettlementEstimator } from '@/components/accidents-widgets/SettlementEstimator'
import { FAQ } from '@/components/AccidentsFAQ'
import { CTABand } from '@/components/AccidentsCTABand'
import { JsonLd } from '@/components/AccidentsJsonLd'
import {
  generateAccidentJsonLd,
  type Faq,
} from '@/lib/accidents-schema'
import { accidentTypes } from '@/data'
import { reviewer, sceneFor } from '@/lib/accidents-constants'
import { toSections } from '@/lib/accidents-article'

type Block = {
  id?: string
  blockType: string
  [key: string]: any
}

type Doc = {
  accidentType?: string
  fullSlug?: string
  title?: string
  heroTitle?: string
  heroSubtitle?: string
  eyebrow?: string
  blocks?: Block[]
  [key: string]: any
}

const num = (v: string) => <span className="num">{v}</span>

// ─── Block Renderer ───────────────────────────────────────────────────────────

function BlockRenderer({
  blocks = [],
  t,
  slug,
  doc,
}: {
  blocks: Block[]
  t: (typeof accidentTypes)[string]
  slug: string
  doc: Doc
}) {
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.blockType) {
          case 'hero': {
            const reviewerName = block.reviewerName || reviewer.name
            const readTime = doc.readTime ?? 0
            const updatedDate = doc.updatedAt
              ? new Date(doc.updatedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
              : undefined
            return (
              <HeroPhoto
                key={block.id || i}
                crumbs={
                  <Breadcrumbs
                    items={[
                      { label: 'Accidents', href: '/accidents' },
                      { label: t.category },
                    ]}
                  />
                }
                eyebrow={block.eyebrow}
                title={block.heroTitle}
                sub={block.heroSubtitle}
                scene={block.scene}
                img={block.heroImage
                  ? typeof block.heroImage === 'object'
                    ? (block.heroImage as any).url
                    : block.heroImage
                  : undefined}
                byline={<Byline reviewerName={reviewerName} minutes={readTime} onDark updatedDate={updatedDate} />}
              />
            )
          }

          case 'topSection': {
            const authorName = block.author
              ? (typeof block.author === 'object' ? (block.author as any).name : String(block.author))
              : reviewer.name
            const tableBlock = block.table
            const tableData = tableBlock?.rows?.length > 0
              ? {
                  label: tableBlock.label || `${t.category} at a glance`,
                  head: (tableBlock.head || []).map((c: any) => typeof c === 'object' ? c.cell : c),
                  rows: tableBlock.rows.map((row: any) =>
                    row.cells.map((cell: any) =>
                      typeof cell === 'object' ? cell.cell : cell
                    )
                  ),
                }
              : null
            return (
              <HeroPhoto
                key={block.id || i}
                crumbs={
                  <Breadcrumbs
                    items={[
                      { label: 'Accidents', href: '/accidents' },
                      { label: t.category },
                    ]}
                  />
                }
                eyebrow={block.eyebrow}
                title={block.heroTitle || block.heading}
                sub={block.heroSubtitle || block.text}
                scene={block.scene}
                img={block.heroImage
                  ? typeof block.heroImage === 'object'
                    ? (block.heroImage as any).url
                    : block.heroImage
                  : undefined}
                byline={<Byline reviewerName={authorName} minutes={0} onDark />}
                table={tableData || undefined}
              />
            )
          }

          case 'statTiles': {
            const items = block.items || []
            if (!items || items.length === 0) return null
            return <StatTiles key={block.id || i} category={t.category} stats={items.map((it: any) => ({ label: it.label, value: it.value }))} />
          }

          case 'keyTakeaways': {
            const items = block.items || []
            if (!items || items.length === 0) return null
            return <KeyTakeaways key={block.id || i} items={items.map((it: any) => it.item)} />
          }

          case 'directAnswer': {
            const tableRows = block.rows || []
            const headRaw = block.head || []
            const head = headRaw.map((c: any) => typeof c === 'object' ? c.cell : c)
            if (!tableRows || tableRows.length === 0) return null
            return (
              <Capsule
                key={block.id || i}
                heading={block.heading}
                lead={block.lead || block.text}
                table={{
                  label: block.label || block.table?.label,
                  head,
                  rows: tableRows.map((row: any) => {
                    const cells = Array.isArray(row) ? row : (row.cells || [])
                    return cells.map((cell: any) => {
                      const val = typeof cell === 'object' && 'cell' in cell ? cell.cell : cell
                      return typeof val === 'string' && /\$?\d+/.test(val) ? num(val) : val
                    })
                  }),
                }}
              />
            )
          }

          case 'proseSections': {
            const sections = block.sections || []
            if (!sections || sections.length === 0) return null
            const parsed = toSections(sections.map((s: any) => ({ title: s.title, content: [s.content] })))
            return (
              <React.Fragment key={block.id || i}>
                <InGuideTOC sections={parsed} />
                <ProseSections sections={parsed} />
              </React.Fragment>
            )
          }

          case 'faq': {
            const items = block.items || []
            if (!items || items.length === 0) return null
            const faqs: Faq[] = items.map((it: any) => ({ q: it.question, a: it.answerText }))
            return (
              <FAQ
                key={block.id || i}
                faqs={faqs}
                bg="bg-cream"
                title={block.title}
              />
            )
          }

          case 'exploreMore': {
            const rawPages: any[] = block.pages || []
            if (!rawPages || rawPages.length === 0) return null

            // Resolve relationship docs (may be IDs or full docs depending on depth)
            const pageDocs = rawPages
              .map((p) => (typeof p === 'object' && p !== null ? p : null))
              .filter(Boolean) as any[]

            if (pageDocs.length === 0) return null

            const PAGE_TYPE_LABELS: Record<string, string> = {
              accidentType: 'Accident Type',
              state: 'State',
              city: 'City',
              quickAnswer: 'Quick Answer',
            }

            return (
              <section key={block.id || i} className="section bg-cream">
                <div className="container-5">
                  <div className="section-head">
                    <h2 className="section-h">Other Accident Types</h2>
                  </div>
                  <div className="grid grid-4">
                    {pageDocs.map((lk: any, idx: number) => {
                      const title = lk.title || lk.heroTitle || lk.fullSlug || ''
                      const href = `/accidents/${lk.fullSlug}` || '#'
                      const pageType = lk.pageType || ''
                      const icon = lk.accidentType ? (accidentTypes[lk.accidentType]?.icon || 'shield') : 'shield'
                      return (
                        <Link key={lk.id || idx} href={href} className="card link r">
                          <div className="card-ic">
                            <Icon name={icon} />
                          </div>
                          {pageType && (
                            <div style={{ fontSize: '0.7rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                              {PAGE_TYPE_LABELS[pageType] || pageType}
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

export function AccidentTypePage({ doc }: { doc: Doc }) {
  const slug = doc.accidentType || doc.fullSlug || ''
  const t = accidentTypes[slug]
  if (!t) return null

  const blocks = doc.blocks || []

  return (
    <>
      {/* CMS-driven blocks */}
      <BlockRenderer blocks={blocks} t={t} slug={slug} doc={doc} />

      {/* Static sections — globally applicable */}
      <SettlementEstimator />
      <ArticleOverlays />

      <JsonLd data={generateAccidentJsonLd(doc)} />
    </>
  )
}
