import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { OpsCockpitClient } from '../OpsCockpitClient'
import { SAMPLE_COCKPIT } from '@/lib/ops/sampleCockpit'
import '../ops.css'

/**
 * A design preview of the /ops console, rendered with representative sample data
 * so the layout can be reviewed without a seeded database. It is off by default
 * and only renders when OPS_PREVIEW is explicitly set, so it never ships as a
 * live route. It carries a visible sample data label and is never indexed.
 */
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'CasePort · Operations Console Preview',
  robots: { index: false, follow: false },
}

export default function OpsPreviewPage() {
  if (process.env.OPS_PREVIEW !== '1') notFound()
  return (
    <div className="relative">
      <div
        className="ops-mono"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          textAlign: 'center',
          fontSize: 10,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          padding: '3px 0',
          color: '#a8842f',
          background: 'rgba(201,168,76,0.12)',
        }}
      >
        Design preview · sample data · not live console
      </div>
      <OpsCockpitClient cockpit={SAMPLE_COCKPIT} operator="ops@caseport.io" />
    </div>
  )
}
