import type { CollectionConfig } from 'payload'
import { authenticated } from '../access'
import { B2B_TARGET_STATUSES, OUTBOUND_STATUSES } from '@/lib/domain/demandCapture'

/**
 * B2BTargets. The enumerable firm universe for outbound precision
 * (DEMAND_CAPTURE.md Section 5.2, Section 10 `b2bTargets`).
 *
 * Each target carries its enrichment and sequence state and its outreach draft
 * pending a human send (HL4, HL6). The draft is Rule 7.1 clean before it can
 * queue, and its proof of reality is redacted representative recent activity,
 * never a volume guarantee. Internal only. No delete.
 */
export const B2BTargets: CollectionConfig = {
  slug: 'b2b-targets',
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: () => false,
  },
  admin: {
    group: 'Demand Capture',
    useAsTitle: 'firmName',
    defaultColumns: ['firmName', 'market', 'status', 'createdAt'],
    description: 'The target firm universe. Outreach drafts are Rule 7.1 clean and wait for a human send.',
  },
  fields: [
    { name: 'firmName', type: 'text', required: true, index: true },
    { name: 'market', type: 'text', required: true, index: true },
    { name: 'partnerName', type: 'text' },
    { name: 'revenueBand', type: 'text' },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'added',
      index: true,
      options: B2B_TARGET_STATUSES.map((s) => ({ label: s.label, value: s.value })),
    },
    { name: 'enriched', type: 'checkbox', defaultValue: false },
    {
      name: 'outbound',
      type: 'group',
      admin: { description: 'The outreach draft, pending a human send.' },
      fields: [
        { name: 'subject', type: 'text' },
        { name: 'body', type: 'textarea' },
        { name: 'proof', type: 'json', admin: { description: 'Redacted representative recent activity. No claimant PII.' } },
        {
          name: 'status',
          type: 'select',
          options: OUTBOUND_STATUSES.map((s) => ({ label: s.label, value: s.value })),
        },
        { name: 'rejectionReason', type: 'text' },
        { name: 'sentBy', type: 'text' },
        { name: 'sentAt', type: 'date', admin: { date: { pickerAppearance: 'dayAndTime' } } },
      ],
    },
    { name: 'createdAt', type: 'date', required: true, admin: { date: { pickerAppearance: 'dayAndTime' } } },
  ],
  timestamps: true,
}
