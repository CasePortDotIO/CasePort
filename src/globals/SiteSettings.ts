import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: {
    group: 'Global',
    description: 'Site-wide defaults: SEO, CTAs, contact info, legal, and organization schema.',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    // ── SEO Defaults ────────────────────────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Default SEO',
      fields: [
        {
          name: 'seoTitle',
          label: 'Default SEO Title',
          type: 'text',
          defaultValue: 'CasePort — Case Flow Without Guesswork',
        },
        {
          name: 'seoDescription',
          label: 'Default Meta Description',
          type: 'textarea',
          defaultValue:
            'Premium case acquisition infrastructure for personal injury law firms. Structured, disciplined case flow. 46 markets. 3 firms each.',
        },
        {
          name: 'ogImage',
          label: 'Default OG Image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'noindexPages',
          label: 'Noindex Pages',
          type: 'array',
          admin: {
            description: 'Relative paths to prevent indexing (e.g. /thank-you)',
          },
          fields: [{ name: 'path', type: 'text', required: true }],
        },
      ],
    },

    // ── CTA Defaults ────────────────────────────────────────────────────────
    {
      type: 'collapsible',
      label: 'CTA Settings',
      fields: [
        {
          name: 'primaryCtaLabel',
          label: 'Primary CTA Label',
          type: 'text',
          defaultValue: 'Request Market Access',
        },
        {
          name: 'primaryCtaHref',
          label: 'Primary CTA URL',
          type: 'text',
          defaultValue: '/request-access',
        },
        {
          name: 'injuredCtaLabel',
          label: 'Injured CTA Label',
          type: 'text',
          defaultValue: 'Injured? Start Here',
        },
        {
          name: 'injuredCtaHref',
          label: 'Injured CTA URL',
          type: 'text',
          defaultValue: '/injured',
        },
      ],
    },

    // ── Contact Info ─────────────────────────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Contact Info',
      fields: [
        {
          name: 'contactEmail',
          label: 'Contact Email',
          type: 'email',
          defaultValue: 'access@caseport.io',
        },
        {
          name: 'brandName',
          label: 'Brand Name',
          type: 'text',
          defaultValue: 'CasePort',
        },
        {
          name: 'brandTagline',
          label: 'Brand Tagline',
          type: 'text',
          defaultValue: 'Case Flow Without Guesswork',
        },
        {
          name: 'brandSummary',
          label: 'Brand Summary (Footer)',
          type: 'textarea',
          defaultValue:
            'Turning chaotic accident demand into structured, buyer-ready case opportunities for personal injury law firms.',
        },
      ],
    },

    // ── Legal ────────────────────────────────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Legal Settings',
      fields: [
        {
          name: 'legalDisclaimer',
          label: 'Footer Legal Disclaimer',
          type: 'textarea',
          defaultValue:
            'CasePort provides case acquisition infrastructure services. We do not guarantee any specific number of leads, cases, or revenue outcomes. All projections are illustrative and based on general market data. CasePort is not a law firm and does not provide legal advice.',
        },
        {
          name: 'privacyPolicyUrl',
          label: 'Privacy Policy URL',
          type: 'text',
          defaultValue: 'https://www.caseport.io/privacy',
        },
        {
          name: 'termsUrl',
          label: 'Terms of Service URL',
          type: 'text',
          defaultValue: 'https://www.caseport.io/terms',
        },
      ],
    },

    // ── Organization Schema ──────────────────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Organization Schema (JSON-LD)',
      fields: [
        {
          name: 'orgName',
          label: 'Organization Name',
          type: 'text',
          defaultValue: 'CasePort',
        },
        {
          name: 'orgUrl',
          label: 'Organization URL',
          type: 'text',
          defaultValue: 'https://www.caseport.io',
        },
        {
          name: 'orgDescription',
          label: 'Organization Description',
          type: 'textarea',
          defaultValue:
            'CasePort is a premium case acquisition system for personal injury law firms, operating exclusive territorial lead networks across 46+ US markets.',
        },
      ],
    },
  ],
}
