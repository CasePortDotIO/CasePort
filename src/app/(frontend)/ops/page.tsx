import type { Metadata } from 'next'
import { headers as nextHeaders } from 'next/headers'
import config from '@payload-config'
import { getPayload } from 'payload'
import { loadOpsCockpit, offlineCockpit } from '@/lib/ops/cockpit'
import { OpsCockpitClient } from './OpsCockpitClient'
import { OpsGate } from './OpsGate'
import './ops.css'

/**
 * The internal operations cockpit (/ops). One fused surface for the two engines
 * that share this backend: the CasePort Intelligence Core (which aims) and the
 * Demand Capture Engine (which executes), joined by the shared event log.
 *
 * Internal only. The page is gated to an authenticated CasePort operator; it
 * carries no claimant copy and exposes nothing on a public surface. It renders
 * live data, degrading to an honest offline state when the database is cold.
 */
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'CasePort · Internal Operations',
  robots: { index: false, follow: false },
}

function nowIso(): string {
  return new Date().toISOString()
}

export default async function OpsPage() {
  const generatedAt = nowIso()

  let payload: Awaited<ReturnType<typeof getPayload>> | null = null
  try {
    payload = await getPayload({ config })
  } catch {
    // Cold or absent database (for example a preview deploy). Render offline.
    return <OpsCockpitClient cockpit={offlineCockpit(generatedAt)} operator={null} />
  }

  // Internal only. Require an authenticated CasePort user (H6, internal access).
  let operator: string | null = null
  try {
    const { user } = await payload.auth({ headers: await nextHeaders() })
    operator = user ? (user.email ?? user.id ?? 'operator') : null
  } catch {
    operator = null
  }
  if (!operator) return <OpsGate />

  const cockpit = await loadOpsCockpit(payload, generatedAt)
  return <OpsCockpitClient cockpit={cockpit} operator={operator} />
}
