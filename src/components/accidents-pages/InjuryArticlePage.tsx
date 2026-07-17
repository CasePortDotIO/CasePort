import Link from 'next/link'
import { Icon } from '@/components/Icon'
import { Breadcrumbs } from '@/components/article/Breadcrumbs'
import { Byline } from '@/components/article/Byline'
import { KeyTakeaways } from '@/components/article/KeyTakeaways'
import { Capsule } from '@/components/article/Capsule'
import { SectionTOC } from '@/components/article/SectionTOC'
import { Expert } from '@/components/article/Expert'
import { Sources } from '@/components/article/Sources'
import { ArticleOverlays } from '@/components/article/ArticleOverlays'
import { RecoveryViz } from '@/components/AccidentsRecoveryViz'
import { CTABand } from '@/components/AccidentsCTABand'
import { JsonLd } from '@/components/AccidentsJsonLd'
import { medicalWebPage, breadcrumb, speakable, orgGraph } from '@/lib/accidents-schema'
import { readingMinutes } from '@/lib/accidents-article'
import { getSpokeLead, getSpokeTitle } from '@/lib/injury-meta'
import type { InjuryArticle, InjuryType } from '@/payload-types'

const MED_REVIEWER = 'Dr. Elena Ramos, MD'

const SPOKE_SUFFIXES = ['symptoms', 'treatment', 'recovery-timeline', 'settlement-factors']

// ─── Block renderers ───────────────────────────────────────────────────────────

function SymptomsBlock({ block, injuryName }: { block: any; injuryName: string }) {
  const immediate = block?.immediate?.map((s: any) => s.item) || []
  const delayed = block?.delayed?.map((s: any) => s.item) || []
  const emergency = block?.emergency?.map((s: any) => s.item) || []

  const col = (title: string, ic: string, cls: string, items: string[]) => (
    <div className={'sym-col ' + cls}>
      <div className="sym-col-h">
        <Icon name={ic} />
        {title}
      </div>
      <ul>
        {items.map((s, i) => (
          <li key={i}>
            <Icon name={cls === 'emergency' ? 'alert' : 'check2'} />
            <span>{s}</span>
          </li>
        ))}
      </ul>
    </div>
  )

  return (
    <section className="section bg-white">
      <div className="container">
        <div className="sym-grid">
          {col('Immediate symptoms', 'clock', '', immediate)}
          {col('Delayed symptoms (hours–days)', 'steth', '', delayed)}
          {col('Emergency — call 911', 'alert', 'emergency', emergency)}
        </div>
        <p className="note" style={{ marginTop: '1.5rem' }}>
          <Icon name="alertC" />
          <span>
            This is educational information, not a diagnosis. If you have any emergency
            symptom, call 911 or go to the ER immediately.
          </span>
        </p>
      </div>
    </section>
  )
}

function TreatmentBlock({ block, injuryName }: { block: any; injuryName: string }) {
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

function RecoveryBlock({ block, injuryName }: { block: any; injuryName: string }) {
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
          <span>
            Recovery timelines are typical ranges, not guarantees. Your course depends on
            severity and individual factors — follow your clinician's guidance.
          </span>
        </p>
      </div>
    </section>
  )
}

function SettlementBlock({ block, injuryName }: { block: any; injuryName: string }) {
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
                <span>
                  <b style={{ color: 'var(--teal)' }}>{f.factor}.</b> {f.desc}
                </span>
              </span>
            </div>
          ))}
        </div>
        <p className="note" style={{ marginTop: '1.25rem' }}>
          <Icon name="alertC" />
          <span>
            These are the factors that influence value — not an estimate of your specific
            claim. No one can value a claim without reviewing your records.
          </span>
        </p>
      </div>
    </section>
  )
}

function DirectAnswerBlock({ block }: { block: any }) {
  const heading = block?.heading || ''
  const lead = block?.lead || ''
  if (!lead) return null

  const author: any = block?.author
  const authorName = typeof author === 'object' ? author?.name : undefined
  const authorRole = typeof author === 'object' ? author?.title : undefined

  return <Capsule heading={heading} lead={lead} authorName={authorName} authorRole={authorRole} />
}

function ProseBlock({ block }: { block: any }) {
  const sections = block?.sections || []
  if (!sections.length) return null
  return (
    <section className="section bg-cream">
      <div className="container-4">
        {sections.map((s: any, i: number) => (
          <div className="prose-sec" key={i}>
            <div className="prose">
              <h2>{s.title}</h2>
              <p>{s.content}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function KeyTakeawaysBlock({ block }: { block: any }) {
  const items = block?.items?.slice(0, 4).map((f: any) => f.item) || []
  if (!items.length) return null
  return <KeyTakeaways items={items} />
}

function ExpertBlock({ block }: { block: any }) {
  return <Expert author={block.author} reviewType={block.reviewType} sourceText={block.sourceText} bg="bg-white" />
}

function SourcesBlock({ block }: { block: any }) {
  return <Sources citeTitle={block.citeTitle} citeUrl={block.citeUrl} medical />
}

function CTABlock({ block }: { block: any }) {
  if (!block.title && !block.subtitle) return null
  return <CTABand title={block.title} sub={block.subtitle} btn="Get Free Case Review" />
}

function ExploreMoreBlock({ block, injuryName }: { block: any; injuryName: string }) {
  const pages: any[] = block?.pages || []
  if (!pages.length) return null

  return (
    <section className="section bg-cream">
      <div className="container-5">
        <div className="section-head">
          <h2 className="section-h">Go Deeper on {injuryName}</h2>
        </div>
        <div className="grid grid-4">
          {pages.map((page: any) => {
            const articleSlug = page.slug || ''
            const injSlug = SPOKE_SUFFIXES.reduce(
              (s, suffix) => s.replace(new RegExp(`-${suffix}$`), ''),
              articleSlug
            )
            const href = `/injuries/${injSlug}/${articleSlug}`
            const title = page.title || injuryName
            return (
              <Link key={page.id || articleSlug} href={href} className="card link r">
                <h3>{title}</h3>
                <span className="card-link" style={{ marginTop: '.9rem' }}>Open</span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─── Spoke meta helpers ────────────────────────────────────────────────────────

function getSpokeSub(article: InjuryArticle): string {
  const name = ((article.injuryType as any)?.title || '').toLowerCase()
  const spokeType = article.spokeType
  if (spokeType === 'symptoms') return `The symptoms of ${name} to watch for after a collision — including the delayed signs that appear hours to days later.`
  if (spokeType === 'treatment') return `How ${name} is treated, step by step — from initial evaluation through rehabilitation.`
  if (spokeType === 'recovery-timeline') return `The typical ${name} recovery timeline, from the acute phase through long-term outcomes.`
  if (spokeType === 'settlement-factors') return `The documented factors that increase or decrease the value of a ${name} claim.`
  return ''
}

export function InjuryArticlePage({ article }: { article: InjuryArticle }) {
  const art = article as any
  const allBlocks: any[] = art.blocks || []
  const injuryType = art.injuryType as InjuryType
  const spokeType = art.spokeType
  const injName = injuryType?.title || art.title || ''
  const injSlug = injuryType?.slug || ''

  const spoke = {
    slug: spokeType,
    label: spokeType === 'recovery-timeline' ? 'Recovery Timeline' : spokeType.charAt(0).toUpperCase() + spokeType.slice(1),
  }
  const metaLead = getSpokeLead(art)
  const metaTitle = getSpokeTitle(art)
  const metaSub = getSpokeSub(art)
  const minutes = readingMinutes(metaLead)

  // Fixed block order: KeyTakeaways → DirectAnswer → spoke block → Prose → Expert → Sources → ExploreMore → CTA
  const SPOKE_BLOCKS = new Set(['injuryArticleSymptoms', 'injuryArticleTreatment', 'injuryArticleRecovery', 'injuryArticleSettlement'])
  const BLOCK_ORDER = [
    'injuryArticleKeyTakeaways',
    'injuryArticleDirectAnswer',
    'injuryArticleProseSections',
    'injuryArticleExpert',
    'injuryArticleSources',
    'injuryArticleExploreMore',
    'injuryArticleCTA',
  ]

  const orderedBlocks: any[] = []

  // Spoke block first
  const spokeBlock = allBlocks.find(b => SPOKE_BLOCKS.has(b.blockType))
  if (spokeBlock) orderedBlocks.push(spokeBlock)

  // Then ordered blocks
  for (const blockType of BLOCK_ORDER) {
    const block = allBlocks.find(b => b.blockType === blockType)
    if (block) orderedBlocks.push(block)
  }

  return (
    <>
      <section className="page-intro">
        <div className="container-4">
          <Breadcrumbs
            items={[
              { label: 'Injuries', href: '/injuries' },
              { label: injName, href: `/injuries/${injSlug}` },
              { label: spoke.label },
            ]}
          />
          <div className="eyebrow" style={{ marginTop: '1.25rem' }}>
            {injName} · {spoke.label}
          </div>
          <h1>{metaTitle}</h1>
          <p className="section-sub" style={{ marginTop: '.9rem' }}>
            {metaSub}
          </p>
          <Byline reviewerName={MED_REVIEWER} isMedical minutes={minutes} />
        </div>
      </section>

      {/* All blocks rendered in CMS order */}
      {allBlocks.map((block: any, i: number) => {
        switch (block.blockType) {
          case 'injuryArticleSymptoms':
            return <SymptomsBlock key={block.id || i} block={block} injuryName={injName} />
          case 'injuryArticleTreatment':
            return <TreatmentBlock key={block.id || i} block={block} injuryName={injName} />
          case 'injuryArticleRecovery':
            return <RecoveryBlock key={block.id || i} block={block} injuryName={injName} />
          case 'injuryArticleSettlement':
            return <SettlementBlock key={block.id || i} block={block} injuryName={injName} />
          case 'injuryArticleDirectAnswer':
            return <DirectAnswerBlock key={block.id || i} block={block} />
          case 'injuryArticleProseSections':
            return <ProseBlock key={block.id || i} block={block} />
          case 'injuryArticleKeyTakeaways':
            return <KeyTakeawaysBlock key={block.id || i} block={block} />
          case 'injuryArticleExpert':
            return <ExpertBlock key={block.id || i} block={block} />
          case 'injuryArticleSources':
            return <SourcesBlock key={block.id || i} block={block} />
          case 'injuryArticleCTA':
            return <CTABlock key={block.id || i} block={block} />
          case 'injuryArticleExploreMore':
            return <ExploreMoreBlock key={block.id || i} block={block} injuryName={injName} />
          default:
            return null
        }
      })}

      <ArticleOverlays />

      <JsonLd
        data={[
          medicalWebPage({ headline: metaTitle, description: metaLead.slice(0, 180) }),
          breadcrumb([
            { name: 'Home', url: '/' },
            { name: 'Injuries', url: '/injuries' },
            { name: injName, url: `/injuries/${injSlug}` },
            { name: spoke.label || '', url: `/injuries/${injSlug}/${art.slug}` },
          ]),
          speakable(`/injuries/${injSlug}/${art.slug}`),
          ...orgGraph(),
        ]}
      />
    </>
  )
}
