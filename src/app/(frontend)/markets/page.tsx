export const dynamic = 'force-dynamic'
import { fetchNavData } from '@/lib/navData'
import configPromise from '@payload-config'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import MarketPage from './MarketsClient'

// Cache for 1 hour — markets data changes infrequently.
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'CasePort Markets | Personal Injury Leads & Controlled Case Opportunities by City',
  description:
    'Browse all 46 active personal injury lead markets. Territorial exclusivity for 3 firms per metro. Real-time availability and Market Intelligence Index scores.',
  alternates: { canonical: 'https://www.caseport.io/markets' },
  openGraph: {
    title: 'CasePort Markets | Personal Injury Leads & Controlled Case Opportunities by City',
    description:
      'Territorial exclusivity for 3 firms per metro. Browse availability across all 46 markets.',
    url: 'https://www.caseport.io/markets',
    type: 'website',
  },
}

export default async function MarketsPage() {
  const payload = await getPayload({ config: configPromise })

  const [{ docs: markets }, marketsPageGlobal, navData] = await Promise.all([
    payload.find({ collection: 'markets', limit: 200, depth: 0 }),
    payload.findGlobal({ slug: 'markets-page', depth: 0 }).catch(() => null),
    fetchNavData(),
  ])

  const initialFaqs: { question: string; answer: string }[] = (marketsPageGlobal as any)?.faqs ?? []

  return <MarketPage initialMarkets={markets} initialFaqs={initialFaqs} {...navData} />
}
