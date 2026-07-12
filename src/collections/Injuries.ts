import type { CollectionConfig, FieldHook } from 'payload'

// ─── AEO/SEO Score Helpers ────────────────────────────────────────────────────

const extractTextFromBlocks = (blocks: any[]): string => {
  if (!blocks || !Array.isArray(blocks)) return ''
  let text = ''
  for (const block of blocks) {
    if (!block) continue
    if (block.blockType === 'directAnswer') {
      text += (block.lead || block.text || '') + ' '
    }
    if (block.blockType === 'keyTakeaways' && Array.isArray(block.items)) {
      for (const item of block.items) text += (item.item || '') + ' '
    }
    if (block.blockType === 'faq' && Array.isArray(block.items)) {
      for (const item of block.items) {
        text += (item.question || '') + ' ' + (item.answerText || '') + ' '
      }
    }
    if (block.blockType === 'proseSections' && Array.isArray(block.sections)) {
      for (const s of block.sections) text += (s.title || '') + ' ' + (s.content || '') + ' '
    }
    if (block.blockType === 'hero') {
      text += (block.heroTitle || '') + ' ' + (block.heroSubtitle || '') + ' '
    }
    if (block.blockType === 'treatmentStep' && Array.isArray(block.items)) {
      for (const item of block.items) text += (item.name || '') + ' ' + (item.desc || '') + ' '
    }
    if (block.blockType === 'recoveryPhase' && Array.isArray(block.phases)) {
      for (const p of block.phases) text += (p.phase || '') + ' ' + (p.time || '') + ' ' + (p.desc || '') + ' '
    }
    if (block.blockType === 'settlementFactor' && Array.isArray(block.items)) {
      for (const item of block.items) text += (item.factor || '') + ' ' + (item.desc || '') + ' '
    }
    if (block.blockType === 'takeHome') {
      text += (block.title || '') + ' '
      if (Array.isArray(block.items)) {
        for (const it of block.items) text += (it.item || '') + ' '
      }
    }
  }
  return text
}

const calculateAeoScore: FieldHook = async ({ data }) => {
  const blocks: any[] = data?.blocks || []
  let score = 0

  const daBlock = blocks.find((b: any) => b.blockType === 'directAnswer')
  if (daBlock?.lead || daBlock?.text) {
    const len = (daBlock.lead || daBlock.text || '').length
    if (len >= 100) score += 30
    else if (len >= 60) score += 20
    else if (len >= 30) score += 10
    if ((daBlock.lead || daBlock.text || '').toLowerCase().includes('caseport')) score += 5
  }
  if (daBlock?.voiceAnswer) {
    const vLen = daBlock.voiceAnswer.length
    const words = daBlock.voiceAnswer.split(' ').filter(Boolean).length
    if (vLen >= 20 && words <= 40) score += 15
    else if (vLen >= 10) score += 8
  }
  if (daBlock?.speakableCssSelectors?.length > 0) score += 10

  const faqBlock = blocks.find((b: any) => b.blockType === 'faq')
  if (faqBlock?.items) {
    const validFaqs = faqBlock.items.filter(
      (f: any) => f.question && f.answerText && f.answerText.length >= 40,
    )
    if (validFaqs.length >= 5) score += 20
    else if (validFaqs.length >= 3) score += 15
    else if (validFaqs.length >= 1) score += 8
    const voiceFaqs = faqBlock.items.filter((f: any) => f.voiceQuestion)
    if (voiceFaqs.length >= 3) score += 10
    else if (voiceFaqs.length >= 1) score += 5
  }

  const ktBlock = blocks.find((b: any) => b.blockType === 'keyTakeaways')
  if (ktBlock?.items?.length >= 4) score += 10
  else if (ktBlock?.items?.length >= 2) score += 5

  const expBlock = blocks.find((b: any) => b.blockType === 'expert')
  if (expBlock?.author) score += 10

  const srcBlock = blocks.find((b: any) => b.blockType === 'sources')
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

export const Injuries: CollectionConfig = {
  slug: 'injuries',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'category', 'readTime'],
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
      type: 'text',
      required: true,
      admin: { description: 'Category label, e.g. "Neck & Soft Tissue"' },
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

    // ─── AEO Lead ───────────────────────────────────────────────────────────
    {
      name: 'directAnswer',
      type: 'textarea',
      required: true,
      admin: {
        description: 'AEO-optimized overview — shown in featured snippets and voice search. ~2–3 sentences.',
      },
    },

    // ─── Stats (shown as tiles on injury page) ──────────────────────────────
    {
      name: 'stats',
      type: 'array',
      admin: { description: '4 stat tiles shown below the hero.' },
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },

    // ─── Key Facts ──────────────────────────────────────────────────────────
    {
      name: 'keyFacts',
      type: 'array',
      admin: { description: 'Key facts shown in the KeyTakeaways block.' },
      fields: [{ name: 'item', type: 'text', required: true }],
    },

    // ─── Root-level fallbacks (mirrors static data shape) ──────────────────
    // These let page components read injury.recovery / injury.settlement / etc.
    // without needing to dig through blocks. Blocks take priority; these are the fallback.
    {
      name: 'sections',
      type: 'array',
      admin: { description: 'Top-level prose sections (fallback for ProseSections).' },
      fields: [
        { name: 'title', type: 'text' },
        { name: 'content', type: 'text' },
      ],
    },
    {
      name: 'symptoms',
      type: 'group',
      admin: { description: 'Symptom arrays for spoke pages.' },
      fields: [
        { name: 'immediate', type: 'array', fields: [{ name: 'item', type: 'text' }] },
        { name: 'delayed', type: 'array', fields: [{ name: 'item', type: 'text' }] },
        { name: 'emergency', type: 'array', fields: [{ name: 'item', type: 'text' }] },
      ],
    },
    {
      name: 'treatment',
      type: 'array',
      admin: { description: 'Treatment steps for spoke pages.' },
      fields: [
        { name: 'name', type: 'text' },
        { name: 'desc', type: 'textarea' },
      ],
    },
    {
      name: 'recovery',
      type: 'array',
      admin: { description: 'Recovery phases for spoke pages.' },
      fields: [
        { name: 'phase', type: 'text' },
        { name: 'time', type: 'text' },
        { name: 'desc', type: 'textarea' },
      ],
    },
    {
      name: 'settlement',
      type: 'array',
      admin: { description: 'Settlement factors for spoke pages.' },
      fields: [
        { name: 'factor', type: 'text' },
        { name: 'desc', type: 'textarea' },
      ],
    },

    // ─── CMS Blocks ─────────────────────────────────────────────────────────
    {
      name: 'blocks',
      type: 'blocks',
      blocks: [
        // Hero — per-injury hero (overrides the hub hero)
        {
          slug: 'hero',
          fields: [
            { name: 'heroTitle', type: 'text' },
            { name: 'heroSubtitle', type: 'textarea' },
            { name: 'eyebrow', type: 'text' },
            { name: 'scene', type: 'text' },
            { name: 'heroImage', type: 'upload', relationTo: 'media' },
            { name: 'reviewerName', type: 'text', label: 'Reviewed By (Author Name)' },
          ],
        },
        // Prose sections
        {
          slug: 'proseSections',
          fields: [
            {
              name: 'sections',
              type: 'array',
              fields: [
                { name: 'title', type: 'text' },
                { name: 'content', type: 'textarea' },
              ],
            },
          ],
        },
        // Symptoms (for symptoms spoke)
        {
          slug: 'symptomsBlock',
          fields: [
            {
              name: 'immediate',
              type: 'array',
              admin: { description: 'Symptoms that appear right away.' },
              fields: [{ name: 'item', type: 'text', required: true }],
            },
            {
              name: 'delayed',
              type: 'array',
              admin: { description: 'Delayed symptoms — hours to days later.' },
              fields: [{ name: 'item', type: 'text', required: true }],
            },
            {
              name: 'emergency',
              type: 'array',
              admin: { description: 'Emergency symptoms — call 911.' },
              fields: [{ name: 'item', type: 'text', required: true }],
            },
          ],
        },
        // Treatment steps (for treatment spoke)
        {
          slug: 'treatmentStep',
          fields: [
            {
              name: 'steps',
              type: 'array',
              fields: [
                { name: 'name', type: 'text', required: true },
                { name: 'desc', type: 'textarea', required: true },
              ],
            },
          ],
        },
        // Recovery phases (for recovery spoke)
        {
          slug: 'recoveryPhase',
          fields: [
            {
              name: 'phases',
              type: 'array',
              fields: [
                { name: 'phase', type: 'text', required: true },
                { name: 'time', type: 'text', required: true },
                { name: 'desc', type: 'textarea', required: true },
              ],
            },
          ],
        },
        // Settlement factors (for settlement spoke)
        {
          slug: 'settlementFactor',
          fields: [
            {
              name: 'factors',
              type: 'array',
              fields: [
                { name: 'factor', type: 'text', required: true },
                { name: 'desc', type: 'textarea', required: true },
              ],
            },
          ],
        },
        // Direct Answer (AEO)
        {
          slug: 'directAnswer',
          fields: [
            { name: 'heading', type: 'text' },
            { name: 'lead', type: 'textarea', admin: { description: 'Primary AEO answer for featured snippets.' } },
            { name: 'text', type: 'textarea' },
            {
              name: 'voiceAnswer',
              type: 'textarea',
              admin: { description: 'Voice search answer — keep under 35 words.' },
            },
            {
              name: 'speakableCssSelectors',
              type: 'array',
              fields: [{ name: 'selector', type: 'text' }],
            },
            {
              name: 'table',
              type: 'group',
              fields: [
                { name: 'label', type: 'text' },
                { name: 'head', type: 'array', fields: [{ name: 'cell', type: 'text' }] },
                {
                  name: 'rows',
                  type: 'array',
                  fields: [{ name: 'cells', type: 'array', fields: [{ name: 'cell', type: 'text' }] }],
                },
              ],
            },
          ],
        },
        {
          slug: 'faq',
          fields: [
            {
              name: 'items',
              type: 'array',
              fields: [
                { name: 'question', type: 'text' },
                { name: 'answerText', type: 'textarea' },
                { name: 'voiceQuestion', type: 'text' },
                { name: 'slug', type: 'text' },
              ],
            },
            { name: 'aiCitationSummary', type: 'textarea' },
            {
              name: 'conversationalQueryVariants',
              type: 'array',
              fields: [{ name: 'query', type: 'text' }],
            },
          ],
        },
        {
          slug: 'keyTakeaways',
          fields: [{ name: 'items', type: 'array', fields: [{ name: 'item', type: 'text' }] }],
        },
        {
          slug: 'expert',
          fields: [
            {
              name: 'author',
              type: 'relationship',
              relationTo: 'authors',
            },
            {
              name: 'reviewType',
              type: 'select',
              options: [
                { label: 'Legal', value: 'legal' },
                { label: 'Medical', value: 'medical' },
              ],
            },
            { name: 'sourceText', type: 'textarea' },
          ],
        },
        {
          slug: 'sources',
          fields: [
            { name: 'citeTitle', type: 'text' },
            { name: 'citeUrl', type: 'text' },
            {
              name: 'sources',
              type: 'array',
              fields: [
                { name: 'name', type: 'text' },
                { name: 'url', type: 'text' },
              ],
            },
          ],
        },
        {
          slug: 'cta',
          fields: [
            { name: 'title', type: 'text' },
            { name: 'subtitle', type: 'text' },
            { name: 'link', type: 'text' },
          ],
        },
        {
          slug: 'exploreMore',
          fields: [
            { name: 'category', type: 'text' },
            {
              name: 'pages',
              type: 'relationship',
              relationTo: 'injuries',
              hasMany: true,
            },
          ],
        },
        {
          slug: 'takeHome',
          fields: [
            { name: 'title', type: 'text' },
            { name: 'items', type: 'array', fields: [{ name: 'item', type: 'text' }] },
          ],
        },
        {
          slug: 'howWeKeepAccurate',
          fields: [{ name: 'text', type: 'textarea' }],
        },
      ],
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
          Field: '@/components/admin/InjuryPreviewButton',
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
          console.error('[Injuries] Score calculation error:', err)
        }

        return data
      },
    ],
    afterChange: [
      async ({ doc }) => {
        try {
          const { revalidatePath } = await import('next/cache')
          revalidatePath(`/injuries/${doc.slug}`)
          revalidatePath('/injuries')
        } catch {
          // Not in Next.js context
        }
      },
    ],
  },
}
