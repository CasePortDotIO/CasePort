import { notImplemented } from './notImplemented'

/**
 * IntelligenceService. Section 4, Section 11. Derived and always recomputable.
 * If the entire intelligence layer were deleted, it could be rebuilt from the
 * event log. It is never a source of truth.
 *
 * ACER is the true cost per signed case (decision D1). attributionTrace is the
 * Answer to Wallet query: given a signed case outcome, return the exact
 * originating tuple, end to end (Section 11).
 *
 * Phase 4 fills these bodies.
 */
export const IntelligenceService = {
  acer: (_firmId: string, _period: { from: string; to: string }): never =>
    notImplemented('IntelligenceService', 'acer', 'Phase 4'),
  attributionTrace: (_outcomeId: string): never =>
    notImplemented('IntelligenceService', 'attributionTrace', 'Phase 4'),
  marketHealth: (_marketId: string): never =>
    notImplemented('IntelligenceService', 'marketHealth', 'Phase 4'),
  firmHealth: (_firmId: string): never =>
    notImplemented('IntelligenceService', 'firmHealth', 'Phase 4'),
}
