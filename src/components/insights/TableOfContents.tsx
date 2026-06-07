'use client'

import { useEffect, useRef } from 'react'
import { Check } from 'lucide-react'

const cssEscape = (str: string): string => {
  return str.replace(/[^a-zA-Z0-9_-]/g, (char) => {
    return '%' + char.charCodeAt(0).toString(16).toUpperCase()
  }).replace(/%/g, '\\')
}

export type TOCEntry = {
  id: string
  title: string
  /** 'block' entries get a slightly different style (block accent) */
  type?: 'block' | 'heading'
}

type Props = {
  entries: TOCEntry[]
  activeSection: string
  /** 'dark' = insights (slate/cyan), 'light' = guide (beige/teal) */
  variant?: 'dark' | 'light'
  /** Called when active section changes */
  onActiveChange?: (id: string) => void
}

export function TableOfContents({ entries, activeSection, variant = 'dark', onActiveChange }: Props) {
  const tocRef = useRef<HTMLDivElement>(null)

  // Auto-scroll TOC to keep active section visible
  useEffect(() => {
    if (!activeSection || !tocRef.current) return
    const tocContainer = tocRef.current
    // Query the data-section-id attribute directly — no CSS escaping needed
    // since IDs in DOM are stored as plain strings
    const selector = `[data-section-id="${activeSection}"]`
    const activeItem = tocContainer.querySelector(selector)
    if (activeItem) {
      activeItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
    if (onActiveChange) onActiveChange(activeSection)
  }, [activeSection, onActiveChange])

  if (variant === 'light') {
    return (
      <div ref={tocRef} style={{ width: '280px', padding: '40px 0', position: 'sticky', top: '80px', height: 'fit-content', overflowY: 'auto', maxHeight: 'calc(100vh - 160px)' }}>
        <div style={{ fontSize: '12px', fontWeight: '700', color: '#1a4a5a', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          On This Page
        </div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {entries.map((item) => {
            const isActive = activeSection === item.id
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                data-section-id={item.id}
                style={{
                  fontSize: '13px',
                  color: isActive ? '#1a4a5a' : '#999',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  paddingLeft: '12px',
                  borderLeft: isActive ? '3px solid #c4714a' : '2px solid #e8e2d8',
                  fontWeight: isActive ? '700' : '500',
                  backgroundColor: isActive ? '#f0f8f6' : 'transparent',
                  paddingTop: '8px',
                  paddingBottom: '8px',
                  paddingRight: '8px',
                  borderRadius: '4px',
                  display: 'block',
                }}
              >
                {item.title}
              </a>
            )
          })}
        </nav>
      </div>
    )
  }

  // Dark variant (insights style)
  return (
    <div
      ref={tocRef}
      className="p-5 overflow-y-auto"
      style={{ maxHeight: 'calc(100vh - 180px)' }}
    >
      <h4 className="text-base font-black text-white mb-4 uppercase tracking-widest flex items-center gap-2">
        <div className="w-1 h-5 bg-gradient-to-b from-cyan-400 to-cyan-600 rounded-full" />
        On This Page
      </h4>
      <nav className="space-y-1">
        {entries.map((item) => {
          const sectionId = item.id
          const isActive = cssEscape(activeSection) === cssEscape(sectionId)
          return (
            <a
              key={item.id}
              href={`#${sectionId}`}
              data-section-id={sectionId}
              className={`group flex items-start gap-3 px-4 py-3 rounded-lg transition-all duration-300 relative overflow-hidden ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                  : 'text-slate-300 hover:text-cyan-300 hover:bg-slate-800/50'
              }`}
            >
              {/* Animated left border */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-cyan-600 transition-all duration-300 ${
                  isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                }`}
              />

              {/* Checkmark indicator */}
              <div
                className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  isActive
                    ? 'border-cyan-400 bg-cyan-500/30'
                    : 'border-slate-500 group-hover:border-cyan-400'
                }`}
              >
                {isActive && <Check size={12} className="text-cyan-300" />}
              </div>

              {/* Link text */}
              <span className="text-sm font-medium leading-tight group-hover:translate-x-1 transition-transform duration-300">
                {item.title}
              </span>
            </a>
          )
        })}
      </nav>
    </div>
  )
}