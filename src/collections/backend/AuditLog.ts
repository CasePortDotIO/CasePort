import type { CollectionConfig } from 'payload'
import { appendOnly } from '../access'

/**
 * AuditLog. Every routing and delivery decision, with the geographic only
 * reason field, retained seven years (Section 5, W1, W7).
 *
 * For a routing decision the reason field has exactly one permitted value:
 * geographic. This is the audit half of the routing wall. RoutingService writes
 * one of these on every route. Immutable: no update, no delete.
 */
export const AuditLog: CollectionConfig = {
  slug: 'auditLog',
  access: appendOnly,
  admin: {
    group: 'Compliance and Audit',
    useAsTitle: 'id',
    defaultColumns: ['decisionType', 'reason', 'aggregateId', 'occurredAt'],
    description: 'Immutable audit of routing and delivery decisions. Seven year retention (W7).',
  },
  fields: [
    {
      name: 'decisionType',
      type: 'select',
      required: true,
      index: true,
      options: [
        { label: 'Routing', value: 'routing' },
        { label: 'Delivery', value: 'delivery' },
      ],
    },
    {
      name: 'reason',
      type: 'select',
      required: true,
      admin: { description: 'For routing decisions the only permitted value is geographic (W1).' },
      options: [
        { label: 'Geographic', value: 'geographic' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Held (wallet dry)', value: 'held' },
      ],
    },
    { name: 'aggregateId', type: 'text', required: true, index: true },
    { name: 'firm', type: 'relationship', relationTo: 'firms' },
    { name: 'market', type: 'relationship', relationTo: 'markets' },
    { name: 'actor', type: 'text' },
    { name: 'details', type: 'json' },
    { name: 'occurredAt', type: 'date', required: true, index: true, defaultValue: () => new Date() },
  ],
  timestamps: true,
}
