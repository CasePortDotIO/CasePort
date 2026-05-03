import type { Metadata } from 'next'
import GuidesHubClient from './GuidesHubClient'

export const metadata: Metadata = {
  title: 'Personal Injury Guides — What to Do, What to Say, What You\'re Owed | www.CasePort.io',
  description: 'Clear, attorney-reviewed guides on personal injury law. What to do after an accident, your rights, how insurance works, and what your case is worth. Plain language. No jargon.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.caseport.io'}/guide`,
  },
  openGraph: {
    title: 'Personal Injury Guides — Plain Language. Attorney Reviewed. | www.CasePort.io',
    description: 'What to do after an accident. What to say to insurance. How long you have to file. What your case is worth. Clear answers from people who know.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.caseport.io'}/guide`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Personal Injury Guides — What to Do, What to Say, What You\'re Owed',
    description: 'Attorney-reviewed guides on personal injury law in plain language. No jargon. No runaround.',
  },
}

export default function GuidePage() {
  return <GuidesHubClient />
}