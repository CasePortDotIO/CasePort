import { generateArticleJsonLd } from '@/lib/article-schema'
import { fetchNavData } from '@/lib/navData'
import configPromise from '@payload-config'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import ArticleClient from './ArticleClient'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'articles',
    where: { slug: { equals: slug } },
    depth: 0,
  })
  const article: any = docs[0]
  if (!article) return {}

  const title = article.metaTitle ?? article.title ?? ''
  const description = article.metaDescription ?? article.excerpt ?? ''

  // Twitter structure
  const twitterImages = article.twitterCard?.twitterImage?.url
    ? [article.twitterCard.twitterImage.url]
    : article.openGraph?.ogImage?.url
      ? [article.openGraph.ogImage.url]
      : []

  return {
    title,
    description,
    alternates: {
      canonical: article.canonicalUrl ?? `https://caseport.io/insights/${slug}`,
    },
    robots: article.noIndex ? 'noindex,nofollow' : 'index,follow',
    openGraph: {
      title: article.openGraph?.ogTitle ?? article.metaTitle ?? article.title,
      description: article.openGraph?.ogDescription ?? article.metaDescription ?? article.excerpt,
      images: article.openGraph?.ogImage?.url
        ? [{ url: article.openGraph.ogImage.url, width: 1200, height: 630 }]
        : [],
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      siteName: 'CasePort',
    },
    twitter: {
      card: article.twitterCard?.twitterCardType ?? 'summary_large_image',
      title: article.twitterCard?.twitterTitle ?? article.metaTitle ?? article.title,
      description: article.twitterCard?.twitterDescription ?? article.metaDescription,
      images: twitterImages,
    },
  }
}

export default async function InsightsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const [{ docs }, navData] = await Promise.all([
    payload.find({
      collection: 'articles',
      where: { slug: { equals: slug } },
      depth: 1,
    }),
    fetchNavData(),
  ])

  const article = docs[0]

  if (!article) {
    notFound()
  }

  const schemas = generateArticleJsonLd(article)

  return (
    <>
      <head>
        {schemas.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </head>
      <ArticleClient article={article} {...navData} />
    </>
  )
}
