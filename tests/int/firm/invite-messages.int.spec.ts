import { describe, it, expect } from 'vitest'
import { buildFirmInviteMessages, buildFirmResetMessages, activationUrl } from '@/lib/firm/inviteMessages'

/**
 * Partner onboarding copy. CasePort is invite only: a firm is provisioned after a
 * signed agreement and receives a branded link to set its own password. These
 * pin the copy and the link shape so nothing drifts into a claim or a broken URL.
 */

describe('activation url', () => {
  it('builds a same firm set password link with the token, trimming a trailing slash', () => {
    expect(activationUrl('https://caseport.io/', 'abc123')).toBe('https://caseport.io/firm/activate?token=abc123')
    expect(activationUrl('https://caseport.io', 'abc123')).toBe('https://caseport.io/firm/activate?token=abc123')
  })

  it('encodes the token', () => {
    expect(activationUrl('https://caseport.io', 'a b/c')).toContain('token=a%20b%2Fc')
  })
})

describe('invite message', () => {
  const m = buildFirmInviteMessages({ name: 'Michael', firmName: 'Peachtree Injury Partners', activationUrl: 'https://caseport.io/firm/activate?token=t' })

  it('greets the partner, names the firm, and carries the activation link', () => {
    expect(m.subject).toBe('Activate your CasePort account')
    expect(m.body).toContain('Michael')
    expect(m.body).toContain('Peachtree Injury Partners')
    expect(m.body).toContain('https://caseport.io/firm/activate?token=t')
  })

  it('works without a name or firm', () => {
    const bare = buildFirmInviteMessages({ activationUrl: 'https://x/firm/activate?token=t' })
    expect(bare.body).toContain('there')
    expect(bare.body).toContain('https://x/firm/activate?token=t')
  })

  it('makes no fabricated claim and no em dash', () => {
    expect(m.body).not.toContain('—')
    for (const word of ['guarantee', 'best', 'top-rated', 'approved', 'vetted']) {
      expect(m.body.toLowerCase()).not.toContain(word)
    }
  })
})

describe('reset message', () => {
  const m = buildFirmResetMessages({ name: 'Sam', activationUrl: 'https://caseport.io/firm/activate?token=r' })

  it('is a reset, single use, and carries the link', () => {
    expect(m.subject).toBe('Reset your CasePort password')
    expect(m.body).toContain('Sam')
    expect(m.body).toContain('single use')
    expect(m.body).toContain('https://caseport.io/firm/activate?token=r')
  })

  it('reassures a recipient who did not request it', () => {
    expect(m.body.toLowerCase()).toContain('if you did not request this')
  })
})
