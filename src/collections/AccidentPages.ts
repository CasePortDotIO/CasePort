import type { CollectionConfig, FieldHook } from 'payload'

// ─── AEO/SEO Score Helpers ────────────────────────────────────────────────────

/** Extract plain text from a blocks array for read-time and content scoring */
const extractTextFromBlocks = (blocks: any[]): string => {
  if (!blocks || !Array.isArray(blocks)) return ''
  let text = ''
  for (const block of blocks) {
    if (!block) continue
    if (block.blockType === 'directAnswer') {
      text += (block.lead || block.text || '') + ' '
    }
    if (block.blockType === 'keyTakeaways' && Array.isArray(block.items)) {
      for (const item of block.items) {
        text += (item.item || '') + ' '
      }
    }
    if (block.blockType === 'faq' && Array.isArray(block.items)) {
      for (const item of block.items) {
        text += (item.question || '') + ' ' + (item.answerText || '') + ' '
      }
    }
    if (block.blockType === 'proseSections' && Array.isArray(block.sections)) {
      for (const s of block.sections) {
        text += (s.title || '') + ' ' + (s.content || '') + ' '
      }
    }
    if (block.blockType === 'hero') {
      text += (block.heroTitle || '') + ' ' + (block.heroSubtitle || '') + ' '
    }
    if (block.blockType === 'articleTimelineSteps' && Array.isArray(block.steps)) {
      for (const s of block.steps) {
        text += (s.stepName || '') + ' ' + (s.stepDescription || '') + ' '
      }
    }
    if (block.blockType === 'firstHourSteps' && Array.isArray(block.steps)) {
      for (const s of block.steps) {
        text += (s.stepName || '') + ' ' + (s.stepDescription || '') + ' '
      }
    }
    if (block.blockType === 'cityOverview') {
      text += (block.description || '') + ' '
    }
    if (block.blockType === 'takeHome') {
      text += (block.title || '') + ' '
      if (Array.isArray(block.items)) {
        for (const it of block.items) text += (it.item || '') + ' '
      }
    }
  }
  return text
}

/** AEO score based on block content — 0-100 */
const calculateAeoScore: FieldHook = async ({ data }) => {
  const blocks: any[] = data?.blocks || []
  let score = 0

  // directAnswer block
  const daBlock = blocks.find((b: any) => b.blockType === 'directAnswer')
  if (daBlock?.lead || daBlock?.text) {
    const len = (daBlock.lead || daBlock.text || '').length
    if (len >= 100) score += 30
    else if (len >= 60) score += 20
    else if (len >= 30) score += 10
    if ((daBlock.lead || daBlock.text || '').toLowerCase().includes('caseport')) score += 5
  }
  if (daBlock?.voiceAnswer) {
    const vLen = daBlock.voiceAnswer.length
    const words = daBlock.voiceAnswer.split(' ').filter(Boolean).length
    if (vLen >= 20 && words <= 40) score += 15
    else if (vLen >= 10) score += 8
  }
  if (daBlock?.speakableCssSelectors?.length > 0) score += 10

  // faq block
  const faqBlock = blocks.find((b: any) => b.blockType === 'faq')
  if (faqBlock?.items) {
    const validFaqs = faqBlock.items.filter(
      (f: any) => f.question && f.answerText && f.answerText.length >= 40,
    )
    if (validFaqs.length >= 5) score += 20
    else if (validFaqs.length >= 3) score += 15
    else if (validFaqs.length >= 1) score += 8
    const voiceFaqs = faqBlock.items.filter((f: any) => f.voiceQuestion)
    if (voiceFaqs.length >= 3) score += 10
    else if (voiceFaqs.length >= 1) score += 5
  }

  // keyTakeaways block
  const ktBlock = blocks.find((b: any) => b.blockType === 'keyTakeaways')
  if (ktBlock?.items?.length >= 4) score += 10
  else if (ktBlock?.items?.length >= 2) score += 5

  // expert block
  const expBlock = blocks.find((b: any) => b.blockType === 'expert')
  if (expBlock?.author) score += 10

  // sources block
  const srcBlock = blocks.find((b: any) => b.blockType === 'sources')
  if (srcBlock?.sources?.length >= 2) score += 5

  return Math.min(score, 100)
}

/** Read time from blocks content — avg 200 wpm */
const calculateReadTime: FieldHook = async ({ data }) => {
  const blocks: any[] = data?.blocks || []
  const text = extractTextFromBlocks(blocks)
  const words = text.split(/\s+/).filter(Boolean).length
  return Math.ceil(words / 200) || 1
}

/** Next review due — 90 days from save for accident content */
const calculateNextReviewDue: FieldHook = async () => {
  const d = new Date()
  d.setDate(d.getDate() + 90)
  return d.toISOString()
}

/** SEO score from top-level meta fields */
const calculateSeoScore: FieldHook = async ({ data }) => {
  let score = 0
  const metaTitle = data?.metaTitle || ''
  const metaDesc = data?.metaDescription || ''
  const focusKw = (data?.focusKeyword || '').toLowerCase().trim()
  const title = (data?.title || '').toLowerCase()

  // Meta title length
  const mtLen = metaTitle.trim().length
  if (mtLen >= 50 && mtLen <= 60) score += 20
  else if (mtLen >= 40 && mtLen <= 70) score += 10

  // Meta description length
  const mdLen = metaDesc.trim().length
  if (mdLen >= 140 && mdLen <= 160) score += 20
  else if (mdLen >= 120 && mdLen <= 170) score += 10

  // Focus keyword in title
  if (focusKw && title.includes(focusKw)) score += 20
  else if (focusKw && title.includes(focusKw.replace(/-/g, ' '))) score += 10

  // Focus keyword in meta title
  if (focusKw && metaTitle.toLowerCase().includes(focusKw)) score += 15
  if (focusKw && metaDesc.toLowerCase().includes(focusKw)) score += 10

  return Math.min(score, 100)
}

// ─── Page Types ───────────────────────────────────────────────────────────────

export type AccidentPageType =
  | 'accidentType'
  | 'state'
  | 'stateTopic'
  | 'city'
  | 'cityType'
  | 'quickAnswer'
  | 'resources'

// ─── Collection Config ────────────────────────────────────────────────────────

export const AccidentPages: CollectionConfig = {
  slug: 'accidentPages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'pageType', 'fullSlug', 'state', 'city'],
    listSearchableFields: ['title', 'fullSlug'],
  },
  versions: {
    drafts: true,
  },
  access: {
    read: () => true,
  },
  fields: [
    // ─── Page Identity ─────────────────────────────────────────────────────
    {
      name: 'pageType',
      type: 'select',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Determines which URL pattern this page uses.',
      },
      options: [
        { label: 'Accident Type (e.g. /accidents/car-accident)', value: 'accidentType' },
        { label: 'State Landing (e.g. /accidents/california)', value: 'state' },
        { label: 'State Topic (e.g. /accidents/california/statute-of-limitations)', value: 'stateTopic' },
        { label: 'City (e.g. /accidents/california/los-angeles)', value: 'city' },
        { label: 'City + Type (e.g. /accidents/california/los-angeles/car-accident)', value: 'cityType' },
        { label: 'Quick Answer (e.g. /accidents/what-to-do-after-accident)', value: 'quickAnswer' },
        { label: 'Resources Hub (e.g. /accidents/resources)', value: 'resources' },
      ],
    },

    // The canonical URL path — e.g. "california/los-angeles/car-accident"
    // Computed at seed time; editors can override but should follow the pattern
    {
      name: 'fullSlug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'Canonical URL path. Auto-derived from pageType + state + city + type.',
      },
    },

    // Short title used in hero/breadcrumbs
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: { description: 'Used in hero heading and browser tab.' },
    },

    // ─── Relationships (used to pull in static data values) ────────────────
    // State abbreviation (e.g. "CA"). Used for state, stateTopic, city, cityType pages.
    {
      name: 'state',
      type: 'text',
      admin: {
        description: '2-letter state abbreviation (e.g. CA, TX). Required for state, city pages.',
        condition: (_, siblingData) =>
          ['state', 'stateTopic', 'city', 'cityType'].includes(siblingData?.pageType),
      },
    },

    // City key (lowercase state abbr, e.g. "ca"). Used for city, cityType pages.
    {
      name: 'cityKey',
      type: 'text',
      admin: {
        description: 'City key matching data.cityData (e.g. "ca" for California cities).',
        condition: (_, siblingData) =>
          ['city', 'cityType'].includes(siblingData?.pageType),
      },
    },

    // City slug (e.g. "los-angeles"). Used for city, cityType pages.
    {
      name: 'citySlug',
      type: 'text',
      admin: {
        description: 'City slug (e.g. "los-angeles").',
        condition: (_, siblingData) =>
          ['city', 'cityType'].includes(siblingData?.pageType),
      },
    },

    // Accident type slug (e.g. "car-accident"). Used for accidentType, cityType pages.
    {
      name: 'accidentType',
      type: 'text',
      admin: {
        description: 'Accident type slug (e.g. "car-accident").',
        condition: (_, siblingData) =>
          ['accidentType', 'cityType'].includes(siblingData?.pageType),
      },
    },

    // State law topic slug (e.g. "statute-of-limitations"). Used for stateTopic pages.
    {
      name: 'stateTopic',
      type: 'text',
      admin: {
        description: 'State law topic slug (e.g. "statute-of-limitations").',
        condition: (_, siblingData) => siblingData?.pageType === 'stateTopic',
      },
    },

    // Quick answer slug (e.g. "what-to-do-after-accident"). Used for quickAnswer pages.
    {
      name: 'quickAnswerSlug',
      type: 'text',
      admin: {
        description: 'Quick answer page slug (e.g. "what-to-do-after-accident").',
        condition: (_, siblingData) => siblingData?.pageType === 'quickAnswer',
      },
    },

    // ─── CMS Blocks ───────────────────────────────────────────────────────
    {
      name: 'blocks',
      type: 'blocks',
      blocks: [
        // Hero block — all hero-specific fields in one place
        {
          slug: 'hero',
          fields: [
            { name: 'heroTitle', type: 'text' },
            { name: 'heroSubtitle', type: 'textarea' },
            { name: 'eyebrow', type: 'text' },
            { name: 'scene', type: 'text' },
            { name: 'heroImage', type: 'upload', relationTo: 'media' },
            { name: 'reviewerName', type: 'text', label: 'Reviewed By (Author Name)' },
          ],
        },
        // Category blocks used for accidentType, state, city pages
        {
          slug: 'topSection',
          fields: [
            { name: 'eyebrow', type: 'text' },
            { name: 'heroTitle', type: 'text' },
            { name: 'heroSubtitle', type: 'textarea' },
          ],
        },
        {
          slug: 'quickAnswerStats',
          fields: [
            { name: 'average', type: 'text' },
            { name: 'successRate', type: 'text' },
            { name: 'timeline', type: 'text' },
            { name: 'upfront', type: 'text' },
          ],
        },
        {
          slug: 'qaVisual',
          fields: [
            {
              name: 'kind',
              type: 'select',
              options: [
                { label: 'Contributory vs Comparative', value: 'contributory' },
                { label: 'Statute of Limitations', value: 'statute' },
                { label: 'Evidence Timeline', value: 'evidence' },
                { label: 'Settlement Calculation', value: 'settlement' },
              ],
            },
          ],
        },
        {
          slug: 'directAnswer',
          fields: [
            { name: 'heading', type: 'text' },
            { name: 'lead', type: 'textarea', admin: { description: 'Primary AEO answer — shown in featured snippets and voice search results.' } },
            { name: 'text', type: 'textarea' },
            {
              name: 'voiceAnswer',
              type: 'textarea',
              admin: { description: 'Concise answer for voice assistants (Alexa/Siri). Keep under 35 words.' },
            },
            {
              name: 'speakableCssSelectors',
              type: 'array',
              admin: { description: 'CSS selectors marked as speakable for voice search. E.g. ".direct-answer" or ".hero h1".' },
              fields: [{ name: 'selector', type: 'text' }],
            },
            {
              name: 'howToSteps',
              type: 'array',
              admin: { description: 'Steps for HowTo schema. Only used when schemaType is set to HowTo.' },
              fields: [
                { name: 'name', type: 'text', required: true },
                { name: 'description', type: 'textarea', required: true },
                { name: 'image', type: 'upload', relationTo: 'media' },
              ],
            },
            {
              name: 'table',
              type: 'group',
              fields: [
                { name: 'label', type: 'text' },
                { name: 'head', type: 'array', fields: [{ name: 'cell', type: 'text' }] },
                { name: 'rows', type: 'array', fields: [{ name: 'cells', type: 'array', fields: [{ name: 'cell', type: 'text' }] }] },
              ],
            },
            {
              name: 'rows',
              type: 'array',
              fields: [{ name: 'cells', type: 'array', fields: [{ name: 'cell', type: 'text' }] }],
            },
            {
              name: 'head',
              type: 'array',
              fields: [{ name: 'cell', type: 'text' }],
            },
            { name: 'label', type: 'text' },
          ],
        },
        {
          slug: 'keyTakeaways',
          fields: [
            { name: 'items', type: 'array', fields: [{ name: 'item', type: 'text' }] },
          ],
        },
        {
          slug: 'proseSections',
          fields: [
            {
              name: 'sections',
              type: 'array',
              fields: [
                { name: 'title', type: 'text' },
                { name: 'content', type: 'textarea' },
              ],
            },
          ],
        },
        {
          slug: 'faq',
          fields: [
            {
              name: 'items',
              type: 'array',
              fields: [
                { name: 'question', type: 'text', admin: { description: 'The question users ask — be specific and conversational.' } },
                { name: 'answerText', type: 'textarea', admin: { description: 'The answer — be concise and factual. Used in featured snippets.' } },
                {
                  name: 'voiceQuestion',
                  type: 'text',
                  admin: { description: 'How a user would ask this aloud (e.g. "what settlement am I entitled to"). Used for voice search.' },
                },
                { name: 'slug', type: 'text', admin: { description: 'Optional link to a quick answer or accident type page.' } },
              ],
            },
            {
              name: 'aiCitationSummary',
              type: 'textarea',
              admin: { description: 'Short paragraph AI systems use for citations. Summarize the key finding in 1-2 sentences.' },
            },
            {
              name: 'conversationalQueryVariants',
              type: 'array',
              admin: { description: 'Alternative ways users phrase this question conversationally.' },
              fields: [{ name: 'query', type: 'text' }],
            },
          ],
        },
        {
          slug: 'statuteDeadlines',
          fields: [
            { name: 'deadline', type: 'text' },
            { name: 'fromDate', type: 'text' },
            { name: 'bars', type: 'array', fields: [
              { name: 'deadline', type: 'text' },
              { name: 'states', type: 'text' },
              { name: 'note', type: 'text' },
            ]},
          ],
        },
        {
          slug: 'stateFaqBlock',
          fields: [
            { name: 'title', type: 'text' },
            {
              name: 'faqs',
              type: 'array',
              fields: [
                { name: 'question', type: 'text' },
                { name: 'answer', type: 'textarea' },
              ],
            },
          ],
        },
        {
          slug: 'whyImportant',
          fields: [
            { name: 'title', type: 'text' },
            { name: 'text', type: 'textarea' },
          ],
        },
        {
          slug: 'sectionTOC',
          fields: [],
        },
        {
          slug: 'localizedStats',
          fields: [
            {
              name: 'items',
              type: 'array',
              fields: [
                { name: 'label', type: 'text' },
                { name: 'value', type: 'text' },
              ],
            },
          ],
        },
        {
          slug: 'stateTopicsGrid',
          fields: [
            {
              name: 'topics',
              type: 'array',
              fields: [
                { name: 'slug', type: 'text' },
                { name: 'label', type: 'text' },
                { name: 'tags', type: 'text' },
              ],
            },
          ],
        },
        {
          slug: 'citiesGrid',
          fields: [
            {
              name: 'cities',
              type: 'array',
              fields: [
                { name: 'name', type: 'text' },
                { name: 'slug', type: 'text' },
                { name: 'accidentRate', type: 'text' },
              ],
            },
          ],
        },
        {
          slug: 'relatedGuides',
          fields: [
            {
              name: 'guides',
              type: 'array',
              fields: [
                { name: 'title', type: 'text' },
                { name: 'slug', type: 'text' },
                { name: 'category', type: 'text' },
              ],
            },
          ],
        },
        {
          slug: 'takeHome',
          fields: [
            { name: 'title', type: 'text' },
            { name: 'items', type: 'array', fields: [{ name: 'item', type: 'text' }] },
          ],
        },
        {
          slug: 'howWeKeepAccurate',
          fields: [
            { name: 'text', type: 'textarea' },
          ],
        },
        {
          slug: 'statTiles',
          fields: [
            {
              name: 'items',
              type: 'array',
              fields: [
                { name: 'label', type: 'text' },
                { name: 'value', type: 'text' },
              ],
            },
          ],
        },
        {
          slug: 'exploreMore',
          fields: [
            { name: 'category', type: 'text' },
            {
              name: 'pages',
              type: 'relationship',
              relationTo: 'accidentPages',
              hasMany: true,
              admin: {
                description: 'Search and select related accident pages by title or fullSlug.',
              },
            },
          ],
        },
        {
          slug: 'sources',
          fields: [
            { name: 'citeTitle', type: 'text', admin: { description: 'Page title used in the citation string.' } },
            { name: 'citeUrl', type: 'text', admin: { description: 'URL path used in the citation string (e.g. "georgia").' } },
            {
              name: 'sources',
              type: 'array',
              fields: [
                { name: 'name', type: 'text' },
                { name: 'url', type: 'text' },
              ],
            },
          ],
        },
        {
          slug: 'articleTimelineSteps',
          fields: [
            {
              name: 'steps',
              type: 'array',
              fields: [
                { name: 'stepName', type: 'text' },
                { name: 'stepDescription', type: 'textarea' },
                { name: 'stepDays', type: 'text' },
              ],
            },
          ],
        },
        {
          slug: 'cityOverview',
          fields: [
            { name: 'description', type: 'textarea' },
            {
              name: 'keyFacts',
              type: 'array',
              fields: [{ name: 'fact', type: 'text' }],
            },
          ],
        },
        {
          slug: 'firstHourSteps',
          fields: [
            {
              name: 'steps',
              type: 'array',
              fields: [
                { name: 'stepName', type: 'text' },
                { name: 'stepDescription', type: 'textarea' },
                { name: 'stepDays', type: 'text' },
              ],
            },
          ],
        },
        {
          slug: 'cityResources',
          fields: [
            {
              name: 'items',
              type: 'array',
              fields: [
                { name: 'icon', type: 'text', admin: { description: 'Icon name (e.g. doc, file, pin, camera, shield).' } },
                { name: 'title', type: 'text' },
                { name: 'description', type: 'textarea' },
                { name: 'url', type: 'text', admin: { description: 'Full URL or path (e.g. /accidents/az/scotsdale/police-report).' } },
              ],
            },
          ],
        },
        {
          slug: 'cta',
          fields: [
            { name: 'title', type: 'text' },
            { name: 'subtitle', type: 'text' },
            { name: 'link', type: 'text', admin: { description: 'URL for the CTA button (e.g. /request-access or https://...).' } },
          ],
        },
        {
          slug: 'actionKit',
          fields: [
            { name: 'title', type: 'text' },
            { name: 'intro', type: 'textarea' },
            {
              name: 'scripts',
              type: 'array',
              fields: [
                { name: 'id', type: 'text' },
                { name: 'icon', type: 'text' },
                { name: 'title', type: 'text' },
                { name: 'why', type: 'textarea' },
                { name: 'to', type: 'text' },
                { name: 'subject', type: 'text' },
                { name: 'body', type: 'textarea' },
              ],
            },
          ],
        },
        {
          slug: 'stateComparison',
          fields: [
            {
              name: 'initialA',
              type: 'select',
              admin: { description: 'Initial state pre-selected in the comparison widget.' },
              options: [
                { label: 'Alabama', value: 'AL' }, { label: 'Alaska', value: 'AK' },
                { label: 'Arizona', value: 'AZ' }, { label: 'Arkansas', value: 'AR' },
                { label: 'California', value: 'CA' }, { label: 'Colorado', value: 'CO' },
                { label: 'Connecticut', value: 'CT' }, { label: 'Delaware', value: 'DE' },
                { label: 'Florida', value: 'FL' }, { label: 'Georgia', value: 'GA' },
                { label: 'Hawaii', value: 'HI' }, { label: 'Idaho', value: 'ID' },
                { label: 'Illinois', value: 'IL' }, { label: 'Indiana', value: 'IN' },
                { label: 'Iowa', value: 'IA' }, { label: 'Kansas', value: 'KS' },
                { label: 'Kentucky', value: 'KY' }, { label: 'Louisiana', value: 'LA' },
                { label: 'Maine', value: 'ME' }, { label: 'Maryland', value: 'MD' },
                { label: 'Massachusetts', value: 'MA' }, { label: 'Michigan', value: 'MI' },
                { label: 'Minnesota', value: 'MN' }, { label: 'Mississippi', value: 'MS' },
                { label: 'Missouri', value: 'MO' }, { label: 'Montana', value: 'MT' },
                { label: 'Nebraska', value: 'NE' }, { label: 'Nevada', value: 'NV' },
                { label: 'New Hampshire', value: 'NH' }, { label: 'New Jersey', value: 'NJ' },
                { label: 'New Mexico', value: 'NM' }, { label: 'New York', value: 'NY' },
                { label: 'North Carolina', value: 'NC' }, { label: 'North Dakota', value: 'ND' },
                { label: 'Ohio', value: 'OH' }, { label: 'Oklahoma', value: 'OK' },
                { label: 'Oregon', value: 'OR' }, { label: 'Pennsylvania', value: 'PA' },
                { label: 'Rhode Island', value: 'RI' }, { label: 'South Carolina', value: 'SC' },
                { label: 'South Dakota', value: 'SD' }, { label: 'Tennessee', value: 'TN' },
                { label: 'Texas', value: 'TX' }, { label: 'Utah', value: 'UT' },
                { label: 'Vermont', value: 'VT' }, { label: 'Virginia', value: 'VA' },
                { label: 'Washington', value: 'WA' }, { label: 'West Virginia', value: 'WV' },
                { label: 'Wisconsin', value: 'WI' }, { label: 'Wyoming', value: 'WY' },
                { label: 'District of Columbia', value: 'DC' },
              ],
            },
          ],
        },
        {
          slug: 'reportBlock',
          fields: [
            { name: 'stateName', type: 'text', admin: { description: 'State name, e.g. Georgia.' } },
            { name: 'requestFrom', type: 'text', admin: { description: 'Where to request the crash report, e.g. Georgia DMV — Form FR-50.' } },
            { name: 'requestHow', type: 'textarea', admin: { description: 'How to request — steps, portal link info, etc.' } },
            { name: 'whenToAct', type: 'text', admin: { description: 'Custom when-to-act text.' } },
            { name: 'statuteYears', type: 'number' },
            { name: 'note', type: 'textarea', admin: { description: 'Disclaimer text.' } },
          ],
        },
        {
          slug: 'stateLawBlock',
          fields: [
            { name: 'stateName', type: 'text' },
            { name: 'cityName', type: 'text' },
            { name: 'label', type: 'text' },
            { name: 'faultThreshold', type: 'text' },
            { name: 'statuteYears', type: 'number' },
            { name: 'topicSlug', type: 'text' },
            { name: 'statuteTopicSlug', type: 'text' },
          ],
        },
        {
          slug: 'expert',
          fields: [
            {
              name: 'author',
              type: 'relationship',
              relationTo: 'authors',
              admin: { description: 'Pulls name, title, credentials, and badges from the selected author.' },
            },
            {
              name: 'reviewType',
              type: 'select',
              options: [
                { label: 'Legal', value: 'legal' },
                { label: 'Medical', value: 'medical' },
              ],
            },
            { name: 'sourceText', type: 'textarea', admin: { description: 'Paragraph explaining how content is reviewed.' } },
          ],
        },
      ],
      admin: {
        description: 'Page sections. Mix and match as needed.',
      },
    },

    // ─── SEO ───────────────────────────────────────────────────────────────
    { name: 'focusKeyword', type: 'text', admin: { description: 'Primary keyword to optimize for (e.g. "car accident settlement Arizona").' } },
    { name: 'metaTitle', type: 'text', maxLength: 80 },
    { name: 'metaDescription', type: 'textarea', maxLength: 160 },
    { name: 'publishedDate', type: 'date' },
    // schemaType is auto-derived — all accident pages use GuidePage
    { name: 'hideFromSearchEngines', type: 'checkbox' },

    // ─── Auto-Calculated Scores (readOnly — set by hooks) ────────────────────
    {
      name: 'aeoScore',
      type: 'number',
      admin: { readOnly: true, description: 'Auto-calculated 0-100 AEO score based on directAnswer, FAQ, voiceAnswer, keyTakeaways, expert, and sources blocks.' },
    },
    {
      name: 'seoScore',
      type: 'number',
      admin: { readOnly: true, description: 'Auto-calculated 0-100 SEO score based on metaTitle, metaDescription, focusKeyword, and schemaType.' },
    },
    {
      name: 'readTime',
      type: 'number',
      admin: { readOnly: true, description: 'Auto-calculated read time in minutes based on block content.' },
    },
    {
      name: 'nextReviewDue',
      type: 'date',
      admin: { readOnly: true, description: 'Auto-set to 90 days from last save. Marks when content should be reviewed for accuracy.' },
    },

    // ─── Sidebar ───────────────────────────────────────────────────────────
    {
      name: 'displayOrder',
      type: 'number',
      admin: { position: 'sidebar' },
    },
    {
      name: 'previewButton',
      type: 'ui',
      admin: {
        position: 'sidebar',
        components: {
          Field: '@/components/admin/AccidentPagePreviewButton',
        },
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, operation }) => {
        // Skip hook calculations during seeding
        if (data._isSeeding) return data

        // Auto-set publishedDate on first publish
        if (operation === 'update' && data._status === 'published' && !data.publishedDate) {
          data.publishedDate = new Date().toISOString()
        }

        // Auto-calculate scores on every save (not just publish)
        try {
          data.aeoScore = await calculateAeoScore({ data } as any)
          data.seoScore = await calculateSeoScore({ data } as any)
          data.readTime = await calculateReadTime({ data } as any)
          data.nextReviewDue = await calculateNextReviewDue({ data } as any)
        } catch (err) {
          console.error('[AccidentPages] Score calculation error:', err)
        }

        return data
      },
    ],
    afterChange: [
      async ({ doc }) => {
        try {
          const { revalidatePath } = await import('next/cache')
          // Revalidate the accident page path
          revalidatePath(`/accidents/${doc.fullSlug}`)
          // Also revalidate the parent /accidents page since it lists state pages
          if (doc.pageType === 'state') {
            revalidatePath('/accidents')
          }
        } catch {
          // Not in a Next.js server context — silently ignore
        }
      },
    ],
  },
}
