import type { Block } from 'payload'

const role = (r: string, text: string) => `[${r.toUpperCase()}] ${text}`

// ─── Category Page Block Library ──────────────────────────────────────────────

const CategoryDirectAnswer: Block = {
  slug: 'categoryDirectAnswer',
  labels: { singular: 'Direct Answer', plural: 'Direct Answers' },
  fields: [
    { name: 'heading', type: 'text', label: 'Capsule Heading' },
    { name: 'text', type: 'textarea', label: 'Lead Text', admin: { description: 'Capsule lead text shown below the heading.' } },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'authors',
      label: 'Author',
      admin: { description: 'Select the author shown in the Capsule review line.' },
    },
  ],
}

const CategoryQuickAnswerStats: Block = {
  slug: 'categoryQuickAnswerStats',
  labels: { singular: 'Stat Tiles', plural: 'Stat Tiles' },
  fields: [
    { name: 'average', type: 'text', label: 'Average Settlement' },
    { name: 'successRate', type: 'text', label: 'Success Rate' },
    { name: 'timeline', type: 'text', label: 'Timeline' },
    { name: 'upfront', type: 'text', label: 'Upfront Cost' },
  ],
}

const CategoryKeyTakeaways: Block = {
  slug: 'categoryKeyTakeaways',
  labels: { singular: 'Key Takeaways', plural: 'Key Takeaways' },
  fields: [
    {
      name: 'items',
      type: 'array',
      label: 'Takeaway Items',
      fields: [
        { name: 'fact', type: 'text', required: true, label: 'Fact' },
      ],
    },
  ],
}

const CategoryProseSections: Block = {
  slug: 'categoryProseSections',
  labels: { singular: 'Prose Sections', plural: 'Prose Sections' },
  fields: [
    {
      name: 'sections',
      type: 'array',
      label: 'Sections',
      fields: [
        { name: 'title', type: 'text', required: true, label: 'Section Title' },
        {
          name: 'paras',
          type: 'array',
          label: 'Paragraphs',
          fields: [
            { name: 'text', type: 'textarea', required: true, label: 'Paragraph Text' },
          ],
        },
      ],
    },
  ],
}

const CategoryFAQ: Block = {
  slug: 'categoryFAQ',
  labels: { singular: 'FAQ Accordion', plural: 'FAQ Accordions' },
  fields: [
    {
      name: 'items',
      type: 'array',
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
      ],
    },
  ],
}

const CategoryStatuteDeadlines: Block = {
  slug: 'categoryStatuteDeadlines',
  labels: { singular: 'Statute of Limitations', plural: 'Statutes of Limitations' },
  fields: [
    { name: 'description', type: 'textarea', label: 'Section Description' },
    {
      name: 'byState',
      type: 'array',
      label: 'Deadline by State',
      fields: [
        { name: 'state', type: 'text', required: true },
        { name: 'years', type: 'number', label: 'Years' },
        { name: 'notes', type: 'text', label: 'Notes' },
      ],
    },
  ],
}

const CategoryWhyImportant: Block = {
  slug: 'categoryWhyImportant',
  labels: { singular: 'Why This Matters', plural: 'Why This Matters' },
  fields: [
    {
      name: 'intro',
      type: 'textarea',
      label: 'Intro Text',
      admin: { description: role('str', 'Main body text for the Why This Matters section.') },
    },
    {
      name: 'points',
      type: 'array',
      label: 'Key Points',
      admin: { description: 'Left-bordered callout boxes below the intro.' },
      fields: [
        { name: 'heading', type: 'text', required: true, label: 'Point Heading' },
        { name: 'body', type: 'textarea', label: 'Point Body' },
      ],
    },
  ],
}

const CategorySectionTOC: Block = {
  slug: 'categorySectionTOC',
  labels: { singular: 'Section TOC', plural: 'Section TOCs' },
  fields: [],
}

const CategoryRelatedGuides: Block = {
  slug: 'categoryRelatedGuides',
  labels: { singular: 'Related Guide Articles', plural: 'Related Guide Articles' },
  fields: [
    {
      name: 'articles',
      type: 'relationship',
      relationTo: 'guideArticles',
      hasMany: true,
      label: 'Guide Articles',
      admin: { description: 'Select the Guide New articles to display.' },
    },
  ],
}

const CategoryTakeHome: Block = {
  slug: 'categoryTakeHome',
  labels: { singular: 'Take the Next Step', plural: 'Take the Next Step' },
  fields: [],
}

const CategoryHowWeKeepAccurate: Block = {
  slug: 'categoryHowWeKeepAccurate',
  labels: { singular: 'How We Keep This Accurate', plural: 'How We Keep This Accurate' },
  fields: [
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'authors',
      label: 'Author',
    },
    {
      name: 'detail',
      type: 'textarea',
      label: 'Detail',
      admin: { description: 'Summary or detail text shown with the author.' },
    },
  ],
}

const CategorySources: Block = {
  slug: 'categorySources',
  labels: { singular: 'Sources & Citations', plural: 'Sources & Citations' },
  fields: [
    {
      name: 'citeTitle',
      type: 'text',
      label: 'Cite Title',
      admin: { description: 'Title shown in the citation (e.g. "Car Accident Guide").' },
    },
    {
      name: 'sources',
      type: 'array',
      label: 'Sources',
      fields: [
        { name: 'name', type: 'text', required: true, label: 'Source Name' },
        { name: 'url', type: 'text', required: true, label: 'Source URL' },
      ],
    },
  ],
}

const CategoryExploreMore: Block = {
  slug: 'categoryExploreMore',
  labels: { singular: 'Explore More Guides', plural: 'Explore More Guides' },
  fields: [
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'guideCategories',
      hasMany: true,
      label: 'Categories to Show',
      admin: { description: 'Select which category guides to display in this section.' },
    },
  ],
}

// ─── Block Registry ────────────────────────────────────────────────────────────

export const CATEGORY_BLOCKS: Block[] = [
  CategoryDirectAnswer,
  CategoryQuickAnswerStats,
  CategoryKeyTakeaways,
  CategoryProseSections,
  CategoryFAQ,
  CategoryStatuteDeadlines,
  CategoryWhyImportant,
  CategorySectionTOC,
  CategoryRelatedGuides,
  CategoryTakeHome,
  CategoryHowWeKeepAccurate,
  CategoryExploreMore,
  CategorySources,
]
