import type { FirmOnlyEvaluation } from '@/lib/compliance/dossierProjections'
import { SCPS_FACTOR_KEYS, type ScpsFactors } from './scps'

/**
 * QualificationService. Section 4, Section 9. Computes the five layer
 * qualification view (5LQS) and the SCPS factors from concrete, honest signals.
 *
 * PATTERN (AGENTS.md Section 1): deterministic code, not an agent. Given the same
 * dossier facts it must return the same factors, because the SCPS scorer that
 * consumes them is versioned and auditable, and a score you cannot reproduce is
 * a moat you cannot defend (AGENTS.md Section 2). No inference, no autonomy.
 *
 * Firm only. Never a routing input (W1): this runs after the geographic routing
 * decision and its output travels only on the firm facing dossier half. Never
 * claimant facing (W2). Never reads or writes a fee (W3, W4).
 *
 * Honesty bar (Section 14: seeded honestly, never faked). Every factor is
 * derived from a real signal:
 *   - statute headroom from the statute of limitations date,
 *   - case type match from the routed firm's practice areas,
 *   - firm response capacity from the firm's contractual callback window,
 *   - injury and liability from documentation completeness, not a medical or
 *     legal judgment. CasePort never touches medical records (W5), so injury
 *     verification here measures how well the injury is documented, never how
 *     severe it is. Labels say exactly that, so a partner is never misled.
 * A factor without a real signal falls to an explicit neutral prior, never a
 * flattering guess.
 */

/** The concrete signals the qualification view is computed from. */
export interface QualificationInput {
  caseType: string
  statuteOfLimitationsDate: string | null
  /** When the intake was received, the reference point for statute headroom. */
  receivedAt: string
  /** The routed firm's practice areas (case type values it handles). */
  firmCaseTypes: string[]
  /** The firm's contractual callback window. Faster is higher response capacity. */
  firmSlaCallbackMinutes: number
  /** Documentation completeness signals gathered during intake. Not judgments. */
  documentation: {
    injuryPhoto: boolean
    voiceStatement: boolean
    policeReport: boolean
    scenePhotos: boolean
    platePhotos: boolean
    insuranceCard: boolean
  }
}

/** One layer of the five layer qualification view. */
export interface FiveLayerRow {
  layer: string
  passed: boolean
  note: string
}

export interface QualificationResult {
  factors: ScpsFactors
  fiveLayer: FiveLayerRow[]
  /**
   * The firm only evaluation, minus the SCPS number and version, which the
   * versioned intelligence scorer attaches. qualificationScore is filled by the
   * orchestrator from the scored SCPS so the two never drift.
   */
  evaluation: Omit<FirmOnlyEvaluation, 'scpsScore' | 'scpsVersion' | 'qualificationScore' | 'signedCaseProbability'>
}

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n)
const MS_PER_DAY = 86_400_000

/** Statute headroom as a 0..1 factor and a human label. No date is a neutral prior. */
function statuteFactor(solDate: string | null, receivedAt: string): { factor: number; label: string } {
  if (!solDate) return { factor: 0.5, label: 'no statute of limitations date on file' }
  const sol = Date.parse(solDate)
  const from = Date.parse(receivedAt)
  if (!Number.isFinite(sol) || !Number.isFinite(from)) return { factor: 0.5, label: 'statute date unreadable' }
  const days = Math.round((sol - from) / MS_PER_DAY)
  if (days <= 0) return { factor: 0.1, label: 'statute of limitations has passed' }
  // Full headroom at a year or more; linear below that.
  const factor = clamp01(days / 365)
  return { factor, label: `${days} days of statute headroom` }
}

/** Documentation completeness for injury. Measures the record, not the severity. */
function injuryFactor(doc: QualificationInput['documentation']): { factor: number; label: string } {
  const factor = clamp01((doc.injuryPhoto ? 0.5 : 0) + (doc.voiceStatement ? 0.5 : 0))
  const parts: string[] = []
  if (doc.injuryPhoto) parts.push('photo')
  if (doc.voiceStatement) parts.push('spoken account')
  const label = parts.length ? `documented via ${parts.join(' and ')}` : 'injury not yet documented'
  return { factor, label }
}

/** Documentation completeness for liability. Measures the record, not fault. */
function liabilityFactor(doc: QualificationInput['documentation']): { factor: number; label: string } {
  const factor = clamp01((doc.policeReport ? 0.5 : 0) + (doc.scenePhotos ? 0.25 : 0) + (doc.platePhotos ? 0.25 : 0))
  const parts: string[] = []
  if (doc.policeReport) parts.push('police report')
  if (doc.scenePhotos) parts.push('scene photos')
  if (doc.platePhotos) parts.push('plate photos')
  const label = parts.length ? `documented via ${parts.join(', ')}` : 'liability facts not yet documented'
  return { factor, label }
}

/** Firm response capacity from the contractual callback window. Faster is higher. */
function responseCapacityFactor(slaMinutes: number): number {
  if (!Number.isFinite(slaMinutes) || slaMinutes <= 0) return 0.5
  // 5 minutes or faster is full capacity; 60 minutes or slower is none.
  return clamp01(1 - (slaMinutes - 5) / 55)
}

/** Qualification tier from the SCPS percentage. Firm facing triage only. */
export function tierForScps(scps: number): FirmOnlyEvaluation['qualificationTier'] {
  if (scps >= 80) return 'A'
  if (scps >= 60) return 'B'
  if (scps >= 40) return 'C'
  return 'D'
}

/** Factor breakdown in the shape the firm dossier and scores store. */
export function factorsBreakdown(factors: ScpsFactors): Array<{ layer: string; score: number; max: number }> {
  return SCPS_FACTOR_KEYS.map((k) => ({ layer: k, score: Math.round(factors[k] * 100), max: 100 }))
}

export const QualificationService = {
  /**
   * Compute the five layer qualification view and the SCPS factors from concrete
   * signals. Pure and deterministic. The SCPS number itself is produced by the
   * versioned intelligence scorer from these factors, not here, so scoring stays
   * in one auditable place.
   */
  runFiveLayer(input: QualificationInput): QualificationResult {
    const statute = statuteFactor(input.statuteOfLimitationsDate, input.receivedAt)
    const injury = injuryFactor(input.documentation)
    const liability = liabilityFactor(input.documentation)
    const caseTypeMatch = input.firmCaseTypes.includes(input.caseType) ? 1 : 0.3
    const firmResponseCapacity = responseCapacityFactor(input.firmSlaCallbackMinutes)

    const factors: ScpsFactors = {
      injuryVerification: injury.factor,
      liabilityClarity: liability.factor,
      statuteStatus: statute.factor,
      caseTypeMatch,
      firmResponseCapacity,
    }

    // The five stage internal qualification view (Section 9). Valid contact is
    // implicit: a dossier exists only because intake captured claimant contact.
    const fiveLayer: FiveLayerRow[] = [
      { layer: 'valid-contact', passed: true, note: 'claimant contact captured at intake' },
      { layer: 'injury-verification', passed: injury.factor >= 0.5, note: injury.label },
      { layer: 'liability-assessment', passed: liability.factor >= 0.5, note: liability.label },
      { layer: 'statute-check', passed: statute.factor > 0.1, note: statute.label },
      {
        layer: 'case-type-and-market-match',
        passed: caseTypeMatch >= 1,
        note: input.firmCaseTypes.includes(input.caseType)
          ? 'case type is in the firm practice areas'
          : 'case type is outside the firm listed practice areas',
      },
    ]

    return {
      factors,
      fiveLayer,
      evaluation: {
        qualificationTier: 'D', // provisional; the orchestrator sets it from the scored SCPS
        qualificationBreakdown: factorsBreakdown(factors),
        // Value is never fabricated (Section 14). It stays unset until a real basis exists.
        estimatedValue: 0,
        injurySeverity: injury.label,
        liabilityAssessment: liability.label,
        statuteStatus: statute.label,
      },
    }
  },
}
