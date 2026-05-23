import { CollectionConfig } from 'payload/types'

export const Markets: CollectionConfig = {
  slug: 'markets',
  admin: { useAsTitle: 'state' },
  fields: [
    { name: 'state', type: 'text', required: true, unique: true },
    { name: 'stateCode', type: 'text', required: true, maxLength: 2 },
    { name: 'statPageEnabled', type: 'checkbox', defaultValue: false },
    { name: 'slug', type: 'text', unique: true },
    { name: 'description', type: 'textarea' },
    {
      name: 'statuteOfLimitations',
      type: 'group',
      fields: [
        { name: 'years', type: 'number' },
        { name: 'faultType', type: 'text' },
        { name: 'notes', type: 'textarea' },
      ],
    },
    {
      name: 'averageSettlement',
      type: 'group',
      fields: [
        { name: 'min', type: 'number' },
        { name: 'max', type: 'number' },
        { name: 'median', type: 'number' },
      ],
    },
    { name: 'publishedAt', type: 'date' },
    { name: 'lastReviewedAt', type: 'date' },
  ],
}
