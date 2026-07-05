import type { CollectionConfig } from 'payload'
import { authenticated } from '../access'

/**
 * Wallets. A derived balance snapshot for fast reads (Section 5, Section 10).
 * Not authoritative. Rebuildable from ledgerEntries at any time. The balance is
 * always the sum of ledger entries; this snapshot is a cache.
 */
export const Wallets: CollectionConfig = {
  slug: 'wallets',
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    group: 'Commerce',
    useAsTitle: 'firm',
    defaultColumns: ['firm', 'balanceCents', 'lastRebuiltAt'],
    description: 'Derived balance snapshot. Authoritative truth is the ledger.',
  },
  fields: [
    { name: 'firm', type: 'relationship', relationTo: 'firms', required: true, unique: true, index: true },
    { name: 'balanceCents', type: 'number', defaultValue: 0, admin: { description: 'Cached sum of ledger entries. Rebuildable.' } },
    { name: 'lowBalanceThresholdCents', type: 'number', defaultValue: 200000, admin: { description: 'Fires a top up prompt before the wallet empties (Section 10).' } },
    { name: 'lastRebuiltAt', type: 'date' },
  ],
  timestamps: true,
}
