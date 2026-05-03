import type { Metadata } from 'next'
import TestingInjuredClient from './TestingInjuredClient'

export const metadata: Metadata = {
  title: 'What to Do After a Car Accident | Free Personal Injury Case Review | CasePort',
  description: 'Hurt in a car, truck, or motorcycle accident? Free private 2-minute case review. Attorney matched within 15 minutes. No obligation. Active in 38 states.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.caseport.io'}/testinginjured`,
  },
  openGraph: {
    title: 'Hurt in an Accident? Get a Free Case Review | CasePort',
    description: 'Whether it just happened or was days ago — you have options. Free private 2-minute case review. Attorney matched within 15 minutes.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.caseport.io'}/testinginjured`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hurt in an Accident? Here\'s Your Next Move | CasePort',
    description: 'Free private 2-minute personal injury case review. Attorney matched within 15 minutes. No obligation. 38 states.',
  },
}

export default function TestingInjuredPage() {
  return <TestingInjuredClient />
}