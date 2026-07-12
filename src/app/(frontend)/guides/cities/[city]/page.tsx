import { fetchNavData } from '@/lib/navData'
import configPromise from '@payload-config'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import CityGuideClient from './CityGuideClient'

export const revalidate = 3600

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>
}): Promise<Metadata> {
  const { city } = await params
  const payload = await getPayload({ config: configPromise })
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.caseport.io'
  const cityName = decodeURIComponent(city)

  const { docs } = await payload.find({
    collection: 'guideArticles',
    where: { AND: [{ pageType: { equals: 'city' } }, { targetCities: { contains: cityName } }] },
    depth: 1,
    limit: 1,
  })

  const article: any = docs[0]

  return {
    title: article?.metaTitle ?? `Personal Injury Guide | ${cityName} | CasePort`,
    description:
      article?.metaDescription ??
      `Learn about personal injury claims, statute of limitations, and settlement ranges in ${cityName}.`,
    alternates: { canonical: `${siteUrl}/guides/cities/${city}` },
    openGraph: {
      title: article?.socialHeadline ?? `Personal Injury Guide | ${cityName} | CasePort`,
      description:
        article?.socialDescription ?? `Learn about personal injury claims in ${cityName}.`,
      url: `${siteUrl}/guides/cities/${city}`,
      type: 'website',
    },
  }
}

export default async function CityGuidePage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params
  const payload = await getPayload({ config: configPromise })
  const cityName = decodeURIComponent(city)

  const { docs } = await payload.find({
    collection: 'guideArticles',
    where: { AND: [{ pageType: { equals: 'city' } }, { targetCities: { contains: cityName } }] },
    depth: 2,
    limit: 1,
  })

  const article = docs[0]

  if (!article) notFound()

  const navData = await fetchNavData()

  return <CityGuideClient article={article} cityName={cityName} {...navData} />
}
