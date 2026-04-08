'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  CheckCircle2,
  Circle,
  Zap,
  Target,
  TrendingUp,
  Shield,
  Award,
  Mail,
  Lock,
} from 'lucide-react'

/**
 * CasePort Intelligence Page - Focused Capture Asset
 *
 * A private intelligence capture page, not a homepage clone.
 * Conversion mechanism: seriousness, selectivity, editorial quality.
 *
 * Stripped header/footer (no multi-link nav clutter).
 * Beehiiv-ready signup with segmented fields.
 * Strong sample memo micro-commitment path.
 * Selective-access cues throughout.
 * Soft bridge to Request Private Access.
 */
export default function IntelligencePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({ email: '', role: '', market: '' })
  const [showSampleModal, setShowSampleModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.email || !formData.role || !formData.market) {
      setSubmitError('Please fill in all fields')
      return
    }
    setIsSubmitting(true)
    setSubmitError('')
    try {
      const res = await fetch('/api/intelligence-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Subscription failed')
      }
      router.push('/intelligence/thank-you')
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const scrollToSignup = () => {
    document.getElementById('signup-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const scrollToArchive = () => {
    document.getElementById('archive-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* ── SCHEMA MARKUP ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: 'CasePort Intelligence',
            description:
              'Private intelligence briefings for personal injury law firms on case acquisition and signed-case performance',
            url: 'https://www.caseport.io/intelligence',
            brand: { '@type': 'Brand', name: 'CasePort' },
            offers: {
              '@type': 'Offer',
              priceCurrency: 'USD',
              price: '0',
              availability: 'https://schema.org/InStock',
            },
          }),
        }}
      />

      {/* ── STRIPPED HEADER ── */}
      <header className="border-b border-gray-800/50 sticky top-0 z-50 bg-background/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="font-bold text-lg text-white tracking-wider">CASEPORT</div>
          <button
            onClick={scrollToSignup}
            className="px-6 py-2 bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300 text-sm"
          >
            Get the Brief
          </button>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-grow">
        {/* SECTION 1: HERO */}
        <section className="relative pt-12 pb-12 md:pt-16 md:pb-16 px-4 md:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
              {/* Left: Headline + Subheadline + CTAs */}
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                  <span className="text-white">Weekly </span>
                  <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                    intelligence
                  </span>
                  <br />
                  <span className="text-white">for serious PI firms.</span>
                </h1>

                <div className="space-y-3 text-sm md:text-base leading-relaxed text-gray-400">
                  <p>
                    What separates firms that scale from firms that stall is rarely lead volume. It
                    is what happens after the inquiry lands.
                  </p>
                  <p>
                    CasePort Intelligence is a private weekly briefing for firms that want sharper
                    control over intake leakage, qualification, routing, recovery, and signed-case
                    conversion.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={scrollToSignup}
                    className="px-6 py-2.5 bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-semibold rounded-lg hover:shadow-2xl hover:shadow-cyan-500/40 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 text-sm"
                  >
                    Get the Brief
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowSampleModal(true)}
                    className="px-6 py-2.5 border border-gray-600 text-white font-semibold rounded-lg hover:border-cyan-400 hover:bg-cyan-400/10 hover:shadow-lg hover:shadow-cyan-400/20 transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 text-sm"
                  >
                    See a Sample Memo
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-gray-400 flex items-center gap-2 pt-1">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  For serious PI firms only. Review-first access.
                </p>
              </div>

              {/* Right: Premium Card */}
              <div className="relative">
                <div className="card-featured p-6 md:p-8 border-cyan-500/40 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300">
                  <div className="text-eyebrow mb-6 flex items-center gap-2">
                    <Lock className="w-3 h-3" />
                    BRIEFING MEMO
                  </div>

                  <h3 className="text-xl md:text-2xl font-bold text-white mb-6 leading-tight">
                    What Winning Firms Quietly Protect Better
                  </h3>

                  <div className="space-y-4 mb-6">
                    {[
                      {
                        title: 'Reduce intake leakage',
                        desc: 'Stop losing qualified leads to delays',
                      },
                      {
                        title: 'Improve qualification',
                        desc: 'Filter for real cases, not tire-kickers',
                      },
                      {
                        title: 'Protect signed cases',
                        desc: 'Control the entire case flow',
                      },
                    ].map((item) => (
                      <div key={item.title} className="flex gap-4 group">
                        <Circle className="w-2 h-2 mt-1.5 flex-shrink-0 text-cyan-400 fill-cyan-400 group-hover:scale-125 transition-transform duration-200" />
                        <div>
                          <p className="font-semibold text-white group-hover:text-cyan-300 transition-colors duration-200">
                            {item.title}
                          </p>
                          <p className="text-sm text-gray-400 mt-1">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setShowSampleModal(true)}
                    className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200 flex items-center gap-2 text-sm font-medium group bg-transparent border-0 cursor-pointer p-0"
                  >
                    Preview this week&#39;s memo
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: SIGNUP BLOCK */}
        <section
          id="signup-section"
          className="py-20 md:py-32 px-4 md:px-8 bg-gradient-to-b from-gray-900/50 to-transparent"
        >
          <div className="max-w-2xl mx-auto">
            <div className="card-featured p-8 md:p-12 border-cyan-500/40 shadow-lg shadow-cyan-500/15 hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300">
              <div className="text-eyebrow mb-4 flex items-center gap-2">
                <Mail className="w-3 h-3" />
                WEEKLY BRIEFING
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Get the weekly brief.
              </h2>

              <p className="text-gray-400 mb-8 text-base leading-relaxed">
                Join the firms getting operator-level intelligence on intake leakage, qualification,
                routing, recovery, and signed-case conversion. Every Friday.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-3">
                    Work email
                  </label>
                  <input
                    type="email"
                    placeholder="your@firm.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900/40 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 focus:bg-gray-900/60 transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-3">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900/40 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 focus:bg-gray-900/60 transition-all duration-200 cursor-pointer"
                    required
                  >
                    <option value="">Select your role</option>
                    <option value="owner">Firm Owner</option>
                    <option value="partner">Managing Partner</option>
                    <option value="intake">Intake Director</option>
                    <option value="ops">Operations Leader</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-200 mb-3">
                    Primary market
                  </label>
                  <select
                    value={formData.market}
                    onChange={(e) => setFormData({ ...formData, market: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900/40 border border-gray-500 rounded-lg text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 focus:bg-gray-900/60 transition-all duration-200 cursor-pointer"
                    required
                  >
                    <option value="">Select your practice area</option>
                    <option value="personal-injury">Personal Injury</option>
                    <option value="workers-comp">Workers Compensation</option>
                    <option value="medical-malpractice">Medical Malpractice</option>
                    <option value="product-liability">Product Liability</option>
                    <option value="premises-liability">Premises Liability</option>
                    <option value="auto-accidents">Auto Accidents</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-4 bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-semibold rounded-lg hover:shadow-2xl hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-105 active:scale-95 mt-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubmitting ? 'Subscribing…' : 'Get the Brief'}
                </button>

                {submitError && (
                  <p className="text-red-400 text-sm mt-3">{submitError}</p>
                )}
              </form>

              <div className="mt-8 pt-8 border-t border-gray-700 space-y-2 text-sm text-gray-400">
                <p>Review-first access. Built for serious PI firms.</p>
                <p>No fluff. No spam. No broad legal newsletter.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3: ARCHIVE */}
        <section id="archive-section" className="py-20 md:py-32 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              What winning firms quietly get right.
            </h2>

            <p className="text-gray-400 mb-16 text-lg leading-relaxed">
              The firms pulling away in this market are not just buying more attention. They are
              getting better at what happens next. They respond faster. They qualify harder. They
              route better. They recover what slower firms let decay. That is what this briefing is
              built to sharpen.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: 'Intake leakage',
                  desc: 'Where valuable case opportunities disappear before anyone notices.',
                  icon: Zap,
                  color: 'cyan',
                },
                {
                  title: 'Qualification discipline',
                  desc: 'How serious firms filter for real cases instead of chasing noise.',
                  icon: Target,
                  color: 'purple',
                },
                {
                  title: 'Routing control',
                  desc: 'How speed, fit, and process shape conversion after first contact.',
                  icon: TrendingUp,
                  color: 'cyan',
                },
                {
                  title: 'Recovery systems',
                  desc: 'How to reclaim opportunities that would have quietly gone cold.',
                  icon: Shield,
                  color: 'purple',
                },
              ].map((item) => {
                const Icon = item.icon
                const colorClass =
                  item.color === 'cyan' ? 'text-cyan-400' : 'text-purple-400'
                return (
                  <div
                    key={item.title}
                    className="card-default p-6 md:p-8 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 group border border-gray-700/50 hover:border-gray-600 cursor-pointer"
                  >
                    <div
                      className={`${colorClass} mb-4 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-3 group-hover:text-cyan-300 transition-colors duration-200">
                      {item.title}
                    </h4>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* SECTION 4: SAMPLE MEMO */}
        <section
          id="sample"
          className="py-20 md:py-32 px-4 md:px-8 bg-gradient-to-b from-background to-cyan-950/5"
        >
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              See the kind of intelligence you&#39;ll get.
            </h2>

            <div className="card-featured p-8 md:p-10 border-cyan-500/40 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 shadow-lg shadow-cyan-500/20 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 mt-12">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 leading-tight">
                The First 10 Minutes Quietly Decide More Than Most Firms Realize
              </h3>

              <div className="space-y-4 text-gray-400 mb-8">
                <p>Most firms think the fight starts with lead generation. It does not.</p>
                <p>
                  The real separation often begins in the first few minutes after the inquiry lands.
                  Speed alone is not enough. The winning firms combine speed with the right
                  follow-up structure, the right intake posture, and the right qualification
                  sequence.
                </p>
                <p>That is where signed-case economics start changing.</p>
              </div>

              <button
                onClick={() => setShowSampleModal(true)}
                className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200 flex items-center gap-2 text-sm font-medium group"
              >
                Read sample memo
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </button>

              <p className="text-xs text-gray-500 mt-6 pt-6 border-t border-gray-700">
                Short, practical, operator-focused. No fluff. No generic legal newsletter content.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 5: MARKET FRAME */}
        <section className="py-20 md:py-32 px-4 md:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Most firms look at the market backward.
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <div className="card-default p-8 border border-gray-700/50 bg-gray-900/20">
                <h4 className="text-lg font-semibold text-gray-300 mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gray-500 inline-block" />
                  What average firms focus on
                </h4>
                <ul className="space-y-3">
                  {[
                    'More lead volume',
                    'More ad spend',
                    'More vendors',
                    'More dashboards',
                    'More activity',
                  ].map((item) => (
                    <li key={item} className="text-gray-400 text-sm flex items-start gap-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-600 mt-1.5 flex-shrink-0 inline-block" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card-default p-8 border border-cyan-500/30 bg-gradient-to-br from-cyan-500/5 to-purple-500/5">
                <h4 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
                  What sharper firms focus on
                </h4>
                <ul className="space-y-3">
                  {[
                    'Faster qualified response',
                    'Tighter intake screening',
                    'Cleaner routing logic',
                    'Less case decay',
                    'Higher signed-case yield per inquiry',
                  ].map((item) => (
                    <li
                      key={item}
                      className="text-gray-300 text-sm flex items-start gap-3 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0 inline-block group-hover:scale-150 transition-transform duration-200" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="text-center text-gray-400 mt-12 text-lg leading-relaxed">
              Case growth gets more predictable when you stop treating every inquiry like the same
              asset.
            </p>
          </div>
        </section>

        {/* SECTION 6: WHO THIS IS FOR */}
        <section className="py-20 md:py-32 px-4 md:px-8 bg-gradient-to-b from-background to-purple-950/10">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Built for firms that think beyond raw lead volume.
            </h2>

            <p className="text-gray-400 mb-12 text-lg leading-relaxed">
              This is for firms that care about what happens after the click, after the call, after
              the form fill, and before the case is signed. If that does not describe your
              operation, this probably is not the right fit.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Firm owners and managing partners',
                  desc: 'Who want more control over case flow quality.',
                },
                {
                  title: 'Intake and operations leaders',
                  desc: 'Who want fewer leaks and better follow-through.',
                },
                {
                  title: 'Growth-minded PI firms',
                  desc: 'Who care about signed cases, not vanity metrics.',
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="card-default p-6 md:p-8 border border-gray-700/50 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 group cursor-pointer"
                >
                  <h4 className="text-lg font-semibold text-white mb-3 group-hover:text-cyan-300 transition-colors duration-200">
                    {item.title}
                  </h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 7: SELECTED BRIEFING MEMOS */}
        <section className="py-20 md:py-32 px-4 md:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Selected briefing memos.
            </h2>

            <p className="text-gray-400 mb-12 text-lg">
              A small archive of what we study, watch, and break down.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                {
                  title: 'Why good inquiries still fail to become signed cases',
                  icon: Award,
                },
                { title: 'The hidden cost of slow intake response', icon: Zap },
                {
                  title: 'How qualification discipline protects case economics',
                  icon: Shield,
                },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div
                    key={item.title}
                    className="card-default p-6 md:p-8 border border-gray-700/50 hover:border-cyan-400/50 hover:shadow-lg hover:shadow-cyan-500/15 transition-all duration-300 group cursor-pointer flex flex-col"
                  >
                    <Icon className="w-6 h-6 text-cyan-400 mb-4 group-hover:scale-110 transition-transform duration-300" />
                    <h4 className="text-base md:text-lg font-semibold text-white mb-4 leading-tight group-hover:text-cyan-300 transition-colors duration-200 flex-grow">
                      {item.title}
                    </h4>
                    <button
                      onClick={scrollToArchive}
                      className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200 flex items-center gap-2 text-sm font-medium group/link bg-transparent border-0 cursor-pointer p-0"
                    >
                      Read
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </button>
                  </div>
                )
              })}
            </div>

            <div className="text-center">
              <button
                onClick={scrollToArchive}
                className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors duration-200 font-medium group bg-transparent border-0 cursor-pointer p-0"
              >
                Browse selected memos
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
              <p className="text-xs text-gray-500 mt-4">
                Public archive is limited. Full intelligence goes to subscribers.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 8: BRIDGE TO CASEPORT */}
        <section className="py-20 md:py-32 px-4 md:px-8 bg-gradient-to-b from-background to-cyan-950/5">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Some firms read. Others decide to move.
            </h2>

            <div className="space-y-6 text-gray-400 mb-12">
              <p className="text-lg">Intelligence sharpens how you think.</p>
              <p>
                CasePort is for firms that want more than insight. It is for firms that want more
                control over case acquisition, qualification, routing, and recovery.
              </p>
              <p>If that is where you are headed, there is a next step.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/request-access')}
                className="px-8 py-3 bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-semibold rounded-lg hover:shadow-2xl hover:shadow-cyan-500/40 transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
              >
                Request Private Access
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => router.push('/')}
                className="px-8 py-3 border border-cyan-400 text-cyan-400 font-semibold rounded-lg hover:bg-cyan-400/10 hover:shadow-lg hover:shadow-cyan-400/20 transition-all duration-300 flex items-center justify-center gap-2 active:scale-95"
              >
                Learn how CasePort works
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-gray-500 mt-8 text-center">
              Applications are reviewed manually. Not all firms are accepted.
            </p>
          </div>
        </section>

        {/* SECTION 9: FINAL CLOSE */}
        <section className="py-20 md:py-32 px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Sharper firms protect more value.
            </h2>

            <div className="space-y-6 text-gray-400 mb-12">
              <p className="text-lg leading-relaxed">
                The market does not reward the firms that know the most. It rewards the firms that
                respond better, qualify better, and let less value slip through the cracks.
              </p>
              <p className="text-base leading-relaxed">
                Get the brief. Stay sharper. Move earlier.
              </p>
            </div>

            <button
              onClick={scrollToSignup}
              className="px-8 py-3 bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-semibold rounded-lg hover:shadow-2xl hover:shadow-cyan-500/40 transition-all duration-300 inline-flex items-center justify-center gap-2 hover:scale-105 active:scale-95"
            >
              Get the Brief
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-sm text-gray-500 mt-8">For serious PI firms only.</p>
          </div>
        </section>
      </main>

      {/* ── MINIMAL FOOTER ── */}
      <footer className="border-t border-gray-800/50 bg-background/50 mt-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <p>&copy; 2026 CasePort. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-gray-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-gray-400 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-gray-400 transition-colors">
                Compliance
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* ── SAMPLE MEMO MODAL ── */}
      {showSampleModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-cyan-500/40 rounded-lg max-w-2xl w-full p-8 md:p-12 shadow-2xl shadow-cyan-500/20">
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="text-eyebrow mb-2">SAMPLE MEMO</div>
                <h3 className="text-2xl md:text-3xl font-bold text-white">The First 10 Minutes</h3>
              </div>
              <button
                onClick={() => setShowSampleModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-gray-400 mb-8">
              <p>Most firms think the fight starts with lead generation. It does not.</p>
              <p>
                The real separation often begins in the first few minutes after the inquiry lands.
                Speed alone is not enough. The winning firms combine speed with the right follow-up
                structure, the right intake posture, and the right qualification sequence.
              </p>
              <p>That is where signed-case economics start changing.</p>
              <p>
                The firms that move fastest on qualified inquiries are not necessarily the ones with
                the most leads. They are the ones with the tightest intake process. They have
                pre-qualified their own team. They know exactly what they are looking for. They have
                a response protocol that does not break under pressure.
              </p>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-500">Want the full briefing? Subscribe below.</p>
              <button
                onClick={() => setShowSampleModal(false)}
                className="w-full px-6 py-3 bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/40 transition-all duration-300"
              >
                Subscribe to Intelligence
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
