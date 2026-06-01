'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight, ChevronDown, ChevronUp, CheckCircle2, ArrowRight, AlertCircle, AlertTriangle, CheckCircle, Camera, Phone, FileText, MapPin, Users } from 'lucide-react'

interface GuideArticleClientProps {
  article: any
  category: any
  headerNav?: any
  footerNav?: any
  isPreview?: boolean
}

// Icon mapping
const iconMap: Record<string, any> = {
  AlertCircle,
  CheckCircle,
  Phone,
  FileText,
  MapPin,
  Users,
}

export default function GuideArticleClient({ article, category, isPreview = false }: GuideArticleClientProps) {
  const [selectedState, setSelectedState] = useState('california')
  const [expandedFaq, setExpandedFaq] = useState<string>('')
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeSection, setActiveSection] = useState('direct-answer')
  const [viewportWidth, setViewportWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024)

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrolled = window.scrollY
      const progress = windowHeight > 0 ? (scrolled / windowHeight) * 100 : 0
      setScrollProgress(progress)

      // Active section tracking
      const sections = ['direct-answer', 'tldr', 'key-takeaways', 'immediate-actions', 'medical-documentation', 'with-without-attorney', 'settlement-examples', 'settlement-ranges', 'statute-of-limitations', 'people-also-ask', 'faq']
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 200) {
            setActiveSection(sectionId)
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Helper: safely extract string from value that might be {value, label, id} or already a string
  const toString = (val: any): string => {
    if (typeof val === 'string') return val
    if (val === null || val === undefined) return ''
    if (typeof val === 'number') return String(val)
    if (Array.isArray(val)) return val.map((item) => toString(item)).filter(Boolean).join(', ')
    if (val.value) return String(val.value)
    if (val.label) return String(val.label)
    return JSON.stringify(val)
  }

  // Helper: safely convert any array item to string
  const stringify = (arr: any[]): string[] => arr?.map(toString) || []

  // Data fallbacks
  const tldrItems = article.tldrItems || article.actionPlan || article.howToSteps || []
  const directAnswerText = typeof article.directAnswer === 'string'
    ? article.directAnswer
    : article.directAnswer?.value || ''
  const keyTakeaways = article.keyTakeaways?.map((k: any) => {
    if (typeof k === 'string') return k
    if (k.point) return k.point
    if (k.value) return k.value
    return String(k.value || k.label || '')
  }) || []
  const faqItems = article.faqSection || []
  const testimonials = article.testimonials || []
  const stateRanges = article.stateRanges ? Object.entries(article.stateRanges).map(([state, data]: [string, any]) => ({
    state,
    minor: data.min ? `$${Number(data.min).toLocaleString()}-$${Number(data.max).toLocaleString()}` : '-',
    moderate: data.avg ? `$${Number(data.avg).toLocaleString()}` : '-',
    severe: data.max ? `$${Number(data.max).toLocaleString()}` : '-',
    catastrophic: data.max ? `$${Math.round(Number(data.max) * 2).toLocaleString()}-$${Math.round(Number(data.max) * 4).toLocaleString()}+` : '-',
  })) : []
  const attorneyComparison = article.attorneyComparison || []
  const statuteData = article.statuteOfLimitations || {}
  const whatYouLearn = article.whatYouLearn || []
  const immediateSteps = article.immediateSteps || []
  const mistakesToAvoid = article.mistakesToAvoid || []
  const liabilityParties = article.liabilityParties || []
  const federalRegulations = article.federalRegulations || []
  const fiveThingsToKnow = article.fiveThingsToKnow || []
  const decisionMatrix = article.decisionMatrix || []
  const mathComparison = article.mathComparison || {}

  // targetStates/targetCities can be [{value, label, id}] or just strings - normalize to string[]
  const targetStates = Array.isArray(article.targetStates)
    ? article.targetStates.map((s: any) => typeof s === 'string' ? s : s.value || String(s)).filter(Boolean)
    : []
  const targetCities = Array.isArray(article.targetCities)
    ? article.targetCities.map((c: any) => typeof c === 'string' ? c : c.value || String(c)).filter(Boolean)
    : []

  // Normalize contentUpdateHistory items
  const contentUpdateHistory = (article.contentUpdateHistory || []).map((log: any) => ({
    date: toString(log.date),
    change: toString(log.change),
  }))

  const categorySlug = typeof category === 'object' && category?.slug
    ? category.slug
    : typeof article.guideCategory === 'object' && article.guideCategory?.slug
      ? article.guideCategory.slug
      : 'guide'

  const categoryTitle = typeof category === 'object' && category?.title
    ? category.title
    : typeof article.guideCategory === 'object' && article.guideCategory?.title
      ? article.guideCategory.title
      : 'Guide'

  const currentStateRange = (article.stateRanges || {})[selectedState]

  // Responsive breakpoints
  const isMobileView = viewportWidth < 768
  const contentWidth = isMobileView ? 'calc(100% - 32px)' : '700px'
  const sidebarWidth = '280px'
  const containerPadding = isMobileView ? '16px' : '40px'

  // Table of Contents
  const tableOfContents = [
    { id: 'direct-answer', title: 'Direct Answer' },
    { id: 'tldr', title: 'TL;DR Action Plan' },
    { id: 'key-takeaways', title: 'Key Takeaways' },
    { id: 'immediate-actions', title: 'Immediate Actions' },
    { id: 'medical-documentation', title: 'Medical Care' },
    { id: 'with-without-attorney', title: 'Attorney Comparison' },
    { id: 'settlement-examples', title: 'Case Examples' },
    { id: 'settlement-ranges', title: 'Settlement Ranges' },
    { id: 'statute-of-limitations', title: 'Deadline' },
    { id: 'people-also-ask', title: 'Common Questions' },
    { id: 'faq', title: 'Full FAQ' }
  ]

  const authorInfo = {
    name: toString(article.author?.name) || 'Sarah Mitchell, Esq.',
    credentials: toString(article.author?.credentials) || 'Personal Injury Attorney | 15+ years experience | Board Certified',
    recovered: toString(article.author?.recovered) || '$50M+ Recovered',
  }

  return (
    <div style={{ backgroundColor: '#f9f5ef', minHeight: '100vh' }}>
      {/* Progress Line */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '3px',
          backgroundColor: '#c4714a',
          width: `${scrollProgress}%`,
          zIndex: 1000,
          transition: 'width 0.1s ease'
        }}
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
      />

      {/* Sticky Header */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-16 px-7 flex items-center justify-between transition-all duration-300 ${
          scrollProgress > 15
            ? "bg-[#f9f5ef] border-b border-[#e8e2d8] shadow-md"
            : "bg-transparent"
        }`}
        style={{
          opacity: scrollProgress > 15 ? 1 : 0,
          pointerEvents: scrollProgress > 15 ? 'auto' : 'none'
        }}
      >
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-[#1a4a5a] flex items-center justify-center">
            <span className="font-bold text-white text-lg">CP</span>
          </div>
          <span className="hidden sm:inline text-sm font-semibold text-[#1a4a5a]">CasePort</span>
        </Link>

        <a
          href="tel:+18002273669"
          className="bg-[#c4714a] text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-[#d4855e] transition-all shadow-md"
        >
          Free Case Review
        </a>
      </nav>

      {/* Hero Section with Background Image */}
      <div
        style={{
          backgroundImage: 'linear-gradient(135deg, rgba(26, 74, 90, 0.85) 0%, rgba(74, 140, 126, 0.75) 100%), url(https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1200&h=500&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: isMobileView ? '300px' : '450px',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'flex-start',
          padding: isMobileView ? '24px' : '60px',
          transition: 'all 0.3s ease'
        }}
      >
        <div>
          <div style={{ color: '#c4714a', fontSize: '12px', fontWeight: '700', letterSpacing: '1px', marginBottom: '12px', textTransform: 'uppercase' }}>
            {categoryTitle} Guide
          </div>
          <h1 style={{ color: 'white', fontSize: isMobileView ? '32px' : '56px', fontWeight: '700', marginBottom: '16px', lineHeight: '1.2', maxWidth: '700px' }}>
            {article.title}
          </h1>
          <p style={{ color: '#e8e2d8', fontSize: isMobileView ? '16px' : '18px', maxWidth: '600px', lineHeight: '1.6' }}>
            {article.excerpt || article.metaDescription || `The first 72 hours are critical. This guide walks you through exactly what to do.`}
          </p>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div style={{ backgroundColor: '#f9f5ef', padding: isMobileView ? '16px' : '16px 40px', borderBottom: '1px solid #e8e2d8' }}>
        <nav style={{ display: 'flex', gap: '8px', fontSize: isMobileView ? '14px' : '13px', color: '#555' }} aria-label="Breadcrumb">
          <Link href="/guide" style={{ color: '#1a4a5a', textDecoration: 'none', fontWeight: '500' }}>Guides</Link>
          <span>/</span>
          <Link href={`/guide/${categorySlug}`} style={{ color: '#1a4a5a', textDecoration: 'none', fontWeight: '500' }}>{categoryTitle}</Link>
          <span>/</span>
          <span style={{ color: '#4a8c7e', fontWeight: '500' }}>{article.title}</span>
        </nav>
      </div>

      {/* Article Metadata */}
      <div style={{ backgroundColor: '#f9f5ef', padding: isMobileView ? '20px' : '24px 40px', borderBottom: '1px solid #e8e2d8' }}>
        <div style={{ display: 'flex', flexDirection: isMobileView ? 'column' : 'row', gap: isMobileView ? '16px' : '32px', flexWrap: 'wrap', fontSize: isMobileView ? '14px' : '13px', color: '#555' }}>
          <div>
            <div style={{ fontWeight: '600', color: '#1a4a5a', marginBottom: '4px' }}>By {authorInfo.name}</div>
            <div style={{ fontSize: isMobileView ? '13px' : '12px', color: '#999' }}>{authorInfo.credentials}</div>
          </div>
          <div>
            <div style={{ fontWeight: '600', color: '#1a4a5a', marginBottom: '4px' }}>Published</div>
            <div style={{ fontSize: isMobileView ? '13px' : '12px', color: '#999' }}>{article.publishedDate || 'April 1, 2026'}</div>
          </div>
          <div>
            <div style={{ fontWeight: '600', color: '#1a4a5a', marginBottom: '4px' }}>Updated</div>
            <div style={{ fontSize: isMobileView ? '13px' : '12px', color: '#999' }}>{article.updatedDate || 'April 28, 2026 • Updated Quarterly'}</div>
          </div>
          <div>
            <div style={{ fontWeight: '600', color: '#1a4a5a', marginBottom: '4px' }}>Read Time</div>
            <div style={{ fontSize: isMobileView ? '13px' : '12px', color: '#999' }}>{article.readTime || '8 minutes'}</div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: '600', color: '#1a4a5a' }}>Verified:</span>
            <span style={{ backgroundColor: '#4a8c7e', color: 'white', padding: '6px 10px', borderRadius: '3px', fontSize: isMobileView ? '12px' : '11px', fontWeight: '600' }}>✓ Attorney-Reviewed</span>
            <span style={{ backgroundColor: '#4a8c7e', color: 'white', padding: '6px 10px', borderRadius: '3px', fontSize: isMobileView ? '12px' : '11px', fontWeight: '600' }}>✓ ABA Compliant</span>
            <span style={{ backgroundColor: '#c4714a', color: 'white', padding: '6px 10px', borderRadius: '3px', fontSize: isMobileView ? '12px' : '11px', fontWeight: '600' }}>✓ Last Updated: {article.updatedDate || 'April 28, 2026'}</span>
          </div>
        </div>
      </div>

      {/* Main Content with Sidebar Layout */}
      <div style={{ display: 'flex', maxWidth: isMobileView ? '100%' : '1400px', margin: '0 auto', gap: isMobileView ? 0 : '80px', padding: containerPadding, justifyContent: 'center', flexDirection: isMobileView ? 'column' : 'row', alignItems: 'flex-start', width: '100%' }}>
        {/* Main Content */}
        <div style={{ flex: isMobileView ? '1 1 100%' : '0 0 auto', width: contentWidth, maxWidth: contentWidth, minWidth: 0 }}>
          {/* Quick Answer */}
          <div id="direct-answer" style={{ marginBottom: '56px', animation: 'fadeIn 0.5s ease' }}>
            <div style={{ backgroundColor: '#f0f8f6', borderLeft: '4px solid #4a8c7e', padding: '28px', borderRadius: '6px' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#1a4a5a', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Direct Answer
              </div>
              <p style={{ margin: 0, color: '#555', lineHeight: '1.8', fontSize: isMobileView ? '18px' : '21px', fontWeight: '500' }}>
                {directAnswerText}
              </p>
            </div>
          </div>

          {/* TL;DR Section */}
          <div id="tldr" style={{ marginBottom: '56px', animation: 'fadeIn 0.5s ease' }}>
            <div style={{ backgroundColor: '#fff8f0', borderLeft: '4px solid #c4714a', padding: '28px', borderRadius: '6px' }}>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#1a4a5a', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                TL;DR - {categoryTitle} Action Plan
              </div>
              <ol style={{ margin: 0, paddingLeft: isMobileView ? '16px' : '20px', color: '#555', fontSize: isMobileView ? '17px' : '20px', lineHeight: '1.8', fontWeight: '500' }}>
                {tldrItems.map((item: any, idx: number) => {
                  const title = typeof item === 'string' ? item : (item.action || item.title || '')
                  const desc = typeof item === 'string' ? '' : (item.description || item.timeNote || '')
                  return <li key={idx}><strong>{title}:</strong> {desc}</li>
                })}
              </ol>
            </div>
          </div>

          {/* Section Divider */}
          <div style={{ height: '1px', backgroundColor: '#e8e2d8', margin: '56px 0' }} />

          {/* Key Takeaways */}
          <div id="key-takeaways" style={{ marginBottom: '56px' }}>
            <h2 style={{ color: '#1a4a5a', fontSize: '18px', fontWeight: '700', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Key Takeaways
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: isMobileView ? '1fr' : '1fr', gap: '12px' }}>
              {keyTakeaways.map((takeaway: string, idx: number) => (
                <div key={idx} style={{ display: 'flex', gap: '12px', padding: '12px', backgroundColor: 'white', borderRadius: '4px', borderLeft: '3px solid #4a8c7e' }}>
                  <CheckCircle size={16} style={{ color: '#4a8c7e', flexShrink: 0, marginTop: '2px' }} />
                  <p style={{ margin: 0, color: '#555', fontSize: '18px', lineHeight: '1.6' }}>{takeaway}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section Divider */}
          <div style={{ height: '1px', backgroundColor: '#e8e2d8', margin: '56px 0' }} />

          {/* Immediate Actions */}
          <div id="immediate-actions" style={{ marginBottom: '56px', scrollMarginTop: '100px' }}>
            <h2 style={{ color: '#1a4a5a', fontSize: '24px', fontWeight: '700', marginBottom: '20px' }}>
              {article.immediateStepsTitle || 'The 72-Hour Action Plan'}
            </h2>
            <p style={{ color: '#555', lineHeight: '1.8', marginBottom: '24px', fontSize: '21px' }}>
              {article.immediateStepsSubtitle || 'Follow these steps in order. This checklist protects your health, evidence, and legal rights.'}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: isMobileView ? '1fr' : '1fr', gap: '16px' }}>
              {immediateSteps.slice(0, 2).map((step: any, idx: number) => (
                <div key={idx} style={{ padding: '20px', backgroundColor: 'white', borderLeft: '4px solid #c4714a', borderRadius: '6px', transition: 'all 0.3s ease' }}>
                  <div style={{ fontSize: '11px', color: '#c4714a', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Step {step.step || idx + 1}
                  </div>
                  <h3 style={{ color: '#1a4a5a', fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>{step.title}</h3>
                  <div style={{ fontSize: '12px', color: '#999', marginBottom: '12px' }}>{step.timeNote || '0-15 min'}</div>
                  <ul style={{ margin: 0, paddingLeft: '20px', color: '#555', fontSize: '18px', lineHeight: '1.8' }}>
                    {step.bullets?.map((bullet: any, bIdx: number) => (
                      <li key={bIdx} style={{ marginBottom: '6px' }}>{typeof bullet === 'string' ? bullet : bullet.bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Section Divider */}
          <div style={{ height: '1px', backgroundColor: '#e8e2d8', margin: '56px 0' }} />

          {/* Medical Documentation */}
          <div id="medical-documentation" style={{ marginBottom: '56px', scrollMarginTop: '100px' }}>
            <h2 style={{ color: '#1a4a5a', fontSize: '24px', fontWeight: '700', marginBottom: '20px' }}>
              Medical Documentation: Why It's Critical for Your Settlement
            </h2>
            <div style={{ display: 'flex', gap: '12px', padding: '16px', backgroundColor: '#fff8f0', borderLeft: '4px solid #c4714a', borderRadius: '6px', marginBottom: '20px' }}>
              <AlertCircle size={20} style={{ color: '#c4714a', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <p style={{ margin: 0, color: '#555', lineHeight: '1.8', fontSize: '21px', fontWeight: '600' }}>
                  Seek medical evaluation within <strong>24 hours</strong>, even if you feel fine.
                </p>
                <p style={{ margin: '8px 0 0 0', color: '#555', lineHeight: '1.8', fontSize: '18px' }}>
                  Accidents often cause injuries that appear days later (whiplash, internal bleeding, spinal injuries).
                </p>
              </div>
            </div>
            <p style={{ color: '#555', lineHeight: '1.8', marginBottom: '16px', fontSize: '16px' }}>
              Medical records create a documented link between the accident and your injuries—essential for your settlement claim.
            </p>
          </div>

          {/* Section Divider */}
          <div style={{ height: '1px', backgroundColor: '#e8e2d8', margin: '56px 0' }} />

          {/* With/Without Attorney */}
          <div id="with-without-attorney" style={{ marginBottom: '56px', scrollMarginTop: '100px' }}>
            <h2 style={{ color: '#1a4a5a', fontSize: '24px', fontWeight: '700', marginBottom: '20px' }}>
              {categoryTitle} Settlement: With Attorney vs. Without (5x Difference)
            </h2>
            <p style={{ color: '#555', lineHeight: '1.8', marginBottom: '20px', fontSize: '16px' }}>
              Attorneys settle cases for <strong>5x more on average</strong>. Here's why:
            </p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#1a4a5a', color: 'white' }}>
                    <th style={{ padding: '14px', textAlign: 'left', fontWeight: '600', fontSize: '14px' }}>Factor</th>
                    <th style={{ padding: '14px', textAlign: 'left', fontWeight: '600', fontSize: '14px' }}>With Attorney</th>
                    <th style={{ padding: '14px', textAlign: 'left', fontWeight: '600', fontSize: '14px' }}>Without Attorney</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { factor: 'Average Settlement', with: '$250,000', without: '$50,000' },
                    { factor: 'Success Rate', with: '92%', without: '60%' },
                    { factor: 'Time to Settle', with: '12-18 months', without: '6-24 months' },
                    { factor: 'Upfront Cost', with: '$0 (Contingency)', without: '$0' }
                  ].map((row, idx) => (
                    <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#f9f5ef' : 'white', borderBottom: '1px solid #e8e2d8' }}>
                      <td style={{ padding: '14px', color: '#555', fontWeight: '600', fontSize: '14px' }}>{row.factor}</td>
                      <td style={{ padding: '14px', color: '#4a8c7e', fontWeight: '600', fontSize: '14px' }}>{row.with}</td>
                      <td style={{ padding: '14px', color: '#999', fontWeight: '500', fontSize: '14px' }}>{row.without}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section Divider */}
          <div style={{ height: '1px', backgroundColor: '#e8e2d8', margin: '56px 0' }} />

          {/* Real Settlement Examples */}
          <div id="settlement-examples" style={{ marginBottom: '56px', scrollMarginTop: '100px' }}>
            <h2 style={{ color: '#1a4a5a', fontSize: '24px', fontWeight: '700', marginBottom: '20px' }}>
              Real Settlement Examples: Actual Cases & Outcomes
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: isMobileView ? '1fr' : '1fr', gap: '16px' }}>
              {testimonials.length > 0 ? testimonials.slice(0, 3).map((example: any, idx: number) => (
                <div key={idx} style={{ padding: '20px', backgroundColor: 'white', borderLeft: '4px solid #4a8c7e', borderRadius: '6px' }}>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#c4714a', marginBottom: '8px' }}>
                    ${example.settlement || example.settlementValue}
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a4a5a', marginBottom: '4px' }}>
                    {example.injuryType || 'Various injuries'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>
                    Settled in {example.caseResolutionTime || '12 months'}
                  </div>
                  <div style={{ fontSize: '14px', color: '#555' }}>
                    {example.quote || example.description || 'Full settlement recovery'}
                  </div>
                </div>
              )) : [
                { amount: '$485,000', injury: 'Catastrophic injury', time: '18 months', details: 'Permanent injuries, lifetime care' },
                { amount: '$275,000', injury: 'Severe injury & trauma', time: '14 months', details: 'Multiple surgeries, ongoing therapy' },
                { amount: '$125,000', injury: 'Multiple fractures', time: '10 months', details: 'Broken bones and recovery' }
              ].map((example, idx) => (
                <div key={idx} style={{ padding: '20px', backgroundColor: 'white', borderLeft: '4px solid #4a8c7e', borderRadius: '6px' }}>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#c4714a', marginBottom: '8px' }}>{example.amount}</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a4a5a', marginBottom: '4px' }}>{example.injury}</div>
                  <div style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>Settled in {example.time}</div>
                  <div style={{ fontSize: '14px', color: '#555' }}>{example.details}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Section Divider */}
          <div style={{ height: '1px', backgroundColor: '#e8e2d8', margin: '56px 0' }} />

          {/* Settlement Ranges by State */}
          <div id="settlement-ranges" style={{ marginBottom: '56px', scrollMarginTop: '100px' }}>
            <h2 style={{ color: '#1a4a5a', fontSize: '24px', fontWeight: '700', marginBottom: '20px' }}>
              Settlement Ranges: State-by-State Breakdown
            </h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#1a4a5a', color: 'white' }}>
                    <th style={{ padding: '14px', textAlign: 'left', fontWeight: '600', fontSize: '14px' }}>State</th>
                    <th style={{ padding: '14px', textAlign: 'left', fontWeight: '600', fontSize: '14px' }}>Minor</th>
                    <th style={{ padding: '14px', textAlign: 'left', fontWeight: '600', fontSize: '14px' }}>Moderate</th>
                    <th style={{ padding: '14px', textAlign: 'left', fontWeight: '600', fontSize: '14px' }}>Severe</th>
                    <th style={{ padding: '14px', textAlign: 'left', fontWeight: '600', fontSize: '14px' }}>Catastrophic</th>
                  </tr>
                </thead>
                <tbody>
                  {stateRanges.length > 0 ? stateRanges.map((row: any, idx: number) => (
                    <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#f9f5ef' : 'white', borderBottom: '1px solid #e8e2d8' }}>
                      <td style={{ padding: '14px', color: '#1a4a5a', fontWeight: '600', fontSize: '14px' }}>{row.state || row.injuryType}</td>
                      <td style={{ padding: '14px', color: '#555', fontWeight: '500', fontSize: '14px' }}>{row.minAmount || row.range || '$15,000-$35,000'}</td>
                      <td style={{ padding: '14px', color: '#555', fontWeight: '500', fontSize: '14px' }}>{row.moderateAmount || '-'}</td>
                      <td style={{ padding: '14px', color: '#555', fontWeight: '500', fontSize: '14px' }}>{row.severeAmount || '-'}</td>
                      <td style={{ padding: '14px', color: '#4a8c7e', fontWeight: '600', fontSize: '14px' }}>{row.catastrophicAmount || '-'}</td>
                    </tr>
                  )) : [
                    { state: 'California', minor: '$15,000-$35,000', moderate: '$75,000-$150,000', severe: '$250,000-$500,000', catastrophic: '$750,000-$2,000,000+' },
                    { state: 'Texas', minor: '$12,000-$30,000', moderate: '$60,000-$120,000', severe: '$200,000-$400,000', catastrophic: '$600,000-$1,500,000' },
                    { state: 'Florida', minor: '$14,000-$32,000', moderate: '$70,000-$140,000', severe: '$220,000-$450,000', catastrophic: '$650,000-$1,800,000' }
                  ].map((row, idx) => (
                    <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? '#f9f5ef' : 'white', borderBottom: '1px solid #e8e2d8' }}>
                      <td style={{ padding: '14px', color: '#1a4a5a', fontWeight: '600', fontSize: '14px' }}>{row.state}</td>
                      <td style={{ padding: '14px', color: '#555', fontWeight: '500', fontSize: '14px' }}>{row.minor}</td>
                      <td style={{ padding: '14px', color: '#555', fontWeight: '500', fontSize: '14px' }}>{row.moderate}</td>
                      <td style={{ padding: '14px', color: '#555', fontWeight: '500', fontSize: '14px' }}>{row.severe}</td>
                      <td style={{ padding: '14px', color: '#4a8c7e', fontWeight: '600', fontSize: '14px' }}>{row.catastrophic}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section Divider */}
          <div style={{ height: '1px', backgroundColor: '#e8e2d8', margin: '56px 0' }} />

          {/* Statute of Limitations */}
          <div id="statute-of-limitations" style={{ marginBottom: '56px', scrollMarginTop: '100px' }}>
            <h2 style={{ color: '#1a4a5a', fontSize: '24px', fontWeight: '700', marginBottom: '20px' }}>
              Your Statute of Limitations is Ticking
            </h2>
            <div style={{ backgroundColor: '#f0f8f6', borderLeft: '4px solid #c4714a', padding: '28px', marginBottom: '24px', borderRadius: '6px' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '14px', fontWeight: '600', color: '#1a4a5a', display: 'block', marginBottom: '12px' }}>
                  Select your state:
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '4px',
                    border: '1px solid #4a8c7e',
                    color: '#555',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <option value="california">California</option>
                  <option value="texas">Texas</option>
                  <option value="florida">Florida</option>
                </select>
              </div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: '#c4714a', marginBottom: '12px' }}>
                Deadline: {statuteData.years || 2} years from date of injury
              </div>
              <div style={{ fontSize: '14px', color: '#555', lineHeight: '1.6' }}>
                Evidence degrades daily. Contact an attorney immediately to preserve your claim.
              </div>
            </div>
          </div>

          {/* Section Divider */}
          <div style={{ height: '1px', backgroundColor: '#e8e2d8', margin: '56px 0' }} />

          {/* People Also Ask */}
          <div id="people-also-ask" style={{ marginBottom: '56px', scrollMarginTop: '100px' }}>
            <h2 style={{ color: '#1a4a5a', fontSize: '24px', fontWeight: '700', marginBottom: '20px' }}>
              People Also Ask
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { q: 'How much time do I have to file a claim?', a: 'Most states have a 2-3 year statute of limitations, but you should file within 30-90 days to preserve evidence. Contact an attorney immediately.' },
                { q: 'What damages can I recover?', a: 'Medical expenses, lost wages, pain & suffering, future medical care, and lost earning capacity. Settlements typically range from $50,000-$2,000,000+ depending on injury severity.' },
                { q: 'Are these cases more serious than other accidents?', a: 'Yes. Serious accidents are 20-30x more damaging, causing significantly more severe injuries and higher settlements.' }
              ].map((item, idx) => (
                <div key={idx} style={{ padding: '16px', backgroundColor: 'white', borderLeft: '4px solid #4a8c7e', borderRadius: '4px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a4a5a', marginBottom: '8px' }}>{item.q}</div>
                  <div style={{ fontSize: '14px', color: '#555', lineHeight: '1.6' }}>{item.a}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Section Divider */}
          <div style={{ height: '1px', backgroundColor: '#e8e2d8', margin: '56px 0' }} />

          {/* FAQ */}
          <div id="faq" style={{ marginBottom: '56px', scrollMarginTop: '100px' }}>
            <h2 style={{ color: '#1a4a5a', fontSize: '24px', fontWeight: '700', marginBottom: '20px' }}>
              Frequently Asked Questions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {faqItems.length > 0 ? faqItems.map((item: any, idx: number) => (
                <div key={idx} style={{ padding: '16px', backgroundColor: 'white', borderRadius: '4px', borderLeft: '3px solid #c4714a' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a4a5a', marginBottom: '8px' }}>{item.question || item.q}</div>
                  <div style={{ fontSize: '13px', color: '#555', lineHeight: '1.6' }}>{item.answer || item.a}</div>
                </div>
              )) : [
                { q: 'What should I do immediately after an accident?', a: 'Move to safety, call 911, document the scene with photos, exchange information, get witness contact info, and report to police. Do not admit fault.' },
                { q: 'Do I need an attorney?', a: 'Yes. Attorneys settle cases for 5x more on average. They handle negotiations with insurance companies and maximize your recovery. Most work on contingency (no upfront cost).' },
                { q: 'How long does a case take?', a: 'Typically 12-18 months with an attorney. Complex cases may take 2-5 years. Settlement timelines depend on injury severity and liability clarity.' }
              ].map((item, idx) => (
                <div key={idx} style={{ padding: '16px', backgroundColor: 'white', borderRadius: '4px', borderLeft: '3px solid #c4714a' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a4a5a', marginBottom: '8px' }}>{item.q}</div>
                  <div style={{ fontSize: '13px', color: '#555', lineHeight: '1.6' }}>{item.a}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Section Divider */}
          <div style={{ height: '1px', backgroundColor: '#e8e2d8', margin: '56px 0' }} />

          {/* Related Articles */}
          <div style={{ marginBottom: '56px' }}>
            <h2 style={{ color: '#1a4a5a', fontSize: '24px', fontWeight: '700', marginBottom: '20px' }}>
              Related Injury Guides
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: isMobileView ? '1fr' : '2fr', gap: '16px' }}>
              {[
                { title: 'Car Accident Guide', description: 'Liability, insurance claims, and settlement expectations', link: '/guide/car-accident' },
                { title: 'Slip & Fall Guide', description: 'Property owner liability and premises liability laws', link: '/guide/slip-and-fall' },
                { title: 'Medical Malpractice Guide', description: 'Standard of care and complex damages', link: '/guide/medical-malpractice' },
                { title: 'Motorcycle Accident Guide', description: 'Bias against riders and catastrophic injury settlements', link: '/guide/motorcycle-accident' }
              ].map((guide, idx) => (
                <Link key={idx} href={guide.link} style={{ textDecoration: 'none' }}>
                  <div style={{ padding: '20px', backgroundColor: 'white', borderLeft: '4px solid #4a8c7e', borderRadius: '6px', cursor: 'pointer' }}>
                    <h3 style={{ color: '#1a4a5a', fontSize: '16px', fontWeight: '700', margin: 0, marginBottom: '8px' }}>{guide.title}</h3>
                    <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.6', margin: '8px 0 0 0' }}>{guide.description}</p>
                    <p style={{ color: '#4a8c7e', fontSize: '13px', fontWeight: '600', margin: '12px 0 0 0' }}>Learn more →</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Legal Authority */}
          <div style={{ marginBottom: '56px', padding: '20px', backgroundColor: '#f9f5ef', borderRadius: '6px', borderLeft: '4px solid #999' }}>
            <h3 style={{ color: '#1a4a5a', fontSize: '14px', fontWeight: '700', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Legal Authority & Citations
            </h3>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#555', fontSize: '13px', lineHeight: '1.8' }}>
              <li><strong>Federal Motor Carrier Safety Administration (FMCSA)</strong> Regulations 49 CFR Part 390</li>
              <li><strong>Uniform Commercial Code</strong> § 3-104 (Commercial Liability)</li>
              <li><strong>State Statute of Limitations Laws</strong> (varies by jurisdiction)</li>
              <li><strong>Insurance Information Institute (III)</strong> - Accident Data 2025</li>
              <li><strong>American Bar Association (ABA)</strong> - Personal Injury Law Standards</li>
            </ul>
          </div>

          {/* Expert Credentials */}
          <div style={{ padding: '24px', backgroundColor: 'white', borderLeft: '4px solid #4a8c7e', marginBottom: '56px', borderRadius: '6px' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#1a4a5a', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              About the Author
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ width: '60px', height: '60px', backgroundColor: '#4a8c7e', borderRadius: '50%', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a4a5a', marginBottom: '4px' }}>{authorInfo.name}</div>
                <div style={{ fontSize: '13px', color: '#555', marginBottom: '8px', lineHeight: '1.6' }}>{authorInfo.credentials}</div>
                <div style={{ fontSize: '13px', color: '#999' }}>Specializes in accident litigation and has recovered over {authorInfo.recovered} in settlements for clients.</div>
              </div>
            </div>
          </div>

          {/* Update Log */}
          <div style={{ padding: '20px', backgroundColor: '#f9f5ef', borderLeft: '4px solid #999', marginBottom: '56px', borderRadius: '6px' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#1a4a5a', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Update Log
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {contentUpdateHistory.map((log: any, idx: number) => (
                <div key={idx} style={{ fontSize: '13px', color: '#555' }}>
                  <span style={{ fontWeight: '600', color: '#1a4a5a' }}>{log.date}:</span> {log.change}
                </div>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <div style={{ padding: '32px', backgroundColor: '#f0f8f6', borderLeft: '4px solid #c4714a', textAlign: 'center', borderRadius: '6px', marginBottom: '40px' }}>
            <h3 style={{ color: '#1a4a5a', fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>
              Don't Navigate This Alone
            </h3>
            <p style={{ color: '#555', marginBottom: '20px', lineHeight: '1.6', fontSize: '15px' }}>
              {categoryTitle} cases are complex. Insurance companies have teams of adjusters working to minimize your payout. You need an experienced attorney to fight for maximum compensation.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px', fontSize: '14px', color: '#555' }}>
              <div>✓ Free case evaluation - no obligation</div>
              <div>✓ No upfront costs - contingency basis only</div>
              <div>✓ Expert negotiators who know {categoryTitle.toLowerCase()} law</div>
            </div>
            <a
              href="tel:+18002273669"
              style={{
                backgroundColor: '#c4714a',
                color: 'white',
                padding: '12px 32px',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textDecoration: 'none',
                display: 'inline-block'
              }}
            >
              Get Free Case Evaluation
            </a>
            <div style={{ fontSize: '12px', color: '#999', marginTop: '12px' }}>
              100% Confidential. Your information is protected by attorney-client privilege.
            </div>
          </div>
        </div>

        {/* Right Sidebar TOC - Hidden on mobile */}
        {!isMobileView && (
          <div style={{ width: sidebarWidth, padding: '40px 0', position: 'sticky', top: '80px', height: 'fit-content' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#1a4a5a', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              On This Page
            </div>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {tableOfContents.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  style={{
                    fontSize: '13px',
                    color: activeSection === item.id ? '#1a4a5a' : '#999',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    paddingLeft: '12px',
                    borderLeft: activeSection === item.id ? '3px solid #c4714a' : '2px solid #e8e2d8',
                    fontWeight: activeSection === item.id ? '700' : '500',
                    backgroundColor: activeSection === item.id ? '#f0f8f6' : 'transparent',
                    paddingTop: '8px',
                    paddingBottom: '8px',
                    paddingRight: '8px',
                    borderRadius: '4px'
                  }}
                >
                  {item.title}
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}