import type { CollectionConfig } from 'payload'

export const Waitlists: CollectionConfig = {
  slug: 'waitlists',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'source', 'role', 'market', 'firmName', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: () => true, // API controls this
  },
  fields: [
    { name: 'email', type: 'email', required: true },
    { name: 'firmName', type: 'text' },
    { name: 'hardStopReason', type: 'text' },
    { name: 'referralEmail', type: 'email' },
    {
      name: 'source',
      type: 'select',
      options: [
        { label: 'Waitlist', value: 'waitlist' },
        { label: 'Intelligence', value: 'intelligence' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Firm Owner', value: 'owner' },
        { label: 'Managing Partner', value: 'partner' },
        { label: 'Intake Director', value: 'intake' },
        { label: 'Operations Leader', value: 'ops' },
        { label: 'Other', value: 'other' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'market',
      type: 'select',
      options: [
        { label: 'Personal Injury', value: 'personal-injury' },
        { label: 'Workers Compensation', value: 'workers-comp' },
        { label: 'Medical Malpractice', value: 'medical-malpractice' },
        { label: 'Product Liability', value: 'product-liability' },
        { label: 'Premises Liability', value: 'premises-liability' },
        { label: 'Auto Accidents', value: 'auto-accidents' },
        { label: 'Other', value: 'other' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
  timestamps: true,
}
