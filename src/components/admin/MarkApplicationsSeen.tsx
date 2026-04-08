'use client'

import { useEffect } from 'react'

/**
 * MarkApplicationsSeen
 *
 * Rendered via Applications admin.components.beforeList.
 * Fires a PATCH request to mark all unseen applications as seen
 * as soon as the admin opens the list view. Renders nothing visible.
 */
export function MarkApplicationsSeen() {
  useEffect(() => {
    fetch('/api/applications-mark-seen', {
      method: 'PATCH',
      credentials: 'include',
    }).catch(() => {
      // silently ignore errors
    })
  }, [])

  return null
}
