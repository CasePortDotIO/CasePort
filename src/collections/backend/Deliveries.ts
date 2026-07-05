import type { CollectionConfig } from 'payload'
import { authenticated } from '../access'

/**
 * Deliveries. Dossier to firm, with delivery timestamp, firm response
 * timestamp, and computed response time against SLA (Section 5, Section 7).
 *
 * A verified DossierDelivered is what triggers the wallet debit (Section 10).
 * If the firm wallet cannot cover the fee, the delivery holds in the queue and
 * the firm is alerted to top up (decision D2). The claimant status stays
 * received and pending firm contact.
 */
export const Deliveries: CollectionConfig = {
  slug: 'deliveries',
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: () => false,
  },
  admin: {
    group: 'Case Pipeline',
    useAsTitle: 'id',
    defaultColumns: ['dossier', 'firm', 'status', 'deliveredAt', 'billed'],
    description: 'Dossier to firm delivery with SLA response tracking.',
  },
  fields: [
    { name: 'dossier', type: 'relationship', relationTo: 'dossiers', required: true, index: true },
    { name: 'firm', type: 'relationship', relationTo: 'firms', required: true, index: true },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'held',
      options: [
        { label: 'Held (wallet dry, awaiting top up)', value: 'held' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Billed', value: 'billed' },
      ],
    },
    { name: 'deliveredAt', type: 'date' },
    { name: 'firmRespondedAt', type: 'date' },
    { name: 'responseTimeSeconds', type: 'number' },
    { name: 'slaBreached', type: 'checkbox', defaultValue: false },
    { name: 'billed', type: 'checkbox', defaultValue: false, admin: { description: 'Set true only inside the ACID debit transaction.' } },
  ],
  timestamps: true,
}
