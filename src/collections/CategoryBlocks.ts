import type { Block } from 'payload'

const role = (r: string, text: string) => `[${r.toUpperCase()}] ${text}`

// ─── Category Page Block Library ──────────────────────────────────────────────

const CategoryQuickAnswerStats: Block = {
  slug: 'categoryQuickAnswerStats',
  labels: { singular: 'Quick Answer Stats', plural: 'Quick Answer Stats' },
  fields: [
    { name: 'average', type: 'text', label: 'Average Settlement' },
    { name: 'successRate', type: 'text', label: 'Success Rate' },
    { name: 'timeline', type: 'text', label: 'Timeline' },
    { name: 'upfront', type: 'text', label: 'Upfront Cost' },
  ],
}

const CategoryCredibility: Block = {
  slug: 'categoryCredibility',
  labels: { singular: 'Credibility / Track Record', plural: 'Credibility / Track Record' },
  fields: [
    { name: 'recoveredAmount', type: 'text', label: 'Total Recovered (e.g. $1.8B+)' },
    { name: 'successRate', type: 'text', label: 'Success Rate %' },
    { name: 'casesWon', type: 'text', label: 'Cases Won (e.g. 4,500+)' },
    { name: 'avgSettlement', type: 'text', label: 'Avg Settlement' },
    { name: 'recoveryNote', type: 'text', label: 'Recovery Note (e.g. "5x more than going it alone")' },
  ],
}

const CategoryWhyImportant: Block = {
  slug: 'categoryWhyImportant',
  labels: { singular: 'Why This Matters', plural: 'Why This Matters' },
  fields: [
    {
      name: 'intro',
      type: 'textarea',
      label: 'Intro Text',
      admin: { description: role('str', 'Main body text for the Why This Matters section.') },
    },
    {
      name: 'points',
      type: 'array',
      label: 'Key Points',
      admin: { description: 'Left-bordered callout boxes below the intro.' },
      fields: [
        { name: 'heading', type: 'text', required: true, label: 'Point Heading' },
        { name: 'body', type: 'textarea', label: 'Point Body' },
      ],
    },
  ],
}

const CategoryTestimonials: Block = {
  slug: 'categoryTestimonials',
  labels: { singular: 'Client Testimonials', plural: 'Client Testimonials' },
  fields: [
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'name', type: 'text' },
        { name: 'location', type: 'text' },
        { name: 'settlement', type: 'text', label: 'Settlement / Award' },
        { name: 'quote', type: 'textarea' },
      ],
    },
  ],
}

const CategorySettlementBreakdown: Block = {
  slug: 'categorySettlementBreakdown',
  labels: { singular: 'Settlement Breakdown', plural: 'Settlement Breakdowns' },
  fields: [
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'injuryType', type: 'text' },
        { name: 'settlementAmount', type: 'text', label: 'Average Settlement' },
        { name: 'minAmount', type: 'text', label: 'Min Amount' },
        { name: 'maxAmount', type: 'text', label: 'Max Amount' },
        { name: 'recoveryTime', type: 'text', label: 'Recovery Time' },
      ],
    },
  ],
}

const CategoryAttorneyComparison: Block = {
  slug: 'categoryAttorneyComparison',
  labels: { singular: 'Attorney Comparison', plural: 'Attorney Comparisons' },
  fields: [
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', label: 'Factor / Label' },
        { name: 'withoutAttorney', type: 'textarea', label: 'Going It Alone' },
        { name: 'withAttorney', type: 'textarea', label: 'With Legal Representation' },
      ],
    },
  ],
}

const CategoryStatuteDeadlines: Block = {
  slug: 'categoryStatuteDeadlines',
  labels: { singular: 'Statute of Limitations', plural: 'Statutes of Limitations' },
  fields: [
    { name: 'description', type: 'textarea', label: 'Section Description' },
    {
      name: 'byState',
      type: 'array',
      label: 'Deadline by State',
      fields: [
        { name: 'state', type: 'text', required: true },
        { name: 'years', type: 'number', label: 'Years' },
        { name: 'notes', type: 'text', label: 'Notes' },
      ],
    },
  ],
}

const CategoryFAQ: Block = {
  slug: 'categoryFAQ',
  labels: { singular: 'FAQ Accordion', plural: 'FAQ Accordions' },
  fields: [
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
      ],
    },
  ],
}

const CategoryPeopleAlsoAsk: Block = {
  slug: 'categoryPeopleAlsoAsk',
  labels: { singular: 'People Also Ask', plural: 'People Also Ask' },
  fields: [
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
      ],
    },
  ],
}

// ─── Block Registry ────────────────────────────────────────────────────────────

export const CATEGORY_BLOCKS: Block[] = [
  CategoryQuickAnswerStats,
  CategoryCredibility,
  CategoryWhyImportant,
  CategoryTestimonials,
  CategorySettlementBreakdown,
  CategoryAttorneyComparison,
  CategoryStatuteDeadlines,
  CategoryFAQ,
  CategoryPeopleAlsoAsk,
]