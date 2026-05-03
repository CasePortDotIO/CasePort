import type { GlobalConfig } from 'payload'

export const HeaderNav: GlobalConfig = {
  slug: 'header-nav',
  label: 'Header Navigation',
  admin: {
    group: 'Global',
    description: 'Controls the top navigation links and the primary CTA button.',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'navLinks',
      label: 'Nav Links',
      type: 'array',
      minRows: 1,
      admin: {
        description: 'Order determines display order in the navigation.',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'href',
          type: 'text',
          required: true,
          admin: { placeholder: 'e.g. /markets or https://...' },
        },
        {
          name: 'openInNewTab',
          label: 'Open in New Tab',
          type: 'checkbox',
          defaultValue: false,
        },
      ],
      defaultValue: [
        { label: 'For Law Firms', href: '/personal-injury-leads' },
        { label: 'Markets', href: '/markets' },
        { label: 'Insights', href: '/insights' },
        { label: 'Intelligence', href: '/intelligence' },
        { label: 'Injured?', href: '/injured' },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'ctaLabel',
          label: 'CTA Button Label',
          type: 'text',
          defaultValue: 'Request Access',
        },
        {
          name: 'ctaHref',
          label: 'CTA Button URL',
          type: 'text',
          defaultValue: '/request-access',
        },
      ],
    },
  ],
}
