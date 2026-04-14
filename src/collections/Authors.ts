import type { CollectionConfig } from 'payload'

export const Authors: CollectionConfig = {
  slug: 'authors',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'title', 'createdAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'bio',
      type: 'textarea',
    },
    {
      name: 'profileUrl',
      label: 'Profile URL',
      type: 'text',
      admin: { placeholder: 'https://linkedin.com/in/...' },
    },
    {
      name: 'badges',
      label: 'Credential Badges',
      type: 'array',
      maxRows: 3,
      admin: {
        description: 'Short labels shown as pills on article pages (e.g. "Expert", "50+ Firms").',
      },
      fields: [{ name: 'label', type: 'text', required: true, admin: { placeholder: 'Expert' } }],
    },
    {
      name: 'credentials',
      label: 'Credential Stats',
      type: 'array',
      maxRows: 3,
      admin: {
        description:
          'Stats shown in the credential grid (e.g. value "50+" / label "Firms Advised").',
      },
      fields: [
        { name: 'value', type: 'text', required: true, admin: { placeholder: '50+' } },
        { name: 'label', type: 'text', required: true, admin: { placeholder: 'Firms Advised' } },
      ],
    },
    {
      name: 'ctaButtons',
      label: 'Author CTA Buttons',
      type: 'array',
      maxRows: 3,
      admin: {
        description:
          'Action buttons shown in the author bio section (e.g. "Ask a Question", "View Profile").',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: { placeholder: 'Ask a Question' },
        },
        {
          name: 'href',
          type: 'text',
          required: true,
          admin: { placeholder: 'mailto:author@caseport.io or https://...' },
        },
        {
          name: 'style',
          type: 'select',
          defaultValue: 'primary',
          options: [
            { label: 'Primary (filled)', value: 'primary' },
            { label: 'Secondary (outlined)', value: 'secondary' },
          ],
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        { name: 'platform', type: 'select', options: ['twitter', 'linkedin', 'github'] },
        { name: 'url', type: 'text' },
      ],
    },
  ],
  timestamps: true,
}
