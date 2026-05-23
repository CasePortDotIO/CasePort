export interface Article {
  headline: string
  subheadline?: string
  slug: string
  directAnswer: string
  eeat: {
    authorName: string
    authorTitle: string
    authorUrl?: string
    publishedAt: string
    lastReviewedAt: string
    reviewedByAttorney?: boolean
    reviewingAttorneyName?: string
  }
  schema: {
    articleHeadline: string
    howToSchemaEnabled?: boolean
    datasetSchemaEnabled?: boolean
    definedTermsEnabled?: boolean
    speakableSelectors?: string[]
  }
  seo: {
    metaTitle: string
    metaDescription: string
    twitterDescription: string
  }
  breadcrumbs?: Array<{ name: string; url: string }>
}

export interface FAQItem {
  question: string
  answerPlainText: string
  lastReviewedAt?: string
  reviewedByAttorney?: boolean
}

export function generateArticleSchema(article: Article) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.schema.articleHeadline,
    datePublished: article.eeat.publishedAt,
    dateModified: article.eeat.lastReviewedAt,
    author: {
      '@type': 'Person',
      name: article.eeat.authorName,
      jobTitle: article.eeat.authorTitle,
      url: article.eeat.authorUrl,
    },
    reviewedBy: article.eeat.reviewedByAttorney
      ? {
          '@type': 'Person',
          name: article.eeat.reviewingAttorneyName,
          jobTitle: 'Licensed Personal Injury Attorney',
        }
      : undefined,
    publisher: {
      '@type': 'Organization',
      name: 'CasePort',
      url: 'https://www.caseport.io',
    },
  }
}

export function generateFAQSchema(faqItems: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answerPlainText,
      },
    })),
  }
}

export function generateHowToSchema(article: Article, steps: Array<{ name: string; text: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: article.schema.articleHeadline,
    step: steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  }
}

export function generateDatasetSchema(article: Article, data: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: article.headline,
    description: article.directAnswer,
    url: `https://www.caseport.io/guides/${article.slug}`,
    datePublished: article.eeat.publishedAt,
    dateModified: article.eeat.lastReviewedAt,
    creator: {
      '@type': 'Organization',
      name: 'CasePort',
    },
  }
}

export function generateWebPageSchema(article: Article) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: article.headline,
    url: `https://www.caseport.io/guides/${article.slug}`,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: article.schema.speakableSelectors || ['.direct-answer-text', '.faq-answer-inner'],
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: (article.breadcrumbs || []).map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: crumb.url,
      })),
    },
  }
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'CasePort',
    url: 'https://www.caseport.io',
    logo: 'https://www.caseport.io/logo.png',
    sameAs: ['https://www.facebook.com/caseport', 'https://www.twitter.com/caseport'],
  }
}

export function generateLegalServiceSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: 'Free Case Review',
    description: 'Get connected with a qualified personal injury attorney',
    url: 'https://www.caseport.io/case-review',
    areaServed: 'US',
    serviceType: 'Personal Injury Case Review',
  }
}
