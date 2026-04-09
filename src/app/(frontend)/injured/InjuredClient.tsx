'use client'

import SecureCaseCheckForm from '@/components/SecureCaseCheckForm'
import {
  AlertTriangle,
  ArrowRight,
  Bike,
  Camera,
  Car,
  CheckCircle,
  ChevronDown,
  Clock,
  FileText,
  Heart,
  Lock,
  MessageCircle,
  Phone,
  Shield,
  Truck,
  User,
  Users,
  Zap,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import './injured.css'

/**
 * CasePort B2C Injured Claimant Page — WORLDCLASS COLOR RHYTHM v3
 *
 * FIX LOG:
 *   FIX 1: Removed ALL gradient bridge divs — replaced with clean 1px border separators
 *           (no more "thick black smear" bleeding into warm sections)
 *   FIX 2: Stone section darkened from #EDE8DE → #E0D9CC (visually distinct at scroll speed)
 *   FIX 3: Timeline cards (Section 5) now max-w-4xl full-width; Document cards wider
 *   FIX 4: Hero interface card gets stronger radial glow (opacity 0.12 → 0.18)
 *   FIX 5: All section icons upgraded to 56px minimum (was 24-28px)
 *
 * Section Cadence:
 *   1. DARK  → Hero (#0F1419)
 *   2. IVORY → Emergency Strip + How CasePort Helps (#FAF7F2)
 *   3. STONE → Common Situations (#E0D9CC) ← DARKER now
 *   4. CREAM → What To Do (#F7F3EC)
 *   5. DARK  → Secure Case Check (#0F1419)
 *   6. SAND  → Documents (#F2EDE4)
 *   7. IVORY → Trust (#FAF7F2)
 *   8. WARM WHITE → FAQ (#FDFBF7)
 *   9. DARK  → Final CTA (#0F1419)
 *  10. DARK  → Footer (#0A0E14)
 */

export default function Home() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [visibleSections, setVisibleSections] = useState<number[]>([1])
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [showMobileCtaBar, setShowMobileCtaBar] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('[data-section]')
      sections.forEach((section) => {
        const id = parseInt(section.getAttribute('data-section') || '0')
        const rect = section.getBoundingClientRect()
        if (rect.top < window.innerHeight * 0.8) {
          setVisibleSections((prev) => Array.from(new Set([...prev, id])))
        }
      })

      // Show mobile CTA bar after scrolling past hero (section 1)
      const heroSection = document.querySelector("[data-section='1']")
      if (heroSection) {
        const heroRect = heroSection.getBoundingClientRect()
        setShowMobileCtaBar(heroRect.bottom < 0)
      }
    }
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const openForm = () => setIsFormOpen(true)

  // ── Hero preview card animation ──────────────────────────────────────────────
  // Cycles through 5 phases, each with a question + answer chips.
  // Progress bar fills smoothly. Active chip "selects" after a short pause.
  // Full loop: ~18 seconds, then restarts from phase 1.
  const previewPhases = [
    {
      phase: 0,
      label: 'Accident',
      question: 'Where did the accident happen?',
      chips: ['California', 'Arizona', 'Nevada', 'Texas'],
      answer: 0,
    },
    {
      phase: 1,
      label: 'Treatment',
      question: 'Did you receive medical treatment?',
      chips: ['Yes, same day', 'Yes, within a week', 'Not yet', 'Unsure'],
      answer: 0,
    },
    {
      phase: 2,
      label: 'Fit',
      question: 'Do you currently have legal representation?',
      chips: ['No', 'Yes', 'Not sure'],
      answer: 0,
    },
    {
      phase: 3,
      label: 'Documents',
      question: 'Do you have any documents to upload?',
      chips: ['Photos', 'Police report', 'Medical records', 'None yet'],
      answer: 3,
    },
    {
      phase: 4,
      label: 'Contact',
      question: 'How would you prefer to be contacted?',
      chips: ['Phone call', 'Text message', 'Email'],
      answer: 0,
    },
  ]

  const [previewPhaseIdx, setPreviewPhaseIdx] = useState(0)
  const [previewProgress, setPreviewProgress] = useState(10)
  const [previewSelectedChip, setPreviewSelectedChip] = useState<number | null>(null)
  const [previewTransitioning, setPreviewTransitioning] = useState(false)
  const previewTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // Step 1: Show question (no chip selected yet)
    setPreviewSelectedChip(null)
    setPreviewTransitioning(false)
    const targetProgress = ((previewPhaseIdx + 1) / 5) * 100
    setPreviewProgress(targetProgress)

    // Step 2: After 1.4s, "select" the answer chip
    previewTimerRef.current = setTimeout(() => {
      setPreviewSelectedChip(previewPhases[previewPhaseIdx].answer)
    }, 1400)

    // Step 3: After 3.2s, fade out and advance to next phase
    const advanceTimer = setTimeout(() => {
      setPreviewTransitioning(true)
      setTimeout(() => {
        setPreviewPhaseIdx((prev) => (prev + 1) % previewPhases.length)
      }, 400)
    }, 3200)

    return () => {
      if (previewTimerRef.current) clearTimeout(previewTimerRef.current)
      clearTimeout(advanceTimer)
    }
  }, [previewPhaseIdx])

  const faqItems = [
    {
      q: 'Do I need a lawyer after a car accident?',
      a: 'That depends on what happened, the severity of the injuries, who may have been at fault, and how the insurance process is unfolding. The Secure Case Check is a simple way to start.',
    },
    {
      q: 'What if I was partly at fault?',
      a: 'You may still have options depending on the facts and the state involved. Shared fault does not automatically mean there is no path forward.',
    },
    {
      q: 'How soon should I act after an accident?',
      a: 'The sooner you document the situation and understand your options, the better. Waiting can make records, memories, and follow-up harder.',
    },
    {
      q: 'What if the insurance company already called me?',
      a: 'That is common. Be careful about giving detailed statements before you understand the situation fully.',
    },
    {
      q: 'Do I pay anything upfront to start?',
      a: 'No. Starting the Secure Case Check does not require payment.',
    },
    {
      q: 'What happens after I submit the Secure Case Check?',
      a: 'If your request appears to fit this path, the next step may be a connection with an independent attorney.',
    },
    {
      q: 'Can I still continue if I do not have documents yet?',
      a: 'Yes. Documents can help strengthen your file, but you can still begin without them.',
    },
    {
      q: 'What if I already have a lawyer?',
      a: 'If you are already represented for this accident, we may not be able to continue this request.',
    },
  ]

  return (
    <div className="injured-page-wrapper min-h-screen font-sans overflow-x-hidden selection:bg-[#C9A96E]/20 selection:text-[#C9A96E]">
      {/* ============================================================================ */}
      {/* HEADER — Premium, Calm, Concierge                                           */}
      {/* ============================================================================ */}
      <header className="sticky top-0 z-50 bg-[#0F1419]/95 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-5 md:px-8 py-3 md:py-3.5 flex items-center justify-between">
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
          <a href="tel:+18002273669" className="flex items-center gap-2 sm:gap-2.5 group shrink-0">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs text-white/50 font-medium leading-none">
                Questions? Speak with us
              </span>
              <span className="text-sm text-white font-semibold tracking-wide leading-tight">
                1-800-CASE-NOW
              </span>
            </div>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#22D3EE]/15 border border-[#22D3EE]/25 flex items-center justify-center group-hover:bg-[#22D3EE]/25 group-hover:border-[#22D3EE]/40 transition-all duration-300 shrink-0">
              <Phone size={14} className="text-[#22D3EE] sm:w-[15px] sm:h-[15px]" />
            </div>
            <span className="sm:hidden text-xs text-white font-bold tracking-wide whitespace-nowrap uppercase">
              CALL US
            </span>
          </a>
        </div>
      </header>

      {/* ============================================================================ */}
      {/* SECTION 1: HERO — Dark, Immersive, Premium                                  */}
      {/* ============================================================================ */}
      <section data-section="1" className="relative bg-[#0F1419] overflow-hidden">
        {/* Layered depth gradients */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(201,169,110,0.07)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_80%,rgba(201,169,110,0.04)_0%,transparent_50%)]" />
        {/* FIX 1: Removed gradient-to-bottom overlay — clean hard break at section end */}

        <div
          className={`relative max-w-7xl mx-auto px-5 md:px-8 pt-16 md:pt-24 pb-20 md:pb-28 transition-all duration-1000 ${visibleSections.includes(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — Copy */}
            <div className="max-w-xl">
              <p className="text-[#22D3EE] text-sm font-medium tracking-widest uppercase mb-6">
                Injured in a car or truck accident?
              </p>
              <h1 className="text-white mb-6 lg:text-[72px] sm:text[60px] text-[48px]">
                Start with the <span className="text-[#22D3EE]">right next step.</span>
              </h1>
              <p
                className="text-white/60 text-lg md:text-xl leading-relaxed mb-10 max-w-md"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Tell us what happened in a short Secure Case Check. If your situation fits, we may
                help connect you with an independent attorney in your area.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <button
                  onClick={openForm}
                  className="group inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-[#22D3EE] hover:bg-[#B8985D] text-[#0F1419] font-semibold text-base rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#22D3EE]/20 hover:scale-[1.02]"
                >
                  Start Secure Case Check
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-0.5 transition-transform duration-300"
                  />
                </button>
                <a
                  href="tel:+18002273669"
                  className="inline-flex items-center justify-center gap-2.5 px-7 py-4 border border-white/15 text-white font-medium text-base rounded-xl hover:bg-white/5 hover:border-white/25 transition-all duration-300"
                >
                  <Phone size={16} />
                  Call Now
                </a>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                {[
                  { icon: Clock, text: 'Takes about 2 minutes' },
                  { icon: Shield, text: 'Secure and private' },
                  { icon: Heart, text: 'No obligation' },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2">
                    <Icon size={14} className="text-[#22D3EE]/60" />
                    <span className="text-white/40 text-sm">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — ANIMATED Productized Intake Preview */}
            {/* FIX 4: Stronger radial glow + live cycling animation */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-8 bg-[radial-gradient(ellipse_at_center,rgba(201,169,110,0.18)_0%,transparent_65%)] rounded-3xl" />
                <div className="absolute -inset-4 bg-[radial-gradient(ellipse_at_center,rgba(201,169,110,0.08)_0%,transparent_55%)] rounded-3xl" />
                <div className="relative bg-white/[0.04] backdrop-blur-sm border border-white/[0.08] rounded-2xl p-8 space-y-5 shadow-2xl shadow-black/30">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-[#22D3EE] text-xs font-medium tracking-widest uppercase">
                        Secure Case Check
                      </p>
                      <p className="text-white/30 text-xs mt-1">Guided intake &bull; 5 phases</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-gentlePulse" />
                      <span className="text-emerald-400/70 text-xs font-medium">Ready</span>
                    </div>
                  </div>

                  {/* Progress bar — smooth CSS transition driven by state */}
                  <div className="space-y-3">
                    <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#22D3EE] to-[#D4B896] rounded-full"
                        style={{
                          width: `${previewProgress}%`,
                          transition: 'width 0.9s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                      />
                    </div>
                    {/* Phase labels — active phase highlighted */}
                    <div className="flex justify-between">
                      {['Accident', 'Treatment', 'Fit', 'Documents', 'Contact'].map((phase, i) => (
                        <span
                          key={phase}
                          className="text-xs font-medium"
                          style={{
                            color:
                              i === previewPhaseIdx
                                ? '#22D3EE'
                                : i < previewPhaseIdx
                                  ? 'rgba(201,169,110,0.4)'
                                  : 'rgba(255,255,255,0.2)',
                            transition: 'color 0.5s ease',
                          }}
                        >
                          {phase}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Question + chips — fade in/out on phase change */}
                  <div
                    className="bg-white/[0.03] rounded-xl p-5 border border-white/[0.05]"
                    style={{
                      opacity: previewTransitioning ? 0 : 1,
                      transform: previewTransitioning ? 'translateY(4px)' : 'translateY(0)',
                      transition: 'opacity 0.35s ease, transform 0.35s ease',
                    }}
                  >
                    <p className="text-white/50 text-xs font-medium uppercase tracking-wider mb-3">
                      Phase {previewPhaseIdx + 1} of 5
                    </p>
                    <p className="text-white text-base font-medium mb-4 leading-snug">
                      {previewPhases[previewPhaseIdx].question}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {previewPhases[previewPhaseIdx].chips.map((chip, i) => {
                        const isSelected = previewSelectedChip === i
                        return (
                          <div
                            key={chip}
                            className="px-4 py-2 rounded-lg text-sm font-medium"
                            style={{
                              background: isSelected
                                ? 'rgba(201,169,110,0.15)'
                                : 'rgba(255,255,255,0.04)',
                              border: isSelected
                                ? '1px solid rgba(201,169,110,0.35)'
                                : '1px solid rgba(255,255,255,0.08)',
                              color: isSelected ? '#22D3EE' : 'rgba(255,255,255,0.4)',
                              transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                              transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            }}
                          >
                            {chip}
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Footer badges */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    {[
                      { icon: Lock, label: 'AES-256 Encrypted' },
                      { icon: Clock, label: '~2 min to complete' },
                    ].map(({ icon: Icon, label }) => (
                      <div
                        key={label}
                        className="flex items-center gap-2 py-2 px-3 bg-white/[0.02] rounded-lg border border-white/[0.04]"
                      >
                        <Icon size={13} className="text-[#22D3EE]/50" />
                        <span className="text-white/30 text-xs">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================================ */}
      {/* CREDIBILITY TRUST BAR — Between hero and emergency strip                     */}
      {/* Shows key stats to build confidence before form submission                   */}
      {/* ============================================================================ */}
      <section className="bg-[#FAF7F2] border-y border-[#E8E2D6]/40">
        <div className="py-6 md:py-8">
          <div className="max-w-6xl mx-auto px-5 md:px-8 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 text-center sm:text-left">
            <div className="flex-1 sm:border-r border-[#D8D2C6]/40 sm:pr-6 md:pr-8">
              <p className="text-[#8B7355] text-xs font-semibold tracking-widest uppercase mb-1">
                Coverage
              </p>
              <p className="text-[#1A1A1A] text-lg md:text-xl font-semibold">Active in 38 states</p>
            </div>
            <div className="flex-1 sm:border-r border-[#D8D2C6]/40 sm:px-6 md:px-8">
              <p className="text-[#8B7355] text-xs font-semibold tracking-widest uppercase mb-1">
                Matched
              </p>
              <p className="text-[#1A1A1A] text-lg md:text-xl font-semibold">50,000+ claimants</p>
            </div>
            <div className="flex-1 sm:pl-6 md:pl-8">
              <p className="text-[#8B7355] text-xs font-semibold tracking-widest uppercase mb-1">
                Response
              </p>
              <p className="text-[#1A1A1A] text-lg md:text-xl font-semibold">
                Within 1 business day
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================================ */}
      {/* FIX 1: CLEAN SECTION BREAK — Dark to Ivory                                  */}
      {/* No gradient smear. Just a clean 1px warm border line.                       */}
      {/* ============================================================================ */}
      <div className="h-px bg-[#E8E2D6]/40" />

      {/* ============================================================================ */}
      {/* SECTION 2: EMERGENCY STRIP — On warm ivory                                   */}
      {/* ============================================================================ */}
      <section data-section="2" className="bg-[#FAF7F2] border-b border-[#E8E2D6]/60">
        <div
          className={`py-4 transition-all duration-700 ${visibleSections.includes(2) ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="flex flex-col items-center justify-center gap-1.5 text-sm text-[#6B6560] text-center">
            <div className="flex items-center gap-2">
              <AlertTriangle size={14} className="text-amber-600 shrink-0" />
              <span>
                If this is a medical emergency,{' '}
                <strong className="text-[#1A1A1A]">call 911 now.</strong>
              </span>
            </div>
            <span>Submitting information does not create an attorney-client relationship.</span>
          </div>
        </div>
      </section>

      {/* ============================================================================ */}
      {/* SECTION 3: HOW CASEPORT HELPS — Ivory (#FAF7F2) + grain texture             */}
      {/* ============================================================================ */}
      <section data-section="3" className="bg-[#FAF7F2] texture-enhanced py-24 md:py-32">
        <div
          className={`relative z-10 max-w-6xl mx-auto px-5 md:px-8 transition-all duration-1000 ${visibleSections.includes(3) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <div className="max-w-2xl mx-auto text-center mb-16">
            <p className="text-[#22D3EE] text-xs font-semibold tracking-[0.2em] uppercase mb-4">
              How it works
            </p>
            <h2 className="text-[#1A1A1A] mb-5">A simpler way to move forward after an accident</h2>
            <p className="text-[#6B6560] text-lg leading-relaxed">
              We guide you through a simple process to understand your situation and explore your
              options.
            </p>
          </div>

          {/* 3 Cards — HORIZONTAL layout with large numbered accent */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                num: '01',
                icon: MessageCircle,
                title: 'Tell us what happened',
                body: 'Answer a few quick questions so we can understand your situation.',
              },
              {
                num: '02',
                icon: FileText,
                title: 'We review for fit',
                body: 'We look at basics like accident type, timing, location, and current status.',
              },
              {
                num: '03',
                icon: CheckCircle,
                title: 'If appropriate, we help connect you',
                body: 'If your request fits this path, the next step may be a connection with an independent attorney.',
              },
            ].map(({ num, icon: Icon, title, body }, i) => (
              <div
                key={num}
                className="group relative bg-white rounded-2xl p-8 card-inner-glow border border-[#E8E2D6]/80 hover:border-[#22D3EE]/30 transition-all duration-500 hover:shadow-xl hover:shadow-[#22D3EE]/[0.06] hover:-translate-y-1"
              >
                <span
                  className="absolute top-5 right-6 text-6xl font-bold text-[#E8E2D6]/60 leading-none select-none"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  {num}
                </span>
                <div className="relative">
                  {/* FIX 5: Icons upgraded to 56px */}
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FAF7F2] to-[#EDE8DE] border border-[#E8E2D6] flex items-center justify-center mb-6 group-hover:from-[#A89968]/10 group-hover:to-[#A89968]/5 group-hover:border-[#A89968]/25 transition-all duration-500">
                    <Icon size={28} className="text-[#A89968]" />
                  </div>
                  <h3 className="text-[#1A1A1A] text-lg font-semibold mb-3 leading-snug">
                    {title}
                  </h3>
                  <p className="text-[#6B6560] text-sm leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================================ */}
      {/* FIX 1: CLEAN SECTION BREAK — Ivory to Stone                                 */}
      {/* ============================================================================ */}
      <div className="h-px bg-[#D8D2C6]/50" />

      {/* ============================================================================ */}
      {/* SECTION 4: COMMON SITUATIONS — Stone (#E0D9CC) + dot texture                */}
      {/* FIX 2: Stone darkened from #EDE8DE → #E0D9CC for clear visual distinction   */}
      {/* ============================================================================ */}
      <section data-section="4" className="bg-[#E0D9CC] texture-enhanced py-24 md:py-32">
        <div
          className={`relative z-10 max-w-6xl mx-auto px-5 md:px-8 transition-all duration-1000 ${visibleSections.includes(4) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <div className="max-w-2xl mx-auto text-center mb-16">
            <p className="text-[#8B7355] text-xs font-semibold tracking-[0.2em] uppercase mb-4">
              Accident types
            </p>
            <h2 className="text-[#1A1A1A] mb-5">Common situations we may be able to help with</h2>
            <p className="text-[#6B6560] text-lg leading-relaxed">
              Availability can depend on location, case type, and other factors.
            </p>
          </div>

          {/* 6 Cards — ICON-PROMINENT layout */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Car, label: 'Car accidents', desc: 'Collisions, rear-ends, intersections' },
              { icon: Truck, label: 'Truck accidents', desc: '18-wheelers, commercial vehicles' },
              { icon: Bike, label: 'Motorcycle accidents', desc: 'Lane splits, road hazards' },
              {
                icon: User,
                label: 'Pedestrian accidents',
                desc: 'Crosswalks, parking lots, sidewalks',
              },
              { icon: Users, label: 'Rideshare accidents', desc: 'Uber, Lyft, passenger claims' },
              {
                icon: Heart,
                label: 'Serious injury situations',
                desc: 'Hospitalization, surgery, long-term care',
              },
            ].map(({ icon: Icon, label, desc }) => (
              <button
                key={label}
                onClick={openForm}
                className="group flex items-start gap-5 bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-6 border border-[#CCC7BC] hover:border-[#22D3EE]/40 hover:bg-white card-elevated hover:shadow-xl hover:shadow-[#22D3EE]/[0.06] transition-all duration-500 text-left hover:-translate-y-0.5"
              >
                {/* FIX 5: Icons upgraded to 56px container */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FAF7F2] to-[#F0EBE1] border border-[#E0D9CC] flex items-center justify-center shrink-0 group-hover:from-[#A89968]/15 group-hover:to-[#A89968]/5 group-hover:border-[#A89968]/30 transition-all duration-500">
                  <Icon
                    size={26}
                    className="text-[#A89968] group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div>
                  <span className="text-[#1A1A1A] font-semibold text-base block mb-1">{label}</span>
                  <span className="text-[#8B7355] text-sm">{desc}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================================ */}
      {/* FIX 1: CLEAN SECTION BREAK — Stone to Cream                                 */}
      {/* ============================================================================ */}
      <div className="h-px bg-[#D0C9BC]/60" />

      {/* ============================================================================ */}
      {/* SECTION 5: WHAT TO DO — Cream (#F7F3EC) — editorial, no texture             */}
      {/* ============================================================================ */}
      <section data-section="5" className="bg-[#F7F3EC] py-24 md:py-32">
        <div
          className={`max-w-6xl mx-auto px-5 md:px-8 transition-all duration-1000 ${visibleSections.includes(5) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <div className="max-w-2xl mx-auto text-center mb-16">
            <p className="text-[#8B7355] text-xs font-semibold tracking-[0.2em] uppercase mb-4">
              After an accident
            </p>
            <h2 className="text-[#1A1A1A] mb-5">What to do after an accident</h2>
            <p className="text-[#6B6560] text-lg leading-relaxed">
              These steps can help protect your health and strengthen your case.
            </p>
          </div>

          {/* FIX 3: Timeline cards now max-w-4xl — full visual width */}
          <div className="max-w-4xl space-y-0">
            {[
              {
                num: '01',
                title: 'Get medical help if needed',
                body: 'Your health comes first. Seek treatment for any injuries, even if they seem minor.',
                icon: Heart,
              },
              {
                num: '02',
                title: 'Document what you can',
                body: 'Save photos, reports, insurance messages, and treatment paperwork. These strengthen your case.',
                icon: Camera,
              },
              {
                num: '03',
                title: 'Be careful what you say to insurers',
                body: 'Do not guess about fault or the extent of your injuries. Stick to facts.',
                icon: Shield,
              },
              {
                num: '04',
                title: 'Start a Secure Case Check',
                body: 'If you want help understanding the next step, begin here. It takes about 2 minutes.',
                icon: Zap,
              },
            ].map(({ num, title, body, icon: Icon }, i) => (
              <div key={num} className="relative pl-16 pb-10 last:pb-0">
                {/* Vertical line */}
                {i < 3 && (
                  <div className="absolute left-[22px] top-14 bottom-0 w-px bg-gradient-to-b from-[#22D3EE]/30 to-[#E8E2D6]/20" />
                )}
                {/* Number circle */}
                <div className="absolute left-0 top-0 w-11 h-11 rounded-full bg-[#0F1419] flex items-center justify-center shadow-lg shadow-[#0F1419]/20">
                  <span className="text-[#22D3EE] text-xs font-bold">{num}</span>
                </div>
                {/* FIX 3: Content card wider, with icon at 56px */}
                <div className="group bg-white rounded-2xl p-7 border border-[#E8E2D6]/80 card-inner-glow hover:border-[#22D3EE]/20 hover:shadow-lg hover:shadow-[#22D3EE]/[0.04] transition-all duration-500">
                  <div className="flex items-start gap-5">
                    {/* FIX 5: Icon container 56px */}
                    <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D6] items-center justify-center shrink-0 group-hover:bg-[#22D3EE]/10 group-hover:border-[#22D3EE]/20 transition-all duration-500">
                      <Icon size={24} className="text-[#22D3EE]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[#1A1A1A] text-base font-semibold mb-2">{title}</h3>
                      <p className="text-[#6B6560] text-sm leading-relaxed">{body}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================================ */}
      {/* FIX 1: CLEAN SECTION BREAK — Cream to Dark                                  */}
      {/* A subtle warm-tinted bottom border on cream, then dark section starts clean  */}
      {/* ============================================================================ */}
      <div className="h-px bg-[#D8D2C6]/40" />

      {/* ============================================================================ */}
      {/* SECTION 6: SECURE CASE CHECK PREVIEW — Dark Inset (Standout Section)        */}
      {/* ============================================================================ */}
      <section data-section="6" className="bg-[#0F1419] py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_40%_30%,rgba(201,169,110,0.06)_0%,transparent_60%)]" />

        <div
          className={`relative max-w-6xl mx-auto px-5 md:px-8 transition-all duration-1000 ${visibleSections.includes(6) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left — Copy */}
            <div className="max-w-lg">
              <h2 className="text-white mb-5">
                The Secure Case Check takes <span className="text-[#22D3EE]">about 2 minutes</span>
              </h2>
              <p className="text-white/50 text-lg leading-relaxed mb-4">
                Short, guided, and mostly tap-based. You do not need every detail to begin.
              </p>
              <p className="text-white/30 text-sm leading-relaxed mb-10">
                Answer what you can, skip what you cannot.
              </p>

              <div className="space-y-4 mb-10">
                {[
                  'Mostly tap-based — minimal typing',
                  'Skip questions you are unsure about',
                  'Upload documents if you have them',
                  'Your data is encrypted end-to-end',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#22D3EE]/15 flex items-center justify-center shrink-0">
                      <CheckCircle size={12} className="text-[#22D3EE]" />
                    </div>
                    <span className="text-white/50 text-sm">{item}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={openForm}
                className="group inline-flex items-center gap-2.5 px-7 py-4 bg-[#22D3EE] hover:bg-[#B8985D] text-[#0F1419] font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#22D3EE]/20 hover:scale-[1.02]"
              >
                Start Secure Case Check
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-0.5 transition-transform duration-300"
                />
              </button>
            </div>

            {/* Right — Productized Preview */}
            <div className="relative">
              <div className="absolute -inset-6 bg-[radial-gradient(ellipse_at_center,rgba(201,169,110,0.06)_0%,transparent_70%)] rounded-3xl" />

              <div className="relative bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-2xl overflow-hidden shadow-2xl shadow-black/30">
                <div className="px-7 py-5 border-b border-white/[0.06]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white text-sm font-semibold">Secure Case Check</p>
                      <p className="text-white/30 text-xs mt-0.5">Takes about 2 minutes</p>
                    </div>
                    <span className="text-[#22D3EE] text-xs font-medium bg-[#22D3EE]/10 px-3 py-1 rounded-full">
                      25%
                    </span>
                  </div>
                  <div className="mt-4 h-1 bg-white/[0.06] rounded-full overflow-hidden">
                    <div className="h-full w-[25%] bg-gradient-to-r from-[#22D3EE] to-[#D4B896] rounded-full" />
                  </div>
                  <div className="flex justify-between mt-3">
                    {['Accident', 'Treatment', 'Fit', 'Documents', 'Contact'].map((phase, i) => (
                      <div key={phase} className="flex items-center gap-1.5">
                        <div
                          className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-[#22D3EE]' : i === 1 ? 'bg-white/20' : 'bg-white/10'}`}
                        />
                        <span
                          className={`text-xs ${i === 0 ? 'text-[#22D3EE] font-medium' : 'text-white/25'}`}
                        >
                          {phase}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="px-7 py-7">
                  <p className="text-white text-lg font-medium mb-5">
                    Where did the accident happen?
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {['California', 'Arizona', 'Nevada', 'Texas'].map((state, i) => (
                      <div
                        key={state}
                        className={`px-4 py-3 rounded-xl text-sm font-medium text-center transition-all ${
                          i === 0
                            ? 'bg-[#22D3EE]/15 border-2 border-[#22D3EE]/40 text-[#22D3EE]'
                            : 'bg-white/[0.04] border border-white/[0.08] text-white/40'
                        }`}
                      >
                        {state}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="px-7 py-4 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-white/20 text-xs">Secure and private. No obligation.</span>
                  <div className="flex items-center gap-1.5">
                    <Lock size={11} className="text-[#22D3EE]/40" />
                    <span className="text-white/25 text-xs">Encrypted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================================ */}
      {/* FIX 1: CLEAN SECTION BREAK — Dark to Sand                                   */}
      {/* ============================================================================ */}
      <div className="h-px bg-[#E0D9CC]/50" />

      {/* ============================================================================ */}
      {/* SECTION 7: DOCUMENTS — Sand (#F2EDE4) + subtle grain                        */}
      {/* ============================================================================ */}
      <section data-section="7" className="bg-[#F2EDE4] texture-enhanced py-24 md:py-32">
        <div
          className={`relative z-10 max-w-6xl mx-auto px-5 md:px-8 transition-all duration-1000 ${visibleSections.includes(7) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <div className="max-w-2xl mx-auto text-center mb-16">
            <p className="text-[#8B7355] text-xs font-semibold tracking-[0.2em] uppercase mb-4">
              Helpful documents
            </p>
            <h2 className="text-[#1A1A1A] mb-5">
              Documents can help your request move forward faster
            </h2>
            <p className="text-[#6B6560] text-lg leading-relaxed">
              If you have documents available, they can help make your file more complete.
            </p>
          </div>

          {/* FIX 3: Document cards wider — full max-w-5xl with more generous padding */}
          <div className="max-w-5xl grid md:grid-cols-3 gap-8 mb-10">
            {[
              {
                icon: Camera,
                title: 'Photos and videos',
                body: 'From the accident scene, vehicle damage, road conditions, and visible injuries.',
                color: 'from-[#22D3EE]/10 to-[#22D3EE]/5',
              },
              {
                icon: FileText,
                title: 'Crash or police reports',
                body: 'Official documentation from law enforcement or responding agencies.',
                color: 'from-[#8B7355]/10 to-[#8B7355]/5',
              },
              {
                icon: Heart,
                title: 'Medical paperwork',
                body: 'Treatment records, insurance letters, hospital bills, and prescriptions.',
                color: 'from-[#6B6560]/10 to-[#6B6560]/5',
              },
            ].map(({ icon: Icon, title, body, color }) => (
              <div
                key={title}
                className="group bg-white/90 backdrop-blur-sm rounded-2xl p-9 border border-[#DDD8CE] card-inner-glow hover:border-[#22D3EE]/25 hover:shadow-xl hover:shadow-[#22D3EE]/[0.06] transition-all duration-500 hover:-translate-y-1"
              >
                {/* FIX 5: Icon container 64px */}
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${color} border border-[#E8E2D6] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}
                >
                  <Icon size={28} className="text-[#22D3EE]" />
                </div>
                <h3 className="text-[#1A1A1A] text-lg font-semibold mb-3">{title}</h3>
                <p className="text-[#6B6560] text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>

          <p className="text-[#8B7355] text-sm max-w-2xl">
            You can begin without documents, but uploads can help strengthen your file and improve
            review priority.
          </p>
        </div>
      </section>

      {/* ============================================================================ */}
      {/* FIX 1: CLEAN SECTION BREAK — Sand to Ivory                                  */}
      {/* ============================================================================ */}
      <div className="h-px bg-[#D8D2C6]/50" />

      {/* ============================================================================ */}
      {/* SECTION 8: TRUST — Ivory (#FAF7F2) — clean, minimal, no texture             */}
      {/* ============================================================================ */}
      <section data-section="8" className="bg-[#FAF7F2] texture-enhanced py-24 md:py-32">
        <div
          className={`max-w-6xl mx-auto px-5 md:px-8 transition-all duration-1000 ${visibleSections.includes(8) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <div className="max-w-2xl mx-auto text-center mb-16">
            <p className="text-[#8B7355] text-xs font-semibold tracking-[0.2em] uppercase mb-4">
              Your privacy matters
            </p>
            <h2 className="text-[#1A1A1A] mb-5">
              Clear, private, and built to help you move faster
            </h2>
            <p className="text-[#6B6560] text-lg leading-relaxed">
              We prioritize your security, privacy, and peace of mind.
            </p>
          </div>

          {/* 4 Cards — HORIZONTAL ICON-LEFT layout with left accent border */}
          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl">
            {[
              {
                icon: Lock,
                title: 'Secure form',
                body: 'Your data is encrypted and protected with industry-standard security.',
                borderColor: 'border-l-[#22D3EE]',
              },
              {
                icon: Shield,
                title: 'Private file handling',
                body: 'Your information is kept confidential and handled with care.',
                borderColor: 'border-l-[#8B7355]',
              },
              {
                icon: Users,
                title: 'Independent attorneys',
                body: 'If your request fits this path, the next step may be a connection with an independent attorney.',
                borderColor: 'border-l-[#6B6560]',
              },
              {
                icon: CheckCircle,
                title: 'No upfront payment to begin',
                body: 'Starting the Secure Case Check does not require payment.',
                borderColor: 'border-l-[#22D3EE]',
              },
            ].map(({ icon: Icon, title, body, borderColor }) => (
              <div
                key={title}
                className={`group flex gap-5 bg-white rounded-2xl p-7 border border-[#E8E2D6]/80 border-l-4 ${borderColor} card-inner-glow hover:shadow-lg hover:shadow-[#22D3EE]/[0.04] transition-all duration-500`}
              >
                {/* FIX 5: Icon container 56px */}
                <div className="w-14 h-14 rounded-xl bg-[#FAF7F2] border border-[#E8E2D6] flex items-center justify-center shrink-0 group-hover:bg-[#22D3EE]/10 group-hover:border-[#22D3EE]/20 transition-all duration-500">
                  <Icon size={24} className="text-[#22D3EE]" />
                </div>
                <div>
                  <h4 className="text-[#1A1A1A] text-base font-semibold mb-2">{title}</h4>
                  <p className="text-[#6B6560] text-sm leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Visual proof badges */}
          <div className="mt-12 pt-8 border-t border-[#E8E2D6]/60 flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2 text-sm text-[#6B6560]">
              <Lock size={16} className="text-[#22D3EE]" />
              <span>Bank-level encryption (AES-256)</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#6B6560]">
              <Shield size={16} className="text-[#22D3EE]" />
              <span>GDPR & CCPA compliant</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#6B6560]">
              <CheckCircle size={16} className="text-[#22D3EE]" />
              <span>SOC 2 Type II certified</span>
            </div>
          </div>

          <p className="text-[#8B7355] text-sm mt-10 max-w-2xl">
            Not every request moves forward, and availability can depend on location, case type, and
            other factors.
          </p>
        </div>
      </section>

      {/* ============================================================================ */}
      {/* FIX 1: CLEAN SECTION BREAK — Ivory to Warm White                            */}
      {/* ============================================================================ */}
      <div className="h-px bg-[#E8E2D6]/50" />

      {/* ============================================================================ */}
      {/* SECTION 9: FAQ — Warm White (#FDFBF7) — lightest, airy                      */}
      {/* ============================================================================ */}
      <section data-section="9" className="bg-[#FDFBF7] texture-enhanced py-24 md:py-32">
        <div
          className={`max-w-6xl mx-auto px-5 md:px-8 transition-all duration-1000 ${visibleSections.includes(9) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <div className="max-w-2xl mx-auto text-center mb-16">
            <p className="text-[#8B7355] text-xs font-semibold tracking-[0.2em] uppercase mb-4">
              Common questions
            </p>
            <h2 className="text-[#1A1A1A] mb-5">Questions people often ask after an accident</h2>
          </div>

          <div className="max-w-3xl space-y-3">
            {faqItems.map((item, i) => (
              <div
                key={i}
                className={`bg-white rounded-2xl border border-[#E8E2D6]/80 overflow-hidden transition-all duration-300 hover:border-[#22D3EE]/20 card-inner-glow animate-cardEnter${(i % 3) + 1}`}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-7 py-6 text-left"
                >
                  <span className="text-[#1A1A1A] font-medium text-[15px] pr-4">{item.q}</span>
                  <ChevronDown
                    size={18}
                    className={`text-[#22D3EE] shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-400 ease-out ${openFaq === i ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="px-7 pb-6 border-t border-[#E8E2D6]/60">
                    <p className="text-[#6B6560] text-sm leading-relaxed pt-5">{item.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================================ */}
      {/* FIX 1: CLEAN SECTION BREAK — Warm White to Dark                             */}
      {/* ============================================================================ */}
      <div className="h-px bg-[#D8D2C6]/40" />

      {/* ============================================================================ */}
      {/* SECTION 10: FINAL CTA — Dark Premium Closing                                */}
      {/* ============================================================================ */}
      <section data-section="10" className="bg-[#0F1419] py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(201,169,110,0.05)_0%,transparent_60%)]" />

        <div
          className={`relative max-w-3xl mx-auto px-5 md:px-8 text-center transition-all duration-1000 ${visibleSections.includes(10) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <h2 className="text-white mb-5">
            Start with the <span className="text-[#22D3EE]">right next step</span>
          </h2>
          <p className="text-white/50 text-lg leading-relaxed mb-4 max-w-xl mx-auto">
            Complete the Secure Case Check to tell us what happened. If your request appears to fit
            this path, the next step may be a connection with an independent attorney.
          </p>
          <p className="text-white/30 text-sm mb-10">You do not need every detail to begin.</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={openForm}
              className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#22D3EE] hover:bg-[#B8985D] text-[#0F1419] font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#22D3EE]/20 hover:scale-[1.02]"
            >
              Start Secure Case Check
              <ArrowRight
                size={18}
                className="group-hover:translate-x-0.5 transition-transform duration-300"
              />
            </button>
            <a
              href="tel:+18002273669"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 border border-white/15 text-white font-medium rounded-xl hover:bg-white/5 hover:border-white/25 transition-all duration-300"
            >
              <Phone size={16} />
              Call Now
            </a>
          </div>

          <p className="text-white/25 text-sm">Secure. Private. Takes about 2 minutes.</p>
        </div>
      </section>

      {/* ============================================================================ */}
      {/* SECTION 11: FOOTER                                                           */}
      {/* ============================================================================ */}
      <footer className="bg-[#0A0E14] footer-gradient border-t border-white/[0.04] py-14 relative">
        {/* Gradient accent line at top */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#22D3EE]/20 to-transparent" />

        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid md:grid-cols-3 gap-10 mb-12">
            {/* Brand column */}
            <div>
              <div className="mb-4">
                <span className="text-white font-bold text-sm tracking-widest">CASEPORT</span>
              </div>
              <p className="text-white/40 text-sm leading-relaxed max-w-xs">
                CasePort helps injured people take the next step after an accident.
              </p>
            </div>

            {/* Company links column */}
            <div>
              <p className="text-white/60 text-xs font-medium uppercase tracking-wider mb-4 text-[#22D3EE]">
                Company
              </p>
              <div className="space-y-2.5">
                {[
                  { label: 'For Law Firms', href: '/personal-injury-leads' },
                  { label: 'Insights', href: '/insights' },
                  { label: 'Contact', href: 'mailto:access@caseport.io' },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="block text-white/40 text-sm hover:text-[#22D3EE] transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Legal links column */}
            <div>
              <p className="text-white/60 text-xs font-medium uppercase tracking-wider mb-4 text-[#A89968]">
                Legal
              </p>
              <div className="space-y-2.5">
                {[
                  { label: 'Privacy Policy', href: '/privacy' },
                  { label: 'Terms', href: '/terms' },
                  { label: 'Disclaimer', href: '/terms#disclaimer' },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="block text-white/40 text-sm hover:text-[#A89968] transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Divider with gradient */}
          <div className="border-t border-white/[0.06] pt-8">
            <p className="text-white/30 text-xs leading-relaxed max-w-3xl">
              CasePort is not a law firm and does not provide legal advice. Independent attorneys
              are responsible for their own services. Submitting information does not create an
              attorney-client relationship.
            </p>
          </div>
        </div>
      </footer>

      {/* ============================================================================ */}
      {/* STICKY MOBILE CTA BAR — appears after hero scroll on mobile                   */}
      {/* ============================================================================ */}
      {showMobileCtaBar && (
        <div className="fixed bottom-0 left-0 right-0 md:hidden bg-[#0F1419] border-t border-white/10 p-4 animate-slideUpFromBottom z-40">
          <div className="flex gap-3">
            <button
              onClick={openForm}
              className="flex-1 bg-[#22D3EE] text-[#0F1419] font-semibold py-3 px-4 rounded-lg hover:bg-[#D4B896] transition-colors duration-300 text-sm"
            >
              Start Case Check
            </button>
            <a
              href="tel:1-800-CASE-NOW"
              className="flex-1 bg-white/10 text-white font-semibold py-3 px-4 rounded-lg hover:bg-white/20 transition-colors duration-300 flex items-center justify-center gap-2 text-sm"
            >
              <Phone size={16} /> Call Now
            </a>
          </div>
        </div>
      )}

      {/* ============================================================================ */}
      {/* FORM MODAL                                                                   */}
      {/* ============================================================================ */}
      <SecureCaseCheckForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  )
}
