import { isEvaluativeField, normalizeKey, EVALUATIVE_TOKENS } from './evaluativeFields'

/**
 * A single detected leak: the evaluative field and the path where it was found.
 */
export interface EvaluativeLeak {
  field: string
  path: string
}

/**
 * Recursively scan any value that is about to be serialized to a claimant
 * facing surface (route response, component prop, log line) for evaluative
 * fields. Compliance rule W2.
 *
 * The scan walks objects and arrays to any depth. It matches on normalized key
 * names so scpsScore, scps_score, and "SCPS Score" all trip. It returns every
 * leak found rather than stopping at the first, so a violating payload reports
 * completely.
 */
export function findEvaluativeLeaks(value: unknown, basePath = '$'): EvaluativeLeak[] {
  const leaks: EvaluativeLeak[] = []
  const seen = new WeakSet<object>()

  const walk = (node: unknown, path: string): void => {
    if (node === null || typeof node !== 'object') return
    if (seen.has(node as object)) return
    seen.add(node as object)

    if (Array.isArray(node)) {
      node.forEach((item, index) => walk(item, `${path}[${index}]`))
      return
    }

    for (const [key, child] of Object.entries(node as Record<string, unknown>)) {
      const childPath = `${path}.${key}`
      if (isEvaluativeField(key)) {
        leaks.push({ field: key, path: childPath })
      }
      walk(child, childPath)
    }
  }

  walk(value, basePath)
  return leaks
}

/**
 * Thrown when a claimant facing payload carries an evaluative field.
 */
export class EvaluativeLeakError extends Error {
  readonly leaks: EvaluativeLeak[]
  constructor(leaks: EvaluativeLeak[]) {
    const summary = leaks.map((l) => `${l.field} at ${l.path}`).join(', ')
    super(`Evaluative field leak on claimant surface: ${summary}`)
    this.name = 'EvaluativeLeakError'
    this.leaks = leaks
  }
}

/**
 * Assert that a payload bound for a claimant surface carries no evaluative
 * field. Throws EvaluativeLeakError on any leak. Call this at the boundary of
 * every claimant serving endpoint and in the compliance test harness.
 */
export function assertNoEvaluativeLeak(value: unknown): void {
  const leaks = findEvaluativeLeaks(value)
  if (leaks.length > 0) throw new EvaluativeLeakError(leaks)
}

/** Exposed for tests and tooling. The normalized forbidden token set. */
export { EVALUATIVE_TOKENS, normalizeKey }
