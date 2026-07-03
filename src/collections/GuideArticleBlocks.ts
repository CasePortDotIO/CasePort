import type { Block } from 'payload'

// ─── Guide Article Block Library ─────────────────────────────────────────────

const ArticleDirectAnswer: Block = {
  slug: 'articleDirectAnswer',
  labels: { singular: 'Direct Answer', plural: 'Direct Answers' },
  fields: [
    { name: 'heading', type: 'text', label: 'Capsule Heading' },
    { name: 'text', type: 'textarea', label: 'Lead Text', admin: { description: 'Capsule lead text shown below the heading.' } },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'authors',
      label: 'Author',
      admin: { description: 'Select the author shown in the Capsule review line.' },
    },
  ],
}

const ArticleKeyTakeaways: Block = {
  slug: 'articleKeyTakeaways',
  labels: { singular: 'Key Takeaways', plural: 'Key Takeaways' },
  fields: [
    {
      name: 'items',
      type: 'array',
      label: 'Takeaway Items',
      fields: [
        { name: 'fact', type: 'text', required: true, label: 'Fact' },
      ],
    },
  ],
}

const ArticleFAQ: Block = {
  slug: 'articleFAQ',
  labels: { singular: 'FAQ Accordion', plural: 'FAQ Accordions' },
  fields: [
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answerText', type: 'textarea', required: true, label: 'Answer' },
      ],
    },
  ],
}

const ArticleRelatedGuides: Block = {
  slug: 'articleRelatedGuides',
  labels: { singular: 'Related Guide Articles', plural: 'Related Guide Articles' },
  fields: [
    {
      name: 'articles',
      type: 'relationship',
      relationTo: 'guideArticles',
      hasMany: true,
      label: 'Guide Articles',
      admin: { description: 'Select the Guide New articles to display.' },
    },
  ],
}

const ArticleSources: Block = {
  slug: 'articleSources',
  labels: { singular: 'Sources & Citations', plural: 'Sources & Citations' },
  fields: [
    {
      name: 'citeTitle',
      type: 'text',
      label: 'Cite Title',
      admin: { description: 'Title shown in the citation (e.g. "Car Accident Guide").' },
    },
    {
      name: 'sources',
      type: 'array',
      label: 'Sources',
      fields: [
        { name: 'name', type: 'text', required: true, label: 'Source Name' },
        { name: 'url', type: 'text', required: true, label: 'Source URL' },
      ],
    },
  ],
}

const ArticleTimelineSteps: Block = {
  slug: 'articleTimelineSteps',
  labels: { singular: 'Timeline Steps', plural: 'Timeline Steps' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Section Heading',
    },
    {
      name: 'steps',
      type: 'array',
      label: 'Steps',
      fields: [
        { name: 'stepName', type: 'text', label: 'Step Name' },
        { name: 'stepDescription', type: 'textarea', label: 'Step Description' },
      ],
    },
    {
      name: 'note',
      type: 'text',
      label: 'Note (optional footer note)',
    },
  ],
}

const ArticleSettlementTable: Block = {
  slug: 'articleSettlementTable',
  labels: { singular: 'Settlement Table', plural: 'Settlement Tables' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Section Heading',
    },
    {
      name: 'rows',
      type: 'array',
      label: 'Table Rows',
      fields: [
        { name: 'severity', type: 'text', label: 'Severity' },
        { name: 'description', type: 'text', label: 'Description' },
        { name: 'range', type: 'text', label: 'Illustrative Range' },
      ],
    },
    {
      name: 'footnote',
      type: 'text',
      label: 'Footnote',
    },
  ],
}

const ArticleProseContent: Block = {
  slug: 'articleProseContent',
  labels: { singular: 'Prose Content', plural: 'Prose Content' },
  fields: [
    {
      name: 'sections',
      type: 'array',
      label: 'Sections',
      fields: [
        { name: 'heading', type: 'text', label: 'Heading' },
        { name: 'body', type: 'textarea', label: 'Body' },
      ],
    },
  ],
}

const ArticleStatuteBars: Block = {
  slug: 'articleStatuteBars',
  labels: { singular: 'Statute Bars', plural: 'Statute Bars' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Section Heading',
    },
    {
      name: 'bars',
      type: 'array',
      label: 'Statute Bars',
      fields: [
        { name: 'deadline', type: 'text', label: 'Deadline Label' },
        { name: 'states', type: 'text', label: 'States' },
        { name: 'widthPercent', type: 'number', label: 'Width % (0-100)' },
      ],
    },
    {
      name: 'footnote',
      type: 'text',
      label: 'Footnote',
    },
  ],
}

const ArticleExpert: Block = {
  slug: 'articleExpert',
  labels: { singular: 'Expert Block', plural: 'Expert Blocks' },
  fields: [
    { name: 'quote', type: 'textarea', label: 'Expert Quote' },
    { name: 'reviewerName', type: 'text', label: 'Reviewer Name' },
    { name: 'credentials', type: 'text', label: 'Credentials' },
  ],
}

const ArticleCTA: Block = {
  slug: 'articleCTA',
  labels: { singular: 'CTA Band', plural: 'CTA Bands' },
  fields: [
    { name: 'title', type: 'text', label: 'CTA Title' },
    { name: 'subtitle', type: 'textarea', label: 'CTA Subtitle' },
    { name: 'buttonLabel', type: 'text', label: 'Button Label' },
    { name: 'buttonLink', type: 'text', label: 'Button Link', admin: { description: 'URL path the button links to (e.g. /checkmycase, /request-access).' } },
  ],
}

const ArticleTakeHome: Block = {
  slug: 'articleTakeHome',
  labels: { singular: 'Take Home Calculator', plural: 'Take Home Calculators' },
  fields: [],
}

// ─── Block Registry ────────────────────────────────────────────────────────────

export const GUIDEARTICLE_BLOCKS: Block[] = [
  ArticleDirectAnswer,
  ArticleKeyTakeaways,
  ArticleFAQ,
  ArticleRelatedGuides,
  ArticleSources,
  ArticleTimelineSteps,
  ArticleSettlementTable,
  ArticleProseContent,
  ArticleStatuteBars,
  ArticleExpert,
  ArticleCTA,
  ArticleTakeHome,
]
