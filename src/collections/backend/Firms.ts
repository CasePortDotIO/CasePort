import type { CollectionConfig } from 'payload'
import { authenticated } from '../access'
import { CASE_TYPES } from '@/lib/domain/constants'

/**
 * Firms. Partner record, SLA terms including required callback time, and the
 * per opportunity price table keyed by case type (Section 5). Founding Partner
 * flag.
 *
 * The price table holds a fixed fee per case type. The fee is never derived
 * from an outcome (W3). Phase 3 debit reads the fee from here.
 */
export const Firms: CollectionConfig = {
  slug: 'firms',
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    group: 'Commerce',
    useAsTitle: 'name',
    defaultColumns: ['name', 'assignedMarket', 'foundingPartner', 'status', 'updatedAt'],
    description: 'Law firm partner record, SLA terms, and the fixed price table.',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'assignedMarket', type: 'relationship', relationTo: 'markets', index: true },
    {
      type: 'row',
      fields: [
        { name: 'email', type: 'email' },
        { name: 'phone', type: 'text' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'foundingPartner', type: 'checkbox', defaultValue: false },
        {
          name: 'slaCallbackMinutes',
          type: 'number',
          defaultValue: 15,
          admin: { description: 'Contractual callback SLA. Golden window.' },
        },
        {
          name: 'status',
          type: 'select',
          defaultValue: 'active',
          options: ['active', 'inactive', 'suspended'],
        },
      ],
    },
    {
      name: 'priceTable',
      type: 'array',
      admin: { description: 'Fixed fee per delivered opportunity by case type (D3). Never outcome derived (W3).' },
      fields: [
        { name: 'caseType', type: 'select', required: true, options: CASE_TYPES.map((c) => ({ label: c.label, value: c.value })) },
        { name: 'feeCents', type: 'number', required: true, admin: { description: 'Fixed fee in cents.' } },
      ],
    },
  ],
  timestamps: true,
}
