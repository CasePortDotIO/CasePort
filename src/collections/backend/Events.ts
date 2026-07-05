import type { CollectionConfig } from 'payload'
import { appendOnly } from '../access'
import { EVENT_TYPES } from '@/lib/domain/constants'

/**
 * Events. The append only global log (Section 4, Section 5).
 *
 * Every state change is an immutable event. Current state is a projection of
 * events, not the primary truth. This is the audit trail compliance requires
 * and the raw material the intelligence layer compounds on. Immutable: no
 * update, no delete (W7).
 */
export const Events: CollectionConfig = {
  slug: 'events',
  access: appendOnly,
  admin: {
    group: 'Compliance and Audit',
    useAsTitle: 'eventType',
    defaultColumns: ['eventType', 'aggregateType', 'aggregateId', 'occurredAt'],
    description: 'Append only global event log. Immutable by design.',
  },
  fields: [
    {
      name: 'eventType',
      type: 'select',
      required: true,
      index: true,
      options: EVENT_TYPES.map((t) => ({ label: t, value: t })),
    },
    { name: 'aggregateType', type: 'text', required: true, index: true },
    { name: 'aggregateId', type: 'text', required: true, index: true },
    {
      name: 'intakeSession',
      type: 'relationship',
      relationTo: 'intakeSessions',
      admin: { description: 'Attribution tuple carrier for this event, when applicable.' },
    },
    { name: 'actor', type: 'text', admin: { description: 'System, claimant, firm, or operator.' } },
    { name: 'occurredAt', type: 'date', required: true, index: true, defaultValue: () => new Date() },
    { name: 'payload', type: 'json', admin: { description: 'Event body. Never contains medical records.' } },
  ],
  timestamps: true,
}
