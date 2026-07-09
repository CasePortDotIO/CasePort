import type { CollectionConfig } from 'payload'

import { ACCIDENTCATEGORY_BLOCKS } from './AccidentCategoryBlocks'

export const AccidentCategories: CollectionConfig = {
  slug: 'accidentCategories',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'displayOrder'],
  },
  fields: [
    // Core
    { name: 'title', type: 'text', required: true, label: 'Category Title' },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      required: true,
      admin: { position: 'sidebar' },
    },

    // Hero
    { name: 'heroTitle', type: 'text', label: 'Hero Title' },
    { name: 'heroSubtitle', type: 'text', label: 'Hero Subtitle' },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'short', type: 'text', label: 'Short Description' },
    {
      name: 'displayOrder',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },

    // CMS-controlled page sections
    {
      name: 'blocks',
      type: 'blocks',
      blocks: ACCIDENTCATEGORY_BLOCKS,
      admin: {
        description: 'Add, remove, and reorder sections for this category page.',
      },
    },

    // SEO
    { name: 'metaTitle', type: 'text', maxLength: 60 },
    { name: 'metaDescription', type: 'textarea', maxLength: 160 },
    { name: 'canonicalUrl', type: 'text' },

    // Schema
    {
      name: 'schemaType',
      type: 'select',
      options: ['GuidePage', 'FAQPage', 'CollectionPage'],
    },

    // Sidebar
    {
      name: 'hideFromSearchEngines',
      type: 'checkbox',
      admin: { position: 'sidebar' },
    },
  ],
}
