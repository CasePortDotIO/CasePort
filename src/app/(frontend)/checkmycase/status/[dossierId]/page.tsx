import type { Metadata } from 'next'
import StatusClient from './StatusClient'

export const metadata: Metadata = {
  title: 'Your case status | CasePort',
  description: 'The current status of your personal injury case file with CasePort.',
  robots: 'noindex',
}

export default async function StatusPage({
  params,
}: {
  params: Promise<{ dossierId: string }>
}) {
  const { dossierId } = await params
  return <StatusClient dossierId={dossierId} />
}
