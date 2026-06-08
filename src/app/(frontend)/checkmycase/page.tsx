import type { Metadata } from 'next'
import CheckMyCaseClient from './CheckMyCaseClient'

export const metadata: Metadata = {
  title: 'Check My Case | CasePort',
  description: 'Check if you may have a personal injury case. Free, confidential case review powered by CasePort.',
  robots: 'noindex',
}

export default function CheckMyCasePage() {
  return <CheckMyCaseClient />
}