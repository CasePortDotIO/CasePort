/**
 * CasePort Footer
 * Brand: www.CasePort.io
 * Consistent with homepage footer structure
 */

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06]" style={{ backgroundColor: "oklch(0.06 0.01 250)" }}>
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <a href="https://www.caseport.io" className="flex flex-col leading-tight mb-4">
              <span className="text-[15px] font-bold tracking-[0.15em] text-[#F1F3F5]" style={{ fontFamily: "'JetBrains Mono', 'Geist Mono', monospace" }}>
                CASEPORT
              </span>
              <span className="text-[9px] tracking-[0.25em] text-[#6B7280] uppercase" style={{ fontFamily: "'JetBrains Mono', 'Geist Mono', monospace" }}>
                Case Flow Without Guesswork
              </span>
            </a>
            <p className="text-[14px] text-[#6B7280] leading-relaxed mt-4 max-w-[280px]">
              Turning chaotic accident demand into structured, buyer-ready case opportunities for personal injury law firms.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="system-label text-[#6B7280] mb-4">Platform</h4>
            <ul className="space-y-3">
              {[
                { label: "For Law Firms", href: "https://www.caseport.io" },
                { label: "How It Works", href: "https://www.caseport.io/#how-it-works" },
                { label: "ROI Projection", href: "https://www.caseport.io/#roi" },
                { label: "Why CasePort", href: "https://www.caseport.io/#why" },
                { label: "FAQ", href: "https://www.caseport.io/#faq" },
              ].map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-[14px] text-[#B0B8C4] hover:text-[#F1F3F5] transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="system-label text-[#6B7280] mb-4">Resources</h4>
            <ul className="space-y-3">
              {[
                { label: "Insights", href: "https://www.caseport.io/insights" },
                { label: "Intelligence", href: "https://www.caseport.io/intelligence" },
                { label: "Injured?", href: "https://www.caseport.io/injured" },
              ].map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-[14px] text-[#B0B8C4] hover:text-[#F1F3F5] transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="system-label text-[#6B7280] mb-4">Contact</h4>
            <a href="mailto:access@caseport.io" className="text-[14px] text-[#22D3EE] hover:text-[#06B6D4] transition-colors">
              access@caseport.io
            </a>
            <div className="mt-6">
              <h4 className="system-label text-[#6B7280] mb-3">Service Areas</h4>
              <p className="text-[12px] text-[#6B7280] leading-relaxed">
                CasePort serves personal injury law firms across the United States, including major markets in California, Texas, Florida, New York, Illinois, Pennsylvania, Georgia, Arizona, Ohio, New Jersey, Michigan, North Carolina, Virginia, Colorado, and Nevada.
              </p>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="mt-12 pt-8 border-t border-white/[0.06]">
          <p className="text-[11px] text-[#6B7280] leading-relaxed max-w-[960px]">
            Legal Disclaimer: CasePort provides case acquisition infrastructure services. We do not guarantee any specific number of leads, cases, signed retainers, or revenue outcomes. All projections, estimates, and performance metrics presented on this website are illustrative and based on general market data. Actual results depend on numerous factors including but not limited to market conditions, firm capacity, case quality, conversion rates, and operational execution. CasePort is not a law firm and does not provide legal advice. All advertising and lead generation activities are conducted in compliance with applicable state bar rules and legal advertising regulations. Past performance is not indicative of future results.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-6 gap-4">
            <span className="text-[12px] text-[#6B7280]">&copy; {new Date().getFullYear()} CasePort. All rights reserved.</span>
            <div className="flex gap-6">
              <a href="https://www.caseport.io/privacy" className="text-[12px] text-[#6B7280] hover:text-[#B0B8C4] transition-colors">Privacy Policy</a>
              <a href="https://www.caseport.io/terms" className="text-[12px] text-[#6B7280] hover:text-[#B0B8C4] transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
