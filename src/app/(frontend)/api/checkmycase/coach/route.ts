import config from '@payload-config'
import { getPayload } from 'payload'
import { createIntakeService } from '@/services/IntakeService'
import { createPayloadIntakeDeps } from '@/services/adapters/payload'
import { createEvidenceCoachingAgent } from '@/agents/EvidenceCoachingAgent'
import { ComplianceService } from '@/services/ComplianceService'
import { emptyInventory } from '@/lib/domain/captureChecklist'
import type { CaptureInventory } from '@/services/ports'

/**
 * Live evidence coaching (AGENTS.md Section 4.1). Called by the CheckMyCase
 * surface after each capture: given what the claimant has photographed and
 * recorded so far, return the single next photographic or factual direction.
 *
 * The direction is guarded twice before it leaves the server: once inside
 * IntakeService.coachNextCapture (which substitutes a compliant fallback if the
 * model drifts) and again here against both the claimant language guard and the
 * evaluative field guard (W2, W6). A claimant only ever sees procedural
 * direction, never a case assessment.
 */

/** Coerce an untrusted request body into a safe CaptureInventory. */
function toInventory(raw: unknown): CaptureInventory {
  const base = emptyInventory()
  if (!raw || typeof raw !== 'object') return base
  const r = raw as Record<string, unknown>
  const kinds = (arr: unknown): Array<{ kind: string }> =>
    Array.isArray(arr)
      ? arr
          .map((i) => (i && typeof i === 'object' ? String((i as { kind?: unknown }).kind ?? '') : ''))
          .filter(Boolean)
          .slice(0, 50)
          .map((kind) => ({ kind }))
      : []
  return {
    photos: kinds(r.photos),
    documents: kinds(r.documents),
    voiceCaptured: r.voiceCaptured === true,
    insuranceCardParsed: r.insuranceCardParsed === true,
  }
}

export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: 'invalid payload' }, { status: 400 })
  }

  const { sessionId } = (body ?? {}) as { sessionId?: string }
  const inventory = toInventory((body as { inventory?: unknown })?.inventory)

  const payload = await getPayload({ config })
  const intake = createIntakeService(createPayloadIntakeDeps(payload))
  const agent = createEvidenceCoachingAgent({ coachNextCapture: intake.coachNextCapture })

  // One observe, decide, act step. The event is emitted server side inside the
  // action; here we only return the guarded direction. A missing or unknown
  // sessionId still yields a compliant direction; it just is not threaded.
  const direction = await agent.coachOnce(typeof sessionId === 'string' ? sessionId : 'coach-anon', inventory)

  const responseBody = {
    direction: direction.direction,
    focus: direction.focus ?? null,
    done: direction.done,
  }
  // Belt and suspenders: never let an evaluative field or forbidden phrase out.
  ComplianceService.guardClaimantText(responseBody.direction)
  ComplianceService.guardClaimantPayload(responseBody)

  return Response.json(responseBody, { status: 200 })
}
