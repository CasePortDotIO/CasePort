'use client'

import { useEffect } from 'react'

/**
 * MarkIntelligenceSeen
 *
 * Rendered via IntelligenceBriefs admin.components.beforeList.
 * Fires a PATCH request to mark all unseen subscribers as seen
 * as soon as the admin opens the list view. Renders nothing visible.
 */
export function MarkIntelligenceSeen() {
  useEffect(() => {
    fetch('/api/intelligence-mark-seen', {
      method: 'PATCH',
      credentials: 'include',
    }).catch(() => {
      // silently ignore errors
    })
  }, [])

  return null
}
