import { fetchNavData } from '@/lib/navData'
import configPromise from '@payload-config'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import GuideArticleClient from './GuideArticleClient'
import { generateGuideJsonLd } from '@/lib/guide-schema'

export const revalidate = 3600

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ category: string; slug: string }>
  searchParams: Promise<{ preview?: string }>
}): Promise<Metadata> {
  const { category: categorySlug, slug } = await params
  const payload = await getPayload({ config: configPromise })
  const sp = await searchParams
  const isPreview = sp.preview === 'true'

  const { docs: categories } = await payload.find({
    collection: 'guideCategories',
    where: { slug: { equals: categorySlug } },
    depth: 0,
  })
  const category = categories[0]
  if (!category) return {}

  const query: any = isPreview
    ? { slug: { equals: slug } }
    : { slug: { equals: slug }, _status: { equals: 'published' } }

  const { docs } = await payload.find({
    collection: 'guideArticles',
    where: { AND: [{ slug: { equals: slug } }, { guideCategory: { equals: category.id } }] },
    depth: 2,
  })

  const article: any = docs[0]
  if (!article) return {}

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.caseport.io'
  const title = article.metaTitle ?? article.title ?? ''
  const description = article.metaDescription ?? article.excerpt ?? ''

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
    title: isPreview ? `[PREVIEW] ${title}` : title,
    description,
    alternates: {
      canonical: article.canonicalUrl ?? `${siteUrl}/guide/${categorySlug}/${slug}`,
    },
    robots: isPreview ? 'noindex,nofollow' : (article.hideFromSearchEngines ? 'noindex,nofollow' : 'index,follow'),
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

export default async function GuideArticlePage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string; slug: string }>
  searchParams: Promise<{ preview?: string }>
}) {
  const { category: categorySlug, slug } = await params
  const sp = await searchParams
  const isPreview = sp.preview === 'true'
  const payload = await getPayload({ config: configPromise })

  const [{ docs: categories }, navData] = await Promise.all([
    payload.find({
      collection: 'guideCategories',
      where: { slug: { equals: categorySlug } },
      depth: 0,
    }),
    fetchNavData(),
  ])

  const category = categories[0]
  if (!category) notFound()

  const query: any = isPreview
    ? { slug: { equals: slug } }
    : { slug: { equals: slug }, _status: { equals: 'published' } }

  const { docs } = await payload.find({
    collection: 'guideArticles',
    where: { AND: [{ slug: { equals: slug } }, { guideCategory: { equals: category.id } }] },
    draft: isPreview,
    depth: 2,
  })

  const article = docs[0]
  if (!article) notFound()

  return (
    <>
      {isPreview && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          background: 'linear-gradient(to right, #00B4D8, #5BB6C9, #7C5CFF)',
          color: 'white',
          padding: '8px 16px',
          textAlign: 'center',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
        }}>
          <span>PREVIEW MODE - This guide is not published</span>
          <a href="/api/exit-preview" style={{
            background: 'white',
            color: '#00B4D8',
            padding: '4px 12px',
            borderRadius: '4px',
            textDecoration: 'none',
            fontSize: '12px',
            fontWeight: 600,
          }}>
            Exit Preview
          </a>
        </div>
      )}
      <div style={isPreview ? { paddingTop: '48px' } : undefined}>
        <GuideArticleClient article={article} category={category} {...navData} isPreview={isPreview} />
      </div>
      {/* JSON-LD Structured Data */}
      {(() => {
        const schemas = generateGuideJsonLd(article, category)
        return schemas.map((schema: any, i: number) => (
          <script
            key={`guide-schema-${i}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))
      })()}
    </>
  )
}