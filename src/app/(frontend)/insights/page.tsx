import { fetchNavData } from '@/lib/navData'
import configPromise from '@payload-config'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import InsightsClient from './InsightsClient'

// Cache for 1 hour; Next.js revalidates in the background so users always
// hit a pre-built page instead of waiting for a DB round-trip.
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'CasePort Insights | Personal Injury Lead Generation, Intake & Case Acquisition',
  description:
    'Expert analysis on personal injury case acquisition, market intelligence, and law firm growth strategy from the CasePort team.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.caseport.io'}/insights`,
  },
  openGraph: {
    title: 'CasePort Insights | Personal Injury Lead Generation, Intake & Case Acquisition',
    description:
      'Expert analysis on personal injury case acquisition, market intelligence, and law firm growth strategy.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.caseport.io'}/insights`,
    type: 'website',
  },
}

export default async function InsightsPage() {
  const payload = await getPayload({ config: configPromise })

  const [{ docs, totalDocs: articleCount }, { docs: categories }, navData] = await Promise.all([
    payload.find({
      collection: 'articles',
      where: { _status: { equals: 'published' } },
      depth: 2,
      sort: '-publishedAt',
      limit: 100,
    }),
    payload.find({
      collection: 'categories',
      depth: 0,
      limit: 100,
    }),
    fetchNavData(),
  ])

  return (
    <InsightsClient
      fetchedArticles={docs}
      fetchedCategories={categories}
      articleCount={articleCount}
      {...navData}
    />
  )
}
