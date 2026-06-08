type Block = { blockType: string; [key: string]: any }

/** Extract FAQ items from blocks */
const getFaqsFromBlocks = (blocks: Block[]): any[] => {
  const faqs: any[] = []
  for (const block of blocks) {
    if (block.blockType === 'faqAccordion' && Array.isArray(block.faqs)) {
      faqs.push(...block.faqs)
    }
  }
  return faqs
}

export function generateGuideJsonLd(article: any, category: any) {
  const baseUrl = 'https://www.caseport.io'
  const categorySlug = typeof category === 'object' ? category?.slug : 'guide'
  const url = article.canonicalUrl || `${baseUrl}/guide/${categorySlug}/${article.slug}`
  const schemas: any[] = []

  // 1. Article/Guide Schema
  const articleType = article.schemaType || 'Article'
  schemas.push({
    '@context': 'https://schema.org',
    '@type': articleType,
    headline: article.metaTitle || article.title,
    description: article.metaDescription || article.excerpt,
    image: article.heroImage?.url || [],
    datePublished: article.publishedDate || article.createdAt,
    dateModified: article.updatedAt,
    author: {
      '@type': 'Person',
      name: article.author?.name || 'CasePort Legal Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'CasePort',
      url: baseUrl,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  })

  // 2. FAQ Schema from FAQAccordion blocks
  const blocks = article.blocks || []
  const faqs = getFaqsFromBlocks(blocks)
  if (faqs.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq: any) => ({
        '@type': 'Question',
        name: faq.question || faq.q || '',
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer || faq.a || '',
        },
      })),
    })
  }

  // 3. HowTo Schema from howToSteps field
  if (article.schemaType === 'HowTo' && article.howToSteps && article.howToSteps.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: article.title,
      description: article.excerpt || article.metaDescription,
      step: article.howToSteps.map((step: any, index: number) => ({
        '@type': 'HowToStep',
        position: index + 1,
        name: step.name || step.stepName || '',
        text: step.description || step.stepText || '',
      })),
    })
  }

  // 4. Speakable Schema from speakableCssSelectors field
  if (article.speakableCssSelectors && article.speakableCssSelectors.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      url: url,
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: article.speakableCssSelectors.map((s: any) => s.selector),
      },
    })
  }

  // 5. Breadcrumb Schema
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Guides',
        item: `${baseUrl}/guide`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: category?.title || 'Guide',
        item: `${baseUrl}/guide/${categorySlug}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: article.title,
        item: url,
      },
    ],
  })

  return schemas
}
