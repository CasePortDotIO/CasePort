import { useState, useEffect } from "react";
import { ArrowRight, Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#0A0E17]/90 backdrop-blur-xl border-b border-white/[0.06]"
          : "bg-transparent"
      }`}
    >
      <nav className="container flex items-center justify-between h-16 lg:h-[72px]">
        {/* Logo */}
        <a href="https://www.caseport.io" className="flex items-center gap-2 group">
          <span
            className="text-[18px] font-bold tracking-[0.18em] text-cp-text-primary"
            style={{ fontFamily: "var(--font-display)" }}
          >
            CASEPORT
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          <a
            href="https://www.caseport.io"
            className="text-[15px] font-medium text-cp-text-secondary hover:text-cp-text-primary transition-colors"
          >
            Home
          </a>
          <a
            href="https://www.caseport.io/markets"
            className="text-[15px] font-medium text-cp-text-secondary hover:text-cp-text-primary transition-colors"
          >
            Markets
          </a>
          <a
            href="/insights"
            className="text-[15px] font-medium text-cp-cyan transition-colors"
          >
            Insights
          </a>
          <a
            href="https://www.caseport.io/intelligence"
            className="text-[15px] font-medium text-cp-text-secondary hover:text-cp-text-primary transition-colors"
          >
            Intelligence
          </a>
          <a
            href="https://www.caseport.io/injured"
            className="text-[15px] font-medium text-cp-text-secondary hover:text-cp-text-primary transition-colors"
          >
            Injured?
          </a>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="mailto:access@caseport.io"
            className="cta-secondary flex items-center gap-2 !h-10 !text-[13px] !px-5"
          >
            Subscribe
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-cp-text-secondary"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0A0E17]/95 backdrop-blur-xl border-t border-white/[0.06]">
          <div className="container py-6 flex flex-col gap-4">
            <a
              href="https://www.caseport.io"
              className="text-[15px] font-medium text-cp-text-secondary hover:text-cp-text-primary transition-colors py-2"
            >
              Home
            </a>
            <a
              href="https://www.caseport.io/markets"
              className="text-[15px] font-medium text-cp-text-secondary hover:text-cp-text-primary transition-colors py-2"
            >
              Markets
            </a>
            <a
              href="/insights"
              className="text-[15px] font-medium text-cp-cyan py-2"
            >
              Insights
            </a>
            <a
              href="https://www.caseport.io/intelligence"
              className="text-[15px] font-medium text-cp-text-secondary hover:text-cp-text-primary transition-colors py-2"
            >
              Intelligence
            </a>
            <a
              href="https://www.caseport.io/injured"
              className="text-[15px] font-medium text-cp-text-secondary hover:text-cp-text-primary transition-colors py-2"
            >
              Injured?
            </a>
            <div className="pt-2 border-t border-white/[0.06]">
              <a
                href="mailto:access@caseport.io"
                className="cta-gradient flex items-center justify-center gap-2 w-full"
              >
                Request Access <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
