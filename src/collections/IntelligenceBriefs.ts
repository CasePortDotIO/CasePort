import type { CollectionConfig } from 'payload'

export const IntelligenceBriefs: CollectionConfig = {
  slug: 'intelligence-briefs',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'role', 'market', 'seen', 'createdAt'],
    group: 'Intelligence',
    description: 'Subscribers to the CasePort Intelligence weekly brief.',
    components: {
      beforeList: ['@/components/admin/MarkIntelligenceSeen#MarkIntelligenceSeen'],
    },
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: () => true,
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      admin: {
        description: 'Subscriber work email address.',
      },
    },
    {
      name: 'role',
      label: 'Role',
      type: 'select',
      required: true,
      options: [
        { label: 'Firm Owner', value: 'owner' },
        { label: 'Managing Partner', value: 'partner' },
        { label: 'Intake Director', value: 'intake' },
        { label: 'Operations Leader', value: 'ops' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'market',
      label: 'Practice Area',
      type: 'select',
      required: true,
      options: [
        { label: 'Personal Injury', value: 'personal-injury' },
        { label: 'Workers Compensation', value: 'workers-comp' },
        { label: 'Medical Malpractice', value: 'medical-malpractice' },
        { label: 'Product Liability', value: 'product-liability' },
        { label: 'Premises Liability', value: 'premises-liability' },
        { label: 'Auto Accidents', value: 'auto-accidents' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      label: 'Subscription Status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Unsubscribed', value: 'unsubscribed' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'seen',
      label: 'Seen',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Checked once an admin has viewed this subscriber.',
      },
    },
  ],
  timestamps: true,
}
