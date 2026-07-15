'use client'

import Link from 'next/link'
import { InvisibleInjury } from '@/components/accidents-widgets/InvisibleInjury'
import { CTABand } from '@/components/AccidentsCTABand'
import { FAQ } from '@/components/AccidentsFAQ'
import { JsonLd } from '@/components/AccidentsJsonLd'
import { RecoveryViz } from '@/components/AccidentsRecoveryViz'
import { ArticleOverlays } from '@/components/article/ArticleOverlays'
import { Breadcrumbs } from '@/components/article/Breadcrumbs'
import { Byline } from '@/components/article/Byline'
import { Capsule } from '@/components/article/Capsule'
import { Expert } from '@/components/article/Expert'
import { HeroPhoto } from '@/components/article/HeroPhoto'
import { InGuideTOC } from '@/components/article/InGuideTOC'
import { KeyTakeaways } from '@/components/article/KeyTakeaways'
import { ProseSections } from '@/components/article/ProseSections'
import { Sources } from '@/components/article/Sources'
import { StatTiles } from '@/components/article/StatTiles'
import { Icon } from '@/components/Icon'
import { dashLabel, toSections } from '@/lib/accidents-article'
import {
  breadcrumb,
  itemList,
  medicalWebPage,
  orgGraph,
  speakable,
} from '@/lib/accidents-schema'
import type { InjuryType } from '@/payload-types'

const INJURY_SPOKES = [
  { slug: 'symptoms', label: 'Symptoms' },
  { slug: 'treatment', label: 'Treatment' },
  { slug: 'recovery-timeline', label: 'Recovery Timeline' },
  { slug: 'settlement-factors', label: 'Settlement Factors' },
]

const INVISIBLE = [
  'whiplash',
  'herniated-disc',
  'soft-tissue-injury',
  'neck-injury',
  'back-injury',
  'shoulder-injury',
]

// ─── Block Renderers ───────────────────────────────────────────────────────────

type Block = { id?: string; blockType: string; [key: string]: any }

function HeroBlock({ block, title }: { block: Block; title: string }) {
  const reviewerName = block.author
    ? typeof block.author === 'object'
      ? (block.author as any)?.name
      : String(block.author)
    : 'Dr. Elena Ramos, MD'
  const readTime = block.readTime ?? 0
  return (
    <HeroPhoto
      crumbs={
        <Breadcrumbs items={[{ label: 'Injuries', href: '/injuries' }, { label: title }]} />
      }
      eyebrow={block.eyebrow}
      title={block.heroTitle || title}
      sub={block.heroSubtitle}
      scene={block.scene}
      img={
        block.heroImage
          ? typeof block.heroImage === 'object'
            ? (block.heroImage as any)?.url
            : block.heroImage
          : undefined
      }
      byline={<Byline reviewerName={reviewerName || 'Dr. Elena Ramos, MD'} isMedical minutes={readTime} onDark />}
    />
  )
}

function StatTilesBlock({ block }: { block: Block }) {
  const items = block.items || []
  if (!items.length) return null
  return <StatTiles category={block.category || ''} stats={items.map((it: any) => ({ label: it.label, value: it.value }))} />
}

function KeyTakeawaysBlock({ block }: { block: Block }) {
  const items = block.items || []
  if (!items.length) return null
  return <KeyTakeaways items={items.map((it: any) => dashLabel(it.item))} />
}

function DirectAnswerBlock({ block, injuryName }: { block: Block; injuryName: string }) {
  return (
    <Capsule
      heading={block.heading || `What ${injuryName} is — and what it means for your claim`}
      lead={block.lead}
    />
  )
}

function ProseBlock({ block }: { block: Block }) {
  const raw = block?.sections || []
  if (!raw.length) return null
  const sections = toSections(raw as { title: string; content: string | string[] }[])
  return (
    <>
      <InGuideTOC sections={sections} />
      <ProseSections sections={sections} />
    </>
  )
}

function SymptomsBlock({ block, injuryName }: { block: Block; injuryName: string }) {
  const immediate = block?.immediate?.map((s: any) => s.item) || []
  const delayed = block?.delayed?.map((s: any) => s.item) || []
  const emergency = block?.emergency?.map((s: any) => s.item) || []
  const trapTitle = block?.trapTitle
  const trapContent = block?.trapContent
  const trapImage = block?.trapImage
  const trapImageUrl = trapImage
    ? typeof trapImage === 'object'
      ? (trapImage as any)?.url
      : trapImage
    : undefined

  return (
    <>
      <section className="section bg-white">
        <div className="container">
          <div className="sym-grid">
            <div className="sym-col">
              <div className="sym-col-h"><Icon name="clock" />Immediate symptoms</div>
              <ul>
                {immediate.map((s: string, i: number) => (
                  <li key={i}><Icon name="check2" /><span>{s}</span></li>
                ))}
              </ul>
            </div>
            <div className="sym-col">
              <div className="sym-col-h"><Icon name="steth" />Delayed symptoms (hours–days)</div>
              <ul>
                {delayed.map((s: string, i: number) => (
                  <li key={i}><Icon name="check2" /><span>{s}</span></li>
                ))}
              </ul>
            </div>
            <div className="sym-col emergency">
              <div className="sym-col-h"><Icon name="alert" />Emergency — call 911</div>
              <ul>
                {emergency.map((s: string, i: number) => (
                  <li key={i}><Icon name="check2" /><span>{s}</span></li>
                ))}
              </ul>
            </div>
          </div>
          <p className="note" style={{ marginTop: '1.5rem' }}>
            <Icon name="alertC" />
            <span>This is educational information, not a diagnosis. If you have any emergency symptom, call 911 or go to the ER immediately.</span>
          </p>
        </div>
      </section>
      {trapTitle && trapContent ? (
        <ProseBlock
          block={
            {
              sections: [
                {
                  title: trapTitle,
                  content: trapContent,
                  ...(trapImageUrl ? { image: trapImageUrl } : {}),
                },
              ],
            } as unknown as Block
          }
        />
      ) : null}
    </>
  )
}

function TreatmentBlock({ block, injuryName }: { block: Block; injuryName: string }) {
  const steps = block?.steps || []

  return (
    <section className="section bg-white">
      <div className="container-4">
        <div className="section-head">
          <h2 className="section-h">The {injuryName} treatment path</h2>
        </div>
        <div className="tx-list">
          {steps.map((t: any, i: number) => (
            <div className="tx-item r" key={i}>
              <div className="tx-num">{i + 1}</div>
              <div>
                <h3>{t.name}</h3>
                <p>{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function RecoveryBlock({ block, injuryName }: { block: Block; injuryName: string }) {
  const phases = block?.phases || []

  return (
    <section className="section bg-white">
      <div className="container-4">
        <div className="section-head">
          <h2 className="section-h">{injuryName} recovery, phase by phase</h2>
        </div>
        <RecoveryViz phases={phases} />
        <p className="note" style={{ marginTop: '1.5rem' }}>
          <Icon name="alertC" />
          <span>Recovery timelines are typical ranges, not guarantees. Your course depends on severity and individual factors.</span>
        </p>
      </div>
    </section>
  )
}

function SettlementBlock({ block, injuryName }: { block: Block; injuryName: string }) {
  const factors = block?.factors || []
  const lc = injuryName.toLowerCase()

  return (
    <section className="section bg-white">
      <div className="container-4">
        <div className="section-head">
          <h2 className="section-h">What drives the value of a {lc} claim</h2>
        </div>
        <div className="card r">
          {factors.map((f: any, i: number) => (
            <div className="keyfact" style={{ marginBottom: '1rem' }} key={i}>
              <span className="cap-fact" style={{ display: 'flex', gap: '.7rem', alignItems: 'flex-start' }}>
                <Icon name="check2" style={{ color: '#4a8c7e', flexShrink: 0, marginTop: 3 }} />
                <span><b style={{ color: 'var(--teal)' }}>{f.factor}.</b> {f.desc}</span>
              </span>
            </div>
          ))}
        </div>
        <p className="note" style={{ marginTop: '1.25rem' }}>
          <Icon name="alertC" />
          <span>These are the factors that influence value — not an estimate of your specific claim. No one can value a claim without reviewing your records.</span>
        </p>
      </div>
    </section>
  )
}

function FAQBlock({ block, injuryName }: { block: Block; injuryName: string }) {
  const items = block?.items || []
  const faqs = items.slice(0, 4).map((f: any) => ({ q: f.question || '', a: f.answerText || '' }))
  if (!faqs.length) return null
  return <FAQ faqs={faqs} bg="bg-white" title={`Frequently Asked Questions — ${injuryName}`} />
}

function ExpertBlock({ block }: { block: Block }) {
  return <Expert author={block.author} reviewType={block.reviewType} sourceText={block.sourceText} bg="bg-cream" />
}

function SourcesBlock({ block }: { block: Block }) {
  return <Sources citeTitle={block.citeTitle} citeUrl={block.citeUrl} medical />
}

function CTABlock({ block }: { block: Block }) {
  if (!block.title && !block.subtitle) return null
  // Resolve siteLink relationship — comes as full object when depth >= 1
  const siteLink = block.siteLink
  const resolvedHref =
    typeof siteLink === 'object' && siteLink?.url
      ? siteLink.url
      : typeof siteLink === 'string'
      ? siteLink
      : undefined
  return <CTABand title={block.title} sub={block.subtitle} link={resolvedHref} />
}

function ExploreMoreBlock({ block, injuryName, injurySlug }: { block: Block; injuryName: string; injurySlug: string }) {
  const pages: any[] = block.pages || []
  const hasPages = pages.length > 0

  return (
    <section className="section bg-cream">
      <div className="container-5">
        <div className="section-head">
          <h2 className="section-h">Go Deeper on {injuryName}</h2>
        </div>
        <div className="grid grid-4">
          {hasPages ? (
            pages.map((page: any) => {
              const articleSlug = typeof page === 'object' ? page.slug : page
              const articleTitle = typeof page === 'object' ? page.title : injuryName
              const articleSpokeType = typeof page === 'object' ? page.spokeType : ''
              const href = articleSpokeType
                ? `/injuries/${injurySlug}/${articleSpokeType}`
                : `/injuries/${injurySlug}`
              return (
                <Link key={articleSlug} href={href} className="card link r">
                  <h3>{articleTitle}</h3>
                  <span className="card-link" style={{ marginTop: '.9rem' }}>Open</span>
                </Link>
              )
            })
          ) : (
            <>
              {INJURY_SPOKES.map((sp) => (
                <Link key={sp.slug} href={`/injuries/${injurySlug}/${sp.slug}`} className="card link r">
                  <h3>{injuryName} {sp.label}</h3>
                  <span className="card-link" style={{ marginTop: '.9rem' }}>Open</span>
                </Link>
              ))}
              <Link href={`/injuries/${injurySlug}`} className="card link r">
                <h3>{injuryName} Overview</h3>
                <span className="card-link" style={{ marginTop: '.9rem' }}>Open</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  )
}

function RelatedInjuriesBlock({ block }: { block: Block }) {
  const injuryTypes: any[] = block.injuryTypes || []
  const sectionTitle = block.sectionTitle || 'Other Injuries'
  if (!injuryTypes.length) return null

  return (
    <section className="section bg-cream">
      <div className="container-5">
        <div className="section-head">
          <h2 className="section-h">{sectionTitle}</h2>
        </div>
        <div className="inj-grid">
          {injuryTypes.map((inj: any) => {
            const injSlug = typeof inj === 'object' ? inj.slug : inj
            const injTitle = typeof inj === 'object' ? inj.title : inj
            const injCategory = typeof inj === 'object' ? inj.category : null
            const injIcon = typeof inj === 'object' ? inj.icon : null
            return (
              <Link key={injSlug} href={`/injuries/${injSlug}`} className="card link r">
                <div className="card-ic">
                  <Icon name={injIcon || 'steth'} />
                </div>
                <h3>{injTitle}</h3>
                {injCategory && <p style={{ fontSize: '.95rem' }}>{injCategory}</p>}
                <span className="card-link" style={{ marginTop: '1rem' }}>
                  Symptoms, treatment &amp; value
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── Block Renderer ───────────────────────────────────────────────────────────

function BlockRenderer({ blocks, injuryName, injurySlug, invisible }: {
  blocks: Block[]
  injuryName: string
  injurySlug: string
  invisible: boolean
}) {
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.blockType) {
          case 'injuryTypeHero':
            return <HeroBlock key={block.id || i} block={block} title={injuryName} />
          case 'injuryTypeStatTiles':
            return <StatTilesBlock key={block.id || i} block={block} />
          case 'injuryTypeKeyTakeaways':
            return <KeyTakeawaysBlock key={block.id || i} block={block} />
          case 'injuryTypeDirectAnswer':
            return <DirectAnswerBlock key={block.id || i} block={block} injuryName={injuryName} />
          case 'injuryTypeProseSections':
            return <ProseBlock key={block.id || i} block={block} />
          case 'injuryTypeSymptoms':
            return <SymptomsBlock key={block.id || i} block={block} injuryName={injuryName} />
          case 'injuryTypeTreatment':
            return <TreatmentBlock key={block.id || i} block={block} injuryName={injuryName} />
          case 'injuryTypeRecovery':
            return <RecoveryBlock key={block.id || i} block={block} injuryName={injuryName} />
          case 'injuryTypeSettlement':
            return <SettlementBlock key={block.id || i} block={block} injuryName={injuryName} />
          case 'injuryTypeFAQ':
            return <FAQBlock key={block.id || i} block={block} injuryName={injuryName} />
          case 'injuryTypeExpert':
            return <ExpertBlock key={block.id || i} block={block} />
          case 'injuryTypeSources':
            return <SourcesBlock key={block.id || i} block={block} />
          case 'injuryTypeCTA':
            return <CTABlock key={block.id || i} block={block} />
          case 'injuryTypeExploreMore':
            return <ExploreMoreBlock key={block.id || i} block={block} injuryName={injuryName} injurySlug={injurySlug} />
          case 'injuryTypeRelatedInjuries':
            return <RelatedInjuriesBlock key={block.id || i} block={block} />
          default:
            return null
        }
      })}
      {invisible && <InvisibleInjury />}
    </>
  )
}

// ─── Page Component ───────────────────────────────────────────────────────────

export function InjuryTypePage({
  injuryType,
}: {
  injuryType: InjuryType
}) {
  const inj = injuryType as any
  const blocks: Block[] = inj.blocks || []
  const injName = inj.title || ''
  const injSlug = inj.slug || ''
  const invisible = INVISIBLE.includes(injSlug)

  return (
    <>
      <BlockRenderer
        blocks={blocks}
        injuryName={injName}
        injurySlug={injSlug}
        invisible={invisible}
      />

      <ArticleOverlays />

      <JsonLd
        data={[
          medicalWebPage({ headline: injName, description: (inj.directAnswer || '').slice(0, 180) }),
          itemList([]),
          breadcrumb([
            { name: 'Home', url: '/' },
            { name: 'Injuries', url: '/injuries' },
            { name: injName, url: `/injuries/${injSlug}` },
          ]),
          speakable(`/injuries/${injSlug}`),
          ...orgGraph(),
        ]}
      />
    </>
  )
}
