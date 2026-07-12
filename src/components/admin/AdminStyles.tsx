'use client'

import { useEffect } from 'react'

export function AdminStyles() {
  useEffect(() => {
    const style = document.createElement('style')
    style.id = 'admin-dark-text-fix'
    style.textContent = `
      html[data-theme='dark'] h1,
      html[data-theme='dark'] h2,
      html[data-theme='dark'] h3,
      html[data-theme='dark'] h4,
      html[data-theme='dark'] h5,
      html[data-theme='dark'] h6,
      html[data-theme='dark'] label,
      html[data-theme='dark'] span,
      html[data-theme='dark'] p,
      html[data-theme='dark'] li,
      html[data-theme='dark'] td,
      html[data-theme='dark'] th,
      html[data-theme='dark'] a,
      html[data-theme='dark'] strong,
      html[data-theme='dark'] .label,
      html[data-theme='dark'] .heading,
      html[data-theme='dark'] .title,
      html[data-theme='dark'] .description,
      html[data-theme='dark'] [class*="label"],
      html[data-theme='dark'] [class*="field-label"],
      html[data-theme='dark'] [class*="block-label"],
      html[data-theme='dark'] [class*="array-label"],
      html[data-theme='dark'] [class*="collapsible-label"],
      html[data-theme='dark'] [data-label],
      html[data-theme='dark'] .field-type,
      html[data-theme='dark'] .field,
      html[data-theme='dark'] .block-item,
      html[data-theme='dark'] .array-item,
      html[data-theme='dark'] .collapsible,
      html[data-theme='dark'] .group-field,
      html[data-theme='dark'] .tab-content,
      html[data-theme='dark'] .collection-card,
      html[data-theme='dark'] [class*="collection-card"],
      html[data-theme='dark'] [class*="nav-card"],
      html[data-theme='dark'] .edit-none,
      html[data-theme='dark'] .collection-list__item,
      html[data-theme='dark'] [class*="collection-list"],
      html[data-theme='dark'] .nav-group,
      html[data-theme='dark'] .nav-item,
      html[data-theme='dark'] [data-block-type],
      html[data-theme='dark'] [class*="block-type"],
      html[data-theme='dark'] .block-type-label,
      html[data-theme='dark'] .block-label {
        color: var(--theme-elevation-800, #fff) !important;
      }
      html[data-theme='dark'] input,
      html[data-theme='dark'] textarea,
      html[data-theme='dark'] select {
        color: var(--theme-elevation-800, #fff);
      }
    `
    document.head.appendChild(style)
    return () => {
      const el = document.getElementById('admin-dark-text-fix')
      if (el) el.remove()
    }
  }, [])

  return null
}
