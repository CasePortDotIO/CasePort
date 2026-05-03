import type { Metadata } from 'next'
import IntelligencePage from './IntelligenceClient'

export const metadata: Metadata = {
  title: 'Private Intelligence for Personal Injury Law Firms | CasePort',
  description:
    'Subscribe to CasePort Intelligence — exclusive market data, MII scores, and PI case acquisition insights delivered to qualified firms.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.caseport.io'}/intelligence`,
  },
  openGraph: {
    title: 'Private Intelligence for Personal Injury Law Firms | CasePort',
    description:
      'Exclusive market data and PI case acquisition intelligence for growth-oriented law firms.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.caseport.io'}/intelligence`,
    type: 'website',
  },
}

export default function IntelligenceServerPage() {
  return <IntelligencePage />
}
