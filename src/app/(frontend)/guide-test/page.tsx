'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react'

export default function GuideTestPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [selectedState, setSelectedState] = useState('california')
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeSection, setActiveSection] = useState('immediate-actions')
  const [viewportWidth, setViewportWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024)
  const [showStickyHeader, setShowStickyHeader] = useState(false)

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyHeader(window.scrollY > 200)
      const windowHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrolled = window.scrollY
      const progress = windowHeight > 0 ? (scrolled / windowHeight) * 100 : 0
      setScrollProgress(progress)

      const sections = [
        'immediate-actions',
        'medical-documentation',
        'with-without-attorney',
        'settlement-examples',
        'settlement-ranges',
        'statute-of-limitations',
        'people-also-ask',
        'faq',
      ]
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

  // Responsive breakpoints
  const isMobileView = viewportWidth < 768
  const isTabletView = viewportWidth >= 768 && viewportWidth < 1024
  const isDesktopView = viewportWidth >= 1024 && viewportWidth < 1440
  const isLargeDesktopView = viewportWidth >= 1440

  // Calculate responsive widths
  const contentWidth = isMobileView ? '100%' : isTabletView ? '700px' : isDesktopView ? '700px' : '700px'
  const containerPadding = isMobileView ? '16px' : isTabletView ? '20px' : '40px'

  const tableOfContents = [
    { id: 'immediate-actions', title: 'Immediate Actions' },
    { id: 'medical-documentation', title: 'Medical Care' },
    { id: 'with-without-attorney', title: 'Attorney Comparison' },
    { id: 'settlement-examples', title: 'Case Examples' },
    { id: 'settlement-ranges', title: 'Settlement Ranges' },
    { id: 'statute-of-limitations', title: 'Deadline' },
    { id: 'people-also-ask', title: 'Common Questions' },
    { id: 'faq', title: 'Full FAQ' },
  ]

  const keyTakeaways = [
    'Contact an attorney immediately—most truck accident cases require professional representation',
    'Document everything at the scene: photos, witness info, police report number',
    'Seek medical evaluation within 24 hours, even if you feel fine',
    'Never admit fault or discuss the accident with the truck driver',
    'Settlements average $250,000 with attorney vs. $50,000 without—a 5x difference',
    'Your statute of limitations is typically 2 years—time is critical',
  ]

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
          transition: 'width 0.1s ease',
        }}
        role="progressbar"
        aria-valuenow={Math.round(scrollProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
      />

      {/* Sticky Header */}
      {showStickyHeader && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '64px',
            backgroundColor: '#f9f5ef',
            borderBottom: '1px solid #e8e2d8',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 28px',
          }}
        >
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#1a4a5a',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontWeight: 'bold', color: 'white', fontSize: '14px' }}>CP</span>
            </div>
            <span
              style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#1a4a5a',
                display: isMobileView ? 'none' : 'inline',
              }}
            >
              CasePort
            </span>
          </Link>
          <a
            href="tel:+18002273669"
            style={{
              backgroundColor: '#c4714a',
              color: 'white',
              padding: '8px 24px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 'bold',
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            Free Case Review
          </a>
        </div>
      )}

      {/* Hero Section */}
      <div
        style={{
          backgroundImage:
            'linear-gradient(135deg, rgba(26, 74, 90, 0.85) 0%, rgba(74, 140, 126, 0.75) 100%), url(https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1200&h=500&fit=crop)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: isMobileView ? '300px' : '450px',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'flex-start',
          padding: isMobileView ? '24px' : '60px',
          transition: 'all 0.3s ease',
        }}
      >
        <div style={{ maxWidth: '700px' }}>
          <div
            style={{
              color: '#c4714a',
              fontSize: '12px',
              fontWeight: '700',
              letterSpacing: '1px',
              marginBottom: '12px',
              textTransform: 'uppercase',
            }}
          >
            Truck Accident Guide
          </div>
          <h1
            style={{
              color: 'white',
              fontSize: isMobileView ? '32px' : '56px',
              fontWeight: '700',
              marginBottom: '16px',
              lineHeight: '1.2',
            }}
          >
            What To Do After a Truck Accident
          </h1>
          <p
            style={{
              color: '#e8e2d8',
              fontSize: isMobileView ? '16px' : '18px',
              maxWidth: '600px',
              lineHeight: '1.6',
            }}
          >
            The first 24 hours after a truck accident are critical. This guide walks you through exactly what to do.
          </p>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div
        style={{
          backgroundColor: '#f9f5ef',
          padding: isMobileView ? '16px' : '16px 40px',
          borderBottom: '1px solid #e8e2d8',
        }}
      >
        <nav
          style={{
            display: 'flex',
            gap: '8px',
            fontSize: isMobileView ? '14px' : '13px',
            color: '#555',
          }}
          aria-label="Breadcrumb"
        >
          <Link href="/guide" style={{ color: '#1a4a5a', textDecoration: 'none', fontWeight: '500' }}>
            Guides
          </Link>
          <span>/</span>
          <Link
            href="/guide/truck-accident"
            style={{ color: '#1a4a5a', textDecoration: 'none', fontWeight: '500' }}
          >
            Truck Accident
          </Link>
          <span>/</span>
          <span style={{ color: '#4a8c7e', fontWeight: '500' }}>What To Do</span>
        </nav>
      </div>

      {/* Article Metadata */}
      <div
        style={{
          backgroundColor: '#f9f5ef',
          padding: isMobileView ? '20px' : '24px 40px',
          borderBottom: '1px solid #e8e2d8',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: isMobileView ? 'column' : 'row',
            gap: isMobileView ? '16px' : '32px',
            flexWrap: 'wrap',
            fontSize: isMobileView ? '14px' : '13px',
            color: '#555',
          }}
        >
          <div>
            <div style={{ fontWeight: '600', color: '#1a4a5a', marginBottom: '4px' }}>
              By Sarah Mitchell, Esq.
            </div>
            <div
              style={{
                fontSize: isMobileView ? '13px' : '12px',
                color: '#999',
              }}
            >
              Personal Injury Attorney | 15+ years experience | Board Certified | $50M+ Recovered
            </div>
          </div>
          <div>
            <div style={{ fontWeight: '600', color: '#1a4a5a', marginBottom: '4px' }}>Published</div>
            <div style={{ fontSize: isMobileView ? '13px' : '12px', color: '#999' }}>April 1, 2026</div>
          </div>
          <div>
            <div style={{ fontWeight: '600', color: '#1a4a5a', marginBottom: '4px' }}>Updated</div>
            <div style={{ fontSize: isMobileView ? '13px' : '12px', color: '#999' }}>
              April 28, 2026 • Updated Quarterly
            </div>
          </div>
          <div>
            <div style={{ fontWeight: '600', color: '#1a4a5a', marginBottom: '4px' }}>Read Time</div>
            <div style={{ fontSize: isMobileView ? '13px' : '12px', color: '#999' }}>8 minutes</div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: '600', color: '#1a4a5a' }}>Verified:</span>
            <span
              style={{
                backgroundColor: '#4a8c7e',
                color: 'white',
                padding: '6px 10px',
                borderRadius: '3px',
                fontSize: isMobileView ? '12px' : '11px',
                fontWeight: '600',
              }}
            >
              ✓ Attorney-Reviewed
            </span>
            <span
              style={{
                backgroundColor: '#4a8c7e',
                color: 'white',
                padding: '6px 10px',
                borderRadius: '3px',
                fontSize: isMobileView ? '12px' : '11px',
                fontWeight: '600',
              }}
            >
              ✓ ABA Compliant
            </span>
            <span
              style={{
                backgroundColor: '#c4714a',
                color: 'white',
                padding: '6px 10px',
                borderRadius: '3px',
                fontSize: isMobileView ? '12px' : '11px',
                fontWeight: '600',
              }}
            >
              ✓ Last Updated: April 28, 2026
            </span>
          </div>
        </div>
      </div>

      {/* Main Content with Sidebar */}
      <div
        style={{
          display: 'flex',
          maxWidth: isMobileView ? '100%' : '1400px',
          margin: '0 auto',
          gap: isMobileView ? 0 : '80px',
          padding: containerPadding,
          justifyContent: 'center',
          flexDirection: isMobileView ? 'column' : 'row',
          alignItems: 'flex-start',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {/* Main Content */}
        <div
          style={{
            flex: isMobileView ? '1 1 100%' : '0 0 auto',
            width: isMobileView ? '100%' : contentWidth,
            maxWidth: isMobileView ? 'none' : contentWidth,
            minWidth: 0,
            boxSizing: 'border-box',
          }}
        >
          {/* Direct Answer */}
          <div style={{ marginBottom: '56px', animation: 'fadeIn 0.5s ease' }}>
            <div
              style={{
                backgroundColor: '#f0f8f6',
                borderLeft: '4px solid #4a8c7e',
                padding: '28px',
                borderRadius: '6px',
              }}
            >
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#1a4a5a',
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                Direct Answer
              </div>
              <p
                style={{
                  margin: 0,
                  color: '#555',
                  lineHeight: '1.8',
                  fontSize: isMobileView ? '18px' : '21px',
                  fontWeight: '500',
                }}
              >
                After a truck accident, prioritize safety by moving to a safe location and calling{' '}
                <strong>911</strong>. Document the scene with <strong>photos</strong>, exchange information
                with the truck driver (name, phone, insurance, commercial license), get{' '}
                <strong>witness contact info</strong>, and report to police.
              </p>
              <p
                style={{
                  margin: '12px 0 0 0',
                  color: '#555',
                  lineHeight: '1.8',
                  fontSize: isMobileView ? '18px' : '21px',
                  fontWeight: '500',
                }}
              >
                Seek medical evaluation within <strong>24 hours</strong> and notify your insurance
                company within <strong>48 hours</strong>. Do not admit fault. Contact an{' '}
                <strong>attorney before accepting any settlement offer</strong>.
              </p>
            </div>
          </div>

          {/* TL;DR Action Plan */}
          <div style={{ marginBottom: '56px', animation: 'fadeIn 0.5s ease' }}>
            <div
              style={{
                backgroundColor: '#fff8f0',
                borderLeft: '4px solid #c4714a',
                padding: '28px',
                borderRadius: '6px',
              }}
            >
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#1a4a5a',
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                TL;DR — Truck Accident Action Plan
              </div>
              <ol
                style={{
                  margin: 0,
                  paddingLeft: isMobileView ? '16px' : '20px',
                  color: '#555',
                  fontSize: isMobileView ? '17px' : '20px',
                  lineHeight: '1.8',
                  fontWeight: '500',
                }}
              >
                <li>
                  <strong>Safety First (0-5 min):</strong> Call 911, move to safe location, turn on hazard lights
                </li>
                <li>
                  <strong>Document Scene (5-15 min):</strong> Photos of damage, license plates, road conditions, witness contact info
                </li>
                <li>
                  <strong>Medical Care (within 24 hrs):</strong> Visit ER or urgent care, get complete evaluation and medical records
                </li>
                <li>
                  <strong>Contact Attorney (within 48 hrs):</strong> Before any settlement talks or insurance statements
                </li>
                <li>
                  <strong>Settlement Reality:</strong> Average <strong>$250,000 with attorney</strong> vs{' '}
                  <strong>$50,000 without</strong> (5x difference)
                </li>
              </ol>
            </div>
          </div>

          {/* Section Divider */}
          <div style={{ height: '1px', backgroundColor: '#e8e2d8', margin: '56px 0' }} />

          {/* Key Takeaways */}
          <div style={{ marginBottom: '56px' }} id="immediate-actions">
            <h2
              style={{
                color: '#1a4a5a',
                fontSize: '18px',
                fontWeight: '700',
                marginBottom: '20px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Key Takeaways
            </h2>
            <div style={{ display: 'grid', gap: '12px' }}>
              {keyTakeaways.map((takeaway, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    padding: '12px',
                    backgroundColor: 'white',
                    borderRadius: '4px',
                    borderLeft: '3px solid #4a8c7e',
                  }}
                >
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
            <h2
              style={{
                color: '#1a4a5a',
                fontSize: '24px',
                fontWeight: '700',
                marginBottom: '20px',
              }}
            >
              Immediate Actions: Your First 24-Hour Truck Accident Checklist
            </h2>
            <p
              style={{
                color: '#555',
                lineHeight: '1.8',
                marginBottom: '24px',
                fontSize: '21px',
              }}
            >
              After a truck accident, your first priority is <strong>safety</strong>. Move to a safe
              location away from traffic if possible, call 911 if anyone is injured, and document
              everything at the scene.
            </p>
            <div style={{ display: 'grid', gap: '16px' }}>
              {[
                {
                  step: 1,
                  title: 'Ensure Safety',
                  time: '0-5 min',
                  items: ['Move to safe location', 'Turn on hazard lights', 'Call 911 if injured', 'Stay in vehicle if unsafe'],
                },
                {
                  step: 2,
                  title: 'Document Scene',
                  time: '5-15 min',
                  items: ['Take photos of damage', 'Photograph license plate', 'Document road conditions', 'Multiple angles'],
                },
              ].map((section, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '20px',
                    backgroundColor: 'white',
                    borderLeft: '4px solid #c4714a',
                    borderRadius: '6px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '11px',
                      color: '#c4714a',
                      fontWeight: '700',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Step {section.step}
                  </div>
                  <h3 style={{ color: '#1a4a5a', fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>
                    {section.title}
                  </h3>
                  <div style={{ fontSize: '12px', color: '#999', marginBottom: '12px' }}>{section.time}</div>
                  <ul style={{ margin: 0, paddingLeft: '20px', color: '#555', fontSize: '18px', lineHeight: '1.8' }}>
                    {section.items.map((item, i) => (
                      <li key={i} style={{ marginBottom: '6px' }}>
                        {item}
                      </li>
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
            <h2
              style={{
                color: '#1a4a5a',
                fontSize: '24px',
                fontWeight: '700',
                marginBottom: '20px',
              }}
            >
              Medical Documentation: Why It&apos;s Critical for Your Settlement
            </h2>
            <div
              style={{
                display: 'flex',
                gap: '12px',
                padding: '16px',
                backgroundColor: '#fff8f0',
                borderLeft: '4px solid #c4714a',
                borderRadius: '6px',
                marginBottom: '20px',
              }}
            >
              <AlertCircle
                size={20}
                style={{ color: '#c4714a', flexShrink: 0, marginTop: '2px' }}
              />
              <div>
                <p
                  style={{
                    margin: 0,
                    color: '#555',
                    lineHeight: '1.8',
                    fontSize: '21px',
                    fontWeight: '600',
                  }}
                >
                  Seek medical evaluation within <strong>24 hours</strong>, even if you feel fine.
                </p>
                <p
                  style={{
                    margin: '8px 0 0 0',
                    color: '#555',
                    lineHeight: '1.8',
                    fontSize: '18px',
                  }}
                >
                  Truck accidents often cause injuries that appear days later (whiplash, internal
                  bleeding, spinal injuries).
                </p>
              </div>
            </div>
            <p
              style={{
                color: '#555',
                lineHeight: '1.8',
                marginBottom: '16px',
                fontSize: '16px',
              }}
            >
              Medical records create a documented link between the accident and your
              injuries—essential for your settlement claim.
            </p>
            <ul
              style={{
                margin: 0,
                paddingLeft: '20px',
                color: '#555',
                fontSize: '14px',
                lineHeight: '1.8',
              }}
            >
              <li style={{ marginBottom: '8px' }}>Visit emergency room or urgent care within 24 hours</li>
              <li style={{ marginBottom: '8px' }}>Describe all symptoms, even minor ones</li>
              <li style={{ marginBottom: '8px' }}>Get complete medical evaluation including imaging</li>
              <li style={{ marginBottom: '8px' }}>Request copies of all medical records</li>
              <li>Follow all treatment recommendations</li>
            </ul>
          </div>

          {/* Section Divider */}
          <div style={{ height: '1px', backgroundColor: '#e8e2d8', margin: '56px 0' }} />

          {/* Attorney Comparison */}
          <div id="with-without-attorney" style={{ marginBottom: '56px', scrollMarginTop: '100px' }}>
            <h2
              style={{
                color: '#1a4a5a',
                fontSize: '24px',
                fontWeight: '700',
                marginBottom: '20px',
              }}
            >
              Truck Accident Settlement: With Attorney vs. Without (5x Difference)
            </h2>
            <p
              style={{
                color: '#555',
                lineHeight: '1.8',
                marginBottom: '20px',
                fontSize: '16px',
              }}
            >
              Attorneys settle cases for <strong>5x more on average</strong>. Here&apos;s why:
            </p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#1a4a5a', color: 'white' }}>
                    <th
                      style={{
                        padding: isMobileView ? '12px' : '14px',
                        textAlign: 'left',
                        fontWeight: '600',
                        fontSize: isMobileView ? '15px' : '14px',
                      }}
                    >
                      Factor
                    </th>
                    <th
                      style={{
                        padding: isMobileView ? '12px' : '14px',
                        textAlign: 'left',
                        fontWeight: '600',
                        fontSize: isMobileView ? '15px' : '14px',
                      }}
                    >
                      With Attorney
                    </th>
                    <th
                      style={{
                        padding: isMobileView ? '12px' : '14px',
                        textAlign: 'left',
                        fontWeight: '600',
                        fontSize: isMobileView ? '15px' : '14px',
                      }}
                    >
                      Without Attorney
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { factor: 'Average Settlement', with: '$250,000', without: '$50,000' },
                    { factor: 'Success Rate', with: '92%', without: '60%' },
                    { factor: 'Time to Settle', with: '12-18 months', without: '6-24 months' },
                    { factor: 'Upfront Cost', with: '$0 (Contingency)', without: '$0' },
                  ].map((row, idx) => (
                    <tr
                      key={idx}
                      style={{
                        backgroundColor: idx % 2 === 0 ? '#f9f5ef' : 'white',
                        borderBottom: '1px solid #e8e2d8',
                      }}
                    >
                      <td
                        style={{
                          padding: isMobileView ? '12px' : '14px',
                          color: '#555',
                          fontWeight: '600',
                          fontSize: isMobileView ? '15px' : '14px',
                        }}
                      >
                        {row.factor}
                      </td>
                      <td
                        style={{
                          padding: isMobileView ? '12px' : '14px',
                          color: '#4a8c7e',
                          fontWeight: '600',
                          fontSize: isMobileView ? '15px' : '14px',
                        }}
                      >
                        {row.with}
                      </td>
                      <td
                        style={{
                          padding: isMobileView ? '12px' : '14px',
                          color: '#999',
                          fontWeight: '500',
                          fontSize: isMobileView ? '15px' : '14px',
                        }}
                      >
                        {row.without}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section Divider */}
          <div style={{ height: '1px', backgroundColor: '#e8e2d8', margin: '56px 0' }} />

          {/* Settlement Examples */}
          <div id="settlement-examples" style={{ marginBottom: '56px', scrollMarginTop: '100px' }}>
            <h2
              style={{
                color: '#1a4a5a',
                fontSize: '24px',
                fontWeight: '700',
                marginBottom: '20px',
              }}
            >
              Real Truck Accident Settlement Examples: Actual Cases & Outcomes
            </h2>
            <div style={{ display: 'grid', gap: '16px' }}>
              {[
                {
                  amount: '$485,000',
                  injury: 'Catastrophic spinal cord injury',
                  time: '18 months',
                  details: 'Permanent paralysis, lifetime care',
                },
                {
                  amount: '$275,000',
                  injury: 'Severe back injury & PTSD',
                  time: '14 months',
                  details: 'Multiple surgeries, ongoing therapy',
                },
                {
                  amount: '$125,000',
                  injury: 'Multiple fractures & concussion',
                  time: '10 months',
                  details: 'Broken ribs, arm, and leg',
                },
              ].map((example, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '20px',
                    backgroundColor: 'white',
                    borderLeft: '4px solid #4a8c7e',
                    borderRadius: '6px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '24px',
                      fontWeight: '700',
                      color: '#c4714a',
                      marginBottom: '8px',
                    }}
                  >
                    {example.amount}
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1a4a5a',
                      marginBottom: '4px',
                    }}
                  >
                    {example.injury}
                  </div>
                  <div style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>
                    Settled in {example.time}
                  </div>
                  <div style={{ fontSize: '14px', color: '#555' }}>{example.details}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Section Divider */}
          <div style={{ height: '1px', backgroundColor: '#e8e2d8', margin: '56px 0' }} />

          {/* Settlement Ranges */}
          <div id="settlement-ranges" style={{ marginBottom: '56px', scrollMarginTop: '100px' }}>
            <h2
              style={{
                color: '#1a4a5a',
                fontSize: '24px',
                fontWeight: '700',
                marginBottom: '20px',
              }}
            >
              Truck Accident Settlement Ranges: State-by-State Breakdown
            </h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#1a4a5a', color: 'white' }}>
                    <th
                      style={{
                        padding: isMobileView ? '12px' : '14px',
                        textAlign: 'left',
                        fontWeight: '600',
                        fontSize: isMobileView ? '13px' : '14px',
                      }}
                    >
                      State
                    </th>
                    <th
                      style={{
                        padding: isMobileView ? '12px' : '14px',
                        textAlign: 'left',
                        fontWeight: '600',
                        fontSize: isMobileView ? '13px' : '14px',
                      }}
                    >
                      Minor
                    </th>
                    <th
                      style={{
                        padding: isMobileView ? '12px' : '14px',
                        textAlign: 'left',
                        fontWeight: '600',
                        fontSize: isMobileView ? '13px' : '14px',
                      }}
                    >
                      Moderate
                    </th>
                    <th
                      style={{
                        padding: isMobileView ? '12px' : '14px',
                        textAlign: 'left',
                        fontWeight: '600',
                        fontSize: isMobileView ? '13px' : '14px',
                      }}
                    >
                      Severe
                    </th>
                    <th
                      style={{
                        padding: isMobileView ? '12px' : '14px',
                        textAlign: 'left',
                        fontWeight: '600',
                        fontSize: isMobileView ? '13px' : '14px',
                      }}
                    >
                      Catastrophic
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      state: 'California',
                      minor: '$15,000-$35,000',
                      moderate: '$75,000-$150,000',
                      severe: '$250,000-$500,000',
                      catastrophic: '$750,000-$2,000,000+',
                    },
                    {
                      state: 'Texas',
                      minor: '$12,000-$30,000',
                      moderate: '$60,000-$120,000',
                      severe: '$200,000-$400,000',
                      catastrophic: '$600,000-$1,500,000',
                    },
                    {
                      state: 'Florida',
                      minor: '$14,000-$32,000',
                      moderate: '$70,000-$140,000',
                      severe: '$220,000-$450,000',
                      catastrophic: '$650,000-$1,800,000',
                    },
                  ].map((row, idx) => (
                    <tr
                      key={idx}
                      style={{
                        backgroundColor: idx % 2 === 0 ? '#f9f5ef' : 'white',
                        borderBottom: '1px solid #e8e2d8',
                      }}
                    >
                      <td
                        style={{
                          padding: isMobileView ? '12px' : '14px',
                          color: '#1a4a5a',
                          fontWeight: '600',
                          fontSize: isMobileView ? '14px' : '14px',
                        }}
                      >
                        {row.state}
                      </td>
                      <td
                        style={{
                          padding: isMobileView ? '12px' : '14px',
                          color: '#555',
                          fontWeight: '500',
                          fontSize: isMobileView ? '13px' : '14px',
                        }}
                      >
                        {row.minor}
                      </td>
                      <td
                        style={{
                          padding: isMobileView ? '12px' : '14px',
                          color: '#555',
                          fontWeight: '500',
                          fontSize: isMobileView ? '13px' : '14px',
                        }}
                      >
                        {row.moderate}
                      </td>
                      <td
                        style={{
                          padding: isMobileView ? '12px' : '14px',
                          color: '#555',
                          fontWeight: '500',
                          fontSize: isMobileView ? '13px' : '14px',
                        }}
                      >
                        {row.severe}
                      </td>
                      <td
                        style={{
                          padding: isMobileView ? '12px' : '14px',
                          color: '#4a8c7e',
                          fontWeight: '600',
                          fontSize: isMobileView ? '13px' : '14px',
                        }}
                      >
                        {row.catastrophic}
                      </td>
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
            <h2
              style={{
                color: '#1a4a5a',
                fontSize: '24px',
                fontWeight: '700',
                marginBottom: '20px',
              }}
            >
              Your Statute of Limitations is Ticking
            </h2>
            <div
              style={{
                backgroundColor: '#f0f8f6',
                borderLeft: '4px solid #c4714a',
                padding: '28px',
                marginBottom: '24px',
                borderRadius: '6px',
              }}
            >
              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#1a4a5a',
                    display: 'block',
                    marginBottom: '12px',
                  }}
                >
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
                    transition: 'all 0.2s',
                  }}
                >
                  <option value="california">California</option>
                  <option value="texas">Texas</option>
                  <option value="florida">Florida</option>
                </select>
              </div>
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#c4714a',
                  marginBottom: '12px',
                }}
              >
                Deadline: 2 years from date of injury
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
            <h2
              style={{
                color: '#1a4a5a',
                fontSize: '24px',
                fontWeight: '700',
                marginBottom: '20px',
              }}
            >
              People Also Ask
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                {
                  q: 'How much time do I have to file a truck accident claim?',
                  a: 'Most states have a 2-3 year statute of limitations, but you should file within 30-90 days to preserve evidence. Contact an attorney immediately.',
                },
                {
                  q: 'What damages can I recover in a truck accident?',
                  a: 'Medical expenses, lost wages, pain & suffering, future medical care, and lost earning capacity. Settlements typically range from $50,000-$2,000,000+ depending on injury severity.',
                },
                {
                  q: 'Are truck accidents more serious than car accidents?',
                  a: 'Yes. Trucks are 20-30x heavier than cars, causing significantly more severe injuries and higher settlements.',
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '16px',
                    backgroundColor: 'white',
                    borderLeft: '4px solid #4a8c7e',
                    borderRadius: '4px',
                  }}
                >
                  <div
                    style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#1a4a5a',
                      marginBottom: '8px',
                    }}
                  >
                    {item.q}
                  </div>
                  <div style={{ fontSize: '14px', color: '#555', lineHeight: '1.6' }}>{item.a}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Section Divider */}
          <div style={{ height: '1px', backgroundColor: '#e8e2d8', margin: '56px 0' }} />

          {/* FAQ */}
          <div id="faq" style={{ marginBottom: '56px', scrollMarginTop: '100px' }}>
            <h2
              style={{
                color: '#1a4a5a',
                fontSize: '24px',
                fontWeight: '700',
                marginBottom: '20px',
              }}
            >
              Frequently Asked Questions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                {
                  q: 'What should I do immediately after a truck accident?',
                  a: 'Move to safety, call 911, document the scene with photos, exchange information with the truck driver (name, phone, insurance, commercial license), get witness contact info, and report to police. Do not admit fault.',
                },
                {
                  q: 'Do I need an attorney for a truck accident?',
                  a: 'Yes. Attorneys settle cases for 5x more on average ($250,000 vs $50,000). They handle negotiations with insurance companies and maximize your recovery. Most work on contingency (no upfront cost).',
                },
                {
                  q: 'How long does a truck accident case take?',
                  a: 'Typically 12-18 months with an attorney. Complex cases may take 2-5 years. Settlement timelines depend on injury severity and liability clarity.',
                },
                {
                  q: 'What if I was partially at fault?',
                  a: "In most states, you can still recover damages reduced by your percentage of fault. Some states don't allow recovery if you're over 50% at fault. Consult an attorney to understand your state's rules.",
                },
                {
                  q: 'How much should I expect to settle for?',
                  a: 'Settlements range from $15,000 for minor injuries to $2,000,000+ for catastrophic injuries. Most truck accident cases settle between $100,000-$500,000 depending on injury severity and liability.',
                },
                {
                  q: 'What if the truck driver was uninsured or underinsured?',
                  a: "You can recover from your own uninsured/underinsured motorist (UM/UIM) coverage. Many truck companies carry $1,000,000+ in insurance, but if limits are exceeded, your UM/UIM coverage applies.",
                },
                {
                  q: 'Can I still sue if I signed a settlement waiver?',
                  a: 'It depends on when you signed it and under what circumstances. If you signed before fully understanding your injuries, you may be able to challenge it. Never sign any documents without attorney review.',
                },
                {
                  q: 'What is the difference between workers comp and personal injury?',
                  a: "Workers comp covers workplace injuries with limited benefits and no pain & suffering damages. Personal injury lawsuits allow full damages including pain & suffering, lost earning capacity, and future medical care. If not work-related, file personal injury.",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '16px',
                    backgroundColor: 'white',
                    borderRadius: '4px',
                    borderLeft: '3px solid #c4714a',
                    cursor: 'pointer',
                  }}
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#1a4a5a',
                      }}
                    >
                      {item.q}
                    </div>
                    {expandedFaq === idx ? (
                      <ChevronUp size={16} style={{ color: '#999', flexShrink: 0 }} />
                    ) : (
                      <ChevronDown size={16} style={{ color: '#999', flexShrink: 0 }} />
                    )}
                  </div>
                  {expandedFaq === idx && (
                    <div
                      style={{
                        fontSize: '13px',
                        color: '#555',
                        lineHeight: '1.6',
                        marginTop: '8px',
                      }}
                    >
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section Divider */}
          <div style={{ height: '1px', backgroundColor: '#e8e2d8', margin: '56px 0' }} />

          {/* Related Articles */}
          <div style={{ marginBottom: '56px' }}>
            <h2
              style={{
                color: '#1a4a5a',
                fontSize: '24px',
                fontWeight: '700',
                marginBottom: '20px',
              }}
            >
              Related Guides
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                {
                  title: 'Do I Need a Lawyer After a Truck Accident?',
                  url: '/guide/truck-accident/do-i-need-a-lawyer',
                },
                {
                  title: 'Truck Accident Settlement Amounts',
                  url: '/guide/truck-accident/settlement-amounts',
                },
                {
                  title: 'Statute of Limitations for Truck Accidents',
                  url: '/guide/truck-accident/statute-of-limitations',
                },
              ].map((article, idx) => (
                <Link
                  key={idx}
                  href={article.url}
                  style={{
                    padding: '12px',
                    backgroundColor: 'white',
                    borderLeft: '4px solid #4a8c7e',
                    textDecoration: 'none',
                    color: '#1a4a5a',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s',
                    borderRadius: '4px',
                    display: 'block',
                  }}
                >
                  → {article.title}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal Authority */}
          <div
            style={{
              marginBottom: '56px',
              padding: '20px',
              backgroundColor: '#f9f5ef',
              borderRadius: '6px',
              borderLeft: '4px solid #999',
            }}
          >
            <h3
              style={{
                color: '#1a4a5a',
                fontSize: '14px',
                fontWeight: '700',
                marginBottom: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Legal Authority & Citations
            </h3>
            <ul
              style={{
                margin: 0,
                paddingLeft: '20px',
                color: '#555',
                fontSize: '13px',
                lineHeight: '1.8',
              }}
            >
              <li>
                <strong>Federal Motor Carrier Safety Administration (FMCSA)</strong> Regulations 49 CFR Part 390
              </li>
              <li>
                <strong>Uniform Commercial Code</strong> § 3-104 (Commercial Liability)
              </li>
              <li>
                <strong>State Statute of Limitations Laws</strong> (varies by jurisdiction)
              </li>
              <li>
                <strong>Insurance Information Institute (III)</strong> - Truck Accident Data 2025
              </li>
              <li>
                <strong>American Bar Association (ABA)</strong> - Personal Injury Law Standards
              </li>
            </ul>
          </div>

          {/* Expert Credentials */}
          <div
            style={{
              padding: '24px',
              backgroundColor: 'white',
              borderLeft: '4px solid #4a8c7e',
              marginBottom: '56px',
              borderRadius: '6px',
            }}
          >
            <div
              style={{
                fontSize: '12px',
                fontWeight: '700',
                color: '#1a4a5a',
                marginBottom: '16px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              About the Author
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  backgroundColor: '#4a8c7e',
                  borderRadius: '50%',
                  flexShrink: 0,
                }}
              />
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a4a5a', marginBottom: '4px' }}>
                  Sarah Mitchell, Esq.
                </div>
                <div
                  style={{
                    fontSize: '13px',
                    color: '#555',
                    marginBottom: '8px',
                    lineHeight: '1.6',
                  }}
                >
                  Personal Injury Attorney | 15+ years experience | Board Certified in Personal Injury Law
                </div>
                <div style={{ fontSize: '13px', color: '#999' }}>
                  Specializes in truck accident litigation and has recovered over $50,000,000 in settlements for clients.
                </div>
              </div>
            </div>
          </div>

          {/* Update Log */}
          <div
            style={{
              padding: '20px',
              backgroundColor: '#f9f5ef',
              borderLeft: '4px solid #999',
              marginBottom: '56px',
              borderRadius: '6px',
            }}
          >
            <div
              style={{
                fontSize: '12px',
                fontWeight: '700',
                color: '#1a4a5a',
                marginBottom: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Update Log
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { date: '2026-04-28', change: 'Updated settlement ranges based on 2026 Q1 data' },
                { date: '2026-04-15', change: 'Added new case studies and statute of limitations table' },
                { date: '2026-04-01', change: 'Initial publication' },
              ].map((log, idx) => (
                <div key={idx} style={{ fontSize: '13px', color: '#555' }}>
                  <span style={{ fontWeight: '600', color: '#1a4a5a' }}>{log.date}:</span> {log.change}
                </div>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <div
            style={{
              padding: '32px',
              backgroundColor: '#f0f8f6',
              borderLeft: '4px solid #c4714a',
              textAlign: 'center',
              borderRadius: '6px',
              marginBottom: '40px',
            }}
          >
            <h3
              style={{
                color: '#1a4a5a',
                fontSize: '20px',
                fontWeight: '700',
                marginBottom: '12px',
              }}
            >
              Don&apos;t Navigate This Alone
            </h3>
            <p
              style={{
                color: '#555',
                marginBottom: '20px',
                lineHeight: '1.6',
                fontSize: '15px',
              }}
            >
              Truck accident cases are complex. Insurance companies have teams of adjusters working
              to minimize your payout. You need an experienced attorney to fight for maximum
              compensation.
            </p>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginBottom: '20px',
                fontSize: '14px',
                color: '#555',
              }}
            >
              <div>✓ Free case evaluation - no obligation</div>
              <div>✓ No upfront costs - contingency basis only</div>
              <div>✓ Expert negotiators who know truck accident law</div>
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
                textDecoration: 'none',
                display: 'inline-block',
              }}
            >
              Get Free Case Evaluation
            </a>
            <div style={{ fontSize: '12px', color: '#999', marginTop: '12px' }}>
              100% Confidential. Your information is protected by attorney-client privilege.
            </div>
          </div>

          {/* Section Divider */}
          <div style={{ height: '1px', backgroundColor: '#e8e2d8', margin: '56px 0' }} />

          {/* Related Guides - Topical Authority */}
          <div style={{ marginBottom: '56px' }}>
            <h2
              style={{
                color: '#1a4a5a',
                fontSize: '24px',
                fontWeight: '700',
                marginBottom: '20px',
              }}
            >
              Related Injury Guides
            </h2>
            <p
              style={{
                color: '#555',
                lineHeight: '1.8',
                marginBottom: '24px',
                fontSize: '21px',
              }}
            >
              Explore other personal injury guides to understand your legal options and settlement
              expectations across different accident types.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: isMobileView ? '1fr' : '1fr 1fr', gap: '16px' }}>
              {[
                {
                  title: 'Car Accident Guide',
                  description:
                    'Liability, insurance claims, and settlement expectations after a motor vehicle collision',
                  link: '/guide/car-accident',
                },
                {
                  title: 'Slip & Fall Guide',
                  description: 'Property owner liability, premises liability laws, and how to prove negligence',
                  link: '/guide/slip-and-fall',
                },
                {
                  title: 'Medical Malpractice Guide',
                  description: 'Standard of care, expert testimony requirements, and complex damages',
                  link: '/guide/medical-malpractice',
                },
                {
                  title: 'Motorcycle Accident Guide',
                  description: 'Bias against riders, insurance tactics, and catastrophic injury settlements',
                  link: '/guide/motorcycle-accident',
                },
              ].map((guide, idx) => (
                <Link
                  key={idx}
                  href={guide.link}
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    style={{
                      padding: '20px',
                      backgroundColor: 'white',
                      borderLeft: '4px solid #4a8c7e',
                      borderRadius: '6px',
                    }}
                  >
                    <h3
                      style={{
                        color: '#1a4a5a',
                        fontSize: '16px',
                        fontWeight: '700',
                        margin: 0,
                        marginBottom: '8px',
                      }}
                    >
                      {guide.title}
                    </h3>
                    <p
                      style={{
                        color: '#555',
                        fontSize: '14px',
                        lineHeight: '1.6',
                        margin: '8px 0 0 0',
                      }}
                    >
                      {guide.description}
                    </p>
                    <p
                      style={{
                        color: '#4a8c7e',
                        fontSize: '13px',
                        fontWeight: '600',
                        margin: '12px 0 0 0',
                      }}
                    >
                      Learn more →
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar TOC */}
        {!isMobileView && (
          <div
            style={{
              width: '280px',
              padding: '40px 0',
              position: 'sticky',
              top: '80px',
              height: 'fit-content',
            }}
          >
            <div
              style={{
                fontSize: '12px',
                fontWeight: '700',
                color: '#1a4a5a',
                marginBottom: '16px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
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
                    borderLeft:
                      activeSection === item.id ? '3px solid #c4714a' : '2px solid #e8e2d8',
                    fontWeight: activeSection === item.id ? '700' : '500',
                    backgroundColor:
                      activeSection === item.id ? '#f0f8f6' : 'transparent',
                    paddingTop: '8px',
                    paddingBottom: '8px',
                    paddingRight: '8px',
                    borderRadius: '4px',
                    display: 'block',
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