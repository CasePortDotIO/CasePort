import type { CollectionConfig } from 'payload'

export const Applications: CollectionConfig = {
  slug: 'applications',
  admin: {
    useAsTitle: 'firmName',
    defaultColumns: [
      'firmName',
      'fullName',
      'workEmail',
      'status',
      'leadTier',
      'seen',
      'createdAt',
    ],
    components: {
      beforeList: ['@/components/admin/MarkApplicationsSeen#MarkApplicationsSeen'],
    },
  },
  access: {
    read: () => true,
    create: () => true, // Will be controlled by API
    update: ({ req: { user } }) => Boolean(user), // Admin only typically
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'firmName', type: 'text', required: true },
        { name: 'fullName', type: 'text', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'workEmail', type: 'email', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'phone', type: 'text', required: true },
        { name: 'website', type: 'text', required: true },
      ],
    },
    { name: 'linkedIn', type: 'text' },

    // Lead scoring
    {
      type: 'row',
      fields: [
        { name: 'leadScore', type: 'number', required: true, defaultValue: 0 },
        {
          name: 'leadTier',
          type: 'select',
          required: true,
          defaultValue: 'silver',
          options: [
            { label: 'Platinum', value: 'platinum' },
            { label: 'Gold', value: 'gold' },
            { label: 'Silver', value: 'silver' },
            { label: 'Disqualified', value: 'disqualified' },
          ],
        },
      ],
    },

    // Status
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
        { label: 'Waitlisted', value: 'waitlisted' },
      ],
    },

    // Full answers
    {
      name: 'answers',
      type: 'json',
      required: true,
      admin: {
        components: {
          Field: '/components/admin/AnswersField', // Resolved to src/components/admin/AnswersField.tsx
        },
      },
    },

    { name: 'seen', type: 'checkbox', defaultValue: false },

    // UTM / Metadata
    /*
    {
      type: 'group',
      name: 'metadata',
      fields: [
        {
          type: 'row',
          fields: [
             { name: 'utmSource', type: 'text' },
             { name: 'utmMedium', type: 'text' },
             { name: 'utmCampaign', type: 'text' },
          ]
        },
        {
          type: 'row',
          fields: [
            { name: 'utmContent', type: 'text' },
            { name: 'utmTerm', type: 'text' },
            { name: 'referrer', type: 'text' },
          ]
        },
        { name: 'ipAddress', type: 'text' },
        { name: 'userAgent', type: 'text' }
      ],
    },
    */
  ],
}
