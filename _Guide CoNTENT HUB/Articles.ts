import { CollectionConfig } from 'payload/types'

export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'headline',
    defaultColumns: ['headline', 'audience', 'status', 'lastReviewedAt'],
  },
  fields: [
    {
      name: 'audience',
      type: 'select',
      required: true,
      options: [
        { label: 'B2B — Law Firms (/insights)', value: 'b2b' },
        { label: 'B2C — Guides (/guides)', value: 'b2c-guide' },
        { label: 'B2C — Accident Type (/accidents)', value: 'b2c-accident' },
      ],
    },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'headline', type: 'text', required: true },
    { name: 'subheadline', type: 'text' },
    { name: 'topicTag', type: 'text' },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    { name: 'heroImageAlt', type: 'text' },
    { name: 'readTime', type: 'number' },
    { name: 'directAnswer', type: 'textarea', required: true },
    {
      name: 'statCallouts',
      type: 'array',
      maxRows: 3,
      fields: [
        { name: 'number', type: 'text' },
        { name: 'label', type: 'text' },
      ],
    },
    {
      name: 'keyTakeaways',
      type: 'array',
      fields: [{ name: 'item', type: 'textarea' }],
    },
    { name: 'body', type: 'richText' },
    {
      name: 'updateLog',
      type: 'array',
      fields: [
        { name: 'date', type: 'text' },
        { name: 'description', type: 'text' },
      ],
    },
    { name: 'helpfulCount', type: 'number', defaultValue: 0 },
    { name: 'faqs', type: 'relationship', relationTo: 'faq-items', hasMany: true },
    { name: 'relatedArticles', type: 'relationship', relationTo: 'articles', hasMany: true, maxRows: 3 },
    {
      name: 'keyDataPoints',
      type: 'array',
      fields: [
        { name: 'stat', type: 'textarea' },
        { name: 'source', type: 'text' },
        { name: 'sourceUrl', type: 'text' },
      ],
    },
    // AEO blocks
    {
      name: 'aeoBlock1',
      type: 'group',
      fields: [
        { name: 'ariaLabel', type: 'text' },
        { name: 'content', type: 'textarea' },
        { name: 'speakableSelector', type: 'text' },
      ],
    },
    {
      name: 'aeoBlock2',
      type: 'group',
      fields: [
        { name: 'ariaLabel', type: 'text' },
        { name: 'content', type: 'textarea' },
        { name: 'speakableSelector', type: 'text' },
      ],
    },
    {
      name: 'aeoBlock3',
      type: 'group',
      fields: [
        { name: 'ariaLabel', type: 'text' },
        { name: 'content', type: 'textarea' },
        { name: 'speakableSelector', type: 'text' },
      ],
    },
    // Tabs
    {
      type: 'tabs',
      tabs: [
        {
          label: 'SEO',
          fields: [
            { name: 'metaTitle', type: 'text' },
            { name: 'metaDescription', type: 'textarea' },
            { name: 'ogTitle', type: 'text' },
            { name: 'ogDescription', type: 'textarea' },
            { name: 'ogImage', type: 'upload', relationTo: 'media' },
            {
              name: 'breadcrumbs',
              type: 'array',
              fields: [
                { name: 'name', type: 'text' },
                { name: 'url', type: 'text' },
              ],
            },
          ],
        },
        {
          label: 'E-E-A-T',
          fields: [
            { name: 'authorName', type: 'text' },
            { name: 'authorTitle', type: 'text' },
            { name: 'authorUrl', type: 'text' },
            { name: 'authorInitials', type: 'text', maxLength: 2 },
            { name: 'publishedAt', type: 'date' },
            { name: 'lastReviewedAt', type: 'date' },
            { name: 'reviewedByAttorney', type: 'checkbox', defaultValue: false },
            { name: 'reviewingAttorneyName', type: 'text' },
            { name: 'reviewingAttorneyBio', type: 'textarea' },
          ],
        },
        {
          label: 'Schema',
          fields: [
            { name: 'articleHeadline', type: 'text' },
            { name: 'howToSchemaEnabled', type: 'checkbox', defaultValue: false },
            { name: 'howToName', type: 'text' },
            {
              name: 'howToSteps',
              type: 'array',
              fields: [
                { name: 'name', type: 'text' },
                { name: 'text', type: 'textarea' },
                { name: 'url', type: 'text' },
              ],
            },
            { name: 'datasetSchemaEnabled', type: 'checkbox', defaultValue: false },
            { name: 'definedTermsEnabled', type: 'checkbox', defaultValue: false },
            {
              name: 'definedTerms',
              type: 'array',
              fields: [
                { name: 'termName', type: 'text' },
                { name: 'termDefinition', type: 'textarea' },
              ],
            },
            {
              name: 'speakableSelectors',
              type: 'array',
              fields: [{ name: 'selector', type: 'text' }],
            },
          ],
        },
        {
          label: 'Technical',
          fields: [
            {
              name: 'status',
              type: 'select',
              options: ['draft', 'review', 'published', 'archived'],
            },
            { name: 'isrRevalidateSeconds', type: 'number', defaultValue: 3600 },
          ],
        },
      ],
    },
  ],
}
