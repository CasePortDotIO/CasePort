import type { CollectionConfig } from 'payload'

export const InjuredLeads: CollectionConfig = {
  slug: 'injured-leads',
  admin: {
    useAsTitle: 'lastName',
    defaultColumns: ['lastName', 'firstName', 'phone', 'accidentDate', 'seen', 'createdAt'],
    components: {
      beforeList: ['@/components/admin/MarkInjuredLeadsSeen#MarkInjuredLeadsSeen'],
    },
  },
  access: {
    create: () => true, // Anyone can submit the form
    read: ({ req: { user } }) => Boolean(user), // Only authenticated admins can read
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    { name: 'firstName', type: 'text', required: true },
    { name: 'lastName', type: 'text', required: true },
    { name: 'phone', type: 'text', required: true },
    { name: 'email', type: 'email' },
    { name: 'accidentDate', type: 'text' },
    { name: 'state', type: 'text' },
    { name: 'county', type: 'text' },
    { name: 'accidentType', type: 'text' },
    { name: 'role', type: 'text' },
    { name: 'medicalCare', type: 'text' },
    { name: 'fault', type: 'text' },
    { name: 'otherPartyInsurance', type: 'text' },
    { name: 'hasLawyer', type: 'text' },
    { name: 'preferredContact', type: 'text' },
    { name: 'canTalkNow', type: 'text' },
    { name: 'hasDocuments', type: 'text' },
    { name: 'seen', type: 'checkbox', defaultValue: false },
    {
      name: 'uploadedDocuments',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Documents explicitly uploaded by the user during this form submission.',
      },
    },
  ],
  timestamps: true,
}
