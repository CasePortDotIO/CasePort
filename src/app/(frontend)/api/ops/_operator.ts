import config from '@payload-config'
import { getPayload, type Payload } from 'payload'

/**
 * Shared auth for the operable /ops action endpoints. Every action is performed
 * as an authenticated CasePort operator, and that identity is the logged human
 * approver on the promotion gate, the asset publish gate, and every other gated
 * action. Internal only (H6): an unauthenticated request gets nothing.
 */
export interface OperatorContext {
  payload: Payload
  operator: string
}

export async function resolveOperator(req: Request): Promise<OperatorContext | null> {
  let payload: Payload
  try {
    payload = await getPayload({ config })
  } catch {
    return null
  }
  try {
    const { user } = await payload.auth({ headers: req.headers })
    if (!user) return null
    return { payload, operator: user.email ?? user.id ?? 'operator' }
  } catch {
    return null
  }
}

/** A 401 for an unauthenticated action request. */
export function unauthorized(): Response {
  return Response.json({ ok: false, error: 'operator sign in required' }, { status: 401 })
}
