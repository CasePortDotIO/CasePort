import { Metadata } from 'next'
import RequestAccessWizard from './RequestAccessWizard'

export const metadata: Metadata = {
  title: 'Request Private Access | CasePort',
  description: 'Apply for territorial exclusivity in your market.',
}

export default function RequestAccessPage() {
  return (
    <main className="min-h-screen bg-[#030608] flex flex-col text-white">
      <RequestAccessWizard />
    </main>
  )
}