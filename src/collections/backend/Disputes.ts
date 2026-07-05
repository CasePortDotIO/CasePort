import type { CollectionConfig } from 'payload'
import { authenticated } from '../access'

/**
 * Disputes. Firm raised disputes over a delivered opportunity (prototype
 * contract map, internal dashboard). A dispute is an operational and billing
 * review artifact. Any resolution that returns credit does so through a ledger
 * adjustment entry, never a discretionary charge (Section 10, W3).
 */
export const Disputes: CollectionConfig = {
  slug: 'disputes',
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    group: 'Case Pipeline',
    useAsTitle: 'id',
    defaultColumns: ['delivery', 'firm', 'status', 'priority', 'openedAt'],
    description: 'Firm dispute over a delivered opportunity.',
  },
  fields: [
    { name: 'delivery', type: 'relationship', relationTo: 'deliveries', required: true, index: true },
    { name: 'firm', type: 'relationship', relationTo: 'firms', required: true, index: true },
    {
      type: 'row',
      fields: [
        { name: 'status', type: 'select', defaultValue: 'open', options: [ { label: 'Open', value: 'open' }, { label: 'In Review', value: 'in-review' }, { label: 'Resolved', value: 'resolved' } ] },
        { name: 'priority', type: 'select', defaultValue: 'medium', options: ['low', 'medium', 'high'] },
      ],
    },
    { name: 'reason', type: 'text', required: true },
    { name: 'amountCents', type: 'number' },
    { name: 'openedAt', type: 'date', defaultValue: () => new Date() },
    { name: 'resolution', type: 'textarea' },
  ],
  timestamps: true,
}
