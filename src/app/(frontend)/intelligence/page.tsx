import type { Metadata } from 'next'
import IntelligencePage from './IntelligenceClient'

export const metadata: Metadata = {
  title: 'Intelligence',
  description:
    'Subscribe to CasePort Intelligence — exclusive market data, MII scores, and PI case acquisition insights delivered to qualified firms.',
  alternates: { canonical: 'https://www.caseport.io/intelligence' },
  openGraph: {
    title: 'CasePort Intelligence',
    description:
      'Exclusive market data and PI case acquisition intelligence for growth-oriented law firms.',
    url: 'https://www.caseport.io/intelligence',
    type: 'website',
  },
}

export default function IntelligenceServerPage() {
  return <IntelligencePage />
}
