'use client'

import { useEffect } from 'react'

/**
 * MarkInjuredLeadsSeen
 *
 * Rendered via InjuredLeads admin.components.beforeList.
 * Fires a PATCH request to mark all unseen leads as seen
 * as soon as the admin opens the list view. Renders nothing visible.
 */
export function MarkInjuredLeadsSeen() {
  useEffect(() => {
    fetch('/api/injured-leads-mark-seen', {
      method: 'PATCH',
      credentials: 'include',
    }).catch(() => {
      // silently ignore errors
    })
  }, [])

  return null
}
