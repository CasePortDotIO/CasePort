import type { Block } from 'payload'

// ─── Injury Article (Spoke) Block Library ──────────────────────────────────────
// Blocks used in InjuryArticles collection — the injury spoke pages
// (e.g. /injuries/whiplash/symptoms, /injuries/whiplash/treatment, etc.)

// ── Shared article fields (present across all spoke types) ──────────────────────

const InjuryArticleSymptoms: Block = {
  slug: 'injuryArticleSymptoms',
  labels: { singular: 'Symptoms Block', plural: 'Symptoms Blocks' },
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
}

const InjuryArticleTreatment: Block = {
  slug: 'injuryArticleTreatment',
  labels: { singular: 'Treatment Steps Block', plural: 'Treatment Steps Blocks' },
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

const InjuryArticleRecovery: Block = {
  slug: 'injuryArticleRecovery',
  labels: { singular: 'Recovery Timeline Block', plural: 'Recovery Timeline Blocks' },
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

const InjuryArticleSettlement: Block = {
  slug: 'injuryArticleSettlement',
  labels: { singular: 'Settlement Factors Block', plural: 'Settlement Factors Blocks' },
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

// Direct answer / capsule for spoke pages
const InjuryArticleDirectAnswer: Block = {
  slug: 'injuryArticleDirectAnswer',
  labels: { singular: 'Direct Answer', plural: 'Direct Answers' },
  fields: [
    { name: 'heading', type: 'text', label: 'Capsule Heading' },
    {
      name: 'lead',
      type: 'textarea',
      admin: { description: 'Primary AEO answer — shown in featured snippets and voice search.' },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'authors',
      label: 'Author / Reviewer',
    },
  ],
}

// Prose sections for spoke pages
const InjuryArticleProseSections: Block = {
  slug: 'injuryArticleProseSections',
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

// Key takeaways for spoke pages
const InjuryArticleKeyTakeaways: Block = {
  slug: 'injuryArticleKeyTakeaways',
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

// Expert review for spoke pages
const InjuryArticleExpert: Block = {
  slug: 'injuryArticleExpert',
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

// Sources for spoke pages
const InjuryArticleSources: Block = {
  slug: 'injuryArticleSources',
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

// CTA for spoke pages
const InjuryArticleCTA: Block = {
  slug: 'injuryArticleCTA',
  labels: { singular: 'CTA Band', plural: 'CTA Bands' },
  fields: [
    { name: 'title', type: 'text' },
    { name: 'subtitle', type: 'text' },
    { name: 'link', type: 'text' },
  ],
}

// Explore More — related injury articles
const InjuryArticleExploreMore: Block = {
  slug: 'injuryArticleExploreMore',
  labels: { singular: 'Explore More', plural: 'Explore More' },
  fields: [
    {
      name: 'pages',
      type: 'relationship',
      relationTo: 'injuryArticles',
      hasMany: true,
      admin: { description: 'Select related injury articles to show in the Go Deeper section.' },
    },
  ],
}

// ─── Block Registry ────────────────────────────────────────────────────────────

export const INJURYARTICLE_BLOCKS: Block[] = [
  InjuryArticleSymptoms,
  InjuryArticleTreatment,
  InjuryArticleRecovery,
  InjuryArticleSettlement,
  InjuryArticleDirectAnswer,
  InjuryArticleProseSections,
  InjuryArticleKeyTakeaways,
  InjuryArticleExpert,
  InjuryArticleSources,
  InjuryArticleCTA,
  InjuryArticleExploreMore,
]
