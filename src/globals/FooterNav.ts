import type { GlobalConfig } from 'payload'

export const FooterNav: GlobalConfig = {
  slug: 'footer-nav',
  label: 'Footer Navigation',
  admin: {
    group: 'Global',
    description: 'Controls footer nav groups, social links, and utility links.',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'platformLinks',
      label: 'Platform Links',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
      ],
      defaultValue: [
        { label: 'For Law Firms', href: '/personal-injury-leads' },
        { label: 'How It Works', href: '/#how-it-works' },
        { label: 'ROI Projection', href: '/#roi' },
        { label: 'Why CasePort', href: '/#why' },
        { label: 'FAQ', href: '/#faq' },
      ],
    },
    {
      name: 'resourceLinks',
      label: 'Resource Links',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
      ],
      defaultValue: [
        { label: 'Insights', href: '/insights' },
        { label: 'Intelligence', href: '/intelligence' },
        { label: 'Injured?', href: '/injured' },
      ],
    },
    {
      name: 'legalLinks',
      label: 'Legal Links',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'href', type: 'text', required: true },
      ],
      defaultValue: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
      ],
    },
  ],
}
