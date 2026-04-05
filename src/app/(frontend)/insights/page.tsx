'use client'
/*
  DESIGN: "The Observatory" — Elevated Editorial with Atmospheric Depth
  CasePort Insights — 10/10 WORLD-CLASS VERSION
*/

import { Header } from '@/components/Header'
import AEOContent from '@/components/insights/AEOContent'
import FAQSection from '@/components/insights/FAQSection'
import Footer from '@/components/insights/Footer'
import StructuredData from '@/components/insights/StructuredData'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { articles, categories, signals, type Article, type Category } from '@/lib/articles'
import {
  ArrowRight,
  ArrowUp,
  ChevronRight,
  Clock,
  FileText,
  Layers,
  Search,
  Users,
  X,
  Zap,
} from 'lucide-react'
import React, { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'

// ─── Asset URLs ───
const HERO_BG =
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/AtP97UDSfYwW9WKCZmFxDF/hero-bg-observatory-cif5ZiVFBsvUuiNxsoQwYm.webp'
const FEATURED_IMG =
  'https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/AtP97UDSfYwW9WKCZmFxDF/featured-article-intake-GmYBqecoGyFgqpaS7XnVzk.webp'

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
      ref={ref as any}
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

// ─── STAT CARD COMPONENT ───
function StatCard({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="flex items-center p-6 bg-white/[0.02] border border-white/[0.06] rounded-2xl hover:border-white/10 transition-colors group">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/[0.03] group-hover:bg-cp-cyan/10 transition-colors mr-4">
        {icon}
      </div>
      <div>
        <div className="text-2xl font-extrabold text-white mb-1 tracking-tight">{value}</div>
        <div className="text-[10px] font-mono text-cp-text-muted uppercase tracking-widest leading-tight">
          {label}
        </div>
      </div>
    </div>
  )
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
    <nav aria-label="Breadcrumb" className="relative z-10 pb-0">
      <ol
        className="flex items-center gap-2 text-[13px] font-mono"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
          <a
            href="/"
            itemProp="item"
            className="text-cp-text-muted hover:text-cp-cyan transition-colors"
          >
            <span itemProp="name">Home</span>
          </a>
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

export default function InsightsPage() {
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchCat = activeCategory === 'All' || article.category === activeCategory
      const matchSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase())
      return matchCat && matchSearch
    })
  }, [activeCategory, searchQuery])

  const featured = articles.find((a) => a.featured) || articles[0]

  return (
    <main className="min-h-screen bg-[#0A0E17] text-white selection:bg-cp-cyan/30">
      <StructuredData />
      <ReadingProgressBar />
      {/* Header overlay for Next.js app router layout (requires z-50 Header via importing active UI) */}
      <Header />

      {/* ─── OBSERVATORY HERO ─── */}
      <section className="relative pb-16 md:pb-24 pt-8 md:pt-12 overflow-hidden bg-[#0A0E17]">
        {/* Deep Field Background Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-cp-cyan/10 via-[#0A0E17] to-[#0A0E17] opacity-80" />
        <div
          className="absolute right-0 top-0 left-0 w-full h-full opacity-10 mix-blend-screen pointer-events-none"
          style={{
            backgroundImage: `url(${HERO_BG})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />

        <div className="container relative z-10">
          <Breadcrumbs />

          <div className="max-w-[95%] md:max-w-[85%] xl:max-w-[80%] mt-12 mb-16 text-left">
            <Reveal delay={0.1}>
              <div className="inline-flex items-center gap-2 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-cp-cyan"></span>
                <span className="text-[11px] font-bold tracking-widest text-cp-cyan uppercase">
                  CasePort Insights
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <h1
                className="text-4xl md:text-[56px] font-bold tracking-tight mb-8 leading-[1.15]"
                style={{ fontFamily: '"Space Grotesk", sans-serif' }}
              >
                Ideas, Signals, and Strategy for Smarter Case Acquisition.
              </h1>
            </Reveal>

            <Reveal delay={0.3}>
              <p className="text-lg md:text-xl text-cp-text-muted leading-relaxed max-w-2xl mb-12">
                Analysis on personal injury demand, intake performance, search visibility, lead
                economics, and the systems behind better case growth.
              </p>
            </Reveal>

            <Reveal delay={0.4}>
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="#database"
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-semibold bg-gradient-to-r from-cp-cyan to-cp-purple text-white hover:opacity-90 transition-opacity text-sm"
                >
                  Browse Articles <ArrowRight size={16} className="ml-2" />
                </a>
                <a
                  href="#newsletter"
                  className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-semibold bg-[#0A0E17] border border-white/10 text-white hover:bg-white/5 transition-colors text-sm"
                >
                  Subscribe to the Brief
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ─── METRICS BAR (IMAGE MATCH) ─── */}
      <section className="relative z-20 m-20 container">
        <Reveal delay={0.5}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={<FileText size={20} className="text-cp-cyan" />}
              value="42+"
              label="Articles Published"
            />
            <StatCard
              icon={<Layers size={20} className="text-cp-cyan" />}
              value="6"
              label="Topic Clusters"
            />
            <StatCard
              icon={<Zap size={20} className="text-cp-cyan" />}
              value="Weekly"
              label="Signal Updates"
            />
            <StatCard
              icon={<Users size={20} className="text-cp-cyan" />}
              value="2,400+"
              label="Subscribers"
            />
          </div>
        </Reveal>
      </section>

      {/* ─── FEATURED INTELLIGENCE (ASYMMETRIC GRID) ─── */}
      {featured && featured.id && (
        <section className="py-20 md:py-32 border-b border-white/[0.06] relative bg-[#0A0E17]/80">
          <div className="container">
            <Reveal>
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-3xl font-bold tracking-tight">Featured Intelligence</h2>
                <div className="hidden md:flex items-center gap-2 text-cp-text-muted text-[13px] font-mono">
                  <Zap size={14} className="text-cp-gold" /> Critical Updates
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 group">
                {/* Main Featured */}
                <a
                  href={`/insights/${featured.slug}`}
                  className="lg:col-span-8 bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-cp-cyan/30 transition-all duration-500 hover:shadow-[0_0_40px_rgba(34,211,238,0.05)] relative flex flex-col h-full"
                >
                  <div className="aspect-[16/9] md:aspect-[21/9] w-full relative overflow-hidden bg-[#111622]">
                    <img
                      src={FEATURED_IMG}
                      alt={featured.title}
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-100 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0E17] via-[#0A0E17]/50 to-transparent" />
                    <div className="absolute top-6 left-6 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-xs font-bold text-white tracking-widest uppercase shadow-lg">
                      {featured.badge || 'Featured'}
                    </div>
                  </div>
                  <div className="p-8 md:p-12 mb-auto h-full flex flex-col justify-end mt-[-80px] relative z-10 bg-gradient-to-t from-[#0A0E17] pt-12">
                    <div className="flex items-center gap-3 mb-6">
                      <span
                        className="text-[13px] font-mono font-medium"
                        style={{ color: getCategoryColor(featured.category) }}
                      >
                        {featured.category}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-white/20" />
                      <span className="text-[13px] text-cp-text-muted flex items-center font-mono">
                        <Clock size={12} className="mr-1.5" /> {featured.readTime}
                      </span>
                    </div>
                    <h3 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 group-hover:text-cp-cyan transition-colors duration-300">
                      {featured.title}
                    </h3>
                    <p className="text-lg text-cp-text-muted leading-relaxed line-clamp-3">
                      {featured.excerpt}
                    </p>
                  </div>
                </a>

                {/* Signals Feed (Right Column) */}
                <div className="lg:col-span-4 bg-[#0A0E17] border border-white/[0.06] rounded-2xl flex flex-col pt-8">
                  <div className="px-8 pb-6 border-b border-white/[0.06] flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <h3 className="font-mono text-[13px] tracking-widest text-cp-text-muted uppercase">
                      Live Signals
                    </h3>
                  </div>
                  <div className="flex-1 divide-y divide-white/[0.06]">
                    {signals.slice(0, 4).map((signal: any) => (
                      <div
                        key={signal.id}
                        className="block p-8 hover:bg-white/[0.02] transition-colors group/signal cursor-pointer"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="text-[11px] font-mono text-cp-cyan">
                            SIG-{signal.number}
                          </div>
                          <div
                            className={`text-[11px] font-mono px-2 py-0.5 rounded ${signal.priority === 'HIGH' ? 'bg-red-500/10 text-red-400' : 'bg-white/5 text-cp-text-muted'}`}
                          >
                            {signal.priority}
                          </div>
                        </div>
                        <h4 className="font-bold text-white mb-2 group-hover/signal:text-cp-cyan transition-colors">
                          {signal.title}
                        </h4>
                        <div className="text-[12px] text-cp-text-muted/60">{signal.date}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ─── INTELLIGENCE DATABASE (EDITORIAL GRID) ─── */}
      <section className="py-20 md:py-32 relative">
        <div className="container relative z-10">
          <Reveal>
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-16">
              <h2 className="text-3xl font-bold tracking-tight">The Database</h2>
              <div className="relative w-full md:w-80 group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cp-cyan to-purple-500 rounded-xl opacity-0 group-focus-within:opacity-30 transition-opacity duration-500 blur" />
                <div className="relative flex items-center bg-[#0A0E17] border border-white/10 rounded-xl px-4 py-3">
                  <Search size={18} className="text-cp-text-muted mr-3" />
                  <input
                    type="text"
                    placeholder="Search articles, strategies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent w-full focus:outline-none text-white placeholder:text-white/30 text-sm font-mono"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="text-white/40 hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex flex-wrap gap-3 mb-16">
              <button
                onClick={() => setActiveCategory('All')}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${activeCategory === 'All' ? 'bg-white text-[#0A0E17] shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'bg-white/[0.03] text-cp-text-muted border border-white/[0.08] hover:bg-white/[0.08]'}`}
              >
                All Directives
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${activeCategory === cat ? 'bg-cp-cyan/10 text-cp-cyan border border-cp-cyan/50 shadow-[0_0_20px_rgba(34,211,238,0.1)]' : 'bg-white/[0.03] text-cp-text-muted border border-white/[0.08] hover:bg-white/[0.08]'}`}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: getCategoryColor(cat) }}
                  />
                  {cat}
                </button>
              ))}
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
            {filteredArticles.map((article: Article, idx) => (
              <Reveal key={article.id} delay={0.05 * (idx % 2)}>
                <a
                  href={`/insights/${article.slug}`}
                  className="group block relative h-full flex flex-col cursor-pointer border border-white/[0.05] bg-white/[0.01] hover:bg-white/[0.03] p-6 lg:p-8 rounded-3xl hover:border-cp-cyan/30 transition-all duration-500 overflow-hidden"
                >
                  {/* Hover Glow Background */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cp-cyan/10 via-transparent to-transparent pointer-events-none" />

                  <div className="flex flex-col md:flex-row gap-8 items-start h-full">
                    <div className="w-full md:w-2/5 aspect-[4/3] rounded-xl overflow-hidden bg-white/[0.03] shrink-0">
                      <img
                        src={article.thumbnail}
                        alt={article.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                      />
                    </div>

                    <div className="w-full md:w-3/5 flex flex-col h-full z-10 relative">
                      <div className="flex flex-wrap items-center gap-3 mb-4 mt-auto">
                        <span
                          className="text-[12px] font-mono font-bold tracking-widest uppercase"
                          style={{ color: getCategoryColor(article.category) }}
                        >
                          {article.category}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-white/20" />
                        <span className="text-[12px] text-cp-text-muted font-mono">
                          {article.date}
                        </span>
                      </div>

                      <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cp-cyan transition-colors leading-snug">
                        {article.title}
                      </h3>

                      <p className="text-cp-text-muted leading-relaxed line-clamp-3 mb-8 flex-grow">
                        {article.excerpt}
                      </p>

                      <div className="flex items-center text-[12px] font-mono text-cp-text-muted/60 group-hover:text-white transition-colors mt-auto">
                        Read Directive{' '}
                        <ArrowRight
                          size={14}
                          className="ml-2 transform group-hover:translate-x-1 transition-transform"
                        />
                      </div>
                    </div>
                  </div>
                </a>
              </Reveal>
            ))}
            {filteredArticles.length === 0 && (
              <div className="col-span-full py-32 text-center border border-white/5 rounded-2xl bg-white/[0.02]">
                <Search size={48} className="mx-auto text-white/10 mb-6" />
                <h3 className="text-2xl font-bold mb-2">No matching intelligence found</h3>
                <p className="text-cp-text-muted">
                  Adjust your search parameters to access the database.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── NEWSLETTER CTA ─── */}
      <section className="py-32 relative overflow-hidden border-y border-white/[0.06]">
        <div className="absolute inset-0 bg-[#0A0E17]" />
        <div className="absolute inset-0 bg-cp-cyan/5 mix-blend-overlay" />
        <div className="container relative z-10">
          <Reveal>
            <div className="max-w-4xl mx-auto bg-gradient-to-br from-white/[0.05] to-transparent border border-white/10 rounded-3xl p-10 md:p-16 text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cp-cyan to-transparent opacity-50" />

              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Weekly{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cp-cyan to-purple-400">
                  Signal Intelligence
                </span>
              </h2>
              <p className="text-xl text-cp-text-muted mb-10 max-w-2xl mx-auto">
                One tactical breakdown per week covering the actual math of case acquisition. No
                fluff. Real data.
              </p>

              <form
                className="max-w-md mx-auto relative group"
                onSubmit={(e: FormEvent) => e.preventDefault()}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-cp-cyan to-[#0A0E17] rounded-xl opacity-0 group-focus-within:opacity-50 transition-opacity duration-300 blur" />
                <div className="relative flex items-center">
                  <input
                    type="email"
                    placeholder="Enter your work email"
                    className="flex-1 bg-[#0A0E17] border border-white/20 rounded-l-xl py-4 px-6 text-white focus:outline-none focus:border-cp-cyan/50 font-mono text-sm"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-cp-cyan hover:bg-cp-cyan/90 text-[#0A0E17] font-bold px-8 py-4 rounded-r-xl transition-colors whitespace-nowrap flex items-center cursor-pointer"
                  >
                    Subscribe <ArrowRight size={16} className="ml-2" />
                  </button>
                </div>
              </form>
            </div>
          </Reveal>
        </div>
      </section>

      <AEOContent />
      <FAQSection />
      <Footer />
      <BackToTop />
    </main>
  )
}
