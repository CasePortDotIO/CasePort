import type { Block, CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { noForbiddenClaimantLanguage, wordCountInRange } from '@/lib/forbiddenLanguage'

const role = (r: string, text: string) => `[${r.toUpperCase()}] ${text}`;

// ─── B2C Block Library (from client reference) ─────────────────────────────────

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

const RelatedGuides: Block = {
  slug: 'relatedGuides',
  labels: { singular: 'Related Guides', plural: 'Related Guides' },
  fields: [
    {
      name: 'guides',
      type: 'array',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'slug', type: 'text' },
        { name: 'headline', type: 'text' },
        { name: 'metaDescription', type: 'text' },
      ],
      admin: { description: role('str', 'Internal-link authority hub + continued engagement.') },
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
    { name: 'term', type: 'text', required: true },
    { name: 'definition', type: 'textarea', required: true },
    { name: 'isProprietary', type: 'checkbox', label: 'Is Proprietary' },
  ],
}

const RelatedArticleLink: Block = {
  slug: 'relatedArticleLink',
  labels: { singular: 'Related Article Link', plural: 'Related Article Links' },
  fields: [
    { name: 'article', type: 'relationship', relationTo: 'articles' },
    { name: 'headline', type: 'text', label: 'Override Headline (optional)' },
    { name: 'metaDescription', type: 'text', label: 'Meta Description (optional)' },
  ],
}

/**
 * RichText Block — Payload Lexical editor for freeform content.
 * Add only when no other block fits your content.
 * No ABA compliance validation on this field (editors choose when to use it).
 */
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

export const B2C_BLOCKS: Block[] = [
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
  RelatedGuides,
  AuthorReviewer,
  UpdateLog,
  Disclaimer,
  EntityContext,
  ExpertQuote,
  TermDefinitionBlock,
  RelatedArticleLink,
  RichText,
]

// ─── Testing Collection ────────────────────────────────────────────────────────

export const TestGuideBlocks: CollectionConfig = {
  slug: 'test-guide-blocks',
  labels: {
    singular: 'Test Guide Block',
    plural: 'Test Guide Blocks',
  },
  admin: {
    description:
      'Testing ground for Payload blocks architecture. Uses the client reference block library — completely separate from the Lexical editor system.',
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: { description: 'Internal title for this test entry' },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      admin: { description: 'URL slug for testing' },
    },
    {
      name: 'body',
      type: 'blocks',
      blocks: B2C_BLOCKS,
    },
  ],
}
