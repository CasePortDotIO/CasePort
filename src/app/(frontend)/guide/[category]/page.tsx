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

  return {
    title: `${cat.title} Guides | CasePort`,
    description: cat.description || `Comprehensive ${cat.title} guides for personal injury victims.`,
    alternates: { canonical: `${siteUrl}/guide/${categorySlug}` },
    openGraph: {
      title: `${cat.title} Guides | CasePort`,
      description: cat.description || `Comprehensive ${cat.title} guides for personal injury victims.`,
      url: `${siteUrl}/guide/${categorySlug}`,
      type: 'website',
    },
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