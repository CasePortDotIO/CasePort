/**
 * Parse a comparable magnitude from a recommendation's expected value string so
 * the briefing can rank recommendations by expected value (INTELLIGENCE_CORE.md
 * Phase D, Section 8). Recommendations carry expected value as human copy (for
 * example "+12 percent margin per delivered opportunity"); this pulls the
 * leading signed number for ranking only. It never fabricates a figure: a string
 * with no number ranks at zero.
 */
export function expectedValueScore(expectedValue: string): number {
  if (!expectedValue) return 0
  const m = expectedValue.match(/-?\d+(?:\.\d+)?/)
  return m ? Number(m[0]) : 0
}
