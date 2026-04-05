 * Custom SVG Icons for CasePort
 * Premium, distinctive icons designed to feel worldclass
 */

export const IconQuestion = ({ size = 48, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1.5" />
    <text x="24" y="32" textAnchor="middle" fontSize="24" fontWeight="bold" fill="currentColor" fontFamily="system-ui">
      ?
    </text>
  </svg>
);

export const IconCheckmark = ({ size = 48, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <circle cx="24" cy="24" r="22" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1.5" />
    <path d="M18 24L22 28L30 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const IconDocument = ({ size = 48, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
    <path d="M14 6H34C35.1046 6 36 6.89543 36 8V40C36 41.1046 35.1046 42 34 42H14C12.8954 42 12 41.1046 12 40V8C12 6.89543 12.8954 6 14 6Z" stroke="currentColor" strokeWidth="1.5" />
    <line x1="18" y1="14" x2="30" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="18" y1="22" x2="30" y2="22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="18" y1="30" x2="26" y2="30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);
