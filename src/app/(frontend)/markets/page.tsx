'use client'
/**
 * CasePort /Market Page — "The Access Grid"
 *
 * TOP 1% CONVERSION SEQUENCE:
 * 1. Hero — Credibility anchor
 * 2. Social Proof — Trust amplification (top 5 markets, partner logos, case volume, testimonials)
 * 3. Market Grid — Browse with scarcity signals
 * 4. Geography Section — Reinforce value
 * 5. 3-Firm Cap Model — Build confidence
 * 6. MII Breakdown — Transparency
 * 7. FAQ — Reduce friction
 * 8. Final CTA — Action trigger
 *
 * BRAND SYSTEM (from /for-law-firms audit):
 * - H1/H2: Geist, 60px, 700, -2.4px tracking, #F1F3F5
 * - H3: Geist, 30px, 700, white
 * - Section labels: JetBrains Mono, 12px, 500, 1.8px tracking, uppercase, oklch(0.6 0.015 250)
 * - Body: Geist, 18px, 400, #B0B8C4
 * - Accent: gradient text (cyan→teal→purple), NOT flat cyan
 * - Glass: 4% white bg, 8% white border, 12px radius, blur(20px)
 * - CTA: 3-stop gradient #00B4D8 → #5BB6C9 40% → #7C5CFF, 12px radius
 * - Stat numbers: Geist (not mono), cyan or amber
 * - Mono: JetBrains Mono for labels/badges/data only
 */

import AEOContentBlocks from '@/components/AEOContentBlocks'
import CaseStudySection from '@/components/CaseStudySection'
import ComparisonTable from '@/components/ComparisonTable'
import ExitIntentModal from '@/components/ExitIntentModal'
import Footer from '@/components/Footer'
import LeadQualityGuarantee from '@/components/LeadQualityGuarantee'
import LiveMarketTicker from '@/components/LiveMarketTicker'
import MarketCard from '@/components/MarketCard'
import MarketDetailPanel from '@/components/MarketDetailPanel'
import Navbar from '@/components/Navbar'
import ProofOfConceptSection from '@/components/ProofOfConceptSection'
import SocialProofSection from '@/components/SocialProofSection'
import StickyCTABar from '@/components/StickyCTABar'
import UnlistedMarketForm from '@/components/UnlistedMarketForm'
import VideoTestimonialSection from '@/components/VideoTestimonialSection'
import { analytics } from '@/lib/analytics'
import { type Market, type MarketStatus } from '@/lib/marketData'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import {
  ArrowRight,
  BarChart3,
  ChevronDown,
  DollarSign,
  MapPin,
  Search,
  Shield,
  TrendingUp,
  Users,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

// Asset URLs
const HERO_BG =
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/ktqQZjYN63yrcvMQnNsZFC/market-hero-bg-9D6GHSkpdLkkozuSm2unqA.webp'
const GRID_TEXTURE =
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/ktqQZjYN63yrcvMQnNsZFC/market-grid-texture-7eZPAFga42ojCuB7JWGgHp.webp'
const DATA_VIZ =
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/ktqQZjYN63yrcvMQnNsZFC/market-data-viz-UbhsTxdHdNbcpuYx3ymKkL.webp'

// Counter animation hook
function useCountUp(end: number, duration: number = 2000, startOnView: boolean = true) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: false, margin: '-50px' })
  const [hasRevealed, setHasRevealed] = useState(false)

  useEffect(() => {
    if (isInView && !hasRevealed) setHasRevealed(true)
  }, [isInView, hasRevealed])

  const hasStarted = useRef(false)
  const previousEnd = useRef(end)

  useEffect(() => {
    if (end > 0 && String(end) !== String(previousEnd.current)) {
      hasStarted.current = false
      previousEnd.current = end
    }
    if (!startOnView || !hasRevealed || hasStarted.current || end === 0) return
    hasStarted.current = true
    const startTime = performance.now()
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * end))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [isInView, end, duration, startOnView])

  return { count, ref }
}

export default function MarketPage() {
  const [markets, setMarkets] = useState<any[]>([])
  const [pageFaqs, setPageFaqs] = useState<{ question: string; answer: string }[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRegion, setSelectedRegion] = useState<string>('All')
  const [selectedStatus, setSelectedStatus] = useState<MarketStatus | 'all'>('all')
  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null)
  const [showRegionDropdown, setShowRegionDropdown] = useState(false)
  const [showExitIntent, setShowExitIntent] = useState(false)
  const [hoveredMarket, setHoveredMarket] = useState<Market | null>(null)
  const exitIntentShown = useRef(false)

  useEffect(() => {
    fetch('/api/markets?limit=100')
      .then((res) => res.json())
      .then((data) => {
        if (data?.docs) setMarkets(data.docs)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setIsLoading(false)
      })

    fetch('/api/globals/markets-page')
      .then((res) => res.json())
      .then((data) => {
        if (data?.faqs) setPageFaqs(data.faqs)
      })
      .catch((err) => {
        console.error(err)
      })
  }, [])

  const dynamicFaqs = useMemo(() => {
    if (pageFaqs && pageFaqs.length > 0) {
      return pageFaqs.map((faq) => ({ q: faq.question, a: faq.answer }))
    }

    return [
      {
        q: 'What markets does CasePort serve for personal injury leads?',
        a: `CasePort serves ${markets.length || 46} metropolitan areas across the United States. Each market is capped at 3 partner firms.`,
      },
      {
        q: 'How does the 3-firm market cap actually work?',
        a: 'Each CasePort market is limited to exactly 3 partner firms. This is not artificial scarcity — it is a structural requirement. When a market reaches 3 firms, it is capped and new firms are placed on a waitlist.',
      },
      {
        q: 'What is the Market Intelligence Index?',
        a: 'The MII is a proprietary scoring system (0–100) that combines search intent volume, competition density, average case settlement values, and population growth trajectory. Higher MII scores indicate more attractive markets.',
      },
      {
        q: 'Can I operate in multiple CasePort markets?',
        a: 'Yes. Multi-market access is available for firms with the capacity to handle case flow across multiple territories. Each market requires a separate partner slot.',
      },
      {
        q: 'How do I request access for a market not yet listed?',
        a: 'Submit a priority access request at www.caseport.io/request-access. Markets are evaluated based on demand density, average case values, population size, and infrastructure readiness.',
      },
      {
        q: 'How is CasePort different from other PI lead generation companies?',
        a: 'CasePort differs in three ways: (1) Market Cap — each metro is limited to 3 firms; (2) Dedicated Infrastructure — market-specific demand capture; (3) Pre-Funded Wallet — no manual invoicing.',
      },
    ]
  }, [markets, pageFaqs])

  const stats = useMemo(
    () => ({
      total: markets.length,
      active: markets.filter((m) => m.status === 'active').length,
      capped: markets.filter((m) => m.status === 'capped').length,
      evaluation: markets.filter((m) => m.status === 'evaluation').length,
      totalCases: markets.reduce((sum, m) => sum + (m.casesAcquiredYearly || 0), 0),
    }),
    [markets],
  )

  // Filter markets
  const filteredMarkets = useMemo(() => {
    return markets.filter((m) => {
      const matchesSearch =
        searchQuery === '' ||
        (m.metro || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.state || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.stateCode || '').toLowerCase().includes(searchQuery.toLowerCase())
      const matchesRegion = selectedRegion === 'All' || (m.region || 'National') === selectedRegion
      const matchesStatus =
        selectedStatus === 'all' || m.status === (selectedStatus as MarketStatus)
      return matchesSearch && matchesRegion && matchesStatus
    })
  }, [searchQuery, selectedRegion, selectedStatus, markets])

  // Get unique regions
  const regions = useMemo(
    () => Array.from(new Set(markets.map((m) => m.region))) as string[],
    [markets],
  )

  // Sort: limited first, then active, then capped, then evaluation
  const sortedMarkets = useMemo(() => {
    const statusOrder: Record<string, number> = {
      limited: 0,
      active: 1,
      capped: 2,
      evaluation: 3,
    }
    return [...filteredMarkets].sort((a, b) => {
      const valA = statusOrder[a.status] ?? 99
      const valB = statusOrder[b.status] ?? 99
      const statusDiff = valA - valB
      if (statusDiff !== 0) return statusDiff
      return (b.mii || 0) - (a.mii || 0)
    })
  }, [filteredMarkets])

  const noResults = !isLoading && sortedMarkets.length === 0 && searchQuery !== ''
  const hasUnlistedMarket = searchQuery !== '' && noResults

  // Exit-intent handler
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !exitIntentShown.current) {
        exitIntentShown.current = true
        setShowExitIntent(true)
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [])

  const handleExitIntentSubmit = (email: string) => {
    analytics.logMarketAlertSignup(searchQuery, email)
  }

  const handleUnlistedMarketSubmit = (data: {
    name: string
    email: string
    market: string
    phone: string
  }) => {
    analytics.logUnlistedMarketRequest(data.market, data.name, data.email)
  }

  // Counter refs
  const totalCounter = useCountUp(stats.total)
  const cappedCounter = useCountUp(stats.capped)
  const statesCounter = useCountUp(Array.from(new Set(markets.map((m) => m.state))).length)
  const partnersCounter = useCountUp(markets.reduce((sum, m) => sum + (m.partnersActive || 0), 0))

  // ============================================
  // SCHEMA.ORG JSON-LD — Comprehensive AEO/GEO
  // ============================================

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'CasePort',
    url: 'https://www.caseport.io',
    logo: 'https://www.caseport.io/logo.png',
    description:
      'CasePort is the infrastructure for case acquisition. Exclusive personal injury lead markets with territorial control.',
    sameAs: ['https://www.linkedin.com/company/caseport'],
  }

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Personal Injury Lead Markets',
    provider: { '@type': 'Organization', name: 'CasePort' },
    description:
      'Exclusive personal injury case acquisition infrastructure across 46 metro areas in the United States.',
    areaServed: markets.map((m) => ({
      '@type': 'City',
      name: m.metro,
      addressRegion: m.state,
    })),
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: 'Varies by market',
      description: 'Pre-funded wallet model. No manual invoicing.',
    },
  }

  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Personal Injury Lead Markets — Exclusive Case Acquisition by Metro Area',
    description:
      'Browse 46 exclusive personal injury lead markets. Each market capped at 3 firms. Check availability in your territory.',
    url: 'https://www.caseport.io/markets',
    isPartOf: { '@type': 'WebSite', url: 'https://www.caseport.io' },
    speakableSpecification: [
      {
        '@type': 'SpeakableSpecification',
        cssSelector: ['h1', 'h2', '.system-label'],
      },
    ],
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.caseport.io' },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Markets',
        item: 'https://www.caseport.io/markets',
      },
    ],
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: dynamicFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  }

  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main>
        <AEOContentBlocks />
        <LiveMarketTicker />
        <Navbar />

        {/* ============================================ */}
        {/* SECTION 1: HERO — Above the fold */}
        {/* ============================================ */}
        <section
          className="relative overflow-hidden"
          style={{ minHeight: 'calc(100vh - 72px)' }}
          aria-label="CasePort Market Infrastructure Overview"
        >
          {/* Background */}
          <div className="absolute inset-0">
            <img src={HERO_BG} alt="" className="w-full h-full object-cover opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.06_0.01_250)]/60 via-[oklch(0.06_0.01_250)]/80 to-[oklch(0.06_0.01_250)]" />
          </div>

          <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-12">
            {/* System Status Bar */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white/[0.03] border border-white/[0.08] inline-flex items-center gap-3 sm:gap-5 px-4 sm:px-5 py-2.5 mb-8 overflow-hidden rounded-2xl"
              role="status"
              aria-label={`System status: ${stats.total} markets active, ${stats.capped} capped, ${stats.evaluation} in review`}
            >
              <div className="absolute inset-0 overflow-hidden">
                <div className="animate-scanline absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-[#22D3EE]/[0.03] to-transparent" />
              </div>
              <span className="system-label text-[#22D3EE] relative" style={{ fontSize: '11px' }}>
                System Status
              </span>
              <div className="h-4 w-px bg-white/[0.1]" />
              <div className="flex items-center gap-1.5 relative">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-breathe" />
                <span
                  className="text-[12px] text-[#B0B8C4]"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {stats.total} Markets Active
                </span>
              </div>
              <div className="h-4 w-px bg-white/[0.1] hidden sm:block" />
              <div className="hidden sm:flex items-center gap-1.5 relative">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6B7280]" />
                <span
                  className="text-[12px] text-[#B0B8C4]"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {stats.capped} Capped
                </span>
              </div>
              <div className="h-4 w-px bg-white/[0.1] hidden sm:block" />
              <div className="hidden sm:flex items-center gap-1.5 relative">
                <span className="w-1.5 h-1.5 rounded-full bg-[#22D3EE] animate-breathe" />
                <span
                  className="text-[12px] text-[#B0B8C4]"
                  style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                  {stats.evaluation} In Review
                </span>
              </div>
            </motion.div>

            {/* Two-column layout: Copy left, Stats right */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: Copy */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h1
                  className="text-[36px] sm:text-[48px] lg:text-[56px] font-bold leading-tight mb-6"
                  style={{ letterSpacing: '-2.4px', color: '#F1F3F5' }}
                >
                  The Infrastructure Behind Your Next{' '}
                  <span className="bg-gradient-to-r from-[#00B4D8] via-[#5BB6C9] to-[#7C5CFF] bg-clip-text text-transparent">
                    Signed Case.
                  </span>
                </h1>
                <p className="text-[18px] text-[#B0B8C4] mb-8 leading-relaxed max-w-[500px]">
                  {stats.total || 46} markets. 3 firms each.{' '}
                  <span className="bg-gradient-to-r from-[#00B4D8] via-[#5BB6C9] to-[#7C5CFF] bg-clip-text text-transparent">
                    No exceptions.
                  </span>
                </p>
                <p className="text-[15px] text-[#B0B8C4] mb-10 leading-relaxed max-w-[520px]">
                  Every metro area in the CasePort network is capped at three partner firms. Not
                  artificial scarcity — a structural requirement. The math is simple:{' '}
                  {stats.total || 46} markets, 3 firms each, and the strongest firms fill first.
                </p>
                <button
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-[#030608] transition-all hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #00B4D8 0%, #5BB6C9 40%, #7C5CFF 100%)',
                  }}
                >
                  Check Your Market <ArrowRight size={16} />
                </button>
              </motion.div>

              {/* Right: Stats Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="grid grid-cols-2 gap-4"
              >
                {[
                  { label: 'Active Markets', counter: totalCounter, suffix: '' },
                  { label: 'Markets Capped', counter: cappedCounter, suffix: '' },
                  { label: 'States Covered', counter: statesCounter, suffix: '' },
                  { label: 'Active Partners', counter: partnersCounter, suffix: '' },
                ].map((stat, i) => (
                  <div
                    key={stat.label}
                    className="bg-white/[0.03] border border-white/[0.08] p-5 rounded-2xl"
                  >
                    <span
                      className="system-label text-[#6B7280] block mb-2"
                      style={{ fontSize: '10px' }}
                    >
                      {stat.label}
                    </span>
                    <span ref={stat.counter.ref} className="text-[28px] font-bold text-[#22D3EE]">
                      {stat.counter.count}
                      {stat.suffix}
                    </span>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* SECTION 2: SOCIAL PROOF — Trust Amplification */}
        {/* ============================================ */}
        <SocialProofSection markets={markets} />

        {/* ============================================ */}
        {/* SECTION 3: THE ACCESS GRID */}
        {/* ============================================ */}
        <section
          className="relative py-16 sm:py-24"
          id="grid"
          aria-label="Personal Injury Lead Markets — Check Availability by Metro Area"
          style={{
            backgroundImage: `url(${GRID_TEXTURE})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-[oklch(0.06_0.01_250)]/90" />
          <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="mb-10 sm:mb-14">
              <span className="system-label text-[#22D3EE] block mb-4">Access Grid</span>
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                <div>
                  <h2
                    className="text-[30px] sm:text-[40px] lg:text-[52px] font-bold text-[#F1F3F5] leading-tight mb-3"
                    style={{ letterSpacing: '-2px' }}
                  >
                    Check Your Market.
                  </h2>
                  <p className="text-[16px] text-[#B0B8C4] max-w-[500px]">
                    Search by city, state, or region. If your market is not listed, request priority
                    evaluation.
                  </p>
                </div>

                {/* Legend */}
                <div
                  className="flex flex-wrap items-center gap-5"
                  role="legend"
                  aria-label="Market status legend"
                >
                  {[
                    { color: '#10B981', label: 'Open', desc: 'Partner slots available' },
                    { color: '#F59E0B', label: 'Limited', desc: '1-2 slots remaining' },
                    { color: '#6B7280', label: 'Capped', desc: 'All slots filled' },
                    { color: '#22D3EE', label: 'In Review', desc: 'Under evaluation' },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2" title={item.desc}>
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                        aria-hidden="true"
                      />
                      <span
                        className="text-[12px] text-[#B0B8C4]"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="mb-12 flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]"
                />
                <input
                  type="text"
                  placeholder="Search by city, state, or region..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    if (e.target.value) analytics.logMarketSearch(e.target.value)
                  }}
                  className="w-full pl-12 pr-4 py-3 rounded-[12px] border text-[#F1F3F5] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#22D3EE]"
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                />
              </div>

              {/* Region Dropdown */}
              <div className="relative w-full sm:w-48">
                <button
                  onClick={() => setShowRegionDropdown(!showRegionDropdown)}
                  className="w-full px-4 py-3 rounded-[12px] border flex items-center justify-between text-[#F1F3F5] transition-all hover:border-[#22D3EE]/50"
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <span className="text-[14px]">{selectedRegion}</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${showRegionDropdown ? 'rotate-180' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {showRegionDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full mt-2 w-full rounded-[12px] border z-50"
                      style={{
                        background: 'rgba(10, 14, 23, 0.95)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        backdropFilter: 'blur(20px)',
                      }}
                    >
                      {regions.map((region) => (
                        <button
                          key={region}
                          onClick={() => {
                            setSelectedRegion(region)
                            setShowRegionDropdown(false)
                          }}
                          className="w-full px-4 py-3 text-left text-[14px] text-[#B0B8C4] hover:text-[#F1F3F5] hover:bg-white/[0.04] transition-colors first:rounded-t-[11px] last:rounded-b-[11px]"
                        >
                          {region}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Market Grid */}
            {isLoading ? (
              <div className="text-center py-20">
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <p className="text-[18px] text-[#B0B8C4] mb-6">Loading markets...</p>
                </motion.div>
              </div>
            ) : noResults ? (
              <div className="text-center py-20">
                <p className="text-[18px] text-[#B0B8C4] mb-6">
                  No markets found for "{searchQuery}".
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-6 py-3 rounded-full font-bold text-[#030608] transition-all hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #00B4D8 0%, #5BB6C9 40%, #7C5CFF 100%)',
                  }}
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {sortedMarkets.map((market, idx) => (
                  <MarketCard
                    key={market.id}
                    market={market}
                    index={idx}
                    onSelect={setSelectedMarket}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ============================================ */}
        {/* SECTION 4: GEOGRAPHY — Reinforce Value */}
        {/* ============================================ */}
        <section className="relative py-20 sm:py-28 bg-[#030608]">
          <div className="container mx-auto px-5 sm:px-6 lg:px-8 max-w-6xl">
            <div className="text-center mb-16">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-white/50 block mb-4">
                MARKET STRUCTURE
              </span>
              <h2
                className="text-[32px] sm:text-[40px] font-bold text-[#F1F3F5] leading-tight mb-4"
                style={{ letterSpacing: '-1.2px' }}
              >
                It Is the Strategy.
              </h2>
              <p className="text-[16px] text-[#B0B8C4] max-w-[640px] mx-auto">
                The difference between a firm that signs 15 cases a month and one that signs 50 is
                rarely about marketing spend. It is about territorial control over high-intent
                demand before it reaches the open market.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-[1040px] mx-auto">
              {[
                {
                  icon: <MapPin size={20} />,
                  title: 'Territorial Exclusivity',
                  description:
                    'When five firms compete for the same lead, conversion rates collapse to single digits. The 3-firm cap ensures your investment in case acquisition actually compounds.',
                  stat: '3',
                  statLabel: 'Max firms per metro',
                },
                {
                  icon: <Shield size={20} />,
                  title: 'Protected Infrastructure',
                  description:
                    'Each market has dedicated demand capture infrastructure. Your territory is not shared with a rotating list of buyers. It is architecturally separated.',
                  stat: '100%',
                  statLabel: 'Market separation',
                },
                {
                  icon: <BarChart3 size={20} />,
                  title: 'Compounding Intelligence',
                  description:
                    'Every interaction in your market feeds a proprietary data layer. The longer you operate within the system, the more precise your case flow becomes.',
                  stat: 'MII',
                  statLabel: 'Market Intelligence Index',
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="bg-white/[0.03] border border-white/[0.08] p-6 rounded-2xl"
                >
                  <div
                    className="w-10 h-10 rounded-[10px] flex items-center justify-center mb-5"
                    style={{ background: 'rgba(34,211,238,0.08)', color: '#22D3EE' }}
                  >
                    {item.icon}
                  </div>
                  <h3 className="text-[18px] font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-[15px] text-[#B0B8C4] leading-relaxed mb-5">
                    {item.description}
                  </p>
                  <div className="pt-4 border-t border-white/[0.08]">
                    <span className="text-[24px] font-bold text-[#22D3EE]">{item.stat}</span>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#6B7280] block mt-1">
                      {item.statLabel}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* SECTION 5: 3-FIRM CAP MODEL */}
        {/* ============================================ */}
        <section className="relative py-20 sm:py-28 bg-[#030608]">
          <div className="container mx-auto px-5 sm:px-6 lg:px-8 max-w-5xl">
            <div className="text-center mb-16">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-white/50 block mb-4">
                MARKET CAPACITY
              </span>
              <h2
                className="text-[32px] sm:text-[40px] font-bold text-[#F1F3F5] leading-tight mb-4"
                style={{ letterSpacing: '-1.2px' }}
              >
                The 3-Firm Cap Is Not Negotiable.
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left: Explanation */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <p className="text-[16px] text-[#B0B8C4] mb-6 leading-relaxed">
                  Every CasePort market is architecturally limited to exactly 3 partner firms. This
                  is not artificial scarcity created by marketing. It is a structural requirement.
                </p>
                <p className="text-[16px] text-[#B0B8C4] mb-6 leading-relaxed">
                  When a market reaches capacity, new applicants join a waitlist. When a partner
                  leaves, the next firm on the waitlist is activated. The system maintains its
                  integrity.
                </p>
                <div className="space-y-4">
                  {[
                    {
                      step: 1,
                      label: 'Market Opens',
                      desc: 'Infrastructure deployed, 0 of 3 slots filled',
                    },
                    {
                      step: 2,
                      label: 'Firms Activate',
                      desc: 'Partners onboarded, slots fill to capacity',
                    },
                    {
                      step: 3,
                      label: 'Market Capped',
                      desc: '3 of 3 slots filled, new firms waitlisted',
                    },
                    {
                      step: 4,
                      label: 'Waitlist Activated',
                      desc: 'When a partner leaves, next firm activated',
                    },
                  ].map((item) => (
                    <div key={item.step} className="flex gap-4">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-[12px]"
                        style={{ background: 'rgba(34,211,238,0.15)', color: '#22D3EE' }}
                      >
                        {item.step}
                      </div>
                      <div>
                        <p className="font-bold text-[#F1F3F5] text-[14px]">{item.label}</p>
                        <p className="text-[13px] text-[#B0B8C4]">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Right: Visual */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white/[0.03] border border-white/[0.08] p-8 rounded-2xl"
              >
                <img
                  src={DATA_VIZ}
                  alt="Market capacity visualization"
                  className="w-full rounded-[8px]"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* SECTION 6: MII BREAKDOWN */}
        {/* ============================================ */}
        <section className="relative py-20 sm:py-28 bg-[#030608]">
          <div className="container mx-auto px-5 sm:px-6 lg:px-8 max-w-5xl">
            <div className="text-center mb-16">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-white/50 block mb-4">
                PROPRIETARY SCORING
              </span>
              <h2
                className="text-[32px] sm:text-[40px] font-bold text-[#F1F3F5] leading-tight mb-4"
                style={{ letterSpacing: '-1.2px' }}
              >
                The Market Intelligence Index.
              </h2>
              <p className="text-[16px] text-[#B0B8C4] max-w-[640px] mx-auto">
                MII is a proprietary scoring system that combines search intent, competition
                density, settlement values, and population growth. Higher scores = better markets.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  label: 'Search Intent',
                  desc: 'Monthly PI-related search volume in the metro area',
                  icon: TrendingUp,
                },
                {
                  label: 'Competition Density',
                  desc: 'Number of active PI firms competing for leads',
                  icon: Users,
                },
                {
                  label: 'Settlement Values',
                  desc: 'Average case settlement range for the market',
                  icon: DollarSign,
                },
                {
                  label: 'Population Growth',
                  desc: 'YoY population growth trajectory',
                  icon: BarChart3,
                },
              ].map((item, idx) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white/[0.03] border border-white/[0.08] p-6 rounded-2xl"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-[8px] flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(34,211,238,0.15)', color: '#22D3EE' }}
                    >
                      <item.icon size={18} />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#F1F3F5] text-[14px] mb-1">{item.label}</h3>
                      <p className="text-[13px] text-[#B0B8C4] leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* SECTION 7: FAQ — Reduce Friction */}
        {/* ============================================ */}
        <section className="relative py-20 sm:py-28 bg-[#030608]">
          <div className="container mx-auto px-5 sm:px-6 lg:px-8 max-w-3xl">
            <div className="text-center mb-16">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-white/50 block mb-4">
                COMMON QUESTIONS
              </span>
              <h2
                className="text-[32px] sm:text-[40px] font-bold text-[#F1F3F5] leading-tight"
                style={{ letterSpacing: '-1.2px' }}
              >
                What Firms Ask Us
              </h2>
            </div>

            <div className="space-y-4">
              {dynamicFaqs.map((item, idx) => (
                <motion.details
                  key={idx}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white/[0.03] border border-white/[0.08] group rounded-2xl"
                >
                  <summary className="px-6 py-4 cursor-pointer flex items-center justify-between text-[#F1F3F5] font-bold text-[15px] hover:text-[#22D3EE] transition-colors">
                    {item.q}
                    <ChevronDown size={16} className="transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="px-6 pb-4 text-[14px] text-[#B0B8C4] leading-relaxed border-t border-white/[0.08] pt-4">
                    {item.a}
                  </div>
                </motion.details>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* SECTION 8: FINAL CTA — Action Trigger */}
        {/* ============================================ */}
        <section className="relative py-20 sm:py-28 bg-[#030608]">
          <div className="container mx-auto px-5 sm:px-6 lg:px-8 max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="system-label block mb-6">NEXT STEP</span>
              <h2
                className="text-[32px] sm:text-[40px] font-bold text-[#F1F3F5] mb-6 leading-tight"
                style={{ letterSpacing: '-1.2px' }}
              >
                Your market will not stay open forever.{' '}
                <span className="bg-gradient-to-r from-[#00B4D8] via-[#5BB6C9] to-[#7C5CFF] bg-clip-text text-transparent">
                  And we are not saying that to rush you.
                </span>
              </h2>
              <p className="text-[16px] text-[#B0B8C4] mb-10 max-w-[600px] mx-auto leading-relaxed">
                {stats.capped} markets are already at capacity. The math is The math is simple: 46
                markets, 3 firms each, and the strongest firms fill first.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-[#030608] transition-all hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, #00B4D8 0%, #5BB6C9 40%, #7C5CFF 100%)',
                  }}
                >
                  Request Private Access <ArrowRight size={16} />
                </button>
                <button
                  onClick={() =>
                    document.getElementById('grid')?.scrollIntoView({ behavior: 'smooth' })
                  }
                  className="px-8 py-4 rounded-full font-bold border transition-all hover:border-[#22D3EE]"
                  style={{
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    color: '#F1F3F5',
                  }}
                >
                  Explore Markets
                </button>
              </div>
              <p
                className="text-[12px] text-[#6B7280] mt-8"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}
              >
                Market-capped access. Review-first onboarding. For qualified firms only.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Proof of Concept Section */}
        <ProofOfConceptSection />

        {/* Video Testimonial Section */}
        <VideoTestimonialSection />

        {/* Case Study Section */}
        <CaseStudySection />

        {/* Lead Quality Guarantee Section */}
        <LeadQualityGuarantee />

        {/* Comparison Table */}
        <ComparisonTable />

        {/* Footer */}
        <Footer />

        {/* Unlisted Market Form */}
        {hasUnlistedMarket && (
          <UnlistedMarketForm searchQuery={searchQuery} onSubmit={handleUnlistedMarketSubmit} />
        )}

        {/* Market Detail Panel */}
        <AnimatePresence>
          {selectedMarket && (
            <MarketDetailPanel market={selectedMarket} onClose={() => setSelectedMarket(null)} />
          )}
        </AnimatePresence>

        {/* Exit-Intent Modal */}
        <ExitIntentModal
          isOpen={showExitIntent}
          onClose={() => setShowExitIntent(false)}
          onSubmit={handleExitIntentSubmit}
        />

        {/* Sticky CTA Bar */}
        <StickyCTABar market={hoveredMarket} onClose={() => setHoveredMarket(null)} />
      </main>
    </>
  )
}
