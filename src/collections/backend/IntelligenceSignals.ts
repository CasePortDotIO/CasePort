import type { CollectionConfig } from 'payload'
import { authenticated } from '../access'
import {
  INTELLIGENCE_DOMAINS,
  RELIABILITY_RATINGS,
  SIGNAL_ORIGINS,
  SIGNAL_STATUSES,
} from '@/lib/domain/intelligenceCore'

/**
 * IntelligenceSignals. The CasePort Intelligence Core signals store
 * (INTELLIGENCE_CORE.md Section 5, Section 10 `intelligenceSignals`).
 *
 * Every ingested signal is dated, source linked, domain tagged, deduplicated,
 * and supersession aware. Each carries its reliability rating (inherited from
 * the source; a signal never outranks its source) so no unverified figure is
 * ever presented as fact (H5). When a newer figure supersedes an old one, the
 * old is marked superseded, not deleted, preserving the audit trail.
 *
 * Internal only (H6). Derived and recomputable (H4): if this store were deleted
 * it could be rebuilt from the event log and the sources. No delete here.
 */
export const IntelligenceSignals: CollectionConfig = {
  slug: 'intelligence-signals',
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: () => false,
  },
  admin: {
    group: 'Intelligence Core',
    useAsTitle: 'claim',
    defaultColumns: ['dedupKey', 'domain', 'reliability', 'status', 'observedAt', 'ingestedAt'],
    description:
      'Ingested intelligence signals, dated, rated, deduplicated, and supersession aware. Never a source of truth for any fact.',
  },
  fields: [
    {
      name: 'source',
      type: 'relationship',
      relationTo: 'intelligence-sources',
      required: true,
      index: true,
      admin: { description: 'The allowlisted source this signal was ingested from.' },
    },
    { name: 'sourceKey', type: 'text', required: true, index: true },
    {
      name: 'origin',
      type: 'select',
      required: true,
      options: SIGNAL_ORIGINS.map((o) => ({ label: o.label, value: o.value })),
    },
    {
      name: 'reliability',
      type: 'select',
      required: true,
      options: RELIABILITY_RATINGS.map((r) => ({ label: r.label, value: r.value })),
      admin: { description: 'Inherited from the source. A signal never outranks its source.' },
    },
    {
      name: 'domain',
      type: 'select',
      required: true,
      index: true,
      options: INTELLIGENCE_DOMAINS.map((d) => ({ label: d.label, value: d.value })),
    },
    {
      name: 'dedupKey',
      type: 'text',
      required: true,
      index: true,
      admin: { description: 'Identity of the claim: normalized claim plus metric plus geography.' },
    },
    { name: 'claim', type: 'textarea', required: true },
    {
      name: 'observedAt',
      type: 'date',
      required: true,
      index: true,
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
        description: 'The date the figure is true as of. Drives supersession.',
      },
    },
    {
      name: 'ingestedAt',
      type: 'date',
      required: true,
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      index: true,
      options: SIGNAL_STATUSES.map((s) => ({ label: s.label, value: s.value })),
    },
    { name: 'data', type: 'json', admin: { description: 'Structured metric, geography, value, units.' } },
    {
      name: 'attributionRef',
      type: 'text',
      admin: { description: 'Attribution tuple reference for owned signals. The join key across owned and rented.' },
    },
    {
      name: 'supersededBy',
      type: 'relationship',
      relationTo: 'intelligence-signals',
      admin: { description: 'Set when a newer figure supersedes this one, or on stale arrival.' },
    },
    {
      name: 'supersededAt',
      type: 'date',
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
  ],
  timestamps: true,
}
