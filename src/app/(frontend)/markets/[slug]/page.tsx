export const dynamic = 'force-dynamic'
import { fetchNavData } from '@/lib/navData'
import configPromise from '@payload-config'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import CityMarketPage from './CityMarketClient'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params

  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'markets',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  })
  const city = docs[0]?.metro || slug

  return {
    title: `${city} Personal Injury Leads | CasePort`,
    description: `Exclusive personal injury lead market for ${city}. Territorial exclusivity — only 3 partner firms per metro. Pre-funded wallet model. 15-minute response time.`,
    alternates: { canonical: `https://www.caseport.io/markets/${slug}` },
    openGraph: {
      title: `${city} Personal Injury Leads | CasePort`,
      description: `Exclusive personal injury leads in ${city}. 3-firm territorial cap. Apply for access.`,
      url: `https://www.caseport.io/markets/${slug}`,
      type: 'website',
    },
  }
}

export default async function MarketSlugPage() {
  const navData = await fetchNavData()
  return <CityMarketPage {...navData} />
}
