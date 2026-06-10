import type { Block } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { noForbiddenClaimantLanguage } from '@/lib/forbiddenLanguage'

const role = (r: string, text: string) => `[${r.toUpperCase()}] ${text}`

// ─── Guide Article Block Library ────────────────────────────────────────────────

// ── B2C Content Blocks ────────────────────────────────────────────────────────

const Standfirst: Block = {
  slug: 'standfirst',
  labels: { singular: 'Standfirst', plural: 'Standfirsts' },
  fields: [
    {
      name: 'text',
      type: 'textarea',
      required: true,
      validate: noForbiddenClaimantLanguage,
      admin: { description: role('str', 'Lede. Place the focus keyword in the first 300 characters.') },
    },
  ],
}

const DirectAnswer: Block = {
  slug: 'directAnswer',
  labels: { singular: 'Direct Answer', plural: 'Direct Answers' },
  fields: [
    {
      name: 'text',
      type: 'richText',
      required: true,
      editor: lexicalEditor(),
      admin: { description: role('aeo', '40 to 55 words. Snippet, AI Overview, speakable.') },
    },
    { name: 'speakable', type: 'checkbox', defaultValue: true },
  ],
}

const QuickActionPlan: Block = {
  slug: 'quickActionPlan',
  labels: { singular: 'Quick Action Plan', plural: 'Quick Action Plans' },
  fields: [
    {
      name: 'items',
      type: 'array',
      minRows: 3,
      fields: [
        { name: 'phase', type: 'text' },
        { name: 'timeWindow', type: 'text' },
        { name: 'text', type: 'textarea', validate: noForbiddenClaimantLanguage },
      ],
      admin: { description: role('aeo', 'Timed TL;DR. List snippet + felt utility.') },
    },
  ],
}

const KeyTakeaways: Block = {
  slug: 'keyTakeaways',
  labels: { singular: 'Key Takeaways', plural: 'Key Takeaways' },
  fields: [
    {
      name: 'items',
      type: 'array',
      minRows: 3,
      maxRows: 3,
      fields: [
        { name: 'item', type: 'textarea', validate: noForbiddenClaimantLanguage },
      ],
      admin: { description: role('aeo', 'Exactly 3 for educational pages.') },
    },
  ],
}

const StepChecklist: Block = {
  slug: 'stepChecklist',
  labels: { singular: 'Step Checklist', plural: 'Step Checklists' },
  fields: [
    { name: 'intro', type: 'textarea', validate: noForbiddenClaimantLanguage },
    {
      name: 'steps',
      type: 'array',
      fields: [
        { name: 'name', type: 'text' },
        { name: 'timeWindow', type: 'text' },
        { name: 'bullets', type: 'array', fields: [{ name: 'b', type: 'text' }] },
      ],
      admin: { description: role('aeo', 'Emits HowTo. The "give them the script" utility.') },
    },
  ],
}

const CitationFact: Block = {
  slug: 'citationFact',
  labels: { singular: 'Citation Fact', plural: 'Citation Facts' },
  fields: [
    {
      name: 'facts',
      type: 'array',
      fields: [
        { name: 'fact', type: 'textarea', required: true },
        { name: 'source', type: 'text', required: true },
        { name: 'sourceUrl', type: 'text' },
      ],
      admin: { description: role('geo', 'Subject-named, sourced. The LLM-lift weapon. Render in stable elements.') },
    },
  ],
}

const StatCallout: Block = {
  slug: 'statCallout',
  labels: { singular: 'Stat Callout', plural: 'Stat Callouts' },
  fields: [
    { name: 'value', type: 'text', required: true },
    { name: 'label', type: 'text' },
    { name: 'source', type: 'text', required: true },
    { name: 'sourceUrl', type: 'text' },
  ],
}

const Comparison: Block = {
  slug: 'comparison',
  labels: { singular: 'Comparison', plural: 'Comparisons' },
  fields: [
    {
      name: 'points',
      type: 'array',
      fields: [
        { name: 'stat', type: 'textarea', required: true },
        { name: 'source', type: 'text', required: true },
        { name: 'sourceUrl', type: 'text' },
      ],
      admin: { description: role('aeo', 'Sourced rows only. Table snippet + decision aid.') },
    },
  ],
}

const SettlementRange: Block = {
  slug: 'settlementRange',
  labels: { singular: 'Settlement Range', plural: 'Settlement Ranges' },
  fields: [
    { name: 'isIllustrative', type: 'checkbox', defaultValue: true },
    { name: 'methodologyNote', type: 'textarea', required: true },
    {
      name: 'settlements',
      type: 'array',
      fields: [
        { name: 'severityTier', type: 'text' },
        { name: 'lowLabel', type: 'text' },
        { name: 'highLabel', type: 'text' },
      ],
    },
  ],
}

const CaseScenario: Block = {
  slug: 'caseScenario',
  labels: { singular: 'Case Scenario', plural: 'Case Scenarios' },
  fields: [
    { name: 'isIllustrative', type: 'checkbox', defaultValue: true },
    { name: 'methodologyNote', type: 'textarea', required: true },
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'injuryType', type: 'text' },
        { name: 'illustrativeRange', type: 'text' },
        { name: 'note', type: 'text' },
      ],
    },
  ],
}

const StatuteCard: Block = {
  slug: 'statuteCard',
  labels: { singular: 'Statute Card', plural: 'Statute Cards' },
  fields: [
    {
      name: 'statutes',
      type: 'array',
      fields: [
        { name: 'state', type: 'text' },
        { name: 'statuteName', type: 'text' },
        { name: 'statuteText', type: 'textarea' },
        { name: 'statuteUrl', type: 'text' },
      ],
      admin: { description: role('conv', 'State-driven. Renders safe fallback when a row is unverified.') },
    },
  ],
}

const FAQAccordion: Block = {
  slug: 'faqAccordion',
  labels: { singular: 'FAQ Accordion', plural: 'FAQ Accordions' },
  fields: [
    {
      name: 'faqs',
      type: 'array',
      fields: [
        { name: 'question', type: 'text' },
        { name: 'answer', type: 'textarea' },
      ],
      admin: { description: role('aeo', 'Emits FAQPage.') },
    },
  ],
}

const PeopleAlsoAsk: Block = {
  slug: 'peopleAlsoAsk',
  labels: { singular: 'People Also Ask', plural: 'People Also Ask' },
  fields: [
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'q', type: 'text' },
        { name: 'a', type: 'textarea', validate: noForbiddenClaimantLanguage },
      ],
    },
  ],
}

const Definition: Block = {
  slug: 'definition',
  labels: { singular: 'Definition', plural: 'Definitions' },
  fields: [
    {
      name: 'term',
      type: 'text',
      required: true,
      admin: { description: role('geo', 'Emits DefinedTerm.') },
    },
    { name: 'definition', type: 'textarea', required: true },
  ],
}

const ProtectionPlan: Block = {
  slug: 'protectionPlan',
  labels: { singular: 'Protection Plan', plural: 'Protection Plans' },
  fields: [
    {
      name: 'steps',
      type: 'array',
      fields: [
        { name: 'step', type: 'textarea', validate: noForbiddenClaimantLanguage },
      ],
      admin: { description: role('conv', 'Next steps and scripts. Reciprocity + habit hook.') },
    },
  ],
}

const CTA: Block = {
  slug: 'cta',
  labels: { singular: 'CTA', plural: 'CTAs' },
  fields: [
    { name: 'heading', type: 'textarea', validate: noForbiddenClaimantLanguage },
    { name: 'subcopy', type: 'textarea', validate: noForbiddenClaimantLanguage },
    { name: 'buttonLabel', type: 'text', validate: noForbiddenClaimantLanguage },
    {
      name: 'siteLink',
      type: 'relationship',
      relationTo: 'siteLinks',
      admin: { description: 'Select which page this CTA button links to' },
    },
  ],
}

const AuthorReviewer: Block = {
  slug: 'authorReviewer',
  labels: { singular: 'Author & Reviewer', plural: 'Author & Reviewer' },
  fields: [
    {
      name: 'show',
      type: 'checkbox',
      defaultValue: true,
      admin: { description: role('str', 'Renders the byline from E-E-A-T fields. Badge only with a real barred attorney.') },
    },
  ],
}

const UpdateLog: Block = {
  slug: 'updateLog',
  labels: { singular: 'Update Log', plural: 'Update Logs' },
  fields: [
    {
      name: 'entries',
      type: 'array',
      fields: [
        { name: 'date', type: 'date' },
        { name: 'description', type: 'text' },
      ],
    },
  ],
}

const Disclaimer: Block = {
  slug: 'disclaimer',
  labels: { singular: 'Disclaimer', plural: 'Disclaimers' },
  fields: [
    {
      name: 'note',
      type: 'textarea',
      admin: {
        readOnly: true,
        description: role('comp', 'Non-recommendation. Inherits the Disclosures global. Gate-locked on claimant pages.'),
      },
    },
  ],
}

const EntityContext: Block = {
  slug: 'entityContext',
  labels: { singular: 'Entity Context', plural: 'Entity Contexts' },
  fields: [
    {
      name: 'entities',
      type: 'array',
      fields: [
        { name: 'name', type: 'text' },
        { name: 'sameAs', type: 'text' },
      ],
      admin: { description: role('geo', 'about / mentions + sameAs.') },
    },
  ],
}

const LegalAuthority: Block = {
  slug: 'legalAuthority',
  labels: { singular: 'Legal Authority', plural: 'Legal Authorities' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Legal Authority & Citations',
      admin: { description: role('str', 'Section heading.') },
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'sourceName', type: 'text', required: true, label: 'Source Name' },
        { name: 'url', type: 'text', label: 'Source URL (optional)' },
        { name: 'description', type: 'text', label: 'Regulations / Description' },
      ],
    },
  ],
}

const ExpertQuote: Block = {
  slug: 'expertQuote',
  labels: { singular: 'Expert Quote', plural: 'Expert Quotes' },
  fields: [
    { name: 'quote', type: 'textarea', validate: noForbiddenClaimantLanguage },
    { name: 'speakerName', type: 'text' },
    { name: 'credentials', type: 'text' },
    { name: 'photo', type: 'upload', relationTo: 'media' },
  ],
}

const TermDefinitionBlock: Block = {
  slug: 'termDefinition',
  labels: { singular: 'Term Definition', plural: 'Term Definitions' },
  fields: [
    {
      name: 'terms',
      type: 'array',
      fields: [
        { name: 'term', type: 'text', required: true, label: 'Term' },
        { name: 'definition', type: 'textarea', required: true, label: 'Definition' },
      ],
    },
    { name: 'isProprietary', type: 'checkbox', label: 'Is Proprietary' },
  ],
}

const RelatedGuideArticle: Block = {
  slug: 'relatedGuideArticle',
  labels: { singular: 'Related Guide Article', plural: 'Related Guide Articles' },
  fields: [
    {
      name: 'articles',
      type: 'array',
      minRows: 1,
      maxRows: 10,
      fields: [
        {
          name: 'article',
          type: 'relationship',
          relationTo: 'guideArticles',
          required: true,
        },
      ],
      admin: { description: 'Add one or more guide articles to link' },
    },
    { name: 'headline', type: 'text', label: 'Override Headline (optional)' },
    { name: 'metaDescription', type: 'text', label: 'Meta Description (optional)' },
  ],
}

const RelatedGuideCategory: Block = {
  slug: 'relatedGuideCategory',
  labels: { singular: 'Related Guide Category', plural: 'Related Guide Categories' },
  fields: [
    {
      name: 'categories',
      type: 'array',
      minRows: 1,
      maxRows: 10,
      fields: [
        {
          name: 'category',
          type: 'relationship',
          relationTo: 'guideCategories',
          required: true,
        },
      ],
      admin: { description: 'Add one or more guide categories to link' },
    },
    { name: 'headline', type: 'text', label: 'Override Headline (optional)' },
    { name: 'metaDescription', type: 'text', label: 'Meta Description (optional)' },
  ],
}

const RichText: Block = {
  slug: 'richText',
  labels: { singular: 'Rich Text', plural: 'Rich Text' },
  fields: [
    {
      name: 'content',
      type: 'richText',
      defaultValue: {
        root: {
          children: [{ type: 'paragraph', children: [{ type: 'text', text: '' }] }],
        },
      },
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [...defaultFeatures],
      }),
    },
  ],
}

// ── B2B / B2C Guide-Specific Blocks ────────────────────────────────────────────

/**
 * Immediate Actions Block — "The 72-Hour Action Plan"
 * Steps for what an injured person should do in the first 24-72 hours
 */
const ImmediateActionsBlock: Block = {
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
const MedicalDocumentationBlock: Block = {
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
const AttorneyComparisonBlock: Block = {
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
const SettlementExampleBlock: Block = {
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
const SettlementRangesBlock: Block = {
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
const StatuteLimitationsBlock: Block = {
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
const CriticalMistakesBlock: Block = {
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
const EndCtaSectionBlock: Block = {
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
  // B2C Content Blocks
  Standfirst,
  DirectAnswer,
  QuickActionPlan,
  KeyTakeaways,
  StepChecklist,
  CitationFact,
  StatCallout,
  Comparison,
  SettlementRange,
  CaseScenario,
  StatuteCard,
  FAQAccordion,
  PeopleAlsoAsk,
  Definition,
  ProtectionPlan,
  CTA,
  AuthorReviewer,
  UpdateLog,
  Disclaimer,
  EntityContext,
  LegalAuthority,
  ExpertQuote,
  TermDefinitionBlock,
  RelatedGuideArticle,
  RelatedGuideCategory,
  RichText,
  // B2B/B2C Guide-Specific Blocks
  ImmediateActionsBlock,
  MedicalDocumentationBlock,
  AttorneyComparisonBlock,
  SettlementExampleBlock,
  SettlementRangesBlock,
  StatuteLimitationsBlock,
  CriticalMistakesBlock,
  EndCtaSectionBlock,
]