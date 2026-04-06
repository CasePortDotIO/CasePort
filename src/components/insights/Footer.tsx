export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.06] bg-[#060911]">
      <div className="container py-24 lg:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <span
              className="text-[17px] font-bold tracking-[0.18em] text-cp-text-primary"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              CASEPORT
            </span>
            <p className="mt-6 text-[15px] leading-[1.8] text-cp-text-muted max-w-[280px]">
              Intelligence and infrastructure for smarter case acquisition.
            </p>
            <p className="mt-8 text-[11px] text-cp-text-muted font-mono uppercase tracking-[0.15em]">
              access@caseport.io
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="system-label text-cp-text-muted mb-6">Navigation</h4>
            <ul className="space-y-4">
              {[
                { label: 'Home', href: 'https://www.caseport.io' },
                { label: 'Markets', href: 'https://www.caseport.io/markets' },
                { label: 'Insights', href: '/insights' },
                { label: 'Intelligence', href: 'https://www.caseport.io/intelligence' },
                { label: 'Injured?', href: 'https://www.caseport.io/injured' },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-[15px] text-cp-text-secondary hover:text-cp-text-primary transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Topics */}
          <div>
            <h4 className="system-label text-cp-text-muted mb-6">Topics</h4>
            <ul className="space-y-4">
              {[
                'Case Acquisition',
                'Intake',
                'Search & GEO',
                'Lead Economics',
                'Market Signals',
                'Law Firm Growth',
              ].map((topic) => (
                <li key={topic}>
                  <span className="text-[15px] text-cp-text-secondary hover:text-cp-text-primary transition-colors cursor-pointer">
                    {topic}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="system-label text-cp-text-muted mb-6">Legal</h4>
            <ul className="space-y-4">
              {['Privacy', 'Terms', 'Contact'].map((item) => (
                <li key={item}>
                  <a
                    href={`/${item.toLowerCase()}`}
                    className="text-[15px] text-cp-text-secondary hover:text-cp-text-primary transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-20 pt-10 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[13px] text-cp-text-muted">
            &copy; {new Date().getFullYear()} CasePort. All rights reserved.
          </p>
          <p className="text-[12px] text-cp-text-muted/60 max-w-[520px] text-center md:text-right">
            Results vary based on market, practice area, and firm capacity. Content is for
            informational purposes only.
          </p>
        </div>
      </div>
    </footer>
  )
}
