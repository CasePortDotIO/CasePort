import type { CollectionConfig } from 'payload'
import { authenticated } from '../access'
import { INTELLIGENCE_DOMAINS, RELIABILITY_RATINGS } from '@/lib/domain/intelligenceCore'

/**
 * IntelligenceArtifacts. Synthesized per domain briefs (INTELLIGENCE_CORE.md
 * Section 10 `intelligenceArtifacts`).
 *
 * Each artifact is a ranked, sourced brief for one intelligence domain. Every
 * finding is traceable to the signal behind it and is marked either asserted
 * (backed by a sufficiently reliable active signal) or needs-verification
 * (surfaced but never asserted as fact, pending a human, H5). Derived and
 * recomputable (H4); internal only (H6). No delete.
 */
export const IntelligenceArtifacts: CollectionConfig = {
  slug: 'intelligence-artifacts',
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: () => false,
  },
  admin: {
    group: 'Intelligence Core',
    useAsTitle: 'title',
    defaultColumns: ['domain', 'title', 'generatedAt'],
    description: 'Synthesized per domain briefs. Ranked and sourced; nothing unverified is asserted as fact.',
  },
  fields: [
    {
      name: 'domain',
      type: 'select',
      required: true,
      index: true,
      options: INTELLIGENCE_DOMAINS.map((d) => ({ label: d.label, value: d.value })),
    },
    { name: 'title', type: 'text', required: true },
    { name: 'summary', type: 'textarea', required: true },
    {
      name: 'findings',
      type: 'array',
      fields: [
        { name: 'claim', type: 'textarea', required: true },
        { name: 'signalId', type: 'text' },
        { name: 'sourceKey', type: 'text' },
        {
          name: 'reliability',
          type: 'select',
          options: RELIABILITY_RATINGS.map((r) => ({ label: r.label, value: r.value })),
        },
        { name: 'rank', type: 'number' },
        {
          name: 'status',
          type: 'select',
          options: [
            { label: 'Asserted', value: 'asserted' },
            { label: 'Needs Verification', value: 'needs-verification' },
          ],
        },
      ],
    },
    { name: 'generatedAt', type: 'date', required: true, admin: { date: { pickerAppearance: 'dayAndTime' } } },
  ],
  timestamps: true,
}
