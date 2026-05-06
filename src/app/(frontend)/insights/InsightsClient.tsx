/*
  DESIGN: "The Observatory" — Elevated Editorial with Atmospheric Depth
  CasePort Insights — 10/10 WORLD-CLASS VERSION
  Fonts: Space Grotesk (display headings), Geist Sans (body), JetBrains Mono (system labels)
  Colors: Navy #0A0E17, Cyan #22D3EE, Gold #F59E0B, Glass borders rgba(255,255,255,0.06)
  
  10/10 FEATURES:
  - Search bar in Editorial Grid
  - Category-specific thumbnail images on every card
  - Rich hover micro-interactions (glow, scale, border-light)
  - Count-up animation on stats
  - Staggered entrance animations
  - Generous whitespace throughout
  - No italic fonts — all Space Grotesk bold upright
  - Full semantic HTML + Schema.org markup
*/

'use client'
import AEOContent from '@/components/insights/AEOContent'
import FAQSection from '@/components/insights/FAQSection'
import Footer from '@/components/insights/Footer'
import StructuredData from '@/components/insights/StructuredData'
import Navbar from '@/components/Navbar'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { categories, signals, topicClusters, type Category } from '@/lib/articles'
import {
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  BarChart3,
  Building2,
  ChevronRight,
  Clock,
  FileText,
  Filter as FilterIcon,
  Layers,
  Radio,
  Search,
  Target,
  TrendingUp,
  Users,
  X,
  Zap,
} from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

// ─── Asset URLs ───
const HERO_BG =
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/AtP97UDSfYwW9WKCZmFxDF/hero-bg-observatory-cif5ZiVFBsvUuiNxsoQwYm.webp'
const FEATURED_IMG =
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/AtP97UDSfYwW9WKCZmFxDF/featured-article-intake-GmYBqecoGyFgqpaS7XnVzk.webp'
const NEWSLETTER_BG =
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/AtP97UDSfYwW9WKCZmFxDF/newsletter-bg-4jug9seXS8MyefNvfK6qrm.webp'

// ─── Scroll Reveal Wrapper ───
function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const { ref, isVisible } = useScrollReveal(0.1)
  return (
    <div
      ref={ref}
      className={`fade-up ${isVisible ? 'visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}s` }}
    >
      {children}
    </div>
  )
}

// ─── Category Color Map ───
function getCategoryColor(cat: Category): string {
  const map: Record<Category, string> = {
    'Case Acquisition': '#22D3EE',
    Intake: '#10B981',
    'Search & GEO': '#8B5CF6',
    'Lead Economics': '#F59E0B',
    'Law Firm Growth': '#F1F3F5',
    'Market Signals': '#22D3EE',
  }
  return map[cat] || '#22D3EE'
}

// ─── Topic Icon Map ───
function getTopicIcon(icon: string) {
  const size = 22
  const map: Record<string, React.ReactNode> = {
    target: <Target size={size} />,
    funnel: <FilterIcon size={size} />,
    search: <Search size={size} />,
    chart: <BarChart3 size={size} />,
    signal: <Radio size={size} />,
    growth: <Building2 size={size} />,
  }
  return map[icon] || <TrendingUp size={size} />
}

// ─── COUNT-UP ANIMATION HOOK ───
function useCountUp(target: number, duration: number = 2000) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          const start = performance.now()
          const animate = (now: number) => {
            const elapsed = now - start
            const progress = Math.min(elapsed / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
            setCount(Math.round(eased * target))
            if (progress < 1) requestAnimationFrame(animate)
          }
          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.3 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration])

  return { count, ref }
}

// ─── READING PROGRESS BAR ───
function ReadingProgressBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setProgress(Math.min(scrollPercent, 100))
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 w-full h-[3px] z-[60] bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-cp-cyan to-cp-purple transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

// ─── BACK TO TOP BUTTON ───
function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 800)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <button
      onClick={scrollToTop}
      aria-label="Back to top"
      className={`fixed bottom-8 right-8 z-50 w-12 h-12 rounded-xl bg-white/[0.06] border border-white/[0.1] backdrop-blur-md flex items-center justify-center text-cp-text-secondary hover:text-cp-cyan hover:border-cp-cyan/30 hover:bg-cp-cyan/5 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <ArrowUp size={18} />
    </button>
  )
}

// ─── BREADCRUMB NAVIGATION ───
function Breadcrumbs() {
  return (
    <nav aria-label="Breadcrumb" className="container relative z-10 pt-24 pb-0">
      <ol
        className="flex items-center gap-2 text-[13px]"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
          <Link
            href="/"
            itemProp="item"
            className="text-cp-text-muted hover:text-cp-cyan transition-colors"
          >
            <span itemProp="name">Home</span>
          </Link>
          <meta itemProp="position" content="1" />
        </li>
        <ChevronRight size={12} className="text-cp-text-muted/40" />
        <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
          <span itemProp="name" className="text-cp-cyan">
            Insights
          </span>
          <meta itemProp="position" content="2" />
        </li>
      </ol>
    </nav>
  )
}

// ─── SOCIAL PROOF / STATS BAR with Count-Up ───
function StatsBar({
  fetchedArticles = [],
  articleCount: serverArticleCount,
}: {
  fetchedArticles: any[]
  articleCount?: number
}) {
  const articleCount = useCountUp((serverArticleCount ?? fetchedArticles.length) || 0, 1800)
  const clusters = useCountUp(6, 1200)
  const subscribers = useCountUp(2400, 2200)

  return (
    <Reveal>
      <div className="container relative z-10 mt-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          <div ref={articleCount.ref} className="stat-card">
            <div className="stat-icon">
              <FileText size={18} />
            </div>
            <div>
              <div className="stat-number">{articleCount.count}+</div>
              <div className="stat-label">Articles Published</div>
            </div>
          </div>
          <div ref={clusters.ref} className="stat-card">
            <div className="stat-icon">
              <Layers size={18} />
            </div>
            <div>
              <div className="stat-number">{clusters.count}</div>
              <div className="stat-label">Topic Clusters</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <Zap size={18} />
            </div>
            <div>
              <div className="stat-number">Weekly</div>
              <div className="stat-label">Signal Updates</div>
            </div>
          </div>
          <div ref={subscribers.ref} className="stat-card">
            <div className="stat-icon">
              <Users size={18} />
            </div>
            <div>
              <div className="stat-number">{subscribers.count.toLocaleString()}+</div>
              <div className="stat-label">Subscribers</div>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  )
}

// ─── HERO SECTION ───
function HeroSection({
  fetchedArticles = [],
  articleCount,
}: {
  fetchedArticles: any[]
  articleCount?: number
}) {
  return (
    <section className="relative min-h-[100vh] flex flex-col overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={HERO_BG}
          alt=""
          className="w-full h-full object-cover opacity-30"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E17]/70 via-[#0A0E17]/50 to-[#0A0E17]" />
      </div>

      {/* Atmospheric Orbs */}
      <div className="atmo-orb w-[600px] h-[600px] bg-cp-cyan/8 top-[5%] left-[-15%]" />
      <div
        className="atmo-orb w-[500px] h-[500px] bg-cp-purple/6 top-[15%] right-[-10%]"
        style={{ animationDelay: '5s' }}
      />

      {/* Breadcrumbs */}
      {/* <Breadcrumbs /> */}

      {/* Hero Content */}
      <div className="container relative z-10 flex-1 flex items-center py-10 ">
        <div className="max-w-[960px]">
          {/* <Reveal>
            <span className="system-label text-cp-cyan inline-flex items-center gap-2.5 mb-10">
              <span className="w-2 h-2 rounded-full bg-cp-cyan animate-pulse" />
              CasePort Insights
            </span>
          </Reveal> */}

          <Reveal delay={0.1}>
            <h1
              className="text-[44px] sm:text-[56px] lg:text-[72px] leading-[1.05] tracking-[-0.03em] font-bold text-cp-text-primary"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Ideas, Signals, and Strategy for Smarter Case Acquisition.
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-10 text-[18px] lg:text-[20px] leading-[1.8] text-cp-text-secondary max-w-[620px]">
              Analysis on personal injury demand, intake performance, search visibility, lead
              economics, and the systems behind better case growth.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="mt-12 flex flex-wrap gap-5">
              <a href="#articles" className="cta-gradient flex items-center gap-2.5">
                Browse Articles <ArrowRight size={16} />
              </a>
              <a href="#subscribe" className="cta-secondary flex items-center gap-2.5">
                Subscribe to the Brief
              </a>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Stats Bar at bottom of hero */}
      <StatsBar fetchedArticles={fetchedArticles} articleCount={articleCount} />

      {/* Bottom spacer */}
      <div className="h-16 relative z-10" />
    </section>
  )
}

// ─── FEATURED ARTICLE SECTION ───
function FeaturedSection({ fetchedArticles = [] }: { fetchedArticles: any[] }) {
  if (!fetchedArticles || fetchedArticles.length === 0) return null

  const featured = fetchedArticles[0]
  const latestThree = fetchedArticles.slice(1, 4)

  return (
    <section className="relative py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E17] via-[#0B1120] to-[#0A0E17]" />

      <div className="container relative z-10">
        <Reveal>
          <span className="system-label text-cp-text-muted mb-5 block">Featured</span>
          <h2
            className="text-[36px] lg:text-[44px] font-bold text-cp-text-primary tracking-[-0.02em] mb-16"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <span className="text-cp-cyan">&bull;</span> Editor's Pick
          </h2>
        </Reveal>

        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            {/* Featured Article Card */}
            <article className="lg:col-span-7" itemScope itemType="https://schema.org/BlogPosting">
              <div className="glass-panel overflow-hidden h-full flex flex-col group hover:border-white/[0.12] transition-all duration-500">
                {/* Image */}
                <div className="relative h-[300px] lg:h-[360px] overflow-hidden">
                  <img
                    src={featured?.heroImage?.url || FEATURED_IMG}
                    alt="Case intake data flow visualization"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    itemProp="image"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E17] via-[#0A0E17]/40 to-transparent" />
                  <div className="absolute top-5 left-5 flex items-center gap-3">
                    <span className="system-label text-cp-cyan bg-cp-cyan/15 px-3.5 py-1.5 rounded-lg text-[10px] backdrop-blur-sm">
                      Featured Article
                    </span>
                    {featured.badge && (
                      <span className="system-label text-cp-gold bg-cp-gold/15 px-3.5 py-1.5 rounded-lg text-[10px] backdrop-blur-sm">
                        {featured.badge}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-10 lg:p-12 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-[14px] text-cp-text-muted" itemProp="author">
                      By{' '}
                      {typeof featured?.author === 'object'
                        ? featured?.author?.name
                        : featured?.author || 'Editorial Team'}
                    </span>
                    <span className="text-cp-text-muted/40">&middot;</span>
                    <span className="text-[14px] text-cp-text-muted flex items-center gap-1.5">
                      <Clock size={13} /> {featured.readTime}
                    </span>
                    <span className="text-cp-text-muted/40">&middot;</span>
                    <time
                      className="text-[14px] text-cp-text-muted"
                      itemProp="datePublished"
                      dateTime="2026-03-22"
                    >
                      {featured.date}
                    </time>
                  </div>

                  <h2
                    className="text-[28px] lg:text-[34px] font-bold text-cp-text-primary leading-[1.2] tracking-[-0.015em] group-hover:text-cp-cyan transition-colors duration-300"
                    style={{ fontFamily: 'var(--font-display)' }}
                    itemProp="headline"
                  >
                    {featured.title}
                  </h2>

                  <p
                    className="mt-6 text-[17px] leading-[1.8] text-cp-text-secondary flex-1"
                    itemProp="description"
                  >
                    {featured.excerpt}
                  </p>

                  <div className="mt-8 flex flex-wrap gap-4">
                    {featured?.tags?.map((tag: string) => (
                      <span
                        key={tag}
                        className="flex items-center gap-2 text-[13px] text-cp-text-muted"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-cp-green" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-10 flex gap-5">
                    <Link
                      href={`/insights/${featured?.slug}`}
                      className="cta-gradient flex items-center gap-2 !h-12 !text-[15px]"
                    >
                      Read Article <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              </div>
            </article>

            {/* Sidebar Articles with Thumbnails */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {(latestThree || []).map((article: any, i: number) => (
                <Reveal key={article.id} delay={i * 0.1}>
                  <article itemScope itemType="https://schema.org/BlogPosting">
                    <a
                      href={`/insights/${article.slug}`}
                      className="glass-panel overflow-hidden flex group hover:border-white/[0.12] transition-all duration-300 block"
                      style={{
                        borderLeft: `3px solid ${getCategoryColor(typeof (typeof article.category === 'object' ? article.category?.title : article.category) === 'object' ? (typeof article.category === 'object' ? article.category?.title : article.category)?.title : typeof article.category === 'object' ? article.category?.title : article.category)}`,
                      }}
                    >
                      {/* Thumbnail */}
                      <div className="w-[120px] lg:w-[140px] shrink-0 overflow-hidden">
                        <img
                          src={article?.heroImage?.url}
                          alt=""
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                          itemProp="image"
                        />
                      </div>

                      {/* Content */}
                      <div className="p-6 lg:p-7 flex flex-col flex-1">
                        <div className="flex items-center justify-between mb-2.5">
                          <span
                            className="system-label text-[10px]"
                            style={{
                              color: getCategoryColor(
                                typeof (typeof article.category === 'object'
                                  ? article.category?.title
                                  : article.category) === 'object'
                                  ? (typeof article.category === 'object'
                                      ? article.category?.title
                                      : article.category
                                    )?.title
                                  : typeof article.category === 'object'
                                    ? article.category?.title
                                    : article.category,
                              ),
                            }}
                          >
                            {typeof article.category === 'object'
                              ? article.category?.title
                              : article.category}
                          </span>
                          <span className="text-[11px] text-cp-text-muted font-mono">
                            By{' '}
                            {article.author?.name ||
                              article.author?.email ||
                              article.author ||
                              'CasePort Editorial Team'}{' '}
                            &middot;{' '}
                            <time itemProp="datePublished">
                              {new Date(
                                article.publishedDate || article.createdAt,
                              ).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </time>
                          </span>
                        </div>
                        <h3
                          className="text-[16px] lg:text-[17px] font-semibold text-cp-text-primary leading-[1.35] group-hover:text-cp-cyan transition-colors duration-300"
                          style={{ fontFamily: 'var(--font-display)' }}
                          itemProp="headline"
                        >
                          {article.title}
                        </h3>
                        <p
                          className="mt-2 text-[13px] text-cp-text-muted leading-[1.6] line-clamp-2"
                          itemProp="description"
                        >
                          {article.excerpt}
                        </p>
                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-[11px] text-cp-text-muted font-mono">
                            {article.readTime}
                          </span>
                          <span className="text-[12px] text-cp-cyan flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                            Read <ArrowUpRight size={11} />
                          </span>
                        </div>
                      </div>
                    </a>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// ─── EDITORIAL GRID SECTION (with Search Bar) ───
function EditorialGrid({
  fetchedArticles = [],
  fetchedCategories = [],
}: {
  fetchedArticles: any[]
  fetchedCategories?: any[]
}) {
  const [activeCategory, setActiveCategory] = useState<'All' | string>('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = useMemo(() => {
    let result = fetchedArticles || []
    if (activeCategory !== 'All') {
      result = result.filter((a: any) => {
        const catName = typeof a.category === 'object' ? a.category?.title : a.category
        return catName === activeCategory
      })
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter((a) => {
        const catName = typeof a.category === 'object' ? a.category?.title : a.category
        return (
          a.title?.toLowerCase().includes(q) ||
          a.excerpt?.toLowerCase().includes(q) ||
          (a.tags || []).some((t: string) => t.toLowerCase().includes(q)) ||
          (catName || '').toLowerCase().includes(q)
        )
      })
    }
    return result
  }, [activeCategory, searchQuery])

  return (
    <section id="articles" className="relative py-32 lg:py-44">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E17] via-[#0C1322] to-[#0A0E17]" />
      <div
        className="atmo-orb w-[600px] h-[600px] bg-cp-purple/5 top-[20%] right-[-15%]"
        style={{ animationDelay: '3s' }}
      />

      <div className="container relative z-10">
        {/* Section Header */}
        <Reveal>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 mb-16">
            <div>
              <span className="system-label text-cp-text-muted mb-5 block">Latest Articles</span>
              <h2
                className="text-[36px] lg:text-[44px] font-bold text-cp-text-primary tracking-[-0.02em]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                <span className="text-cp-cyan">&bull;</span> Browse the Editorial Grid
              </h2>
            </div>
            <p className="text-[16px] text-cp-text-muted max-w-[460px] leading-[1.8]">
              Structured for readability by humans, search engines, retrieval systems, and
              generative engines.
            </p>
          </div>
        </Reveal>

        {/* Search Bar */}
        <Reveal delay={0.05}>
          <div className="mb-10">
            <div className="relative max-w-[520px]">
              <Search
                size={18}
                className="absolute left-5 top-1/2 -translate-y-1/2 text-cp-text-muted"
              />
              <input
                type="text"
                placeholder="Search articles by topic, keyword, or tag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 pl-13 pr-12 rounded-xl bg-white/[0.04] border border-white/[0.08] text-[15px] text-cp-text-primary placeholder:text-cp-text-muted/60 focus:outline-none focus:border-cp-cyan/40 focus:bg-white/[0.06] transition-all duration-300"
                aria-label="Search articles"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-cp-text-muted hover:text-cp-text-primary transition-colors"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </Reveal>

        {/* Category Filters */}
        <Reveal delay={0.1}>
          <div className="mb-16">
            {/* Desktop: buttons inline */}
            <div className="hidden lg:flex flex-wrap gap-3">
              <button
                key="All"
                onClick={() => setActiveCategory('All')}
                className={`px-5 py-2.5 rounded-lg text-[14px] font-medium transition-all duration-300 ${
                  activeCategory === 'All'
                    ? 'bg-cp-cyan/15 text-cp-cyan border border-cp-cyan/30 shadow-[0_0_20px_rgba(34,211,238,0.1)]'
                    : 'bg-white/[0.03] text-cp-text-muted border border-white/[0.06] hover:border-white/[0.12] hover:text-cp-text-secondary hover:bg-white/[0.05]'
                }`}
              >
                All
              </button>
              {(fetchedCategories && fetchedCategories.length > 0
                ? fetchedCategories.map((c) => c.title)
                : categories
              ).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat as string)}
                  className={`px-5 py-2.5 rounded-lg text-[14px] font-medium transition-all duration-300 ${
                    activeCategory === cat
                      ? 'bg-cp-cyan/15 text-cp-cyan border border-cp-cyan/30 shadow-[0_0_20px_rgba(34,211,238,0.1)]'
                      : 'bg-white/[0.03] text-cp-text-muted border border-white/[0.06] hover:border-white/[0.12] hover:text-cp-text-secondary hover:bg-white/[0.05]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            {/* Mobile: dropdown select */}
            <div className="lg:hidden">
              <select
                value={activeCategory}
                onChange={(e) => setActiveCategory(e.target.value)}
                className="w-full h-12 px-4 rounded-lg bg-[#0B1120] border border-white/[0.08] text-[14px] text-cp-text-primary appearance-none cursor-pointer focus:outline-none focus:border-cp-cyan/40 transition-all duration-300"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 12px center',
                }}
              >
                <option value="All" className="bg-[#0B1120]">All</option>
                {(fetchedCategories && fetchedCategories.length > 0
                  ? fetchedCategories.map((c) => c.title)
                  : categories
                ).map((cat) => (
                  <option key={cat} value={cat} className="bg-[#0B1120]">
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Reveal>

        {/* Results count */}
        {searchQuery && (
          <div className="mb-8 text-[14px] text-cp-text-muted">
            {filtered.length} {filtered.length === 1 ? 'article' : 'articles'} found
            {activeCategory !== 'All' && ` in ${activeCategory}`}
          </div>
        )}

        {/* Article Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-8">
          {filtered.map((article: any, i: number) => (
            <Reveal key={article.id} delay={i * 0.06}>
              <ArticleCard article={article} />
            </Reveal>
          ))}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <Reveal>
            <div className="text-center py-24">
              <Search size={40} className="mx-auto text-cp-text-muted/30 mb-6" />
              <p
                className="text-[18px] text-cp-text-muted"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                No articles match your search.
              </p>
              <p className="mt-3 text-[15px] text-cp-text-muted/60">
                Try a different keyword or browse all categories.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setActiveCategory('All')
                }}
                className="mt-8 cta-secondary !h-11 !text-[14px] !px-6"
              >
                Clear Filters
              </button>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  )
}

// ─── ARTICLE CARD (with thumbnail, rich hover, semantic markup) ───
function ArticleCard({ article }: { article: any }) {
  return (
    <article itemScope itemType="https://schema.org/BlogPosting">
      <a
        href={`/insights/${article.slug}`}
        className="article-card glass-panel overflow-hidden flex flex-col group h-full block"
        style={{
          borderLeft: `3px solid ${getCategoryColor(typeof (typeof article.category === 'object' ? article.category?.title : article.category) === 'object' ? (typeof article.category === 'object' ? article.category?.title : article.category)?.title : typeof article.category === 'object' ? article.category?.title : article.category)}`,
        }}
      >
        {/* Thumbnail */}
        <div className="relative h-[180px] overflow-hidden">
          <img
            src={article?.heroImage?.url}
            alt=""
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
            itemProp="image"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E17] via-[#0A0E17]/30 to-transparent" />

          {/* Badge overlay */}
          {article.badge && (
            <div className="absolute top-4 right-4">
              <span
                className={`system-label text-[9px] px-3 py-1.5 rounded-lg backdrop-blur-sm ${
                  article.badge === "Editor's Pick"
                    ? 'text-cp-gold bg-cp-gold/15'
                    : article.badge === 'Most Read'
                      ? 'text-cp-cyan bg-cp-cyan/15'
                      : 'text-cp-green bg-cp-green/15'
                }`}
              >
                {article.badge}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-8 lg:p-9 flex flex-col flex-1">
          <div className="flex items-center justify-between mb-5">
            <span
              className="system-label text-[10px]"
              style={{
                color: getCategoryColor(
                  typeof (typeof article.category === 'object'
                    ? article.category?.title
                    : article.category) === 'object'
                    ? (typeof article.category === 'object'
                        ? article.category?.title
                        : article.category
                      )?.title
                    : typeof article.category === 'object'
                      ? article.category?.title
                      : article.category,
                ),
              }}
              itemProp="articleSection"
            >
              {typeof article.category === 'object' ? article.category?.title : article.category}
            </span>
          </div>

          <h3
            className="text-[19px] font-semibold text-cp-text-primary leading-[1.35] group-hover:text-cp-cyan transition-colors duration-300"
            style={{ fontFamily: 'var(--font-display)' }}
            itemProp="headline"
          >
            {article.title}
          </h3>

          <p
            className="mt-4 text-[15px] text-cp-text-muted leading-[1.8] line-clamp-2 flex-1"
            itemProp="description"
          >
            {article.excerpt}
          </p>

          <div className="mt-6 flex items-center justify-between pt-5 border-t border-white/[0.04]">
            <span className="text-[13px] text-cp-text-muted font-mono">
              By{' '}
              {article.author?.name ||
                article.author?.email ||
                article.author ||
                'CasePort Editorial Team'}{' '}
              &middot;{' '}
              <time itemProp="datePublished">
                {new Date(article.publishedDate || article.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </time>{' '}
              &middot; {article.readTime}
            </span>
            <span className="text-[14px] text-cp-cyan flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-4px] group-hover:translate-x-0">
              Read <ArrowUpRight size={14} />
            </span>
          </div>
        </div>
      </a>
    </article>
  )
}

// ─── NEWSLETTER SECTION ───
function NewsletterSection() {
  const [email, setEmail] = useState('')

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
    const dest = email ? `/intelligence?email=${encodeURIComponent(email)}` : '/intelligence'
    window.location.href = dest
  }

  return (
    <section id="subscribe" className="relative py-32 lg:py-44">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E17] to-[#0B1120]" />

      <div className="container relative z-10">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl">
            <img
              src={NEWSLETTER_BG}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-40"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-[#0A0E17]/65" />

            <div className="relative z-10 px-10 py-24 lg:px-24 lg:py-32 text-center">
              <span className="system-label text-cp-cyan mb-6 block">Subscribe</span>
              <h2
                className="text-[32px] lg:text-[44px] font-bold text-cp-text-primary tracking-[-0.02em]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Get the Case Acquisition Brief
              </h2>
              <p className="mt-7 text-[17px] text-cp-text-secondary max-w-[620px] mx-auto leading-[1.8]">
                A curated intelligence email covering personal injury demand shifts, intake lessons,
                search visibility changes, and strategic signals serious firms should not ignore.
              </p>

              {/* Social Proof */}
              <div className="mt-10 flex items-center justify-center gap-3">
                <div className="flex -space-x-2">
                  {[
                    'bg-gradient-to-br from-cp-cyan to-cp-purple',
                    'bg-gradient-to-br from-cp-gold to-cp-green',
                    'bg-gradient-to-br from-cp-purple to-cp-cyan',
                    'bg-gradient-to-br from-cp-green to-cp-gold',
                  ].map((bg, i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-full ${bg} border-2 border-[#0A0E17] flex items-center justify-center`}
                    >
                      <Users size={12} className="text-white/80" />
                    </div>
                  ))}
                </div>
                <span className="text-[14px] text-cp-text-secondary ml-2">
                  Joined by <span className="text-cp-text-primary font-semibold">2,400+</span> PI
                  firm operators
                </span>
              </div>

              {/* Value Pills */}
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                {[
                  'Weekly signal summary',
                  'No fluff, just movement',
                  'Built for serious operators',
                  'Free, always',
                ].map((label) => (
                  <span
                    key={label}
                    className="px-5 py-2.5 rounded-lg border border-white/[0.08] bg-white/[0.03] text-[14px] text-cp-text-secondary"
                  >
                    {label}
                  </span>
                ))}
              </div>

              {/* Email Form */}
              <div className="mt-14 flex flex-col sm:flex-row gap-4 max-w-[500px] mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 h-14 px-5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-[15px] text-cp-text-primary placeholder:text-cp-text-muted focus:outline-none focus:border-cp-cyan/40 transition-colors"
                  aria-label="Email address"
                />
                <button
                  onClick={handleSubscribe}
                  className="cta-gradient whitespace-nowrap !h-14 !text-[15px]"
                >
                  Subscribe Free
                </button>
              </div>

              <p className="mt-6 text-[12px] text-cp-text-muted/60">
                No spam. Unsubscribe anytime. Read by managing partners, CMOs, and growth leads at
                PI firms billing $5M-$50M+.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// ─── TOPIC CLUSTERS SECTION ───
function TopicClusters() {
  return (
    <section className="relative py-32 lg:py-44">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B1120] via-[#0A0E17] to-[#0A0E17]" />

      <div className="container relative z-10">
        <Reveal>
          <span className="system-label text-cp-text-muted mb-5 block">Knowledge Map</span>
          <h2
            className="text-[36px] lg:text-[44px] font-bold text-cp-text-primary tracking-[-0.02em]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <span className="text-cp-cyan">&bull;</span> Explore by Topic
          </h2>
          <p className="mt-6 text-[17px] text-cp-text-muted max-w-[540px] leading-[1.8]">
            Organized clusters for focused reading. Each topic is a deep-dive into a specific
            dimension of case acquisition.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-8">
          {topicClusters.map((topic, i) => (
            <Reveal key={topic.name} delay={i * 0.08}>
              <Link
                href={`/insights?category=${encodeURIComponent(topic.name)}`}
                className="topic-card glass-panel p-8 lg:p-10 group cursor-pointer block h-full"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-cp-cyan group-hover:bg-cp-cyan/10 group-hover:border-cp-cyan/20 transition-all duration-300">
                    {getTopicIcon(topic.icon)}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-[3px] w-8 rounded-full bg-white/[0.06]" />
                    <div className="h-[3px] w-5 rounded-full bg-white/[0.04]" />
                    <div className="h-[3px] w-3 rounded-full bg-white/[0.03]" />
                  </div>
                </div>

                <h3
                  className="text-[20px] font-semibold text-cp-text-primary group-hover:text-cp-cyan transition-colors duration-300"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {topic.name}
                </h3>
                <p className="mt-4 text-[15px] text-cp-text-muted leading-[1.8]">
                  {topic.description}
                </p>

                <div className="mt-8 flex items-center justify-between">
                  <span className="system-label text-[10px] text-cp-text-muted">
                    {topic.articleCount} articles
                  </span>
                  <span className="text-[14px] text-cp-cyan flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-4px] group-hover:translate-x-0">
                    Explore <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── EDITORIAL PHILOSOPHY ───
function EditorialPhilosophy() {
  return (
    <section className="relative py-32 lg:py-44">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E17] to-[#0B1120]" />

      <div className="container relative z-10">
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
            <div className="glass-panel p-12 lg:p-16">
              <span className="system-label text-cp-text-muted mb-6 block">
                Editorial Philosophy
              </span>
              <h2
                className="text-[30px] lg:text-[38px] font-bold text-cp-text-primary leading-[1.2]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                How We Think About Case Acquisition
              </h2>
            </div>

            <div className="glass-panel p-12 lg:p-16 flex items-center">
              <div>
                <div className="text-[32px] text-cp-cyan/30 mb-4 leading-none">&ldquo;</div>
                <p className="text-[18px] lg:text-[20px] leading-[1.85] text-cp-text-secondary font-light">
                  CasePort studies the full path from demand to inquiry to intake to retained case
                  value. We are interested in what improves outcomes, not just activity. That
                  includes search behavior, conversion friction, intake discipline, market
                  economics, and system design.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// ─── SIGNALS SECTION ───
function SignalsSection() {
  return (
    <section className="relative py-32 lg:py-44">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B1120] via-[#0A0E17] to-[#0A0E17]" />
      <div
        className="atmo-orb w-[500px] h-[500px] bg-cp-cyan/5 bottom-[10%] left-[-10%]"
        style={{ animationDelay: '7s' }}
      />

      <div className="container relative z-10">
        <Reveal>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10 mb-16">
            <div>
              <span className="system-label text-cp-text-muted mb-5 block">Freshness Layer</span>
              <h2
                className="text-[36px] lg:text-[44px] font-bold text-cp-text-primary tracking-[-0.02em]"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                <span className="text-cp-cyan">&bull;</span> Latest Signals
              </h2>
            </div>
            <p className="text-[16px] text-cp-text-muted max-w-[400px] leading-[1.8]">
              Short-form observations from the intelligence desk
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {signals.map((signal, i) => (
            <Reveal key={signal.id} delay={i * 0.1}>
              <Link
                href="/insights"
                className="signal-card glass-panel p-7 lg:p-8 group cursor-pointer block"
              >
                <div className="flex items-center justify-between mb-5">
                  <span className="system-label text-cp-green flex items-center gap-2 text-[10px]">
                    <span className="w-2 h-2 rounded-full bg-cp-green animate-pulse" />
                    Signal {signal.number}
                  </span>
                  <span
                    className={`system-label text-[9px] px-2.5 py-1 rounded-full ${
                      signal.priority === 'HIGH'
                        ? 'text-cp-cyan bg-cp-cyan/10'
                        : 'text-cp-text-muted bg-white/[0.04]'
                    }`}
                  >
                    {signal.priority}
                  </span>
                </div>

                <p
                  className="text-[16px] font-medium text-cp-text-primary leading-[1.5] group-hover:text-cp-cyan transition-colors duration-300"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {signal.title}
                </p>

                <div className="mt-6 flex items-center justify-between">
                  <div className="flex-1 h-[3px] rounded-full bg-white/[0.06] overflow-hidden mr-4">
                    <div
                      className="signal-bar h-full"
                      style={{ width: `${signal.signalStrength}%` }}
                    />
                  </div>
                  <span className="text-[12px] text-cp-text-muted font-mono">{signal.date}</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── FINAL CTA SECTION ───
function FinalCTA() {
  return (
    <section className="relative py-36 lg:py-52">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0E17] to-[#060911]" />

      <div className="container relative z-10">
        <Reveal>
          <div className="glass-panel max-w-[860px] mx-auto px-12 py-24 lg:px-24 lg:py-32 text-center group hover:border-white/[0.1] transition-all duration-500">
            <span className="system-label text-cp-cyan mb-7 block">Next Step</span>
            <h2
              className="text-[30px] lg:text-[40px] font-bold text-cp-text-primary leading-[1.2] tracking-[-0.02em]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Better Insight Is Useful.{' '}
              <span className="block mt-2">Better Infrastructure Is Better.</span>
            </h2>
            <p className="mt-8 text-[17px] text-cp-text-secondary max-w-[540px] mx-auto leading-[1.8]">
              CasePort helps qualified firms turn better intelligence into more controlled case
              acquisition outcomes.
            </p>
            <div className="mt-12 flex flex-wrap justify-center gap-5">
              <Link href="/" className="cta-gradient flex items-center gap-2.5">
                Learn About CasePort <ArrowRight size={16} />
              </Link>
              <Link href="/request-access" className="cta-secondary flex items-center gap-2.5">
                Request Private Access <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// ─── MAIN PAGE ───
type NavLink = { label: string; href: string; openInNewTab?: boolean }

export default function InsightsClient({
  fetchedArticles = [],
  fetchedCategories = [],
  navLinks = [],
  ctaLabel,
  ctaHref,
  articleCount,
}: {
  fetchedArticles: any[]
  fetchedCategories?: any[]
  navLinks?: NavLink[]
  ctaLabel?: string
  ctaHref?: string
  articleCount?: number
}) {
  return (
    <>
      <StructuredData />
      <AEOContent />
      <main className="bg-[#0A0E17] min-h-screen overflow-x-hidden pt-16 lg:pt-[72px]">
        <ReadingProgressBar />
        <Navbar variant="editorial" navLinks={navLinks} ctaLabel={ctaLabel} ctaHref={ctaHref} />
        <HeroSection fetchedArticles={fetchedArticles} articleCount={articleCount} />
        <FeaturedSection fetchedArticles={fetchedArticles} />
        <EditorialGrid fetchedArticles={fetchedArticles} fetchedCategories={fetchedCategories} />
        <NewsletterSection />
        <TopicClusters />
        <EditorialPhilosophy />
        <SignalsSection />
        <FAQSection />
        <FinalCTA />
        <Footer />
        <BackToTop />
      </main>
    </>
  )
}
