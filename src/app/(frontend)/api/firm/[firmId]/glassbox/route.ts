import config from '@payload-config'
import { getPayload } from 'payload'
import { createGlassBoxService } from '@/services/GlassBoxService'
import { createPayloadGlassBoxDeps } from '@/services/adapters/payloadWallet'

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
  const payload = await getPayload({ config })
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
}
