'use client'

interface VerifiedBadgesProps {
  isAttorneyReviewed?: boolean
  isABACompliant?: boolean
  lastUpdatedDate?: string
  reviewCycle?: string
  className?: string
}

function CheckmarkIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M2 6L5 9L10 3"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function VerifiedBadges({
  isAttorneyReviewed,
  isABACompliant,
  lastUpdatedDate,
  reviewCycle,
  className = '',
}: VerifiedBadgesProps) {
  const hasAnyBadge = isAttorneyReviewed || isABACompliant || lastUpdatedDate
  if (!hasAnyBadge) return null

  // Map reviewCycle to human-readable frequency
  const frequencyLabel = (() => {
    switch (reviewCycle) {
      case '3months': return 'Updated Quarterly'
      case '6months': return 'Updated Semi-Annually'
      case '12months': return 'Updated Annually'
      case 'evergreen': return 'Evergreen Content'
      default: return null
    }
  })()

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {/* Verified label — only show when at least one badge is present */}
      <span className="text-sm font-bold text-slate-800 tracking-tight">
        Verified:
      </span>

      {/* Attorney-Reviewed badge */}
      {isAttorneyReviewed && (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 10px',
            borderRadius: '3px',
            fontSize: '11px',
            fontWeight: '600',
            color: 'white',
            backgroundColor: '#4a8c7e',
          }}
        >
          <CheckmarkIcon />
          Attorney-Reviewed
        </span>
      )}

      {/* ABA Compliant badge */}
      {isABACompliant && (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 10px',
            borderRadius: '3px',
            fontSize: '11px',
            fontWeight: '600',
            color: 'white',
            backgroundColor: '#4a8c7e',
          }}
        >
          <CheckmarkIcon />
          ABA Compliant
        </span>
      )}

      {/* Last Updated badge */}
      {lastUpdatedDate && (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 10px',
            borderRadius: '3px',
            fontSize: '11px',
            fontWeight: '600',
            color: 'white',
            backgroundColor: '#c4714a',
          }}
        >
          <CheckmarkIcon />
          {frequencyLabel
            ? `${lastUpdatedDate} • ${frequencyLabel}`
            : `Last Updated: ${lastUpdatedDate}`}
        </span>
      )}
    </div>
  )
}