import { fetchNavData } from '@/lib/navData'
import configPromise from '@payload-config'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import GuidesHubClient from './GuidesHubClient'

export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.caseport.io'
  return {
    title: 'Personal Injury Guides | CasePort',
    description:
      'Comprehensive guides on personal injury law, statute of limitations, settlement ranges, and your legal rights. Written by attorneys, updated quarterly.',
    alternates: { canonical: `${siteUrl}/guide` },
    openGraph: {
      title: 'Personal Injury Guides | CasePort',
      description:
        'Comprehensive guides on personal injury law, statute of limitations, settlement ranges, and your legal rights.',
      url: `${siteUrl}/guide`,
      type: 'website',
    },
  }
}

export default async function GuideHubPage() {
  const payload = await getPayload({ config: configPromise })

  const [{ docs: categories }, navData] = await Promise.all([
    payload.find({
      collection: 'guideCategories',
      sort: 'displayOrder',
      where: {},
      depth: 1,
    }),
    fetchNavData(),
  ])

  return <GuidesHubClient categories={categories} {...navData} />
}