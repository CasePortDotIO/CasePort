import type { CollectionConfig } from 'payload'
import { appendOnly } from '../access'

/**
 * LedgerEntries. Append only and authoritative (Section 5, Section 10). Every
 * top up credit and every delivery debit. The wallet balance is the sum of
 * entries, always.
 *
 * The idempotency key carries a unique index. A debit derived from a delivery
 * event id can never be written twice, no matter how many times Inngest
 * retries (Section 4, Section 10). Immutable: no update, no delete.
 */
export const LedgerEntries: CollectionConfig = {
  slug: 'ledgerEntries',
  access: appendOnly,
  admin: {
    group: 'Commerce',
    useAsTitle: 'idempotencyKey',
    defaultColumns: ['firm', 'entryType', 'reason', 'amountCents', 'occurredAt'],
    description: 'Append only authoritative ledger. Immutable. Unique idempotency key.',
  },
  fields: [
    { name: 'firm', type: 'relationship', relationTo: 'firms', required: true, index: true },
    { name: 'entryType', type: 'select', required: true, options: [ { label: 'Credit', value: 'credit' }, { label: 'Debit', value: 'debit' } ] },
    {
      name: 'reason',
      type: 'select',
      required: true,
      options: [
        { label: 'Stripe Top Up', value: 'topup' },
        { label: 'Delivery Debit', value: 'delivery-debit' },
        { label: 'Adjustment', value: 'adjustment' },
      ],
    },
    { name: 'amountCents', type: 'number', required: true, admin: { description: 'Positive for credit, negative for debit.' } },
    {
      name: 'idempotencyKey',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { description: 'Derived from the delivery event id for debits. Enforces exactly once.' },
    },
    { name: 'delivery', type: 'relationship', relationTo: 'deliveries', admin: { description: 'Set on delivery debits.' } },
    { name: 'stripeRef', type: 'text', admin: { description: 'Stripe reference on top ups. Stripe is the rail, the ledger is the truth.' } },
    { name: 'balanceAfterCents', type: 'number' },
    { name: 'occurredAt', type: 'date', required: true, index: true, defaultValue: () => new Date() },
  ],
  timestamps: true,
}
