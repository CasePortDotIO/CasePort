'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

/**
 * IntelligenceUnseenBadge
 *
 * Rendered via admin.components.beforeNavLinks.
 * Polls the Payload REST API every 30 seconds to count unseen
 * intelligence-briefs and shows a badge when there are new ones.
 */
export function IntelligenceUnseenBadge() {
  const [count, setCount] = useState<number>(0)

  const fetchCount = async () => {
    try {
      const res = await fetch('/api/intelligence-briefs?where[seen][equals]=false&limit=0', {
        credentials: 'include',
      })
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
        href="/admin/collections/intelligence-briefs"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 10px',
          borderRadius: '6px',
          background: 'rgba(34, 211, 238, 0.1)',
          border: '1px solid rgba(34, 211, 238, 0.25)',
          textDecoration: 'none',
          fontSize: '12px',
          fontWeight: 600,
          color: '#22d3ee',
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: '20px',
            height: '20px',
            padding: '0 5px',
            borderRadius: '10px',
            background: '#22d3ee',
            color: '#0a0e17',
            fontSize: '11px',
            fontWeight: 700,
          }}
        >
          {count}
        </span>
        New Intelligence{count === 1 ? ' subscriber' : ' subscribers'}
      </Link>
    </div>
  )
}
