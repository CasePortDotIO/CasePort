import type { CollectionConfig } from 'payload'
import { authenticated } from '../access'

/**
 * Claimants. Identity and contact, R2 media references, consent references
 * (Section 5). Personally identifying information. Access controlled.
 *
 * CasePort never stores medical records (W5). Media references point at R2
 * objects behind signed, expiring URLs. The claimant is the source of the
 * asset, never the payer, and never sees any evaluative signal (W2).
 */
export const Claimants: CollectionConfig = {
  slug: 'claimants',
  access: {
    read: authenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    group: 'Case Pipeline',
    useAsTitle: 'lastName',
    defaultColumns: ['lastName', 'firstName', 'phone', 'marketZip', 'createdAt'],
    description: 'Claimant identity and contact. PII, access controlled.',
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'firstName', type: 'text', required: true },
        { name: 'lastName', type: 'text', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'phone', type: 'text' },
        { name: 'email', type: 'email' },
      ],
    },
    { name: 'marketZip', type: 'text', index: true, admin: { description: 'ZIP used to resolve market for geographic routing (W1).' } },
    {
      name: 'mediaRefs',
      type: 'array',
      admin: { description: 'R2 object keys for photos, voice, and documents. Never public.' },
      fields: [
        { name: 'key', type: 'text', required: true },
        { name: 'kind', type: 'select', options: ['photo', 'voice', 'document'] },
      ],
    },
    { name: 'consents', type: 'relationship', relationTo: 'consents', hasMany: true },
  ],
  timestamps: true,
}
