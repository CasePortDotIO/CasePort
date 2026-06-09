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

/**
 * Validates the emitted JSON-LD schemas.
 * Throws if the page would generate Google Search Console errors:
 *   - more than one FAQPage (Google flags as "Duplicate field FAQPage")
 *   - any FAQPage without mainEntity (Google flags as "Missing field mainEntity")
 *
 * Called automatically at the end of generateGuideJsonLd so the build fails
 * the moment a future content edit re-introduces either bug, instead of
 * silently shipping broken structured data to production.
 */
function assertValidSchemas(schemas: any[]): void {
  if (!Array.isArray(schemas) || schemas.length === 0) return

  const faqPageCount = schemas.filter((s) => s?.['@type'] === 'FAQPage').length
  if (faqPageCount > 1) {
    throw new Error(
      `[guide-schema] generateGuideJsonLd emitted ${faqPageCount} FAQPage schemas. ` +
        `Google Search Console will report "Duplicate field FAQPage" as a critical issue. ` +
        `Only one FAQPage schema is allowed per page.`,
    )
  }

  for (const s of schemas) {
    if (s?.['@type'] === 'FAQPage') {
      if (!s.mainEntity || !Array.isArray(s.mainEntity) || s.mainEntity.length === 0) {
        throw new Error(
          `[guide-schema] FAQPage schema is missing required "mainEntity" field ` +
            `(it must contain the Question/Answer array). Google will report ` +
            `"Missing field mainEntity" as a critical issue.`,
        )
      }
      for (const q of s.mainEntity) {
        if (!q?.name) {
          throw new Error(
            `[guide-schema] FAQPage.mainEntity contains a Question without a "name" field. ` +
              `Each Question needs a name and acceptedAnswer.`,
          )
        }
      }
    }
  }
}

export function generateGuideJsonLd(article: any, category: any) {
  const baseUrl = 'https://www.caseport.io'
  const categorySlug = typeof category === 'object' ? category?.slug : 'guide'
  const url = article.canonicalUrl || `${baseUrl}/guides/${categorySlug}/${article.slug}`
  const schemas: any[] = []

  // 1. Article/Guide Schema
  //    If the editor picked schemaType === 'FAQPage', DO NOT emit the main schema
  //    as FAQPage — the FAQPage block below already produces a proper one with
  //    mainEntity. Emitting both causes Google to flag a "Duplicate field FAQPage".
  //    Fall back to 'Article' for the main schema in that case.
  const blocks = article.blocks || []
  const faqs = getFaqsFromBlocks(blocks)
  const requestedType = article.schemaType || 'Article'
  const articleType = requestedType === 'FAQPage' && faqs.length > 0 ? 'Article' : requestedType

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

  // 2. FAQ Schema from FAQAccordion blocks — always emits with proper mainEntity
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
        item: `${baseUrl}/guides`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: category?.title || 'Guide',
        item: `${baseUrl}/guides/${categorySlug}`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: article.title,
        item: url,
      },
    ],
  })

  // Hard guard against Google Search Console errors. The build will fail here
  // if a future content edit re-introduces a duplicate FAQPage or one without
  // mainEntity — better to catch it at build time than in production.
  assertValidSchemas(schemas)

  return schemas
}
