import type { CollectionConfig } from 'payload'

export const Waitlists: CollectionConfig = {
  slug: 'waitlists',
  admin: {
    useAsTitle: 'firmName',
    defaultColumns: ['firmName', 'email', 'createdAt'],
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
  ],
}
