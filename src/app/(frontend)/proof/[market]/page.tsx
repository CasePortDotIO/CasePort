import type { Metadata } from 'next'
import ProofClient from './ProofClient'

export const metadata: Metadata = {
  title: 'What came through your market | CasePort',
  description:
    'Representative recent personal injury case activity from your territory, redacted, plus a full sample case file. For prospective partner firms.',
  robots: 'noindex',
}

export default async function ProofPage({ params }: { params: Promise<{ market: string }> }) {
  const { market } = await params
  return <ProofClient marketSlug={market} />
}
