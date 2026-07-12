import type { Block } from 'payload'

// ─── Injury Type (Category) Page Block Library ──────────────────────────────────
// Blocks used in InjuryTypes collection — the injury landing/category pages
// (e.g. /injuries/whiplash)

const InjuryTypeDirectAnswer: Block = {
  slug: 'injuryTypeDirectAnswer',
  labels: { singular: 'Direct Answer', plural: 'Direct Answers' },
  fields: [
    { name: 'heading', type: 'text', label: 'Capsule Heading' },
    { name: 'lead', type: 'textarea', admin: { description: 'Primary AEO answer — shown in featured snippets and voice search.' } },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'authors',
      label: 'Author',
    },
  ],
}

const InjuryTypeKeyTakeaways: Block = {
  slug: 'injuryTypeKeyTakeaways',
  labels: { singular: 'Key Takeaways', plural: 'Key Takeaways' },
  fields: [
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'item', type: 'text', required: true },
      ],
    },
  ],
}

const InjuryTypeProseSections: Block = {
  slug: 'injuryTypeProseSections',
  labels: { singular: 'Prose Sections', plural: 'Prose Sections' },
  fields: [
    {
      name: 'sections',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'content', type: 'textarea', required: true },
      ],
    },
  ],
}

const InjuryTypeFAQ: Block = {
  slug: 'injuryTypeFAQ',
  labels: { singular: 'FAQ Accordion', plural: 'FAQ Accordions' },
  fields: [
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answerText', type: 'textarea', required: true },
      ],
    },
    { name: 'aiCitationSummary', type: 'textarea' },
  ],
}

const InjuryTypeExpert: Block = {
  slug: 'injuryTypeExpert',
  labels: { singular: 'Expert Block', plural: 'Expert Blocks' },
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
}

const InjuryTypeSources: Block = {
  slug: 'injuryTypeSources',
  labels: { singular: 'Sources & Citations', plural: 'Sources & Citations' },
  fields: [
    { name: 'citeTitle', type: 'text' },
    { name: 'citeUrl', type: 'text' },
    {
      name: 'sources',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'url', type: 'text' },
      ],
    },
  ],
}

const InjuryTypeCTA: Block = {
  slug: 'injuryTypeCTA',
  labels: { singular: 'CTA Band', plural: 'CTA Bands' },
  fields: [
    { name: 'title', type: 'text' },
    { name: 'subtitle', type: 'text' },
    { name: 'link', type: 'text' },
  ],
}

const InjuryTypeStatTiles: Block = {
  slug: 'injuryTypeStatTiles',
  labels: { singular: 'Stat Tiles', plural: 'Stat Tiles' },
  fields: [
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },
  ],
}

const InjuryTypeExploreMore: Block = {
  slug: 'injuryTypeExploreMore',
  labels: { singular: 'Explore More', plural: 'Explore More' },
  fields: [
    {
      name: 'pages',
      type: 'relationship',
      relationTo: 'injuryArticles',
      hasMany: true,
    },
  ],
}

// ─── Block Registry ────────────────────────────────────────────────────────────

export const INJURYTYPE_BLOCKS: Block[] = [
  InjuryTypeDirectAnswer,
  InjuryTypeKeyTakeaways,
  InjuryTypeProseSections,
  InjuryTypeFAQ,
  InjuryTypeExpert,
  InjuryTypeSources,
  InjuryTypeCTA,
  InjuryTypeStatTiles,
  InjuryTypeExploreMore,
]
