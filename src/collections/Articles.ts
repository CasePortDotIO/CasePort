import type { CollectionConfig, FieldHook } from 'payload'

const extractTextFromRichText = (nodes: any[]): string => {
  if (!Array.isArray(nodes)) return ''
  let text = ''
  for (const node of nodes) {
    if (node.type === 'text' && node.text) {
      text += node.text + ' '
    } else if (node.children) {
      text += extractTextFromRichText(node.children) + ' '
    }
  }
  return text
}

const generateAeoScore: FieldHook = async ({ data }) => {
  let score = 0
  const d = data || {}

  // 1. Direct answer
  const directAnswer = d.directAnswer || ''
  if (directAnswer.length >= 40) {
    if (directAnswer.toLowerCase().includes('caseport')) {
      score += 25
    } else {
      score += 12
    }
  }

  // 2. AI citation summary
  const aiSummary = d.aiCitationSummary || ''
  if (aiSummary.length >= 80) score += 15

  // 3. FAQ items
  const faqs = d.faqSection || []
  const validFaqs = faqs.filter((f: any) => f.question && f.answer && f.answer.length >= 40).length
  if (validFaqs >= 4) score += 20
  else if (validFaqs >= 2) score += 10
  else if (validFaqs === 1) score += 5

  // 4. Key statistics
  const stats = d.keyStatistics || []
  const validStats = stats.filter((s: any) => s.text && s.sourceName).length
  if (validStats >= 3) score += 15
  else if (validStats === 2) score += 10
  else if (validStats === 1) score += 5

  // 5. Voice answer
  const voiceAnswer = d.voiceAnswer || ''
  const words = voiceAnswer.split(' ').filter(Boolean).length
  if (voiceAnswer.length >= 10 && words < 35) score += 10

  // 6. Term definitions
  const terms = d.termDefinitions || []
  if (terms.length >= 2) score += 5

  // 7. Meta title & description
  const metaTitle = d.metaTitle || ''
  const metaDesc = d.metaDescription || ''
  if (metaTitle.length > 0 && metaDesc.length > 0) score += 5

  // 8. Expert quote
  const quotes = d.expertQuotes || []
  const validQuotes = quotes.filter((q: any) => q.speakerName && q.quote).length
  if (validQuotes >= 1) score += 5

  return score
}

const calculateReadTime: FieldHook = async ({ data }) => {
  if (!data?.content?.root?.children) return 0
  const text = extractTextFromRichText(data.content.root.children)
  const words = text.split(/\s+/).filter(Boolean).length
  return Math.ceil(words / 200) || 1
}

const calculateNextReviewDue: FieldHook = async ({ data }) => {
  if (!data?.publishedDate || !data?.reviewCycle) return null
  const pubDate = new Date(data.publishedDate)
  if (isNaN(pubDate.getTime())) return null

  if (data.reviewCycle === '3months') pubDate.setMonth(pubDate.getMonth() + 3)
  else if (data.reviewCycle === '6months') pubDate.setMonth(pubDate.getMonth() + 6)
  else if (data.reviewCycle === '12months') pubDate.setMonth(pubDate.getMonth() + 12)
  else if (data.reviewCycle === 'evergreen') return null

  return pubDate.toISOString()
}

export const Articles: CollectionConfig = {
  slug: 'articles',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'publishedDate', 'aeoScore'],
  },
  versions: {
    drafts: true,
  },
  hooks: {
    beforeChange: [
      async ({ data }) => {
        data.aeoScore = await generateAeoScore({ data } as any)
        data.readTime = await calculateReadTime({ data } as any)
        data.nextReviewDue = await calculateNextReviewDue({ data } as any)
        return data
      },
    ],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              admin: { description: '50-80 chars. Auto slug.' },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'currentReaders',
                  type: 'number',
                  defaultValue: 1247,
                  admin: { description: 'Live reading now counter' },
                },
                {
                  name: 'citationCount',
                  type: 'number',
                  defaultValue: 47,
                  admin: { description: 'Cited by X firms' },
                },
                {
                  name: 'signalStrength',
                  type: 'number',
                  min: 0,
                  max: 100,
                  defaultValue: 94,
                  admin: { description: 'Signal Strength (0-100)' },
                },
              ],
            },
            { name: 'slug', type: 'text', unique: true, index: true, required: true },
            { name: 'author', type: 'relationship', relationTo: 'users', required: true },
            {
              name: 'contentPillar',
              type: 'select',
              required: true,
              options: [
                'For Law Firms',
                'Auto Accident Cases',
                'Claimant Education',
                'Case Acquisition Strategy',
                'PI Industry Intelligence',
                'Intake Excellence',
                'Lead Economics',
                'Platform Updates',
              ],
            },
            {
              name: 'contentFormat',
              type: 'select',
              required: true,
              options: [
                'Pillar Page',
                'Cluster Article',
                'FAQ Article',
                'How-To Guide',
                'News',
                'Research Report',
                'Case Study',
                'Comparison',
                'Definition',
              ],
            },
            { name: 'heroImage', type: 'upload', relationTo: 'media', required: true },
            { name: 'excerpt', type: 'textarea', required: true, minLength: 50, maxLength: 300 },
            { name: 'subtitle', type: 'text' },
            { name: 'executiveSummary', type: 'textarea' },
            {
              name: 'keyTakeaways',
              type: 'array',
              required: true,
              minRows: 3,
              maxRows: 5,
              fields: [{ name: 'point', type: 'text', required: true }],
            },
            { name: 'content', type: 'richText', required: true },
            { name: 'tags', type: 'array', fields: [{ name: 'tag', type: 'text' }] },
            {
              name: 'relatedArticles',
              type: 'relationship',
              relationTo: 'articles',
              hasMany: true,
              minRows: 3,
              maxRows: 5,
            },
          ],
        },
        {
          label: 'SEO Core',
          fields: [
            { name: 'focusKeyword', type: 'text', required: true },
            { name: 'keywordDifficulty', type: 'number', min: 0, max: 100 },
            { name: 'monthlySearchVolume', type: 'number' },
            { name: 'currentRankingPosition', type: 'number' },
            {
              name: 'secondaryKeywords',
              type: 'array',
              required: true,
              fields: [{ name: 'keyword', type: 'text' }],
            },
            { name: 'metaTitle', type: 'text', required: true, maxLength: 60 },
            { name: 'metaDescription', type: 'textarea', required: true, maxLength: 160 },
            { name: 'canonicalUrl', type: 'text' },
            { name: 'socialHeadline', type: 'text' },
            { name: 'socialDescription', type: 'textarea' },
            { name: 'socialShareImage', type: 'upload', relationTo: 'media' },
            { name: 'xCardType', type: 'select', options: ['summary_large_image', 'summary'] },
            { name: 'xCardTitle', type: 'text' },
            { name: 'xCardDescription', type: 'textarea' },
            { name: 'xCardImage', type: 'upload', relationTo: 'media' },
            { name: 'competingUrl', type: 'text' },
            { name: 'contentGap', type: 'array', fields: [{ name: 'gap', type: 'text' }] },
          ],
        },
        {
          label: 'AEO and AI Citation',
          fields: [
            { name: 'directAnswer', type: 'textarea', required: true },
            { name: 'aiCitationSummary', type: 'textarea', required: true },
            { name: 'primaryAiQuery', type: 'text', required: true },
            {
              name: 'keyStatistics',
              type: 'array',
              required: true,
              minRows: 2,
              fields: [
                { name: 'text', type: 'text', required: true },
                { name: 'sourceName', type: 'text', required: true },
                { name: 'sourceUrl', type: 'text' },
                { name: 'year', type: 'text' },
              ],
            },
            {
              name: 'faqSection',
              type: 'array',
              required: true,
              minRows: 4,
              fields: [
                { name: 'question', type: 'text', required: true },
                { name: 'answer', type: 'textarea', required: true },
              ],
            },
            {
              name: 'termDefinitions',
              type: 'array',
              fields: [
                { name: 'term', type: 'text', required: true },
                { name: 'definition', type: 'textarea', required: true },
                { name: 'isProprietary', type: 'checkbox' },
              ],
            },
            {
              name: 'expertQuotes',
              type: 'array',
              fields: [
                { name: 'quote', type: 'textarea', required: true },
                { name: 'speakerName', type: 'text', required: true },
                { name: 'credentials', type: 'text' },
              ],
            },
          ],
        },
        {
          label: 'Voice Search',
          fields: [
            { name: 'voiceAnswer', type: 'textarea', required: true },
            {
              name: 'speakableCssSelectors',
              type: 'array',
              required: true,
              defaultValue: [
                { selector: 'h1' },
                { selector: '.direct-answer-block' },
                { selector: '.key-takeaways' },
                { selector: '.faq-answer' },
              ],
              fields: [{ name: 'selector', type: 'text' }],
            },
            {
              name: 'conversationalQueryVariants',
              type: 'array',
              fields: [{ name: 'query', type: 'text' }],
            },
            { name: 'targetsSpecificLocation', type: 'checkbox' },
            {
              name: 'locationTargets',
              type: 'array',
              admin: { condition: (data) => data.targetsSpecificLocation },
              fields: [
                { name: 'state', type: 'text' },
                { name: 'city', type: 'text' },
              ],
            },
          ],
        },
        {
          label: 'Schema',
          fields: [
            {
              name: 'schemaType',
              type: 'select',
              required: true,
              options: ['Article', 'FAQPage', 'HowTo', 'NewsArticle', 'LegalScholarlyArticle'],
            },
            {
              name: 'howToSteps',
              type: 'array',
              admin: { condition: (data) => data.schemaType === 'HowTo' },
              fields: [
                { name: 'name', type: 'text', required: true },
                { name: 'description', type: 'textarea', required: true },
                { name: 'image', type: 'upload', relationTo: 'media' },
              ],
            },
            {
              name: 'sameAsEntityUrls',
              type: 'array',
              required: true,
              fields: [{ name: 'url', type: 'text', required: true }],
            },
            { name: 'articleSection', type: 'text' },
            { name: 'apaCitation', type: 'text' },
            { name: 'customJsonLd', type: 'textarea' },
          ],
        },
        {
          label: 'Authority & Compliance',
          fields: [
            {
              name: 'legalDisclaimer',
              type: 'select',
              required: true,
              options: ['Standard', 'No Legal Advice', 'CasePort Platform', 'None'],
              defaultValue: 'Standard',
            },
            { name: 'abaComplianceVerified', type: 'checkbox' },
            { name: 'expertReviewer', type: 'text' },
            {
              name: 'externalSources',
              type: 'array',
              required: true,
              fields: [
                { name: 'name', type: 'text', required: true },
                { name: 'url', type: 'text' },
                { name: 'credibilityTier', type: 'select', options: ['High', 'Medium', 'Low'] },
              ],
            },
            {
              name: 'pressMentions',
              type: 'array',
              fields: [
                { name: 'source', type: 'text' },
                { name: 'url', type: 'text' },
                { name: 'date', type: 'date' },
              ],
            },
            {
              name: 'ctaOverride',
              type: 'group',
              fields: [
                { name: 'heading', type: 'text' },
                { name: 'body', type: 'textarea' },
                { name: 'primaryLabel', type: 'text' },
                { name: 'primaryUrl', type: 'text' },
                { name: 'secondaryLabel', type: 'text' },
                { name: 'secondaryUrl', type: 'text' },
              ],
            },
            {
              name: 'contentUpdateHistory',
              type: 'array',
              fields: [
                { name: 'date', type: 'date', required: true },
                { name: 'summary', type: 'text', required: true },
                { name: 'updatedBy', type: 'text', required: true },
              ],
            },
          ],
        },
      ],
    },
    // Sidebar
    { name: 'publishedDate', type: 'date', admin: { position: 'sidebar' } },
    { name: 'aeoScore', type: 'number', admin: { position: 'sidebar', readOnly: true } },
    { name: 'readTime', type: 'number', admin: { position: 'sidebar', readOnly: true } },
    {
      name: 'searchIntent',
      type: 'select',
      required: true,
      admin: { position: 'sidebar' },
      options: ['Informational', 'Commercial Investigation', 'Transactional', 'Navigational'],
    },
    { name: 'targetSerpFeature', type: 'text', admin: { position: 'sidebar' } },
    {
      name: 'contentConfidence',
      type: 'select',
      admin: { position: 'sidebar' },
      options: ['High', 'Medium', 'Low'],
    },
    { name: 'hideFromSearchEngines', type: 'checkbox', admin: { position: 'sidebar' } },
    {
      name: 'reviewCycle',
      type: 'select',
      admin: { position: 'sidebar' },
      options: [
        { label: '3 Months', value: '3months' },
        { label: '6 Months', value: '6months' },
        { label: '12 Months', value: '12months' },
        { label: 'Evergreen', value: 'evergreen' },
      ],
    },
    { name: 'nextReviewDue', type: 'date', admin: { position: 'sidebar', readOnly: true } },
    { name: 'lastFactVerified', type: 'date', admin: { position: 'sidebar' } },
  ],
}
