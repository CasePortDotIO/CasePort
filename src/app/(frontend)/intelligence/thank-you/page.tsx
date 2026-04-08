import type { Metadata } from 'next'
import IntelligenceThankYouPage from './IntelligenceThankYouClient'

export const metadata: Metadata = {
  title: 'Thank You — Intelligence Access Requested',
  description:
    "You're on the list. We'll be in touch shortly with your CasePort Intelligence access.",
  robots: { index: false },
}

export default function IntelligenceThankYouServerPage() {
  return <IntelligenceThankYouPage />
}
