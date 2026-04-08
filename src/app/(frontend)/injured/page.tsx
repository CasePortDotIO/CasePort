import type { Metadata } from 'next'
import InjuredPage from './InjuredClient'

export const metadata: Metadata = {
  title: 'Injured in an Accident?',
  description:
    'Were you injured in an accident? Check if you may have a case. CasePort connects accident victims with qualified personal injury attorneys in their area.',
  alternates: { canonical: 'https://www.caseport.io/injured' },
  openGraph: {
    title: 'Injured in an Accident? \u2014 CasePort',
    description: 'Find out if you may have a personal injury case. Free, confidential case check.',
    url: 'https://www.caseport.io/injured',
    type: 'website',
  },
}

export default function InjuredServerPage() {
  return <InjuredPage />
}
