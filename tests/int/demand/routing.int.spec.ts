import { describe, it, expect } from 'vitest'
import { resolveRoute, findCallRoutes, validateRouting, isSelfInitiation } from '@/lib/demand/routing'
import { validateAssetStructure, type AssetStructure } from '@/lib/demand/placement'

/**
 * Demand Capture Phase D checkpoint (DEMAND_CAPTURE.md Section 12). Every
 * captured path routes to self initiation and no path routes to a call.
 */

describe('routing resolves to self initiation (Section 8)', () => {
  it('routes every B2C surface to checkmycase with the one permitted call to action', () => {
    const r = resolveRoute({ side: 'b2c' })
    expect(r.destination).toBe('/checkmycase')
    expect(r.cta).toBe('Send my information')
    expect(r.disclaimerRequired).toBe(true)
    expect(r.routesToCall).toBe(false)
  })

  it('routes B2B by reader psychology, never to a call', () => {
    expect(resolveRoute({ side: 'b2b', intent: 'pain-awareness' }).destination).toBe('/markets')
    expect(resolveRoute({ side: 'b2b', intent: 'financial' }).destination).toBe('/request-access')
    expect(resolveRoute({ side: 'b2b', intent: 'vendor-evaluation' }).destination).toBe('/request-access')
    expect(resolveRoute({ side: 'b2b', intent: 'education', nextPillarUrl: '/guide/va' }).destination).toBe('/guide/va')
    // Default (no intent) is pain awareness, self serve.
    expect(resolveRoute({ side: 'b2b' }).destination).toBe('/markets')
    for (const intent of ['pain-awareness', 'financial', 'vendor-evaluation', 'education'] as const) {
      expect(resolveRoute({ side: 'b2b', intent }).routesToCall).toBe(false)
    }
  })
})

describe('no path routes to a call (Section 8)', () => {
  it('detects phone links, scheduler links, and call to action phrasing', () => {
    expect(findCallRoutes(['tel:+15551234567'])).not.toEqual([])
    expect(findCallRoutes(['https://calendly.com/caseport'])).not.toEqual([])
    expect(findCallRoutes(['Book a call with our team'])).not.toEqual([])
    expect(findCallRoutes(['Schedule a call today'])).not.toEqual([])
    expect(findCallRoutes(['Call us now'])).not.toEqual([])
    expect(findCallRoutes(['Get a free consultation'])).not.toEqual([])
    // A clean self serve link is not a call route.
    expect(findCallRoutes(['/checkmycase', '/request-access'])).toEqual([])
    expect(isSelfInitiation('/checkmycase')).toBe(true)
    expect(isSelfInitiation('tel:+15551234567')).toBe(false)
  })

  it('validateRouting flags a B2C asset that routes to a call', () => {
    const violations = validateRouting({
      side: 'b2c',
      intakeCtaText: 'Send my information',
      intakeCtaHref: 'https://calendly.com/caseport',
      hasComplianceDisclaimer: true,
    })
    expect(violations.join(' ')).toMatch(/routes-to-call/)
  })

  it('validateRouting passes a compliant B2C intake route', () => {
    const violations = validateRouting({
      side: 'b2c',
      intakeCtaText: 'Send my information',
      intakeCtaHref: '/checkmycase',
      hasComplianceDisclaimer: true,
    })
    expect(violations).toEqual([])
  })
})

describe('the publish gate blocks any asset that routes to a call (Phase D)', () => {
  const base: AssetStructure = {
    side: 'b2c',
    targetKeyword: 'virginia contributory negligence',
    directAnswer: `virginia contributory negligence ${Array(120).fill('word').join(' ')}`,
    body: `virginia contributory negligence ${Array(400).fill('word').join(' ')}`,
    schemaType: 'FAQPage',
    intakeCtaText: 'Send my information',
    intakeCtaHref: '/checkmycase',
    hasComplianceDisclaimer: true,
  }

  it('rejects an asset whose body invites a phone call', () => {
    const res = validateAssetStructure({ ...base, body: `Book a call with us. ${base.body}` })
    expect(res.valid).toBe(false)
    expect(res.violations.some((v) => v.rule === 'routes-to-call')).toBe(true)
  })

  it('passes a clean self initiation asset', () => {
    const res = validateAssetStructure(base)
    expect(res.valid).toBe(true)
  })
})
