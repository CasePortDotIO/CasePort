import type { CollectionConfig, FieldHook } from 'payload'
import { INJURYTYPE_BLOCKS } from './InjuryTypeBlocks'

// ─── AEO/SEO Score Helpers ────────────────────────────────────────────────────

const extractTextFromBlocks = (blocks: any[]): string => {
  if (!blocks || !Array.isArray(blocks)) return ''
  let text = ''
  for (const block of blocks) {
    if (!block) continue
    if (block.blockType === 'injuryTypeDirectAnswer') {
      text += (block.lead || '') + ' '
    }
    if (block.blockType === 'injuryTypeKeyTakeaways' && Array.isArray(block.items)) {
      for (const item of block.items) text += (item.item || '') + ' '
    }
    if (block.blockType === 'injuryTypeFAQ' && Array.isArray(block.items)) {
      for (const item of block.items) text += (item.question || '') + ' ' + (item.answerText || '') + ' '
    }
    if (block.blockType === 'injuryTypeProseSections' && Array.isArray(block.sections)) {
      for (const s of block.sections) text += (s.title || '') + ' ' + (s.content || '') + ' '
    }
  }
  return text
}

const calculateAeoScore: FieldHook = async ({ data }) => {
  const blocks: any[] = data?.blocks || []
  let score = 0

  const daBlock = blocks.find((b: any) => b.blockType === 'injuryTypeDirectAnswer')
  if (daBlock?.lead) {
    const len = daBlock.lead.length
    if (len >= 100) score += 30
    else if (len >= 60) score += 20
    else if (len >= 30) score += 10
    if (daBlock.lead.toLowerCase().includes('caseport')) score += 5
  }

  const faqBlock = blocks.find((b: any) => b.blockType === 'injuryTypeFAQ')
  if (faqBlock?.items) {
    const validFaqs = faqBlock.items.filter(
      (f: any) => f.question && f.answerText && f.answerText.length >= 40,
    )
    if (validFaqs.length >= 5) score += 20
    else if (validFaqs.length >= 3) score += 15
    else if (validFaqs.length >= 1) score += 8
  }

  const ktBlock = blocks.find((b: any) => b.blockType === 'injuryTypeKeyTakeaways')
  if (ktBlock?.items?.length >= 4) score += 10
  else if (ktBlock?.items?.length >= 2) score += 5

  const expBlock = blocks.find((b: any) => b.blockType === 'injuryTypeExpert')
  if (expBlock?.author) score += 10

  const srcBlock = blocks.find((b: any) => b.blockType === 'injuryTypeSources')
  if (srcBlock?.sources?.length >= 2) score += 5

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

export const InjuryTypes: CollectionConfig = {
  slug: 'injuryTypes',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'category'],
    listSearchableFields: ['title', 'slug', 'category'],
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
      admin: { description: 'Injury name, e.g. "Whiplash"' },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'URL slug, e.g. "whiplash"' },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Head & Brain', value: 'Head & Brain' },
        { label: 'Neck', value: 'Neck' },
        { label: 'Spine & Back', value: 'Spine & Back' },
        { label: 'Shoulders & Joints', value: 'Shoulders & Joints' },
        { label: 'Muscles & Soft Tissue', value: 'Muscles & Soft Tissue' },
        { label: 'Bones / Fractures', value: 'Bones / Fractures' },
        { label: 'Chest & Abdomen', value: 'Chest & Abdomen' },
        { label: 'Skin / Burns', value: 'Skin / Burns' },
        { label: 'Emotional / Mental', value: 'Emotional / Mental' },
      ],
      admin: {
        description: 'Injury category for filtering and display.',
      },
    },
    {
      name: 'icon',
      type: 'text',
      admin: { description: 'Icon name key, e.g. "steth"' },
    },
    {
      name: 'sceneImg',
      type: 'text',
      admin: { description: 'Scene image key, e.g. "clinical" or "scan"' },
    },
    {
      name: 'displayOrder',
      type: 'number',
      admin: { position: 'sidebar' },
    },

    // ─── AEO Lead ─────────────────────────────────────────────────────────
    {
      name: 'directAnswer',
      type: 'textarea',
      required: true,
      admin: {
        description: 'AEO-optimized overview — shown in featured snippets and voice search. ~2–3 sentences.',
      },
    },

    // ─── CMS Blocks ─────────────────────────────────────────────────────────
    {
      name: 'blocks',
      type: 'blocks',
      blocks: INJURYTYPE_BLOCKS,
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
          Field: '@/components/admin/InjuryTypePreviewButton',
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
          console.error('[InjuryTypes] Score calculation error:', err)
        }

        return data
      },
    ],
    afterChange: [
      async ({ doc }) => {
        try {
          const { revalidatePath } = await import('next/cache')
          // Revalidate hub page
          revalidatePath(`/injuries/${doc.slug}`)
          // Revalidate injuries list
          revalidatePath('/injuries')
          // Revalidate all 4 spoke pages under this injury type
          const spokeTypes = ['symptoms', 'treatment', 'recovery-timeline', 'settlement-factors']
          for (const spoke of spokeTypes) {
            revalidatePath(`/injuries/${doc.slug}/${spoke}`)
          }
        } catch {
          // Not in Next.js context
        }
      },
    ],
  },
}
