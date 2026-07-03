'use client'

import { useState } from 'react'
import Link from 'next/link'
import { TakeHome } from '@/components/accidents-widgets/TakeHome'
import { CTABand } from '@/components/AccidentsCTABand'
import { FAQ } from '@/components/AccidentsFAQ'
import { JsonLd } from '@/components/AccidentsJsonLd'
import { ArticleOverlays } from '@/components/article/ArticleOverlays'
import { Breadcrumbs } from '@/components/article/Breadcrumbs'
import { Byline } from '@/components/article/Byline'
import { Capsule } from '@/components/article/Capsule'
import { HeroPhoto } from '@/components/article/HeroPhoto'
import { KeyTakeaways } from '@/components/article/KeyTakeaways'
import { ProseSections } from '@/components/article/ProseSections'
import { SectionTOC } from '@/components/article/SectionTOC'
import { Sources } from '@/components/article/Sources'
import { StatTiles } from '@/components/article/StatTiles'
import { Icon } from '@/components/Icon'
import { guidePillars } from '@/data'
import { dashLabel, readingMinutes } from '@/lib/accidents-article'
import { reviewer, SITE_URL } from '@/lib/accidents-constants'
import {
  article,
  breadcrumb,
  faqSchema,
  medicalWebPage,
  orgGraph,
  speakable,
} from '@/lib/accidents-schema'

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
  { slug: 'statute-of-limitations', label: 'Filing Deadlines', note: "Your state's statute of limitations." },
]

type CategoryBlock = {
  blockType: string
  [key: string]: any
}

type Category = {
  id: string
  title: string
  slug: string
  dataKey?: string
  blocks?: CategoryBlock[]
  heroImage?: { url: string }
  metaTitle?: string
  metaDescription?: string
  schemaType?: string
  heroTitle?: string
  heroSubtitle?: string
  updatedAt?: string
  breadcrumbTitle?: string
  articleTitle?: string
}

// ─── Block Renderers ──────────────────────────────────────────────────────────

function DirectAnswerBlock({ block, updatedAt }: { block: CategoryBlock; updatedAt?: string }) {
  const heading = block.heading || 'What you need to know about car accident'
  const lead = block.text || ''
  const author = block.author as { name?: string; title?: string } | undefined
  const authorName = author?.name || reviewer.name
  const authorRole = author?.title || reviewer.title

  // Format updatedAt (e.g. "2026-06-24T00:00:00.000Z" → "June 2026")
  let updatedDate = 'June 2026'
  if (updatedAt) {
    const d = new Date(updatedAt)
    updatedDate = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  if (!lead) return null
  return (
    <Capsule
      heading={heading}
      lead={lead}
      authorName={authorName}
      authorRole={authorRole}
      updatedDate={updatedDate}
    />
  )
}

function QuickAnswerStatsBlock({ block }: { block: CategoryBlock }) {
  const { average, successRate, timeline, upfront } = block
  const hasAny = [average, successRate, timeline, upfront].some(Boolean)
  if (!hasAny) return null
  const stats = [
    average && { label: 'Avg Settlement', value: average },
    successRate && { label: 'Success Rate', value: successRate },
    timeline && { label: 'Timeline', value: timeline },
    upfront && { label: 'Upfront Cost', value: upfront },
  ].filter(Boolean) as { label: string; value: string }[]
  return <StatTiles category="National guide" stats={stats} />
}

function KeyTakeawaysBlock({ block }: { block: CategoryBlock }) {
  const items = block.items || []
  if (!items.length) return null
  const takeaways = items.map((k: any) => dashLabel(k.fact))
  return <KeyTakeaways items={takeaways} />
}

function ProseSectionsBlock({ block }: { block: CategoryBlock }) {
  const sections = block.sections || []
  if (!sections.length) return null
  const transformed = sections.map((s: any) => ({
    ...s,
    paras: (s.paras || []).map((p: any) => (typeof p === 'string' ? p : p.text)),
  }))
  return <ProseSections sections={transformed} />
}

function FAQBlock({ block }: { block: CategoryBlock }) {
  const items = block.items || []
  if (!items.length) return null
  const faqs = items.map((f: any) => ({ q: f.question, a: f.answer }))
  return <FAQ faqs={faqs} bg="bg-white" title="Frequently Asked Questions" />
}

function StatuteDeadlinesBlock({ block }: { block: CategoryBlock }) {
  const { description, byState } = block
  const states = byState || []
  if (!states.length) return null
  return (
    <section className="section bg-cream">
      <div className="container-4">
        <div className="section-head">
          <h2 className="section-h">Statute of Limitations by State</h2>
          {description && <p className="section-sub">{description}</p>}
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
      </div>
    </section>
  )
}

function WhyImportantBlock({ block }: { block: CategoryBlock }) {
  const { intro, points } = block
  if (!intro && !points?.length) return null
  return (
    <section className="section bg-cream">
      <div className="container-4">
        <div className="prose">
          <h2>Why Your Case Is Worth More Than You Think</h2>
          {intro && <p className="lead">{intro}</p>}
          {points?.map((p: any, i: number) => (
            <div key={i} style={{ borderLeft: '3px solid var(--gold)', paddingLeft: '1rem', marginBottom: '1.5rem' }}>
              <h3 style={{ color: 'var(--ink)' }}>{p.heading}</h3>
              {p.body && <p>{p.body}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Article Block Renderers (same slugs as GUIDEARTICLE_BLOCKS) ──────────────

function ArticleDirectAnswerBlock({ block, updatedAt }: { block: CategoryBlock; updatedAt?: string }) {
  const heading = block.heading || 'What you need to know'
  const lead = block.text || ''
  const author = block.author as { name?: string; title?: string } | undefined
  const authorName = author?.name || reviewer.name
  const authorRole = author?.title || reviewer.title
  let updatedDate = 'June 2026'
  if (updatedAt) {
    const d = new Date(updatedAt)
    updatedDate = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }
  if (!lead) return null
  return (
    <Capsule
      heading={heading}
      lead={lead}
      authorName={authorName}
      authorRole={authorRole}
      updatedDate={updatedDate}
    />
  )
}

function ArticleKeyTakeawaysBlock({ block }: { block: CategoryBlock }) {
  const items = block.items || []
  if (!items.length) return null
  const takeaways = items.map((k: any) => dashLabel(k.fact))
  return <KeyTakeaways items={takeaways} />
}

function ArticleFAQBlock({ block }: { block: CategoryBlock }) {
  const items = block.items || []
  if (!items.length) return null
  const faqs = items.map((f: any) => ({ q: f.question, a: f.answerText || f.answer }))
  return <FAQ faqs={faqs} bg="bg-white" title="Frequently Asked Questions" />
}

function ArticleRelatedGuidesBlock({ block, categorySlug }: { block: CategoryBlock; categorySlug?: string }) {
  const articles = (block.articles as any[]) || []
  if (!articles.length) return null
  return (
    <section className="section bg-white">
      <div className="container-5">
        <div className="section-head">
          <h2 className="section-h">Related Guides</h2>
        </div>
        <div className="grid grid-4">
          {articles.map((article) => (
            <Link key={article.id} href={`/guides/${categorySlug || article.guideCategory?.slug || 'guide'}/${article.slug}`} className="card link r">
              <h3 style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{article.title}</h3>
              {article.excerpt && (
                <p style={{ fontSize: '.85rem', color: 'var(--muted)', marginTop: '.4rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{article.excerpt}</p>
              )}
              <span className="card-link" style={{ marginTop: '.8rem', fontSize: '.85rem' }}>Read</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function ArticleSourcesBlock({ block, categorySlug, categoryName }: { block: CategoryBlock; categorySlug?: string; categoryName?: string }) {
  const blockSources = (block.sources as { name: string; url: string }[]) || []
  if (!blockSources.length) return null
  const citeTitle = block.citeTitle || categoryName || 'Guide'
  const citeUrl = `/${categorySlug}`
  const cite = `CasePort. "${citeTitle}." CasePort, 2026.\n${SITE_URL}${citeUrl}`
  const [copied, setCopied] = useState(false)
  const copyCite = () => {
    if (navigator.clipboard) navigator.clipboard.writeText(cite).then(() => setCopied(true)).catch(() => setCopied(false))
  }
  return (
    <section className="section bg-white sources-sec">
      <div className="container-4">
        <div className="sources r">
          <div className="sources-head">
            <Icon name="file" />
            Sources &amp; Citations
          </div>
          <ul className="sources-list">
            {blockSources.map((s, i) => (
              <li key={i}>
                <a href={s.url} target="_blank" rel="nofollow noopener">
                  <Icon name="arrow" />
                  {s.name}
                </a>
              </li>
            ))}
          </ul>
          <div className="sources-cite">
            <span className="sources-cite-label">Cite this page</span>
            <code id="citeText">{cite}</code>
            <button className="sources-copy" id="citeCopy" onClick={copyCite}>
              <Icon name={copied ? 'check2' : 'file'} />
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

function ArticleTimelineStepsBlock({ block }: { block: CategoryBlock }) {
  const heading = block.heading || ''
  const steps = block.steps || []
  const note = block.note || ''
  if (!steps.length) return null
  return (
    <section className="section bg-white">
      <div className="container-4">
        {heading && <div className="section-head"><h2 className="section-h">{heading}</h2></div>}
        <div className="tl">
          {steps.map((st: any, i: number) => (
            <div className="tl-step r" key={i}>
              <div className="tl-num">{i + 1}</div>
              <div>
                <h3>{st.stepName}</h3>
                <p>{st.stepDescription}</p>
              </div>
            </div>
          ))}
        </div>
        {note && (
          <p className="note" style={{ marginTop: '1.5rem' }}>
            <Icon name="alertC" />
            <span>{note}</span>
          </p>
        )}
      </div>
    </section>
  )
}

function ArticleSettlementTableBlock({ block }: { block: CategoryBlock }) {
  const heading = block.heading || ''
  const rows = block.rows || []
  const footnote = block.footnote || ''
  if (!rows.length) return null
  return (
    <section className="section bg-white">
      <div className="container-4">
        {heading && <div className="section-head"><h2 className="section-h">{heading}</h2></div>}
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Severity</th>
                <th>What it looks like</th>
                <th>Illustrative range</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r: any, i: number) => (
                <tr key={i}>
                  <td className="strong">{r.severity}</td>
                  <td>{r.description}</td>
                  <td className="num">{r.range}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {footnote && <p className="sample-label" style={{ marginTop: '1rem' }}>{footnote}</p>}
      </div>
    </section>
  )
}

function ArticleProseContentBlock({ block }: { block: CategoryBlock }) {
  const sections = block.sections || []
  if (!sections.length) return null
  return (
    <section className="section bg-white">
      <div className="container-4">
        <div className="prose">
          {sections.map((s: any, i: number) => (
            <div key={i}>
              {s.heading && <h2>{s.heading}</h2>}
              {s.body && <p>{s.body}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ArticleStatuteBarsBlock({ block }: { block: CategoryBlock }) {
  const heading = block.heading || ''
  const bars = block.bars || []
  const footnote = block.footnote || ''
  if (!bars.length) return null
  return (
    <section className="section bg-white">
      <div className="container-4">
        {heading && <div className="section-head"><h2 className="section-h">{heading}</h2></div>}
        <div className="card" style={{ maxWidth: '42rem' }}>
          {bars.map((r: any, i: number) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '7rem 1fr', gap: '1rem', alignItems: 'center', marginBottom: '.75rem' }}>
              <div style={{ fontFamily: 'var(--code)', fontSize: '.8rem', fontWeight: 700, color: 'var(--ink)' }}>{r.deadline}</div>
              <div>
                <div className="cd-bar" style={{ height: 14 }}>
                  <div style={{ width: (r.widthPercent || 50) + '%', background: 'linear-gradient(90deg,#1a4a5a,#4a8c7e)' }}></div>
                </div>
                <div style={{ fontSize: '.74rem', color: 'var(--text-4)', marginTop: '.25rem' }}>{r.states}</div>
              </div>
            </div>
          ))}
          {footnote && <p className="sample-label" style={{ marginTop: '.5rem' }}>{footnote}</p>}
        </div>
      </div>
    </section>
  )
}

function ArticleExpertBlock({ block }: { block: CategoryBlock }) {
  const quote = block.quote || ''
  const reviewerName = block.reviewerName || ''
  const credentials = block.credentials || ''
  if (!quote) return null
  return (
    <section className="section bg-cream">
      <div className="container-4">
        <div className="expert-card r">
          <div className="expert-mark">
            <Icon name="shield" />
          </div>
          <div className="expert-body">
            {quote && <blockquote className="expert-quote">"{quote}"</blockquote>}
            {reviewerName && (
              <p className="expert-lead">
                Reviewed by <b>{reviewerName}</b>{credentials && `, ${credentials}`}.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function ArticleCTABlock({ block }: { block: CategoryBlock }) {
  const title = block.title || ''
  const subtitle = block.subtitle || ''
  const buttonLabel = block.buttonLabel || 'Get Free Case Review'
  const buttonLink = block.buttonLink || '/checkmycase'
  if (!title) return null
  return <CTABand title={title} sub={subtitle} btn={buttonLabel} href={buttonLink} />
}

function ArticleTakeHomeBlock() {
  return <TakeHome bg="bg-warm" />
}

// Master renderer
function CategoryBlockRenderer({ block, updatedAt, categorySlug, categoryName, isMedical, proseSectionsLen, articleUrl }: { block: CategoryBlock; updatedAt?: string; categorySlug?: string; categoryName?: string; isMedical?: boolean; proseSectionsLen?: number; articleUrl?: string }) {
  switch (block.blockType) {
    case 'categoryDirectAnswer': return <DirectAnswerBlock block={block} updatedAt={updatedAt} />
    case 'categoryQuickAnswerStats': return <QuickAnswerStatsBlock block={block} />
    case 'categoryKeyTakeaways': return <KeyTakeawaysBlock block={block} />
    case 'categoryProseSections': return <ProseSectionsBlock block={block} />
    case 'categoryFAQ': return <FAQBlock block={block} />
    case 'categoryStatuteDeadlines': return <StatuteDeadlinesBlock block={block} />
    case 'categoryWhyImportant': return <WhyImportantBlock block={block} />
    case 'categorySectionTOC': return <SectionTOC />
    case 'articleDirectAnswer': return <ArticleDirectAnswerBlock block={block} updatedAt={updatedAt} />
    case 'articleKeyTakeaways': return <ArticleKeyTakeawaysBlock block={block} />
    case 'articleFAQ': return <ArticleFAQBlock block={block} />
    case 'articleRelatedGuides': return <ArticleRelatedGuidesBlock block={block} categorySlug={categorySlug} />
    case 'articleSources': return <ArticleSourcesBlock block={block} categorySlug={categorySlug} categoryName={categoryName} />
    case 'articleTimelineSteps': return <ArticleTimelineStepsBlock block={block} />
    case 'articleSettlementTable': return <ArticleSettlementTableBlock block={block} />
    case 'articleProseContent': return <ArticleProseContentBlock block={block} />
    case 'articleStatuteBars': return <ArticleStatuteBarsBlock block={block} />
    case 'articleExpert': return <ArticleExpertBlock block={block} />
    case 'articleCTA': return <ArticleCTABlock block={block} />
    case 'articleTakeHome': return <ArticleTakeHomeBlock />
    case 'categoryRelatedGuides': {
      const articles = (block.articles as any[]) || []
      if (!articles.length) return null
      return (
        <section className="section bg-white">
          <div className="container-5">
            <div className="section-head">
              <h2 className="section-h">{categoryName} — The Key Questions</h2>
              <p className="section-sub">The four things people search for most after a {categoryName?.toLowerCase()}.</p>
            </div>
            <div className="grid grid-4">
              {articles.map((article) => (
                <Link key={article.id} href={`/guides/${article.guideCategory?.slug || categorySlug}/${article.slug}`} className="card link r">
                  <h3 style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{article.title}</h3>
                  {article.excerpt && (
                    <p style={{ fontSize: '.85rem', color: 'var(--muted)', marginTop: '.4rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{article.excerpt}</p>
                  )}
                  <span className="card-link" style={{ marginTop: '.8rem', fontSize: '.85rem' }}>Read</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )
    }
    case 'categoryTakeHome': return <TakeHome bg="bg-warm" />
    case 'categoryHowWeKeepAccurate': {
      const authorBlock = block.author as { name?: string; title?: string; creds?: string; avatar?: { url?: string } } | undefined
      const detail = block.detail || ''
      if (!authorBlock && !detail) return null
      return (
        <section className="section bg-cream" style={{ paddingTop: '3rem', paddingBottom: '3rem' }}>
          <div className="container-4">
            <div className="expert-card r">
              <div className="expert-mark">
                <Icon name={isMedical ? 'steth' : 'shield'} />
              </div>
              <div className="expert-body">
                <div className="expert-label">How we keep this accurate</div>
                {authorBlock?.name && (
                  <p className="expert-lead">
                    Reviewed by <b>{authorBlock.name}</b>
                    {authorBlock.title && `, ${authorBlock.title}`}
                    {authorBlock.creds && `. ${authorBlock.creds}`}.
                  </p>
                )}
                {detail && <p className="expert-note">{detail}</p>}
              </div>
            </div>
          </div>
        </section>
      )
    }
    case 'categoryExploreMore': {
      const selectedCategories = (block.categories as Category[]) || []
      if (!selectedCategories.length) return null
      return (
        <section className="section bg-cream">
          <div className="container-5">
            <div className="section-head">
              <h2 className="section-h">Explore More Guides</h2>
            </div>
            <div className="grid grid-4">
              {selectedCategories.map((cat) => (
                <Link key={cat.id} href={`/guides/${cat.slug}`} className="card link r">
                  <div className="card-ic">
                    <Icon name={(cat as any).icon || 'star'} />
                  </div>
                  <h3 style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{cat.heroTitle || cat.title}</h3>
                  <p style={{ fontSize: '.92rem', marginTop: '.4rem' }}>{(cat as any).short || ''}</p>
                  {cat.heroSubtitle && (
                    <p style={{ fontSize: '.85rem', color: 'var(--muted)', marginTop: '.25rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{cat.heroSubtitle}</p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )
    }
    case 'categorySources': {
      const blockSources = (block.sources as { name: string; url: string }[]) || []
      if (!blockSources.length) return null
      const citeTitle = block.citeTitle || categoryName || 'Guide'
      const citeUrl = articleUrl || `/${categorySlug}`
      const cite = `CasePort. "${citeTitle}." CasePort, 2026.\n${SITE_URL}${citeUrl}`
      const [copied, setCopied] = useState(false)
      const copyCite = () => {
        if (navigator.clipboard) navigator.clipboard.writeText(cite).then(() => setCopied(true)).catch(() => setCopied(false))
      }
      return (
        <section className="section bg-white sources-sec">
          <div className="container-4">
            <div className="sources r">
              <div className="sources-head">
                <Icon name="file" />
                Sources &amp; Citations
              </div>
              <ul className="sources-list">
                {blockSources.map((s, i) => (
                  <li key={i}>
                    <a href={s.url} target="_blank" rel="nofollow noopener">
                      <Icon name="arrow" />
                      {s.name}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="sources-cite">
                <span className="sources-cite-label">Cite this page</span>
                <code id="citeText">{cite}</code>
                <button className="sources-copy" id="citeCopy" onClick={copyCite}>
                  <Icon name={copied ? 'check2' : 'file'} />
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        </section>
      )
    }
    default: return null
  }
}

// ─── Main Component — fully dynamic ──────────────────────────────────────────

export function GuideCategoryClient({ category }: { category: Category }) {
  const slug = category.slug
  const blocks = category.blocks || []

  const name = category.title
  const heroTitle = category.heroTitle || category.title
  const subtitle = category.heroSubtitle || ''
  const isMedical = slug === 'medical-malpractice'
  const articleUrl = `/guides/${slug}`

  // Extract reading time from prose sections block if present
  const directAnswerBlock = blocks.find((b) => b.blockType === 'categoryDirectAnswer')
  const directAnswer = directAnswerBlock?.text || ''
  const proseBlock = blocks.find((b) => b.blockType === 'categoryProseSections')
  const proseSections = proseBlock?.sections || []
  const minutes = readingMinutes(directAnswer, proseSections.flatMap((s: any) => (s.paras || []).map((p: any) => (typeof p === 'string' ? p : p.text))))

  // Format updatedAt
  let updatedDate = 'June 2026'
  if (category.updatedAt) {
    const d = new Date(category.updatedAt)
    updatedDate = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  }

  // Collect FAQ questions from CMS blocks for JsonLd
  const faqs = blocks.filter((b) => b.blockType === 'categoryFAQ').flatMap((b) => (b.items || []).map((f: any) => ({ q: f.question, a: f.answer })))

  return (
    <>
      <HeroPhoto
        crumbs={<Breadcrumbs items={[{ label: 'Guide', href: '/guides' }, { label: category.title, href: `/guides/${slug}` }]} />}
        eyebrow="Accident Guide · National"
        title={heroTitle}
        sub={subtitle}
        scene=""
        img={category.heroImage?.url || ''}
        byline={<Byline reviewerName={reviewer.name} minutes={minutes} onDark updatedDate={updatedDate} />}
      />

      {/* All CMS blocks — rendered in the order they appear in Payload */}
      {blocks.map((b, i) => <CategoryBlockRenderer key={i} block={b} updatedAt={category.updatedAt} categorySlug={slug} categoryName={name} isMedical={isMedical} proseSectionsLen={proseSections.length} articleUrl={articleUrl} />)}

      <CTABand
        title={`Questions About Your ${name} Claim?`}
        sub="Get a free, confidential case review — no cost, no obligation."
        btn="Get Free Case Review"
      />

      <ArticleOverlays />

      <JsonLd
        data={[
          isMedical
            ? medicalWebPage({ headline: `${name} — The Complete Guide`, description: name })
            : article({ headline: `${name} — The Complete Guide`, description: name }),
          faqSchema(faqs),
          breadcrumb([
            { name: 'Home', url: '/' },
            { name: 'Guide', url: '/guides' },
            { name: category.title, url: `/guides/${slug}` },
          ]),
          speakable(articleUrl),
          ...orgGraph(),
        ]}
      />
    </>
  )
}
