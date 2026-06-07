import type { CollectionConfig } from 'payload'

export const SiteLinks: CollectionConfig = {
  slug: 'siteLinks',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'url'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: { description: 'Display name for this link, e.g. "Check My Case"' },
    },
    {
      name: 'url',
      type: 'text',
      required: true,
      admin: { description: 'Full URL or path, e.g. "/request-access" or "tel:+18002273669"' },
    },
  ],
}