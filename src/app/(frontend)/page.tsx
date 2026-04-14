import { fetchNavData } from '@/lib/navData'
import type { Metadata } from 'next'
import LandingPage from '../../components/LandingPage'

export const metadata: Metadata = {
  title: 'Get More Signed Cases | Personal Injury Leads & Case Acquisition System',
  description:
    'Premium case acquisition infrastructure for personal injury law firms. Structured, disciplined case flow. 46 markets. 3 firms each. No exceptions.',
  alternates: { canonical: 'https://www.caseport.io' },
}

export default async function HomePage() {
  const navData = await fetchNavData()
  return <LandingPage {...navData} />
}
