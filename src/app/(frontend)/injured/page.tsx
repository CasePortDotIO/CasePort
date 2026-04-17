import type { Metadata } from 'next'
import InjuredPage from './InjuredClient'

export const metadata: Metadata = {
  title: 'Injured in an Accident? Get Connected to a Personal Injury Lawyer Fast | CasePort',
  description:
    'Were you injured in an accident? Check if you may have a case. CasePort connects accident victims with qualified personal injury attorneys in their area.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.caseport.io'}/injured`,
  },
  openGraph: {
    title: 'Injured in an Accident? Get Connected to a Personal Injury Lawyer Fast | CasePort',
    description: 'Find out if you may have a personal injury case. Free, confidential case check.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.caseport.io'}/injured`,
    type: 'website',
  },
}

export default function InjuredServerPage() {
  return <InjuredPage />
}
