import { notImplemented } from './notImplemented'

/**
 * IntakeService. Section 4, Section 6. Owns the claimant journey and the
 * production of the claimant safe side of the dossier plus the raw material for
 * the firm only side. Emits the Section 6 events. Never exposes an evaluative
 * signal to the claimant (W2).
 *
 * Phase 1 fills these bodies. The signatures are fixed now.
 */
export const IntakeService = {
  beginIntake: (_attributionTuple: unknown): never =>
    notImplemented('IntakeService', 'beginIntake', 'Phase 1'),
  validateIntake: (_sessionId: string): never =>
    notImplemented('IntakeService', 'validateIntake', 'Phase 1'),
  generateProtectionPlan: (_sessionId: string): never =>
    notImplemented('IntakeService', 'generateProtectionPlan', 'Phase 1'),
}
