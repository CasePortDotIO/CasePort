/**
 * CityPage.tsx
 *
 * City pages (e.g. /accidents/ca/los-angeles) and cityType pages
 * (e.g. /accidents/ca/los-angeles/car-accident).
 * Content is driven by doc.blocks[] from the accidentPages CMS collection.
 * Falls back to static data when block fields are empty.
 */

import { SettlementEstimator } from '@/components/accidents-widgets/SettlementEstimator'
import { ActionKit } from '@/components/AccidentsActionKit'
import { CTABand } from '@/components/AccidentsCTABand'
import { FAQ } from '@/components/AccidentsFAQ'
import { JsonLd } from '@/components/AccidentsJsonLd'
import { ReportBlock } from '@/components/AccidentsReportBlock'
import { ArticleOverlays } from '@/components/article/ArticleOverlays'
import { Breadcrumbs, type Crumb } from '@/components/article/Breadcrumbs'
import { Byline } from '@/components/article/Byline'
import { Capsule } from '@/components/article/Capsule'
import { Expert } from '@/components/article/Expert'
import { HeroPhoto } from '@/components/article/HeroPhoto'
import { KeyTakeaways } from '@/components/article/KeyTakeaways'
import { SectionTOC } from '@/components/article/SectionTOC'
import { Sources } from '@/components/article/Sources'
import { Icon } from '@/components/Icon'
import { accidentTypes, cityAccidentTypes, cityData, stateLawFor, type City } from '@/data'
import { readingMinutes } from '@/lib/accidents-article'
import { reviewer, sceneFor } from '@/lib/accidents-constants'
import { firstHourSteps } from '@/lib/accidents-firstHour'
import { generateAccidentJsonLd } from '@/lib/accidents-schema'
import { resolveState } from '@/lib/accidents-state'
import { lcFirst } from '@/lib/accidents-text'
import React from 'react'
import Link from 'next/link'

type Block = {
  id?: string
  blockType: string
  [key: string]: any
}

type Doc = {
  pageType?: string
  state?: string
  cityKey?: string
  citySlug?: string
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

const CITY_SPECIALS: [string, string, string, string][] = [
  ['what-to-do-after', 'doc', 'What to Do After an Accident in', 'The exact steps and copy-paste scripts for the first hours.'],
  ['police-report', 'file', 'Get Your', 'The exact agency, process, and a ready-to-send request.'],
  ['dangerous-roads', 'pin', 'Most Dangerous Roads in', 'Where {city} crashes cluster — local crash data.'],
]

// ─── Block Renderer ───────────────────────────────────────────────────────────

function BlockRenderer({ blocks = [], r, city, typeObj, accidentType, cityKey }: {
  blocks: Block[]
  r: ReturnType<typeof resolveState>
  city: City
  typeObj: (typeof accidentTypes)[string] | null
  accidentType?: string
  cityKey?: string
}) {
  if (!r) return null
  const s = r.data
  const typeName = typeObj ? typeObj.category : 'Accidents'

  const crumbItems: Crumb[] = [
    { label: 'Accidents', href: '/accidents' },
    { label: s.name, href: `/accidents/${r.cityKey}` },
    { label: city.name, href: `/accidents/${r.cityKey}/${city.slug}` },
  ]
  if (typeObj) crumbItems.push({ label: typeName })

  const title = typeObj
    ? `${typeName} in ${city.name}, ${s.abbr}`
    : `Accidents in ${city.name}, ${s.abbr}`

  return (
    <>
      {blocks.reduce<React.ReactNode[]>((acc, block, i) => {
        // Skip blocks already consumed by a consecutive-stateLawBlock group
        if (!block) return acc

        switch (block.blockType) {
          case 'hero': {
            const heroTitle = typeObj
              ? `${typeObj.category} in ${city.name}, ${s.abbr}`
              : `Accidents in ${city.name}, ${s.abbr}`
            acc.push(
              <HeroPhoto
                key={block.id || i}
                crumbs={
                  <Breadcrumbs
                    items={[
                      { label: 'Accidents', href: '/accidents' },
                      { label: s.name, href: `/accidents/${r.cityKey}` },
                      { label: city.name, href: `/accidents/${r.cityKey}/${city.slug}` },
                      ...(typeObj ? [{ label: typeObj.category }] : []),
                    ]}
                  />
                }
                eyebrow={block.eyebrow || (typeObj ? `${typeObj.category} · ${city.name}` : `${city.name} Accident Guide`).toUpperCase()}
                title={block.heroTitle || block.heading || heroTitle}
                sub={block.heroSubtitle || block.text || `Local accident data, ${s.name} law, and what to do immediately after an accident in ${city.name}.`}
                scene={block.scene || `${city.name}, ${s.abbr}`}
                img={block.heroImage
                  ? typeof block.heroImage === 'object'
                    ? (block.heroImage as any).url
                    : block.heroImage
                  : (typeObj && accidentType ? sceneFor(accidentType) : '/accidents/img/city.png')}
                byline={<Byline reviewerName={reviewer.name} minutes={0} onDark />}
              />
            )
            break
          }

          case 'topSection': {
            const authorName = block.author
              ? (typeof block.author === 'object' ? (block.author as any).name : String(block.author))
              : reviewer.name
            const tableBlock = block.table
            const tableData = tableBlock?.rows?.length > 0
              ? {
                  label: tableBlock.label || `${city.name} at a glance`,
                  head: (tableBlock.head || []).map((c: any) => typeof c === 'object' ? c.cell : c),
                  rows: tableBlock.rows.map((row: any) =>
                    row.cells.map((cell: any) =>
                      typeof cell === 'object' ? cell.cell : cell
                    )
                  ),
                }
              : null
            acc.push(
              <HeroPhoto
                key={block.id || i}
                crumbs={<Breadcrumbs items={crumbItems} />}
                eyebrow={block.eyebrow || `${typeName} · ${city.name}`.toUpperCase()}
                title={block.heroTitle || block.heading || title}
                sub={block.heroSubtitle || block.text || `Local accident data, ${s.name} law, and what to do immediately after an accident in ${city.name}.`}
                scene={`${city.name}, ${s.abbr}`}
                img={typeObj && accidentType ? sceneFor(accidentType) : '/accidents/img/city.png'}
                byline={<Byline reviewerName={authorName} minutes={0} onDark />}
                table={tableData || undefined}
              />
            )
            break
          }

          case 'keyTakeaways': {
            const items = block.items || []
            if (!items || items.length === 0) break
            acc.push(
              <KeyTakeaways
                key={block.id || i}
                items={items.map((it: any) => it.item)}
              />
            )
            break
          }

          case 'directAnswer': {
            const lead = block.lead || block.text
            const tableRows = block.rows || block.table?.rows || []
            const headRaw = block.head || block.table?.head || []
            const head = headRaw.map((c: any) => typeof c === 'object' && 'cell' in c ? c.cell : c)
            if (!lead && tableRows.length === 0) break
            acc.push(
              <Capsule
                key={block.id || i}
                heading={block.heading}
                lead={lead}
                table={{
                  label: block.label || block.table?.label || `${city.name} at a glance`,
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
            break
          }

          case 'sectionTOC':
            acc.push(<SectionTOC key={block.id || i} />)
            break

          case 'cityOverview': {
            const keyFacts = block.keyFacts || []
            if (!block.description && keyFacts.length === 0) break
            acc.push(
              <section key={block.id || i} className="section bg-cream">
                <div className="container-4">
                  <div className="section-head">
                    <h2 className="section-h">{typeName} in {city.name}</h2>
                  </div>
                  <div className="card r">
                    {block.description && (
                      <p style={{ fontSize: '1.05rem', color: 'var(--text-2)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                        {block.description}
                      </p>
                    )}
                    {keyFacts.length > 0 && (
                      <>
                        <h3 style={{ fontFamily: 'var(--sans)', fontSize: '1.2rem', color: 'var(--teal)', fontWeight: 700, marginBottom: '.9rem' }}>
                          Key Accident Factors in {city.name}
                        </h3>
                        <ul className="keyfacts" style={{ listStyle: 'none' }}>
                          {keyFacts.map((f: any, idx: number) => (
                            <li className="keyfact" key={idx}>
                              <Icon name="chev" style={{ color: '#4a8c7e', width: 18, height: 18 }} />
                              <span>{typeof f === 'object' ? f.fact : f}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </div>
              </section>
            )
            break
          }

          case 'firstHourSteps': {
            const steps = block.steps || []
            if (!steps || steps.length === 0) break
            acc.push(
              <section key={block.id || i} className="section bg-cream">
                <div className="container-4">
                  <div className="section-head">
                    <h2 className="section-h">The First Hour After an Accident in {city.name}</h2>
                  </div>
                  <div className="tl">
                    {steps.map((st: any, idx: number) => (
                      <div className="tl-step r" key={idx}>
                        <div className="tl-num">{idx + 1}</div>
                        <div>
                          <h3>{st.stepName || st.title}</h3>
                          <p>{st.stepDescription || st.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )
            break
          }

          case 'faq': {
            const items = block.items || []
            if (!items || items.length === 0) break
            const cFaqs = items.map((it: any) => ({ q: it.question, a: it.answerText }))
            acc.push(
              <FAQ
                key={block.id || i}
                faqs={cFaqs}
                bg="bg-cream"
                container="container-4"
                title={block.title || `Frequently Asked Questions — ${city.name}`}
              />
            )
            break
          }

          case 'exploreMore': {
            // Prefer CMS pages (hasMany relationship); fall back to cityAccidentTypes
            const rawPages: any[] = block.pages || []
            const pageDocs = rawPages
              .map((p) => (typeof p === 'object' && p !== null ? p : null))
              .filter(Boolean) as any[]

            const items = pageDocs.length > 0
              ? pageDocs
              : cityAccidentTypes
                  .filter((at) => at.slug !== accidentType)
                  .slice(0, 4)
                  .map((at) => ({
                    id: at.slug,
                    accidentType: at.slug,
                    fullSlug: `${cityKey}/${city.slug}/${at.slug}`,
                    title: `${at.name} in ${city.name}`,
                    pageType: 'cityType',
                  }))

            if (items.length === 0) break
            acc.push(
              <section key={block.id || i} className="section bg-white">
                <div className="container-5">
                  <div className="section-head">
                    <h2 className="section-h">Other Accident Types in {city.name}</h2>
                  </div>
                  <div className="grid grid-4">
                    {items.map((lk: any, idx: number) => {
                      const href = lk.fullSlug ? `/accidents/${lk.fullSlug}` : '#'
                      const icon = lk.accidentType ? (accidentTypes[lk.accidentType]?.icon || 'shield') : 'shield'
                      return (
                        <Link key={lk.id || idx} href={href} className="card link r">
                          <div className="card-ic"><Icon name={icon} /></div>
                          <div style={{ fontSize: '0.7rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
                            {lk.pageType || 'cityType'}
                          </div>
                          <h3>{lk.title}</h3>
                        </Link>
                      )
                    })}
                  </div>
                  <div style={{ marginTop: '1.5rem' }}>
                    <Link href={`/accidents/${r.cityKey}`} className="card-link">
                      All {s.name} cities &amp; law
                    </Link>
                  </div>
                </div>
              </section>
            )
            break
          }

          case 'cityResources': {
            const items: any[] = block.items || []
            const resources = items.length > 0
              ? items
              : CITY_SPECIALS.map(([slug, icon, titlePrefix, desc]) => ({
                  icon,
                  title: slug === 'police-report' ? `Get Your ${city.name} Crash Report` : `${titlePrefix} ${city.name}`,
                  description: desc.replace('{city}', city.name),
                  url: `/accidents/${r.cityKey}/${city.slug}/${slug}`,
                }))

            acc.push(
              <section key={block.id || i} className="section bg-cream">
                <div className="container-5">
                  <div className="section-head">
                    <h2 className="section-h">{city.name} Resources</h2>
                  </div>
                  <div className="grid grid-3">
                    {resources.map((item: any, idx: number) => (
                      <Link key={idx} href={item.url || '#'} className="card link r">
                        <div className="card-ic"><Icon name={item.icon || 'doc'} /></div>
                        <h3>{item.title}</h3>
                        <p style={{ fontSize: '.92rem', marginTop: '.4rem' }}>{item.description}</p>
                        <span className="card-link" style={{ marginTop: '.9rem' }}>Open</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            )
            break
          }

          case 'articleTimelineSteps': {
            const steps = block.steps || []
            if (!steps || steps.length === 0) break
            acc.push(
              <section key={block.id || i} className="section bg-cream">
                <div className="container-4">
                  <div className="section-head">
                    <h2 className="section-h">What to Do After a {typeName} in {city.name}</h2>
                  </div>
                  <div className="tl">
                    {steps.map((st: any, idx: number) => (
                      <div className="tl-step r" key={idx}>
                        <div className="tl-num">{idx + 1}</div>
                        <div>
                          <h3>{st.stepName || st.title}</h3>
                          <p>{st.stepDescription || st.text}</p>
                          {st.stepDays && (
                            <p style={{ fontSize: '.85rem', color: 'var(--text-4)', marginTop: '.3rem' }}>
                              {st.stepDays}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )
            break
          }

          case 'sources': {
            const srcs = block.sources || []
            if (!srcs || srcs.length === 0) break
            acc.push(
              <Sources
                key={block.id || i}
                citeTitle={block.citeTitle}
                citeUrl={block.citeUrl}
              />
            )
            break
          }

          case 'cta':
            if (!block.title && !block.sub && !block.subtitle) break
            acc.push(
              <CTABand
                key={block.id || i}
                title={block.title || `Injured in ${city.name}?`}
                sub={block.sub || block.subtitle}
                link={block.link}
              />
            )
            break

          case 'expert':
            acc.push(
              <Expert
                key={block.id || i}
                author={block.author}
                reviewType={block.reviewType}
                sourceText={block.sourceText}
                bg="bg-white"
              />
            )
            break

          case 'reportBlock':
            acc.push(
              <ReportBlock
                key={block.id || i}
                stateName={block.stateName}
                requestFrom={block.requestFrom}
                requestHow={block.requestHow}
                whenToAct={block.whenToAct}
                note={block.note}
                statuteYears={block.statuteYears}
                bg="bg-cream"
              />
            )
            break

          case 'actionKit':
            acc.push(
              <ActionKit
                key={block.id || i}
                bg="bg-white"
                title={block.title}
                intro={block.intro}
              />
            )
            break

          case 'stateLawBlock': {
            // Collect all consecutive stateLawBlocks starting at index i
            const lawBlocks: Block[] = []
            for (let j = i; j < blocks.length && blocks[j].blockType === 'stateLawBlock'; j++) {
              lawBlocks.push(blocks[j])
              // Null out consumed slots so they're skipped on next iteration
              ;(blocks as any)[j] = null
            }
            const lawBlockCount = lawBlocks.length
            const firstLb = lawBlocks[0] as any

            acc.push(
              <section key={firstLb.id || i} className="section bg-white">
                <div className="container-4">
                  <div className="section-head">
                    <h2 className="section-h">
                      {firstLb.stateName} Law Applies in {city.name}
                    </h2>
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: lawBlockCount >= 2 ? '1fr 1fr' : '1fr',
                      gap: '1.25rem',
                    }}
                  >
                    {lawBlocks.map((lb: any, idx) => (
                      <div key={lb.id || idx} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="law-box sage">
                          <h3>Negligence Rule</h3>
                          <p>
                            <strong>{lb.label}.</strong> {lb.faultThreshold}
                          </p>
                          <Link href={`/accidents/${r.cityKey}/${lb.topicSlug}`}>
                            Learn more <Icon name="arrow" />
                          </Link>
                        </div>
                        <div className="law-box terra">
                          <h3>Statute of Limitations</h3>
                          <p>
                            You have <strong>{lb.statuteYears} year{lb.statuteYears > 1 ? 's' : ''}</strong> to file from the date of your accident in {lb.stateName}.
                          </p>
                          <Link href={`/accidents/${r.cityKey}/${lb.statuteTopicSlug}`}>
                            Learn more <Icon name="arrow" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )
            break
          }

          default:
            break
        }
        return acc
      }, [])}
    </>
  )
}

// ─── Page Component ───────────────────────────────────────────────────────────

export function CityPage({ doc }: { doc: Doc }) {
  const { state, cityKey, citySlug, accidentType } = doc
  if (!state || !cityKey || !citySlug) return null
  const r = resolveState(state)
  if (!r) return null
  const cd = cityData[cityKey]
  if (!cd) return null
  const city = cd.cities.find((c: any) => c.slug === citySlug)
  if (!city) return null

  const typeObj = accidentType ? accidentTypes[accidentType] : null
  const blocks = doc.blocks || []

  return (
    <>
      {/* CMS-driven blocks */}
      <BlockRenderer blocks={blocks} r={r} city={city} typeObj={typeObj} accidentType={accidentType} cityKey={cityKey} />

      {/* Static sections — widgets not driven by CMS blocks */}
      <SettlementEstimator />
      <ArticleOverlays />

      <JsonLd data={generateAccidentJsonLd(doc)} />
    </>
  )
}
