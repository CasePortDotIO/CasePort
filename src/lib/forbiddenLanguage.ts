/**
 * ABA-compliance validator (ABA Memo 5.2). Blocks evaluative / recommendation
 * language and the false-privilege claim on any claimant-facing field.
 */
export const FORBIDDEN_CLAIMANT_PHRASES = [
  'attorney-client privilege', 'free case evaluation', 'free case review',
  'case evaluation', 'aba compliant', 'aba-compliant', 'we match you',
  'matched with the right', 'best firm', 'top-rated', 'approved firm',
  'approved attorneys', 'vetted', 'pre-screened', 'qualified network',
  'high probability', 'strong case', 'estimated case value', 'your case is worth',
];

export const noForbiddenClaimantLanguage = (value?: string | null): true | string => {
  if (!value) return true;
  const lower = String(value).toLowerCase();
  const hit = FORBIDDEN_CLAIMANT_PHRASES.find((p) => lower.includes(p));
  return hit ? `Blocked term for compliance: "${hit}". See ABA Compliance Memo 5.2.` : true;
};

export const wordCountInRange = (min: number, max: number) =>
  (value?: string | null): true | string => {
    if (!value) return true;
    const n = String(value).trim().split(/\s+/).filter(Boolean).length;
    return n >= min && n <= max ? true : `Must be ${min} to ${max} words (currently ${n}).`;
  };
