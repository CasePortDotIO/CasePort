import Link from 'next/link'
import { Breadcrumbs } from '@/components/article/Breadcrumbs'
import { Byline } from '@/components/article/Byline'
import { Capsule } from '@/components/article/Capsule'
import { Expert } from '@/components/article/Expert'
import { HeroPhoto } from '@/components/article/HeroPhoto'
import { KeyTakeaways } from '@/components/article/KeyTakeaways'
import { SectionTOC } from '@/components/article/SectionTOC'
import { Sources } from '@/components/article/Sources'
import { StatTiles } from '@/components/article/StatTiles'
import { CTABand } from '@/components/AccidentsCTABand'
import { FAQ } from '@/components/AccidentsFAQ'
import { GlossaryBrowser } from '@/components/accidents-widgets/GlossaryBrowser'
import { Icon } from '@/components/Icon'
import { JsonLd } from '@/components/AccidentsJsonLd'
import { ArticleOverlays } from '@/components/article/ArticleOverlays'
import { CustomRichText } from '@/components/insights/RichTextRenderer'
import { reviewer } from '@/lib/accidents-constants'
import { readingMinutes } from '@/lib/accidents-article'
import { firstHourSteps } from '@/lib/accidents-firstHour'
import {
  article,
  breadcrumb,
  definedTermSet,
  faqSchema,
  howto,
  medicalWebPage,
  orgGraph,
  speakable,
} from '@/lib/accidents-schema'

// ─── Spoke metadata ──────────────────────────────────────────────────────────

const SPOKE_TITLE: Record<string, (name: string) => string> = {
  'what-to-do': (n) => `What To Do After a ${n}`,
  'settlement-amounts': (n) => `${n} Settlement Amounts`,
  'do-i-need-a-lawyer': () => 'Do I Need a Lawyer?',
  'statute-of-limitations': () => 'How Long to File a Claim',
}

const SPOKE_DEFS = [
  { slug: 'what-to-do', label: 'What To Do', note: 'Step-by-step actions in the first 72 hours.' },
  { slug: 'settlement-amounts', label: 'Settlement Ranges', note: 'What claims are worth by severity.' },
  { slug: 'do-i-need-a-lawyer', label: 'Do I Need a Lawyer?', note: 'When representation helps — and when it may not.' },
  { slug: 'statute-of-limitations', label: 'Filing Deadlines', note: 'Your state\'s statute of limitations.' },
]

// ─── Block type map ─────────────────────────────────────────────────────────

type Block = {
  blockType: string
  [key: string]: any
}

type GuideNewDoc = {
  title: string
  slug: string
  pageType: 'guideCategory' | 'guideArticle'
  excerpt?: string
  blocks?: Block[]
  settings?: {
    showSpokes?: boolean
    showExpert?: boolean
    showFAQ?: boolean
    showSources?: boolean
    showEndCTA?: boolean
    showTakeHome?: boolean
    difficultyLevel?: string
  }
  seo?: {
    focusKeyword?: string
    metaTitle?: string
    metaDescription?: string
    canonicalUrl?: string
  }
  aeo?: {
    voiceAnswer?: string
  }
  publishedDate?: string
}

// ─── Hero Block Renderer ────────────────────────────────────────────────────

function RenderHero({ block }: { block: Block }) {
  return (
    <HeroPhoto
      eyebrow={block.eyebrow}
      title={block.title}
      sub={block.subtitle}
      scene={block.scene}
      img={block.image ? (typeof block.image === 'object' ? block.image.url : block.image) : '/accidents/img/road.png'}
      byline={
        block.showByline !== false ? (
          <Byline reviewerName={reviewer.name} minutes={2} onDark />
        ) : undefined
      }
    />
  )
}

// ─── Stat Tiles Renderer ────────────────────────────────────────────────────

function RenderStatTiles({ block }: { block: Block }) {
  if (!block.stats?.length) return null
  return <StatTiles category={block.category || 'National guide'} stats={block.stats} />
}

// ─── Key Takeaways Renderer ────────────────────────────────────────────────

function RenderKeyTakeaways({ block }: { block: Block }) {
  const items = (block.items || []).map((i: any) =>
    typeof i === 'string' ? i : i.item || ''
  )
  if (items.length < 1) return null
  return <KeyTakeaways items={items} />
}

// ─── Capsule Renderer ───────────────────────────────────────────────────────

function RenderCapsule({ block }: { block: Block }) {
  return (
    <Capsule
      heading={block.heading}
      lead={block.lead}
    />
  )
}

// ─── Rich Text Renderer ────────────────────────────────────────────────────

function RenderRichText({ block }: { block: Block }) {
  return (
    <section className="section bg-white">
      <div className="container-4">
        {block.sectionTitle && (
          <div className="prose-sec r">
            <div className="prose">
              <h2>{block.sectionTitle}</h2>
            </div>
          </div>
        )}
        {block.content && (
          <div className="prose-sec r">
            <div className="prose">
              <CustomRichText content={block.content} />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

// ─── Direct Answer Renderer ────────────────────────────────────────────────

function RenderDirectAnswer({ block }: { block: Block }) {
  return (
    <section className="section bg-white" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div className="container-4">
        <div className="capsule r">
          <div className="cap-label">Direct Answer</div>
          {block.text && <CustomRichText content={block.text} />}
          <div className="cap-foot">
            <span className="ci">
              <Icon name="award" />
              Reviewed by {reviewer.name}, {reviewer.title}
            </span>
            <span className="ci">
              <Icon name="cal" />
              Updated June 2026
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── FAQ Accordion Renderer ────────────────────────────────────────────────

function RenderFAQAccordion({ block }: { block: Block }) {
  const faqs = (block.faqs || []).map((f: any) => ({
    q: f.question || f.q || '',
    a: f.answer || f.a || '',
  }))
  if (!faqs.length) return null
  return (
    <FAQ
      faqs={faqs}
      bg="bg-white"
      title={block.title || 'Frequently Asked Questions'}
    />
  )
}

// ─── Step Checklist Renderer ────────────────────────────────────────────────

function RenderStepChecklist({ block }: { block: Block }) {
  const steps = block.steps || []
  if (!steps.length) return null
  return (
    <section className="section bg-cream">
      <div className="container-4">
        <div className="section-head">
          <h2 className="section-h">Step by Step</h2>
        </div>
        {block.intro && <p className="lead" style={{ marginBottom: '2rem' }}>{block.intro}</p>}
        <div className="step-list">
          {steps.map((step: any, i: number) => (
            <div key={i} className="step-item r">
              <div className="step-num">{i + 1}</div>
              <div className="step-body">
                <h3>{step.name}</h3>
                {step.timeWindow && (
                  <span className="step-time">{step.timeWindow}</span>
                )}
                {step.bullets?.length > 0 && (
                  <ul className="step-bullets">
                    {step.bullets.map((b: any, bi: number) => (
                      <li key={bi}>
                        <Icon name="check2" />
                        {typeof b === 'string' ? b : b.b || ''}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Settlement Range Renderer ───────────────────────────────────────────────

function RenderSettlementRange({ block }: { block: Block }) {
  const settlements = block.settlements || []
  return (
    <section className="section bg-white">
      <div className="container-4">
        <div className="section-head">
          <h2 className="section-h">Settlement Ranges</h2>
        </div>
        {block.methodologyNote && (
          <p className="section-sub" style={{ fontSize: '.9rem', color: 'var(--gray)' }}>
            {block.methodologyNote}
          </p>
        )}
        {settlements.length > 0 && (
          <div className="stat-tiles" style={{ marginTop: '1.5rem' }}>
            {settlements.map((s: any, i: number) => (
              <div key={i} className="stat-tile">
                <div className="lbl">{s.severityTier}</div>
                <div className="val">
                  {s.lowLabel && s.highLabel
                    ? `${s.lowLabel} – ${s.highLabel}`
                    : s.lowLabel || s.highLabel || '—'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

// ─── Attorney Comparison Renderer ──────────────────────────────────────────

function RenderAttorneyComparison({ block }: { block: Block }) {
  const rows = block.rows || []
  return (
    <section className="section bg-cream">
      <div className="container-4">
        <div className="section-head">
          <h2 className="section-h">{block.title || 'With an Attorney vs. Without'}</h2>
          {block.subtitle && <p className="section-sub">{block.subtitle}</p>}
        </div>
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Factor</th>
                <th>With an Attorney</th>
                <th>Without an Attorney</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r: any, i: number) => (
                <tr key={i}>
                  <td className="strong">{r.factor}</td>
                  <td>{r.withAttorney}</td>
                  <td>{r.withoutAttorney}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

// ─── Statute of Limitations Renderer ──────────────────────────────────────

function RenderStatuteLimitations({ block }: { block: Block }) {
  const states = block.states || []
  return (
    <section className="section bg-white">
      <div className="container-4">
        <div className="section-head">
          <h2 className="section-h">{block.title || 'Statute of Limitations'}</h2>
          {block.description && <p className="section-sub">{block.description}</p>}
        </div>
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>State</th>
                <th>Years</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {states.map((s: any, i: number) => (
                <tr key={i}>
                  <td className="strong">{s.state}</td>
                  <td className="num">{s.years}</td>
                  <td>{s.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {block.exceptions?.length > 0 && (
          <div style={{ marginTop: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '.75rem' }}>Common Exceptions</h3>
            <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem' }}>
              {block.exceptions.map((e: any, i: number) => (
                <li key={i}>{typeof e === 'string' ? e : e.exception}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}

// ─── CTA Bridge Renderer ───────────────────────────────────────────────────

function RenderCTABridge({ block }: { block: Block }) {
  const bridges = block.bridges || []
  return (
    <section className="section bg-cream">
      <div className="container-5">
        {block.title && (
          <div className="section-head">
            <h2 className="section-h">{block.title}</h2>
          </div>
        )}
        <div className="grid grid-3">
          {bridges.map((b: any, i: number) => (
            <Link key={i} href={b.href || '#'} className="card link r">
              <div className="card-ic">
                <Icon name={b.icon || 'arrow'} />
              </div>
              <h3>{b.linkText}</h3>
              <p style={{ fontSize: '.92rem', marginTop: '.4rem' }}>{b.description}</p>
              <span className="card-link" style={{ marginTop: '.8rem', fontSize: '.85rem' }}>
                Open
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Expert Renderer ────────────────────────────────────────────────────────

function RenderExpert({ block }: { block: Block }) {
  return <Expert bg="bg-cream" medical={block.showMedical} />
}

// ─── Sources Renderer ───────────────────────────────────────────────────────

function RenderSources({ block }: { block: Block }) {
  return (
    <Sources
      medical={block.showMedical}
      citeTitle={block.citeTitle || ''}
      citeUrl={block.citeUrl || ''}
    />
  )
}

// ─── End CTA Renderer ──────────────────────────────────────────────────────

function RenderEndCTA({ block }: { block: Block }) {
  return (
    <CTABand
      title={block.title}
      sub={block.sub}
      btn={block.btn}
    />
  )
}

// ─── Glossary Browser Renderer ──────────────────────────────────────────────

function RenderGlossaryBrowser({ block }: { block: Block }) {
  if (block.terms?.length) {
    return (
      <section className="section bg-white" style={{ paddingTop: '2rem' }}>
        <div className="container-4">
          <div className="gl-list">
            {block.terms.map((t: any, i: number) => (
              <div key={i} className="gl-item r">
                <div className="gl-item-head">
                  <h3 className="gl-term">{t.term}</h3>
                  {t.category && <span className="gl-cat">{t.category}</span>}
                </div>
                <p className="gl-def">{t.definition}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
  return <GlossaryBrowser />
}

// ─── FAQ Group Renderer ────────────────────────────────────────────────────

function RenderFAQGroup({ block }: { block: Block }) {
  const items = (block.items || []).map((it: any) => ({
    q: it.q || it.question || '',
    a: it.a || it.answer || '',
  }))
  return (
    <section className="section bg-white">
      <div className="container-3">
        <div className="faq-group">
          {block.groupTitle && (
            <h2 className="section-h" style={{ fontSize: 'clamp(1.4rem,2.6vw,1.8rem)', marginBottom: '1.25rem' }}>
              {block.groupTitle}
            </h2>
          )}
          <div className="faq-list">
            {items.map((f: any, i: number) => (
              <details className="faq-item r" key={i} open={i === 0}>
                <summary className="faq-summary">
                  <span className="q">{f.q}</span>
                  <span className="faq-ic">
                    <Icon name="chev" />
                  </span>
                </summary>
                <div className="faq-answer">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Block dispatcher ───────────────────────────────────────────────────────

function renderBlock(block: Block) {
  switch (block.blockType) {
    case 'hero':            return <RenderHero key={block.id || block._id} block={block} />
    case 'statTiles':       return <RenderStatTiles key={block.id || block._id} block={block} />
    case 'keyTakeaways':    return <RenderKeyTakeaways key={block.id || block._id} block={block} />
    case 'capsule':         return <RenderCapsule key={block.id || block._id} block={block} />
    case 'sectionToc':      return block.enabled !== false ? <SectionTOC key="section-toc" /> : null
    case 'richText':        return <RenderRichText key={block.id || block._id} block={block} />
    case 'directAnswer':    return <RenderDirectAnswer key={block.id || block._id} block={block} />
    case 'faqAccordion':    return <RenderFAQAccordion key={block.id || block._id} block={block} />
    case 'stepChecklist':   return <RenderStepChecklist key={block.id || block._id} block={block} />
    case 'settlementRange': return <RenderSettlementRange key={block.id || block._id} block={block} />
    case 'attorneyComparison': return <RenderAttorneyComparison key={block.id || block._id} block={block} />
    case 'statuteLimitations': return <RenderStatuteLimitations key={block.id || block._id} block={block} />
    case 'ctaBridge':      return <RenderCTABridge key={block.id || block._id} block={block} />
    case 'expert':         return <RenderExpert key={block.id || block._id} block={block} />
    case 'sources':        return <RenderSources key={block.id || block._id} block={block} />
    case 'endCta':         return <RenderEndCTA key={block.id || block._id} block={block} />
    case 'glossaryBrowser': return <RenderGlossaryBrowser key={block.id || block._id} block={block} />
    case 'faqGroup':       return <RenderFAQGroup key={block.id || block._id} block={block} />
    default:                return null
  }
}

// ─── Main page component ────────────────────────────────────────────────────

export function GuideNewPage({
  guide,
  pageType,
  pillarSlug,
  spokeSlug,
}: {
  guide: GuideNewDoc
  pageType?: 'guidePillar' | 'guideSpoke' | 'guideArticle'
  pillarSlug?: string
  spokeSlug?: string
}) {
  const blocks = guide.blocks || []
  const settings = guide.settings || {}

  const allFaqs = blocks.flatMap((b) => {
    if (b.blockType === 'faqAccordion' && Array.isArray(b.faqs)) {
      return b.faqs.map((f: any) => ({ q: f.question || f.q, a: f.answer || f.a }))
    }
    if (b.blockType === 'faqGroup' && Array.isArray(b.items)) {
      return b.items.map((it: any) => ({ q: it.q || it.question, a: it.a || it.answer }))
    }
    return []
  })

  const articleTitle = guide.seo?.metaTitle || guide.title || ''
  const articleDescription = guide.seo?.metaDescription || guide.excerpt || ''
  const articleUrl = `/guide-new/${guide.slug}`
  const isMedical = pillarSlug === 'medical-malpractice'

  // Lead text for read-time calculation
  const leadText = blocks
    .filter((b) => ['capsule', 'standfirst', 'directAnswer'].includes(b.blockType))
    .map((b) => (b as any).lead || (b as any).text || '')
    .join(' ')

  const jsonLdData = [
    article({ headline: articleTitle, description: articleDescription }),
    allFaqs.length > 0 ? faqSchema(allFaqs) : null,
    breadcrumb([
      { name: 'Home', url: '/' },
      { name: 'Guide', url: '/guide' },
      ...(pageType === 'guideSpoke' && pillarSlug
        ? [{ name: guide.title, url: `/guide-new/${pillarSlug}` }]
        : []),
      ...(pageType === 'guideSpoke' && spokeSlug
        ? [{ name: SPOKE_TITLE[spokeSlug]?.(guide.title) || spokeSlug, url: articleUrl }]
        : [{ name: guide.title, url: articleUrl }]),
    ]),
    speakable(articleUrl),
    ...orgGraph(),
  ].filter(Boolean)

  // ── Pillar layout ──────────────────────────────────────────────────────────
  if (pageType === 'guidePillar' && pillarSlug) {
    return (
      <>
        {/* Hero */}
        <HeroPhoto
          crumbs={
            <Breadcrumbs
              items={[
                { label: 'Guide', href: '/guide' },
                { label: guide.title },
              ]}
            />
          }
          eyebrow="Accident Guide · National"
          title={guide.title}
          sub={(guide as any).subtitle || (guide as any).excerpt || ''}
          scene={(guide as any).scene || ''}
          img={(guide as any).image || '/accidents/img/road.png'}
          byline={
            <Byline reviewerName={reviewer.name} minutes={readingMinutes(leadText)} onDark />
          }
        />

        {/* Block-rendered sections */}
        {blocks.map((block, i) => (
          <RenderBlockWrapper key={block.id || block._id || i} block={block} />
        ))}

        {/* Spoke navigation grid */}
        <section className="section bg-white">
          <div className="container-5">
            <div className="section-head">
              <h2 className="section-h">{guide.title} — The Key Questions</h2>
              <p className="section-sub">
                The four things people search for most after a {guide.title.toLowerCase()}.
              </p>
            </div>
            <div className="grid grid-4">
              {SPOKE_DEFS.map((sp) => (
                <Link
                  key={sp.slug}
                  href={`/guide-new/${pillarSlug}/${sp.slug}`}
                  className="card link r"
                >
                  <h3>{SPOKE_TITLE[sp.slug](guide.title)}</h3>
                  <p style={{ fontSize: '.9rem', marginTop: '.4rem' }}>{sp.note}</p>
                  <span className="card-link" style={{ marginTop: '.8rem', fontSize: '.85rem' }}>
                    Read
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Expert */}
        <Expert bg="bg-cream" medical={isMedical} />

        {/* FAQ */}
        {allFaqs.length > 0 && (
          <FAQ faqs={allFaqs} bg="bg-white" title={`Frequently Asked Questions — ${guide.title}`} />
        )}

        {/* Sources */}
        <Sources
          medical={isMedical}
          citeTitle={`${guide.title} — The Complete Guide`}
          citeUrl={articleUrl}
        />

        {/* End CTA */}
        {settings.showEndCTA !== false && (
          <CTABand
            title={`Questions About Your ${guide.title} Claim?`}
            sub="Get a free, confidential case review — no cost, no obligation."
            btn="Get Free Case Review"
          />
        )}

        <ArticleOverlays />
        <JsonLd data={jsonLdData} />
      </>
    )
  }

  // ── Spoke layout ──────────────────────────────────────────────────────────
  if (pageType === 'guideSpoke' && pillarSlug && spokeSlug) {
    const spokeLabel = SPOKE_DEFS.find((s) => s.slug === spokeSlug)?.label || spokeSlug

    return (
      <>
        {/* Hero */}
        <HeroPhoto
          crumbs={
            <Breadcrumbs
              items={[
                { label: 'Guide', href: '/guide' },
                { label: guide.title, href: `/guide-new/${pillarSlug}` },
                { label: spokeLabel },
              ]}
            />
          }
          eyebrow={`${guide.title} · National`}
          title={guide.title}
          sub={(guide as any).subtitle || ''}
          scene={(guide as any).scene || ''}
          img={(guide as any).image || '/accidents/img/road.png'}
          byline={
            <Byline reviewerName={reviewer.name} minutes={readingMinutes(leadText)} onDark />
          }
        />

        {/* Block-rendered sections */}
        {blocks.map((block, i) => (
          <RenderBlockWrapper key={block.id || block._id || i} block={block} />
        ))}

        {/* More on pillar */}
        <section className="section bg-white">
          <div className="container-5">
            <div className="section-head">
              <h2 className="section-h">More on {guide.title}</h2>
            </div>
            <div className="grid grid-4">
              {SPOKE_DEFS.filter((s) => s.slug !== spokeSlug).map((s) => (
                <Link
                  key={s.slug}
                  href={`/guide-new/${pillarSlug}/${s.slug}`}
                  className="card link r"
                >
                  <h3>
                    {guide.title}: {s.label}
                  </h3>
                  <p style={{ fontSize: '.9rem', marginTop: '.4rem' }}>{s.note}</p>
                </Link>
              ))}
              <Link href={`/guide-new/${pillarSlug}`} className="card link r">
                <h3>{guide.title} — full guide</h3>
                <p style={{ fontSize: '.9rem', marginTop: '.4rem' }}>
                  The complete national overview.
                </p>
              </Link>
            </div>
          </div>
        </section>

        {/* Expert */}
        <Expert bg="bg-cream" medical={isMedical} />

        {/* FAQ */}
        {allFaqs.length > 0 && (
          <FAQ faqs={allFaqs} bg="bg-cream" title="Frequently Asked Questions" />
        )}

        {/* Sources */}
        <Sources medical={isMedical} citeTitle={articleTitle} citeUrl={articleUrl} />

        {/* End CTA */}
        {settings.showEndCTA !== false && (
          <CTABand
            title={`Questions About Your ${guide.title}?`}
            sub="Get a free, confidential case review — no cost, no obligation."
            btn="Get Free Case Review"
          />
        )}

        <ArticleOverlays />
        <JsonLd data={jsonLdData} />
      </>
    )
  }

  // ── Default / guideArticle layout ─────────────────────────────────────────
  return (
    <>
      {blocks.map((block, i) => (
        <RenderBlockWrapper key={block.id || block._id || i} block={block} />
      ))}

      {settings.showEndCTA !== false && (
        <CTABand
          title="Have a Specific Question?"
          sub="Get a free, confidential case review. No cost, no obligation — just answers about your situation."
          btn="Get Free Case Review"
        />
      )}

      <ArticleOverlays />
      <JsonLd data={jsonLdData} />
    </>
  )
}

function RenderBlockWrapper({ block }: { block: Block }) {
  return renderBlock(block)
}
