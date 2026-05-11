export function generateArticleJsonLd(article: any) {
  const baseUrl = 'https://www.caseport.io'
  const url = article.canonicalUrl || `${baseUrl}/insights/${article.slug}`
  const schemas: any[] = []

  // 1. Article Schema — never use FAQPage type here, keep it as Article
  const articleType = article.schemaType === 'FAQPage' ? 'Article' : (article.schemaType || 'Article')
  schemas.push({
    '@context': 'https://schema.org',
    '@type': articleType,
    headline: article.metaTitle || article.title,
    description: article.metaDescription || article.excerpt,
    image: article.openGraph?.ogImage?.url || article.heroImage?.url || [],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      '@type': 'Person',
      name: article.author?.name || 'CasePort Intelligence',
    },
    publisher: {
      '@type': 'Organization',
      name: 'CasePort',
      url: `${baseUrl}`,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
        width: 600,
        height: 60,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  })

  // 2. FAQ Schema — uses faqSection field (Payload collection field name)
  if (article.faqSection && article.faqSection.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: article.faqSection.map((faq: any) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    })
  }

  // 3. HowTo Schema
  if (article.schemaType === 'HowTo' && article.howToSteps && article.howToSteps.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: article.title,
      description: article.excerpt,
      step: article.howToSteps.map((step: any, index: number) => ({
        '@type': 'HowToStep',
        position: index + 1,
        name: step.stepName,
        text: step.stepText,
      })),
    })
  }

  // 4. Speakable Schema
  if (article.speakableSelectors && article.speakableSelectors.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      url: url,
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: article.speakableSelectors.map((s: any) => s.selector),
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
        name: 'Insights',
        item: `${baseUrl}/insights`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
        item: url,
      },
    ],
  })

  return schemas
}
