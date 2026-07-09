import type { CollectionConfig } from 'payload'

import { ACCIDENTARTICLE_BLOCKS } from './AccidentArticleBlocks'

// ─── Block Data Extractors ─────────────────────────────────────────────────────

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

/** Extract all text from all blocks for read-time scoring */
const extractTextFromBlocks = (blocks: Block[]): string => {
  let text = ''
  for (const block of blocks) {
    if (block.blockType === 'richText' && block.content?.root?.children) {
      text += extractTextFromLexical(block.content.root.children) + ' '
    }
    if (block.blockType === 'standfirst' && block.text) {
      text += block.text + ' '
    }
    if (block.blockType === 'directAnswer' && block.text?.root?.children) {
      text += extractTextFromLexical(block.text.root.children) + ' '
    }
    if (block.blockType === 'accidentArticleDirectAnswer' && block.text) {
      text += typeof block.text === 'string' ? block.text : extractTextFromLexical(block.text?.root?.children || []) + ' '
    }
    if (block.blockType === 'accidentArticleKeyTakeaways' && Array.isArray(block.items)) {
      for (const i of block.items) text += (typeof i === 'string' ? i : i.fact || '') + ' '
    }
    if (block.blockType === 'accidentArticleFAQ' && Array.isArray(block.items)) {
      for (const i of block.items) text += (i.question || '') + ' ' + (i.answerText || i.answer || '') + ' '
    }
    if (block.blockType === 'accidentArticleSources' && Array.isArray(block.sources)) {
      for (const s of block.sources) text += (s.name || '') + ' '
    }
    if (block.blockType === 'accidentArticleTimelineSteps' && Array.isArray(block.steps)) {
      for (const s of block.steps) text += (s.stepName || '') + ' ' + (s.stepDescription || '') + ' '
    }
    if (block.blockType === 'accidentArticleSettlementTable' && Array.isArray(block.rows)) {
      for (const r of block.rows) text += (r.severity || '') + ' ' + (r.description || '') + ' ' + (r.range || '') + ' '
    }
    if (block.blockType === 'accidentArticleProseContent' && Array.isArray(block.sections)) {
      for (const s of block.sections) text += (s.heading || '') + ' ' + (s.body || '') + ' '
    }
    if (block.blockType === 'accidentArticleStatuteBars' && Array.isArray(block.bars)) {
      for (const b of block.bars) text += (b.deadline || '') + ' ' + (b.states || '') + ' '
    }
    if (block.blockType === 'accidentArticleExpert') {
      if (block.quote) text += block.quote + ' '
      if (block.reviewerName) text += block.reviewerName + ' '
      if (block.credentials) text += block.credentials + ' '
    }
    if (block.blockType === 'accidentArticleCTA') {
      if (block.title) text += block.title + ' '
      if (block.subtitle) text += block.subtitle + ' '
    }
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

/** Count headings from all richText blocks + articleProseContent sections */
const countHeadingsFromBlocks = (blocks: Block[]): { h2: number; h3: number } => {
  let h2 = 0, h3 = 0
  for (const block of blocks) {
    if (block.blockType === 'richText' && block.content?.root?.children) {
      h2 += countHeadings(block.content.root.children, 'h2')
      h3 += countHeadings(block.content.root.children, 'h3')
    }
    if (block.blockType === 'accidentArticleProseContent' && Array.isArray(block.sections)) {
      for (const s of block.sections) {
        if (s.heading) h2++
      }
    }
  }
  return { h2, h3 }
}

/** Extract FAQ items from blocks */
const getFaqsFromBlocks = (blocks: Block[]): any[] => {
  const faqs: any[] = []
  for (const block of blocks) {
    if (block.blockType === 'accidentArticleFAQ' && Array.isArray(block.items)) {
      for (const item of block.items) {
        faqs.push({ question: item.question, answer: item.answerText || item.answer })
      }
    }
  }
  return faqs
}

// ─── Score Generators ──────────────────────────────────────────────────────────

const calculateReadTime = async ({ data }: { data: any }): Promise<number> => {
  const blocks = getBlocks(data)
  const text = extractTextFromBlocks(blocks)
  const words = text.split(/\s+/).filter(Boolean).length
  return Math.ceil(words / 200) || 1
}

const generateAeoScore = async ({ data }: { data: any }): Promise<number> => {
  let score = 0
  const blocks = getBlocks(data)

  const faqs = getFaqsFromBlocks(blocks)
  const validFaqs = faqs.filter((f: any) => f.question && f.answer && (f.answer.length || '') >= 40).length
  if (validFaqs >= 4) score += 30
  else if (validFaqs >= 2) score += 15
  else if (validFaqs === 1) score += 5

  const voiceAnswer = data.voiceAnswer || ''
  const words = voiceAnswer.split(' ').filter(Boolean).length
  if (voiceAnswer.length >= 10 && words < 35) score += 20

  const metaTitle = data.metaTitle || ''
  const metaDesc = data.metaDescription || ''
  if (metaTitle.length > 0 && metaDesc.length > 0) score += 10

  const blocks2 = getBlocks(data)
  const { h2, h3 } = countHeadingsFromBlocks(blocks2)
  if (h2 >= 3) score += 10
  if (h3 >= 6) score += 10
  if (data.schemaType) score += 10

  return Math.min(score, 100)
}

const generateSeoScore = async (d: any): Promise<number> => {
  let score = 0
  const blocks = getBlocks(d)

  const keyword = (d.focusKeyword ?? '').toLowerCase().trim()
  const title = (d.title ?? '').toLowerCase()
  const metaTitle = d.metaTitle ?? ''
  const metaDesc = d.metaDescription ?? ''
  const slug = (d.slug ?? '').toLowerCase()

  const bodyText = extractTextFromBlocks(blocks).toLowerCase().slice(0, 300)

  const mt = metaTitle.trim().length
  if (mt >= 50 && mt <= 60) score += 15
  else if (mt >= 45 && mt <= 65) score += 7

  const md = metaDesc.trim().length
  if (md >= 140 && md <= 160) score += 15
  else if (md >= 120 && md <= 170) score += 7

  if (keyword && title.includes(keyword)) score += 15
  if (keyword && bodyText.includes(keyword)) score += 10
  if (keyword && slug.includes(keyword.replace(/\s+/g, '-'))) score += 10

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

// ─── Collection Config ─────────────────────────────────────────────────────────

export const AccidentArticles: CollectionConfig = {
  slug: 'accidentArticles',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'publishedDate'],
  },
  versions: {
    drafts: true,
  },
  hooks: {
    afterRead: [
      ({ doc }) => {
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

        if (!data.title?.trim()) issues.push('Title is required')
        else if (data.title.length < 10)
          issues.push(`Title too short (${data.title.length}/10 chars)`)
        if (!data.slug?.trim()) issues.push('Slug is required')
        if (!data.author) issues.push('Author is required')
        if (!data.accidentCategory) issues.push('Accident Category is required')

        if (!data.excerpt?.trim()) issues.push('Excerpt is required')
        else if (data.excerpt.length < 30)
          issues.push(`Excerpt too short (${data.excerpt.length}/30 chars)`)

        const bodyText = extractTextFromBlocks(getBlocks(data))
        if (bodyText.length < 50) issues.push('Article content is required')

        if (issues.length > 0) {
          throw new Error(issues.join(' | '))
        }

        return data
      },
    ],
    beforeChange: [
      // Sanitize richText blocks before saving
      ({ data }) => {
        const fixRichText = (content: any): any => {
          if (!content || typeof content !== 'object') {
            return { root: { children: [], type: 'root', format: 0, indent: 0, version: 1 } }
          }
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
          data.estimatedCompletionTime = `${data.readTime} min read`
          data.nextReviewDue = await calculateNextReviewDue({ data })
        } catch (err) {
          console.error('Score calculation error:', err)
        }

        return data
      },
      async ({ data }) => {
        if (data._isSeeding) return data
        try {
          const blocks = getBlocks(data)
          data.seoScore = await generateSeoScore(data)
        } catch (err) {
          console.error('SEO score calculation error:', err)
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc }) => {
        try {
          const { revalidatePath } = await import('next/cache')
          revalidatePath('/accidents')
          if (doc.slug) {
            revalidatePath(`/accidents/${doc.slug}`)
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
              name: 'accidentCategory',
              type: 'relationship',
              relationTo: 'accidentCategories',
              label: 'Accident Category',
            },
            // ─── Media & Summary ─────────────────────────────────────────
            { name: 'heroImage', type: 'upload', relationTo: 'media' },
            { name: 'excerpt', type: 'textarea', maxLength: 300 },
            { name: 'subtitle', type: 'text' },
            {
              name: 'breadcrumbTitle',
              type: 'text',
              admin: { description: 'Short breadcrumb label shown in hero. Defaults to article title if empty.' },
            },
            // ─── Article Blocks ──────────────────────────────────────────
            {
              name: 'blocks',
              type: 'blocks',
              blocks: ACCIDENTARTICLE_BLOCKS,
              admin: {
                description: 'Add and reorder blocks to structure your article content.',
              },
            },
            // ─── Difficulty & Time ─────────────────────────────────────
            {
              name: 'difficultyLevel',
              type: 'select',
              options: [
                { label: 'Beginner', value: 'beginner' },
                { label: 'Intermediate', value: 'intermediate' },
                { label: 'Advanced', value: 'advanced' },
              ],
              admin: { description: 'Reader self-selection' },
            },
            {
              name: 'estimatedCompletionTime',
              type: 'text',
              admin: { description: 'Auto-calculated from content length', readOnly: true },
            },
            // ─── Tags ───────────────────────────────────────────────────
            { name: 'tags', type: 'array', fields: [{ name: 'tag', type: 'text' }] },
          ],
        },
        // ─── SEO Core ───────────────────────────────────────────────────
        {
          label: 'SEO Core',
          fields: [
            { name: 'focusKeyword', type: 'text' },
            { name: 'metaTitle', type: 'text' },
            { name: 'metaDescription', type: 'textarea' },
            { name: 'canonicalUrl', type: 'text' },
          ],
        },
        // ─── Voice Search ───────────────────────────────────────────────
        {
          label: 'Voice Search',
          fields: [
            { name: 'voiceAnswer', type: 'textarea' },
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
          ],
        },
      ],
    },

    // ─── Sidebar Fields ─────────────────────────────────────────────────
    { name: 'publishedDate', type: 'date', admin: { position: 'sidebar' } },
    { name: 'aeoScore', type: 'number', admin: { position: 'sidebar', readOnly: true } },
    { name: 'seoScore', type: 'number', admin: { position: 'sidebar', readOnly: true } },
    { name: 'readTime', type: 'number', admin: { position: 'sidebar', readOnly: true } },
    {
      name: 'reviewCycle',
      type: 'select',
      admin: { position: 'sidebar' },
      options: [
        { label: '3 Months', value: '3months' },
        { label: '6 Months', value: '6months' },
        { label: '12 Months', value: '12months' },
        { label: 'Evergreen', value: 'evergreen' },
      ],
    },
    { name: 'nextReviewDue', type: 'date', admin: { position: 'sidebar', readOnly: true } },
    { name: 'hideFromSearchEngines', type: 'checkbox', admin: { position: 'sidebar' } },
  ],
}
