import type { CollectionConfig } from 'payload'
import { CATEGORY_BLOCKS } from './CategoryBlocks'

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
    // ─── Category Blocks ────────────────────────────────────────────────
    {
      name: 'blocks',
      type: 'blocks',
      blocks: CATEGORY_BLOCKS,
      admin: {
        description: 'Add, remove, and reorder sections for this category page.',
      },
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