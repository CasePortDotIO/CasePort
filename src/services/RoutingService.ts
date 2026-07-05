import type { Payload } from 'payload'

/**
 * RoutingService. Section 4 and Section 8. The most compliance bearing
 * component in the system. Built so that violating the Wall is impossible, not
 * merely prohibited (W1).
 *
 * The intake passed to route exposes exactly two things: the resolved market
 * and the validation boolean. There is no field, parameter, or closure through
 * which SCPS, severity, or case value can reach this function. That is enforced
 * by the RoutingIntake type: it has no other members, so a caller cannot even
 * construct an intake that carries a quality signal.
 *
 * Every routing decision produces reason geographic, the only permitted value.
 */

/** The only inputs routing may see (W1). Adding any evaluative field here is a wall breach. */
export interface RoutingIntake {
  readonly market: string
  readonly validationPassed: boolean
}

/** The routing decision. reason is the literal geographic and nothing else (W1). */
export interface GeographicRoutingDecision {
  readonly market: string
  readonly firmId: string | null
  readonly reason: 'geographic'
  readonly routed: boolean
}

/**
 * The pure routing decision, with the firm already resolved for the market.
 * Kept pure so it is trivially testable and provably free of any evaluative
 * input. Every path returns reason geographic.
 */
export function decideGeographicRoute(
  intake: RoutingIntake,
  assignedFirmId: string | null,
): GeographicRoutingDecision {
  const routable = intake.validationPassed && assignedFirmId !== null
  return {
    market: intake.market,
    firmId: assignedFirmId,
    reason: 'geographic',
    routed: routable,
  }
}

export const RoutingService = {
  decideGeographicRoute,

  /**
   * Resolve the single firm assigned to a protected market, produce the
   * geographic routing decision, write the audit record with reason geographic,
   * and emit GeographicRouteResolved.
   *
   * Phase 0 wires the signature and the pure decision. The Payload backed
   * resolution, audit write, and event emit are completed in Phase 3 (the money
   * moving slice). The signature is final now so nothing downstream can smuggle
   * a quality signal in later.
   */
  async route(
    _payload: Payload,
    intake: RoutingIntake,
  ): Promise<GeographicRoutingDecision> {
    // Phase 3: look up markets.assignedFirm for intake.market, write auditLog
    // with reason geographic, emit GeographicRouteResolved. For now the pure
    // decision proves the contract with no firm resolved.
    return decideGeographicRoute(intake, null)
  },
}
