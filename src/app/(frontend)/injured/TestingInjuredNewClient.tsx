'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SecureCaseCheckForm from '@/components/SecureCaseCheckForm'

const useScrollAnimation = () => {
  const [visibleElements, setVisibleElements] = useState<string[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements((prev) => {
              if (!prev.includes(entry.target.id)) {
                return [...prev, entry.target.id]
              }
              return prev
            })
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return visibleElements
}

const COLORS = {
  cream: '#f9f5ef',
  creamAlt: '#fdfbf8',
  teal: '#1a4a5a',
  terra: '#c4714a',
  sage: '#4a8c7e',
  ink: '#1c2b32',
  muted: '#7a9299',
  borderSoft: '#e8e2d8',
  white: '#ffffff',
}

export default function TestingInjuredNewClient() {
  const [formOpen, setFormOpen] = useState(false)
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const visibleElements = useScrollAnimation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const getAnimationClass = (id: string) => {
    return visibleElements.includes(id)
      ? 'opacity-100 translate-y-0'
      : 'opacity-0 translate-y-8'
  }

  const showStickyCTA = scrolled && window.scrollY > 400

  return (
    <div style={{ background: `linear-gradient(135deg, ${COLORS.cream} 0%, #faf6f0 100%)`, minHeight: '100vh' }}>
      {/* STICKY CTA */}
      {showStickyCTA && (
        <button
          onClick={() => router.push('/checkmycase')}
          className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40 px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-white text-sm md:text-base transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95 active:shadow-lg animate-fade-in shadow-xl"
          style={{
            backgroundColor: COLORS.terra,
          }}
        >
          Start My Free Case Review
        </button>
      )}

      {/* STICKY HEADER */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'shadow-lg' : ''
        }`}
        style={{
          backgroundColor: scrolled ? COLORS.white : 'transparent',
          borderBottom: scrolled ? `1px solid ${COLORS.borderSoft}` : 'none',
          opacity: scrolled ? 1 : 0,
          pointerEvents: scrolled ? 'auto' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs"
              style={{ backgroundColor: COLORS.terra }}
            >
              CP
            </div>
            <span className="font-semibold text-lg" style={{ color: COLORS.ink }}>
              CasePort
            </span>
          </div>

          {/* Phone Number */}
          <a
            href="tel:1-800-2273-6269"
            className="text-sm font-semibold transition-colors duration-200"
            style={{ color: COLORS.terra }}
          >
            1-800-CASE-NOW
          </a>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="pt-20 md:pt-32 pb-20 md:pb-40 px-4 md:px-8 animate-fade-in">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Illustration */}
          <div className="flex justify-center mb-8">
            <svg
              width="160"
              height="160"
              viewBox="0 0 160 160"
              className="md:w-48 md:h-48"
            >
              <circle cx="80" cy="80" r="75" fill="#e8e2d8" />
              <circle cx="60" cy="70" r="18" fill="#c4714a" />
              <circle cx="100" cy="70" r="18" fill="#4a8c7e" />
              <circle cx="80" cy="95" r="8" fill="#c4714a" />
            </svg>
          </div>

          {/* Headline */}
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-serif font-medium leading-tight"
            style={{ color: COLORS.ink }}
          >
            You survived.{' '}
            <span style={{ color: COLORS.teal }}>That matters.</span>
          </h1>

          {/* Subheadline */}
          <p
            className="text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
            style={{ color: COLORS.muted }}
          >
            Now let's make sure you get every dollar you deserve. Most injured
            people don't know they're leaving money on the table. We do.
          </p>

          {/* CTA Button */}
          <button
            onClick={() => router.push('/checkmycase')}
            className="inline-block px-8 md:px-12 py-4 md:py-5 rounded-full font-bold text-lg transition-all duration-300 hover:scale-102 hover:shadow-xl active:scale-98 active:shadow-md group"
            style={{
              backgroundColor: COLORS.terra,
              color: COLORS.white,
              boxShadow:
                '0 1px 2px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.08), 0 12px 24px rgba(196, 113, 74, 0.08)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#d4664a'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = COLORS.terra
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.backgroundColor = '#b85a3d'
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.backgroundColor = '#d4664a'
            }}
          >
            Start My Free Case Review
          </button>

          {/* Micro-copy */}
          <p className="text-sm" style={{ color: COLORS.muted }}>
            Takes 2 minutes. No credit card required. No obligation.
          </p>
        </div>
      </section>

      {/* REASSURANCE SECTION */}
      <section
        id="reassurance"
        data-animate
        className={`py-16 md:py-24 px-4 md:px-8 transition-all duration-700 ${getAnimationClass(
          'reassurance'
        )}`}
        style={{ backgroundColor: COLORS.white }}
      >
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-6 text-center">
            <h2
              className="text-2xl md:text-3xl font-serif font-medium"
              style={{ color: COLORS.ink }}
            >
              You're not alone in this
            </h2>
            <p
              className="text-lg leading-relaxed max-w-2xl mx-auto"
              style={{ color: COLORS.muted }}
            >
              Thousands of injured people have been exactly where you are right now. Confused. Scared.
              Uncertain about what comes next. That's completely normal.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 pt-8">
            {[
              {
                icon: '01',
                title: "You're in good hands",
                description:
                  "We've helped thousands navigate this exact situation. We know what works.",
              },
              {
                icon: '02',
                title: 'We understand your fear',
                description:
                  'Fear of losing your case. Fear of wasting time. Fear of getting ripped off. We get it. We address it.',
              },
              {
                icon: '03',
                title: 'This is the right move',
                description:
                  "Getting matched with an attorney is the smartest thing you can do right now. You're doing the right thing.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-lg text-center space-y-3 transition-all duration-500 hover:shadow-lg hover:scale-102 hover:bg-opacity-80"
                style={{
                  backgroundColor: COLORS.cream,
                  boxShadow:
                    '0 1px 2px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.08), 0 8px 16px rgba(0, 0, 0, 0.06)',
                  transitionDelay: `${idx * 100}ms`,
                }}
              >
                <div className="text-sm font-bold" style={{ color: COLORS.terra }}>
                  {item.icon}
                </div>
                <h3 className="font-semibold text-lg" style={{ color: COLORS.ink }}>
                  {item.title}
                </h3>
                <p className="text-sm" style={{ color: COLORS.muted }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EARLY SOCIAL PROOF SECTION */}
      <section
        id="early-social-proof"
        data-animate
        className={`py-12 md:py-16 px-4 md:px-8 transition-all duration-700 ${getAnimationClass(
          'early-social-proof'
        )}`}
        style={{ background: `linear-gradient(135deg, ${COLORS.cream} 0%, #faf6f0 100%)` }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            <div
              className="p-6 rounded-lg border-2"
              style={{
                borderColor: COLORS.teal,
                backgroundColor: COLORS.white,
              }}
            >
              <p className="italic text-sm mb-4" style={{ color: COLORS.ink }}>
                "I didn't know what to do after my accident. CasePort connected me with an amazing
                attorney who got me $45,000. I would have gotten nothing without them."
              </p>
              <p className="font-semibold text-sm" style={{ color: COLORS.terra }}>
                Sarah M., California
              </p>
            </div>
            <div
              className="p-6 rounded-lg border-2"
              style={{
                borderColor: COLORS.sage,
                backgroundColor: COLORS.white,
              }}
            >
              <p className="italic text-sm mb-4" style={{ color: COLORS.ink }}>
                "The process was so easy. Within 15 minutes, I was talking to a lawyer. They settled
                my case for $78,000."
              </p>
              <p className="font-semibold text-sm" style={{ color: COLORS.terra }}>
                James T., Texas
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* URGENCY SECTION */}
      <section
        id="urgency"
        data-animate
        className={`py-16 md:py-24 px-4 md:px-8 transition-all duration-700 ${getAnimationClass(
          'urgency'
        )}`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-4 md:gap-6 items-start">
            <div className="text-sm font-bold flex-shrink-0" style={{ color: COLORS.terra }}>
              ⏱
            </div>
            <div className="space-y-3">
              <h2
                className="text-2xl md:text-3xl font-serif font-medium"
                style={{ color: COLORS.ink }}
              >
                Your deadline is approaching
              </h2>
              <p style={{ color: COLORS.muted }}>
                Most states give you 2 years to file a personal injury claim. But some states give you
                only 1 year. A few states give you just 6 months.
              </p>
              <p style={{ color: COLORS.terra }} className="font-semibold">
                Check your state. You might have less time than you think.
              </p>
              <p className="font-bold" style={{ color: COLORS.terra }}>
                Every day matters. Act soon.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section
        id="how-it-works"
        data-animate
        className={`py-16 md:py-24 px-4 md:px-8 transition-all duration-700 ${getAnimationClass(
          'how-it-works'
        )}`}
      >
        <div className="max-w-4xl mx-auto space-y-12">
          <h2
            className="text-3xl md:text-4xl font-serif font-medium text-center"
            style={{ color: COLORS.ink }}
          >
            Here's what happens next
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                number: '1',
                title: 'Tell us your story',
                description: 'Answer a few quick questions about your accident. We listen.',
              },
              {
                number: '2',
                title: 'We review your case',
                description:
                  'Our system matches you with the right attorney who specializes in your type of injury.',
              },
              {
                number: '3',
                title: 'Attorney contacts you',
                description:
                  'An attorney calls within 15 minutes to discuss your case and answer all your questions.',
              },
            ].map((step, idx) => (
              <div
                key={step.number}
                className="text-center space-y-4 transition-all duration-500 hover:scale-105"
                style={{
                  transitionDelay: `${idx * 100}ms`,
                }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto font-bold text-2xl"
                  style={{ backgroundColor: COLORS.terra, color: COLORS.white }}
                >
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold" style={{ color: COLORS.ink }}>
                  {step.title}
                </h3>
                <p style={{ color: COLORS.muted }}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF - NUMBERS */}
      <section
        id="social-proof-numbers"
        data-animate
        className={`py-16 md:py-24 px-4 md:px-8 transition-all duration-700 ${getAnimationClass(
          'social-proof-numbers'
        )}`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: '50,000+', label: 'Injured People Helped' },
              { number: '$2.3B+', label: 'In Settlements' },
              { number: '92%', label: 'Success Rate' },
              { number: '6 mo', label: 'Average to Settlement' },
            ].map((stat) => (
              <div key={stat.label} className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold" style={{ color: COLORS.terra }}>
                  {stat.number}
                </div>
                <p className="text-sm" style={{ color: COLORS.muted }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section
        id="testimonials"
        data-animate
        className={`py-16 md:py-24 px-4 md:px-8 transition-all duration-700 ${getAnimationClass(
          'testimonials'
        )}`}
      >
        <div className="max-w-4xl mx-auto space-y-12">
          <h2
            className="text-3xl md:text-4xl font-serif font-medium text-center"
            style={{ color: COLORS.ink }}
          >
            Real people, real results
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                quote:
                  'I didn\'t know what to do after my accident. CasePort connected me with an amazing attorney who got me $45,000.',
                author: 'Sarah M.',
                location: 'California',
                photo: '/manus-storage/sarah-m_da8a178e.jpg',
              },
              {
                quote:
                  'The process was so easy. Within 15 minutes, I was talking to a lawyer. They settled my case for $78,000.',
                author: 'James T.',
                location: 'Texas',
                photo: '/manus-storage/james-t_1a26576a.jpg',
              },
              {
                quote:
                  "I was worried I'd waited too long. But CasePort found an attorney who took my case and got me $125,000.",
                author: 'Maria L.',
                location: 'Florida',
                photo: '/manus-storage/maria-l_3883becd.jpg',
              },
              {
                quote:
                  'Best decision I made. The attorney was professional, caring, and got me more than I expected.',
                author: 'David K.',
                location: 'New York',
                photo: '/manus-storage/sarah-m_da8a178e.jpg',
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="p-6 md:p-8 rounded-lg border-2 transition-all duration-500 hover:shadow-lg hover:scale-102"
                style={{
                  borderColor: COLORS.borderSoft,
                  backgroundColor: COLORS.white,
                  boxShadow:
                    '0 1px 2px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.08), 0 8px 16px rgba(0, 0, 0, 0.06)',
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={testimonial.photo}
                    alt={testimonial.author}
                    className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                  />
                  <div>
                    <p className="font-bold" style={{ color: COLORS.ink }}>
                      {testimonial.author}
                    </p>
                    <p className="text-sm" style={{ color: COLORS.muted }}>
                      {testimonial.location}
                    </p>
                  </div>
                </div>
                <p className="italic" style={{ color: COLORS.muted }}>
                  &quot;{testimonial.quote}&quot;
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ATTORNEY CREDENTIALS */}
      <section
        id="attorney-credentials"
        data-animate
        className={`py-16 md:py-24 px-4 md:px-8 transition-all duration-700 ${getAnimationClass(
          'attorney-credentials'
        )}`}
      >
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2
              className="text-3xl md:text-4xl font-serif font-medium"
              style={{ color: COLORS.ink }}
            >
              Your attorney will have
            </h2>
            <p style={{ color: COLORS.muted }}>
              Our network includes specialists in personal injury law across all practice areas.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Experience',
                description: '10+ years in personal injury law',
              },
              {
                title: 'Track Record',
                description: '500+ successful cases',
              },
              {
                title: 'Results',
                description: 'Average $100K+ settlements',
              },
            ].map((credential, idx) => (
              <div
                key={idx}
                className="p-6 rounded-lg border-2 transition-all duration-500 hover:shadow-lg hover:scale-102"
                style={{
                  borderColor: COLORS.borderSoft,
                  backgroundColor: COLORS.white,
                  boxShadow:
                    '0 1px 2px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.08), 0 8px 16px rgba(0, 0, 0, 0.06)',
                  transitionDelay: `${idx * 100}ms`,
                }}
              >
                <h3 className="font-semibold text-lg mb-2" style={{ color: COLORS.ink }}>
                  {credential.title}
                </h3>
                <p style={{ color: COLORS.muted }}>{credential.description}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-sm" style={{ color: COLORS.muted }}>
            All attorneys are licensed in your state and verified for credentials and experience.
          </p>
        </div>
      </section>

      {/* TRUST SIGNALS */}
      <section
        id="trust-signals"
        data-animate
        className={`py-16 md:py-24 px-4 md:px-8 transition-all duration-700 ${getAnimationClass(
          'trust-signals'
        )}`}
      >
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-2xl md:text-3xl font-serif font-medium text-center mb-12"
            style={{ color: COLORS.ink }}
          >
            Why people trust us
          </h2>

          <div className="grid md:grid-cols-4 gap-6 text-center">
            {[
              { icon: '✓', label: 'BBB Accredited' },
              { icon: '✓', label: 'Licensed 38 States' },
              { icon: '✓', label: 'ABA Compliant' },
              { icon: '✓', label: 'SSL Secure' },
            ].map((badge) => (
              <div key={badge.label} className="space-y-3">
                <div className="text-2xl font-bold" style={{ color: COLORS.terra }}>
                  ✓
                </div>
                <p className="text-sm font-semibold" style={{ color: COLORS.ink }}>
                  {badge.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section
        id="faq"
        data-animate
        className={`py-16 md:py-24 px-4 md:px-8 transition-all duration-700 ${getAnimationClass(
          'faq'
        )}`}
      >
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h2
              className="text-2xl md:text-3xl font-serif font-medium"
              style={{ color: COLORS.ink }}
            >
              Objections we hear (and how we address them)
            </h2>
            <p style={{ color: COLORS.muted }}>
              You probably have questions. Here are the ones we hear most often.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'What if I was partially at fault?',
                a: "Comparative negligence laws in most states allow you to recover damages even if you're partially at fault. An attorney will review your specific situation and explain your rights. Many people are surprised to learn they can still recover 50-100% of damages depending on the state.",
              },
              {
                q: 'What if I already spoke to insurance?',
                a: "It's not too late. An attorney can still help protect your rights and maximize your recovery. Insurance companies often make early settlement offers that are far below what you deserve. An attorney knows the true value of your case and can negotiate on your behalf.",
              },
              {
                q: 'What if it has been weeks or months since my accident?',
                a: 'Time is important, but you may still have options. Most states give you 2-3 years to file a claim. Contact us immediately to discuss your case. The sooner you act, the better we can preserve evidence and build your case.',
              },
              {
                q: 'Do I really need to hire a lawyer?',
                a: 'You have the right to represent yourself, but statistics show that people with attorneys recover 3-5x more than those without. Attorneys know how to value your case, negotiate with insurers, and handle complex legal procedures. It is an investment that typically pays for itself many times over.',
              },
              {
                q: 'How much does this cost?',
                a: 'Our service is completely free. Attorneys work on contingency—they only get paid if you win. Typical contingency fees are 25-33% of your settlement. You never pay upfront, and if we do not recover money for you, you pay nothing.',
              },
              {
                q: 'What if my case does not qualify?',
                a: "We'll be honest with you. If your case does not meet our criteria, we'll tell you directly and point you to resources that can help. We only take cases we believe we can win, which protects both you and us.",
              },
              {
                q: 'How long does this process take?',
                a: 'Most cases settle within 6-12 months. Some take longer depending on complexity. Your attorney will give you a realistic timeline and keep you updated every step of the way.',
              },
              {
                q: 'Will I have to go to court?',
                a: 'Most cases settle before trial. However, if the insurance company will not offer a fair settlement, your attorney is prepared to take your case to court. You will never be forced into litigation without your consent.',
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="p-6 md:p-8 rounded-lg border-2 space-y-4"
                style={{
                  borderColor: COLORS.borderSoft,
                  backgroundColor: COLORS.white,
                }}
              >
                <h3 className="font-bold text-lg" style={{ color: COLORS.ink }}>
                  {faq.q}
                </h3>
                <p style={{ color: COLORS.muted }} className="leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SCARCITY + URGENCY SECTION */}
      <section
        id="scarcity-urgency"
        data-animate
        className={`py-16 md:py-24 px-4 md:px-8 transition-all duration-700 ${getAnimationClass(
          'scarcity-urgency'
        )}`}
        style={{ borderColor: COLORS.borderSoft, backgroundColor: COLORS.white }}
      >
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left: Urgency Message */}
            <div className="space-y-6">
              <h2
                className="text-2xl md:text-3xl font-serif font-medium"
                style={{ color: COLORS.ink }}
              >
                Limited attorney availability
              </h2>
              <p style={{ color: COLORS.muted }} className="leading-relaxed">
                Our network of specialized attorneys is selective. They only take cases they can win.
                Only 1 in 5 cases qualify. Qualified cases get matched within 15 minutes. Slots fill up
                fast.
              </p>
              <div className="space-y-4">
                <div className="flex gap-3 items-start">
                  <span className="text-sm font-bold" style={{ color: COLORS.terra }}>
                    ✓
                  </span>
                  <div>
                    <p className="font-semibold" style={{ color: COLORS.ink }}>
                      Average response time: 15 minutes
                    </p>
                    <p className="text-sm" style={{ color: COLORS.muted }}>
                      Attorneys review and respond quickly to qualified cases.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="text-sm font-bold" style={{ color: COLORS.terra }}>
                    ✓
                  </span>
                  <div>
                    <p className="font-semibold" style={{ color: COLORS.ink }}>
                      92% acceptance rate
                    </p>
                    <p className="text-sm" style={{ color: COLORS.muted }}>
                      Qualified cases get matched with attorneys who want them.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <span className="text-sm font-bold" style={{ color: COLORS.terra }}>
                    ✓
                  </span>
                  <div>
                    <p className="font-semibold" style={{ color: COLORS.ink }}>
                      Only 1 in 5 cases qualify
                    </p>
                    <p className="text-sm" style={{ color: COLORS.muted }}>
                      We're selective. Strong cases get matched first.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* URGENCY REMINDER SECTION */}
      <section
        id="urgency-reminder"
        data-animate
        className={`py-8 md:py-12 px-4 md:px-8 transition-all duration-700 ${getAnimationClass(
          'urgency-reminder'
        )}`}
        style={{
          backgroundColor: COLORS.white,
          borderTop: `2px solid ${COLORS.borderSoft}`,
          borderBottom: `2px solid ${COLORS.borderSoft}`,
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <p style={{ color: COLORS.terra }} className="font-semibold text-lg">
            Time is your advantage. The sooner you act, the stronger your case. Do not let this
            opportunity slip away.
          </p>
        </div>
      </section>

      {/* GUARANTEE + RISK REVERSAL SECTION */}
      <section
        id="guarantee-risk-reversal"
        data-animate
        className={`py-16 md:py-24 px-4 md:px-8 transition-all duration-700 ${getAnimationClass(
          'guarantee-risk-reversal'
        )}`}
        style={{ background: `linear-gradient(135deg, ${COLORS.cream} 0%, #faf6f0 100%)` }}
      >
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Headline */}
          <div className="text-center space-y-4">
            <h2
              className="text-2xl md:text-3xl font-serif font-medium"
              style={{ color: COLORS.ink }}
            >
              No risk. No upfront costs. No fees unless we win.
            </h2>
            <p style={{ color: COLORS.muted }} className="text-lg">
              We only get paid when you get paid. That's the guarantee.
            </p>
          </div>

          {/* Three-Column Guarantee Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Guarantee 1: No Upfront Costs */}
            <div
              className="p-8 rounded-lg border-2 text-center space-y-4"
              style={{
                borderColor: COLORS.teal,
                backgroundColor: COLORS.white,
              }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto text-sm font-bold"
                style={{ backgroundColor: COLORS.cream, color: COLORS.terra }}
              >
                01
              </div>
              <h3 className="font-semibold text-lg" style={{ color: COLORS.ink }}>
                No upfront costs
              </h3>
              <p style={{ color: COLORS.muted }} className="text-sm leading-relaxed">
                You don't pay anything to get started. No application fees, no consultation fees,
                nothing.
              </p>
            </div>

            {/* Guarantee 2: Contingency Fee */}
            <div
              className="p-8 rounded-lg border-2 text-center space-y-4"
              style={{
                borderColor: COLORS.terra,
                backgroundColor: COLORS.white,
              }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto text-sm font-bold"
                style={{ backgroundColor: COLORS.cream, color: COLORS.terra }}
              >
                02
              </div>
              <h3 className="font-semibold text-lg" style={{ color: COLORS.ink }}>
                Contingency fee only
              </h3>
              <p style={{ color: COLORS.muted }} className="text-sm leading-relaxed">
                We only collect a fee if we win your case. If we don't recover money for you, you pay
                nothing.
              </p>
            </div>

            {/* Guarantee 3: Transparent Fees */}
            <div
              className="p-8 rounded-lg border-2 text-center space-y-4"
              style={{
                borderColor: COLORS.sage,
                backgroundColor: COLORS.white,
              }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto text-sm font-bold"
                style={{ backgroundColor: COLORS.cream, color: COLORS.terra }}
              >
                03
              </div>
              <h3 className="font-semibold text-lg" style={{ color: COLORS.ink }}>
                Transparent fees
              </h3>
              <p style={{ color: COLORS.muted }} className="text-sm leading-relaxed">
                Typical contingency fee is 25-33% of settlement. We'll explain everything upfront.
              </p>
            </div>
          </div>

          {/* Risk Reversal Statement */}
          <div
            className="p-8 md:p-12 rounded-lg border-l-4"
            style={{
              borderLeftColor: COLORS.teal,
              backgroundColor: COLORS.white,
            }}
          >
            <h3 className="font-semibold text-lg mb-4" style={{ color: COLORS.ink }}>
              Our promise to you
            </h3>
            <ul className="space-y-3">
              {[
                "We'll evaluate your case honestly. If we don't think you have a strong case, we'll tell you.",
                "We'll keep you informed every step of the way. No surprises.",
                "We'll fight hard to get you the maximum settlement possible.",
                'Your settlement is yours. We take our fee from the recovery, not from your pocket.',
              ].map((item, idx) => (
                <li key={idx} className="flex gap-3 items-start">
                  <span
                    style={{ color: COLORS.teal }}
                    className="font-bold text-sm mt-0.5"
                  >
                    ✓
                  </span>
                  <span style={{ color: COLORS.muted }} className="text-sm leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CREDIBILITY SECTION */}
      <section
        id="credibility"
        data-animate
        className={`py-16 md:py-24 px-4 md:px-8 transition-all duration-700 ${getAnimationClass(
          'credibility'
        )}`}
        style={{ backgroundColor: COLORS.white }}
      >
        <div className="max-w-4xl mx-auto">
          {/* Credibility Indicators */}
          <div
            className="p-8 rounded-lg border-2"
            style={{
              borderColor: COLORS.sage,
              backgroundColor: COLORS.cream,
            }}
          >
            <h3 className="font-semibold text-lg mb-6" style={{ color: COLORS.ink }}>
              Why injured people trust us
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  icon: '✓',
                  label: 'ABA Compliant',
                  description: 'Fully compliant with American Bar Association ethics rules',
                },
                {
                  icon: '✓',
                  label: 'AES-256 Encrypted',
                  description: 'Bank-level security for your personal information',
                },
                {
                  icon: '✓',
                  label: 'Licensed All 50 States',
                  description: 'All attorneys verified and insured',
                },
                {
                  icon: '✓',
                  label: 'Transparent Process',
                  description: 'No hidden fees, no surprises, ever',
                },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <span
                    className="text-lg font-bold flex-shrink-0"
                    style={{ color: COLORS.terra }}
                  >
                    ✓
                  </span>
                  <div>
                    <p className="font-semibold" style={{ color: COLORS.ink }}>
                      {item.label}
                    </p>
                    <p className="text-sm" style={{ color: COLORS.muted }}>
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section
        id="final-cta"
        data-animate
        className={`py-16 md:py-24 px-4 md:px-8 transition-all duration-700 ${getAnimationClass(
          'final-cta'
        )}`}
      >
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <h2
            className="text-3xl md:text-4xl font-serif font-medium"
            style={{ color: COLORS.ink }}
          >
            Ready to get started?
          </h2>

          <p style={{ color: COLORS.muted }}>
            Get matched with an attorney who understands your situation.
          </p>

          <button
            onClick={() => router.push('/checkmycase')}
            className="inline-block px-8 md:px-12 py-4 md:py-5 rounded-full font-bold text-lg transition-all duration-300 hover:scale-102 hover:shadow-xl active:scale-98 active:shadow-md group"
            style={{
              backgroundColor: COLORS.terra,
              color: COLORS.white,
              boxShadow:
                '0 1px 2px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.08), 0 12px 24px rgba(196, 113, 74, 0.08)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#d4664a'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = COLORS.terra
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.backgroundColor = '#b85a3d'
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.backgroundColor = '#d4664a'
            }}
          >
            Start My Free Case Review
          </button>

          <p className="text-xs" style={{ color: COLORS.muted }}>
            Your information is secure and encrypted. We will never share it. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 px-4 md:px-8" style={{ backgroundColor: COLORS.cream }}>
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4" style={{ color: COLORS.ink }}>
                CasePort
              </h3>
              <p className="text-sm" style={{ color: COLORS.muted }}>
                Connecting injured people with justice.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-3" style={{ color: COLORS.ink }}>
                Company
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" style={{ color: COLORS.teal }}>
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" style={{ color: COLORS.teal }}>
                    Guide
                  </a>
                </li>
                <li>
                  <a href="#" style={{ color: COLORS.teal }}>
                    Resources
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3" style={{ color: COLORS.ink }}>
                Legal
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" style={{ color: COLORS.teal }}>
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" style={{ color: COLORS.teal }}>
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" style={{ color: COLORS.teal }}>
                    Disclaimer
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-3" style={{ color: COLORS.ink }}>
                Contact
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="tel:1-800-CASE-NOW" style={{ color: COLORS.teal }}>
                    1-800-CASE-NOW
                  </a>
                </li>
                <li>
                  <a href="mailto:access@caseport.io" style={{ color: COLORS.teal }}>
                    access@caseport.io
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div
            className="text-center text-sm pt-8"
            style={{ borderColor: COLORS.borderSoft, color: COLORS.muted }}
          >
            <p>&copy; 2026 CasePort. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* FORM MODAL */}
      <SecureCaseCheckForm isOpen={formOpen} onClose={() => setFormOpen(false)} />
    </div>
  )
}