/*
  SEO / GEO / AEO / SGE Structured Data — WORLD-CLASS
  Schema.org JSON-LD for: Organization, WebSite, Blog (all 9 BlogPostings),
  FAQPage, BreadcrumbList, Service, ItemList (carousel), Speakable
  Targets: Google SGE, Bing Copilot, Perplexity, ChatGPT search, voice assistants
*/

import { articles } from '@/lib/articles'

export default function StructuredData() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'CasePort',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.caseport.io',
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.caseport.io'}/logo.png`,
    description:
      'Premium case acquisition system for personal injury law firms. CasePort provides structured, disciplined case flow infrastructure for growth-oriented PI firms.',
    email: 'access@caseport.io',
    areaServed: {
      '@type': 'Country',
      name: 'United States',
    },
    knowsAbout: [
      'Personal injury lead generation',
      'Case acquisition systems',
      'Legal marketing',
      'Intake optimization',
      'PI law firm growth',
      'Legal SEO',
      'Generative Engine Optimization',
    ],
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'CasePort',
    url: 'https://www.caseport.io',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://www.caseport.io/insights?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }

  // Generate BlogPosting entries for ALL articles with dateModified
  const blogPostings = articles.map((article) => {
    // Convert "Mar 22, 2026" to "2026-03-22"
    const dateObj = new Date(article.date)
    const isoDate = dateObj.toISOString().split('T')[0]

    return {
      '@type': 'BlogPosting',
      headline: article.title,
      description: article.excerpt,
      datePublished: isoDate,
      dateModified: isoDate,
      author: { '@type': 'Organization', name: 'CasePort' },
      publisher: {
        '@type': 'Organization',
        name: 'CasePort',
        logo: {
          '@type': 'ImageObject',
          url: 'https://www.caseport.io/logo.png',
        },
      },
      mainEntityOfPage: `https://www.caseport.io/insights/${article.slug}`,
      keywords: article.tags.join(', '),
      articleSection: article.category,
      speakable: {
        '@type': 'SpeakableSpecification',
        cssSelector: ['h1', 'h2', "[itemProp='headline']", "[itemProp='description']"],
      },
    }
  })

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'CasePort Insights',
    url: 'https://www.caseport.io/insights',
    description:
      'Strategic analysis on personal injury case acquisition, intake performance, search visibility, lead economics, and market signals for growth-oriented PI law firms.',
    publisher: {
      '@type': 'Organization',
      name: 'CasePort',
      url: 'https://www.caseport.io',
    },
    inLanguage: 'en-US',
    about: [
      { '@type': 'Thing', name: 'Personal Injury Lead Generation' },
      { '@type': 'Thing', name: 'Case Acquisition Strategy' },
      { '@type': 'Thing', name: 'Law Firm Intake Optimization' },
      { '@type': 'Thing', name: 'Legal SEO and GEO' },
      { '@type': 'Thing', name: 'Generative Engine Optimization' },
      { '@type': 'Thing', name: 'Answer Engine Optimization' },
    ],
    blogPost: blogPostings,
  }

  // ItemList schema for Google carousel rich result
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'CasePort Insights Articles',
    description: 'Case acquisition intelligence articles for personal injury law firms',
    numberOfItems: articles.length,
    itemListElement: articles.map((article, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: article.title,
      url: `https://www.caseport.io/insights/${article.slug}`,
    })),
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is a case acquisition system?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A case acquisition system is a structured infrastructure that helps personal injury law firms attract, qualify, route, and retain cases through disciplined processes rather than ad hoc lead buying. It combines demand generation, intake optimization, and conversion tracking into a unified system designed to maximize retained case value.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do law firms get car accident cases?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Law firms acquire car accident cases through multiple channels including paid search advertising, organic SEO, local service ads, referral networks, and case acquisition platforms. The most effective firms combine owned visibility through search optimization with structured intake systems that minimize response delay and maximize conversion from inquiry to signed retainer.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the best personal injury lead generation strategy?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The most effective personal injury lead generation strategies focus on building owned demand through search visibility (SEO and GEO), optimizing intake speed and qualification, and maintaining disciplined follow-up processes. Rather than relying solely on purchased leads, growth-oriented firms invest in systems that control the full path from demand to retained case value.',
        },
      },
      {
        '@type': 'Question',
        name: 'How much do personal injury leads cost?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Personal injury lead costs vary significantly by market, practice area, and acquisition channel. Exclusive auto accident leads typically range from $150 to $500+ per lead depending on geography and competition. However, cost-per-lead is less important than cost-per-signed-case, which factors in intake conversion rates, qualification standards, and retained case value.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is GEO in legal marketing?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'GEO (Generative Engine Optimization) is the practice of optimizing content to appear in AI-generated search results and answer engines like Google SGE, Bing Copilot, and Perplexity. For law firms, GEO involves structuring content so it can be easily retrieved, summarized, and cited by AI systems when users ask questions about personal injury topics.',
        },
      },
      {
        '@type': 'Question',
        name: 'How can law firms improve intake conversion rates?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Law firms can improve intake conversion rates by reducing response time to under 5 minutes, implementing structured qualification scripts, establishing clear routing protocols for different case types, training intake staff on empathetic communication, and tracking conversion metrics at each stage of the intake funnel.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is AEO and why does it matter for law firms?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'AEO (Answer Engine Optimization) is the practice of structuring content so AI systems can easily retrieve, summarize, and cite it when answering user queries. For law firms, AEO matters because an increasing share of potential clients are getting answers from AI assistants rather than traditional search results.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the difference between SEO and GEO for lawyers?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'SEO focuses on ranking in traditional organic search results through keyword optimization and backlink building. GEO (Generative Engine Optimization) focuses on making content retrievable and citable by AI answer engines like Google SGE, Bing Copilot, and Perplexity. Both are important — SEO captures high-intent local searches, while GEO ensures visibility in AI-generated answers.',
        },
      },
    ],
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.caseport.io',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Insights',
        item: 'https://www.caseport.io/insights',
      },
    ],
  }

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'CasePort Case Acquisition System',
    provider: {
      '@type': 'Organization',
      name: 'CasePort',
    },
    description:
      'A premium case acquisition system for personal injury law firms that provides structured, market-capped lead generation with exclusive territory protection, transparent reporting, and compliance-first design.',
    areaServed: {
      '@type': 'Country',
      name: 'United States',
    },
    serviceType: 'Legal Lead Generation',
    audience: {
      '@type': 'Audience',
      audienceType: 'Personal Injury Law Firms',
    },
  }

  // Speakable schema for voice search
  const speakableSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'CasePort Insights',
    url: 'https://www.caseport.io/insights',
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: [
        'h1',
        "[aria-labelledby='faq-heading'] h3",
        "[itemProp='text']",
        "meta[name='description']",
      ],
    },
  }

  const schemas = [
    organizationSchema,
    websiteSchema,
    blogSchema,
    itemListSchema,
    faqSchema,
    breadcrumbSchema,
    serviceSchema,
    speakableSchema,
  ]

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  )
}
