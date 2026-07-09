import { describe, it, expect } from 'vitest'
import { referenceFromBytes, deriveReference, isReference, normalizeReference } from '@/lib/domain/reference'

/**
 * The human case reference (CP-XXXXXX): the one public id a claimant or partner
 * ever sees, in place of a raw database id in every shared URL.
 */

describe('case reference', () => {
  it('formats bytes into a CP prefixed code from the unambiguous alphabet', () => {
    const ref = referenceFromBytes(new Uint8Array([0, 1, 2, 3, 4, 5]))
    expect(ref.startsWith('CP-')).toBe(true)
    // No ambiguous letters (I, L, O, U) in the alphabet.
    expect(ref.slice(3)).not.toMatch(/[ILOU]/)
    expect(isReference(ref)).toBe(true)
  })

  it('is deterministic given the same bytes', () => {
    const b = new Uint8Array([10, 20, 30, 40, 50, 60])
    expect(referenceFromBytes(b)).toBe(referenceFromBytes(b))
  })

  it('recognizes references and rejects raw database ids', () => {
    expect(isReference('CP-7Q2K9F')).toBe(true)
    expect(isReference('cp-7q2k9f')).toBe(true)
    // A raw Mongo ObjectId is not a reference.
    expect(isReference('665f1a2b3c4d5e6f7a8b9c0d')).toBe(false)
    expect(isReference('sess_12')).toBe(false)
  })

  it('normalizes to upper case with the prefix for lookup', () => {
    expect(normalizeReference('cp-7q2k9f')).toBe('CP-7Q2K9F')
    expect(normalizeReference('7Q2K9F')).toBe('CP-7Q2K9F')
  })

  it('derives a stable readable code from an id, for links created before references existed', () => {
    expect(deriveReference('665f1a2b3c4d5e6f7a8b9c0d')).toBe('CP-8B9C0D')
    expect(isReference(deriveReference('665f1a2b3c4d5e6f7a8b9c0d'))).toBe(true)
  })
})
