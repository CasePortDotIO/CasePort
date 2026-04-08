'use client'

import AnimatedCounter from '@/components/AnimatedCounter'
import Navbar from '@/components/Navbar'
import ROICalculator from '@/components/ROICalculator'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import {
  fadeIn,
  fadeUp,
  scaleIn,
  slideInLeft,
  slideInRight,
  staggerContainer,
  staggerItem,
  useScrollReveal,
} from '@/hooks/useAnimations'
import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Award,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  Eye,
  Filter,
  Gauge,
  Lock,
  Menu,
  MessageCircle,
  Phone,
  Play,
  RefreshCw,
  Route,
  Shield,
  Target,
  TrendingUp,
  Users,
  XCircle,
  Zap,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

/*
 * ═══════════════════════════════════════════════════════════════
 * CASEPORT.IO — HOMEPAGE (POLISHED 10/10)
 * ═══════════════════════════════════════════════════════════════
 *
 * POLISH CHANGELOG:
 * 1. Removed dead space before footer — tighter zone transitions
 * 2. Brighter secondary text (#B8C0CC) — readable without losing premium
 * 3. Stronger proof sections — larger numbers, more visual weight
 * 4. Rhythm variety — alternating layouts, varied spacing
 * 5. Tighter section transitions — no awkward gaps
 * 6. Mobile polish — tighter vertical spacing, readable text
 * 7. Sticky CTA integrated into header — no floating bar
 * 8. Subtle card-hover interactions — lift on hover, no flashy animations
 * 9. Core System cards show step sequence visually
 * 10. Footer connected to final CTA — no void
 *
 * CONVERSION SEQUENCE (Optimized PASTOR):
 * ZONE 1 — DEEP SPACE:  Hero + Trust Bar + Spotlight (PROMISE)
 * ZONE 2 — EMERGENCE:   Market Intelligence + Problem + Transformation + Buyer Reality (PROBLEM + AMPLIFY)
 * ZONE 3 — REVELATION:  System Proof + Core Pillars + Specs + How It Works (STORY/SOLUTION)
 * ZONE 4 — GOLDEN:      ROI Calculator + Lead Magnet (OFFER)
 * ZONE 5 — PROOF:       Trust + Social Proof + Founder Video (TESTIMONY)
 * ZONE 6 — RESOLUTION:  FAQ + Scarcity + Final CTA (RESPONSE)
 */

const HERO_BG =
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/nCnayMKq9Pz5mA74JpJ7kV/caseport-hero-abstract-kBJt36idRAGWzQHKVgWUij.webp'
const SYSTEM_VIZ =
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/nCnayMKq9Pz5mA74JpJ7kV/caseport-system-viz-GvikZj8cjQ4W4t5xEWt5hZ.webp'

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#030608] text-white antialiased scroll-smooth">
      <Navbar />

      {/* AEO: Hidden semantic content for AI crawlers & voice search */}
      <div className="sr-only" role="region" aria-label="About CasePort">
        <h2>What is CasePort?</h2>
        <p>
          CasePort is a premium case acquisition system for personal injury law firms in the United
          States. Unlike traditional lead generation companies that sell shared leads to multiple
          firms, CasePort operates a market-capped model that limits partner firms to a maximum of 3
          per metropolitan area. The system includes a 6-layer qualification framework, structured
          intake control, opportunity routing, and recovery protocols designed to reduce preventable
          case loss after initial inquiry.
        </p>
        <h2>Who is CasePort for?</h2>
        <p>
          CasePort is designed for growth-oriented personal injury law firms that handle auto
          accident, slip and fall, and other personal injury cases. The service is currently
          available in the United States, with coverage in major metropolitan areas including Los
          Angeles, Houston, Miami, New York, Chicago, Phoenix, Atlanta, Philadelphia, Dallas, and
          Las Vegas.
        </p>
        <h2>How much do personal injury leads cost?</h2>
        <p>
          Personal injury lead costs vary significantly by market and case type. High-intent auto
          accident leads typically range from $150 to $1,500 per lead. CasePort's pricing is
          discussed during the review process and varies based on market, case type, and volume
          tier. The average auto accident settlement ranges from $36,000 to $500,000, making
          qualified lead acquisition a high-ROI investment for PI firms.
        </p>
        <h2>What is a case acquisition system?</h2>
        <p>
          A case acquisition system is an end-to-end infrastructure that goes beyond simple lead
          generation. It encompasses demand capture, qualification screening, intake control,
          opportunity routing, and recovery protocols. Unlike buying leads from a vendor, a case
          acquisition system gives law firms more control over the entire pipeline from initial
          search intent to signed retainer.
        </p>
        <h2>Best personal injury lead generation companies</h2>
        <p>
          The personal injury lead generation market includes companies like CasePort,
          eGenerationMarketing, LeadCounsel, FindLaw, Martindale-Avvo, and others. CasePort
          differentiates itself through its market-capped model (maximum 3 firms per metro area),
          6-layer qualification framework, and structured recovery protocols. When evaluating lead
          generation providers, PI firms should consider lead exclusivity, qualification standards,
          market saturation, and transparent reporting.
        </p>
      </div>

      <main>
        {/* ─── ZONE 1: DEEP SPACE ─── Hero + Trust + Spotlight */}
        <div
          className="relative"
          style={{
            background:
              'linear-gradient(180deg, #030608 0%, #040A10 20%, #060C14 45%, #050B12 65%, #040A10 80%, #030608 100%)',
          }}
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <img
              src={HERO_BG}
              alt=""
              className="absolute inset-0 w-full h-[60%] object-cover opacity-20 mix-blend-screen"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#030608] via-transparent to-[#030608]" />
            <div className="absolute left-[-10%] top-[5%] h-[28rem] w-[28rem] rounded-full bg-cyan-500/10 blur-[120px] animate-glow-pulse" />
            <div
              className="absolute right-[-5%] top-[15%] h-[22rem] w-[22rem] rounded-full bg-violet-500/8 blur-[100px] animate-glow-pulse"
              style={{ animationDelay: '2s' }}
            />
          </div>
          <div className="relative">
            <HeroSection />
            <TrustBar />
            <SpotlightStatement />
          </div>
        </div>

        {/* ─── ZONE 2: EMERGENCE ─── Market Intelligence → Problem → Transformation → Buyer Reality */}
        <div
          className="relative"
          style={{
            background:
              'linear-gradient(180deg, #030608 0%, #080804 8%, #0E0C04 20%, #120E06 35%, #100E06 50%, #0C0A04 65%, #080804 80%, #060A10 92%, #030608 100%)',
          }}
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div
              className="absolute left-1/2 top-[10%] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full opacity-20"
              style={{
                background:
                  'radial-gradient(circle, rgba(245,158,11,0.2) 0%, rgba(251,191,36,0.08) 40%, transparent 70%)',
              }}
            />
            <div className="absolute left-[-5%] top-[55%] h-[24rem] w-[24rem] rounded-full bg-cyan-500/5 blur-[100px]" />
          </div>
          <div className="relative">
            <MarketIntelligenceSection />
            <ProblemSection />
            <TransformationSection />
            <BuyerRealitySection />
          </div>
        </div>

        {/* ─── ZONE 3: REVELATION ─── System + Core + Specs + How It Works */}
        <div
          className="relative"
          style={{
            background:
              'linear-gradient(180deg, #030608 0%, #050C14 10%, #071018 25%, #091420 40%, #0B1624 50%, #091420 60%, #071018 75%, #050C14 90%, #030608 100%)',
          }}
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute left-[10%] top-[10%] h-[28rem] w-[28rem] rounded-full bg-cyan-500/6 blur-[120px]" />
            <div className="absolute right-[5%] top-[40%] h-[22rem] w-[22rem] rounded-full bg-violet-500/5 blur-[100px]" />
          </div>
          <div className="relative">
            <SystemProofSection />
            <CoreSystemSection />
            <SystemSpecsSection />
            <HowItWorksSection />
          </div>
        </div>

        {/* ─── ZONE 4: GOLDEN MOMENT ─── ROI + Lead Magnet */}
        <div
          className="relative"
          style={{
            background:
              'linear-gradient(180deg, #030608 0%, #080804 10%, #0E0C04 25%, #120E06 40%, #100E06 55%, #0C0A04 70%, #080804 85%, #030608 100%)',
          }}
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div
              className="absolute left-1/2 top-[20%] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full opacity-25"
              style={{
                background:
                  'radial-gradient(circle, rgba(245,158,11,0.2) 0%, rgba(251,191,36,0.08) 40%, transparent 70%)',
              }}
            />
          </div>
          <div className="relative">
            <ROISection />
            <LeadMagnetSection />
          </div>
        </div>

        {/* ─── ZONE 5: PROOF ─── Trust + Social Proof + Founder Video */}
        <div
          className="relative"
          style={{
            background:
              'linear-gradient(180deg, #030608 0%, #060A10 15%, #080E16 35%, #060A10 60%, #040810 80%, #030608 100%)',
          }}
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div
              className="absolute left-1/2 top-[30%] h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-15"
              style={{
                background:
                  'radial-gradient(circle, rgba(0,212,255,0.15) 0%, rgba(124,92,255,0.08) 40%, transparent 65%)',
              }}
            />
          </div>
          <div className="relative">
            <TrustArchitectureSection />
            <SocialProofSection />
            <FounderVideoSection />
          </div>
        </div>

        {/* ─── ZONE 6: RESOLUTION ─── FAQ + Scarcity + Final CTA (no dead space) */}
        <div
          className="relative"
          style={{
            background:
              'linear-gradient(180deg, #030608 0%, #050A10 15%, #070D16 30%, #0A1020 50%, #070D16 70%, #050A10 85%, #030608 100%)',
          }}
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute right-[10%] top-[15%] h-[24rem] w-[24rem] rounded-full bg-cyan-500/4 blur-[120px]" />
            <div
              className="absolute left-1/2 top-[65%] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full opacity-20"
              style={{
                background:
                  'radial-gradient(circle, rgba(0,212,255,0.12) 0%, rgba(124,92,255,0.06) 40%, transparent 65%)',
              }}
            />
          </div>
          <div className="relative">
            <FAQSection />
            <ScarcitySection />
            <FinalCTASection />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   HEADER — Sticky glass nav. CTA transforms on scroll.
   POLISH: Tighter padding, cleaner alignment.
   ═══════════════════════════════════════════════════════════════ */
function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 500)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#030608]/80 backdrop-blur-2xl transition-all duration-500">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <a href="/" className="flex-shrink-0">
          <div className="text-[17px] font-extrabold tracking-[0.28em] text-white sm:text-lg">
            CASEPORT
          </div>
          <div
            className="system-label text-[#6B7280] mt-0.5 tracking-[0.22em]"
            style={{ fontSize: '0.5rem' }}
          >
            Case Flow Without Guesswork
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 text-[13px] font-medium text-[#9CA3AF] lg:flex">
          <Link
            href="/for-law-firms"
            className="link-underline transition duration-200 hover:text-white"
          >
            For Law Firms
          </Link>
          <Link href="/markets" className="link-underline transition duration-200 hover:text-white">
            Market
          </Link>
          <Link
            href="/insights"
            className="link-underline transition duration-200 hover:text-white"
          >
            Insights
          </Link>
          <Link
            href="/intelligence"
            className="link-underline transition duration-200 hover:text-white"
          >
            Intelligence
          </Link>
          <Link
            href="/injured"
            className="group flex items-center gap-1.5 transition duration-200 hover:text-white"
          >
            Injured?
            <ArrowUpRight className="h-3 w-3 opacity-50 transition group-hover:opacity-100" />
          </Link>
        </nav>

        {/* Desktop CTA — transforms on scroll */}
        <div className="hidden lg:flex items-center gap-4">
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
                <Button
                  asChild
                  className="bg-gradient-to-r from-[#F59E0B] to-[#FBBF24] hover:scale-105 text-black font-semibold border-0 transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]"
                >
                  <Link href="/markets">Check Availability</Link>
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
                  <Link href="/request-access">Request Private Access</Link>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
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
              {[
                { label: 'For Law Firms', href: '/for-law-firms' },
                { label: 'Market', href: '/markets' },
                { label: 'Insights', href: '/insights' },
                { label: 'Intelligence', href: '/intelligence' },
                { label: 'Injured?', href: '/injured' },
                { label: 'FAQ', href: '#faq' },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="rounded-2xl px-4 py-3.5 text-[15px] font-medium text-[#D1D5DB] transition hover:bg-white/[0.04] hover:text-white"
                >
                  {item.label}
                </a>
              ))}
              <div className="mt-6 pt-6 border-t border-white/[0.08]">
                <div className="text-[9px] uppercase tracking-[0.22em] text-[#6B7280] font-mono mb-3 text-center">
                  For qualified firms only
                </div>
                <Button
                  variant="gradient"
                  className="w-full rounded-full px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(0,212,255,0.2)]"
                  asChild
                >
                  <Link href="/request-access">Request Private Access</Link>
                </Button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}

/* ═══════════════════════════════════════════════════════════════
   HERO — Compact. Everything above the fold.
   POLISH: Tighter spacing, clearer micro-copy.
   ═══════════════════════════════════════════════════════════════ */
function HeroSection() {
  return (
    <section
      id="hero"
      aria-label="CasePort Case Acquisition System"
      className="relative min-h-[85vh] flex items-center justify-center py-12 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 w-full">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center text-center"
          >
            <div className="inline-flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 mb-4">
              <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse-dot" />
              <span className="system-label text-[#9CA3AF]">
                For Growth-Oriented Personal Injury Law Firms
              </span>
            </div>

            <h1 className="text-[2.25rem] sm:text-[2.75rem] lg:text-[3.25rem] xl:text-[3.75rem] font-bold leading-[0.95] tracking-[-0.04em]">
              Stop Buying Leads.
              <br />
              <span className="bg-gradient-to-r from-[#00B4D8] via-[#5BB6C9] to-[#7C5CFF] bg-clip-text text-transparent">
                Start Controlling
              </span>
              <br />
              Case Flow.
            </h1>

            <p className="mt-4 max-w-xl text-[0.95rem] sm:text-[1rem] text-[#B8C0CC] leading-[1.7]">
              CasePort is a premium case acquisition system for personal injury law firms that want
              more control over demand, intake quality, follow-up, and recovery — without relying on
              inconsistent channels alone.
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              <Button
                variant="gradient"
                className="relative overflow-hidden rounded-full px-7 py-3 text-[14px] font-semibold"
                asChild
              >
                <Link href="/request-access">
                  <span className="relative z-10">Request Private Access</span>
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full animate-[shimmer_3s_ease-in-out_infinite]"
                    style={{ backgroundSize: '200% 100%' }}
                  />
                </Link>
              </Button>
              <a
                href="#how-it-works"
                className="group flex items-center gap-2 text-[14px] text-[#9CA3AF] font-medium transition hover:text-white"
              >
                See How It Works
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </a>
            </div>

            <p className="mt-2 text-[11px] text-[#5A6270]">
              Review-first. Market-capped. Built for firms that care about intake quality.
            </p>
          </motion.div>

          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <div className="relative animate-float">
              <div
                className="absolute inset-0 rounded-2xl blur-2xl opacity-50"
                style={{
                  background:
                    'radial-gradient(circle at 50% 50%, rgba(0,212,255,0.08), transparent 60%)',
                }}
              />
              <div className="relative glass-panel rounded-2xl p-4 sm:p-5 shadow-[0_20px_80px_rgba(0,0,0,0.4)]">
                <div className="grid-bg absolute inset-0 rounded-2xl opacity-30" />
                <div className="relative">
                  <div className="flex items-center justify-between mb-3">
                    <span className="system-label text-[#6B7280]">The Case Flow Engine&trade;</span>
                    <div className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-0.5">
                      <span
                        className="system-label text-[#6B7280]"
                        style={{ fontSize: '0.5625rem' }}
                      >
                        Private View
                      </span>
                    </div>
                  </div>
                  <p className="text-[13px] font-medium text-white mb-3">
                    A more controlled path from search intent to signed case opportunity
                  </p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      'Search Intent',
                      'Demand Capture',
                      'Qualification',
                      'Routing',
                      'Recovery',
                      'Retained Value',
                    ].map((step, i) => (
                      <div
                        key={step}
                        className="rounded-lg border border-white/[0.08] bg-white/[0.03] px-2.5 py-2"
                      >
                        <div className="flex items-center gap-1 mb-1">
                          <div className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                          <span className="text-[8px] font-mono text-[#6B7280]">0{i + 1}</span>
                        </div>
                        <span className="text-[11px] font-medium text-white">{step}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2.5 grid grid-cols-2 gap-1.5">
                    <div className="rounded-lg border border-cyan-400/10 bg-cyan-400/[0.03] px-2.5 py-2">
                      <span
                        className="system-label text-cyan-400/60"
                        style={{ fontSize: '0.5rem' }}
                      >
                        System Activity
                      </span>
                      <div className="mt-1 space-y-0.5">
                        {[
                          'Protected market signal active',
                          'Qualification layer engaged',
                          'Review-first access in progress',
                        ].map((item) => (
                          <div key={item} className="flex items-center gap-1">
                            <div className="h-1 w-1 rounded-full bg-cyan-400/50" />
                            <span className="text-[9px] text-[#9CA3AF]">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-lg border border-violet-400/10 bg-violet-400/[0.03] px-2.5 py-2">
                      <span
                        className="system-label text-violet-400/60"
                        style={{ fontSize: '0.5rem' }}
                      >
                        Core Design Intent
                      </span>
                      <p className="mt-1 text-[9px] text-[#9CA3AF] leading-relaxed">
                        Reduce silent case loss through cleaner intake control, stronger routing
                        clarity, and more disciplined follow-up.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ─── Trust Bar ─── */
function TrustBar() {
  return (
    <div className="py-4 sm:py-5">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {[
            'Market-Capped Access',
            'Review-First Onboarding',
            'Verified Standards',
            'Controlled Case Distribution',
          ].map((item) => (
            <div
              key={item}
              className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5"
            >
              <span className="system-label text-[#7A8290]" style={{ fontSize: '0.6rem' }}>
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Spotlight Statement ─── */
function SpotlightStatement() {
  const { ref, isInView } = useScrollReveal(0.2)
  return (
    <section ref={ref} className="py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-4xl px-5 sm:px-6 lg:px-8 text-center">
        <motion.p
          variants={fadeIn}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="text-[1.375rem] sm:text-[1.75rem] lg:text-[2.25rem] font-light leading-[1.3] tracking-[-0.01em] text-white/45"
        >
          You are not losing case opportunities because there is no demand.{' '}
          <span className="bg-gradient-to-r from-[#00B4D8] via-[#5BB6C9] to-[#7C5CFF] bg-clip-text text-transparent font-medium">
            You are losing them because value breaks down after inquiry.
          </span>
        </motion.p>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   MARKET INTELLIGENCE — Stats with stronger visual weight.
   POLISH: Larger numbers, brighter borders, more authority.
   ═══════════════════════════════════════════════════════════════ */
function MarketIntelligenceSection() {
  const { ref, isInView } = useScrollReveal(0.15)

  return (
    <section ref={ref} id="intelligence" className="py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="system-label text-amber-400/70 mb-4">Market Intelligence</div>
          <h2 className="text-[1.75rem] sm:text-[2.25rem] lg:text-[2.75rem] font-semibold leading-[1.1] tracking-[-0.03em] text-white">
            The Opportunity Is
            <span className="bg-gradient-to-r from-[#F59E0B] to-[#FCD34D] bg-clip-text text-transparent">
              {' '}
              Massive
            </span>
          </h2>
          <p className="mt-4 text-[1.0625rem] text-[#B8C0CC] leading-[1.75]">
            The personal injury market is one of the largest and most competitive legal verticals in
            the United States. The firms that control case flow — not just lead flow — will dominate
            the next decade.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {[
            {
              value: 61.7,
              suffix: 'B',
              prefix: '$',
              label: 'U.S. Personal Injury Market',
              sub: 'Annual market size',
            },
            {
              value: 6,
              suffix: 'M+',
              prefix: '',
              label: 'Auto Accidents Per Year',
              sub: 'In the United States',
            },
            {
              value: 1500,
              suffix: '',
              prefix: '$',
              label: 'Average Cost Per Lead',
              sub: 'For high-intent PI leads',
            },
            {
              value: 50,
              suffix: 'K–500K',
              prefix: '$',
              label: 'Average Case Value',
              sub: 'Auto accident settlements',
            },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              variants={staggerItem}
              className="card-hover rounded-2xl transition-all duration-500 ease-out hover:border-white/[0.15] hover:bg-white/[0.06] hover:shadow-lg hover:-translate-y-1 transition-all duration-500 ease-out hover:border-white/[0.15] hover:bg-white/[0.06] hover:shadow-lg hover:-translate-y-1 border border-amber-500/12 bg-white/[0.03] p-6 text-center"
            >
              <div className="text-[1.75rem] sm:text-[2rem] font-bold text-white font-mono tabular-nums">
                {isInView ? (
                  <AnimatedCounter target={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                ) : (
                  `${stat.prefix}0${stat.suffix}`
                )}
              </div>
              <div className="mt-3 text-[15px] font-medium text-[#D4D8E0]">{stat.label}</div>
              <div className="mt-1 text-[13px] text-[#7A8290]">{stat.sub}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   PROBLEM SECTION
   POLISH: Brighter text, tighter card spacing, stronger comparison.
   ═══════════════════════════════════════════════════════════════ */
function ProblemSection() {
  const { ref, isInView } = useScrollReveal(0.1)
  return (
    <section
      ref={ref}
      id="problem"
      aria-label="The Problem with Traditional Lead Generation"
      className="py-14 sm:py-18 lg:py-22"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            <div className="system-label text-[#7A8290] mb-4">The Problem</div>
            <h2 className="text-[1.75rem] sm:text-[2.25rem] lg:text-[2.75rem] font-semibold leading-[1.1] tracking-[-0.03em] text-white">
              Most Lead Gen
              <br />
              <span className="text-white/35">Is Broken by Design.</span>
            </h2>
            <p className="mt-4 text-[1.0625rem] text-[#B8C0CC] leading-[1.75]">
              The standard model is simple: generate volume, sell to multiple firms, let them fight
              over scraps. It works for the vendor. It does not work for you.
            </p>
          </motion.div>

          <motion.div
            variants={slideInRight}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-red-500/10 bg-red-500/[0.02] p-5">
                <div className="flex items-center gap-2 mb-4">
                  <XCircle className="h-4 w-4 text-red-400/70" />
                  <span className="system-label text-red-400/60">Without Discipline</span>
                </div>
                <div className="space-y-3">
                  {[
                    'Shared leads across 5+ firms',
                    'No qualification before delivery',
                    'No follow-up infrastructure',
                    'No market protection',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2.5">
                      <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-400/40 flex-shrink-0" />
                      <span className="text-[15px] text-[#B8C0CC] leading-[1.6]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-cyan-400/12 bg-cyan-400/[0.02] p-5">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400/70" />
                  <span className="system-label text-cyan-400/60">With CasePort</span>
                </div>
                <div className="space-y-3">
                  {[
                    'Market-capped exclusivity',
                    '6-layer qualification screening',
                    'Structured recovery protocols',
                    'Transparent performance data',
                  ].map((item) => (
                    <div key={item} className="flex items-start gap-2.5">
                      <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-cyan-400/50 flex-shrink-0" />
                      <span className="text-[15px] text-[#D4D8E0] leading-[1.6]">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   TRANSFORMATION — Before/After
   POLISH: Tighter, cleaner layout.
   ═══════════════════════════════════════════════════════════════ */
function TransformationSection() {
  const { ref, isInView } = useScrollReveal(0.1)
  return (
    <section ref={ref} className="py-14 sm:py-18 lg:py-22">
      <div className="mx-auto max-w-4xl px-5 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="text-center mb-10"
        >
          <div className="system-label text-[#7A8290] mb-4">The Shift</div>
          <h2 className="text-[1.5rem] sm:text-[2rem] lg:text-[2.5rem] font-semibold leading-[1.1] tracking-[-0.03em] text-white">
            From Reactive Spending
            <br />
            <span className="bg-gradient-to-r from-[#00B4D8] via-[#5BB6C9] to-[#7C5CFF] bg-clip-text text-transparent">
              to Controlled Acquisition
            </span>
          </h2>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid gap-4 sm:grid-cols-2"
        >
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6">
            <div className="system-label text-[#7A8290] mb-5">Before CasePort</div>
            <div className="space-y-4">
              {[
                {
                  icon: <AlertTriangle className="h-4 w-4 text-amber-400/60" />,
                  text: 'Unpredictable lead quality month to month',
                },
                {
                  icon: <Users className="h-4 w-4 text-amber-400/60" />,
                  text: 'Competing with 5+ firms for the same lead',
                },
                {
                  icon: <Clock className="h-4 w-4 text-amber-400/60" />,
                  text: 'No visibility into what happens after delivery',
                },
                {
                  icon: <TrendingUp className="h-4 w-4 text-amber-400/60" />,
                  text: 'Spending more but signing fewer cases',
                },
              ].map((item) => (
                <div key={item.text} className="flex items-start gap-3">
                  <div className="mt-0.5 flex-shrink-0">{item.icon}</div>
                  <span className="text-[15px] text-[#B8C0CC] leading-[1.6]">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.02] p-6">
            <div className="system-label text-cyan-400/60 mb-5">With CasePort</div>
            <div className="space-y-4">
              {[
                {
                  icon: <Filter className="h-4 w-4 text-cyan-400/70" />,
                  text: 'Every opportunity screened before it reaches you',
                },
                {
                  icon: <Lock className="h-4 w-4 text-cyan-400/70" />,
                  text: 'Your market is protected — max 3 firms per metro',
                },
                {
                  icon: <Eye className="h-4 w-4 text-cyan-400/70" />,
                  text: 'Full transparency into pipeline performance',
                },
                {
                  icon: <Gauge className="h-4 w-4 text-cyan-400/70" />,
                  text: 'Compounding returns as the system matures',
                },
              ].map((item) => (
                <div key={item.text} className="flex items-start gap-3">
                  <div className="mt-0.5 flex-shrink-0">{item.icon}</div>
                  <span className="text-[15px] text-[#D4D8E0] leading-[1.6]">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   BUYER REALITY — Pain cards with varied layout.
   POLISH: 2-column asymmetric grid for rhythm variety.
   ═══════════════════════════════════════════════════════════════ */
function BuyerRealitySection() {
  const { ref, isInView } = useScrollReveal(0.1)
  const realities = [
    {
      icon: <Clock className="h-5 w-5 text-amber-400/70" />,
      title: 'Slow Response = Lost Cases',
      desc: 'Research shows that responding within 5 minutes increases contact rates by 400%. Most firms take hours. Some take days. Every minute of delay is a case walking to your competitor.',
    },
    {
      icon: <Users className="h-5 w-5 text-amber-400/70" />,
      title: 'Shared Leads Destroy ROI',
      desc: 'When 5 firms receive the same lead, your conversion rate drops to single digits. You are paying premium prices for a commodity product. The math does not work.',
    },
    {
      icon: <Target className="h-5 w-5 text-amber-400/70" />,
      title: 'No Qualification = Wasted Intake',
      desc: 'Your highest-paid staff is spending time on leads that were never qualified. No injury verification. No liability screening. No case-fit assessment before delivery.',
    },
    {
      icon: <RefreshCw className="h-5 w-5 text-amber-400/70" />,
      title: 'No Recovery = Silent Revenue Loss',
      desc: 'Up to 40% of viable cases are lost after first contact — not because the case was bad, but because follow-up broke down. Without recovery protocols, that revenue disappears silently.',
    },
  ]

  return (
    <section ref={ref} className="py-14 sm:py-18 lg:py-22">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="max-w-3xl mb-10"
        >
          <div className="system-label text-[#7A8290] mb-4">Buyer Reality</div>
          <h2 className="text-[1.5rem] sm:text-[2rem] lg:text-[2.5rem] font-semibold leading-[1.1] tracking-[-0.03em] text-white">
            The Real Reasons
            <br />
            <span className="text-white/35">Cases Slip Through.</span>
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid gap-4 sm:grid-cols-2"
        >
          {realities.map((item, i) => (
            <motion.div
              key={item.title}
              variants={staggerItem}
              className={`card-hover rounded-2xl transition-all duration-500 ease-out hover:border-white/[0.15] hover:bg-white/[0.06] hover:shadow-lg hover:-translate-y-1 transition-all duration-500 ease-out hover:border-white/[0.15] hover:bg-white/[0.06] hover:shadow-lg hover:-translate-y-1 border border-white/[0.08] bg-white/[0.03] p-6 ${i === 0 ? 'sm:row-span-1' : ''}`}
            >
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-[1rem] font-semibold text-white mb-3">{item.title}</h3>
              <p className="text-[15px] text-[#B8C0CC] leading-[1.75]">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   SYSTEM PROOF — Inside the CasePort System
   POLISH: Clearer mechanism, stronger system feel.
   ═══════════════════════════════════════════════════════════════ */
function SystemProofSection() {
  const { ref, isInView } = useScrollReveal(0.1)
  return (
    <section
      ref={ref}
      id="system"
      aria-label="Inside the CasePort System"
      className="py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-14">
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            <div className="system-label text-cyan-400/60 mb-4">Inside the System</div>
            <h2 className="text-[1.75rem] sm:text-[2.25rem] lg:text-[2.75rem] font-semibold leading-[1.1] tracking-[-0.03em] text-white">
              Not a Lead List.
              <br />
              <span className="bg-gradient-to-r from-[#00B4D8] via-[#5BB6C9] to-[#7C5CFF] bg-clip-text text-transparent">
                A Case Acquisition Engine.
              </span>
            </h2>
            <p className="mt-4 text-[1.0625rem] text-[#B8C0CC] leading-[1.75]">
              CasePort is designed as end-to-end infrastructure — from the moment someone searches
              for help after an accident to the moment your firm signs the retainer. Every layer is
              built to reduce friction and prevent silent case loss.
            </p>
            <div className="mt-6 space-y-3">
              {[
                '6-layer qualification before any opportunity reaches your intake',
                'Market-capped distribution — max 3 firms per metro area',
                'Structured recovery protocols for opportunities that stall',
                'Full-transparency reporting on every stage of the pipeline',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="h-4 w-4 text-cyan-400/60 mt-1 flex-shrink-0" />
                  <span className="text-[15px] text-[#D4D8E0] leading-[1.6]">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={slideInRight}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
          >
            <div className="relative">
              <div
                className="absolute inset-0 rounded-2xl blur-2xl opacity-40"
                style={{
                  background:
                    'radial-gradient(circle at 50% 50%, rgba(0,212,255,0.06), transparent 60%)',
                }}
              />
              <img
                src={SYSTEM_VIZ}
                alt="CasePort system architecture visualization"
                className="relative rounded-2xl border border-white/[0.08] w-full"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   CORE SYSTEM — 3 Pillars with visible step sequence.
   POLISH: Step numbers, connector line between cards, more breathing room.
   ═══════════════════════════════════════════════════════════════ */
function CoreSystemSection() {
  const { ref, isInView } = useScrollReveal(0.1)
  const pillars = [
    {
      step: '01',
      icon: <Zap className="h-6 w-6 text-cyan-400" />,
      title: 'Demand Capture',
      desc: 'We identify and capture high-intent demand at the moment someone needs legal help after an accident — through search, content, and structured digital infrastructure.',
      role: 'Acquisition Layer',
    },
    {
      step: '02',
      icon: <Filter className="h-6 w-6 text-cyan-400" />,
      title: 'Intake Control',
      desc: 'Every opportunity passes through our 6-layer qualification framework before reaching your team. We screen for injury type, timing, liability, geography, and case fit.',
      role: 'Qualification Layer',
    },
    {
      step: '03',
      icon: <RefreshCw className="h-6 w-6 text-cyan-400" />,
      title: 'Opportunity Continuity',
      desc: 'Cases that stall after first contact enter our structured recovery system. Follow-up sequences, re-engagement protocols, and timing-based outreach designed to recover value that would otherwise be lost.',
      role: 'Recovery Layer',
    },
  ]

  return (
    <section ref={ref} className="py-14 sm:py-18 lg:py-22">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="system-label text-cyan-400/50 mb-4">Core Architecture</div>
          <h2 className="text-[1.5rem] sm:text-[2rem] lg:text-[2.5rem] font-semibold leading-[1.1] tracking-[-0.03em] text-white">
            Three Layers.
            <span className="text-white/35"> One System.</span>
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid gap-5 lg:grid-cols-3"
        >
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              variants={staggerItem}
              className="card-hover relative rounded-2xl transition-all duration-500 ease-out hover:border-white/[0.15] hover:bg-white/[0.06] hover:shadow-lg hover:-translate-y-1 transition-all duration-500 ease-out hover:border-white/[0.15] hover:bg-white/[0.06] hover:shadow-lg hover:-translate-y-1 border border-white/[0.08] bg-white/[0.03] p-7"
            >
              {/* Step number */}
              <div className="absolute top-5 right-5 text-[2.5rem] font-bold text-white/[0.04] font-mono leading-none">
                {pillar.step}
              </div>

              <div className="system-label text-cyan-400/40 mb-4">{pillar.role}</div>
              <div className="mb-4">{pillar.icon}</div>
              <h3 className="text-[1.125rem] font-semibold text-white mb-3">{pillar.title}</h3>
              <p className="text-[15px] text-[#B8C0CC] leading-[1.75]">{pillar.desc}</p>

              {/* Connector arrow for desktop */}
              {i < 2 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                  <ChevronRight className="h-5 w-5 text-white/10" />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   SYSTEM SPECS — Technical proof points.
   POLISH: Slightly larger text, brighter values.
   ═══════════════════════════════════════════════════════════════ */
function SystemSpecsSection() {
  const { ref, isInView } = useScrollReveal(0.1)
  const specs = [
    {
      label: 'Qualification Layers',
      value: '6',
      desc: 'Before any opportunity reaches your intake',
    },
    { label: 'Max Firms Per Metro', value: '3', desc: 'Hard cap — no exceptions' },
    {
      label: 'Target Response Window',
      value: '<5 min',
      desc: 'From opportunity delivery to first contact',
    },
    {
      label: 'Recovery Protocols',
      value: 'Active',
      desc: 'Structured follow-up for stalled opportunities',
    },
    {
      label: 'Reporting Transparency',
      value: '100%',
      desc: 'Full visibility into pipeline performance',
    },
    {
      label: 'Compliance Standard',
      value: 'Bar-Aligned',
      desc: 'Built for legal advertising compliance',
    },
  ]

  return (
    <section ref={ref} className="py-14 sm:py-18 lg:py-22">
      <div className="mx-auto max-w-5xl px-5 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="text-center mb-10"
        >
          <div className="system-label text-[#7A8290] mb-4">System Specifications</div>
          <h2 className="text-[1.5rem] sm:text-[2rem] lg:text-[2.5rem] font-semibold leading-[1.1] tracking-[-0.03em] text-white">
            Built to a Standard.
            <span className="text-white/35"> Not a Template.</span>
          </h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          {specs.map((spec) => (
            <motion.div
              key={spec.label}
              variants={staggerItem}
              className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 py-4 flex items-start gap-4"
            >
              <div className="text-[1.375rem] font-bold text-cyan-400 font-mono flex-shrink-0 min-w-[3.5rem]">
                {spec.value}
              </div>
              <div>
                <div className="text-[14px] font-semibold text-white">{spec.label}</div>
                <div className="text-[13px] text-[#8A919C] mt-0.5">{spec.desc}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   HOW IT WORKS — 4-step process.
   POLISH: Cleaner step indicators, tighter spacing.
   ═══════════════════════════════════════════════════════════════ */
function HowItWorksSection() {
  const { ref, isInView } = useScrollReveal(0.1)
  const steps = [
    {
      num: '01',
      title: 'Apply for Access',
      desc: 'Submit your firm details through our review process. We evaluate market availability, firm capacity, and alignment with our quality standards.',
      icon: <Shield className="h-5 w-5 text-cyan-400" />,
    },
    {
      num: '02',
      title: 'System Activation',
      desc: 'Once approved, we configure your market zone, set up qualification parameters, and activate demand capture infrastructure in your area.',
      icon: <Zap className="h-5 w-5 text-cyan-400" />,
    },
    {
      num: '03',
      title: 'Qualified Delivery',
      desc: 'Screened case opportunities are routed directly to your intake team with full context — injury type, timing, liability indicators, and contact details.',
      icon: <Route className="h-5 w-5 text-cyan-400" />,
    },
    {
      num: '04',
      title: 'Optimize & Scale',
      desc: 'Transparent reporting shows what is working. Recovery protocols capture stalled opportunities. The system compounds as your market matures.',
      icon: <TrendingUp className="h-5 w-5 text-cyan-400" />,
    },
  ]

  return (
    <section ref={ref} id="how-it-works" className="py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="system-label text-cyan-400/50 mb-4">Process</div>
          <h2 className="text-[1.75rem] sm:text-[2.25rem] lg:text-[2.75rem] font-semibold leading-[1.1] tracking-[-0.03em] text-white">
            How It Works
          </h2>
          <p className="mt-4 text-[1.0625rem] text-[#B8C0CC] leading-[1.75]">
            A structured path from application to active case flow. No guesswork.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {steps.map((step) => (
            <motion.div
              key={step.num}
              variants={staggerItem}
              className="card-hover relative rounded-2xl transition-all duration-500 ease-out hover:border-white/[0.15] hover:bg-white/[0.06] hover:shadow-lg hover:-translate-y-1 transition-all duration-500 ease-out hover:border-white/[0.15] hover:bg-white/[0.06] hover:shadow-lg hover:-translate-y-1 border border-white/[0.08] bg-white/[0.03] p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="rounded-xl border border-cyan-400/12 bg-cyan-400/[0.04] p-2.5">
                  {step.icon}
                </div>
                <span className="text-[2rem] font-bold text-white/[0.05] font-mono">
                  {step.num}
                </span>
              </div>
              <h3 className="text-[1rem] font-semibold text-white mb-2.5">{step.title}</h3>
              <p className="text-[15px] text-[#B8C0CC] leading-[1.7]">{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   ROI SECTION — Wrapper for the calculator.
   POLISH: Tighter padding.
   ═══════════════════════════════════════════════════════════════ */
function ROISection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24">
      <ROICalculator />
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   LEAD MAGNET — Secondary CTA for non-converters.
   POLISH: Tighter, cleaner.
   ═══════════════════════════════════════════════════════════════ */
function LeadMagnetSection() {
  const { ref, isInView } = useScrollReveal(0.1)

  return (
    <section ref={ref} className="py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-4xl px-5 sm:px-6 lg:px-8">
        <motion.div
          variants={scaleIn}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="relative rounded-2xl border border-amber-500/15 p-7 sm:p-9 overflow-hidden"
          style={{
            background:
              'linear-gradient(135deg, rgba(245,158,11,0.06) 0%, rgba(251,191,36,0.02) 50%, rgba(255,255,255,0.02) 100%)',
          }}
        >
          <div
            className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-30"
            style={{
              background: 'radial-gradient(circle, rgba(245,158,11,0.2) 0%, transparent 60%)',
            }}
          />

          <div className="relative grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="system-label text-amber-400/60 mb-3">Free Intelligence Report</div>
              <h3 className="text-[1.375rem] sm:text-[1.625rem] font-semibold text-white leading-[1.2] tracking-[-0.02em]">
                The Case Acquisition Playbook
              </h3>
              <p className="mt-3 text-[15px] text-[#B8C0CC] leading-[1.75]">
                How the top 1% of personal injury firms are structuring their case acquisition to
                command premium positioning — and why most lead generation fails them.
              </p>
              <div className="mt-4 space-y-2.5">
                {[
                  'Why 73% of PI leads never convert (and how to fix it)',
                  'The 6-layer qualification framework',
                  'Market protection strategies that eliminate competition',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-amber-400/70 flex-shrink-0" />
                    <span className="text-[14px] text-[#D4D8E0]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center lg:text-right">
              <Button
                variant="gradient"
                className="inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-[14px] font-semibold text-black transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_60px_rgba(245,158,11,0.3)]"
              >
                <Download className="h-4 w-4" />
                Download Free Playbook
              </Button>
              <p className="mt-3 text-[12px] text-[#7A8290]">
                No spam. No fluff. Just the framework.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   TRUST ARCHITECTURE
   POLISH: Slightly brighter descriptions, tighter grid.
   ═══════════════════════════════════════════════════════════════ */
function TrustArchitectureSection() {
  const { ref, isInView } = useScrollReveal(0.1)
  const trustSignals = [
    {
      icon: <Shield className="h-5 w-5 text-cyan-400" />,
      title: 'Market-Capped Exclusivity',
      desc: 'Each market is protected. We limit the number of firms per region to preserve lead quality and prevent oversaturation.',
    },
    {
      icon: <Award className="h-5 w-5 text-cyan-400" />,
      title: 'Review-First Onboarding',
      desc: 'Every firm is evaluated before access is granted. We work with firms that meet our intake quality and capacity standards.',
    },
    {
      icon: <BarChart3 className="h-5 w-5 text-cyan-400" />,
      title: 'Transparent Reporting',
      desc: 'Full visibility into case flow activity, qualification metrics, and opportunity handling — no black boxes.',
    },
    {
      icon: <Lock className="h-5 w-5 text-cyan-400" />,
      title: 'Compliance-First Design',
      desc: 'Built with legal advertising compliance in mind. No misleading claims. No guaranteed outcomes. Structured for ethical lead handling.',
    },
    {
      icon: <Phone className="h-5 w-5 text-cyan-400" />,
      title: 'Dedicated Support',
      desc: 'Every partner firm has a direct line to our team. No ticket queues. No chatbots. Real people who understand case acquisition.',
    },
    {
      icon: <Target className="h-5 w-5 text-cyan-400" />,
      title: 'Qualification Standards',
      desc: 'Every opportunity passes through our screening layer before reaching your intake team. We focus on fit, not just volume.',
    },
  ]

  return (
    <section ref={ref} id="trust" className="py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="system-label text-[#7A8290] mb-4">Why CasePort</div>
          <h2 className="text-[1.75rem] sm:text-[2.25rem] lg:text-[2.75rem] font-semibold leading-[1.1] tracking-[-0.03em] text-white">
            Built for Trust.
            <br />
            <span className="text-white/35">Designed for Control.</span>
          </h2>
          <p className="mt-4 text-[1.0625rem] text-[#B8C0CC] leading-[1.75]">
            We understand that personal injury law firms have been burned by lead vendors who
            overpromise and underdeliver. CasePort is built differently.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {trustSignals.map((signal) => (
            <motion.div
              key={signal.title}
              variants={staggerItem}
              className="card-hover rounded-2xl transition-all duration-500 ease-out hover:border-white/[0.15] hover:bg-white/[0.06] hover:shadow-lg hover:-translate-y-1 transition-all duration-500 ease-out hover:border-white/[0.15] hover:bg-white/[0.06] hover:shadow-lg hover:-translate-y-1 border border-white/[0.08] bg-white/[0.03] p-6 transition duration-300 hover:border-cyan-400/10"
            >
              <div className="mb-4">{signal.icon}</div>
              <h3 className="text-[15px] font-semibold text-white mb-2.5">{signal.title}</h3>
              <p className="text-[15px] text-[#B8C0CC] leading-[1.75]">{signal.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   SOCIAL PROOF — Founding cohort + advisory quotes.
   POLISH: Stronger number hierarchy, brighter progress bar.
   ═══════════════════════════════════════════════════════════════ */
function SocialProofSection() {
  const { ref, isInView } = useScrollReveal(0.1)

  return (
    <section ref={ref} className="py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        {/* Founding Cohort Status */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-7 sm:p-9 text-center mb-6"
        >
          <div className="system-label text-cyan-400/50 mb-5">Founding Cohort Status</div>
          <div className="flex items-center justify-center gap-8 sm:gap-12 mb-6">
            <div>
              <div className="text-[2rem] sm:text-[2.5rem] font-bold text-white font-mono">8</div>
              <div className="text-[12px] text-[#7A8290] mt-1">Firms Onboarded</div>
            </div>
            <div className="h-10 w-px bg-white/[0.06]" />
            <div>
              <div className="text-[2rem] sm:text-[2.5rem] font-bold text-amber-400 font-mono">
                25
              </div>
              <div className="text-[12px] text-[#7A8290] mt-1">Total Founding Slots</div>
            </div>
            <div className="h-10 w-px bg-white/[0.06]" />
            <div>
              <div className="text-[2rem] sm:text-[2.5rem] font-bold text-white font-mono">14</div>
              <div className="text-[12px] text-[#7A8290] mt-1">Markets Protected</div>
            </div>
          </div>
          <div className="w-full max-w-md mx-auto h-2 rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={isInView ? { width: '32%' } : { width: 0 }}
              transition={{ duration: 1.5, delay: 0.3 }}
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #00B4D8, #7C5CFF)' }}
            />
          </div>
          <p className="mt-3 text-[13px] text-[#7A8290]">8 of 25 founding partner slots filled</p>
        </motion.div>

        {/* Advisory Endorsements */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid gap-4 sm:grid-cols-3"
        >
          {[
            {
              quote:
                'The market-capped model is the right approach. Oversaturation is what kills lead quality in legal.',
              name: 'Legal Marketing Advisor',
              role: '15+ Years in PI Marketing',
            },
            {
              quote:
                'Most firms do not have a lead problem. They have an intake discipline problem. CasePort addresses the real gap.',
              name: 'Law Firm Growth Consultant',
              role: 'Scaled 40+ PI Firms',
            },
            {
              quote:
                'The qualification layer is what separates this from every other lead gen service I have evaluated.',
              name: 'PI Firm Operations Director',
              role: 'Multi-State Practice',
            },
          ].map((testimonial) => (
            <motion.div
              key={testimonial.name}
              variants={staggerItem}
              className="card-hover rounded-2xl transition-all duration-500 ease-out hover:border-white/[0.15] hover:bg-white/[0.06] hover:shadow-lg hover:-translate-y-1 transition-all duration-500 ease-out hover:border-white/[0.15] hover:bg-white/[0.06] hover:shadow-lg hover:-translate-y-1 border border-white/[0.08] bg-white/[0.03] p-6"
            >
              <MessageCircle className="h-4 w-4 text-cyan-400/40 mb-4" />
              <p className="text-[15px] text-[#D4D8E0] leading-[1.75] mb-5">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div>
                <div className="text-[13px] font-semibold text-white">{testimonial.name}</div>
                <div className="text-[12px] text-[#7A8290]">{testimonial.role}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="mt-5 text-center"
        >
          <p className="text-[12px] text-[#5A6270] italic">
            * Testimonials represent feedback from advisory reviewers during system development.
            Named case studies will be published as the founding cohort matures.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   FOUNDER VIDEO — Placeholder.
   POLISH: Tighter spacing, cleaner video placeholder.
   ═══════════════════════════════════════════════════════════════ */
function FounderVideoSection() {
  const { ref, isInView } = useScrollReveal(0.1)

  return (
    <section ref={ref} className="py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-4xl px-5 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="text-center mb-8"
        >
          <div className="system-label text-[#7A8290] mb-4">From the Founder</div>
          <h2 className="text-[1.5rem] sm:text-[2rem] lg:text-[2.5rem] font-semibold leading-[1.1] tracking-[-0.03em] text-white">
            Why We Built CasePort
          </h2>
          <p className="mt-4 text-[1.0625rem] text-[#B8C0CC] leading-[1.75] max-w-2xl mx-auto">
            90 seconds on why the personal injury lead generation industry is broken — and what we
            are doing differently.
          </p>
        </motion.div>

        <motion.div variants={scaleIn} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
          <div
            className="relative group cursor-pointer rounded-2xl border border-white/[0.08] overflow-hidden aspect-video"
            style={{
              background:
                'linear-gradient(135deg, rgba(0,212,255,0.04) 0%, rgba(124,92,255,0.03) 50%, rgba(0,0,0,0.2) 100%)',
            }}
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="rounded-full border-2 border-white/20 bg-white/10 p-5 backdrop-blur-sm transition duration-300 group-hover:scale-110 group-hover:border-white/30 group-hover:bg-white/15">
                <Play className="h-8 w-8 text-white ml-1" />
              </div>
              <p className="mt-5 text-[15px] text-[#9CA3AF] font-medium">
                Watch the 90-Second Overview
              </p>
              <p className="mt-1.5 text-[12px] text-[#5A6270]">Coming soon — video in production</p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/[0.04]">
              <div className="h-full w-0 bg-gradient-to-r from-cyan-400 to-violet-500" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   FAQ — Objection destruction. Dan Lok voice.
   POLISH: Larger answer text, better spacing.
   ═══════════════════════════════════════════════════════════════ */
function FAQSection() {
  const { ref, isInView } = useScrollReveal(0.1)

  const faqs = [
    {
      q: 'How is CasePort different from other lead generation companies?',
      a: 'Most lead gen companies sell you a list. They generate volume, blast it to multiple firms, and let you fight over scraps. CasePort is not a lead vendor. It is a case acquisition system — built around qualification, routing, and retained value. We cap the number of firms per market. We screen every opportunity before it reaches you. And we do not disappear after the lead is delivered. The difference is not incremental. It is structural.',
    },
    {
      q: 'What happens if the leads do not convert?',
      a: "First — we do not sell 'leads.' We deliver qualified case opportunities that have passed through a multi-layer screening process. That said, conversion depends on your firm's intake speed, follow-up discipline, and case selection. We provide full transparency into opportunity quality metrics so you can see exactly what is working and what needs adjustment. We also have structured recovery protocols designed to reduce preventable breakdowns after delivery.",
    },
    {
      q: 'How do you qualify opportunities before routing them?',
      a: 'Every opportunity passes through our 6-layer qualification framework — from initial intent signal through case-fit verification. We evaluate injury type, timing, liability indicators, geographic alignment, and firm capacity match. The goal is simple: your intake team should only see opportunities that fit. We would rather send you 10 qualified opportunities than 100 unqualified ones.',
    },
    {
      q: "What does 'market-capped' actually mean?",
      a: 'It means we limit the number of partner firms per metropolitan area to a maximum of three. Hard cap. No exceptions. This is not a marketing gimmick — it is a structural decision that protects lead quality and prevents the oversaturation that destroys ROI in every other lead gen model. If your market is full, you go on a waitlist. Period.',
    },
    {
      q: 'Can I see the system before committing?',
      a: 'We offer a structured review process — not a free trial. You apply, we evaluate fit, and if both sides align, we walk you through the system architecture, performance targets, and market availability before any commitment. We are selective because the model only works when both sides are serious.',
    },
    {
      q: 'Why should I trust a new company in this space?',
      a: 'You should not trust us based on promises. You should evaluate us based on structure. Our market-capped model means we have a financial incentive to make every partner successful — because we cannot just replace you with the next firm. Our transparent reporting means you see everything. And our compliance-first design means we are not cutting corners to generate volume. Trust is earned through structure, not slogans.',
    },
    {
      q: 'What is the pricing model?',
      a: 'Pricing is discussed during the review process and varies based on market, case type, and volume tier. We do not publish pricing because every market has different dynamics. What we can tell you is this: if the ROI calculator on this page does not show numbers that make sense for your firm, we are probably not the right fit. And that is fine.',
    },
    {
      q: 'How quickly can I expect to see results?',
      a: 'System activation typically takes 2-3 weeks after approval. Initial qualified opportunities begin flowing within the first 30 days. However, we do not promise overnight results — building a controlled case acquisition pipeline is a compounding process. Firms that commit to the system for 90+ days see the strongest returns. This is infrastructure, not a quick fix.',
    },
  ]

  return (
    <section
      ref={ref}
      id="faq"
      aria-label="Frequently Asked Questions about CasePort"
      className="py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-4xl px-5 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="system-label text-[#7A8290] mb-4">Questions We Hear</div>
          <h2 className="text-[1.75rem] sm:text-[2.25rem] lg:text-[2.75rem] font-semibold leading-[1.1] tracking-[-0.03em] text-white">
            Straight Answers.
            <br />
            <span className="text-white/35">No Runaround.</span>
          </h2>
          <p className="mt-4 text-[1.0625rem] text-[#B8C0CC] leading-[1.75]">
            You have been pitched before. You have heard the promises. Here is what you actually
            want to know.
          </p>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
          <Accordion type="single" collapsible className="space-y-2.5">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-6 overflow-hidden data-[state=open]:border-cyan-400/10 data-[state=open]:bg-white/[0.03] transition-colors duration-300"
              >
                <AccordionTrigger className="text-[15px] font-semibold text-white text-left py-5 hover:no-underline [&[data-state=open]>svg]:text-cyan-400">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-[15px] text-[#B8C0CC] leading-[1.8] pb-5">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   SCARCITY — Quantified urgency.
   POLISH: Tighter, connected to Final CTA below.
   ═══════════════════════════════════════════════════════════════ */
function ScarcitySection() {
  const { ref, isInView } = useScrollReveal(0.2)

  return (
    <section ref={ref} className="py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-4xl px-5 sm:px-6 lg:px-8 text-center">
        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
          <div className="inline-flex items-center gap-2.5 rounded-full border border-amber-500/15 bg-amber-500/[0.04] px-5 py-2.5 mb-6">
            <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[12px] font-semibold text-amber-400 uppercase tracking-[0.15em]">
              Limited Availability
            </span>
          </div>

          <h2 className="text-[1.75rem] sm:text-[2.25rem] lg:text-[2.75rem] font-semibold leading-[1.1] tracking-[-0.03em] text-white">
            We Partner With a Maximum of
            <br />
            <span className="bg-gradient-to-r from-[#F59E0B] to-[#FCD34D] bg-clip-text text-transparent text-[2.25rem] sm:text-[3rem] lg:text-[3.5rem]">
              3 Firms Per Metro Area.
            </span>
          </h2>

          <p className="mt-5 text-[1.0625rem] text-[#B8C0CC] leading-[1.75] max-w-2xl mx-auto">
            This is not artificial scarcity. It is the structural requirement that makes the entire
            system work. If we let every firm in, lead quality collapses, markets get oversaturated,
            and nobody wins.
          </p>

          <div className="mt-6 grid grid-cols-3 gap-3 max-w-lg mx-auto">
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
              <div className="text-[1.5rem] font-bold text-white font-mono">17</div>
              <div className="text-[11px] text-[#7A8290] mt-1">Founding Slots Left</div>
            </div>
            <div className="rounded-xl border border-amber-500/12 bg-amber-500/[0.03] p-4">
              <div className="text-[1.5rem] font-bold text-amber-400 font-mono">3</div>
              <div className="text-[11px] text-[#7A8290] mt-1">Max Per Metro</div>
            </div>
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
              <div className="text-[1.5rem] font-bold text-white font-mono">14</div>
              <div className="text-[11px] text-[#7A8290] mt-1">Markets Protected</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   FINAL CTA — Connected to footer. No dead space.
   POLISH: Reduced bottom padding so footer connects seamlessly.
   ═══════════════════════════════════════════════════════════════ */
function FinalCTASection() {
  const { ref, isInView } = useScrollReveal(0.2)

  return (
    <section ref={ref} className="pt-12 pb-16 sm:pt-16 sm:pb-20 lg:pt-20 lg:pb-24">
      <div className="mx-auto max-w-4xl px-5 sm:px-6 lg:px-8 text-center">
        <motion.div variants={fadeUp} initial="hidden" animate={isInView ? 'visible' : 'hidden'}>
          <div className="system-label text-cyan-400/50 mb-5">Next Step</div>
          <h2 className="text-[1.75rem] sm:text-[2.25rem] lg:text-[2.75rem] xl:text-[3.25rem] font-semibold leading-[1.1] tracking-[-0.03em] text-white">
            Ready to Stop Chasing Leads
            <br />
            and Start Controlling Case Flow?
          </h2>
          <p className="mt-5 text-[1.0625rem] text-[#B8C0CC] leading-[1.75] max-w-2xl mx-auto">
            CasePort is not for every firm. It is for firms that are serious about building a more
            disciplined, more controlled case acquisition operation. If that is you, the next step
            is simple.
          </p>

          <div className="mt-7 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              variant="gradient"
              className="rounded-full px-8 py-3.5 text-sm font-semibold"
              asChild
            >
              <Link href="/request-access">Request Private Access</Link>
            </Button>
            <a
              href="#roi-calculator"
              className="group flex items-center gap-2 text-[14px] text-[#9CA3AF] transition hover:text-white"
            >
              See ROI Projection
              <ChevronRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </a>
          </div>

          <p className="mt-5 text-[13px] text-[#5A6270] max-w-lg mx-auto leading-relaxed">
            Market-capped access. Review-first onboarding. Verified standards. We limit the number
            of firms per market to protect lead quality.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

/* ═══════════════════════════════════════════════════════════════
   FOOTER — Integrated, no void. Minimal and complete.
   POLISH: Tighter top padding, connected to final CTA above.
   ═══════════════════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="border-t border-white/[0.04] bg-[#020405] py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
          <div>
            <div className="text-[17px] font-extrabold tracking-[0.28em] text-white">CASEPORT</div>
            <div className="system-label text-[#5A6270] mt-1">Case Flow Without Guesswork</div>
            <p className="mt-3 text-[14px] text-[#7A8290] leading-[1.75] max-w-xs">
              Turning chaotic accident demand into structured, buyer-ready case opportunities for
              personal injury law firms.
            </p>
          </div>
          <div>
            <div className="system-label text-[#7A8290] mb-3">Platform</div>
            <div className="space-y-2">
              <a
                href="#system"
                className="block text-[14px] text-[#9CA3AF] transition hover:text-white"
              >
                For Law Firms
              </a>
              <a
                href="#how-it-works"
                className="block text-[14px] text-[#9CA3AF] transition hover:text-white"
              >
                How It Works
              </a>
              <a
                href="#roi-calculator"
                className="block text-[14px] text-[#9CA3AF] transition hover:text-white"
              >
                ROI Projection
              </a>
              <a
                href="#trust"
                className="block text-[14px] text-[#9CA3AF] transition hover:text-white"
              >
                Why CasePort
              </a>
              <a
                href="#faq"
                className="block text-[14px] text-[#9CA3AF] transition hover:text-white"
              >
                FAQ
              </a>
            </div>
          </div>
          <div>
            <div className="system-label text-[#7A8290] mb-3">Resources</div>
            <div className="space-y-2">
              <a
                href="/insights"
                className="block text-[14px] text-[#9CA3AF] transition hover:text-white"
              >
                Insights
              </a>
              <a
                href="#intelligence"
                className="block text-[14px] text-[#9CA3AF] transition hover:text-white"
              >
                Intelligence
              </a>
              <a
                href="/injured"
                className="block text-[14px] text-[#9CA3AF] transition hover:text-white"
              >
                Injured?
              </a>
            </div>
          </div>
          <div>
            <div className="system-label text-[#7A8290] mb-3">Contact</div>
            <div className="space-y-2 text-[14px] text-[#9CA3AF]">
              <a href="mailto:access@caseport.io" className="transition hover:text-white">
                access@caseport.io
              </a>
            </div>
          </div>
        </div>

        {/* GEO: Service area signals */}
        <div className="mt-8 pt-5 border-t border-white/[0.04]">
          <div className="system-label text-[#374151] mb-2">Service Areas</div>
          <p className="text-[11px] text-[#5A6270] leading-[1.8] max-w-5xl">
            CasePort serves personal injury law firms across the United States, including major
            markets in California (Los Angeles, San Diego, San Francisco), Texas (Houston, Dallas,
            San Antonio, Austin), Florida (Miami, Tampa, Orlando, Jacksonville), New York (New York
            City, Buffalo), Illinois (Chicago), Pennsylvania (Philadelphia, Pittsburgh), Georgia
            (Atlanta), Arizona (Phoenix, Tucson), Ohio (Columbus, Cleveland), New Jersey (Newark,
            Jersey City), Michigan (Detroit), North Carolina (Charlotte, Raleigh), Virginia
            (Virginia Beach, Richmond), Colorado (Denver), and Nevada (Las Vegas).
          </p>
        </div>

        <div className="mt-6 pt-5 border-t border-white/[0.04]">
          <p className="text-[12px] text-[#5A6270] leading-[1.75] max-w-4xl">
            <strong className="text-[#7A8290]">Legal Disclaimer:</strong> CasePort provides case
            acquisition infrastructure services. We do not guarantee any specific number of leads,
            cases, signed retainers, or revenue outcomes. All projections, estimates, and
            performance metrics presented on this website are illustrative and based on general
            market data. Actual results depend on numerous factors including but not limited to
            market conditions, firm capacity, case quality, conversion rates, and operational
            execution. CasePort is not a law firm and does not provide legal advice. All advertising
            and lead generation activities are conducted in compliance with applicable state bar
            rules and legal advertising regulations. Past performance is not indicative of future
            results.
          </p>
          <div className="mt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-[12px] text-[#5A6270]">
              &copy; {new Date().getFullYear()} CasePort. All rights reserved.
            </p>
            <div className="flex gap-6 text-[12px] text-[#5A6270]">
              <a href="/privacy" className="transition hover:text-[#9CA3AF]">
                Privacy Policy
              </a>
              <a href="/terms" className="transition hover:text-[#9CA3AF]">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
