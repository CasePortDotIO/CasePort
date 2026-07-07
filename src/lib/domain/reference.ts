/**
 * The human case reference. Every dossier carries a short, opaque, unambiguous
 * code like CP-7Q2K9F that is the one public id a claimant or a partner ever
 * sees: in a status link texted to a claimant, in a case link texted to a
 * partner, on the closing kit. It replaces the raw database id in every shared
 * URL, so nothing that reaches a human reads as engineering plumbing.
 *
 * The alphabet is Crockford base32 without the ambiguous letters (no I, L, O, U),
 * so a code is easy to read aloud and hard to mistype. The code is random, not
 * derived from an internal id, so it leaks nothing about volume or ordering.
 */

// Crockford base32, ambiguous characters removed.
const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ'
const PREFIX = 'CP-'
const CODE_LEN = 6

/** Format raw bytes into a reference code. Pure, so the generator is testable. */
export function referenceFromBytes(bytes: Uint8Array, len = CODE_LEN): string {
  let code = ''
  for (let i = 0; i < len; i++) {
    // Each byte selects one alphabet character. Deterministic given the bytes.
    code += ALPHABET[bytes[i % bytes.length] % ALPHABET.length]
  }
  return PREFIX + code
}

/** A reference derived deterministically from a database id. The fallback for a
 * dossier created before references were stored, so an old id still resolves to a
 * stable, readable code. */
export function deriveReference(id: string): string {
  return PREFIX + String(id).slice(-CODE_LEN).toUpperCase()
}

/** Whether a string looks like a case reference (so a route can tell a reference
 * from a raw database id and resolve each correctly). */
export function isReference(s: string): boolean {
  return /^CP-[0-9A-Z]{4,12}$/i.test(s.trim())
}

/** Normalize a reference for lookup: trimmed, upper case, with the prefix. */
export function normalizeReference(s: string): string {
  const t = s.trim().toUpperCase()
  return t.startsWith(PREFIX) ? t : PREFIX + t
}
