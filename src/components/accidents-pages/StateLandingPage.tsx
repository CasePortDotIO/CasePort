/**
 * StateLandingPage.tsx
 *
 * Fully CMS-driven state landing page for /accidents/[state]
 * Renders blocks from the accidentPages CMS collection doc.
 *
 * Static sections still present (not yet block-ified):
 *   StateComparison, ReportBlock, ActionKit, Expert, ArticleOverlays, JsonLd
 */

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
import { stateData } from '@/data'
import { readingMinutes } from '@/lib/accidents-article'
import { reviewer } from '@/lib/accidents-constants'
import { generateAccidentJsonLd } from '@/lib/accidents-schema'
import { resolveState, stateSlug } from '@/lib/accidents-state'
import type { ResolvedState } from '@/lib/accidents-state'
import Link from 'next/link'

const num = (v: string) => <span className="num">{v}</span>
const lcFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1)

// ─── Block Renderer ───────────────────────────────────────────────────────────

type Block = {
  id?: string
  blockType: string
  [key: string]: any
}

function BlockRenderer({ blocks = [], r, pageTitle, pageUrl }: { blocks: Block[]; r: ResolvedState; pageTitle: string; pageUrl: string }) {
  const s = r.data

  return (
    <>
      {blocks.map((block, i) => {
        switch (block.blockType) {
          case 'topSection': {
            const heroSubtitle = block.heroSubtitle || block.text || ''
            const mins = readingMinutes(heroSubtitle)
            return (
              <section key={block.id || i} className="page-intro">
                <div className="container-5">
                  <Breadcrumbs
                    items={[{ label: 'Accidents', href: '/accidents' }, { label: s.name }]}
                  />
                  <div className="eyebrow" style={{ marginTop: '1.25rem' }}>
                    {block.eyebrow || `State Law · ${s.abbr}`}
                  </div>
                  <h1>{block.heroTitle || block.heading || `Accident Law in ${s.name}`}</h1>
                  <p className="section-sub" style={{ marginTop: '1rem' }}>
                    {heroSubtitle}
                  </p>
                  <Byline reviewerName={reviewer.name} minutes={mins} />
                </div>
              </section>
            )
          }

          case 'localizedStats': {
            const items = block.items || []
            if (!items || items.length === 0) return null
            return (
              <section key={block.id || i} style={{ padding: '0 1.5rem 2.5rem' }}>
                <div className="container-5">
                  <div
                    className="card r"
                    style={{ borderColor: 'var(--sage)' + '40', borderLeft: '3px solid var(--sage)' }}
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
                      <span
                        className="pill-rule"
                        style={{ background: 'rgba(74,140,126,0.18)', color: 'var(--sage)' }}
                      >
                        {s.label}
                      </span>
                      <span className="sample-label">Localized legal data · Illustrative</span>
                    </div>
                    <div className="stat-tiles">
                      {items.map((it: any, idx: number) => (
                        <div className="stat-tile" key={idx}>
                          <div className="lbl">{it.label}</div>
                          <div className="val">{it.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )
          }

          case 'keyTakeaways': {
            const items = block.items || []
            if (!items || items.length === 0) return null
            const labels = items.map((it: any) => it.item)
            return <KeyTakeaways key={block.id || i} items={labels} />
          }

          case 'directAnswer': {
            const lead = block.lead || block.text
            const tableRows = block.table?.rows || []
            const headRaw = block.table?.head || []
            const head = headRaw.map((c: any) => typeof c === 'object' && 'cell' in c ? c.cell : c)
            if (!lead && tableRows.length === 0) return null
            return (
              <Capsule
                key={block.id || i}
                container="container-5"
                heading={block.heading}
                lead={lead}
                table={{
                  label: block.table?.label || `${s.name} vs. the national average`,
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

          case 'sectionTOC':
            return <SectionTOC key={block.id || i} />

          case 'stateTopicsGrid': {
            const topics = block.topics || []
            if (topics.length === 0) return null
            return (
              <section key={block.id || i} className="section bg-white">
                <div className="container-5">
                  <div className="section-head">
                    <h2 className="section-h">The Five Legal Questions for {s.name}</h2>
                  </div>
                  <div className="grid grid-3">
                    {topics.map((tp: any) => {
                      const tags = typeof tp.tags === 'string' ? tp.tags.split(',') : (tp.tags || [])
                      return (
                        <Link
                          key={tp.slug}
                          href={`/accidents/${r.cityKey}/${tp.slug}`}
                          className="layer-card r"
                        >
                          <div className="layer-top">
                            <div className="layer-title">
                              <span className="dot dot-gold"></span>
                              <h4>{tp.label}</h4>
                            </div>
                          </div>
                          <p className="layer-path">
                            /accidents/{r.cityKey}/{tp.slug}
                          </p>
                          <div className="tags" style={{ marginBottom: '.6rem' }}>
                            {tags.map((tg: string) => (
                              <span
                                key={tg}
                                className={'tag tag-' + tg.toLowerCase().trim()}
                              >
                                {tg}
                              </span>
                            ))}
                          </div>
                          <span className="card-link" style={{ fontSize: '.85rem' }}>
                            Open
                          </span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              </section>
            )
          }

          case 'citiesGrid': {
            const cities = block.cities || []
            const hasCities = cities.length > 0
            if (!hasCities) {
              return (
                <section key={block.id || i} className="section bg-cream">
                  <div className="container-5">
                    <div className="card r center" style={{ maxWidth: '40rem', margin: '0 auto' }}>
                      <p style={{ fontSize: '1.05rem', color: 'var(--text-2)' }}>
                        City-level money pages for {s.name} are rolling out now. Full statewide legal
                        coverage is live above. See a finished example of a city guide:
                      </p>
                      <Link
                        href="/accidents/va/richmond"
                        className="card-link"
                        style={{ justifyContent: 'center', marginTop: '1rem' }}
                      >
                        See a live city page
                      </Link>
                    </div>
                  </div>
                </section>
              )
            }
            return (
              <section key={block.id || i} className="section bg-cream">
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
                      {cities.map((c: any) => (
                        <Link
                          key={c.slug}
                          href={`/accidents/${r.cityKey}/${c.slug}`}
                          className="city-link"
                        >
                          {c.name}
                          <span style={{ color: 'var(--text-5)', fontSize: '.82rem' }}>
                            {' · '}{c.accidentRate}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )
          }

          case 'stateFaqBlock': {
            const faqs = (block.faqs || []).map((f: any) => ({
              q: f.question,
              a: f.answer,
            }))
            if (faqs.length === 0) return null
            return (
              <FAQ
                key={block.id || i}
                faqs={faqs}
                bg="bg-white"
                container="container-4"
                title={block.title || `Frequently Asked Questions — ${s.name}`}
              />
            )
          }

          case 'faq': {
            const items = block.items || []
            const faqs = items.length > 0
              ? items.map((it: any) => ({ q: it.question, a: it.answerText }))
              : []
            if (faqs.length === 0) return null
            return (
              <FAQ
                key={block.id || i}
                faqs={faqs}
                bg="bg-white"
                container="container-4"
                title={block.title || `Frequently Asked Questions — ${s.name}`}
              />
            )
          }

          case 'whyImportant':
            if (!block.title && !block.text) return null
            return (
              <section key={block.id || i} className="section bg-cream">
                <div className="container-5">
                  <div className="card r">
                    <h3 style={{ marginBottom: '0.75rem' }}>{block.title}</h3>
                    <p style={{ color: 'var(--text-2)', lineHeight: 1.7 }}>{block.text}</p>
                  </div>
                </div>
              </section>
            )

          case 'sources': {
            const srcs = block.sources || []
            if (!srcs || srcs.length === 0) return null
            return (
              <Sources
                key={block.id || i}
                citeTitle={block.citeTitle || pageTitle}
                citeUrl={block.citeUrl || pageUrl}
                sources={srcs}
              />
            )
          }

          case 'actionKit': {
            const scripts = (block.scripts || []).filter(Boolean)
            if (scripts.length === 0) return null
            return (
              <ActionKit
                key={block.id || i}
                bg="bg-cream"
                title={block.title || `Your ${s.name} Action Kit — Copy, Paste, Send`}
                intro={block.intro}
                scripts={scripts}
              />
            )
          }

          case 'stateComparison':
            return (
              <StateComparison
                key={block.id || i}
                initialA={block.initialA || s.abbr}
              />
            )

          case 'reportBlock':
            return (
              <ReportBlock
                key={block.id || i}
                stateName={block.stateName}
                requestFrom={block.requestFrom}
                requestHow={block.requestHow}
                whenToAct={block.whenToAct}
                note={block.note}
                bg="bg-white"
              />
            )

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

type Doc = {
  state?: string
  fullSlug?: string
  title?: string
  blocks?: Block[]
  [key: string]: any
}

export function StateLandingPage({ doc }: { doc: Doc }) {
  const state = doc.state
  if (!state) return null
  const r = resolveState(state)
  if (!r) return null

  const s = r.data
  const blocks = doc.blocks || []

  return (
    <>
      {/* CMS-driven blocks — BlockRenderer handles all actionKit, reportBlock,
          stateComparison, expert, and other block types. No static fallbacks needed. */}
      <BlockRenderer blocks={blocks} r={r} pageTitle={doc.title || ''} pageUrl={doc.fullSlug || ''} />

      <ArticleOverlays />

      <JsonLd data={generateAccidentJsonLd(doc)} />
    </>
  )
}
