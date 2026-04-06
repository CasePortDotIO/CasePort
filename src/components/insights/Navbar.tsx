'use client'
import { ArrowRight, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#0A0E17]/90 backdrop-blur-xl border-b border-white/[0.06]'
          : 'bg-transparent'
      }`}
    >
      <nav className="container flex items-center justify-between h-16 lg:h-[72px]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span
            className="text-[18px] font-bold tracking-[0.18em] text-cp-text-primary"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            CASEPORT
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          <Link
            href="/"
            className="text-[15px] font-medium text-cp-text-secondary hover:text-cp-text-primary transition-colors"
          >
            Home
          </Link>
          <Link
            href="/markets"
            className="text-[15px] font-medium text-cp-text-secondary hover:text-cp-text-primary transition-colors"
          >
            Markets
          </Link>
          <Link href="/insights" className="text-[15px] font-medium text-cp-cyan transition-colors">
            Insights
          </Link>
          <Link
            href="/intelligence"
            className="text-[15px] font-medium text-cp-text-secondary hover:text-cp-text-primary transition-colors"
          >
            Intelligence
          </Link>
          <Link
            href="/injured"
            className="text-[15px] font-medium text-cp-text-secondary hover:text-cp-text-primary transition-colors"
          >
            Injured?
          </Link>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/request-access"
            className="cta-secondary flex items-center gap-2 !h-10 !text-[13px] !px-5"
          >
            Subscribe
          </Link>
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
            <Link
              href="/"
              className="text-[15px] font-medium text-cp-text-secondary hover:text-cp-text-primary transition-colors py-2"
            >
              Home
            </Link>
            <Link
              href="/markets"
              className="text-[15px] font-medium text-cp-text-secondary hover:text-cp-text-primary transition-colors py-2"
            >
              Markets
            </Link>
            <Link href="/insights" className="text-[15px] font-medium text-cp-cyan py-2">
              Insights
            </Link>
            <Link
              href="/intelligence"
              className="text-[15px] font-medium text-cp-text-secondary hover:text-cp-text-primary transition-colors py-2"
            >
              Intelligence
            </Link>
            <Link
              href="/injured"
              className="text-[15px] font-medium text-cp-text-secondary hover:text-cp-text-primary transition-colors py-2"
            >
              Injured?
            </Link>
            <div className="pt-2 border-t border-white/[0.06]">
              <Link
                href="/request-access"
                className="cta-gradient flex items-center justify-center gap-2 w-full"
              >
                Request Access <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
