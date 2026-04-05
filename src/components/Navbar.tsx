'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, ArrowUpRight, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname() || ''

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const getBreadcrumb = () => {
    if (pathname === '/') return null
    let label = ''
    if (pathname.includes('/markets')) label = 'Markets'
    else if (pathname.includes('/for-law-firms')) label = 'Law Firms'
    else if (pathname.includes('/insights')) label = 'Insights'
    if (label) {
      return (
        <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400 ml-4 border-l border-white/[0.1] pl-4">
          <span className="text-[#00B4D8]">{label}</span>
        </div>
      )
    }
    return null
  }

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/markets', label: 'Markets' },
    { href: '/for-law-firms', label: 'For Law Firms' },
    { href: '/insights', label: 'Insights' },
    { href: '#injured', label: 'Injured?', hasIcon: true },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        scrolled
          ? 'bg-[#030608]/90 backdrop-blur-xl border-b border-white/[0.08]'
          : 'bg-transparent'
      }`}
    >
      <nav className="container mx-auto px-5 sm:px-6 lg:px-8 flex items-center justify-between h-16 lg:h-20">
        {/* Logo & Current Folder Indication */}
        <div className="flex items-center">
          <Link
            href="/"
            className="flex items-center gap-2 group transition-opacity duration-300 hover:opacity-80"
          >
            <span
              className="text-[18px] font-bold tracking-[0.18em] text-[#F1F3F5]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              CASEPORT
            </span>
          </Link>
          {getBreadcrumb()}
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== '/' && pathname.startsWith(link.href) && !link.href.startsWith('#'))
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`text-[14px] font-medium transition-colors flex items-center gap-1.5 ${
                  isActive ? 'text-[#00B4D8]' : 'text-[#B0B8C4] hover:text-white'
                }`}
              >
                {link.label}
                {link.hasIcon && <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />}
              </Link>
            )
          })}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            variant="gradient"
            asChild
            className="text-sm h-10 px-5 flex items-center gap-1.5 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            <Link href="/request-access">
              Request Access <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-[#B0B8C4] hover:text-white"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#030608]/95 backdrop-blur-xl border-t border-white/[0.08] absolute w-full max-h-[80vh] overflow-y-auto">
          <div className="container py-6 px-5 flex flex-col gap-4">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== '/' && pathname.startsWith(link.href) && !link.href.startsWith('#'))
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`text-[15px] font-medium py-2 flex items-center gap-2 ${
                    isActive ? 'text-[#00B4D8]' : 'text-[#B0B8C4] hover:text-white'
                  }`}
                >
                  {link.label}
                  {link.hasIcon && <ArrowUpRight className="w-4 h-4 opacity-60" />}
                </Link>
              )
            })}
            <div className="pt-4 mt-2 border-t border-white/[0.08]">
              <Button
                variant="gradient"
                asChild
                className="w-full flex items-center justify-center gap-2 font-medium hover:scale-105 rounded-lg h-12"
              >
                <Link href="/request-access" onClick={() => setMobileOpen(false)}>
                  Request Access <ArrowRight size={16} />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
