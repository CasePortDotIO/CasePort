import config from '@payload-config'
import { getPayload } from 'payload'
import { createIntakeService } from '@/services/IntakeService'
import { createPayloadIntakeDeps } from '@/services/adapters/payload'
import { ComplianceService } from '@/services/ComplianceService'
import { enforceRateLimit } from '@/lib/rateLimit'
import { storeClaimantMedia, fileFromForm, MAX_MEDIA_BYTES } from '@/lib/mediaUpload'

/**
 * Insurance card auto fill (Section 6 step 2). The claimant photographs their
 * card and Claude Vision reads the printed fields back so they write nothing
 * down. The card is stored as a photo (PhotoUploaded, kind insurance-card) and
 * parsed into structured fields (VisionParsed) through the domain service, so the
 * whole capture is on the immutable event log (Section 4).
 *
 * The returned fields are the plain data printed on the claimant's own card
 * (carrier, policy number, named insured). They are firm facing case material and
 * carry no evaluative signal, so nothing here exposes SCPS, value, or severity
 * (W2). The response is still guarded before it is serialized, belt and
 * suspenders. Resilient: if Vision is unavailable the claimant simply types the
 * details, intake is never blocked on a paid AI call.
 */
export async function POST(req: Request) {
  // A paid Vision call per submission, so it is rate limited per IP.
  const limited = enforceRateLimit(req, 'vision', { limit: 20, windowMs: 60_000 })
  if (limited) return limited

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return Response.json({ error: 'expected multipart form data' }, { status: 400 })
  }

  const file = fileFromForm(form, 'file')
  if (!file) return Response.json({ error: 'missing card image' }, { status: 400 })
  if (file.size > MAX_MEDIA_BYTES) return Response.json({ error: 'image too large' }, { status: 413 })

  const sessionId = String(form.get('sessionId') || '') || 'vision-anon'

  let fields: Record<string, string> = {}
  try {
    const payload = await getPayload({ config })
    const intake = createIntakeService(createPayloadIntakeDeps(payload))
    const stored = await storeClaimantMedia(payload, { file, alt: 'insurance card' })
    const result = await intake.parseInsuranceCard(sessionId, stored.key)
    fields = result.fields
  } catch (err) {
    // Never block intake on a storage or parse failure; the claimant can type it.
    console.error('vision parse failed', err)
    fields = {}
  }

  const body = { fields, parsed: Object.keys(fields).length > 0 }
  // The fields are the claimant's own card data, never evaluative, but guard the
  // response anyway so nothing evaluative can ever ride out on this surface.
  ComplianceService.guardClaimantPayload(body)
  return Response.json(body, { status: 200 })
}
