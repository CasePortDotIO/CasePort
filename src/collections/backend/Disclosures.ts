import type { CollectionConfig } from 'payload'
import { authenticated } from '../access'
import { JURISDICTIONS } from '@/lib/domain/constants'

/**
 * Disclosures. Jurisdiction served text blocks (Section 5, W6).
 *
 * Disclosure and disclaimer text is served from here by jurisdiction, never
 * hard coded, so New York attorney advertising labels, Florida office location
 * disclosure, and Texas no representation language are served by state. Every
 * claimant facing surface carries the non recommendation disclaimer.
 *
 * Read is public because these are the disclaimers shown on claimant surfaces.
 * They contain no PII and no evaluative data. Writes are authenticated. Seven
 * year retention on the versioned history (W7).
 */
export const Disclosures: CollectionConfig = {
  slug: 'disclosures',
  access: {
    read: () => true,
    create: authenticated,
    update: authenticated,
    delete: () => false,
  },
  admin: {
    group: 'Compliance and Audit',
    useAsTitle: 'label',
    defaultColumns: ['label', 'jurisdiction', 'disclosureType', 'version', 'effectiveAt'],
    description: 'Jurisdiction served disclaimer and disclosure text (W6).',
  },
  fields: [
    { name: 'label', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        { name: 'jurisdiction', type: 'select', required: true, index: true, options: JURISDICTIONS.map((j) => ({ label: j.label, value: j.value })) },
        {
          name: 'disclosureType',
          type: 'select',
          required: true,
          options: [
            { label: 'Non Recommendation Disclaimer', value: 'non-recommendation' },
            { label: 'Attorney Advertising Label', value: 'attorney-advertising' },
            { label: 'Office Location Disclosure', value: 'office-location' },
            { label: 'No Representation Language', value: 'no-representation' },
          ],
        },
      ],
    },
    { name: 'body', type: 'textarea', required: true },
    { name: 'version', type: 'text', required: true, defaultValue: 'v1' },
    { name: 'effectiveAt', type: 'date', defaultValue: () => new Date() },
  ],
  timestamps: true,
}
