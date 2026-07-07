import type { CollectionConfig } from 'payload'
import { authenticated } from '../access'

/**
 * Briefings. The fused CIC intelligence briefing (INTELLIGENCE_CORE.md Phase D,
 * Section 8, Section 10 `intelligenceArtifacts` fused).
 *
 * The lead synthesis agent fuses the per domain briefs and ranks recommendations
 * by expected value into one briefing, pushed to the principals through the
 * internal channels. Derived and recomputable; internal only (H6). No delete.
 */
export const Briefings: CollectionConfig = {
  slug: 'briefings',
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: () => false,
  },
  admin: {
    group: 'Intelligence Core',
    useAsTitle: 'title',
    defaultColumns: ['title', 'generatedAt'],
    description: 'The fused daily and weekly intelligence briefing, ranked in CasePort numbers. Internal only.',
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'summary', type: 'textarea' },
    {
      name: 'ranked',
      type: 'array',
      fields: [
        { name: 'recommendationId', type: 'text' },
        { name: 'domain', type: 'text' },
        { name: 'action', type: 'textarea' },
        { name: 'expectedValue', type: 'text' },
        { name: 'score', type: 'number' },
        { name: 'rank', type: 'number' },
      ],
    },
    {
      name: 'domainSummaries',
      type: 'array',
      fields: [
        { name: 'domain', type: 'text' },
        { name: 'summary', type: 'textarea' },
      ],
    },
    { name: 'deliveredChannels', type: 'json' },
    { name: 'generatedAt', type: 'date', required: true, admin: { date: { pickerAppearance: 'dayAndTime' } } },
  ],
  timestamps: true,
}
