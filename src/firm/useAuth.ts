'use client'

import { useEffect, useState } from 'react'

/**
 * Firm dashboard auth. Reads the real firmUser session from Payload
 * (/api/firmUsers/me). When a partner is signed in, their name and firm come
 * from the session. When no one is signed in, it falls back to a demo identity
 * so the dashboard is still explorable without a login. `isAuthenticated`
 * distinguishes the two.
 */

interface FirmUser {
  name: string
  firmName: string
  email: string
}

const DEMO_USER: FirmUser = {
  name: 'Michael',
  firmName: 'Peachtree Injury Partners',
  email: 'partner@peachtreeinjury.example',
}

export function useAuth() {
  const [user, setUser] = useState<FirmUser>(DEMO_USER)
  const [isAuthenticated, setAuthed] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/firmUsers/me?depth=1', { credentials: 'include' })
        const data = (await res.json()) as { user?: { name?: string; email?: string; firm?: { name?: string } | null } | null }
        if (cancelled) return
        if (data.user) {
          setUser({
            name: data.user.name || 'Partner',
            firmName: data.user.firm?.name || 'Your firm',
            email: data.user.email || '',
          })
          setAuthed(true)
        }
      } catch {
        // Keep the demo identity.
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  async function logout() {
    try {
      await fetch('/api/firmUsers/logout', { method: 'POST', credentials: 'include' })
    } catch {
      // ignore
    }
    if (typeof window !== 'undefined') window.location.href = '/firm/login'
  }

  return { user, isAuthenticated, loading, logout }
}

export default useAuth
