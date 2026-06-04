import type { CollectionConfig, FieldHook } from 'payload'

import { GUIDE_BLOCKS } from './GuideBlocks'
import { B2C_BLOCKS } from './TestGuideBlocks'

// ─── Block Data Extractors ─────────────────────────────────────────────────

type Block = { blockType: string; [key: string]: any }

const getBlocks = (data: any): Block[] => data?.blocks || []

/** Extract plain text from Lexical richText nodes */
const extractTextFromLexical = (nodes: any[]): string => {
  if (!Array.isArray(nodes)) return ''
  let text = ''
  for (const node of nodes) {
    if (node.type === 'text' && node.text) text += node.text + ' '
    else if (node.children) text += extractTextFromLexical(node.children) + ' '
  }
  return text
}

/** Count heading tags in a Lexical node tree */
const countHeadings = (nodes: any[], tag: string): number => {
  let count = 0
  for (const node of nodes) {
    if (node.type === 'heading' && node.tag === tag) count++
    if (node.children) count += countHeadings(node.children, tag)
  }
  return count
}

/** Extract all text from all blocks for read-time / keyword scoring */
const extractTextFromBlocks = (blocks: Block[]): string => {
  let text = ''
  for (const block of blocks) {
    if (block.blockType === 'richText' && block.content?.root?.children) {
      text += extractTextFromLexical(block.content.root.children) + ' '
    }
    if (block.blockType === 'standfirst' && block.text) {
      text += block.text + ' '
    }
    if (block.blockType === 'directAnswer' && block.text) {
      text += block.text + ' '
    }
    if (block.blockType === 'stepChecklist' && block.steps) {
      for (const s of block.steps) {
        if (s.name) text += s.name + ' '
        if (s.bullets) {
          for (const b of s.bullets) text += (typeof b === 'string' ? b : b.bullet || '') + ' '
        }
      }
    }
    if (block.blockType === 'protectionPlan' && block.steps) {
      for (const s of block.steps) text += (typeof s === 'string' ? s : s.step || s.text || '') + ' '
    }
    if (block.blockType === 'attorneyComparison' && block.rows) {
      for (const r of block.rows) {
        text += (r.factor || '') + ' ' + (r.withAttorney || '') + ' ' + (r.withoutAttorney || '') + ' '
      }
    }
    if (block.blockType === 'settlementExample' && block.examples) {
      for (const e of block.examples) {
        text += (e.settlement || '') + ' ' + (e.quote || '') + ' '
      }
    }
    if (block.blockType === 'statuteLimitations') {
      if (block.description) text += block.description + ' '
      if (block.states) {
        for (const s of block.states) text += (s.state || '') + ' ' + (s.notes || '') + ' '
      }
    }
    if (block.blockType === 'expertQuote' && block.quote) text += block.quote + ' '
    if (block.blockType === 'termDefinition') {
      text += (block.term || '') + ' ' + (block.definition || '') + ' '
    }
    if (block.blockType === 'faqAccordion' && block.faqs) {
      for (const f of block.faqs) text += (f.question || '') + ' ' + (f.answer || '') + ' '
    }
    if (block.blockType === 'peopleAlsoAsk' && block.items) {
      for (const i of block.items) text += (i.q || i.question || '') + ' ' + (i.a || i.answer || '') + ' '
    }
    if (block.blockType === 'medicalDocumentation') {
      if (block.introText) text += block.introText + ' '
      if (block.calloutText) text += block.calloutText + ' '
    }
    if (block.blockType === 'immediateActions' && block.steps) {
      for (const s of block.steps) {
        text += (s.title || '') + ' ' + (s.description || '') + ' '
      }
    }
    if (block.blockType === 'cta') {
      if (block.heading) text += block.heading + ' '
      if (block.subcopy) text += block.subcopy + ' '
    }
  }
  return text
}

/** Extract directAnswer block text */
const getDirectAnswerFromBlocks = (blocks: Block[]): string => {
  const b = blocks.find(b => b.blockType === 'directAnswer')
  return b?.text || ''
}

/** Extract FAQ items from blocks */
const getFaqsFromBlocks = (blocks: Block[]): any[] => {
  const faqs: any[] = []
  for (const block of blocks) {
    if (block.blockType === 'faqAccordion' && Array.isArray(block.faqs)) {
      faqs.push(...block.faqs)
    }
  }
  return faqs
}

/** Extract citation fact sources from blocks */
const getStatsFromBlocks = (blocks: Block[]): any[] => {
  const stats: any[] = []
  for (const block of blocks) {
    if (block.blockType === 'citationFact' && Array.isArray(block.facts)) {
      stats.push(...block.facts)
    }
  }
  return stats
}

/** Extract expert quotes from blocks */
const getQuotesFromBlocks = (blocks: Block[]): any[] => {
  const quotes: any[] = []
  for (const block of blocks) {
    if (block.blockType === 'expertQuote' && block.quote) {
      quotes.push(block)
    }
  }
  return quotes
}

/** Extract term definitions from blocks */
const getTermsFromBlocks = (blocks: Block[]): any[] => {
  const terms: any[] = []
  for (const block of blocks) {
    if (block.blockType === 'termDefinition' && block.term) {
      terms.push(block)
    }
  }
  return terms
}

/** Extract related guides from blocks */
const getRelatedGuidesFromBlocks = (blocks: Block[]): any[] => {
  const guides: any[] = []
  for (const block of blocks) {
    if (block.blockType === 'relatedGuides' && Array.isArray(block.guides)) {
      guides.push(...block.guides)
    }
  }
  return guides
}

/** Extract entity sameAs URLs from blocks */
const getSameAsUrlsFromBlocks = (blocks: Block[]): any[] => {
  const urls: any[] = []
  for (const block of blocks) {
    if (block.blockType === 'entityContext' && Array.isArray(block.entities)) {
      for (const e of block.entities) {
        if (e.sameAs) urls.push({ url: e.sameAs })
      }
    }
  }
  return urls
}

/** Extract external sources from citationFact blocks */
const getExternalSourcesFromBlocks = (blocks: Block[]): any[] => {
  const sources: any[] = []
  for (const block of blocks) {
    if (block.blockType === 'citationFact' && Array.isArray(block.facts)) {
      for (const f of block.facts) {
        if (f.source) sources.push({ name: f.source, url: f.sourceUrl || '' })
      }
    }
  }
  return sources
}

/** Count headings from all richText blocks */
const countHeadingsFromBlocks = (blocks: Block[]): { h2: number; h3: number } => {
  let h2 = 0, h3 = 0
  for (const block of blocks) {
    if (block.blockType === 'richText' && block.content?.root?.children) {
      h2 += countHeadings(block.content.root.children, 'h2')
      h3 += countHeadings(block.content.root.children, 'h3')
    }
  }
  return { h2, h3 }
}

// ─── Score Generators ────────────────────────────────────────────────────────

const generateAeoScore = async ({ data }: { data: any }): Promise<number> => {
  let score = 0
  const blocks = getBlocks(data)

  const directAnswer = getDirectAnswerFromBlocks(blocks)
  if (directAnswer.length >= 40) {
    score += directAnswer.toLowerCase().includes('caseport') ? 25 : 12
  }

  const aiSummary = data.aiCitationSummary || ''
  if (aiSummary.length >= 80) score += 15

  const faqs = getFaqsFromBlocks(blocks)
  const validFaqs = faqs.filter((f: any) => f.question && f.answer && (f.answer.length || '') >= 40).length
  if (validFaqs >= 4) score += 20
  else if (validFaqs >= 2) score += 10
  else if (validFaqs === 1) score += 5

  const stats = getStatsFromBlocks(blocks)
  const validStats = stats.filter((s: any) => s.fact && s.source).length
  if (validStats >= 3) score += 15
  else if (validStats === 2) score += 10
  else if (validStats === 1) score += 5

  const voiceAnswer = data.voiceAnswer || ''
  const words = voiceAnswer.split(' ').filter(Boolean).length
  if (voiceAnswer.length >= 10 && words < 35) score += 10

  const terms = getTermsFromBlocks(blocks)
  if (terms.length >= 2) score += 5

  const metaTitle = data.metaTitle || ''
  const metaDesc = data.metaDescription || ''
  if (metaTitle.length > 0 && metaDesc.length > 0) score += 5

  const quotes = getQuotesFromBlocks(blocks)
  if (quotes.length >= 1) score += 5

  return score
}

const calculateReadTime = async ({ data }: { data: any }): Promise<number> => {
  const blocks = getBlocks(data)
  const text = extractTextFromBlocks(blocks)
  const words = text.split(/\s+/).filter(Boolean).length
  return Math.ceil(words / 200) || 1
}

const generateSeoScore = async (d: any, heroImageAlt = ''): Promise<number> => {
  let score = 0
  const blocks = getBlocks(d)

  const keyword = (d.focusKeyword ?? '').toLowerCase().trim()
  const title = (d.title ?? '').toLowerCase()
  const metaTitle = d.metaTitle ?? ''
  const metaDesc = d.metaDescription ?? ''
  const slug = (d.slug ?? '').toLowerCase()

  const bodyText = extractTextFromBlocks(blocks).toLowerCase().slice(0, 300)
  const altText = heroImageAlt ?? (typeof d.heroImage === 'object' ? (d.heroImage?.alt ?? '') : '')
  const related = getRelatedGuidesFromBlocks(blocks)
  const secondary = d.secondaryKeywords ?? []

  const mt = metaTitle.trim().length
  if (mt >= 50 && mt <= 60) score += 15
  else if (mt >= 45 && mt <= 65) score += 7

  const md = metaDesc.trim().length
  if (md >= 140 && md <= 160) score += 15
  else if (md >= 120 && md <= 170) score += 7

  if (keyword && title.includes(keyword)) score += 15
  if (keyword && bodyText.includes(keyword)) score += 10
  if (keyword && slug.includes(keyword.replace(/\s+/g, '-'))) score += 10
  if (altText.trim().length > 10) score += 10
  if (related.length >= 3) score += 10
  else if (related.length >= 1) score += 5
  if (secondary.length >= 4) score += 10
  else if (secondary.length >= 2) score += 5

  const fullBody = extractTextFromBlocks(blocks).toLowerCase()
  if (keyword && fullBody.includes(keyword)) score += 5

  return Math.min(score, 100)
}

const calculateNextReviewDue = async ({ data }: { data: any }): Promise<string | null> => {
  if (!data?.publishedDate || !data?.reviewCycle) return null
  const pubDate = new Date(data.publishedDate)
  if (isNaN(pubDate.getTime())) return null

  if (data.reviewCycle === '3months') pubDate.setMonth(pubDate.getMonth() + 3)
  else if (data.reviewCycle === '6months') pubDate.setMonth(pubDate.getMonth() + 6)
  else if (data.reviewCycle === '12months') pubDate.setMonth(pubDate.getMonth() + 12)
  else if (data.reviewCycle === 'evergreen') return null

  return pubDate.toISOString()
}

const calculateGeoScore = (data: any): number => {
  let score = 0
  if (data.geoOptimization?.targetStates?.length > 0) score += 30
  if (data.geoOptimization?.targetCities?.length > 0) score += 20
  if (data.geoOptimization?.stateSpecificDeadline) score += 20
  if (data.geoOptimization?.tollingProvisions?.length > 0) score += 30
  return Math.min(score, 100)
}

const calculateSgeScore = (data: any): number => {
  let score = 0
  if (data.sgeOptimization?.sgeOptimizedAnswer?.length > 40) score += 40
  if (data.sgeOptimization?.uniqueContentSignals?.length > 0) score += 30
  if (data.sgeOptimization?.freshnessSignal) score += 20
  if (data.sgeOptimization?.competitorComparison) score += 10
  return Math.min(score, 100)
}

const calculateVoiceScore = (data: any): number => {
  let score = 0
  if (data.voiceAnswer?.length > 30) score += 40
  if (data.speakableCssSelectors?.length > 0) score += 30
  if (data.conversationalQueryVariants?.length > 0) score += 30
  return Math.min(score, 100)
}

const calculateContentQualityScore = (data: any, h2Count: number, h3Count: number): number => {
  const blocks = getBlocks(data)
  let score = 0
  if (h2Count >= 3) score += 10
  if (h3Count >= 6) score += 10
  const directAnswer = getDirectAnswerFromBlocks(blocks)
  if (directAnswer.length > 40) score += 10
  const faqs = getFaqsFromBlocks(blocks)
  if (faqs.length >= 5) score += 10
  if (data.sgeOptimization?.sgeOptimizedAnswer?.length > 40) score += 10
  if (data.sgeOptimization?.uniqueContentSignals?.length > 0) score += 5
  if (data.geoOptimization?.targetStates?.length > 0) score += 8
  if (data.geoOptimization?.stateSpecificDeadline) score += 7
  if (data.voiceAnswer?.length > 30) score += 10
  if (data.speakableCssSelectors?.length > 0) score += 5
  if (data.expertReviewer) score += 8
  const sources = getExternalSourcesFromBlocks(blocks)
  if (sources.length > 0) score += 7
  return Math.min(score, 100)
}

const calculateSnippetScore = (data: any): number => {
  let score = 0
  if (data.featuredSnippetOptimization?.snippetContent?.length > 40) score += 50
  if (data.featuredSnippetOptimization?.targetSnippetType) score += 30
  if (
    data.featuredSnippetOptimization?.currentSnippetRank &&
    data.featuredSnippetOptimization.currentSnippetRank <= 3
  )
    score += 20
  return Math.min(score, 100)
}

const calculateFreshness = (data: any): { daysOld: number; freshnessStatus: string; nextReviewDue: Date } => {
  const lastReviewRaw = data.contentFreshness?.lastReviewDate || data.updatedAt
  const lastReview = new Date(lastReviewRaw)
  const today = new Date()

  if (isNaN(lastReview.getTime())) {
    return { daysOld: 0, freshnessStatus: 'fresh', nextReviewDue: new Date() }
  }

  const daysOld = Math.floor((today.getTime() - lastReview.getTime()) / (1000 * 60 * 60 * 24))

  let freshnessStatus = 'fresh'
  if (daysOld > 180) freshnessStatus = 'stale'
  else if (daysOld > 90) freshnessStatus = 'aging'
  else if (daysOld > 30) freshnessStatus = 'current'

  const nextReviewDue = new Date(lastReview.getTime() + 90 * 24 * 60 * 60 * 1000)

  return { daysOld, freshnessStatus, nextReviewDue }
}

// ─── Collection Config ─────────────────────────────────────────────────────────

export const GuideArticles: CollectionConfig = {
  slug: 'guideArticles',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'publishedDate', 'aeoScore', 'seoScore'],
  },
  versions: {
    drafts: true,
  },
  hooks: {
    afterRead: [
      ({ doc }) => {
        if (doc.slug) {
          doc._previewUrl = `/api/preview?slug=${doc.slug}&collection=guideArticles`
        }

        // Sanitize blocks — fix any richText blocks with undefined content
        const emptyLexical = {
          root: {
            children: [{ type: 'paragraph', children: [{ type: 'text', text: '' }] }],
          },
        }

        const fixTextNodes = (nodes: any[]): void => {
          if (!Array.isArray(nodes)) return
          for (const node of nodes) {
            if (node.type === 'text') {
              if (node.format === undefined) node.format = 0
              if (node.detail === undefined) node.detail = 0
              if (node.mode === undefined) node.mode = 'normal'
              if (node.style === undefined) node.style = ''
              if (node.version === undefined) node.version = 1
            }
            if (node.children) fixTextNodes(node.children)
          }
        }

        const blocks: Block[] = doc.blocks || []
        for (const block of blocks) {
          if (block.blockType === 'richText') {
            if (!block.content || typeof block.content !== 'object') {
              block.content = emptyLexical
            } else if (!block.content.root || !Array.isArray(block.content.root.children)) {
              block.content = emptyLexical
            } else {
              // Fix missing format/detail on text nodes
              fixTextNodes(block.content.root.children)
            }
          }
        }

        return doc
      },
    ],
    beforeValidate: [
      ({ data }) => {
        if (!data?.slug && data?.title) {
          data.slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '')
        }
        return data
      },
      async ({ data }) => {
        if (!data || data._isSeeding) return
        if (data._status !== 'published') return data

        const issues: string[] = []
        const blocks = getBlocks(data)

        if (!data.title?.trim()) issues.push('Title is required')
        else if (data.title.length < 10)
          issues.push(`Title too short (${data.title.length}/10 chars)`)
        if (!data.slug?.trim()) issues.push('Slug is required')
        if (!data.author) issues.push('Author is required')
        if (!data.guideCategory) issues.push('Guide Category is required')
        if (!data.heroImage) issues.push('Hero Image is required')
        if (!data.excerpt?.trim()) issues.push('Excerpt is required')
        else if (data.excerpt.length < 30)
          issues.push(`Excerpt too short (${data.excerpt.length}/30 chars)`)
        if (!data.focusKeyword?.trim()) issues.push('Focus Keyword is required')
        if (!data.metaTitle?.trim()) issues.push('Meta Title is required')
        else if (data.metaTitle.length > 60)
          issues.push(`Meta Title too long (${data.metaTitle.length}/60 chars)`)
        if (!data.metaDescription?.trim()) issues.push('Meta Description is required')
        else if (data.metaDescription.length < 120)
          issues.push(`Meta Description too short (${data.metaDescription.length}/120 chars)`)
        if (!data.schemaType) issues.push('Schema Type is required')
        if (!data.pageType) issues.push('Page Type is required')

        // Validate fields still at top level
        const keyTakeaways = data.keyTakeaways || []
        if (keyTakeaways.length < 3)
          issues.push(`Key Takeaways: ${keyTakeaways.length}/3 — add ${3 - keyTakeaways.length} more`)
        const relatedGuides = data.relatedGuides || []
        if (relatedGuides.length < 2)
          issues.push(`Related Guides: ${relatedGuides.length}/2 — add ${2 - relatedGuides.length} more`)
        const secondaryKeywords = data.secondaryKeywords || []
        if (secondaryKeywords.length < 2)
          issues.push(`Secondary Keywords: ${secondaryKeywords.length}/2 — add ${2 - secondaryKeywords.length} more`)

        // Validate block-based fields
        const directAnswer = getDirectAnswerFromBlocks(blocks)
        if (!directAnswer.trim()) issues.push('Direct Answer block is required')
        else if (directAnswer.length < 40)
          issues.push(`Direct Answer: ${directAnswer.length}/40 chars`)

        const faqs = getFaqsFromBlocks(blocks)
        if (faqs.length < 4)
          issues.push(`FAQ items: ${faqs.length}/4 — add ${4 - faqs.length} more`)

        const stats = getStatsFromBlocks(blocks)
        if (stats.length < 2)
          issues.push(`Key Statistics (Citation Fact blocks): ${stats.length}/2 — add ${2 - stats.length} more`)

        const sameAsUrls = getSameAsUrlsFromBlocks(blocks)
        if (sameAsUrls.length < 1) issues.push('At least 1 Same-As URL is required (add an Entity Context block)')

        const extSources = getExternalSourcesFromBlocks(blocks)
        if (extSources.length < 1) issues.push('At least 1 External Source is required (add Citation Fact blocks)')

        // Content length from blocks
        const bodyText = extractTextFromBlocks(blocks)
        if (bodyText.length < 50) issues.push('Article content is required')
        else if (bodyText.length < 1500)
          issues.push(`Content too short (${bodyText.length}/1500 chars)`)

        const { h2, h3 } = countHeadingsFromBlocks(blocks)
        if (h2 < 3) issues.push(`H2 Headings: ${h2}/3 — add ${3 - h2} more (use Heading in RichText blocks)`)
        if (h3 < 4) issues.push(`H3 Headings: ${h3}/4 — add ${4 - h3} more`)

        const sgeAnswer = data.sgeOptimizedAnswer || ''
        if (!sgeAnswer.trim()) issues.push('SGE Optimized Answer is required')
        else if (sgeAnswer.length < 40) issues.push(`SGE Answer: ${sgeAnswer.length}/40 chars`)

        if (issues.length > 0) {
          throw new Error(issues.join(' | '))
        }

        return data
      },
    ],
    beforeChange: [
      // Sanitize richText blocks before saving — fix undefined content and missing fields
      ({ data }) => {
        const fixRichText = (content: any): any => {
          if (!content || typeof content !== 'object') {
            return { root: { children: [], type: 'root', format: 0, indent: 0, version: 1 } }
          }
          // Fix root node
          if (!content.root) content.root = { children: [], type: 'root', format: 0, indent: 0, version: 1 }
          else {
            if (content.root.type === undefined) content.root.type = 'root'
            if (content.root.format === undefined) content.root.format = 0
            if (content.root.indent === undefined) content.root.indent = 0
            if (content.root.version === undefined) content.root.version = 1
            if (content.root.direction === undefined) content.root.direction = null
          }

          const fixNodes = (nodes: any[]): void => {
            if (!Array.isArray(nodes)) return
            for (const node of nodes) {
              if (node.type === 'text') {
                if (node.format === undefined) node.format = 0
                if (node.detail === undefined) node.detail = 0
                if (node.mode === undefined) node.mode = 'normal'
                if (node.style === undefined) node.style = ''
                if (node.version === undefined) node.version = 1
              } else if (node.type === 'paragraph' || node.type === 'heading') {
                if (node.version === undefined) node.version = 1
                if (node.format === undefined) node.format = 0
                if (node.direction === undefined) node.direction = null
                if (node.indent === undefined) node.indent = 0
                if (node.type === 'heading' && node.tag === undefined) node.tag = 'h2'
              }
              if (node.children) fixNodes(node.children)
            }
          }

          if (content.root.children) fixNodes(content.root.children)
          return content
        }

        const blocks: Block[] = data?.blocks || []
        for (const block of blocks) {
          if (block.blockType === 'richText') {
            block.content = fixRichText(block.content)
          }
        }
        return data
      },
      async ({ data, operation }) => {
        if (data._isSeeding) return data

        if (operation === 'update' && data._status === 'published' && !data.publishedDate) {
          data.publishedDate = new Date().toISOString()
        }

        try {
          const blocks = getBlocks(data)
          data.aeoScore = await generateAeoScore({ data })
          data.readTime = await calculateReadTime({ data })
          data.nextReviewDue = await calculateNextReviewDue({ data })
        } catch (err) {
          console.error('Score calculation error:', err)
        }

        return data
      },
      async ({ data, req }) => {
        if (data._isSeeding) return data
        try {
          const blocks = getBlocks(data)
          const { h2, h3 } = countHeadingsFromBlocks(blocks)
          const bodyText = extractTextFromBlocks(blocks)

          let heroImageAlt = ''
          if (typeof data.heroImage === 'object' && data.heroImage?.alt) {
            heroImageAlt = data.heroImage.alt
          } else if (typeof data.heroImage === 'string') {
            try {
              const mediaDoc = await req.payload.findByID({
                collection: 'media',
                id: data.heroImage,
              })
              heroImageAlt = mediaDoc?.alt ?? ''
            } catch {
              heroImageAlt = ''
            }
          }

          const geoScore = calculateGeoScore(data)
          const sgeScore = calculateSgeScore(data)
          const voiceScore = calculateVoiceScore(data)
          const seoScore = await generateSeoScore(data, heroImageAlt)
          const aeoScore = data.aeoScore || 0

          const overallScore = Math.round(
            seoScore * 0.25 +
              aeoScore * 0.25 +
              geoScore * 0.25 +
              sgeScore * 0.15 +
              voiceScore * 0.1,
          )

          let dominanceRank = 'critical'
          if (overallScore >= 80) dominanceRank = 'dominant'
          else if (overallScore >= 60) dominanceRank = 'strong'
          else if (overallScore >= 40) dominanceRank = 'weak'

          let competitiveAdvantageScore = 0
          if (data.competitorAnalysis?.uniqueAdvantages?.length > 0) {
            competitiveAdvantageScore = Math.min(
              50 + data.competitorAnalysis.uniqueAdvantages.length * 10,
              100,
            )
          }

          data.dominanceScoring = {
            seoScore,
            aeoScore,
            geoScore,
            sgeScore,
            voiceSearchScore: voiceScore,
            overallDominanceScore: overallScore,
            dominanceRank,
            competitiveAdvantageScore,
          }

          data.seoScore = seoScore

          data.contentQualityScore = calculateContentQualityScore(data, h2, h3)

          const faqs = getFaqsFromBlocks(blocks)
          data.contentValidation = {
            contentLength: bodyText.length,
            h2Count: h2,
            h3Count: h3,
            faqCount: faqs.length,
            validationStatus:
              data.contentQualityScore >= 80
                ? 'pass'
                : data.contentQualityScore >= 60
                  ? 'warning'
                  : 'fail',
            validationErrors: [],
          }

          const freshness = calculateFreshness(data)
          data.contentFreshness = {
            ...(data.contentFreshness || {}),
            daysOld: freshness.daysOld,
            freshnessStatus: freshness.freshnessStatus,
            nextReviewDue: freshness.nextReviewDue,
          }

          const snippetScore = calculateSnippetScore(data)
          data.featuredSnippetOptimization = {
            ...(data.featuredSnippetOptimization || {}),
            snippetOptimizationScore: snippetScore,
          }

          // Auto-generate internal links within guideArticles
          if (data.id && data.guideCategory) {
            const relatedGuides = await req.payload.find({
              collection: 'guideArticles',
              where: {
                and: [
                  { id: { not_equals: data.id } },
                  { guideCategory: { equals: data.guideCategory } },
                ],
              },
              limit: 10,
            })

            data.internalLinks = relatedGuides.docs.map((article: any) => ({
              linkedArticleId: article.id,
              anchorText: article.title,
              relevanceScore: 75,
            }))
          }
        } catch (err) {
          console.error('Hook 2 score calc error:', err)
        }

        return data
      },
    ],
    afterChange: [
      async ({ doc }) => {
        try {
          const { revalidatePath } = await import('next/cache')
          revalidatePath('/guide')
          if (doc.slug) {
            revalidatePath(`/guide/${doc.slug}`)
          }
          if (doc.pageType === 'state' && doc.targetStates?.length) {
            for (const state of doc.targetStates) {
              revalidatePath(`/guide/states/${state}`)
            }
          }
          if (doc.pageType === 'city' && doc.targetCities?.length) {
            for (const city of doc.targetCities) {
              revalidatePath(`/guide/cities/${city}`)
            }
          }
          if (doc.pageType === 'faq') {
            revalidatePath(`/guide/faq/${doc.slug}`)
          }
        } catch {
          // If we are not in a Next.js server context, quietly ignore
        }
      },
    ],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // ─── Content ─────────────────────────────────────────────────────
        {
          label: 'Content',
          fields: [
            // ─── Basic Info ───────────────────────────────────────────────
            { name: 'title', type: 'text', admin: { description: '50-80 chars. Auto slug.' } },
            { name: 'slug', type: 'text', index: true },
            { name: 'author', type: 'relationship', relationTo: 'authors' },
            {
              name: 'guideCategory',
              type: 'relationship',
              relationTo: 'guideCategories',
              label: 'Guide Category',
              admin: { description: 'Primary category for this guide' },
            },
            {
              name: 'pageType',
              type: 'select',
              options: ['guide', 'category', 'state', 'city', 'faq'],
              defaultValue: 'guide',
              admin: { description: 'Determines which template renders this page' },
            },
            // ─── Media & Summary ─────────────────────────────────────────
            { name: 'heroImage', type: 'upload', relationTo: 'media' },
            { name: 'excerpt', type: 'textarea', maxLength: 300 },
            { name: 'subtitle', type: 'text' },
            { name: 'executiveSummary', type: 'textarea' },
            // ─── Guide Blocks ──────────────────────────────────────────
            {
              name: 'blocks',
              type: 'blocks',
              blocks: [
                ...GUIDE_BLOCKS,
                ...B2C_BLOCKS,
              ],
              admin: {
                description: 'Add and reorder blocks to structure your article content.',
              },
            },
            // ─── AEO & Direct Answer ─────────────────────────────────────
            // directAnswer, aiCitationSummary, primaryAiQuery — now in DirectAnswer + Standfirst blocks
            // ─── FAQ Section ─────────────────────────────────────────────
            // faqSection — now in FAQAccordion block
            // ─── Key Statistics ──────────────────────────────────────────
            // keyStatistics — now in CitationFact block
            // ─── Expert Info ─────────────────────────────────────────────
            // expertQuotes — now in ExpertQuote block
            // ─── Term Definitions ─────────────────────────────────────────
            // termDefinitions — now in TermDefinition block
            // ─── Related Articles ─────────────────────────────────────────
            // relatedArticles (relationship) — now in RelatedArticleLink block
            // ─── Duplicates removed → use Blocks instead ──────────────────────────────────
            // REMOVED (use blocks instead):
            // - whatYouLearn → KeyTakeaways block
            // - immediateStepsTitle/Subtitle + immediateSteps → StepChecklist block
            // - attorneyComparison → Comparison block
            // - settlementData group → SettlementRange + CaseScenario blocks
            // - stateRanges → SettlementRanges block
            // - statuteOfLimitations group → StatuteLimitations block
            // - testimonials → CaseScenario block
            // - keyFacts → StatCallout block
            // - fiveThingsToKnow → ProtectionPlan block
            // - mistakesToAvoid → ProtectionPlan block
            // - decisionMatrix → (new DecisionMatrix block planned)
            // - mathComparison group → Comparison block
            // - ctaHeading + ctaBody → CTA block
            // ─── Core Fields (kept) ─────────────────────────────────────────────
            // ─── Difficulty & Time ─────────────────────────────────────
            {
              name: 'difficultyLevel',
              type: 'select',
              options: [{ label: 'Beginner', value: 'beginner' }, { label: 'Intermediate', value: 'intermediate' }, { label: 'Advanced', value: 'advanced' }],
              admin: { description: 'Reader self-selection' },
            },
            {
              name: 'estimatedCompletionTime',
              type: 'text',
              admin: { description: 'e.g., "5 min read"' },
            },
            // ─── Relationships ──────────────────────────────────────────
            // relatedArticles (relationship) — now in RelatedArticleLink block
            // relatedGuides (relationship) — now in RelatedGuides block
            // ─── Tags ───────────────────────────────────────────────────
            // NOTE: tags field has no block equivalent yet — kept as-is
            { name: 'tags', type: 'array', fields: [{ name: 'tag', type: 'text' }] },
          ],
        },
        // ─── SEO Core ───────────────────────────────────────────────────
        {
          label: 'SEO Core',
          fields: [
            { name: 'focusKeyword', type: 'text' },
            { name: 'keywordDifficulty', type: 'number', min: 0, max: 100 },
            { name: 'monthlySearchVolume', type: 'number' },
            { name: 'currentRankingPosition', type: 'number' },
            { name: 'secondaryKeywords', type: 'array', fields: [{ name: 'keyword', type: 'text' }] },
            { name: 'metaTitle', type: 'text', maxLength: 60 },
            { name: 'metaDescription', type: 'textarea', maxLength: 160 },
            { name: 'canonicalUrl', type: 'text' },
            { name: 'socialHeadline', type: 'text' },
            { name: 'socialDescription', type: 'textarea' },
            { name: 'socialShareImage', type: 'upload', relationTo: 'media' },
            { name: 'xCardType', type: 'select', options: ['summary_large_image', 'summary'] },
            { name: 'xCardTitle', type: 'text' },
            { name: 'xCardDescription', type: 'textarea' },
            { name: 'xCardImage', type: 'upload', relationTo: 'media' },
            { name: 'competingUrl', type: 'text' },
            { name: 'contentGap', type: 'array', fields: [{ name: 'gap', type: 'text' }] },
          ],
        },
        // ─── AEO and AI Citation (remaining fields - most moved to Content) ───
        {
          label: 'AEO and AI Citation',
          fields: [
            // Note: directAnswer, keyStatistics, faqSection, expertQuotes, termDefinitions,
            // primaryAiQuery, aiCitationSummary moved to Content tab for better UX
            // Remaining fields here are supplemental AI/voice optimization fields
          ],
        },
        // ─── Voice Search ───────────────────────────────────────────────
        {
          label: 'Voice Search',
          fields: [
            { name: 'voiceAnswer', type: 'textarea' },
            { name: 'speakableCssSelectors', type: 'array', fields: [{ name: 'selector', type: 'text' }] },
            { name: 'conversationalQueryVariants', type: 'array', fields: [{ name: 'query', type: 'text' }] },
            { name: 'targetsSpecificLocation', type: 'checkbox' },
            {
              name: 'locationTargets',
              type: 'array',
              admin: { condition: (data) => data.targetsSpecificLocation },
              fields: [
                { name: 'state', type: 'text' },
                { name: 'city', type: 'text' },
              ],
            },
          ],
        },
        // ─── Schema ─────────────────────────────────────────────────────
        {
          label: 'Schema',
          fields: [
            {
              name: 'schemaType',
              type: 'select',
              options: ['Article', 'FAQPage', 'HowTo', 'NewsArticle', 'LegalScholarlyArticle', 'GuidePage'],
            },
            {
              name: 'howToSteps',
              type: 'array',
              admin: { condition: (data) => data.schemaType === 'HowTo' },
              fields: [
                { name: 'name', type: 'text' },
                { name: 'description', type: 'textarea' },
                { name: 'image', type: 'upload', relationTo: 'media' },
              ],
            },
            { name: 'sameAsEntityUrls', type: 'array', fields: [{ name: 'url', type: 'text' }] },
            { name: 'articleSection', type: 'text' },
            { name: 'apaCitation', type: 'text' },
          ],
        },
        // ─── Authority & Compliance ────────────────────────────────────
        {
          label: 'Authority & Compliance',
          fields: [
            {
              name: 'legalDisclaimer',
              type: 'select',
              options: ['Standard', 'No Legal Advice', 'CasePort Platform', 'None'],
              defaultValue: 'Standard',
            },
            { name: 'abaComplianceVerified', type: 'checkbox' },
            { name: 'expertReviewer', type: 'text' },
            { name: 'expertCredentials', type: 'text' },
            { name: 'expertQuote', type: 'textarea' },
            {
              name: 'externalSources',
              type: 'array',
              fields: [
                { name: 'name', type: 'text' },
                { name: 'url', type: 'text' },
                { name: 'credibilityTier', type: 'select', options: ['High', 'Medium', 'Low'] },
              ],
            },
            {
              name: 'pressMentions',
              type: 'array',
              fields: [
                { name: 'source', type: 'text' },
                { name: 'url', type: 'text' },
                { name: 'date', type: 'date' },
              ],
            },
            {
              name: 'ctaOverride',
              type: 'group',
              fields: [
                { name: 'heading', type: 'text' },
                { name: 'body', type: 'textarea' },
                { name: 'primaryLabel', type: 'text' },
                { name: 'primaryUrl', type: 'text' },
                { name: 'secondaryLabel', type: 'text' },
                { name: 'secondaryUrl', type: 'text' },
              ],
            },
            {
              name: 'contentUpdateHistory',
              type: 'array',
              fields: [
                { name: 'date', type: 'date' },
                { name: 'summary', type: 'text' },
                { name: 'updatedBy', type: 'text' },
              ],
            },
          ],
        },
        // ─── GEO Optimization ───────────────────────────────────────────
        {
          label: 'GEO Optimization',
          fields: [
            {
              name: 'targetStates',
              type: 'select',
              hasMany: true,
              options: [
                { label: 'Alabama', value: 'AL' }, { label: 'Alaska', value: 'AK' },
                { label: 'Arizona', value: 'AZ' }, { label: 'Arkansas', value: 'AR' },
                { label: 'California', value: 'CA' }, { label: 'Colorado', value: 'CO' },
                { label: 'Connecticut', value: 'CT' }, { label: 'Delaware', value: 'DE' },
                { label: 'Florida', value: 'FL' }, { label: 'Georgia', value: 'GA' },
                { label: 'Hawaii', value: 'HI' }, { label: 'Idaho', value: 'ID' },
                { label: 'Illinois', value: 'IL' }, { label: 'Indiana', value: 'IN' },
                { label: 'Iowa', value: 'IA' }, { label: 'Kansas', value: 'KS' },
                { label: 'Kentucky', value: 'KY' }, { label: 'Louisiana', value: 'LA' },
                { label: 'Maine', value: 'ME' }, { label: 'Maryland', value: 'MD' },
                { label: 'Massachusetts', value: 'MA' }, { label: 'Michigan', value: 'MI' },
                { label: 'Minnesota', value: 'MN' }, { label: 'Mississippi', value: 'MS' },
                { label: 'Missouri', value: 'MO' }, { label: 'Montana', value: 'MT' },
                { label: 'Nebraska', value: 'NE' }, { label: 'Nevada', value: 'NV' },
                { label: 'New Hampshire', value: 'NH' }, { label: 'New Jersey', value: 'NJ' },
                { label: 'New Mexico', value: 'NM' }, { label: 'New York', value: 'NY' },
                { label: 'North Carolina', value: 'NC' }, { label: 'North Dakota', value: 'ND' },
                { label: 'Ohio', value: 'OH' }, { label: 'Oklahoma', value: 'OK' },
                { label: 'Oregon', value: 'OR' }, { label: 'Pennsylvania', value: 'PA' },
                { label: 'Rhode Island', value: 'RI' }, { label: 'South Carolina', value: 'SC' },
                { label: 'South Dakota', value: 'SD' }, { label: 'Tennessee', value: 'TN' },
                { label: 'Texas', value: 'TX' }, { label: 'Utah', value: 'UT' },
                { label: 'Vermont', value: 'VT' }, { label: 'Virginia', value: 'VA' },
                { label: 'Washington', value: 'WA' }, { label: 'West Virginia', value: 'WV' },
                { label: 'Wisconsin', value: 'WI' }, { label: 'Wyoming', value: 'WY' },
              ],
              label: 'Target States',
            },
            {
              name: 'targetCities',
              type: 'select',
              hasMany: true,
              label: 'Target Cities',
              options: [
                { label: 'Houston, TX', value: 'Houston, TX' }, { label: 'Dallas, TX', value: 'Dallas, TX' },
                { label: 'Austin, TX', value: 'Austin, TX' }, { label: 'San Antonio, TX', value: 'San Antonio, TX' },
                { label: 'Fort Worth, TX', value: 'Fort Worth, TX' }, { label: 'El Paso, TX', value: 'El Paso, TX' },
                { label: 'Arlington, TX', value: 'Arlington, TX' }, { label: 'Corpus Christi, TX', value: 'Corpus Christi, TX' },
                { label: 'Miami, FL', value: 'Miami, FL' }, { label: 'Tampa, FL', value: 'Tampa, FL' },
                { label: 'Orlando, FL', value: 'Orlando, FL' }, { label: 'Jacksonville, FL', value: 'Jacksonville, FL' },
                { label: 'Fort Lauderdale, FL', value: 'Fort Lauderdale, FL' }, { label: 'St. Petersburg, FL', value: 'St. Petersburg, FL' },
                { label: 'Tallahassee, FL', value: 'Tallahassee, FL' }, { label: 'Los Angeles, CA', value: 'Los Angeles, CA' },
                { label: 'San Diego, CA', value: 'San Diego, CA' }, { label: 'San Francisco, CA', value: 'San Francisco, CA' },
                { label: 'Riverside, CA', value: 'Riverside, CA' }, { label: 'Sacramento, CA', value: 'Sacramento, CA' },
                { label: 'San Jose, CA', value: 'San Jose, CA' }, { label: 'Fresno, CA', value: 'Fresno, CA' },
                { label: 'Long Beach, CA', value: 'Long Beach, CA' }, { label: 'New York, NY', value: 'New York, NY' },
                { label: 'Brooklyn, NY', value: 'Brooklyn, NY' }, { label: 'Queens, NY', value: 'Queens, NY' },
                { label: 'Bronx, NY', value: 'Bronx, NY' }, { label: 'Albany, NY', value: 'Albany, NY' },
                { label: 'Rochester, NY', value: 'Rochester, NY' }, { label: 'Syracuse, NY', value: 'Syracuse, NY' },
                { label: 'Buffalo, NY', value: 'Buffalo, NY' }, { label: 'Chicago, IL', value: 'Chicago, IL' },
                { label: 'Springfield, IL', value: 'Springfield, IL' }, { label: 'Rockford, IL', value: 'Rockford, IL' },
                { label: 'Philadelphia, PA', value: 'Philadelphia, PA' }, { label: 'Pittsburgh, PA', value: 'Pittsburgh, PA' },
                { label: 'Allentown, PA', value: 'Allentown, PA' }, { label: 'Harrisburg, PA', value: 'Harrisburg, PA' },
                { label: 'Scranton, PA', value: 'Scranton, PA' }, { label: 'Reading, PA', value: 'Reading, PA' },
                { label: 'Columbus, OH', value: 'Columbus, OH' }, { label: 'Cleveland, OH', value: 'Cleveland, OH' },
                { label: 'Cincinnati, OH', value: 'Cincinnati, OH' }, { label: 'Dayton, OH', value: 'Dayton, OH' },
                { label: 'Toledo, OH', value: 'Toledo, OH' }, { label: 'Akron, OH', value: 'Akron, OH' },
                { label: 'Atlanta, GA', value: 'Atlanta, GA' }, { label: 'Augusta, GA', value: 'Augusta, GA' },
                { label: 'Savannah, GA', value: 'Savannah, GA' }, { label: 'Macon, GA', value: 'Macon, GA' },
                { label: 'Columbus, GA', value: 'Columbus, GA' },
              ],
            },
            { name: 'jurisdiction', type: 'text', label: 'Primary Jurisdiction' },
            { name: 'serviceAreaDescription', type: 'textarea', label: 'Service Area Description' },
            {
              name: 'localSchemaType',
              type: 'select',
              options: [{ label: 'LocalBusiness', value: 'LocalBusiness' }, { label: 'Attorney', value: 'Attorney' }, { label: 'ServiceArea', value: 'ServiceArea' }],
              label: 'Local Schema Type',
            },
            { name: 'stateSpecificDeadline', type: 'number', label: 'Statute of Limitations (years)' },
            { name: 'stateSpecificExceptions', type: 'textarea', label: 'State-Specific Exceptions' },
            {
              name: 'tollingProvisions',
              type: 'array',
              label: 'Tolling Provisions',
              fields: [
                { name: 'state', type: 'text' },
                { name: 'tollingRule', type: 'textarea' },
              ],
            },
          ],
        },
        // ─── SGE Optimization ────────────────────────────────────────────
        {
          label: 'SGE Optimization',
          fields: [
            { name: 'sgeAnswerability', type: 'number', label: 'SGE Answerability Score (0-100)', admin: { readOnly: true } },
            { name: 'sgeOptimizedAnswer', type: 'textarea', label: 'SGE Optimized Answer (40-60 words)' },
            {
              name: 'uniqueContentSignals',
              type: 'array',
              label: 'Unique Content Signals',
              fields: [
                { name: 'signal', type: 'text' },
                { name: 'description', type: 'textarea' },
              ],
            },
            {
              name: 'freshnessSignal',
              type: 'select',
              options: [{ label: 'Breaking News', value: 'breaking' }, { label: 'Recent Update', value: 'recent' }, { label: 'Evergreen', value: 'evergreen' }],
              label: 'Freshness Signal',
            },
            { name: 'competitorComparison', type: 'textarea', label: 'How is this better than competitors?' },
          ],
        },
        // ─── Dominance Scoring ───────────────────────────────────────────
        {
          label: 'Dominance Scoring',
          fields: [
            {
              name: 'dominanceScoring',
              type: 'group',
              admin: { readOnly: true },
              fields: [
                { name: 'seoScore', type: 'number', admin: { readOnly: true } },
                { name: 'aeoScore', type: 'number', admin: { readOnly: true } },
                { name: 'geoScore', type: 'number', admin: { readOnly: true } },
                { name: 'sgeScore', type: 'number', admin: { readOnly: true } },
                { name: 'voiceSearchScore', type: 'number', admin: { readOnly: true } },
                { name: 'overallDominanceScore', type: 'number', admin: { readOnly: true } },
                {
                  name: 'dominanceRank',
                  type: 'select',
                  options: [{ label: 'Critical', value: 'critical' }, { label: 'Weak', value: 'weak' }, { label: 'Strong', value: 'strong' }, { label: 'Dominant', value: 'dominant' }],
                  admin: { readOnly: true },
                },
                { name: 'competitiveAdvantageScore', type: 'number', admin: { readOnly: true } },
              ],
            },
          ],
        },
        // ─── Competitor Analysis ────────────────────────────────────────
        {
          label: 'Competitor Analysis',
          fields: [
            {
              name: 'topCompetitors',
              type: 'array',
              label: 'Top 3 Competitors',
              fields: [
                { name: 'url', type: 'text' },
                { name: 'estimatedScore', type: 'number' },
                { name: 'yourAdvantage', type: 'textarea' },
              ],
            },
            { name: 'competitiveGapAnalysis', type: 'textarea' },
            { name: 'uniqueAdvantages', type: 'array', fields: [{ name: 'advantage', type: 'text' }] },
          ],
        },
        // ─── Performance Metrics ────────────────────────────────────────
        {
          label: 'Performance Metrics',
          fields: [
            {
              name: 'performanceMetrics',
              type: 'group',
              admin: { readOnly: true },
              fields: [
                { name: 'totalFormSubmissions', type: 'number' },
                { name: 'totalEmailCaptures', type: 'number' },
                { name: 'averageLeadQualityScore', type: 'number' },
                { name: 'leadToCaseConversionRate', type: 'number' },
                { name: 'estimatedRevenue', type: 'number' },
                { name: 'estimatedProfit', type: 'number' },
                { name: 'roi', type: 'number' },
                {
                  name: 'performanceStatus',
                  type: 'select',
                  options: [{ label: 'Loss', value: 'loss' }, { label: 'Breakeven', value: 'breakeven' }, { label: 'Profitable', value: 'profitable' }, { label: 'Highly Profitable', value: 'highly_profitable' }],
                  admin: { readOnly: true },
                },
                {
                  name: 'recommendedAction',
                  type: 'select',
                  options: [{ label: 'Remove', value: 'remove' }, { label: 'Optimize', value: 'optimize' }, { label: 'Maintain', value: 'maintain' }, { label: 'Expand', value: 'expand' }],
                  admin: { readOnly: true },
                },
              ],
            },
          ],
        },
        // ─── Search Engine Submission ───────────────────────────────────
        {
          label: 'Search Engine Submission',
          fields: [
            {
              name: 'searchEngineSubmission',
              type: 'group',
              admin: { readOnly: true },
              fields: [
                { name: 'googleSubmitted', type: 'checkbox' },
                { name: 'googleSubmissionTime', type: 'date' },
                { name: 'googleSubmissionMessage', type: 'textarea' },
                { name: 'bingSubmitted', type: 'checkbox' },
                { name: 'bingSubmissionTime', type: 'date' },
                { name: 'bingSubmissionMessage', type: 'textarea' },
              ],
            },
          ],
        },
        // ─── Entity Extraction ──────────────────────────────────────────
        {
          label: 'Entity Extraction',
          fields: [
            { name: 'primaryEntity', type: 'text' },
            { name: 'entityDefinition', type: 'textarea' },
            { name: 'relatedEntities', type: 'array', fields: [{ name: 'entity', type: 'text' }] },
            {
              name: 'entityImportance',
              type: 'select',
              options: [{ label: 'Critical', value: 'critical' }, { label: 'Important', value: 'important' }, { label: 'Supporting', value: 'supporting' }],
            },
          ],
        },
        // ─── Content Validation ─────────────────────────────────────────
        {
          label: 'Content Validation',
          fields: [
            {
              name: 'contentValidation',
              type: 'group',
              admin: { readOnly: true },
              fields: [
                { name: 'contentLength', type: 'number', admin: { readOnly: true } },
                { name: 'h2Count', type: 'number', admin: { readOnly: true } },
                { name: 'h3Count', type: 'number', admin: { readOnly: true } },
                { name: 'faqCount', type: 'number', admin: { readOnly: true } },
                {
                  name: 'validationStatus',
                  type: 'select',
                  options: [{ label: 'Pass', value: 'pass' }, { label: 'Warning', value: 'warning' }, { label: 'Fail', value: 'fail' }],
                  admin: { readOnly: true },
                },
                { name: 'validationErrors', type: 'array', admin: { readOnly: true }, fields: [{ name: 'error', type: 'text' }] },
              ],
            },
          ],
        },
        // ─── Internal Linking ───────────────────────────────────────────
        {
          label: 'Internal Linking',
          fields: [
            {
              name: 'internalLinks',
              type: 'array',
              admin: { readOnly: true },
              fields: [
                { name: 'linkedArticleId', type: 'relationship', relationTo: 'guideArticles' },
                { name: 'anchorText', type: 'text' },
                { name: 'relevanceScore', type: 'number' },
              ],
            },
          ],
        },
        // ─── Content Freshness ──────────────────────────────────────────
        {
          label: 'Content Freshness',
          fields: [
            {
              name: 'contentFreshness',
              type: 'group',
              fields: [
                { name: 'lastReviewDate', type: 'date' },
                { name: 'nextReviewDue', type: 'date', admin: { readOnly: true } },
                { name: 'daysOld', type: 'number', admin: { readOnly: true } },
                {
                  name: 'freshnessStatus',
                  type: 'select',
                  options: [{ label: 'Fresh (0-30 days)', value: 'fresh' }, { label: 'Current (31-90 days)', value: 'current' }, { label: 'Aging (91-180 days)', value: 'aging' }, { label: 'Stale (180+ days)', value: 'stale' }],
                  admin: { readOnly: true },
                },
              ],
            },
          ],
        },
        // ─── Featured Snippet Optimization ──────────────────────────────
        {
          label: 'Featured Snippet Optimization',
          fields: [
            {
              name: 'featuredSnippetOptimization',
              type: 'group',
              fields: [
                {
                  name: 'targetSnippetType',
                  type: 'select',
                  options: [{ label: 'Paragraph', value: 'paragraph' }, { label: 'List', value: 'list' }, { label: 'Table', value: 'table' }, { label: 'Definition', value: 'definition' }],
                },
                { name: 'snippetContent', type: 'textarea' },
                { name: 'currentSnippetRank', type: 'number' },
                { name: 'snippetOptimizationScore', type: 'number', admin: { readOnly: true } },
              ],
            },
          ],
        },
        // ─── Backlink Tracking ──────────────────────────────────────────
        {
          label: 'Backlink Tracking',
          fields: [
            {
              name: 'backlinkTracking',
              type: 'group',
              admin: { readOnly: true },
              fields: [
                { name: 'totalBacklinks', type: 'number' },
                { name: 'highQualityBacklinks', type: 'number' },
                { name: 'referringDomains', type: 'number' },
                { name: 'backlinkGrowth', type: 'number' },
                { name: 'backlinkLastUpdated', type: 'date' },
              ],
            },
          ],
        },
        // ─── Keyword Rankings ───────────────────────────────────────────
        {
          label: 'Keyword Rankings',
          fields: [
            {
              name: 'keywordRankings',
              type: 'array',
              admin: { readOnly: true },
              fields: [
                { name: 'keyword', type: 'text' },
                { name: 'currentRank', type: 'number' },
                { name: 'previousRank', type: 'number' },
                { name: 'rankChange', type: 'number' },
                { name: 'searchVolume', type: 'number' },
                { name: 'lastUpdated', type: 'date' },
              ],
            },
          ],
        },
        // ─── Traffic & Engagement ───────────────────────────────────────
        {
          label: 'Traffic & Engagement',
          fields: [
            {
              name: 'trafficMetrics',
              type: 'group',
              admin: { readOnly: true },
              fields: [
                { name: 'monthlyVisitors', type: 'number' },
                { name: 'bounceRate', type: 'number' },
                { name: 'averageTimeOnPage', type: 'number' },
                { name: 'scrollDepth', type: 'number' },
                {
                  name: 'trafficSources',
                  type: 'array',
                  fields: [
                    { name: 'source', type: 'text' },
                    { name: 'visitors', type: 'number' },
                    { name: 'percentage', type: 'number' },
                  ],
                },
              ],
            },
          ],
        },
        // ─── AI Citation Tracking ───────────────────────────────────────
        {
          label: 'AI Citation Tracking',
          fields: [
            {
              name: 'aiCitationTracking',
              type: 'group',
              admin: { readOnly: true },
              fields: [
                { name: 'claudeCitations', type: 'number' },
                { name: 'chatgptCitations', type: 'number' },
                { name: 'perplexityCitations', type: 'number' },
                { name: 'totalAiCitations', type: 'number', admin: { readOnly: true } },
                { name: 'shareOfVoice', type: 'number', admin: { readOnly: true } },
                { name: 'lastUpdated', type: 'date' },
              ],
            },
          ],
        },
        // ─── Conversion Funnel ───────────────────────────────────────────
        {
          label: 'Conversion Funnel',
          fields: [
            {
              name: 'conversionFunnel',
              type: 'group',
              admin: { readOnly: true },
              fields: [
                { name: 'uniqueVisitors', type: 'number' },
                { name: 'formViews', type: 'number' },
                { name: 'formSubmissions', type: 'number' },
                { name: 'emailCaptures', type: 'number' },
                { name: 'confirmedLeads', type: 'number' },
                { name: 'confirmedCases', type: 'number' },
                { name: 'visitorToFormRate', type: 'number', admin: { readOnly: true } },
                { name: 'formToLeadRate', type: 'number', admin: { readOnly: true } },
                { name: 'leadToCaseRate', type: 'number', admin: { readOnly: true } },
              ],
            },
          ],
        },
      ],
    },

    // ─── Sidebar Fields ─────────────────────────────────────────────────
    {
      name: 'previewButton',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: '@/components/admin/GuidePreviewButton',
        },
      },
    },
    { name: 'publishedDate', type: 'date', admin: { position: 'sidebar' } },
    { name: 'updatedAt', type: 'date', admin: { position: 'sidebar', readOnly: true } },
    { name: 'aeoScore', type: 'number', admin: { position: 'sidebar', readOnly: true } },
    { name: 'seoScore', type: 'number', admin: { position: 'sidebar', readOnly: true, description: 'Auto-calculated on every save. 0-100.' } },
    { name: 'readTime', type: 'number', admin: { position: 'sidebar', readOnly: true } },
    {
      name: 'searchIntent',
      type: 'select',
      admin: { position: 'sidebar' },
      options: ['Informational', 'Commercial Investigation', 'Transactional', 'Navigational'],
    },
    { name: 'targetSerpFeature', type: 'text', admin: { position: 'sidebar' } },
    {
      name: 'contentConfidence',
      type: 'select',
      admin: { position: 'sidebar' },
      options: ['High', 'Medium', 'Low'],
    },
    { name: 'hideFromSearchEngines', type: 'checkbox', admin: { position: 'sidebar' } },
    {
      name: 'reviewCycle',
      type: 'select',
      admin: { position: 'sidebar' },
      options: [{ label: '3 Months', value: '3months' }, { label: '6 Months', value: '6months' }, { label: '12 Months', value: '12months' }, { label: 'Evergreen', value: 'evergreen' }],
    },
    { name: 'nextReviewDue', type: 'date', admin: { position: 'sidebar', readOnly: true } },
    { name: 'lastFactVerified', type: 'date', admin: { position: 'sidebar' } },
    { name: 'contentQualityScore', type: 'number', admin: { position: 'sidebar', readOnly: true } },
  ],
}