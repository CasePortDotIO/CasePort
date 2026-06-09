import type { CollectionConfig } from 'payload'

export const GuideCategories: CollectionConfig = {
  slug: 'guideCategories',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'displayOrder'],
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeChange: [
      async ({ data }) => {
        if (!data?.slug && data?.title) {
          data.slug = data.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '')
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc }) => {
        try {
          const { revalidatePath } = await import('next/cache')
          revalidatePath('/guides')
          if (doc.slug) {
            revalidatePath(`/guides/${doc.slug}`)
          }
        } catch {
          // If we are not in a Next.js server context, quietly ignore
        }
      },
    ],
  },
  fields: [
    // ─── Core ──────────────────────────────────────────────────────────
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Category Title',
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      required: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'icon',
      type: 'text',
      label: 'Icon (emoji)',
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'displayOrder',
      type: 'number',
      defaultValue: 0,
    },
    // ─── Hero Content ───────────────────────────────────────────────────
    {
      name: 'heroTitle',
      type: 'text',
      label: 'Hero Title',
      admin: { description: 'Override the default "Your Guide to {Category} Claims" title' },
    },
    {
      name: 'heroSubtitle',
      type: 'text',
      label: 'Hero Subtitle',
    },
    {
      name: 'whyImportant',
      type: 'textarea',
      label: 'Why This Matters – intro text',
    },
    // ─── Quick Answer Stats ────────────────────────────────────────────
    {
      name: 'quickAnswerStats',
      type: 'group',
      label: 'Quick Answer Stats',
      fields: [
        { name: 'average', type: 'text', label: 'Average Settlement' },
        { name: 'successRate', type: 'text', label: 'Success Rate' },
        { name: 'timeline', type: 'text', label: 'Timeline' },
        { name: 'upfront', type: 'text', label: 'Upfront Cost' },
      ],
    },
    // ─── Credibility Section ────────────────────────────────────────────
    {
      name: 'credibilitySection',
      type: 'group',
      label: 'Credibility Section',
      fields: [
        { name: 'recoveredAmount', type: 'text', label: 'Total Recovered (e.g. $1.8B+)' },
        { name: 'successRate', type: 'text', label: 'Success Rate %' },
        { name: 'casesWon', type: 'text', label: 'Cases Won (e.g. 4,500+)' },
        { name: 'avgSettlement', type: 'text', label: 'Avg Settlement' },
        { name: 'recoveryNote', type: 'text', label: 'Recovery Note (e.g. "5x more than going it alone")' },
      ],
    },
    // ─── Testimonials ───────────────────────────────────────────────────
    {
      name: 'testimonials',
      type: 'array',
      label: 'Client Testimonials',
      fields: [
        { name: 'name', type: 'text' },
        { name: 'location', type: 'text' },
        { name: 'settlement', type: 'text' },
        { name: 'settlementValue', type: 'text' },
        { name: 'injuryType', type: 'text' },
        { name: 'quote', type: 'textarea' },
        { name: 'rating', type: 'number' },
      ],
    },
    // ─── Settlement Data ────────────────────────────────────────────────
    {
      name: 'settlementData',
      type: 'group',
      label: 'Settlement Data',
      fields: [
        {
          name: 'rangesByInjury',
          type: 'array',
          label: 'Ranges by Injury Type',
          fields: [
            { name: 'injuryType', type: 'text' },
            { name: 'settlementAmount', type: 'text' },
            { name: 'minAmount', type: 'text' },
            { name: 'maxAmount', type: 'text' },
            { name: 'recoveryTime', type: 'text' },
          ],
        },
        {
          name: 'attorneyComparison',
          type: 'array',
          label: 'Attorney Comparison Rows',
          fields: [
            { name: 'label', type: 'text' },
            { name: 'withoutAttorney', type: 'textarea' },
            { name: 'withAttorney', type: 'textarea' },
          ],
        },
      ],
    },
    // ─── Statute of Limitations ────────────────────────────────────────
    {
      name: 'statuteOfLimitations',
      type: 'group',
      label: 'Statute of Limitations',
      fields: [
        { name: 'description', type: 'textarea', label: 'Description' },
        {
          name: 'byState',
          type: 'array',
          label: 'By State',
          fields: [
            { name: 'state', type: 'text' },
            { name: 'years', type: 'number' },
            { name: 'notes', type: 'text' },
          ],
        },
      ],
    },
    // ─── FAQ Section ────────────────────────────────────────────────────
    {
      name: 'faqSection',
      type: 'array',
      label: 'FAQs',
      fields: [
        { name: 'question', type: 'text' },
        { name: 'answer', type: 'textarea' },
      ],
    },
    {
      name: 'peopleAlsoAsk',
      type: 'array',
      label: 'People Also Ask',
      fields: [
        { name: 'question', type: 'text' },
        { name: 'answer', type: 'textarea' },
      ],
    },
    // ─── SEO Core ────────────────────────────────────────────────────────
    {
      name: 'metaTitle',
      type: 'text',
      maxLength: 60,
      label: 'Meta Title',
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      maxLength: 160,
      label: 'Meta Description',
    },
    {
      name: 'canonicalUrl',
      type: 'text',
      label: 'Canonical URL',
    },
    {
      name: 'socialHeadline',
      type: 'text',
      label: 'Social Headline',
    },
    {
      name: 'socialDescription',
      type: 'textarea',
      label: 'Social Description',
    },
    {
      name: 'socialShareImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Social Share Image',
    },
    {
      name: 'xCardType',
      type: 'select',
      options: ['summary_large_image', 'summary'],
      label: 'X Card Type',
    },
    {
      name: 'xCardTitle',
      type: 'text',
      label: 'X Card Title',
    },
    {
      name: 'xCardDescription',
      type: 'textarea',
      label: 'X Card Description',
    },
    {
      name: 'xCardImage',
      type: 'upload',
      relationTo: 'media',
      label: 'X Card Image',
    },
    // ─── AEO / AI Citation ──────────────────────────────────────────────
    {
      name: 'directAnswer',
      type: 'textarea',
      label: 'Direct Answer (AEO)',
      admin: { description: '40+ chars. Primary answer for featured snippets and AI citations.' },
    },
    {
      name: 'aiCitationSummary',
      type: 'textarea',
      label: 'AI Citation Summary',
    },
    {
      name: 'primaryAiQuery',
      type: 'text',
      label: 'Primary AI Query',
    },
    // ─── Schema ────────────────────────────────────────────────────────
    {
      name: 'schemaType',
      type: 'select',
      options: ['GuidePage', 'FAQPage', 'CollectionPage'],
      label: 'Schema Type',
    },
    // ─── Related Guides ────────────────────────────────────────────────
    {
      name: 'relatedGuides',
      type: 'relationship',
      relationTo: 'guideArticles',
      hasMany: true,
      label: 'Related Guides',
    },
    // ─── Sidebar ──────────────────────────────────────────────────────
    {
      name: 'hideFromSearchEngines',
      type: 'checkbox',
      admin: { position: 'sidebar' },
    },
  ],
  timestamps: true,
}