import config from '@payload-config'
import { getPayload } from 'payload'
import { createIntakeService } from '@/services/IntakeService'
import { createPayloadIntakeDeps } from '@/services/adapters/payload'
import { findClaimantLanguageViolations } from '@/lib/compliance/claimantLanguage'
import { findEvaluativeLeaks } from '@/lib/compliance/assertNoEvaluativeLeak'
import { enforceRateLimit } from '@/lib/rateLimit'

/**
 * The I heard you moment (Section 6 step 4). After the claimant records their
 * statement, one Claude call returns a warm, plain English organization of what
 * they said, shown on a calm card with a confirm button. It reflects their own
 * words back as organization, never as legal evaluation. A court reporter, not a
 * judge. It never says strong case (W2, W6).
 *
 * This is a compliance boundary, tested not trusted. Every line of the generated
 * playback is scanned for legal evaluation and non recommendation language before
 * it can reach the claimant. If the model drifts even once, the violating line is
 * dropped, never surfaced. If nothing compliant survives, a neutral acknowledgment
 * is returned. The claimant only ever sees a calm reflection of their own account.
 */

/** Keep only lines that carry no legal evaluation and no evaluative signal. */
function compliantLines(lines: string[]): string[] {
  return lines
    .map((l) => (typeof l === 'string' ? l.trim() : ''))
    .filter(Boolean)
    .filter((l) => findClaimantLanguageViolations(l).length === 0)
    .filter((l) => findEvaluativeLeaks(l).length === 0)
}

const NEUTRAL_ACK =
  'Thank you. We have your account of what happened on file and organized for a firm in your area to review. ' +
  'You can add anything you feel is missing.'

export async function POST(req: Request) {
  const limited = enforceRateLimit(req, 'playback', { limit: 20, windowMs: 60_000 })
  if (limited) return limited

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'invalid payload' }, { status: 400 })
  }

  const { sessionId, transcript } = (body ?? {}) as { sessionId?: string; transcript?: string }
  if (typeof transcript !== 'string' || !transcript.trim()) {
    return Response.json({ error: 'missing transcript' }, { status: 400 })
  }

  let summary = ''
  let points: string[] = []
  try {
    const payload = await getPayload({ config })
    const intake = createIntakeService(createPayloadIntakeDeps(payload))
    const playback = await intake.showPlayback(
      typeof sessionId === 'string' ? sessionId : 'playback-anon',
      transcript,
    )
    summary = playback.summary
    points = playback.points
  } catch (err) {
    console.error('playback generation failed', err)
  }

  // Guard every line. A summary that drifts is dropped to the neutral floor; only
  // compliant points survive.
  const safeSummary = summary && compliantLines([summary]).length === 1 ? summary.trim() : NEUTRAL_ACK
  const safePoints = compliantLines(points)

  return Response.json({ summary: safeSummary, points: safePoints }, { status: 200 })
}
