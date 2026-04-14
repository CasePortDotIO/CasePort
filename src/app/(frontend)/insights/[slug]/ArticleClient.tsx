'use client'
/*
  DESIGN: "The Observatory" — CasePort Insights Article Template (10/10 Apple-Level)
  LAYOUT:  Dark hero (Observatory theme) → Seamless gradient transition → White reading body (NYT/Atlantic style)
  READING BODY: Pure white (#FFFFFF) background, dark charcoal text (#1F2937)
  Typography: Space Grotesk (headings, bold), Geist Sans (body 20px / line-height 2.0), JetBrains Mono (system)
  No italic fonts anywhere. Dan Lok voice on CTAs. Backlink infrastructure baked in.
  
  APPLE-LEVEL WHITESPACE (reading body):
  - Section gaps: 160px (increased from 128px) — LUXURIOUS breathing room
  - Paragraph spacing: 48px (increased from 40px) — premium reading rhythm
  - Heading to body: 56px (increased from 48px) — commanding visual hierarchy
  - Card padding: 40-48px minimum (increased from 32px) — refined, luxurious
  - Reading column: max-w-[720px], centered with large side margins
  - Blockquote vertical: my-24 lg:my-32 — generous breathing room
  - H2 headings: text-[40px] lg:text-[48px] — prominent, commanding
  - All interactive elements: smooth hover states, micro-interactions
  - Scroll animations: fade-in, slide-up, stagger effects throughout
  
  APPLE-LEVEL REFINEMENTS:
  - Micro-interactions on all cards, buttons, links
  - Scroll animations (fade, slide, stagger)
  - Custom refined icons throughout
  - Visual separation via subtle backgrounds and borders
  - Seamless hero-to-white transition (200px gradient fade)
  - Refined color palette with intentional hierarchy
  - Success animations on interactions
  - Focus states for accessibility
  - SCROLL INDICATOR at bottom of hero (chevron pulse)
  - GRADIENT FADE at hero bottom suggesting content below
  - PARALLAX effect on hero as user scrolls
  - STAGGERED animations on all list items
  - GLOW effects on hover for cards and buttons
  - SMOOTH fade-in for all sections as they enter viewport
*/

import Footer from '@/components/insights/Footer'
import Navbar from '@/components/Navbar'
import {
  ArrowUp,
  Award,
  Bookmark,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Copy,
  Download,
  ExternalLink,
  Eye,
  Lightbulb,
  LinkIcon,
  Lock,
  MessageSquare,
  RefreshCw,
  TrendingUp,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { FaLinkedin, FaTwitter } from 'react-icons/fa'
import { toast } from 'sonner'

import { CustomRichText } from '@/components/insights/RichTextRenderer'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { articles } from '@/lib/articles'

/* ─── Reading Progress Bar ─── */
function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-1 bg-transparent">
      <div
        className="h-full transition-[width] duration-150 ease-out"
        style={{
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #06B6D4, #8B5CF6)',
        }}
      />
    </div>
  )
}

/* ─── Back to Top Button with Micro-Interaction ─── */
function BackToTop() {
  const [visible, setVisible] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300"
      style={{
        background: 'rgba(10,14,23,0.9)',
        border: '1px solid rgba(255,255,255,0.15)',
        backdropFilter: 'blur(20px)',
        color: '#22D3EE',
        transform: hovered ? 'scale(1.1)' : 'scale(1)',
        boxShadow: hovered ? '0 8px 24px rgba(34, 211, 238, 0.2)' : '0 4px 12px rgba(0,0,0,0.15)',
      }}
      aria-label="Back to top"
    >
      <ArrowUp size={20} />
    </button>
  )
}

/* ─── Scroll Indicator (Animated Chevron) ─── */
function ScrollIndicator() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY < 200)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
      <div className="animate-bounce">
        <ChevronDown size={24} className="text-cyan-300/60" />
      </div>
    </div>
  )
}

/* ─── Scroll Reveal Hook ─── */
function useScrollReveal() {
  const [revealed, setRevealed] = useState<Set<string>>(new Set())
  const [readingDepth, setReadingDepth] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRevealed((prev) => new Set(prev).add(entry.target.id))
          }
        })
      },
      { threshold: 0.1 },
    )

    document.querySelectorAll('[data-reveal]').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const depth = (scrollTop / docHeight) * 100
      setReadingDepth(depth)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return revealed
}

/* ─── Reading Depth Tracker for Tiered CTAs ─── */
function useReadingDepth() {
  const [depth, setDepth] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setDepth(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return depth
}

/* ─── Tiered CTA Modal Component ─── */
function TieredCTAModal({ depth, onClose }: { depth: number; onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const getCTAConfig = () => {
    if (depth >= 80) {
      return {
        title: "Your Firm's Intake Audit is Waiting",
        subtitle:
          "You've read this far. You care about fixing this. Let's show you exactly where your firm is leaking value.",
        cta: 'Get Your Free Audit →',
        description: '5-minute assessment. Zero obligation. Real insights.',
      }
    } else if (depth >= 60) {
      return {
        title: 'See Your Intake Leakage in Real Numbers',
        subtitle: "Most firms don't know their actual leakage cost. We'll calculate yours.",
        cta: 'Calculate Your Leakage Cost →',
        description: 'Instant. Personalized. Eye-opening.',
      }
    } else {
      return {
        title: 'Want to Fix This?',
        subtitle: 'Get the exact framework that 200+ PI firms use to eliminate intake leakage.',
        cta: 'Get the Framework →',
        description: 'Free. Actionable. Proven.',
      }
    }
  }

  const config = getCTAConfig()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setSubmitted(true)
      toast.success('Check your email for the next step.')
      setTimeout(() => onClose(), 2000)
    }
  }

  if (!submitted) {
    return (
      <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-8 relative animate-fadeInUp">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 hover:bg-slate-100 rounded transition-colors"
          >
            <X size={20} className="text-slate-400" />
          </button>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">{config.title}</h2>
          <p className="text-slate-600 mb-6">{config.subtitle}</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="your@firm.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <button
              type="submit"
              className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
            >
              {config.cta}
            </button>
            <p className="text-xs text-slate-500 text-center">{config.description}</p>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-8 text-center animate-fadeInUp">
        <CheckCircle2 size={48} className="text-cyan-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">You're In.</h2>
        <p className="text-slate-600">Check your email. We're sending the next step now.</p>
      </div>
    </div>
  )
}

/* ─── Exit Intent Popup ─── */

/* ─── Article Structured Data ─── */
function ArticleStructuredData({ article, content, url, datePublished, dateModified }: any) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: content?.title || article?.title,
    description: article?.subtitle || 'Personal Injury Law Insights',
    image: article?.heroImage?.url || article?.thumbnail,
    author: {
      '@type': 'Person',
      name: content?.author || 'Martha Kechicha',
      jobTitle: content?.authorRole || 'Senior Analyst, CasePort Editorial',
    },
    datePublished: datePublished,
    dateModified: dateModified,
    publisher: {
      '@type': 'Organization',
      name: 'CasePort',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.caseport.io/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    articleBody: content?.sections?.map((s: any) => s.paragraphs?.join(' ')).join(' ') || '',
    keywords: article?.tags?.join(', ') || '',
    about: {
      '@type': 'Thing',
      name: 'Personal Injury Law',
    },
    mentions: [
      { '@type': 'Thing', name: 'Intake Leakage' },
      { '@type': 'Thing', name: 'Case Acquisition' },
    ],
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.article-body h2', '.key-takeaway', '.stat-card'],
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

/* ─── Main Article Page Component ─── */
/* ─── Intake Leakage Calculator Component ─── */
function LeakageCalculator() {
  const [monthlyLeads, setMonthlyLeads] = useState(100)
  const [conversionRate, setConversionRate] = useState(25)
  const [avgCaseValue, setAvgCaseValue] = useState(5000)

  const leakageRate = 20 // Industry average
  const casesLost = Math.round((monthlyLeads * conversionRate * leakageRate) / 10000)
  const monthlyCost = casesLost * avgCaseValue
  const annualCost = monthlyCost * 12

  return (
    <div className="bg-gradient-to-br from-slate-50 to-cyan-50 border border-slate-200 rounded-lg p-8 mb-8">
      <h3 className="text-2xl font-bold text-slate-900 mb-6">Calculate Your Intake Leakage Cost</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Monthly Leads</label>
          <input
            type="range"
            min="10"
            max="500"
            value={monthlyLeads}
            onChange={(e) => setMonthlyLeads(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-2xl font-bold text-cyan-600 mt-2">{monthlyLeads}</div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Conversion Rate (%)
          </label>
          <input
            type="range"
            min="5"
            max="50"
            value={conversionRate}
            onChange={(e) => setConversionRate(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-2xl font-bold text-cyan-600 mt-2">{conversionRate}%</div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Avg Case Value</label>
          <input
            type="range"
            min="1000"
            max="25000"
            step="500"
            value={avgCaseValue}
            onChange={(e) => setAvgCaseValue(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-2xl font-bold text-cyan-600 mt-2">
            ${avgCaseValue.toLocaleString()}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg p-5 lg:p-6 border-l-4 border-red-500">
        <p className="text-xs lg:text-sm text-slate-600 mb-2">Your estimated monthly leakage:</p>
        <div className="text-3xl lg:text-4xl font-bold text-red-600 mb-2">
          ${monthlyCost.toLocaleString()}
        </div>
        <p className="text-xs lg:text-sm text-slate-600">
          That's <strong>${annualCost.toLocaleString()}</strong> per year in lost cases.
        </p>
      </div>
    </div>
  )
}

/* ─── Mid-Article CTA Component ─── */
function MidArticleCTA({ depth, cta }: { depth: number; cta?: any }) {
  const [showModal, setShowModal] = useState(false)
  const [showCalculator, setShowCalculator] = useState(false)

  if (depth < 30) return null

  if (showCalculator) {
    return <LeakageCalculator />
  }

  const heading =
    cta?.heading ||
    (depth >= 80
      ? "Your Firm's Intake Audit is Waiting"
      : depth >= 60
        ? 'See Your Intake Leakage in Real Numbers'
        : 'Stop Losing Cases to Intake Leakage')

  const body =
    cta?.body ||
    (depth >= 80
      ? "You've read this far. You care about fixing this. Let's show you exactly where your firm is leaking value."
      : depth >= 60
        ? "Most firms don't know their actual leakage cost. We'll calculate yours in 5 minutes."
        : 'You just read about the problem. Now fix it. The firms that moved fastest on intake optimization saw 30-40% improvement in case retention within 90 days.')

  const primaryLabel =
    cta?.primaryLabel ||
    (depth >= 80
      ? 'Get Your Free Audit →'
      : depth >= 60
        ? 'Calculate Your Leakage →'
        : 'See How CasePort Works →')

  const primaryHref = cta?.primaryHref

  const secondaryLabel = cta?.secondaryLabel || 'Download Worksheet'
  const secondaryHref = cta?.secondaryHref

  return (
    <>
      <section
        id="mid-cta"
        data-reveal
        className="mb-32 transition-all duration-700 opacity-100 translate-y-0"
      >
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-8 lg:p-12 text-white border border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-300">
          <h3 className="text-2xl sm:text-3xl font-bold mb-4">{heading}</h3>
          <p className="text-base sm:text-lg text-gray-300 mb-6 lg:mb-8 leading-relaxed">{body}</p>
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
            {primaryHref ? (
              <a
                href={primaryHref}
                className="inline-block text-center w-full sm:w-auto px-6 py-4 lg:px-8 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105"
              >
                {primaryLabel}
              </a>
            ) : (
              <button
                onClick={() => setShowModal(true)}
                className="inline-block text-center w-full sm:w-auto px-6 py-4 lg:px-8 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105"
              >
                {primaryLabel}
              </button>
            )}
            {(secondaryHref || depth >= 60) &&
              (secondaryHref ? (
                <a
                  href={secondaryHref}
                  target={secondaryHref.startsWith('http') ? '_blank' : undefined}
                  rel={secondaryHref.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="inline-flex items-center justify-center content-center w-full sm:w-auto px-6 py-4 lg:px-8 border-2 border-cyan-400 text-cyan-300 font-semibold rounded-lg hover:bg-cyan-500/10 transition-all duration-300"
                >
                  <Download size={18} className="mr-2 flex-shrink-0" />
                  <span className="whitespace-nowrap">{secondaryLabel}</span>
                </a>
              ) : (
                <button
                  onClick={() => setShowCalculator(true)}
                  className="inline-flex items-center justify-center content-center w-full sm:w-auto px-6 py-4 lg:px-8 border-2 border-cyan-400 text-cyan-300 font-semibold rounded-lg hover:bg-cyan-500/10 transition-all duration-300"
                >
                  <Download size={18} className="mr-2 flex-shrink-0" />
                  <span className="whitespace-nowrap">{secondaryLabel}</span>
                </button>
              ))}
          </div>
        </div>
      </section>
      {showModal && <TieredCTAModal depth={depth} onClose={() => setShowModal(false)} />}
    </>
  )
}

type NavLink = { label: string; href: string; openInNewTab?: boolean }

export default function ArticleClient({
  article,
  navLinks = [],
  ctaLabel,
  ctaHref,
}: {
  article: any
  navLinks?: NavLink[]
  ctaLabel?: string
  ctaHref?: string
}) {
  const [activeSection, setActiveSection] = useState<string>('')
  const [heroScroll, setHeroScroll] = useState(0)
  const revealed = useScrollReveal()
  const readingDepth = useReadingDepth()

  // Create formatted content based on Payload CMS output
  const content = useMemo(() => {
    if (!article) return {}

    // Convert Payload Lexical content into the expected format
    const title = article.title
    const author = article.author?.name || 'Martha Bennett'
    const authorRole = article.author?.title || 'Director of Operations'
    const authorBio =
      article.author?.bio ||
      `${author} is a ${authorRole}. With deep expertise in personal injury law operations, she has advised 50+ firms on intake optimization and case acquisition strategy.`
    const readTime = `${article.estimatedReadTime || 8} min read`
    const date = article.publishedAt || new Date().toISOString()

    // Safely extract headings for TOC
    const sections: any[] = []
    if (article.content?.root?.children) {
      article.content.root.children.forEach((n: any) => {
        if (n.type === 'heading' && n.tag === 'h2' && n.children?.[0]?.text) {
          sections.push({ heading: n.children[0].text })
        }
      })
    }

    return {
      title,
      author,
      authorRole,
      authorBio,
      readTime,
      date,
      updatedDate: article.updatedAt || date,
      sections,
    }
  }, [article])

  const datePublished = content?.date || new Date().toISOString()
  const dateModified = content?.updatedDate || datePublished
  const authorBio = content?.authorBio || ''
  const relatedArticles: any[] = article?.relatedArticles || []
  const articleUrl = `https://www.caseport.io/insights/${article?.slug}`

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('[data-section]')
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect()
        if (rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
          setActiveSection(section.id)
        }
      })
      setHeroScroll(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!article || !content) {
    return <div>Article not found</div>
  }

  return (
    <>
      <ArticleStructuredData
        article={article}
        content={content}
        url={articleUrl}
        datePublished={datePublished}
        dateModified={dateModified}
      />
      <Navbar variant="editorial" navLinks={navLinks} ctaLabel={ctaLabel} ctaHref={ctaHref} />
      <ReadingProgress />
      <BackToTop />

      {/* ─── HERO SECTION ─── */}
      <div className="relative bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 overflow-hidden">
        {/* Atmospheric orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute top-1/2 -left-40 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: '2s' }}
          />
        </div>

        {/* Hero image background with parallax */}
        <div
          className="absolute inset-0 opacity-40 transition-transform duration-300"
          style={{
            backgroundImage: `url('${article?.thumbnail || article?.heroImage?.url}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `translateY(${heroScroll * 0.5}px)`,
          }}
        />

        {/* Hero content */}
        <div className="relative z-10 container mx-auto px-6 lg:px-12 py-24 lg:py-48 mt-16 lg:mt-0 max-w-full overflow-hidden">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-10 lg:mb-12 text-xs lg:text-sm text-gray-400 flex-wrap">
            <Link href="/insights" className="hover:text-cyan-300 transition-colors">
              Insights
            </Link>
            <ChevronRight size={16} />
            <span>
              {typeof article?.category === 'object'
                ? article?.category?.title
                : article?.category || 'Insight'}
            </span>
          </div>

          {/* Category badge */}
          <div className="inline-block mb-8">
            <span className="px-4 py-2 bg-cyan-500/20 text-cyan-300 rounded-full text-sm font-semibold border border-cyan-500/30 backdrop-blur-sm">
              {(typeof article?.category === 'object'
                ? article?.category?.title
                : article?.category || 'Insight'
              )?.toUpperCase()}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 lg:mb-8 leading-tight max-w-4xl tracking-tight break-words">
            {content?.title || article?.title}
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 mb-12 lg:mb-16 max-w-2xl leading-relaxed">
            {article?.subtitle}
          </p>

          {/* Trust Signals + Author Meta */}
          <div className="space-y-6 pt-8 border-t border-white/10">
            {/* Trust Badges Row */}
            <div className="flex flex-wrap gap-3 lg:gap-4 text-xs text-gray-300">
              <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-full backdrop-blur-sm border border-white/10">
                <Eye size={14} className="text-cyan-400" />
                <span>1,247 reading now</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-full backdrop-blur-sm border border-white/10">
                <Award size={14} className="text-cyan-400" />
                <span>Cited by 47 firms</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-white/5 rounded-full backdrop-blur-sm border border-white/10">
                <TrendingUp size={14} className="text-cyan-400" />
                <span>Signal Strength: 94/100</span>
              </div>
            </div>

            {/* Author Meta + Share */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 lg:gap-8 mt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg lg:text-xl flex-shrink-0">
                  {content?.author
                    ?.split(' ')
                    .map((n: string) => n[0])
                    .join('') || 'MK'}
                </div>
                <div>
                  <div className="font-semibold text-white text-base lg:text-lg">
                    {content?.author}
                  </div>
                  <div className="text-xs lg:text-sm text-gray-400">{content?.authorRole}</div>
                  <div className="text-[10px] lg:text-xs text-cyan-300 mt-1">
                    Advisor to 50+ PI firms
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 lg:gap-6 text-xs lg:text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{new Date(datePublished).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  <span>8 min read</span>
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCw size={16} />
                  <span>Updated {new Date(dateModified).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Share buttons */}
          <div className="flex items-center gap-4 mt-8 pt-8 border-t border-white/10">
            <span className="text-sm text-gray-400">Share:</span>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${articleUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-white/5 hover:bg-blue-500/20 text-gray-400 hover:text-blue-300 transition-all duration-300 hover:scale-110"
              title="Share on LinkedIn"
            >
              <FaLinkedin size={18} />
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${articleUrl}&text=${content?.title}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-white/5 hover:bg-blue-400/20 text-gray-400 hover:text-blue-300 transition-all duration-300 hover:scale-110"
              title="Share on X"
            >
              <FaTwitter size={18} />
            </a>
            <button
              onClick={() => {
                navigator.clipboard.writeText(articleUrl)
              }}
              className="p-2 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-gray-400 hover:text-cyan-300 transition-all duration-300 hover:scale-110"
              title="Copy link"
            >
              <LinkIcon size={18} />
            </button>
          </div>
        </div>

        {/* Scroll indicator at bottom of hero */}
        <ScrollIndicator />
      </div>

      {/* ─── ARTICLE BODY (WHITE SECTION) ─── */}
      <div className="bg-white">
        <div className="container mx-auto px-6 lg:px-12 py-16 lg:py-40">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            {/* Main reading column */}
            <div className="flex-1 max-w-[720px] mx-auto w-full">
              {/* Executive Summary - Minimal Premium Styling */}
              <section
                id="executive-summary"
                data-section
                data-reveal
                className={`mb-32 transition-all duration-700 ${
                  revealed.has('executive-summary')
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
              >
                <div className="border-l-4 border-cyan-500 pl-8 py-4">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Executive Summary</h2>
                  <p className="text-lg text-slate-700 leading-relaxed mb-6">
                    {article?.executiveSummary}
                  </p>
                  <div className="flex items-start gap-3 pt-6 border-t border-slate-200">
                    <Lightbulb className="text-cyan-600 flex-shrink-0 mt-1" size={18} />
                    <p className="text-sm text-slate-600">
                      <strong>Key Insight:</strong> Understanding where value gets lost is the first
                      step to fixing it.
                    </p>
                  </div>
                </div>
              </section>
              {/* Key Takeaways */}
              <section
                id="key-takeaways"
                data-section
                data-reveal
                className={`mb-32 transition-all duration-700 ${
                  revealed.has('key-takeaways')
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
              >
                <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-12">
                  Key Takeaways
                </h2>
                <ul className="space-y-4">
                  {article?.keyTakeaways?.map((takeaway: any, idx: number) => (
                    <li
                      key={idx}
                      className="flex items-start gap-4 p-6 bg-slate-50 rounded-lg border border-slate-200/50 hover:border-cyan-300/50 hover:bg-cyan-50/30 transition-all duration-300 hover:shadow-md"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <CheckCircle2 className="text-cyan-600 flex-shrink-0 mt-1" size={20} />
                      <span className="text-slate-700 leading-relaxed">
                        {typeof takeaway === 'object' ? takeaway?.takeaway : takeaway}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
              {/* Article Content */}
              <div className="article-body mb-32 transition-all duration-700 opacity-100 translate-y-0">
                <CustomRichText content={article.content} />
              </div>
              {/* Mid-Article CTA - Tiered Based on Reading Depth */}
              <MidArticleCTA depth={useReadingDepth()} cta={article?.midArticleCta} />
              {/* FAQ Section */}
              <section
                id="faq"
                data-section
                data-reveal
                className={`mb-32 transition-all duration-700 ${
                  revealed.has('faq') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-12">
                  Frequently Asked Questions
                </h2>
                <Accordion type="single" collapsible className="space-y-4">
                  {article?.faqs?.map((item: any, idx: number) => (
                    <AccordionItem
                      key={idx}
                      value={`faq-${idx}`}
                      className="border border-slate-200 rounded-lg px-6 data-[state=open]:bg-cyan-50 transition-colors duration-300"
                    >
                      <AccordionTrigger className="text-lg font-semibold text-slate-900 hover:text-cyan-600 transition-colors py-4">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-slate-700 leading-relaxed pb-4">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
              {/* Cite This Research */}
              <section
                id="cite"
                data-reveal
                className={`mb-32 transition-all duration-700 ${
                  revealed.has('cite') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-8">
                  <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Lock size={20} className="text-cyan-600" />
                    Cite This Research
                  </h3>
                  <p className="text-sm text-slate-600 mb-4">
                    Use this citation format when referencing this article:
                  </p>
                  <div className="bg-white p-4 rounded border border-slate-200 mb-4 font-mono text-sm text-slate-700">
                    {article?.citation ||
                      `${content?.author
                        ?.split(' ')
                        .map((n: string, i: number, a: string[]) =>
                          i === a.length - 1 ? n[0] + '.' : n,
                        )
                        .join(
                          ' ',
                        )} (${new Date(article?.publishedAt || '').getFullYear() || new Date().getFullYear()}). ${article?.title}. CasePort Insights.`}
                  </div>
                  <button
                    onClick={() => {
                      const text =
                        article?.citation ||
                        `${content?.author
                          ?.split(' ')
                          .map((n: string, i: number, a: string[]) =>
                            i === a.length - 1 ? n[0] + '.' : n,
                          )
                          .join(
                            ' ',
                          )} (${new Date(article?.publishedAt || '').getFullYear() || new Date().getFullYear()}). ${article?.title}. CasePort Insights.`
                      navigator.clipboard.writeText(text)
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition-colors"
                  >
                    <Copy size={16} />
                    Copy Citation
                  </button>
                </div>
              </section>
              {/* Author Bio - Enhanced Credibility */}
              <section
                id="author-bio"
                data-reveal
                className={`mb-32 transition-all duration-700 ${
                  revealed.has('author-bio')
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
              >
                <div className="bg-gradient-to-r from-slate-50 to-cyan-50 border border-slate-200 rounded-lg p-6 lg:p-8">
                  <div className="flex flex-col sm:flex-row gap-6 mb-8">
                    {/* Avatar */}
                    {article?.author?.avatar?.url ? (
                      <img
                        src={article.author.avatar.url}
                        alt={content?.author}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 sm:mb-2 gap-3 sm:gap-0">
                        <div>
                          <h3 className="text-xl font-bold text-slate-900">{content?.author}</h3>
                          <p className="text-sm text-slate-600">{content?.authorRole}</p>
                        </div>
                        {/* Badges from CMS */}
                        {article?.author?.badges?.length > 0 && (
                          <div className="flex gap-2 flex-wrap">
                            {article.author.badges.map((b: any, i: number) => (
                              <span
                                key={i}
                                className="px-3 py-1 bg-cyan-100 text-cyan-700 text-xs font-semibold rounded-full"
                              >
                                {b.label}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <p className="text-slate-700 leading-relaxed mb-4">{authorBio}</p>

                      {/* Credentials from CMS */}
                      {article?.author?.credentials?.length > 0 && (
                        <div
                          className={`grid grid-cols-2 sm:grid-cols-${Math.min(article.author.credentials.length, 3)} gap-4 mb-6 py-4 border-y border-slate-200`}
                        >
                          {article.author.credentials.map((c: any, i: number) => (
                            <div
                              key={i}
                              className={
                                article.author.credentials.length % 3 !== 0 &&
                                i === article.author.credentials.length - 1
                                  ? 'col-span-2 sm:col-span-1'
                                  : ''
                              }
                            >
                              <div className="text-xl sm:text-2xl font-bold text-cyan-600">
                                {c.value}
                              </div>
                              <div className="text-xs text-slate-600">{c.label}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* CMS-driven author CTA buttons */}
                      {article?.author?.ctaButtons?.length > 0 && (
                        <div className="flex flex-col sm:flex-row gap-3">
                          {article.author.ctaButtons.map((btn: any, i: number) => (
                            <a
                              key={i}
                              href={btn.href}
                              target={btn.href?.startsWith('http') ? '_blank' : undefined}
                              rel={btn.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                              className={
                                btn.style === 'secondary'
                                  ? 'flex items-center justify-center gap-2 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors font-medium text-sm'
                                  : 'flex items-center justify-center gap-2 px-4 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium text-sm'
                              }
                            >
                              {btn.style === 'secondary' ? (
                                <ExternalLink size={16} />
                              ) : (
                                <MessageSquare size={16} />
                              )}
                              {btn.label}
                            </a>
                          ))}
                        </div>
                      )}
                      {/* Hardcoded buttons — commented out, replaced by CMS ctaButtons above */}
                      {/* <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={() => toast.success(`Email sent to ${content?.author}.`)}
                          className="flex items-center justify-center gap-2 px-4 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors font-medium text-sm"
                        >
                          <MessageSquare size={16} />
                          Ask {content?.author?.split(' ')[0]} a Question
                        </button>
                        {article?.author?.profileUrl && (
                          <a
                            href={article.author.profileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors font-medium text-sm"
                          >
                            <ExternalLink size={16} />
                            View {content?.author?.split(' ')[0]}'s Profile
                          </a>
                        )}
                      </div> */}
                    </div>
                  </div>
                </div>
              </section>
              {/* Continue Reading */}
              <section
                id="continue-reading"
                data-section
                data-reveal
                className={`mb-32 transition-all duration-700 ${
                  revealed.has('continue-reading')
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
              >
                <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-12">
                  Continue Reading
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {relatedArticles.slice(0, 2).map((relatedArticle: any, idx: number) => (
                    <Link
                      key={idx}
                      href={`/insights/${relatedArticle.slug}`}
                      className="group block p-6 bg-slate-50 border border-slate-200 rounded-lg hover:border-cyan-300 hover:bg-cyan-50/30 hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <div className="mb-4 h-40 bg-gradient-to-br from-slate-200 to-slate-300 rounded overflow-hidden">
                        {relatedArticle.heroImage?.url && (
                          <img
                            src={relatedArticle.heroImage.url}
                            alt={relatedArticle.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        )}
                      </div>
                      <span className="inline-block px-3 py-1 bg-cyan-100 text-cyan-700 text-xs font-semibold rounded-full mb-3">
                        {typeof relatedArticle.category === 'object'
                          ? relatedArticle.category?.title
                          : relatedArticle.category}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-cyan-600 transition-colors">
                        {relatedArticle.title}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {relatedArticle.publishedAt
                          ? new Date(relatedArticle.publishedAt).toLocaleDateString()
                          : ''}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
              {/* Comparison Table - Leakage vs. No Leakage
              <section
                id="comparison"
                data-reveal
                className={`mb-32 transition-all duration-700 ${
                  revealed.has('comparison')
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
              >
                <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-12">
                  The Financial Impact
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-100 border-b-2 border-slate-300">
                        <th className="px-6 py-4 text-left font-bold text-slate-900">Metric</th>
                        <th className="px-6 py-4 text-center font-bold text-red-600">
                          With Leakage
                        </th>
                        <th className="px-6 py-4 text-center font-bold text-cyan-600">
                          Fixed Intake
                        </th>
                        <th className="px-6 py-4 text-center font-bold text-green-600">
                          Annual Gain
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-slate-900">Monthly Leads</td>
                        <td className="px-6 py-4 text-center text-slate-700">100</td>
                        <td className="px-6 py-4 text-center text-slate-700">100</td>
                        <td className="px-6 py-4 text-center text-slate-700">—</td>
                      </tr>
                      <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-slate-900">Conversion Rate</td>
                        <td className="px-6 py-4 text-center text-red-600 font-semibold">20%</td>
                        <td className="px-6 py-4 text-center text-cyan-600 font-semibold">28%</td>
                        <td className="px-6 py-4 text-center text-slate-700">+8%</td>
                      </tr>
                      <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-slate-900">Monthly Cases</td>
                        <td className="px-6 py-4 text-center text-red-600 font-semibold">20</td>
                        <td className="px-6 py-4 text-center text-cyan-600 font-semibold">28</td>
                        <td className="px-6 py-4 text-center text-green-600 font-bold">+96/year</td>
                      </tr>
                      <tr className="border-b border-slate-200 hover:bg-slate-50 transition-colors bg-slate-50">
                        <td className="px-6 py-4 font-bold text-slate-900">
                          Annual Revenue (@ $5k/case)
                        </td>
                        <td className="px-6 py-4 text-center text-red-600 font-bold">$1.2M</td>
                        <td className="px-6 py-4 text-center text-cyan-600 font-bold">$1.68M</td>
                        <td className="px-6 py-4 text-center text-green-600 font-bold">+$480K</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-slate-600 mt-6 text-center">
                  *Based on industry benchmarks. Your results may vary based on market, practice
                  area, and current intake process efficiency.
                </p>
              </section> */}
              {/* Final CTA - High Urgency Dan Lok Voice
              <section
                id="final-cta"
                data-reveal
                className={`mb-32 transition-all duration-700 ${
                  revealed.has('final-cta')
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
              >
                <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 rounded-xl p-12 text-white border border-cyan-500/30">
                  <h3 className="text-3xl lg:text-4xl font-bold mb-4">
                    Every Day You Don't Fix Your Intake, You're Leaving $480K on the Table.
                  </h3>
                  <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                    The question is not whether intake leakage exists in your firm. It does. The
                    question is: how much longer can you afford to wait?
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => {
                        const modal = document.getElementById('tiered-cta-modal')
                        if (modal) (modal as any).showModal?.()
                      }}
                      className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105 text-center"
                    >
                      Get Your Free Audit →
                    </button>
                    <Link
                      href="/insights"
                      className="px-8 py-4 border-2 border-cyan-400 text-cyan-300 font-semibold rounded-lg hover:bg-cyan-500/10 transition-all duration-300 text-center"
                    >
                      Schedule a Demo
                    </Link>
                  </div>
                </div>
              </section> */}

              {/* Newsletter CTA - With Social Proof */}
              <section
                id="newsletter"
                data-reveal
                className={`mb-32 transition-all duration-700 ${
                  revealed.has('newsletter')
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
              >
                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-lg p-6 lg:p-8">
                  <h3 className="text-xl lg:text-2xl font-bold text-slate-900 mb-2 lg:mb-4">
                    Get Weekly Insights
                  </h3>
                  <p className="text-sm lg:text-base text-slate-700 mb-6">
                    Join 2,400+ personal injury operators who get our weekly brief on case
                    acquisition, intake optimization, and market signals.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    {/* <input
                      type="email"
                      placeholder="Enter your email"
                      className="w-full sm:flex-1 px-4 py-3 rounded-lg border border-cyan-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    /> */}
                    <button
                      // onClick={() => toast.success('Welcome to the brief.')}
                      className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-105 whitespace-nowrap"
                    >
                      <a href="/intelligence">Subscribe Free</a>
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 text-center sm:text-left">
                    ✓ No spam. Unsubscribe anytime. Next brief: Tuesday 9am EST.
                  </p>
                </div>
              </section>
            </div>

            {/* Sidebar (Desktop only) */}
            <aside className="hidden lg:block w-72 flex-shrink-0">
              {/* Sticky TOC - Bold & Animated */}
              <div
                className="sticky top-24 bg-gradient-to-br from-slate-900 to-slate-800 border border-cyan-500/30 rounded-lg p-6 shadow-lg shadow-cyan-500/10 animate-fade-in"
                style={{ animationDelay: '0.2s' }}
              >
                <h4 className="text-base font-black text-white mb-6 uppercase tracking-widest flex items-center gap-2">
                  <div className="w-1 h-5 bg-gradient-to-b from-cyan-400 to-cyan-600 rounded-full" />
                  On This Page
                </h4>
                <nav className="space-y-2">
                  {content?.sections?.map((section: any, idx: number) => {
                    const sectionId = section.heading?.toLowerCase().replace(/\s+/g, '-')
                    const isActive = activeSection === sectionId
                    return (
                      <a
                        key={idx}
                        href={`#${sectionId}`}
                        className={`group flex items-start gap-3 px-4 py-3 rounded-lg transition-all duration-300 relative overflow-hidden ${
                          isActive
                            ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                            : 'text-slate-300 hover:text-cyan-300 hover:bg-slate-800/50'
                        }`}
                      >
                        {/* Animated left border */}
                        <div
                          className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-cyan-600 transition-all duration-300 ${
                            isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                          }`}
                        />

                        {/* Checkmark indicator */}
                        <div
                          className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                            isActive
                              ? 'border-cyan-400 bg-cyan-500/30'
                              : 'border-slate-500 group-hover:border-cyan-400'
                          }`}
                        >
                          {isActive && <Check size={12} className="text-cyan-300" />}
                        </div>

                        {/* Link text */}
                        <span className="text-sm font-medium leading-tight group-hover:translate-x-1 transition-transform duration-300">
                          {section.heading}
                        </span>
                      </a>
                    )
                  })}
                </nav>
              </div>

              {/* Subscribe Widget - With Save Article */}
              <div className="mt-8 space-y-4">
                <div className="bg-gradient-to-b from-cyan-50 to-blue-50 border border-cyan-200 rounded-lg p-6">
                  <h4 className="text-lg font-bold text-slate-900 mb-3">Subscribe Free</h4>
                  <p className="text-sm text-slate-600 mb-4">
                    Get weekly insights on case acquisition and intake optimization.
                  </p>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 rounded border border-cyan-200 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <button
                    onClick={() => toast.success('Added to your library.')}
                    className="w-full px-3 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-semibold rounded hover:shadow-lg hover:shadow-cyan-500/50 transition-all duration-300"
                  >
                    Subscribe
                  </button>
                </div>
                <button
                  onClick={() => toast.success('Article saved to your library.')}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 font-medium rounded-lg transition-colors"
                >
                  <Bookmark size={18} />
                  Save Article
                </button>
              </div>

              {/* Related Reading */}
              <div className="mt-8 bg-slate-50 border border-slate-200 rounded-lg p-6">
                <h4 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wide">
                  Related Reading
                </h4>
                <ul className="space-y-3">
                  {relatedArticles.slice(0, 3).map((relatedSlug: string, idx: number) => {
                    const relatedArticle = articles.find((a) => a.slug === relatedSlug)
                    return relatedArticle ? (
                      <li key={idx}>
                        <Link
                          href={`/insights/${relatedSlug}`}
                          className="text-sm text-slate-600 hover:text-cyan-600 transition-colors line-clamp-2"
                        >
                          {relatedArticle.title}
                        </Link>
                      </li>
                    ) : null
                  })}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
