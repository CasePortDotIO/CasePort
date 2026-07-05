import config from '@payload-config'
import { getPayload } from 'payload'
import { createGlassBoxService } from '@/services/GlassBoxService'
import { createPayloadGlassBoxDeps } from '@/services/adapters/payloadWallet'
import { guardFirmAccess } from '@/lib/firmAuth'

/**
 * The firm's Glass Box (Section 7). Serves only the requesting firm's own data:
 * its wallet and ledger (every dollar auditable), its deliveries and response
 * times, plus the redacted proof of reality feed for its territory and a sample
 * dossier. It never rates other firms and never implies CasePort vetted anyone.
 *
 * Firm scoping is enforced by the service: every read is filtered by firmId. A
 * real firm session will bind firmId from auth; for now it is the path param.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ firmId: string }> }) {
  const { firmId } = await params
  try {
    const payload = await getPayload({ config })
    const denied = await guardFirmAccess(payload, _req, firmId)
    if (denied) return denied
    const glass = createGlassBoxService(createPayloadGlassBoxDeps(payload))

    const [wallet, proofFeed, deliveries] = await Promise.all([
      glass.walletView(firmId),
      glass.proofOfRealityFeed(firmId, 12),
      glass.firmGlassBox(firmId),
    ])

    return Response.json({
      firmId,
      wallet,
      proofFeed,
      deliveries: deliveries.deliveries,
      sampleDossier: glass.sampleDossier(),
    })
  } catch {
    // Degrade gracefully so the firm dashboard renders its honest empty state
    // rather than surfacing a 500 when the backend is briefly unavailable.
    return Response.json({ error: 'unavailable' }, { status: 503 })
  }
}
