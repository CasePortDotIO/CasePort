import type { CollectionConfig } from 'payload'
import { authenticated } from '../access'
import { NOT_RETAINED_REASONS } from '@/lib/domain/constants'

/**
 * Outcomes. Firm reported signed, declined, settled, and value (Section 5,
 * Section 7). Feeds intelligence only. Never billing (W4).
 *
 * Outcome data flows one direction: into SCPS recalibration and per market
 * intelligence. It never touches the fee. The fee was already fixed and
 * charged on delivery, regardless of outcome (W3, W4).
 */
export const Outcomes: CollectionConfig = {
  slug: 'outcomes',
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: () => false,
  },
  admin: {
    group: 'Case Pipeline',
    useAsTitle: 'id',
    defaultColumns: ['delivery', 'firm', 'result', 'reportedAt'],
    description: 'Firm reported outcome. Feeds intelligence only, never billing (W4).',
  },
  fields: [
    { name: 'delivery', type: 'relationship', relationTo: 'deliveries', required: true, index: true },
    { name: 'firm', type: 'relationship', relationTo: 'firms', required: true, index: true },
    {
      name: 'result',
      type: 'select',
      required: true,
      options: [
        { label: 'Retained', value: 'retained' },
        { label: 'Not Retained', value: 'not-retained' },
        { label: 'Still Evaluating', value: 'still-evaluating' },
        { label: 'Settled', value: 'settled' },
      ],
    },
    {
      name: 'reasonCode',
      type: 'select',
      admin: { condition: (data) => data?.result === 'not-retained', description: 'Required when not retained.' },
      options: NOT_RETAINED_REASONS.map((r) => ({ label: r.label, value: r.value })),
    },
    { name: 'settlementValueCents', type: 'number', admin: { description: 'Reported case value. Intelligence only. Never a fee input (W3).' } },
    { name: 'reportedAt', type: 'date', required: true, defaultValue: () => new Date() },
  ],
  timestamps: true,
}
