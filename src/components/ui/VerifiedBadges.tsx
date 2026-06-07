'use client'

interface VerifiedBadgesProps {
  isAttorneyReviewed?: boolean
  isABACompliant?: boolean
  lastUpdatedDate?: string
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
  className = '',
}: VerifiedBadgesProps) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {/* Verified label */}
      <span className="text-sm font-bold text-slate-800 tracking-tight">
        Verified:
      </span>

      {/* Attorney-Reviewed badge */}
      {isAttorneyReviewed && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm text-xs font-bold text-white bg-[#3C7A6A]">
          <CheckmarkIcon />
          Attorney-Reviewed
        </span>
      )}

      {/* ABA Compliant badge */}
      {isABACompliant && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm text-xs font-bold text-white bg-[#3C7A6A]">
          <CheckmarkIcon />
          ABA Compliant
        </span>
      )}

      {/* Last Updated badge */}
      {lastUpdatedDate && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm text-xs font-bold text-white bg-[#C06A45]">
          <CheckmarkIcon />
          Last Updated: {lastUpdatedDate}
        </span>
      )}
    </div>
  )
}