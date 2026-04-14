import type { CollectionConfig } from 'payload'

export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'publishedAt'],
  },
  access: {
    read: () => true,
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
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
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'authors',
      required: true,
    },
    {
      name: 'readTime',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Estimated reading time in minutes',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      maxLength: 300,
    },
    {
      name: 'subtitle',
      type: 'textarea',
      admin: {
        description: 'Displayed directly under the main title in the hero section.',
      },
    },
    {
      name: 'executiveSummary',
      type: 'textarea',
      admin: {
        description: 'A larger editorial intro text bridging the hero and the main body.',
      },
    },
    {
      name: 'keyTakeaways',
      type: 'array',
      label: 'Key Takeaways',
      admin: {
        description: 'Bullet points summarizing the article, displayed in a highlighted box.',
      },
      fields: [
        {
          name: 'takeaway',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'seoAnswers',
      type: 'array',
      label: 'Hidden AEO/SEO Answers',
      admin: {
        description:
          'Structured answers to feed directly to AI search engines (ChatGPT, Google AI Overview). Hidden from visual reading view.',
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
    {
      name: 'faqs',
      type: 'array',
      label: 'Frequently Asked Questions (AEO/SEO)',
      admin: {
        description: 'These populate the FAQ accordion at the bottom of the article.',
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
    {
      name: 'relatedArticles',
      type: 'relationship',
      relationTo: 'articles',
      hasMany: true,
      maxDepth: 1,
    },
    {
      name: 'citation',
      type: 'text',
      admin: {
        description:
          'APA-style citation shown in the "Cite This Research" section. E.g. Smith, J. (2026). Title. CasePort Insights.',
      },
    },
    {
      name: 'midArticleCta',
      label: 'Mid-Article CTA',
      type: 'group',
      admin: {
        description:
          'Override the mid-article call-to-action box shown after the article body. Leave blank to use the default depth-based content.',
      },
      fields: [
        {
          name: 'heading',
          type: 'text',
          admin: { placeholder: 'Stop Losing Cases to Intake Leakage' },
        },
        {
          name: 'body',
          type: 'textarea',
          admin: {
            placeholder: 'You just read about the problem. Now fix it...',
          },
        },
        {
          name: 'primaryLabel',
          label: 'Primary Button Label',
          type: 'text',
          admin: { placeholder: 'Get Your Free Audit →' },
        },
        {
          name: 'primaryHref',
          label: 'Primary Button URL',
          type: 'text',
          admin: { placeholder: '/request-access' },
        },
        {
          name: 'secondaryLabel',
          label: 'Secondary Button Label',
          type: 'text',
          admin: { placeholder: 'Download Worksheet' },
        },
        {
          name: 'secondaryHref',
          label: 'Secondary Button URL',
          type: 'text',
          admin: { placeholder: 'https://...' },
        },
      ],
    },
  ],
  timestamps: true,
}
