'use client'

import dynamic from 'next/dynamic'

// The firm dashboard is a client-only island: wouter drives routing from
// window.location, so we skip SSR to avoid a hydration mismatch on first paint.
const FirmApp = dynamic(() => import('@/firm/FirmApp'), {
  ssr: false,
  loading: () => (
    <div style={{ minHeight: '100vh', background: '#0A0A0A' }} />
  ),
})

export default function FirmDashboardPage() {
  return <FirmApp />
}
