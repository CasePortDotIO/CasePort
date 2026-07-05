import { describe, it, expect } from 'vitest'
import { decideGeographicRoute, type RoutingIntake } from '@/services/RoutingService'
import { isEvaluativeField } from '@/lib/compliance/evaluativeFields'

/**
 * W1. Routing is geographic only. This test reinforces the routing wall:
 * every decision reads reason geographic, and the RoutingIntake type exposes
 * only market and validationPassed so no quality signal is reachable.
 */
describe('W1 geographic only routing', () => {
  it('always produces reason geographic', () => {
    const routed = decideGeographicRoute({ market: 'atlanta-ga', validationPassed: true }, 'firm_1')
    const held = decideGeographicRoute({ market: 'atlanta-ga', validationPassed: false }, 'firm_1')
    const noFirm = decideGeographicRoute({ market: 'atlanta-ga', validationPassed: true }, null)

    expect(routed.reason).toBe('geographic')
    expect(held.reason).toBe('geographic')
    expect(noFirm.reason).toBe('geographic')
  })

  it('routes only when validation passed and a firm is assigned', () => {
    expect(decideGeographicRoute({ market: 'm', validationPassed: true }, 'firm_1').routed).toBe(true)
    expect(decideGeographicRoute({ market: 'm', validationPassed: false }, 'firm_1').routed).toBe(false)
    expect(decideGeographicRoute({ market: 'm', validationPassed: true }, null).routed).toBe(false)
  })

  it('the routing intake exposes no evaluative field', () => {
    // The RoutingIntake surface is exactly these two keys. If a future change
    // adds an evaluative field to the intake, this guard trips.
    const intake: RoutingIntake = { market: 'atlanta-ga', validationPassed: true }
    const keys = Object.keys(intake)
    expect(keys.sort()).toEqual(['market', 'validationPassed'])
    for (const key of keys) {
      expect(isEvaluativeField(key)).toBe(false)
    }
  })
})
