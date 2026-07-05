import type { CollectionConfig } from 'payload'
import { appendOnly } from '../access'

/**
 * Consents. TrustedForm URL, timestamp, IP, user agent, submission id, and the
 * versioned consent language (Section 5, W7).
 *
 * Every submission generates a TrustedForm certificate and a timestamped,
 * versioned consent record. Seven year retention. Immutable: no update, no
 * delete.
 */
export const Consents: CollectionConfig = {
  slug: 'consents',
  access: appendOnly,
  admin: {
    group: 'Compliance and Audit',
    useAsTitle: 'submissionId',
    defaultColumns: ['submissionId', 'claimant', 'consentLanguageVersion', 'capturedAt'],
    description: 'Immutable consent record. Seven year retention (W7).',
  },
  fields: [
    { name: 'claimant', type: 'relationship', relationTo: 'claimants', index: true },
    { name: 'trustedFormUrl', type: 'text', required: true },
    { name: 'consentLanguageVersion', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        { name: 'ipAddress', type: 'text' },
        { name: 'submissionId', type: 'text', required: true, index: true },
      ],
    },
    { name: 'userAgent', type: 'text' },
    { name: 'capturedAt', type: 'date', required: true, defaultValue: () => new Date() },
  ],
  timestamps: true,
}
