import type { GlobalConfig } from 'payload'

export const MarketsPage: GlobalConfig = {
  slug: 'markets-page',
  label: 'Markets Page Settings',
  admin: {
    group: 'Pages',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'faqs',
      type: 'array',
      label: 'Frequently Asked Questions',
      admin: {
        description: 'These FAQs will appear at the bottom of the main Markets hub page.',
      },
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
        },
        {
          name: 'answer',
          type: 'textarea',
          required: true,
        },
      ],
    },
  ],
}
