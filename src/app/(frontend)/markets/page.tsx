import type { Metadata } from 'next'
import MarketPage from './MarketsClient'

export const metadata: Metadata = {
  title: 'Markets',
  description:
    'Browse all 46 active personal injury lead markets. Territorial exclusivity for 3 firms per metro. Real-time availability and Market Intelligence Index scores.',
  alternates: { canonical: 'https://www.caseport.io/markets' },
  openGraph: {
    title: 'CasePort Markets \u2014 46 Exclusive PI Lead Markets',
    description:
      'Territorial exclusivity for 3 firms per metro. Browse availability across all 46 markets.',
    url: 'https://www.caseport.io/markets',
    type: 'website',
  },
}

export default function MarketsPage() {
  return <MarketPage />
}
