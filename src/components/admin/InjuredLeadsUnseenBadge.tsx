'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

/**
 * InjuredLeadsUnseenBadge
 *
 * Rendered via admin.components.beforeNavLinks.
 * Polls the Payload REST API every 30 seconds to count unseen
 * injured-leads and shows a badge when there are new ones.
 */
export function InjuredLeadsUnseenBadge() {
  const [count, setCount] = useState<number>(0)

  const fetchCount = async () => {
    try {
      const res = await fetch(
        '/api/injured-leads?where[seen][equals]=false&limit=0',
        { credentials: 'include' },
      )
      if (!res.ok) return
      const data = await res.json()
      setCount(data.totalDocs ?? 0)
    } catch {
      // silently ignore — could be unauthenticated
    }
  }

  useEffect(() => {
    fetchCount()
    const interval = setInterval(fetchCount, 30_000)
    return () => clearInterval(interval)
  }, [])

  if (count === 0) return null

  return (
    <div style={{ padding: '0 16px 8px' }}>
      <Link
        href="/admin/collections/injured-leads"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 10px',
          borderRadius: '6px',
          background: 'rgba(251, 113, 133, 0.1)',
          border: '1px solid rgba(251, 113, 133, 0.25)',
          textDecoration: 'none',
          fontSize: '12px',
          fontWeight: 600,
          color: '#fb7185',
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '20px',
            height: '20px',
            padding: '0 6px',
            borderRadius: '10px',
            background: '#fb7185',
            color: '#fff',
            fontSize: '11px',
            fontWeight: 700,
          }}
        >
          {count}
        </span>
        New Injured Leads
      </Link>
    </div>
  )
}
