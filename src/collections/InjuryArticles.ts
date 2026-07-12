import type { CollectionConfig, FieldHook } from 'payload'
import { INJURYARTICLE_BLOCKS } from './InjuryArticleBlocks'

// ─── AEO/SEO Score Helpers ────────────────────────────────────────────────────

const extractTextFromBlocks = (blocks: any[]): string => {
  if (!blocks || !Array.isArray(blocks)) return ''
  let text = ''
  for (const block of blocks) {
    if (!block) continue
    if (block.blockType === 'injuryArticleKeyTakeaways' && Array.isArray(block.items)) {
      for (const item of block.items) text += (item.item || '') + ' '
    }
    if (block.blockType === 'injuryArticleFAQ' && Array.isArray(block.items)) {
      for (const item of block.items) text += (item.question || '') + ' ' + (item.answerText || '') + ' '
    }
    if (block.blockType === 'injuryArticleProseSections' && Array.isArray(block.sections)) {
      for (const s of block.sections) text += (s.title || '') + ' ' + (s.content || '') + ' '
    }
    if (block.blockType === 'injuryArticleSymptoms') {
      if (Array.isArray(block.immediate)) block.immediate.forEach((i: any) => text += (i.item || '') + ' ')
      if (Array.isArray(block.delayed)) block.delayed.forEach((i: any) => text += (i.item || '') + ' ')
      if (Array.isArray(block.emergency)) block.emergency.forEach((i: any) => text += (i.item || '') + ' ')
    }
    if (block.blockType === 'injuryArticleTreatment' && Array.isArray(block.steps)) {
      block.steps.forEach((s: any) => text += (s.name || '') + ' ' + (s.desc || '') + ' ')
    }
    if (block.blockType === 'injuryArticleRecovery' && Array.isArray(block.phases)) {
      block.phases.forEach((p: any) => text += (p.phase || '') + ' ' + (p.time || '') + ' ' + (p.desc || '') + ' ')
    }
    if (block.blockType === 'injuryArticleSettlement' && Array.isArray(block.factors)) {
      block.factors.forEach((f: any) => text += (f.factor || '') + ' ' + (f.desc || '') + ' ')
    }
  }
  return text
}

const calculateAeoScore: FieldHook = async ({ data }) => {
  const blocks: any[] = data?.blocks || []
  let score = 0

  const faqBlock = blocks.find((b: any) => b.blockType === 'injuryArticleFAQ')
  if (faqBlock?.items) {
    const validFaqs = faqBlock.items.filter(
      (f: any) => f.question && f.answerText && f.answerText.length >= 40,
    )
    if (validFaqs.length >= 5) score += 20
    else if (validFaqs.length >= 3) score += 15
    else if (validFaqs.length >= 1) score += 8
  }

  const ktBlock = blocks.find((b: any) => b.blockType === 'injuryArticleKeyTakeaways')
  if (ktBlock?.items?.length >= 4) score += 10
  else if (ktBlock?.items?.length >= 2) score += 5

  const expBlock = blocks.find((b: any) => b.blockType === 'injuryArticleExpert')
  if (expBlock?.author) score += 10

  const srcBlock = blocks.find((b: any) => b.blockType === 'injuryArticleSources')
  if (srcBlock?.sources?.length >= 2) score += 5

  // Spoke-specific blocks add AEO value
  const spokeBlocks = ['injuryArticleSymptoms', 'injuryArticleTreatment', 'injuryArticleRecovery', 'injuryArticleSettlement']
  if (spokeBlocks.some(s => blocks.find((b: any) => b.blockType === s))) {
    score += 20
  }

  return Math.min(score, 100)
}

const calculateReadTime: FieldHook = async ({ data }) => {
  const blocks: any[] = data?.blocks || []
  const text = extractTextFromBlocks(blocks)
  const words = text.split(/\s+/).filter(Boolean).length
  return Math.ceil(words / 200) || 1
}

const calculateNextReviewDue: FieldHook = async () => {
  const d = new Date()
  d.setDate(d.getDate() + 90)
  return d.toISOString()
}

const calculateSeoScore: FieldHook = async ({ data }) => {
  let score = 0
  const metaTitle = data?.metaTitle || ''
  const metaDesc = data?.metaDescription || ''
  const focusKw = (data?.focusKeyword || '').toLowerCase().trim()
  const title = (data?.title || '').toLowerCase()

  const mtLen = metaTitle.trim().length
  if (mtLen >= 50 && mtLen <= 60) score += 20
  else if (mtLen >= 40 && mtLen <= 70) score += 10

  const mdLen = metaDesc.trim().length
  if (mdLen >= 140 && mdLen <= 160) score += 20
  else if (mdLen >= 120 && mdLen <= 170) score += 10

  if (focusKw && title.includes(focusKw)) score += 20
  else if (focusKw && title.includes(focusKw.replace(/-/g, ' '))) score += 10

  if (focusKw && metaTitle.toLowerCase().includes(focusKw)) score += 15
  if (focusKw && metaDesc.toLowerCase().includes(focusKw)) score += 10

  return Math.min(score, 100)
}

// ─── Collection Config ────────────────────────────────────────────────────────

export const InjuryArticles: CollectionConfig = {
  slug: 'injuryArticles',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'injuryType', 'spokeType'],
    listSearchableFields: ['title', 'slug'],
  },
  versions: {
    drafts: true,
  },
  access: {
    read: () => true,
  },
  fields: [
    // ─── Identity ───────────────────────────────────────────────────────────
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: { description: 'Article title, e.g. "Whiplash Symptoms"' },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'URL slug, e.g. "whiplash-symptoms"' },
    },

    // ─── Spoke Identity ───────────────────────────────────────────────────
    {
      name: 'injuryType',
      type: 'relationship',
      relationTo: 'injuryTypes',
      required: true,
      admin: {
        description: 'The parent injury type this article belongs to.',
      },
    },
    {
      name: 'spokeType',
      type: 'select',
      required: true,
      options: [
        { label: 'Symptoms', value: 'symptoms' },
        { label: 'Treatment', value: 'treatment' },
        { label: 'Recovery Timeline', value: 'recovery-timeline' },
        { label: 'Settlement Factors', value: 'settlement-factors' },
      ],
    },

    // ─── CMS Blocks ─────────────────────────────────────────────────────────
    {
      name: 'blocks',
      type: 'blocks',
      blocks: INJURYARTICLE_BLOCKS,
    },

    // ─── SEO ───────────────────────────────────────────────────────────────
    { name: 'focusKeyword', type: 'text' },
    { name: 'metaTitle', type: 'text', maxLength: 80 },
    { name: 'metaDescription', type: 'textarea', maxLength: 160 },
    { name: 'publishedDate', type: 'date' },

    // ─── Auto-Calculated (readOnly) ─────────────────────────────────────────
    {
      name: 'aeoScore',
      type: 'number',
      admin: { readOnly: true, description: 'Auto-calculated 0–100 AEO score.' },
    },
    {
      name: 'seoScore',
      type: 'number',
      admin: { readOnly: true, description: 'Auto-calculated 0–100 SEO score.' },
    },
    {
      name: 'readTime',
      type: 'number',
      admin: { readOnly: true, description: 'Auto-calculated read time in minutes.' },
    },
    {
      name: 'nextReviewDue',
      type: 'date',
      admin: { readOnly: true, description: 'Auto-set to 90 days from last save.' },
    },

    // ─── Sidebar ───────────────────────────────────────────────────────────
    {
      name: 'previewButton',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: '@/components/admin/InjuryArticlePreviewButton',
        },
      },
    },
  ],

  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        if (data._isSeeding) return data

        if (operation === 'update' && data._status === 'published' && !data.publishedDate) {
          data.publishedDate = new Date().toISOString()
        }

        try {
          data.aeoScore = await calculateAeoScore({ data } as any)
          data.seoScore = await calculateSeoScore({ data } as any)
          data.readTime = await calculateReadTime({ data } as any)
          data.nextReviewDue = await calculateNextReviewDue({ data } as any)
        } catch (err) {
          console.error('[InjuryArticles] Score calculation error:', err)
        }

        return data
      },
    ],
    afterChange: [
      async ({ doc }) => {
        try {
          const { revalidatePath } = await import('next/cache')
          // Revalidate the spoke page
          if (doc.injuryType) {
            const parent = typeof doc.injuryType === 'object' ? doc.injuryType : null
            if (parent?.slug) {
              revalidatePath(`/injuries/${parent.slug}/${doc.spokeType}`)
            }
          }
        } catch {
          // Not in Next.js context
        }
      },
    ],
  },
}
