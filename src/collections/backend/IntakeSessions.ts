import type { CollectionConfig } from 'payload'
import { authenticated } from '../access'

/**
 * IntakeSessions. One per claimant intake attempt (Section 5). Carries the
 * attribution tuple and the ordered event references for that session.
 *
 * The attribution tuple is the Answer to Wallet Engine (Section 4, Section 11).
 * It is captured at first touch and is immutable. It is referenced by every
 * downstream event through delivery, debit, and outcome, so a signed case can
 * be traced back to the exact source, keyword, and intake behavior that
 * produced it.
 */
export const IntakeSessions: CollectionConfig = {
  slug: 'intakeSessions',
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: () => false,
  },
  admin: {
    group: 'Case Pipeline',
    useAsTitle: 'id',
    defaultColumns: ['id', 'market', 'validationPassed', 'createdAt'],
    description: 'Intake attempt with the immutable attribution tuple.',
  },
  fields: [
    { name: 'claimant', type: 'relationship', relationTo: 'claimants' },
    { name: 'market', type: 'relationship', relationTo: 'markets', index: true },
    {
      name: 'attribution',
      type: 'group',
      admin: { description: 'Immutable. Captured at first touch before anything else (W: Answer to Wallet).' },
      fields: [
        { name: 'source', type: 'text', index: true },
        { name: 'keyword', type: 'text' },
        { name: 'referringSurface', type: 'text' },
        { name: 'sessionBehavior', type: 'json' },
        { name: 'firstTouchAt', type: 'date' },
      ],
    },
    {
      name: 'validationPassed',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Basic intake completeness gate. Not a quality gate (W1).' },
    },
    { name: 'events', type: 'relationship', relationTo: 'events', hasMany: true },
  ],
  timestamps: true,
}
