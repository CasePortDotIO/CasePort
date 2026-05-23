import { CollectionConfig } from 'payload/types'

export const FAQItems: CollectionConfig = {
  slug: 'faq-items',
  admin: { useAsTitle: 'question' },
  fields: [
    { name: 'question', type: 'text', required: true },
    { name: 'answer', type: 'richText', required: true },
    {
      name: 'answerPlainText',
      type: 'textarea',
      required: true,
      admin: {
        description: 'CRITICAL: No HTML. Plain text only. This goes directly into FAQPage JSON-LD schema.',
      },
    },
    { name: 'lastReviewedAt', type: 'date' },
    { name: 'reviewedByAttorney', type: 'checkbox', defaultValue: false },
    { name: 'isActive', type: 'checkbox', defaultValue: true },
  ],
}
