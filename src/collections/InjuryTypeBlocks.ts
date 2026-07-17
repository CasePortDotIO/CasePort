import type { Block } from 'payload'

// ─── Injury Type (Category) Page Block Library ──────────────────────────────────
// Blocks used in InjuryTypes collection — the injury landing/category pages
// (e.g. /injuries/whiplash)

const InjuryTypeHero: Block = {
  slug: 'injuryTypeHero',
  labels: { singular: 'Hero', plural: 'Hero Blocks' },
  fields: [
    { name: 'eyebrow', type: 'text', admin: { description: 'Category label above the title, e.g. "Neck & Soft Tissue"' } },
    { name: 'heroTitle', type: 'text', label: 'Title' },
    { name: 'heroSubtitle', type: 'textarea', label: 'Subtitle / Lead' },
    { name: 'scene', type: 'text', admin: { description: 'Scene image key, e.g. "clinical", "scan", "hospital"' } },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Optional hero image override.' },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'authors',
      admin: { description: 'Medical reviewer.' },
    },
  ],
}

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

const InjuryTypeSymptoms: Block = {
  slug: 'injuryTypeSymptoms',
  labels: { singular: 'Symptoms', plural: 'Symptoms Blocks' },
  fields: [
    {
      name: 'immediate',
      type: 'array',
      label: 'Immediate symptoms',
      fields: [{ name: 'item', type: 'text' }],
    },
    {
      name: 'delayed',
      type: 'array',
      label: 'Delayed symptoms',
      fields: [{ name: 'item', type: 'text' }],
    },
    {
      name: 'emergency',
      type: 'array',
      label: 'Emergency symptoms (call 911)',
      fields: [{ name: 'item', type: 'text' }],
    },
  ],
}

const InjuryTypeImageComparison: Block = {
  slug: 'injuryTypeImageComparison',
  labels: { singular: 'Image Comparison', plural: 'Image Comparisons' },
  fields: [
    {
      name: 'trapTitle',
      type: 'text',
      admin: { description: 'Title shown above the comparison, e.g. "Why X-Rays Can Miss Your Injury"' },
    },
    {
      name: 'trapContent',
      type: 'textarea',
      admin: { description: 'Subtitle or description shown below the title.' },
    },
    {
      name: 'trapImageA',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Image shown in the background (e.g. MRI — the revealing image).' },
    },
    {
      name: 'trapImageB',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Image revealed on drag (e.g. X-ray — the hidden image).' },
    },
    {
      name: 'points',
      type: 'array',
      fields: [
        { name: 'bold', type: 'text', required: true, admin: { description: 'Bold heading text.' } },
        { name: 'text', type: 'textarea', required: true, admin: { description: 'Description text.' } },
      ],
    },
  ],
}

const InjuryTypeTreatment: Block = {
  slug: 'injuryTypeTreatment',
  labels: { singular: 'Treatment Steps', plural: 'Treatment Steps Blocks' },
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
}

const InjuryTypeRecovery: Block = {
  slug: 'injuryTypeRecovery',
  labels: { singular: 'Recovery Timeline', plural: 'Recovery Timeline Blocks' },
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
}

const InjuryTypeSettlement: Block = {
  slug: 'injuryTypeSettlement',
  labels: { singular: 'Settlement Factors', plural: 'Settlement Factors Blocks' },
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
    {
      name: 'siteLink',
      type: 'relationship',
      relationTo: 'siteLinks',
      admin: { description: 'Select which page this CTA button links to' },
    },
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
      admin: { description: 'Select injury article pages to show in the Go Deeper section.' },
    },
  ],
}

const InjuryTypeTOC: Block = {
  slug: 'injuryTypeTOC',
  labels: { singular: 'Table of Contents', plural: 'Table of Contents' },
  fields: [
    {
      name: 'items',
      type: 'array',
      admin: { description: 'TOC entries — typically matches the H2 titles from your Prose Sections block.' },
      fields: [
        { name: 'label', type: 'text', required: true },
      ],
    },
  ],
}

const InjuryTypeRelatedInjuries: Block = {
  slug: 'injuryTypeRelatedInjuries',
  labels: { singular: 'Related Injuries', plural: 'Related Injuries' },
  fields: [
    {
      name: 'sectionTitle',
      type: 'text',
      admin: { description: 'Optional custom title for this section. Defaults to "Other Injuries".' },
    },
    {
      name: 'injuryTypes',
      type: 'relationship',
      relationTo: 'injuryTypes',
      hasMany: true,
      admin: { description: 'Select which injury types to show in this section.' },
    },
  ],
}

// ─── Block Registry ────────────────────────────────────────────────────────────

export const INJURYTYPE_BLOCKS: Block[] = [
  InjuryTypeHero,
  InjuryTypeDirectAnswer,
  InjuryTypeKeyTakeaways,
  InjuryTypeTOC,
  InjuryTypeProseSections,
  InjuryTypeSymptoms,
  InjuryTypeImageComparison,
  InjuryTypeTreatment,
  InjuryTypeRecovery,
  InjuryTypeSettlement,
  InjuryTypeFAQ,
  InjuryTypeExpert,
  InjuryTypeSources,
  InjuryTypeCTA,
  InjuryTypeStatTiles,
  InjuryTypeExploreMore,
  InjuryTypeRelatedInjuries,
]
