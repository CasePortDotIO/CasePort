import type { CollectionConfig } from 'payload'
import { authenticated } from '../access'
import { INTELLIGENCE_DOMAINS } from '@/lib/domain/intelligenceCore'

/**
 * Recommendations. CIC proposals in CasePort's own numbers (INTELLIGENCE_CORE.md
 * Section 9, Section 10 `recommendations`).
 *
 * Every recommendation records its action, expected value, rationale, and the
 * source signals it rests on, with a status of proposed, approved, rejected, or
 * executed. The CIC proposes; a human promotes (H1). A recommendation that would
 * make routing smart or make pricing scale with outcome is rejected by the
 * compliance guard before it can be proposed (H2, H3). Internal only. No delete,
 * so the proposal trail and its approvals stay auditable.
 */
export const Recommendations: CollectionConfig = {
  slug: 'recommendations',
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: () => false,
  },
  admin: {
    group: 'Intelligence Core',
    useAsTitle: 'action',
    defaultColumns: ['domain', 'action', 'expectedValue', 'status', 'createdAt'],
    description: 'CIC recommendations. Proposed by the engine, promoted only by a human. Never outcome scaled pricing or smart routing.',
  },
  fields: [
    {
      name: 'domain',
      type: 'select',
      required: true,
      index: true,
      options: INTELLIGENCE_DOMAINS.map((d) => ({ label: d.label, value: d.value })),
    },
    { name: 'action', type: 'textarea', required: true },
    { name: 'expectedValue', type: 'text' },
    { name: 'rationale', type: 'textarea' },
    { name: 'sourceSignalIds', type: 'json', admin: { description: 'The signals this recommendation rests on.' } },
    {
      name: 'status',
      type: 'select',
      required: true,
      index: true,
      options: [
        { label: 'Proposed', value: 'proposed' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
        { label: 'Executed', value: 'executed' },
      ],
    },
    {
      name: 'rejectionReason',
      type: 'text',
      admin: { description: 'Set when the compliance guard rejected the proposal (H2, H3).' },
    },
    { name: 'createdAt', type: 'date', required: true, admin: { date: { pickerAppearance: 'dayAndTime' } } },
  ],
  timestamps: true,
}
