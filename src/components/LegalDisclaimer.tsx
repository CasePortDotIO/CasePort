interface LegalDisclaimerProps {
  type?: 'none' | 'standard' | 'no-legal-advice' | 'platform' | string | null
}

export function LegalDisclaimer({ type }: LegalDisclaimerProps) {
  if (!type || type === 'none') {
    return null
  }

  let text = ''
  switch (type) {
    case 'standard':
      text =
        'This article is for general informational purposes only and does not constitute legal advice. The information provided may not apply to your specific situation. CasePort is not a law firm and does not provide legal services. Consult a licensed attorney in your jurisdiction for legal counsel.'
      break
    case 'no-legal-advice':
      text =
        'This content discusses general industry practices and operational strategy. It does not constitute legal advice. CasePort is not a law firm.'
      break
    case 'platform':
      text =
        "This content describes CasePort's services and platform capabilities. CasePort is not a law firm and does not provide legal representation."
      break
    default:
      return null
  }

  return (
    <div className="legal-disclaimer mt-24 pt-12 border-t border-slate-200">
      <small className="text-slate-500 text-xs text-balance block">{text}</small>
    </div>
  )
}
