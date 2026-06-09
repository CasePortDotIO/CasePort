import { fetchNavData } from '@/lib/navData'
import configPromise from '@payload-config'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import CategoryGuideClient from './CategoryGuideClient'

export const revalidate = 3600

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>
}): Promise<Metadata> {
  const { category: categorySlug } = await params
  const payload = await getPayload({ config: configPromise })
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.caseport.io'

  const { docs } = await payload.find({
    collection: 'guideCategories',
    where: { slug: { equals: categorySlug } },
    depth: 1,
  })

  const cat = docs[0]
  if (!cat) return {}

  const title = cat.metaTitle || `${cat.title} Guides | CasePort`
  const description = cat.metaDescription || cat.description || `Comprehensive ${cat.title} guides for personal injury victims.`
  const canonicalUrl = cat.canonicalUrl || `${siteUrl}/guides/${categorySlug}`

  const twitterImages: string[] = []
  if (typeof cat.xCardImage === 'object' && cat.xCardImage?.url) twitterImages.push(cat.xCardImage.url)
  else if (typeof cat.socialShareImage === 'object' && cat.socialShareImage?.url) twitterImages.push(cat.socialShareImage.url)
  else if (typeof cat.heroImage === 'object' && cat.heroImage?.url) twitterImages.push(cat.heroImage.url)

  const ogImage = typeof cat.socialShareImage === 'object' && cat.socialShareImage?.url
    ? [{ url: cat.socialShareImage.url, width: 1200, height: 630 }]
    : typeof cat.heroImage === 'object' && cat.heroImage?.url
      ? [{ url: cat.heroImage.url, width: 1200, height: 630 }]
      : []

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: cat.socialHeadline || title,
      description: cat.socialDescription || description,
      images: ogImage,
      type: 'website',
      siteName: 'CasePort',
    },
    twitter: {
      card: cat.xCardType ?? 'summary_large_image',
      title: cat.xCardTitle || cat.socialHeadline || title,
      description: cat.xCardDescription || cat.socialDescription || description,
      images: twitterImages,
    },
    robots: cat.hideFromSearchEngines ? 'noindex,nofollow' : 'index,follow',
  }
}

export default async function CategoryGuidePage({
  params,
}: {
  params: Promise<{ category: string }>
}) {
  const { category: categorySlug } = await params
  const payload = await getPayload({ config: configPromise })

  const [{ docs: categories }, navData] = await Promise.all([
    payload.find({
      collection: 'guideCategories',
      where: { slug: { equals: categorySlug } },
      depth: 1,
    }),
    fetchNavData(),
  ])

  const category = categories[0]
  if (!category) notFound()

  const { docs: articles } = await payload.find({
    collection: 'guideArticles',
    where: { guideCategory: { equals: category.id } },
    depth: 2,
    sort: 'publishedDate',
  })

  return (
    <CategoryGuideClient
      category={category}
      articles={articles}
      {...navData}
    />
  )
}