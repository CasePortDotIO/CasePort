import type { CollectionConfig } from 'payload'

import { CATEGORY_BLOCKS } from './CategoryBlocks'

export const GuideNewCategories: CollectionConfig = {
  slug: 'guideCategories',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'dataKey', 'displayOrder'],
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
    {
      name: 'dataKey',
      type: 'text',
      admin: {
        description: 'Key used to pull matching static data from accident-types.ts (e.g. "car-accident" for "car-accidents" category)',
      },
      label: 'Static Data Key',
    },

    // Hero
    { name: 'heroTitle', type: 'text', label: 'Hero Title' },
    { name: 'heroSubtitle', type: 'text', label: 'Hero Subtitle' },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'short', type: 'text', label: 'Short Description', admin: { description: 'Short description shown in category cards and navigation.' } },
    {
      name: 'displayOrder',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Lower numbers appear first in the hub grid.' },
    },

    // CMS-controlled page sections (StatTiles, KeyTakeaways, ProseSections, FAQ, StatuteDeadlines, WhyImportant)
    {
      name: 'blocks',
      type: 'blocks',
      blocks: CATEGORY_BLOCKS,
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
