import type { CollectionConfig } from 'payload'

export const GuideCategories: CollectionConfig = {
  slug: 'guideCategories',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'displayOrder'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Category Title',
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'icon',
      type: 'text',
      label: 'Icon (emoji)',
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'displayOrder',
      type: 'number',
      defaultValue: 0,
    },
  ],
  timestamps: true,
}