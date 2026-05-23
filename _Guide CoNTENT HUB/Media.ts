import { CollectionConfig } from 'payload/types'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticURL: '/media',
    staticDir: 'media',
  },
  fields: [
    { name: 'alt', type: 'text', required: true },
  ],
}
