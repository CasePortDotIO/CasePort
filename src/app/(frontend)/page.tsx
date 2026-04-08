import type { Metadata } from 'next'
import LandingPage from '../../components/LandingPage'

export const metadata: Metadata = {
  title: 'CasePort — Case Flow Without Guesswork',
  description:
    'Premium case acquisition infrastructure for personal injury law firms. Structured, disciplined case flow. 46 markets. 3 firms each. No exceptions.',
  alternates: { canonical: 'https://www.caseport.io' },
}

export default function HomePage() {
  return <LandingPage />
}
