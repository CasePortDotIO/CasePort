import { notImplemented } from './notImplemented'

/**
 * OutcomeService. Section 4, Section 7. Firm reported outcomes feed intelligence
 * only. Never billing (W4). The fee was already fixed and charged on delivery,
 * regardless of outcome (W3).
 *
 * Phase 4 fills these bodies.
 */
export const OutcomeService = {
  reportOutcome: (
    _deliveryId: string,
    _result: 'retained' | 'not-retained' | 'still-evaluating' | 'settled',
    _reasonCode?: string,
    _settlementValueCents?: number,
  ): never => notImplemented('OutcomeService', 'reportOutcome', 'Phase 4'),
}
