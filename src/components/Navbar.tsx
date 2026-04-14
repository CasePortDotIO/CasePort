'use client'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Menu } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

type NavLink = { label: string; href: string; openInNewTab?: boolean }

/**
 * Unified Navbar
 *
 * variant="firm"     — home / markets / city pages
 *                      CTA transforms on scroll: gradient button → amber "Check Availability"
 *
 * variant="editorial" — insights / article pages
 *                      Plain cyan "Subscribe" CTA, no scroll transform
 */
export default function Navbar({
  navLinks = [],
  ctaLabel = 'Request Private Access',
  ctaHref = '/request-access',
  variant = 'firm',
}: {
  navLinks?: NavLink[]
  ctaLabel?: string
  ctaHref?: string
  variant?: 'firm' | 'editorial'
}) {
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname() || ''

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
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 h-16 lg:h-[72px] sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <div className="text-[17px] font-extrabold tracking-[0.28em] text-white sm:text-lg">
            CASEPORT
          </div>
          <div
            className="system-label text-[#6B7280] mt-0.5 tracking-[0.22em] uppercase font-mono"
            style={{ fontSize: '0.5rem' }}
          >
            Case Flow Without Guesswork
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 text-[13px] font-medium text-[#9CA3AF] lg:flex">
          {navLinks.map((item) => {
            const isActive = item.href !== '/' && pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                target={item.openInNewTab ? '_blank' : undefined}
                rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
                className={`link-underline transition duration-200 hover:text-white ${isActive ? 'text-white' : ''} ${item.label === 'Injured?' ? 'group flex items-center gap-1.5' : ''}`}
              >
                {item.label}
                {item.label === 'Injured?' && (
                  <ArrowUpRight className="h-3 w-3 opacity-50 transition group-hover:opacity-100" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden lg:flex items-center gap-4">
          {variant === 'editorial' ? (
            /* Editorial: plain cyan subscribe button */
            <Link
              href={ctaHref}
              className="flex items-center gap-2 px-5 h-10 rounded-full text-[13px] font-semibold text-cp-cyan border border-cp-cyan/30 hover:bg-cp-cyan/10 transition-all duration-200"
            >
              {ctaLabel} <ArrowRight size={14} />
            </Link>
          ) : (
            /* Firm: scroll-transform CTA */
            <AnimatePresence mode="wait">
              {scrolled ? (
                <motion.div
                  key="scrolled-cta"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center gap-3"
                >
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-[11px] text-amber-400/80 font-medium">
                      17 founding slots left
                    </span>
                  </div>
                  <Button className="bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] hover:scale-105 text-black font-semibold border-0 transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]">
                    Check Availability
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="default-cta"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col items-center"
                >
                  <span className="text-[8px] uppercase tracking-[0.22em] text-[#6B7280] font-mono mb-1">
                    For qualified firms only
                  </span>
                  <Button
                    variant="gradient"
                    className="rounded-full px-5 py-2 text-[13px] font-semibold"
                    asChild
                  >
                    <Link href={ctaHref}>{ctaLabel}</Link>
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <button
              className="lg:hidden rounded-xl border border-white/10 bg-white/[0.04] p-2.5"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5 text-white" />
            </button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="bg-[#0A0E14] border-white/[0.08] w-[85%] sm:max-w-sm"
          >
            <SheetHeader>
              <SheetTitle className="text-white text-left">
                <span className="text-lg font-extrabold tracking-[0.28em]">CASEPORT</span>
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 px-4 mt-4">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  target={item.openInNewTab ? '_blank' : undefined}
                  rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
                  className="rounded-2xl px-4 py-3.5 text-[15px] font-medium text-[#D1D5DB] transition hover:bg-white/[0.04] hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-6 pt-6 border-t border-white/[0.08]">
                {variant === 'editorial' ? (
                  <Link
                    href={ctaHref}
                    className="flex items-center justify-center gap-2 w-full rounded-full px-6 py-3.5 text-sm font-semibold text-cp-cyan border border-cp-cyan/30 hover:bg-cp-cyan/10 transition-all"
                  >
                    {ctaLabel} <ArrowRight size={16} />
                  </Link>
                ) : (
                  <>
                    <div className="text-[9px] uppercase tracking-[0.22em] text-[#6B7280] font-mono mb-3 text-center">
                      For qualified firms only
                    </div>
                    <Button
                      variant="gradient"
                      className="w-full rounded-full px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(0,212,255,0.2)]"
                      asChild
                    >
                      <Link href={ctaHref}>{ctaLabel}</Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
