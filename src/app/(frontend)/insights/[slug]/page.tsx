import { generateArticleJsonLd } from '@/lib/article-schema'
import { fetchNavData } from '@/lib/navData'
import configPromise from '@payload-config'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import ArticleClient from './ArticleClient'

export const revalidate = 3600

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
    depth: 2,
  })
  const article: any = docs[0]
  if (!article) return {}

  const title = article.metaTitle ?? article.title ?? ''
  const description = article.metaDescription ?? article.excerpt ?? ''

  // Twitter structure
  const twitterImages = article.xCardImage?.url
    ? [article.xCardImage.url]
    : article.socialShareImage?.url
      ? [article.socialShareImage.url]
      : article.heroImage?.url
        ? [article.heroImage.url]
        : []

  const updateLog = article.contentUpdateHistory || []
  const lastModified =
    updateLog.length > 0
      ? updateLog[updateLog.length - 1].date
      : article.lastFactVerified || article.updatedAt

  return {
    title,
    description,
    alternates: {
      canonical:
        article.canonicalUrl ??
        `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.caseport.io'}/insights/${slug}`,
    },
    robots: article.hideFromSearchEngines ? 'noindex,nofollow' : 'index,follow',
    openGraph: {
      title: article.socialHeadline ?? article.metaTitle ?? article.title,
      description: article.socialDescription ?? article.metaDescription ?? article.excerpt,
      images: article.socialShareImage?.url
        ? [{ url: article.socialShareImage.url, width: 1200, height: 630 }]
        : article.heroImage?.url
          ? [{ url: article.heroImage.url, width: 1200, height: 630 }]
          : [],
      type: 'article',
      publishedTime: article.publishedDate || article.createdAt,
      modifiedTime: lastModified,
      siteName: 'CasePort',
    },
    twitter: {
      card: article.xCardType ?? 'summary_large_image',
      title: article.xCardTitle ?? article.socialHeadline ?? article.metaTitle ?? article.title,
      description: article.xCardDescription ?? article.socialDescription ?? article.metaDescription,
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
      where: {
        slug: { equals: slug },
        _status: { equals: 'published' },
      },
      depth: 2,
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
      {schemas.map((schema, i) => (
        <script
          key={`schema-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <ArticleClient article={article} {...navData} />
    </>
  )
}
