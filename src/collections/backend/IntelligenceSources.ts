import type { CollectionConfig } from 'payload'
import { authenticated } from '../access'
import {
  INTELLIGENCE_DOMAINS,
  RELIABILITY_RATINGS,
  SIGNAL_ORIGINS,
  SOURCE_STATUSES,
} from '@/lib/domain/intelligenceCore'

/**
 * IntelligenceSources. The CasePort Intelligence Core source registry
 * (INTELLIGENCE_CORE.md Section 5, Section 10 `intelligenceSources`).
 *
 * Every approved source with its reliability rating, domain tags, and last
 * checked timestamp. New sources are added through human review, never
 * auto-trusted (H5). This registry is the allowlist: the epistemic gate in
 * IntelligenceCoreService will not ingest a signal from a source that is not
 * recorded here and active. A prohibited source is recorded so the decision is
 * auditable, but it can never ingest.
 *
 * Internal only (H6). Lives in the system of intelligence and is recomputable
 * (H4): no delete, so the trust history is preserved.
 */
export const IntelligenceSources: CollectionConfig = {
  slug: 'intelligence-sources',
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: () => false,
  },
  admin: {
    group: 'Intelligence Core',
    useAsTitle: 'name',
    defaultColumns: ['sourceKey', 'name', 'origin', 'reliability', 'status', 'lastCheckedAt'],
    description:
      'Approved intelligence sources with reliability ratings. The ingestion allowlist. Added through human review, never auto-trusted.',
  },
  fields: [
    {
      name: 'sourceKey',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'Stable ingestion handle, for example semrush-mcp or va-bar-ethics.' },
    },
    { name: 'name', type: 'text', required: true },
    {
      name: 'origin',
      type: 'select',
      required: true,
      options: SIGNAL_ORIGINS.map((o) => ({ label: o.label, value: o.value })),
      admin: { description: 'Owned first party data, or rented external intelligence.' },
    },
    {
      name: 'reliability',
      type: 'select',
      required: true,
      options: RELIABILITY_RATINGS.map((r) => ({ label: r.label, value: r.value })),
      admin: { description: 'A primary or institutional, B industry research, C synthesized or estimated.' },
    },
    {
      name: 'domains',
      type: 'select',
      hasMany: true,
      required: true,
      options: INTELLIGENCE_DOMAINS.map((d) => ({ label: d.label, value: d.value })),
      admin: { description: 'The intelligence domains this source feeds.' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'active',
      options: SOURCE_STATUSES.map((s) => ({ label: s.label, value: s.value })),
      admin: { description: 'Only an active source can pass the ingestion gate.' },
    },
    {
      name: 'addedBy',
      type: 'text',
      required: true,
      admin: { description: 'The human who reviewed and approved this source. Never a system actor.' },
    },
    { name: 'notes', type: 'textarea' },
    {
      name: 'registeredAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date(),
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'lastCheckedAt',
      type: 'date',
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
        description: 'When the source was last polled. Updated on ingestion; does not change trust.',
      },
    },
  ],
  timestamps: true,
}
