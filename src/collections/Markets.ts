import type { CollectionConfig } from 'payload'
import { MARKET_TYPES, MARKET_TIERS } from '@/lib/domain/constants'

export const Markets: CollectionConfig = {
  slug: 'markets',
  admin: {
    useAsTitle: 'metro',
    defaultColumns: ['metro', 'state', 'status', 'mii', 'updatedAt'],
  },
  access: {
    read: () => true, // Publicly readable for frontend
    update: ({ req: { user } }) => Boolean(user), // Require auth
    create: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Auto-cap market if active partners >= max partners
        if (
          data.partnersActive !== undefined &&
          data.maxPartners !== undefined &&
          data.partnersActive >= data.maxPartners &&
          data.status !== 'evaluation'
        ) {
          data.status = 'capped'
        }
        return data
      },
    ],
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'metro',
          label: 'Metro Name',
          type: 'text',
          required: true,
          admin: {
            placeholder: 'e.g. Houston',
          },
        },
        {
          name: 'slug',
          label: 'Slug',
          type: 'text',
          required: true,
          unique: true,
          index: true,
          admin: {
            placeholder: 'e.g. houston',
            description: 'URL-friendly name. Used in /markets/[slug]',
          },
        },
        {
          name: 'state',
          label: 'State',
          type: 'text',
          required: true,
          admin: {
            placeholder: 'e.g. TX',
          },
        },
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'active',
          options: [
            { label: 'Open (Active)', value: 'active' },
            { label: 'Limited', value: 'limited' },
            { label: 'Capped', value: 'capped' },
            { label: 'In Review (Evaluation)', value: 'evaluation' },
          ],
        },
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Metrics & Data',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'mii',
                  label: 'MII Score',
                  type: 'number',
                  required: true,
                },
                {
                  name: 'casesAcquiredYearly',
                  label: 'Cases Acquired Yearly',
                  type: 'number',
                  required: true,
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'partnersActive',
                  label: 'Active Partners',
                  type: 'number',
                  required: true,
                  defaultValue: 0,
                },
                {
                  name: 'maxPartners',
                  label: 'Max Partners',
                  type: 'number',
                  required: true,
                  defaultValue: 3,
                },
                {
                  name: 'waitlistPosition',
                  label: 'Waitlist Position',
                  type: 'number',
                  admin: {
                    condition: (data) => data.status === 'capped' || data.status === 'limited',
                    description: 'Current number of firms on the waitlist for this market.',
                  },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'population',
                  label: 'Population',
                  type: 'text',
                  required: true,
                  admin: { placeholder: 'e.g. 2.3M+' },
                },
                {
                  name: 'monthlySearchVolume',
                  label: 'Monthly Search Volume',
                  type: 'text',
                  required: true,
                  admin: { placeholder: 'e.g. 15,000+' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'responseTime',
                  label: 'Response Time',
                  type: 'text',
                  required: true,
                  defaultValue: '15 mins',
                },
                {
                  name: 'activatedDate',
                  label: 'Activated Date',
                  type: 'date',
                  required: true,
                  defaultValue: () => new Date(),
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'avgSettlement',
                  label: 'Average Settlement Range',
                  type: 'text',
                  required: true,
                  admin: { placeholder: 'e.g. $285K-$420K' },
                },
                {
                  name: 'avgCaseValue',
                  label: 'Average Case Value',
                  type: 'text',
                  required: true,
                  admin: { placeholder: 'e.g. $350K' },
                },
              ],
            },
          ],
        },
        {
          label: 'Hero Content',
          fields: [
            {
              name: 'heroHeadline',
              label: 'Headline',
              type: 'text',
              required: true,
            },
            {
              name: 'heroSubline',
              label: 'Subline',
              type: 'textarea',
              required: true,
            },
          ],
        },
        {
          label: 'Features & Testimonials',
          fields: [
            {
              name: 'testimonial',
              type: 'group',
              fields: [
                { name: 'quote', type: 'textarea' },
                { name: 'author', type: 'text' },
              ],
            },
            {
              name: 'whyThisMarket',
              type: 'array',
              label: 'Why This Market Features',
              minRows: 1,
              fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'desc', type: 'textarea', required: true },
              ],
              defaultValue: [
                {
                  title: 'Consistent Case Flow',
                  desc: 'City-specific insight placeholder.', // This will be overwritten gracefully or used as default
                },
                {
                  title: 'Qualified Partners Only',
                  desc: 'Limited firms maximum. No dilution. No competition.',
                },
                {
                  title: 'Pre-Funded Wallet Model',
                  desc: 'Only pay for qualified leads. Money stays in your wallet until delivery.',
                },
                {
                  title: '15-Minute Response Time',
                  desc: 'Access to leads within 15 minutes of qualification. Speed = conversion.',
                },
              ],
            },
            {
              name: 'faqs',
              type: 'array',
              label: 'Frequently Asked Questions',
              minRows: 1,
              fields: [
                { name: 'question', type: 'text', required: true },
                { name: 'answer', type: 'textarea', required: true },
              ],
            },
          ],
        },
        {
          label: 'SEO & AEO',
          fields: [
            {
              name: 'aeoContent',
              label: 'Answer Engine Content (Hidden)',
              type: 'richText',
              admin: {
                description:
                  'Hidden semantic blocks for Answer Engine Optimization. Will be rendered seamlessly.',
              },
            },
          ],
        },
        {
          label: 'Routing & Wallet',
          description:
            'Backend routing and pricing config. Routing is geographic only (W1). Not every city is equal (decision D5).',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'marketType',
                  type: 'select',
                  defaultValue: 'single-firm-exclusive',
                  options: MARKET_TYPES.map((m) => ({ label: m.label, value: m.value })),
                  admin: {
                    description:
                      'Single firm exclusive ships now. Multi firm panel is the W8 deferred seam.',
                  },
                },
                {
                  name: 'marketTier',
                  type: 'select',
                  defaultValue: 'standard',
                  options: MARKET_TIERS.map((m) => ({ label: m.label, value: m.value })),
                  admin: { description: 'Drives the premium metro price tier (decision D3).' },
                },
              ],
            },
            {
              name: 'assignedFirm',
              type: 'relationship',
              relationTo: 'firms',
              admin: {
                description:
                  'The single firm this protected market routes to. Resolved geographically only (W1).',
              },
            },
            {
              name: 'partnerCap',
              type: 'number',
              defaultValue: 1,
              admin: {
                description:
                  'One for single firm exclusive markets. Reserved higher for the future multi firm panel type.',
              },
            },
            {
              name: 'zipClusters',
              type: 'array',
              admin: { description: 'The ZIP clusters that resolve to this market for routing.' },
              fields: [{ name: 'zip', type: 'text', required: true }],
            },
            {
              name: 'liveForIntake',
              type: 'checkbox',
              defaultValue: false,
              admin: { description: 'Whether basic intake validation treats this as a live market.' },
            },
          ],
        },
      ],
    },
  ],
  timestamps: true,
}
