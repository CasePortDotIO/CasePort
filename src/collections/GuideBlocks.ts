import type { Block } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

// ─── Guide Article Block Library ────────────────────────────────────────────────

const role = (r: string, text: string) => `[${r.toUpperCase()}] ${text}`

/**
 * Immediate Actions Block — "The 72-Hour Action Plan"
 * Steps for what an injured person should do in the first 24-72 hours
 */
export const ImmediateActionsBlock: Block = {
  slug: 'immediateActions',
  labels: { singular: 'Immediate Actions', plural: 'Immediate Actions' },
  fields: [
    { name: 'title', type: 'text', defaultValue: 'Your First 72-Hour Checklist' },
    { name: 'subtitle', type: 'text' },
    {
      name: 'steps',
      type: 'array',
      fields: [
        { name: 'step', type: 'number', required: true },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
        { name: 'timeNote', type: 'text', label: 'Time Note', admin: { description: 'e.g., "Within 24 hours"' } },
        {
          name: 'bullets',
          type: 'array',
          fields: [{ name: 'bullet', type: 'text' }],
          admin: { description: 'Checklist items under this step' },
        },
      ],
      admin: { description: role('aeo', 'Emits HowTo. Steps with actionable checklist items.') },
    },
  ],
}

/**
 * Medical Documentation Block — Medical records and documentation guidance
 */
export const MedicalDocumentationBlock: Block = {
  slug: 'medicalDocumentation',
  labels: { singular: 'Medical Documentation', plural: 'Medical Documentation' },
  fields: [
    {
      name: 'introText',
      type: 'textarea',
      label: 'Introduction Text',
      admin: { description: 'Context about why medical documentation matters' },
    },
    {
      name: 'calloutText',
      type: 'textarea',
      label: 'Callout Text',
      admin: { description: 'Important highlighted message' },
    },
    {
      name: 'alertLevel',
      type: 'select',
      defaultValue: 'info',
      options: [
        { label: 'ℹ️ Info', value: 'info' },
        { label: '⚠️ Warning', value: 'warning' },
        { label: '🚨 Critical', value: 'critical' },
      ],
      admin: { description: 'Visual styling for the callout' },
    },
  ],
}

/**
 * Attorney Comparison Block — With vs Without Attorney comparison
 */
export const AttorneyComparisonBlock: Block = {
  slug: 'attorneyComparison',
  labels: { singular: 'Attorney Comparison', plural: 'Attorney Comparisons' },
  fields: [
    { name: 'title', type: 'text', defaultValue: 'With an Attorney vs. Without' },
    { name: 'subtitle', type: 'text' },
    {
      name: 'rows',
      type: 'array',
      fields: [
        { name: 'factor', type: 'text', required: true, label: 'Factor' },
        { name: 'withAttorney', type: 'textarea', label: 'Result With Attorney' },
        { name: 'withoutAttorney', type: 'textarea', label: 'Result Without Attorney' },
      ],
      admin: { description: role('aeo', 'Sourced comparison rows. Table snippet + decision aid.') },
    },
    { name: 'summaryEnabled', type: 'checkbox', defaultValue: true, label: 'Show Summary Section' },
  ],
}

/**
 * Settlement Example Block — Real case settlement examples
 */
export const SettlementExampleBlock: Block = {
  slug: 'settlementExample',
  labels: { singular: 'Settlement Example', plural: 'Settlement Examples' },
  fields: [
    { name: 'title', type: 'text', defaultValue: 'Real Settlement Examples' },
    {
      name: 'examples',
      type: 'array',
      fields: [
        { name: 'settlement', type: 'text', label: 'Case Name' },
        { name: 'settlementValue', type: 'text', label: 'Settlement Value' },
        { name: 'injuryType', type: 'text' },
        { name: 'caseType', type: 'text' },
        { name: 'caseResolutionTime', type: 'text', label: 'Resolution Time' },
        { name: 'quote', type: 'textarea' },
        { name: 'name', type: 'text', label: 'Client Name/Initials' },
        { name: 'location', type: 'text' },
      ],
      admin: { description: role('aeo', 'Illustrative case scenarios, not actual outcomes.') },
    },
  ],
}

/**
 * Settlement Ranges Block — Settlement ranges by injury type or state
 */
export const SettlementRangesBlock: Block = {
  slug: 'settlementRanges',
  labels: { singular: 'Settlement Ranges', plural: 'Settlement Ranges' },
  fields: [
    { name: 'title', type: 'text', defaultValue: 'Settlement Ranges' },
    {
      name: 'ranges',
      type: 'array',
      label: 'State Ranges',
      admin: { description: 'Add one row per state. Users see a clean table, not JSON.' },
      fields: [
        { name: 'state', type: 'text', required: true, label: 'State' },
        { name: 'min', type: 'text', label: 'Minimum' },
        { name: 'max', type: 'text', label: 'Maximum' },
        { name: 'avg', type: 'text', label: 'Average' },
        { name: 'note', type: 'text', label: 'Note (optional)' },
      ],
    },
    { name: 'showCatastrophic', type: 'checkbox', defaultValue: true, label: 'Show Catastrophic Injuries Section' },
  ],
}

/**
 * Statute of Limitations Block — Deadlines for filing a claim by state
 */
export const StatuteLimitationsBlock: Block = {
  slug: 'statuteLimitations',
  labels: { singular: 'Statute of Limitations', plural: 'Statutes of Limitations' },
  fields: [
    { name: 'title', type: 'text', defaultValue: 'Statute of Limitations' },
    { name: 'description', type: 'textarea', label: 'Description' },
    { name: 'defaultYears', type: 'number', label: 'Default Years Limit' },
    {
      name: 'states',
      type: 'array',
      fields: [
        { name: 'state', type: 'text', required: true },
        { name: 'years', type: 'number' },
        { name: 'notes', type: 'text' },
      ],
      admin: { description: 'State-specific deadlines and exceptions' },
    },
    {
      name: 'exceptions',
      type: 'array',
      fields: [{ name: 'exception', type: 'text' }],
      admin: { description: 'Common exceptions to the statute of limitations' },
    },
  ],
}

/**
 * Critical Mistakes Block — "What NOT to Do" section
 * Critical mistakes that can destroy a personal injury case
 */
export const CriticalMistakesBlock: Block = {
  slug: 'criticalMistakes',
  labels: { singular: 'Critical Mistakes', plural: 'Critical Mistakes' },
  fields: [
    {
      name: 'mistakes',
      type: 'array',
      fields: [
        { name: 'mistake', type: 'text', required: true, label: 'Mistake' },
        { name: 'reason', type: 'textarea', label: 'Why It Matters' },
      ],
      admin: { description: 'Add one row per critical mistake to avoid' },
    },
  ],
}

/**
 * End CTA Section Block — Final call-to-action section at end of article
 */
export const EndCtaSectionBlock: Block = {
  slug: 'endCtaSection',
  labels: { singular: 'End CTA Section', plural: 'End CTA Sections' },
  fields: [
    { name: 'heading', type: 'text', defaultValue: "You've Done Everything Right" },
    { name: 'subcopy', type: 'textarea', defaultValue: 'Now let an attorney protect your rights. Get a free consultation with no obligation.' },
    { name: 'buttonLabel', type: 'text', defaultValue: 'Call Now: 1-800-227-3669' },
    { name: 'phoneNumber', type: 'text', defaultValue: '+18002273669' },
    {
      name: 'siteLink',
      type: 'relationship',
      relationTo: 'siteLinks',
      admin: { description: 'Select which page this CTA button links to' },
    },
  ],
}

// ─── Block Registry ────────────────────────────────────────────────────────────

export const GUIDE_BLOCKS: Block[] = [
  ImmediateActionsBlock,
  MedicalDocumentationBlock,
  AttorneyComparisonBlock,
  SettlementExampleBlock,
  SettlementRangesBlock,
  StatuteLimitationsBlock,
  CriticalMistakesBlock,
  EndCtaSectionBlock,
]
