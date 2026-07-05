import { notImplemented } from './notImplemented'

/**
 * QualificationService. Section 4, Section 9. Computes SCPS and the 5 layer
 * qualification view. Writes versioned scpsScores. Firm only. Never a routing
 * input (W1), never claimant facing (W2).
 *
 * Phase 1 and Phase 4 fill these bodies.
 */
export const QualificationService = {
  computeScps: (_dossierId: string, _modelVersion = 'v1'): never =>
    notImplemented('QualificationService', 'computeScps', 'Phase 1'),
  runFiveLayer: (_dossierId: string): never =>
    notImplemented('QualificationService', 'runFiveLayer', 'Phase 1'),
}
