import type { RoutingDeps } from './deliveryPorts'

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

export const RoutingService = { decideGeographicRoute }

/**
 * The routing service (Phase 3). Resolves the single firm assigned to a
 * protected market, produces the geographic routing decision, writes the audit
 * record with reason geographic, and emits GeographicRouteResolved.
 *
 * The route input carries only the dossier id (the aggregate being routed), the
 * market, and the validation boolean. There is no field through which SCPS,
 * severity, or value could reach this function, and the market resolver it calls
 * exposes only geographic assignment. Routing cause and triage data are kept
 * physically separate: this function never reads or writes an evaluative field.
 */
export function createRoutingService(deps: RoutingDeps) {
  async function route(input: {
    dossierId: string
    market: string
    validationPassed: boolean
  }): Promise<GeographicRoutingDecision> {
    // Geographic resolution only. A failed validation never resolves a firm.
    const assigned = input.validationPassed
      ? await deps.markets.assignedFirmForMarket(input.market)
      : null

    const decision = decideGeographicRoute(
      { market: input.market, validationPassed: input.validationPassed },
      assigned?.firmId ?? null,
    )

    const occurredAt = deps.clock.nowIso()

    // W1 and W7: every routing decision is audited, and the only permitted
    // reason is geographic, whether or not a firm was resolved.
    await deps.audit.record({
      decisionType: 'routing',
      reason: 'geographic',
      aggregateId: input.dossierId,
      firmId: decision.firmId ?? undefined,
      marketId: input.market,
      actor: 'system',
      details: { routed: decision.routed, marketType: assigned?.marketType ?? null },
      occurredAt,
    })

    await deps.events.append({
      eventType: 'GeographicRouteResolved',
      aggregateType: 'dossier',
      aggregateId: input.dossierId,
      actor: 'system',
      occurredAt,
      payload: {
        market: input.market,
        firmId: decision.firmId,
        reason: 'geographic',
        routed: decision.routed,
      },
    })

    return decision
  }

  return { route, decideGeographicRoute }
}

export type RoutingServiceInstance = ReturnType<typeof createRoutingService>
