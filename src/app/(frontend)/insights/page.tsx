import type { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import InsightsClient from './InsightsClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Insights',
  description:
    'Expert analysis on personal injury case acquisition, market intelligence, and law firm growth strategy from the CasePort team.',
  alternates: { canonical: 'https://www.caseport.io/insights' },
  openGraph: {
    title: 'CasePort Insights',
    description:
      'Expert analysis on personal injury case acquisition, market intelligence, and law firm growth strategy.',
    url: 'https://www.caseport.io/insights',
    type: 'website',
  },
}

export default async function InsightsPage() {
  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'articles',
    depth: 1, // Populatable relationships
    sort: '-publishedAt',
  })

  return <InsightsClient fetchedArticles={docs} />
}
