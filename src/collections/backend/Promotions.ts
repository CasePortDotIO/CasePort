import type { CollectionConfig } from 'payload'
import { authenticated } from '../access'
import { PROMOTION_STATUSES, PROMOTION_TYPES } from '@/lib/domain/intelligenceCore'

/**
 * Promotions. The human promotion gate and its log (INTELLIGENCE_CORE.md Phase F,
 * Section 7, Section 10 `promotionLog`, H1).
 *
 * Every proposed change to a production value is recorded here with its evidence
 * and its approvals. No production value changes without a logged human approval;
 * a market action requires two approvers (decision D8). The approvals array is
 * the append only log of who approved, and when. Internal only. No delete, so the
 * audit trail of every promotion and rejection is permanent.
 */
export const Promotions: CollectionConfig = {
  slug: 'promotions',
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: () => false,
  },
  admin: {
    group: 'Intelligence Core',
    useAsTitle: 'summary',
    defaultColumns: ['type', 'summary', 'status', 'requiredApprovers', 'createdAt'],
    description: 'The human promotion gate for every production change. The CIC proposes; humans promote (H1).',
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      index: true,
      options: PROMOTION_TYPES.map((t) => ({ label: t.label, value: t.value })),
    },
    { name: 'summary', type: 'textarea', required: true },
    { name: 'proposedChange', type: 'json', admin: { description: 'The concrete production change proposed.' } },
    { name: 'evidence', type: 'json', admin: { description: 'What justifies it: source signals, a recommendation, the data window.' } },
    { name: 'proposedBy', type: 'text' },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      index: true,
      options: PROMOTION_STATUSES.map((s) => ({ label: s.label, value: s.value })),
    },
    { name: 'requiredApprovers', type: 'number', required: true },
    {
      name: 'approvals',
      type: 'array',
      admin: { description: 'The append only log of human approvals (approver and timestamp).' },
      fields: [
        { name: 'approver', type: 'text' },
        { name: 'at', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
      ],
    },
    { name: 'versionId', type: 'text', admin: { description: 'The model version this promotion produced, once promoted.' } },
    { name: 'rejectionReason', type: 'text' },
    { name: 'createdAt', type: 'date', required: true, admin: { date: { pickerAppearance: 'dayAndTime' } } },
    { name: 'decidedAt', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
  ],
  timestamps: true,
}
