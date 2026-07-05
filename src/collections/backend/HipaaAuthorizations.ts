import type { CollectionConfig } from 'payload'
import { authenticated } from '../access'

/**
 * HipaaAuthorizations. The template plus the firm named executed instance
 * produced at routing (Section 5, W5).
 *
 * The claimant pre signs a template with the firm name left blank. At routing,
 * the template is populated with the specific firm name and delivered to the
 * firm. The firm requests records directly from providers. CasePort stores the
 * executed authorization as a record and never receives, transmits, or stores
 * the medical records themselves (W5).
 */
export const HipaaAuthorizations: CollectionConfig = {
  slug: 'hipaaAuthorizations',
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: () => false,
  },
  admin: {
    group: 'Compliance and Audit',
    useAsTitle: 'id',
    defaultColumns: ['claimant', 'executedFirmName', 'executedAt'],
    description: 'Executed HIPAA authorization record. CasePort never stores medical records (W5).',
  },
  fields: [
    { name: 'claimant', type: 'relationship', relationTo: 'claimants', required: true, index: true },
    { name: 'templateVersion', type: 'text', required: true },
    { name: 'signedAt', type: 'date', admin: { description: 'When the claimant pre signed the blank template.' } },
    { name: 'executedFirmName', type: 'text', admin: { description: 'Populated at routing with the specific firm name (W5).' } },
    { name: 'executedFirm', type: 'relationship', relationTo: 'firms' },
    { name: 'executedAt', type: 'date' },
    { name: 'documentRef', type: 'text', admin: { description: 'R2 object key for the executed authorization document. Never a medical record.' } },
  ],
  timestamps: true,
}
