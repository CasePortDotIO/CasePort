import type { Metadata } from 'next'
import CityMarketPage from './CityMarketClient'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  // Capitalise slug for title e.g. "los-angeles" → "Los Angeles"
  const city = slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  return {
    title: `${city} Personal Injury Leads`,
    description: `Exclusive personal injury lead market for ${city}. Territorial exclusivity — only 3 partner firms per metro. Pre-funded wallet model. 15-minute response time.`,
    alternates: { canonical: `https://www.caseport.io/markets/${slug}` },
    openGraph: {
      title: `CasePort \u2014 ${city} PI Lead Market`,
      description: `Exclusive personal injury leads in ${city}. 3-firm territorial cap. Apply for access.`,
      url: `https://www.caseport.io/markets/${slug}`,
      type: 'website',
    },
  }
}

export default function MarketSlugPage() {
  return <CityMarketPage />
}
