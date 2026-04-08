import type { Metadata } from 'next'
import ForLawFirmsPage from './ForLawFirmsClient'

export const metadata: Metadata = {
  title: 'For Law Firms',
  description:
    'How CasePort works for personal injury law firms. Territorial exclusivity, pre-funded wallet model, and 15-minute case delivery. Built for growth-oriented PI firms.',
  alternates: { canonical: 'https://www.caseport.io/for-law-firms' },
  openGraph: {
    title: 'CasePort for Personal Injury Law Firms',
    description:
      'Structured, disciplined case flow for PI firms. Territorial exclusivity. 46 markets. 3 firms each.',
    url: 'https://www.caseport.io/for-law-firms',
    type: 'website',
  },
}

export default function ForLawFirmsServerPage() {
  return <ForLawFirmsPage />
}
