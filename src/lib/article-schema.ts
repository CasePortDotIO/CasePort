export function generateArticleJsonLd(article: any) {
  const baseUrl = 'https://caseport.io'
  const url = article.canonicalUrl || `${baseUrl}/insights/${article.slug}`
  const schemas: any[] = []

  // 1. Article Schema
  schemas.push({
    '@context': 'https://schema.org',
    '@type': article.schemaType || 'Article',
    headline: article.metaTitle || article.title,
    description: article.metaDescription || article.excerpt,
    image: article.openGraph?.ogImage?.url || article.heroImage?.url || [],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: {
      '@type': 'Person',
      name: article.author?.name || 'CasePort Editorial',
    },
    publisher: {
      '@type': 'Organization',
      name: 'CasePort',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  })

  // 2. FAQ Schema
  if (article.faqs && article.faqs.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: article.faqs.map((faq: any) => ({
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
