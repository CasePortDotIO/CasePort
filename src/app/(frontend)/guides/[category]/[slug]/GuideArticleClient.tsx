'use client'

import { TableOfContents } from '@/components/insights/TableOfContents'
import { VerifiedBadges } from '@/components/ui/VerifiedBadges'
import { RichText, defaultJSXConverters } from '@payloadcms/richtext-lexical/react'
import {
  AlertCircle,
  ArrowRight,
  ArrowUp,
  CheckCircle,
  ChevronDown,
  FileText,
  MapPin,
  Phone,
  Users,
} from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

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

// ─── Block Renderer ──────────────────────────────────────────────────────────

type Block = {
  blockType: string
  [key: string]: any
}

type BlockRendererProps = {
  blocks: Block[]
  isMobileView: boolean
  isTablet: boolean
}

function BlockRenderer({ blocks, isMobileView, isTablet }: BlockRendererProps) {
  const ms = (mobile: string, tablet?: string, desktop?: string) =>
    isMobileView ? mobile : isTablet ? tablet || desktop || mobile : desktop || mobile

  const mb = (v: string) => ({ marginBottom: v })
  const pd = (v: string) => ({ padding: v })
  const fs = (mobile: string, tablet?: string, desktop?: string) => ({
    fontSize: ms(mobile, tablet, desktop),
  })

  return (
    <>
      {blocks.map((block, idx) => {
        switch (block.blockType) {
          // ── Standfirst ───────────────────────────────────────────────
          case 'standfirst': {
            return (
              <div
                key={idx}
                id="block-standfirst"
                style={{ marginBottom: ms('24px', '32px', '40px') }}
              >
                <p
                  style={{
                    fontSize: ms('16px', '19px', '22px'),
                    color: '#555',
                    lineHeight: '1.7',
                    fontWeight: '500',
                    fontStyle: 'italic',
                    borderLeft: '4px solid #c4714a',
                    paddingLeft: ms('14px', '16px', '20px'),
                  }}
                >
                  {block.text}
                </p>
              </div>
            )
          }

          // ── Direct Answer ─────────────────────────────────────────────
          case 'directAnswer': {
            const jsxConverters = {
              ...defaultJSXConverters,
              paragraph: ({ node, nodesToJSX }: { node: any; nodesToJSX: any }) => {
                return (
                  <p
                    style={{
                      margin: 0,
                      color: '#555',
                      lineHeight: '1.8',
                      fontSize: ms('15px', '18px', '21px'),
                      fontWeight: '500',
                    }}
                  >
                    {nodesToJSX({ nodes: node.children })}
                  </p>
                )
              },
            }
            return (
              <div
                key={idx}
                id="block-direct-answer"
                data-section
                style={{ marginBottom: ms('32px', '40px', '56px'), animation: 'fadeIn 0.5s ease' }}
              >
                <div
                  style={{
                    backgroundColor: '#f0f8f6',
                    borderLeft: '4px solid #4a8c7e',
                    padding: ms('16px', '22px', '28px'),
                    borderRadius: '6px',
                  }}
                >
                  <div
                    style={{
                      fontSize: ms('11px', '12px'),
                      fontWeight: '700',
                      color: '#1a4a5a',
                      marginBottom: '12px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Direct Answer
                  </div>
                  <RichText data={block.text} converters={jsxConverters} />
                </div>
              </div>
            )
          }

          // ── QuickActionPlan ───────────────────────────────────────────
          case 'quickActionPlan': {
            const items = block.items || []
            return (
              <div
                key={idx}
                id={`block-quick-action-plan`}
                data-section
                style={{ marginBottom: ms('32px', '40px', '56px') }}
              >
                <h2
                  style={{
                    color: '#1a4a5a',
                    fontSize: ms('18px', '22px', '24px'),
                    fontWeight: '700',
                    marginBottom: ms('12px', '16px', '20px'),
                  }}
                >
                  Quick Action Plan
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: ms('10px', '12px') }}>
                  {items.map((item: any, i: number) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        gap: ms('12px', '14px', '16px'),
                        padding: ms('12px', '14px', '16px'),
                        backgroundColor: 'white',
                        borderLeft: '4px solid #c4714a',
                        borderRadius: '6px',
                      }}
                    >
                      <div
                        style={{
                          flexShrink: 0,
                          width: ms('36px', '38px', '40px'),
                          height: ms('36px', '38px', '40px'),
                          backgroundColor: '#c4714a',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontWeight: '700',
                          fontSize: ms('13px', '14px', '18px'),
                        }}
                      >
                        {i + 1}
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: ms('11px', '12px'),
                            color: '#c4714a',
                            fontWeight: '600',
                            marginBottom: '4px',
                          }}
                        >
                          {item.phase} · {item.timeWindow}
                        </div>
                        <div
                          style={{
                            fontSize: ms('14px', '15px', '18px'),
                            color: '#1a4a5a',
                            fontWeight: '600',
                            marginBottom: '4px',
                          }}
                        >
                          {item.text}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          }

          // ── KeyTakeaways ─────────────────────────────────────────────
          case 'keyTakeaways': {
            const items = block.items || []
            return (
              <div
                key={idx}
                id={`block-key-takeaways`}
                data-section
                style={{ marginBottom: ms('32px', '40px', '56px') }}
              >
                <h2
                  style={{
                    color: '#1a4a5a',
                    fontSize: ms('14px', '16px', '18px'),
                    fontWeight: '700',
                    marginBottom: ms('12px', '16px', '20px'),
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                  }}
                >
                  Key Takeaways
                </h2>
                <div style={{ display: 'grid', gap: ms('8px', '10px', '12px') }}>
                  {items.map((item: any, i: number) => {
                    const text = typeof item === 'string' ? item : item.item || item.point || ''
                    return (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          gap: ms('10px', '12px'),
                          padding: ms('10px', '12px'),
                          backgroundColor: 'white',
                          borderRadius: '4px',
                          borderLeft: '3px solid #4a8c7e',
                        }}
                      >
                        <CheckCircle
                          size={ms('14px', '16px')}
                          style={{ color: '#4a8c7e', flexShrink: 0, marginTop: '2px' }}
                        />
                        <p
                          style={{
                            margin: 0,
                            color: '#555',
                            fontSize: ms('15px', '16px', '18px'),
                            lineHeight: '1.6',
                          }}
                        >
                          {text}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          }

          // ── StepChecklist ────────────────────────────────────────────
          case 'stepChecklist': {
            const intro = block.intro || ''
            const steps = block.steps || []
            return (
              <div
                key={idx}
                id={`block-step-checklist`}
                data-section
                style={{ marginBottom: ms('32px', '40px', '56px') }}
              >
                <h2
                  style={{
                    color: '#1a4a5a',
                    fontSize: ms('18px', '22px', '24px'),
                    fontWeight: '700',
                    marginBottom: ms('12px', '16px', '20px'),
                  }}
                >
                  Step-by-Step Checklist
                </h2>
                {intro && (
                  <p
                    style={{
                      color: '#555',
                      lineHeight: '1.8',
                      marginBottom: ms('16px', '20px', '24px'),
                      fontSize: ms('14px', '15px', '18px'),
                    }}
                  >
                    {intro}
                  </p>
                )}
                <div style={{ display: 'grid', gap: ms('12px', '14px', '16px') }}>
                  {steps.map((step: any, i: number) => {
                    const bullets = (step.bullets || []).map((b: any) =>
                      typeof b === 'string' ? b : b.b,
                    )
                    return (
                      <div
                        key={i}
                        style={{
                          padding: ms('12px', '16px', '20px'),
                          backgroundColor: 'white',
                          borderLeft: '4px solid #c4714a',
                          borderRadius: '6px',
                        }}
                      >
                        <div
                          style={{
                            fontSize: ms('10px', '11px'),
                            color: '#c4714a',
                            fontWeight: '700',
                            marginBottom: '8px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                          }}
                        >
                          {step.name} {step.timeWindow ? `· ${step.timeWindow}` : ''}
                        </div>
                        <ul
                          style={{
                            margin: 0,
                            paddingLeft: ms('16px', '18px', '20px'),
                            color: '#555',
                            fontSize: ms('15px', '16px', '18px'),
                            lineHeight: '1.8',
                          }}
                        >
                          {bullets.map((b: string, bi: number) => (
                            <li key={bi} style={{ marginBottom: '6px' }}>
                              {b}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          }

          // ── CitationFact ─────────────────────────────────────────────
          case 'citationFact': {
            const facts = block.facts || []
            return (
              <div
                key={idx}
                id={`block-citation-fact`}
                data-section
                style={{ marginBottom: ms('32px', '40px', '56px') }}
              >
                <h2
                  style={{
                    color: '#1a4a5a',
                    fontSize: ms('18px', '22px', '24px'),
                    fontWeight: '700',
                    marginBottom: ms('12px', '16px', '20px'),
                  }}
                >
                  Key Statistics
                </h2>
                <div style={{ display: 'grid', gap: ms('8px', '10px', '12px') }}>
                  {facts.map((fact: any, i: number) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        gap: ms('10px', '12px'),
                        padding: ms('10px', '12px', '16px'),
                        backgroundColor: 'white',
                        borderLeft: '4px solid #4a8c7e',
                        borderRadius: '6px',
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: ms('15px', '16px', '18px'),
                            color: '#1a4a5a',
                            fontWeight: '600',
                            marginBottom: '4px',
                            lineHeight: '1.6',
                          }}
                        >
                          {fact.fact}
                        </div>
                        <div style={{ fontSize: ms('11px', '12px', '13px'), color: '#999' }}>
                          Source: {fact.source}
                          {fact.sourceUrl && (
                            <a
                              href={fact.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: '#4a8c7e', marginLeft: '8px' }}
                            >
                              ↗
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          }

          // ── StatCallout ──────────────────────────────────────────────
          case 'statCallout': {
            return (
              <div
                key={idx}
                id={`block-stat-callout`}
                style={{ marginBottom: ms('32px', '40px', '56px') }}
              >
                <div
                  style={{
                    padding: ms('20px', '26px', '32px'),
                    backgroundColor: '#f0f8f6',
                    borderLeft: '4px solid #4a8c7e',
                    borderRadius: '6px',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      fontSize: ms('28px', '38px', '48px'),
                      fontWeight: '700',
                      color: '#c4714a',
                      marginBottom: '8px',
                    }}
                  >
                    {block.value}
                  </div>
                  <div
                    style={{
                      fontSize: ms('13px', '15px', '18px'),
                      color: '#555',
                      marginBottom: '8px',
                    }}
                  >
                    {block.label}
                  </div>
                  <div style={{ fontSize: ms('11px', '12px', '13px'), color: '#999' }}>
                    {block.source}
                  </div>
                </div>
              </div>
            )
          }

          // ── Comparison ───────────────────────────────────────────────
          case 'comparison': {
            const points = block.points || []
            return (
              <div
                key={idx}
                id={`block-comparison`}
                data-section
                style={{ marginBottom: ms('32px', '40px', '56px') }}
              >
                <h2
                  style={{
                    color: '#1a4a5a',
                    fontSize: ms('18px', '22px', '24px'),
                    fontWeight: '700',
                    marginBottom: ms('12px', '16px', '20px'),
                  }}
                >
                  Comparison
                </h2>
                <div style={{ display: 'grid', gap: ms('8px', '10px', '12px') }}>
                  {points.map((point: any, i: number) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        gap: ms('10px', '12px'),
                        padding: ms('10px', '12px', '16px'),
                        backgroundColor: 'white',
                        borderLeft: '3px solid #4a8c7e',
                        borderRadius: '4px',
                      }}
                    >
                      <CheckCircle
                        size={ms('14px', '16px')}
                        style={{ color: '#4a8c7e', flexShrink: 0, marginTop: '3px' }}
                      />
                      <div>
                        <div
                          style={{
                            fontSize: ms('14px', '15px', '18px'),
                            color: '#555',
                            marginBottom: '4px',
                          }}
                        >
                          {point.stat}
                        </div>
                        <div style={{ fontSize: ms('11px', '12px') }}>Source: {point.source}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          }

          // ── CaseScenario ─────────────────────────────────────────────
          case 'caseScenario': {
            const items = block.items || []
            return (
              <div
                key={idx}
                id={`block-case-scenario`}
                data-section
                style={{ marginBottom: ms('32px', '40px', '56px') }}
              >
                <h2
                  style={{
                    color: '#1a4a5a',
                    fontSize: ms('18px', '22px', '24px'),
                    fontWeight: '700',
                    marginBottom: ms('12px', '16px', '20px'),
                  }}
                >
                  Case Scenarios
                </h2>
                {block.isIllustrative && (
                  <div
                    style={{
                      padding: ms('10px', '12px'),
                      backgroundColor: '#fff8f0',
                      borderRadius: '4px',
                      marginBottom: ms('12px', '14px', '16px'),
                      fontSize: ms('12px', '13px'),
                      color: '#999',
                    }}
                  >
                    ⚠️ These are illustrative scenarios, not actual case outcomes.
                  </div>
                )}
                <div style={{ display: 'grid', gap: ms('12px', '14px', '16px') }}>
                  {items.map((item: any, i: number) => (
                    <div
                      key={i}
                      style={{
                        padding: ms('12px', '16px', '20px'),
                        backgroundColor: 'white',
                        borderLeft: '4px solid #4a8c7e',
                        borderRadius: '6px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: ms('13px', '14px', '18px'),
                          fontWeight: '600',
                          color: '#1a4a5a',
                          marginBottom: '4px',
                        }}
                      >
                        {item.injuryType}
                      </div>
                      <div
                        style={{
                          fontSize: ms('18px', '21px', '24px'),
                          fontWeight: '700',
                          color: '#c4714a',
                          marginBottom: '8px',
                        }}
                      >
                        {item.illustrativeRange}
                      </div>
                      {item.note && (
                        <div style={{ fontSize: ms('12px', '13px', '14px'), color: '#555' }}>
                          {item.note}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          }

          // ── FAQAccordion ────────────────────────────────────────────
          case 'faqAccordion': {
            const faqs = block.faqs || []
            return (
              <div
                key={idx}
                id={`block-faq-accordion`}
                data-section
                style={{ marginBottom: ms('32px', '40px', '56px') }}
              >
                <h2
                  style={{
                    color: '#1a4a5a',
                    fontSize: ms('18px', '22px', '24px'),
                    fontWeight: '700',
                    marginBottom: ms('12px', '16px', '20px'),
                  }}
                >
                  Frequently Asked Questions
                </h2>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: ms('8px', '10px', '12px'),
                  }}
                >
                  {faqs.map((faq: any, i: number) => {
                    const q = typeof faq === 'string' ? faq : faq.question || ''
                    const a = typeof faq === 'string' ? '' : faq.answer || ''
                    return (
                      <div
                        key={i}
                        style={{
                          backgroundColor: 'white',
                          borderRadius: '4px',
                          borderLeft: '3px solid #c4714a',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: '100%',
                            padding: ms('12px 14px', '14px 20px', '16px 24px'),
                            textAlign: 'left',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <span
                            style={{
                              fontSize: ms('12px', '13px', '14px'),
                              fontWeight: '600',
                              color: '#1a4a5a',
                            }}
                          >
                            {q}
                          </span>
                          <ChevronDown
                            size={ms('14px', '16px', '18px')}
                            style={{
                              color: '#999',
                              transform: 'rotate(180deg)',
                              transition: 'transform 0.2s ease',
                              flexShrink: 0,
                            }}
                          />
                        </div>
                        <div
                          style={{
                            padding: ms('12px', '14px', '16px'),
                            paddingTop: 0,
                          }}
                        >
                          <p
                            style={{
                              color: '#555',
                              margin: 0,
                              fontSize: ms('11px', '12px', '13px'),
                              lineHeight: '1.6',
                            }}
                          >
                            {a}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          }

          // ── PeopleAlsoAsk ────────────────────────────────────────────
          case 'peopleAlsoAsk': {
            const items = block.items || []
            return (
              <div
                key={idx}
                id={`block-people-also-ask`}
                data-section
                style={{ marginBottom: ms('32px', '40px', '56px') }}
              >
                <h2
                  style={{
                    color: '#1a4a5a',
                    fontSize: ms('18px', '22px', '24px'),
                    fontWeight: '700',
                    marginBottom: ms('12px', '16px', '20px'),
                  }}
                >
                  People Also Ask
                </h2>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: ms('8px', '10px', '12px'),
                  }}
                >
                  {items.map((item: any, i: number) => {
                    const q = typeof item === 'string' ? item : item.q || item.question || ''
                    const a = typeof item === 'string' ? '' : item.a || item.answer || ''
                    return (
                      <div
                        key={i}
                        style={{
                          padding: ms('10px', '12px', '16px'),
                          backgroundColor: 'white',
                          borderLeft: '4px solid #4a8c7e',
                          borderRadius: '4px',
                        }}
                      >
                        <div
                          style={{
                            fontSize: ms('12px', '13px', '14px'),
                            fontWeight: '600',
                            color: '#1a4a5a',
                            marginBottom: '8px',
                          }}
                        >
                          {q}
                        </div>
                        <div
                          style={{
                            fontSize: ms('12px', '13px', '14px'),
                            color: '#555',
                            lineHeight: '1.6',
                          }}
                        >
                          {a}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          }

          // ── ProtectionPlan ───────────────────────────────────────────
          case 'protectionPlan': {
            const steps = block.steps || []
            return (
              <div
                key={idx}
                id={`block-protection-plan`}
                data-section
                style={{ marginBottom: ms('32px', '40px', '56px') }}
              >
                <h2
                  style={{
                    color: '#1a4a5a',
                    fontSize: ms('18px', '22px', '24px'),
                    fontWeight: '700',
                    marginBottom: ms('12px', '16px', '20px'),
                  }}
                >
                  Protection Plan
                </h2>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: ms('8px', '10px', '12px'),
                  }}
                >
                  {steps.map((step: any, i: number) => {
                    const text = typeof step === 'string' ? step : step.step || step.text || ''
                    return (
                      <div
                        key={i}
                        style={{
                          display: 'flex',
                          gap: ms('10px', '12px'),
                          padding: ms('10px', '12px', '16px'),
                          backgroundColor: 'white',
                          borderLeft: '4px solid #c4714a',
                          borderRadius: '6px',
                        }}
                      >
                        <CheckCircle
                          size={ms('14px', '16px')}
                          style={{ color: '#4a8c7e', flexShrink: 0, marginTop: '2px' }}
                        />
                        <span
                          style={{
                            fontSize: ms('14px', '15px', '18px'),
                            color: '#555',
                            lineHeight: '1.6',
                          }}
                        >
                          {text}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          }

          // ── CTA ──────────────────────────────────────────────────────
          case 'cta': {
            const siteLinkUrl = block.siteLink
              ? typeof block.siteLink === 'object'
                ? block.siteLink?.url
                : block.siteLink
              : null
            const ctaHref = siteLinkUrl || 'tel:+18002273669'
            return (
              <div
                key={idx}
                id={`block-cta`}
                style={{
                  marginBottom: ms('32px', '40px', '56px'),
                  padding: ms('16px', '24px', '32px'),
                  backgroundColor: '#f0f8f6',
                  borderLeft: '4px solid #c4714a',
                  textAlign: 'center',
                  borderRadius: '6px',
                }}
              >
                <h3
                  style={{
                    color: '#1a4a5a',
                    fontSize: ms('16px', '18px', '20px'),
                    fontWeight: '700',
                    marginBottom: '12px',
                  }}
                >
                  {block.heading || "Don't Navigate This Alone"}
                </h3>
                <p
                  style={{
                    color: '#555',
                    marginBottom: ms('16px', '20px'),
                    lineHeight: '1.6',
                    fontSize: ms('12px', '13px', '15px'),
                  }}
                >
                  {block.subcopy ||
                    'The firm that covers your area can help you recover maximum compensation.'}
                </p>
                <a
                  href={ctaHref}
                  style={{
                    backgroundColor: '#c4714a',
                    color: 'white',
                    padding: ms('10px 20px', '12px 24px', '12px 32px'),
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: ms('12px', '13px', '14px'),
                    fontWeight: '600',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    display: 'inline-block',
                  }}
                >
                  {block.buttonLabel || 'Get a free case review'}
                </a>
              </div>
            )
          }

          // ── Disclaimer ───────────────────────────────────────────────
          case 'disclaimer': {
            return (
              <div
                key={idx}
                id={`block-disclaimer`}
                style={{
                  marginBottom: ms('24px', '32px', '40px'),
                  padding: ms('10px', '12px', '16px'),
                  backgroundColor: '#f9f5ef',
                  borderRadius: '6px',
                  borderLeft: '4px solid #999',
                  fontSize: ms('12px', '13px'),
                  color: '#666',
                  lineHeight: '1.6',
                }}
              >
                {block.note ||
                  'This content is for informational purposes only and does not constitute legal advice. CasePort is not a law firm and does not provide legal representation.'}
              </div>
            )
          }

          // ── UpdateLog ────────────────────────────────────────────────
          case 'updateLog': {
            const entries = block.entries || []
            if (entries.length === 0) return null
            return (
              <div
                key={idx}
                id={`block-update-log`}
                data-section
                style={{
                  padding: '20px',
                  backgroundColor: '#f9f5ef',
                  borderLeft: '4px solid #999',
                  marginBottom: ms('32px', '40px', '56px'),
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
                  {entries.map((entry: any, i: number) => {
                    const date = entry.date
                      ? new Date(entry.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : ''
                    const desc = entry.description || ''
                    return (
                      <div key={i} style={{ fontSize: '13px', color: '#555' }}>
                        <span style={{ fontWeight: '600', color: '#1a4a5a' }}>{date}:</span> {desc}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          }

          // ── EntityContext ────────────────────────────────────────────
          case 'entityContext': {
            const entities = block.entities || []
            return null
          }

          // ── ExpertQuote ──────────────────────────────────────────────
          case 'expertQuote': {
            return (
              <div
                key={idx}
                id={`block-expert-quote`}
                data-section
                style={{ marginBottom: ms('32px', '40px', '56px') }}
              >
                <div
                  style={{
                    padding: ms('14px', '20px', '24px'),
                    backgroundColor: 'white',
                    borderLeft: '4px solid #4a8c7e',
                    borderRadius: '6px',
                    marginBottom: ms('12px', '16px', '20px'),
                  }}
                >
                  <div
                    style={{
                      fontSize: ms('14px', '15px', '18px'),
                      color: '#555',
                      lineHeight: '1.8',
                      fontStyle: 'italic',
                      marginBottom: ms('12px', '14px', '16px'),
                    }}
                  >
                    &ldquo;{block.quote}&rdquo;
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      gap: ms('12px', '14px', '16px'),
                      alignItems: 'center',
                    }}
                  >
                    {block.photo && (
                      <div
                        style={{
                          width: ms('40px', '44px', '48px'),
                          height: ms('40px', '44px', '48px'),
                          backgroundColor: '#4a8c7e',
                          borderRadius: '50%',
                        }}
                      />
                    )}
                    <div>
                      <div
                        style={{
                          fontSize: ms('13px', '14px', '18px'),
                          fontWeight: '600',
                          color: '#1a4a5a',
                        }}
                      >
                        {block.speakerName}
                      </div>
                      {block.credentials && (
                        <div style={{ fontSize: ms('11px', '12px', '13px'), color: '#999' }}>
                          {block.credentials}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          }

          // ── TermDefinition ─────────────────────────────────────────────
          case 'termDefinition': {
            return (
              <div
                key={idx}
                id={`block-term-definition`}
                style={{
                  marginBottom: ms('12px', '16px', '24px'),
                  padding: ms('10px', '12px', '16px'),
                  backgroundColor: '#f9f5ef',
                  borderRadius: '4px',
                }}
              >
                <div
                  style={{
                    fontSize: ms('13px', '14px', '18px'),
                    fontWeight: '700',
                    color: '#1a4a5a',
                    marginBottom: '4px',
                  }}
                >
                  {block.term}
                </div>
                <div
                  style={{ fontSize: ms('13px', '14px', '18px'), color: '#555', lineHeight: '1.6' }}
                >
                  {block.definition}
                </div>
              </div>
            )
          }

          // ── RelatedArticleLink ───────────────────────────────────────
          case 'relatedArticleLink': {
            if (!block.article) return null
            const art = typeof block.article === 'object' ? block.article : {}
            return (
              <div
                key={idx}
                id={`block-related-article`}
                style={{ marginBottom: ms('12px', '16px', '24px') }}
              >
                <Link href={`/insights/${art.slug || '#'}`} style={{ textDecoration: 'none' }}>
                  <div
                    style={{
                      padding: ms('10px', '12px', '16px'),
                      backgroundColor: 'white',
                      borderLeft: '4px solid #4a8c7e',
                      borderRadius: '6px',
                    }}
                  >
                    <div
                      style={{
                        fontSize: ms('12px', '13px', '14px'),
                        color: '#4a8c7e',
                        fontWeight: '600',
                        marginBottom: '4px',
                      }}
                    >
                      Insights
                    </div>
                    <div
                      style={{
                        fontSize: ms('14px', '15px', '18px'),
                        fontWeight: '600',
                        color: '#1a4a5a',
                        marginBottom: '4px',
                      }}
                    >
                      {block.headline || art.title}
                    </div>
                    {block.metaDescription && (
                      <div style={{ fontSize: ms('11px', '12px', '13px'), color: '#555' }}>
                        {block.metaDescription}
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            )
          }

          // ── RelatedGuideArticle ──────────────────────────────────────
          case 'relatedGuideArticle': {
            const articles = block.articles || []
            if (articles.length === 0) return null
            return (
              <div
                key={idx}
                id={`block-related-guide-article`}
                data-section
                style={{ marginBottom: ms('32px', '40px', '56px') }}
              >
                <h2
                  style={{
                    color: '#1a4a5a',
                    fontSize: ms('18px', '22px', '24px'),
                    fontWeight: '700',
                    marginBottom: ms('12px', '16px', '20px'),
                  }}
                >
                  {block.headline || 'Related Guide Articles'}
                </h2>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: isMobileView ? '1fr' : '1fr 1fr',
                    gap: ms('12px', '14px', '16px'),
                  }}
                >
                  {articles.map((item: any, i: number) => {
                    const art = item.article || item
                    const title = block.headline || art.title || 'Related Guide'
                    return (
                      <Link
                        key={i}
                        href={`/guides/${art.guideCategory?.slug || 'guide'}/${art.slug || '#'}`}
                        style={{ textDecoration: 'none' }}
                      >
                        <div
                          style={{
                            padding: ms('14px', '18px', '20px'),
                            backgroundColor: 'white',
                            borderLeft: '4px solid #4a8c7e',
                            borderRadius: '6px',
                            cursor: 'pointer',
                          }}
                        >
                          <h3
                            style={{
                              color: '#1a4a5a',
                              fontSize: ms('15px', '16px'),
                              fontWeight: '700',
                              margin: 0,
                              marginBottom: '8px',
                            }}
                          >
                            {title}
                          </h3>
                          {block.metaDescription && (
                            <p
                              style={{
                                color: '#555',
                                fontSize: ms('13px', '14px', '18px'),
                                lineHeight: '1.6',
                                margin: '6px 0 0 0',
                              }}
                            >
                              {block.metaDescription}
                            </p>
                          )}
                          <p
                            style={{
                              color: '#4a8c7e',
                              fontSize: ms('12px', '13px'),
                              fontWeight: '600',
                              margin: '10px 0 0 0',
                            }}
                          >
                            Learn more →
                          </p>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          }

          // ── RelatedGuideCategory ─────────────────────────────────────
          case 'relatedGuideCategory': {
            const categories = block.categories || []
            if (categories.length === 0) return null
            return (
              <div
                key={idx}
                id={`block-related-guide-category`}
                data-section
                style={{ marginBottom: ms('32px', '40px', '56px') }}
              >
                <h2
                  style={{
                    color: '#1a4a5a',
                    fontSize: ms('18px', '22px', '24px'),
                    fontWeight: '700',
                    marginBottom: ms('12px', '16px', '20px'),
                  }}
                >
                  {block.headline || 'Related Guide Categories'}
                </h2>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: isMobileView ? '1fr' : '1fr 1fr',
                    gap: ms('12px', '14px', '16px'),
                  }}
                >
                  {categories.map((item: any, i: number) => {
                    const cat = item.category || item
                    const title = block.headline || cat.title || 'Related Category'
                    return (
                      <Link
                        key={i}
                        href={`/guides/${cat.slug || 'guide'}`}
                        style={{ textDecoration: 'none' }}
                      >
                        <div
                          style={{
                            padding: ms('14px', '18px', '20px'),
                            backgroundColor: 'white',
                            borderLeft: '4px solid #c4714a',
                            borderRadius: '6px',
                            cursor: 'pointer',
                          }}
                        >
                          <h3
                            style={{
                              color: '#1a4a5a',
                              fontSize: ms('15px', '16px'),
                              fontWeight: '700',
                              margin: 0,
                              marginBottom: '8px',
                            }}
                          >
                            {title}
                          </h3>
                          {block.metaDescription && (
                            <p
                              style={{
                                color: '#555',
                                fontSize: ms('13px', '14px', '18px'),
                                lineHeight: '1.6',
                                margin: '6px 0 0 0',
                              }}
                            >
                              {block.metaDescription}
                            </p>
                          )}
                          <p
                            style={{
                              color: '#c4714a',
                              fontSize: ms('12px', '13px'),
                              fontWeight: '600',
                              margin: '10px 0 0 0',
                            }}
                          >
                            Explore →
                          </p>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          }

          // ── RichText ─────────────────────────────────────────────────
          case 'richText': {
            const jsxConverters = {
              ...defaultJSXConverters,
              heading: ({ node, nodesToJSX }: { node: any; nodesToJSX: any }) => {
                const headingText = node.children?.map((c: any) => c.text || '').join('') || ''
                const id = headingText
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, '-')
                  .replace(/^-|-$/g, '')
                if (node.tag === 'h2') {
                  return (
                    <h2
                      id={id}
                      data-section
                      style={{
                        fontSize: ms('18px', '21px', '24px'),
                        fontWeight: 'bold',
                        color: '#1a4a5a',
                        marginBottom: '10px',
                        marginTop: ms('20px', '28px', '32px'),
                      }}
                    >
                      {nodesToJSX({ nodes: node.children })}
                    </h2>
                  )
                }
                if (node.tag === 'h3') {
                  return (
                    <h3
                      id={id}
                      data-section
                      style={{
                        fontSize: ms('16px', '18px', '20px'),
                        fontWeight: 'bold',
                        color: '#1a4a5a',
                        marginBottom: '8px',
                        marginTop: ms('16px', '20px', '24px'),
                      }}
                    >
                      {nodesToJSX({ nodes: node.children })}
                    </h3>
                  )
                }
                if (node.tag === 'h4') {
                  return (
                    <h4
                      id={id}
                      data-section
                      style={{
                        fontSize: ms('15px', '16px', '18px'),
                        fontWeight: 'bold',
                        color: '#1a4a5a',
                        marginBottom: '8px',
                        marginTop: ms('14px', '16px', '20px'),
                      }}
                    >
                      {nodesToJSX({ nodes: node.children })}
                    </h4>
                  )
                }
                return (
                  <node.tag
                    id={id}
                    data-section
                    style={{
                      fontSize: ms('15px', '16px', '18px'),
                      fontWeight: 'bold',
                      color: '#1a4a5a',
                      marginBottom: '8px',
                      marginTop: ms('12px', '14px', '16px'),
                    }}
                  >
                    {nodesToJSX({ nodes: node.children })}
                  </node.tag>
                )
              },
              paragraph: ({ node, nodesToJSX }: { node: any; nodesToJSX: any }) => {
                return (
                  <p
                    style={{
                      marginBottom: ms('10px', '14px', '16px'),
                      lineHeight: '1.8',
                      color: '#555',
                      fontSize: ms('15px', '16px', '18px'),
                    }}
                  >
                    {nodesToJSX({ nodes: node.children })}
                  </p>
                )
              },
              quote: ({ node, nodesToJSX }: { node: any; nodesToJSX: any }) => {
                return (
                  <blockquote
                    style={{
                      marginBottom: ms('10px', '14px', '16px'),
                      borderLeft: '4px solid #4a8c7e',
                      backgroundColor: '#f0f8f6',
                      padding: ms('12px', '14px', '16px'),
                      borderRadius: '6px',
                    }}
                  >
                    <p
                      style={{
                        fontSize: ms('15px', '16px', '18px'),
                        fontWeight: '500',
                        color: '#1a4a5a',
                        fontStyle: 'italic',
                        lineHeight: '1.8',
                      }}
                    >
                      {nodesToJSX({ nodes: node.children })}
                    </p>
                  </blockquote>
                )
              },
              list: ({ node, nodesToJSX }: { node: any; nodesToJSX: any }) => {
                const Tag = node.tag === 'ul' ? 'ul' : 'ol'
                return (
                  <Tag
                    style={{
                      marginBottom: ms('10px', '14px', '16px'),
                      paddingLeft: ms('20px', '22px', '24px'),
                      color: '#555',
                      fontSize: ms('15px', '16px', '18px'),
                      lineHeight: '1.8',
                    }}
                  >
                    {nodesToJSX({ nodes: node.children })}
                  </Tag>
                )
              },
              listitem: ({ node, nodesToJSX }: { node: any; nodesToJSX: any }) => {
                return (
                  <li style={{ marginBottom: '6px', color: '#555', lineHeight: '1.8' }}>
                    {nodesToJSX({ nodes: node.children })}
                  </li>
                )
              },
              link: ({ node, nodesToJSX }: { node: any; nodesToJSX: any }) => {
                const rawUrl = node.url || node.fields?.url || ''
                const hasProtocol =
                  rawUrl.startsWith('http://') ||
                  rawUrl.startsWith('https://') ||
                  rawUrl.startsWith('//') ||
                  rawUrl.startsWith('www.')
                const href = hasProtocol
                  ? rawUrl
                  : rawUrl.startsWith('www.')
                    ? `https://${rawUrl}`
                    : rawUrl
                const isExternal = hasProtocol || rawUrl.startsWith('www.')
                return (
                  <a
                    href={href || '#'}
                    target={isExternal ? '_blank' : undefined}
                    rel={isExternal ? 'noopener noreferrer' : undefined}
                    style={{
                      color: '#4a8c7e',
                      textDecoration: 'underline',
                      textUnderlineOffset: '2px',
                      transition: 'color 0.2s',
                    }}
                  >
                    {nodesToJSX({ nodes: node.children })}
                  </a>
                )
              },
            }
            return (
              <div
                key={idx}
                id={`block-rich-text`}
                style={{ marginBottom: ms('32px', '40px', '56px') }}
              >
                <RichText data={block.content} converters={jsxConverters} />
              </div>
            )
          }

          // ── Immediate Actions ────────────────────────────────────────
          case 'immediateActions': {
            const steps = block.steps || []
            return (
              <div
                key={idx}
                id="block-immediate-actions"
                data-section
                style={{ marginBottom: ms('32px', '40px', '56px') }}
              >
                <h2
                  style={{
                    color: '#1a4a5a',
                    fontSize: ms('18px', '22px', '24px'),
                    fontWeight: '700',
                    marginBottom: ms('12px', '16px', '20px'),
                  }}
                >
                  {block.title || 'Your First 72-Hour Checklist'}
                </h2>
                <p
                  style={{
                    color: '#555',
                    lineHeight: '1.8',
                    marginBottom: ms('16px', '20px', '24px'),
                    fontSize: ms('14px', '18px', '21px'),
                  }}
                >
                  {block.subtitle ||
                    'Follow these steps in order. This checklist protects your health, evidence, and legal rights.'}
                </p>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: ms('12px', '16px', '24px'),
                  }}
                >
                  {steps.map((step: any, i: number) => (
                    <div
                      key={i}
                      style={{
                        padding: ms('12px', '16px', '20px'),
                        backgroundColor: 'white',
                        border: '2px solid #e8e2d8',
                        borderRadius: ms('8px', '10px', '12px'),
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          gap: ms('12px', '20px', '24px'),
                          flexDirection: isMobileView ? 'column' : 'row',
                        }}
                      >
                        <div style={{ flexShrink: 0 }}>
                          <div
                            style={{
                              width: ms('36px', '38px', '40px'),
                              height: ms('36px', '38px', '40px'),
                              borderRadius: '50%',
                              backgroundColor: '#4a8c7e',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <span
                              style={{
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: ms('14px', '15px', '16px'),
                              }}
                            >
                              {i + 1}
                            </span>
                          </div>
                        </div>
                        <div style={{ flex: 1 }}>
                          <h3
                            style={{
                              fontSize: ms('14px', '15px', '16px'),
                              fontWeight: 'bold',
                              marginBottom: '10px',
                              color: '#1a4a5a',
                            }}
                          >
                            {step.title}
                          </h3>
                          <div
                            style={{
                              fontSize: ms('11px', '12px'),
                              color: '#999',
                              marginBottom: '10px',
                            }}
                          >
                            {step.timeNote || '0-15 min'}
                          </div>
                          <ul
                            style={{
                              margin: 0,
                              paddingLeft: ms('16px', '18px', '20px'),
                              color: '#555',
                              fontSize: ms('14px', '15px', '18px'),
                              lineHeight: '1.8',
                            }}
                          >
                            {step.bullets?.map((bullet: any, bIdx: number) => (
                              <li key={bIdx} style={{ marginBottom: '6px' }}>
                                {typeof bullet === 'string' ? bullet : bullet.bullet}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          }

          // ── Medical Documentation ────────────────────────────────────
          case 'medicalDocumentation': {
            return (
              <div
                key={idx}
                id="block-medical-documentation"
                data-section
                style={{ marginBottom: ms('32px', '40px', '56px'), scrollMarginTop: '100px' }}
              >
                <h2
                  style={{
                    color: '#1a4a5a',
                    fontSize: ms('18px', '22px', '24px'),
                    fontWeight: '700',
                    marginBottom: ms('12px', '16px', '20px'),
                  }}
                >
                  Medical Documentation: Why It's Critical for Your Settlement
                </h2>
                <div
                  style={{
                    display: 'flex',
                    gap: ms('10px', '12px'),
                    padding: ms('12px', '14px', '16px'),
                    backgroundColor: '#fff8f0',
                    borderLeft: '4px solid #c4714a',
                    borderRadius: '6px',
                    marginBottom: ms('12px', '16px', '20px'),
                  }}
                >
                  <div>
                    <p
                      style={{
                        margin: 0,
                        color: '#555',
                        lineHeight: '1.8',
                        fontSize: ms('14px', '18px', '21px'),
                        fontWeight: '600',
                      }}
                    >
                      Seek medical evaluation within <strong>24 hours</strong>, even if you feel
                      fine.
                    </p>
                    <p
                      style={{
                        margin: '8px 0 0 0',
                        color: '#555',
                        lineHeight: '1.8',
                        fontSize: ms('13px', '15px', '18px'),
                      }}
                    >
                      Accidents often cause injuries that appear days later (whiplash, internal
                      bleeding, spinal injuries).
                    </p>
                  </div>
                </div>
                {block.introText && (
                  <p
                    style={{
                      color: '#555',
                      lineHeight: '1.8',
                      marginBottom: ms('12px', '14px', '16px'),
                      fontSize: ms('13px', '14px', '16px'),
                    }}
                  >
                    {block.introText}
                  </p>
                )}
                {block.calloutText && (
                  <p
                    style={{
                      color: '#555',
                      lineHeight: '1.8',
                      marginBottom: ms('12px', '14px', '16px'),
                      fontSize: ms('13px', '14px', '16px'),
                    }}
                  >
                    {block.calloutText}
                  </p>
                )}
              </div>
            )
          }

          // ── Attorney Comparison ────────────────────────────────────────
          case 'attorneyComparison': {
            const rows = block.rows || []
            const tableRows =
              rows.length > 0
                ? rows
                : [
                    {
                      factor: 'Average Settlement',
                      withAttorney: '$250,000',
                      withoutAttorney: '$50,000',
                    },
                    { factor: 'Success Rate', withAttorney: '92%', withoutAttorney: '60%' },
                    {
                      factor: 'Time to Settle',
                      withAttorney: '12-18 months',
                      withoutAttorney: '6-24 months',
                    },
                    {
                      factor: 'Upfront Cost',
                      withAttorney: '$0 (Contingency)',
                      withoutAttorney: '$0',
                    },
                  ]
            return (
              <div
                key={idx}
                id="block-attorney-comparison"
                data-section
                style={{ marginBottom: ms('32px', '40px', '56px'), scrollMarginTop: '100px' }}
              >
                <h2
                  style={{
                    color: '#1a4a5a',
                    fontSize: ms('18px', '22px', '24px'),
                    fontWeight: '700',
                    marginBottom: ms('12px', '16px', '20px'),
                  }}
                >
                  {block.title || 'Settlement: With Attorney vs. Without (5x Difference)'}
                </h2>
                {block.subtitle && (
                  <p
                    style={{
                      color: '#555',
                      lineHeight: '1.8',
                      marginBottom: ms('12px', '16px', '20px'),
                      fontSize: ms('12px', '14px', '16px'),
                    }}
                  >
                    {block.subtitle}
                  </p>
                )}
                <div style={{ overflowX: 'auto' }}>
                  <table
                    style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      marginBottom: ms('16px', '20px', '24px'),
                    }}
                  >
                    <thead>
                      <tr style={{ backgroundColor: '#1a4a5a', color: 'white' }}>
                        <th
                          style={{
                            padding: ms('8px 10px', '10px 12px', '14px'),
                            textAlign: 'left',
                            fontWeight: '600',
                            fontSize: ms('11px', '12px', '14px'),
                          }}
                        >
                          Factor
                        </th>
                        <th
                          style={{
                            padding: ms('8px 10px', '10px 12px', '14px'),
                            textAlign: 'left',
                            fontWeight: '600',
                            fontSize: ms('11px', '12px', '14px'),
                          }}
                        >
                          With Attorney
                        </th>
                        <th
                          style={{
                            padding: ms('8px 10px', '10px 12px', '14px'),
                            textAlign: 'left',
                            fontWeight: '600',
                            fontSize: ms('11px', '12px', '14px'),
                          }}
                        >
                          Without Attorney
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableRows.map((row: any, i: number) => (
                        <tr
                          key={i}
                          style={{
                            backgroundColor: i % 2 === 0 ? '#f9f5ef' : 'white',
                            borderBottom: '1px solid #e8e2d8',
                          }}
                        >
                          <td
                            style={{
                              padding: ms('8px 10px', '10px 12px', '14px'),
                              color: '#555',
                              fontWeight: '600',
                              fontSize: ms('11px', '12px', '14px'),
                            }}
                          >
                            {row.factor}
                          </td>
                          <td
                            style={{
                              padding: ms('8px 10px', '10px 12px', '14px'),
                              color: '#4a8c7e',
                              fontWeight: '600',
                              fontSize: ms('11px', '12px', '14px'),
                            }}
                          >
                            {row.withAttorney}
                          </td>
                          <td
                            style={{
                              padding: ms('8px 10px', '10px 12px', '14px'),
                              color: '#999',
                              fontWeight: '500',
                              fontSize: ms('11px', '12px', '14px'),
                            }}
                          >
                            {row.withoutAttorney}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          }

          // ── Settlement Example ────────────────────────────────────────
          case 'settlementExample': {
            const examples = block.examples || []
            const displayExamples = examples.length > 0 ? examples.slice(0, 3) : []
            return (
              <div
                key={idx}
                id="block-settlement-example"
                data-section
                style={{ marginBottom: ms('32px', '40px', '56px'), scrollMarginTop: '100px' }}
              >
                <h2
                  style={{
                    color: '#1a4a5a',
                    fontSize: ms('18px', '22px', '24px'),
                    fontWeight: '700',
                    marginBottom: ms('12px', '16px', '20px'),
                  }}
                >
                  {block.title || 'Real Settlement Examples: Actual Cases & Outcomes'}
                </h2>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr',
                    gap: ms('12px', '14px', '16px'),
                  }}
                >
                  {displayExamples.map((ex: any, i: number) => (
                    <div
                      key={i}
                      style={{
                        padding: ms('14px', '16px', '20px'),
                        backgroundColor: 'white',
                        borderLeft: '4px solid #4a8c7e',
                        borderRadius: '6px',
                      }}
                    >
                      <div
                        style={{
                          fontSize: ms('18px', '21px', '24px'),
                          fontWeight: '700',
                          color: '#c4714a',
                          marginBottom: '8px',
                        }}
                      >
                        {ex.settlementValue || ex.settlement}
                      </div>
                      <div
                        style={{
                          fontSize: ms('12px', '13px', '14px'),
                          fontWeight: '600',
                          color: '#1a4a5a',
                          marginBottom: '4px',
                        }}
                      >
                        {ex.injuryType || 'Various injuries'}
                      </div>
                      <div
                        style={{
                          fontSize: ms('10px', '11px', '12px'),
                          color: '#999',
                          marginBottom: '8px',
                        }}
                      >
                        Settled in {ex.caseResolutionTime || '12 months'}
                      </div>
                      <div style={{ fontSize: ms('12px', '13px', '14px'), color: '#555' }}>
                        {ex.quote || ex.description || 'Full settlement recovery'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          }

          // ── Settlement Ranges ─────────────────────────────────────────
          case 'settlementRanges': {
            const ranges = block.ranges || []
            const hasData = ranges.length > 0
            return (
              <div
                key={idx}
                id="block-settlement-ranges"
                data-section
                style={{ marginBottom: ms('32px', '40px', '56px'), scrollMarginTop: '100px' }}
              >
                <h2
                  style={{
                    color: '#1a4a5a',
                    fontSize: ms('18px', '22px', '24px'),
                    fontWeight: '700',
                    marginBottom: ms('12px', '16px', '20px'),
                  }}
                >
                  {block.title || 'Settlement Ranges'}
                </h2>
                <div style={{ overflowX: 'auto' }}>
                  <table
                    style={{
                      width: '100%',
                      borderCollapse: 'collapse',
                      marginBottom: ms('16px', '20px', '24px'),
                    }}
                  >
                    <thead>
                      <tr style={{ backgroundColor: '#1a4a5a', color: 'white' }}>
                        <th
                          style={{
                            padding: ms('8px 10px', '10px 12px', '14px'),
                            textAlign: 'left',
                            fontWeight: '600',
                            fontSize: ms('10px', '11px', '14px'),
                          }}
                        >
                          State
                        </th>
                        <th
                          style={{
                            padding: ms('8px 10px', '10px 12px', '14px'),
                            textAlign: 'left',
                            fontWeight: '600',
                            fontSize: ms('10px', '11px', '14px'),
                          }}
                        >
                          Min
                        </th>
                        <th
                          style={{
                            padding: ms('8px 10px', '10px 12px', '14px'),
                            textAlign: 'left',
                            fontWeight: '600',
                            fontSize: ms('10px', '11px', '14px'),
                          }}
                        >
                          Max
                        </th>
                        <th
                          style={{
                            padding: ms('8px 10px', '10px 12px', '14px'),
                            textAlign: 'left',
                            fontWeight: '600',
                            fontSize: ms('10px', '11px', '14px'),
                          }}
                        >
                          Avg
                        </th>
                        <th
                          style={{
                            padding: ms('8px 10px', '10px 12px', '14px'),
                            textAlign: 'left',
                            fontWeight: '600',
                            fontSize: ms('10px', '11px', '14px'),
                          }}
                        >
                          Note
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {hasData ? (
                        ranges.map((row: any, i: number) => (
                          <tr
                            key={i}
                            style={{
                              backgroundColor: i % 2 === 0 ? '#f9f5ef' : 'white',
                              borderBottom: '1px solid #e8e2d8',
                            }}
                          >
                            <td
                              style={{
                                padding: ms('8px 10px', '10px 12px', '14px'),
                                color: '#1a4a5a',
                                fontWeight: '600',
                                fontSize: ms('11px', '12px', '14px'),
                              }}
                            >
                              {row.state}
                            </td>
                            <td
                              style={{
                                padding: ms('8px 10px', '10px 12px', '14px'),
                                color: '#555',
                                fontWeight: '500',
                                fontSize: ms('11px', '12px', '14px'),
                              }}
                            >
                              {row.min || '-'}
                            </td>
                            <td
                              style={{
                                padding: ms('8px 10px', '10px 12px', '14px'),
                                color: '#555',
                                fontWeight: '500',
                                fontSize: ms('11px', '12px', '14px'),
                              }}
                            >
                              {row.max || '-'}
                            </td>
                            <td
                              style={{
                                padding: ms('8px 10px', '10px 12px', '14px'),
                                color: '#555',
                                fontWeight: '500',
                                fontSize: ms('11px', '12px', '14px'),
                              }}
                            >
                              {row.avg || '-'}
                            </td>
                            <td
                              style={{
                                padding: ms('8px 10px', '10px 12px', '14px'),
                                color: '#888',
                                fontSize: ms('10px', '11px', '13px'),
                              }}
                            >
                              {row.note || ''}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={5}
                            style={{
                              padding: ms('14px', '16px', '20px'),
                              textAlign: 'center',
                              color: '#888',
                            }}
                          >
                            Add state ranges in the Settlement Ranges block editor.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          }

          // ── Statute of Limitations ───────────────────────────────────
          case 'statuteLimitations': {
            const stateRows = block.states || []
            return (
              <div
                key={idx}
                id="block-statute-limitations"
                data-section
                style={{ marginBottom: ms('32px', '40px', '56px'), scrollMarginTop: '100px' }}
              >
                <h2
                  style={{
                    color: '#1a4a5a',
                    fontSize: ms('18px', '22px', '24px'),
                    fontWeight: '700',
                    marginBottom: ms('12px', '16px', '20px'),
                  }}
                >
                  Your Statute of Limitations is Ticking
                </h2>
                {block.description && (
                  <p
                    style={{
                      color: '#555',
                      lineHeight: '1.8',
                      marginBottom: ms('12px', '14px', '16px'),
                      fontSize: ms('14px', '15px', '18px'),
                    }}
                  >
                    {block.description}
                  </p>
                )}
                <div
                  style={{
                    backgroundColor: '#f0f8f6',
                    borderLeft: '4px solid #c4714a',
                    padding: ms('16px', '22px', '28px'),
                    marginBottom: ms('16px', '20px', '24px'),
                    borderRadius: '6px',
                  }}
                >
                  <div style={{ marginBottom: ms('14px', '16px', '20px') }}>
                    <label
                      style={{
                        fontSize: ms('12px', '13px', '14px'),
                        fontWeight: '600',
                        color: '#1a4a5a',
                        display: 'block',
                        marginBottom: ms('8px', '10px', '12px'),
                      }}
                    >
                      Select your state:
                    </label>
                    <select
                      value="california"
                      style={{
                        width: '100%',
                        padding: ms('8px 10px', '10px 12px'),
                        borderRadius: '4px',
                        border: '1px solid #4a8c7e',
                        color: '#555',
                        fontSize: ms('12px', '13px', '14px'),
                        fontFamily: 'inherit',
                        backgroundColor: 'white',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      {stateRows.length > 0 ? (
                        stateRows.map((r: any, i: number) => (
                          <option key={i} value={r.state?.toLowerCase().replace(/\s+/g, '-')}>
                            {r.state}
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="california">California</option>
                          <option value="texas">Texas</option>
                          <option value="florida">Florida</option>
                        </>
                      )}
                    </select>
                  </div>
                  <div
                    style={{
                      fontSize: ms('13px', '14px', '16px'),
                      fontWeight: '600',
                      color: '#c4714a',
                      marginBottom: '10px',
                    }}
                  >
                    Deadline: {block.defaultYears || 2} years from date of injury
                  </div>
                  <div
                    style={{
                      fontSize: ms('12px', '13px', '14px'),
                      color: '#555',
                      lineHeight: '1.6',
                    }}
                  >
                    Evidence degrades daily. Contact an attorney immediately to preserve your claim.
                  </div>
                </div>
              </div>
            )
          }

          // ── Critical Mistakes ────────────────────────────────────────
          case 'criticalMistakes': {
            const mistakes = block.mistakes || []
            return (
              <div
                key={idx}
                id="block-critical-mistakes"
                data-section
                style={{
                  paddingTop: ms('40px', '72px', '96px'),
                  paddingBottom: ms('40px', '72px', '96px'),
                  backgroundColor: '#f9f5ef',
                  paddingLeft: ms('16px', '24px', '0'),
                  paddingRight: ms('16px', '24px', '0'),
                }}
              >
                <div style={{ maxWidth: '896px', margin: '0 auto' }}>
                  <h2
                    style={{
                      fontSize: ms('18px', '22px', '24px'),
                      fontWeight: 'bold',
                      marginBottom: ms('12px', '16px'),
                      color: '#1a4a5a',
                    }}
                  >
                    Critical Mistakes to Avoid
                  </h2>
                  <p
                    style={{
                      fontSize: ms('14px', '16px', '18px'),
                      marginBottom: ms('24px', '48px', '64px'),
                      color: '#555',
                    }}
                  >
                    These mistakes can destroy your case. Don't make them.
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: ms('12px', '14px', '16px'),
                    }}
                  >
                    {mistakes.map((item: any, i: number) => (
                      <div
                        key={i}
                        style={{
                          borderRadius: ms('8px', '10px', '12px'),
                          borderLeft: '4px solid #c4714a',
                          backgroundColor: 'white',
                          padding: ms('14px', '20px', '24px'),
                        }}
                      >
                        <h3
                          style={{
                            fontWeight: 'bold',
                            marginBottom: '8px',
                            color: '#c4714a',
                            fontSize: ms('14px', '15px', '18px'),
                          }}
                        >
                          {item.mistake}
                        </h3>
                        <p
                          style={{
                            color: '#555',
                            margin: 0,
                            fontSize: ms('13px', '14px', '18px'),
                            lineHeight: '1.6',
                          }}
                        >
                          {item.reason}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          }

          // ── End CTA Section ───────────────────────────────────────────
          case 'endCtaSection': {
            const siteLinkUrl = block.siteLink
              ? typeof block.siteLink === 'object'
                ? block.siteLink?.url
                : block.siteLink
              : null
            const ctaHref = siteLinkUrl || `tel:${block.phoneNumber || '+18002273669'}`
            return (
              <div
                key={idx}
                id="block-end-cta"
                data-section
                style={{
                  paddingTop: ms('48px', '72px', '96px'),
                  paddingBottom: ms('48px', '72px', '96px'),
                  backgroundColor: '#1a4a5a',
                  paddingLeft: ms('16px', '24px', '0'),
                  paddingRight: ms('16px', '24px', '0'),
                }}
              >
                <div
                  style={{
                    maxWidth: '672px',
                    margin: '0 auto',
                    textAlign: 'center',
                    padding: isMobileView ? '0 16px' : '0',
                  }}
                >
                  <h2
                    style={{
                      fontSize: ms('18px', '22px', '24px'),
                      fontWeight: 'bold',
                      marginBottom: ms('12px', '16px'),
                      color: 'white',
                    }}
                  >
                    {block.heading || "You've Done Everything Right"}
                  </h2>
                  <p
                    style={{
                      fontSize: ms('14px', '16px', '18px'),
                      marginBottom: ms('20px', '28px', '32px'),
                      color: '#d1d5db',
                    }}
                  >
                    {block.subcopy ||
                      'Now let an attorney protect your rights. Get a free consultation with no obligation.'}
                  </p>
                  <a
                    href={ctaHref}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: '#c4714a',
                      color: 'white',
                      padding: ms('10px 20px', '14px 28px', '16px 32px'),
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      fontSize: ms('14px', '16px', '18px'),
                      textDecoration: 'none',
                    }}
                  >
                    {block.buttonLabel || 'Call Now: 1-800-227-3669'}
                    <ArrowRight size={ms('16px', '18px', '20px')} />
                  </a>
                </div>
              </div>
            )
          }

          default:
            return (
              <div
                key={idx}
                style={{
                  padding: '12px',
                  backgroundColor: '#fff8f0',
                  borderRadius: '4px',
                  marginBottom: '12px',
                  fontSize: '13px',
                  color: '#999',
                }}
              >
                Unknown block type: {block.blockType}
              </div>
            )
        }
      })}
    </>
  )
}

export default function GuideArticleClient({
  article,
  category,
  isPreview = false,
}: GuideArticleClientProps) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeSection, setActiveSection] = useState('')
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024,
  )
  const [showBackToTop, setShowBackToTop] = useState(false)

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
      setShowBackToTop(scrolled > 400)

      // Use data-section approach for dynamic section tracking
      const sections = document.querySelectorAll('[data-section]')
      let currentActive = ''

      // First pass: prefer block-level IDs (block-X) over heading-level IDs (heading-text)
      // This aligns with the TOC which uses block IDs
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect()
        // Section is active when heading top is within top 25% of viewport
        if (rect.top < window.innerHeight * 0.25 && rect.top > -rect.height) {
          // Prefer block-level IDs (contain "block-") over heading-derived IDs
          if (section.id.startsWith('block-') && !currentActive.startsWith('block-')) {
            currentActive = section.id
          } else if (!currentActive) {
            currentActive = section.id
          }
        }
      })

      if (currentActive && currentActive !== activeSection) {
        setActiveSection(currentActive)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [activeSection])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const toString = (val: any): string => {
    if (typeof val === 'string') return val
    if (val === null || val === undefined) return ''
    if (typeof val === 'number') return String(val)
    if (Array.isArray(val))
      return val
        .map((item) => toString(item))
        .filter(Boolean)
        .join(', ')
    if (val.value) return String(val.value)
    if (val.label) return String(val.label)
    return JSON.stringify(val)
  }

  const categorySlug =
    typeof category === 'object' && category?.slug
      ? category.slug
      : typeof article.guideCategory === 'object' && article.guideCategory?.slug
        ? article.guideCategory.slug
        : 'guide'

  const categoryTitle =
    typeof category === 'object' && category?.title
      ? category.title
      : typeof article.guideCategory === 'object' && article.guideCategory?.title
        ? article.guideCategory.title
        : 'Guide'

  const isMobileView = viewportWidth < 768
  const isTablet = viewportWidth >= 768 && viewportWidth < 1024
  const contentWidth = isMobileView ? 'calc(100% - 32px)' : isTablet ? 'calc(100% - 48px)' : '700px'
  const containerPadding = isMobileView ? '16px' : '40px'

  const blockTypeToTocEntry = (
    blockType: string,
    block: any,
  ): { id: string; title: string } | null => {
    switch (blockType) {
      case 'directAnswer':
        return { id: 'block-direct-answer', title: 'Direct Answer' }
      case 'quickActionPlan':
        return { id: 'block-quick-action-plan', title: 'Quick Action Plan' }
      case 'keyTakeaways':
        return { id: 'block-key-takeaways', title: 'Key Takeaways' }
      case 'stepChecklist':
        return { id: 'block-step-checklist', title: 'Step-by-Step Checklist' }
      case 'citationFact':
        return { id: 'block-citation-fact', title: 'Key Statistics' }
      case 'statCallout':
        return null
      case 'comparison':
        return { id: 'block-comparison', title: 'Comparison' }
      case 'caseScenario':
        return { id: 'block-case-scenario', title: 'Case Scenarios' }
      case 'faqAccordion':
        return { id: 'block-faq-accordion', title: 'Full FAQ' }
      case 'peopleAlsoAsk':
        return { id: 'block-people-also-ask', title: 'Common Questions' }
      case 'protectionPlan':
        return { id: 'block-protection-plan', title: 'Protection Plan' }
      case 'cta':
        return null
      case 'disclaimer':
        return null
      case 'updateLog':
        return null
      case 'entityContext':
        return null
      case 'expertQuote':
        return { id: 'block-expert-quote', title: 'Expert Insight' }
      case 'termDefinition':
        return null
      case 'relatedArticleLink':
        return null
      case 'relatedGuideArticle':
        return null
      case 'relatedGuideCategory':
        return null
      case 'richText':
        return null
      case 'standfirst':
        return null
      case 'immediateActions':
        return { id: 'block-immediate-actions', title: '72-Hour Checklist' }
      case 'medicalDocumentation':
        return { id: 'block-medical-documentation', title: 'Medical Care' }
      case 'attorneyComparison':
        return { id: 'block-attorney-comparison', title: 'Attorney Comparison' }
      case 'settlementExample':
        return { id: 'block-settlement-example', title: 'Case Examples' }
      case 'settlementRanges':
        return { id: 'block-settlement-ranges', title: 'Settlement Ranges' }
      case 'statuteLimitations':
        return { id: 'block-statute-limitations', title: 'Deadline' }
      case 'criticalMistakes':
        return { id: 'block-critical-mistakes', title: 'Critical Mistakes' }
      case 'endCtaSection':
        return null
      default:
        return null
    }
  }

  const blocks = article.blocks || []

  // Build TOC in document order: blocks + headings from richText blocks interleaved
  const tableOfContents: { id: string; title: string }[] = []
  blocks.forEach((block: any) => {
    // Add block-level entry
    const blockEntry = blockTypeToTocEntry(block.blockType, block)
    if (blockEntry) {
      tableOfContents.push(blockEntry)
    }
    // Extract headings from richText block and add them in-place
    if (block.blockType === 'richText' && block.content?.root?.children) {
      block.content.root.children.forEach((node: any) => {
        if (node.type === 'heading' && node.tag === 'h2' && node.children?.[0]?.text) {
          const text = node.children[0].text
          const id = text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
          tableOfContents.push({ id, title: text })
        }
      })
    }
  })

  const authorInfo = {
    name: toString(article.author?.name) || 'Sarah Mitchell, Esq.',
    credentials:
      toString(article.author?.credentials) ||
      'Personal Injury Attorney | 15+ years experience | Board Certified',
    recovered: toString(article.author?.recovered) || '$50M+ Recovered',
  }

  return (
    <div style={{ backgroundColor: '#f9f5ef', minHeight: '100vh', position: 'relative' }}>
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
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-16 ${isMobileView ? 'px-4' : 'px-7'} flex items-center justify-between transition-all duration-300 ${
          scrollProgress > 15
            ? 'bg-[#f9f5ef] border-b border-[#e8e2d8] shadow-md'
            : 'bg-transparent'
        }`}
        style={{
          opacity: scrollProgress > 15 ? 1 : 0,
          pointerEvents: scrollProgress > 15 ? 'auto' : 'none',
        }}
      >
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-[#1a4a5a] flex items-center justify-center">
            <span className="font-bold text-white text-lg">CP</span>
          </div>
          <span className="hidden sm:inline text-sm font-semibold text-[#1a4a5a]">CasePort</span>
        </Link>

        <Link
          href="/checkmycase"
          className="bg-[#c4714a] text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-[#d4855e] transition-all shadow-md"
        >
          Free Case Review
        </Link>
      </nav>

      {/* Hero Section with Background Image */}
      <div
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(26, 74, 90, 0.85) 0%, rgba(74, 140, 126, 0.75) 100%), url(${article.heroImage?.url || 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1200&h=500&fit=crop'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: 'clamp(280px, 45vw, 500px)',
          position: 'relative',
          padding: isMobileView ? '24px' : '60px',
          transition: 'all 0.3s ease',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            position: 'absolute',
            bottom: isMobileView ? '20px' : '60px',
            left: isMobileView ? '20px' : '60px',
            right: isMobileView ? '20px' : 'auto',
            width: isMobileView ? 'auto' : '65%',
            maxWidth: isMobileView ? 'auto' : '900px',
          }}
        >
          <div
            style={{
              color: '#c4714a',
              fontSize: '11px',
              fontWeight: '700',
              letterSpacing: '1px',
              marginBottom: '12px',
              textTransform: 'uppercase',
            }}
          >
            {categoryTitle}
          </div>
          <h1
            style={{
              color: 'white',
              fontSize: 'clamp(24px, 6vw, 56px)',
              fontWeight: '700',
              marginBottom: '12px',
              lineHeight: '1.15',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
            }}
          >
            {article.title}
          </h1>
          <p
            style={{
              color: '#e8e2d8',
              fontSize: isMobileView ? '16px' : '18px',
              maxWidth: '600px',
              lineHeight: '1.6',
              overflowWrap: 'break-word',
            }}
          >
            {article.excerpt ||
              article.metaDescription ||
              `The first 72 hours are critical. This guide walks you through exactly what to do.`}
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
            flexWrap: 'wrap',
          }}
          aria-label="Breadcrumb"
        >
          <Link
            href="/guides"
            style={{ color: '#1a4a5a', textDecoration: 'none', fontWeight: '500' }}
          >
            Guides
          </Link>
          <span>/</span>
          <Link
            href={`/guides/${categorySlug}`}
            style={{ color: '#1a4a5a', textDecoration: 'none', fontWeight: '500' }}
          >
            {categoryTitle}
          </Link>
          <span>/</span>
          <span style={{ color: '#4a8c7e', fontWeight: '500' }}>{article.title}</span>
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
            flexDirection: isMobileView ? 'column' : isTablet ? 'row' : 'row',
            gap: isMobileView ? '16px' : isTablet ? '24px' : '32px',
            flexWrap: 'wrap',
            fontSize: isMobileView ? '14px' : '13px',
            color: '#555',
          }}
        >
          {authorInfo.name && (
            <div>
              <div style={{ fontWeight: '600', color: '#1a4a5a', marginBottom: '4px' }}>
                By {authorInfo.name}
              </div>
              {authorInfo.credentials && (
                <div style={{ fontSize: isMobileView ? '13px' : '12px', color: '#999' }}>
                  {authorInfo.credentials}
                </div>
              )}
            </div>
          )}
          {article.publishedDate && (
            <div>
              <div style={{ fontWeight: '600', color: '#1a4a5a', marginBottom: '4px' }}>
                Published
              </div>
              <div style={{ fontSize: isMobileView ? '13px' : '12px', color: '#999' }}>
                {new Date(article.publishedDate).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
            </div>
          )}
          {article.updatedAt && (
            <div>
              <div style={{ fontWeight: '600', color: '#1a4a5a', marginBottom: '4px' }}>
                Updated
              </div>
              <div style={{ fontSize: isMobileView ? '13px' : '12px', color: '#999' }}>
                {new Date(article.updatedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
                {article.reviewCycle && (
                  <span>
                    {' • '}
                    {article.reviewCycle === '3months' && 'Updated Quarterly'}
                    {article.reviewCycle === '6months' && 'Updated Semi-Annually'}
                    {article.reviewCycle === '12months' && 'Updated Annually'}
                    {article.reviewCycle === 'evergreen' && 'Evergreen Content'}
                  </span>
                )}
              </div>
            </div>
          )}
          {article.estimatedCompletionTime && (
            <div>
              <div style={{ fontWeight: '600', color: '#1a4a5a', marginBottom: '4px' }}>
                Read Time
              </div>
              <div style={{ fontSize: isMobileView ? '13px' : '12px', color: '#999' }}>
                {article.estimatedCompletionTime}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Trust Badges */}
      <div
        style={{
          backgroundColor: '#f9f5ef',
          padding: isMobileView ? '12px 16px' : '12px 40px',
          borderBottom: '1px solid #e8e2d8',
        }}
      >
        <VerifiedBadges
          isAttorneyReviewed={!!article.showAttorneyReviewedBadge}
          isABACompliant={!!article.showABACompliantBadge}
          lastUpdatedDate={
            article.showLastUpdatedBadge && article.updatedAt
              ? new Date(article.updatedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : undefined
          }
          reviewCycle={article.reviewCycle}
        />
      </div>

      {/* Main Content with Sidebar Layout */}
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
          <BlockRenderer
            blocks={article.blocks || []}
            isMobileView={isMobileView}
            isTablet={isTablet}
          />
        </div>

        {/* Right Sidebar TOC - Hidden on mobile */}
        {!isMobileView && (
          <TableOfContents
            entries={tableOfContents}
            activeSection={activeSection}
            variant="light"
          />
        )}
      </div>

      {/* Floating Back to Top Button */}
      <button
        onClick={scrollToTop}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: isMobileView ? '40px' : '48px',
          height: isMobileView ? '40px' : '48px',
          borderRadius: '50%',
          backgroundColor: '#1a4a5a',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 9999,
          opacity: showBackToTop ? 1 : 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: showBackToTop ? 'auto' : 'none',
        }}
        aria-label="Back to top"
      >
        <ArrowUp size={isMobileView ? '16' : '20'} />
      </button>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
