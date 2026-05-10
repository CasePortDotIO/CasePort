'use client'

import { useState } from 'react'

interface KeywordMetrics {
  keyword: string
  volume: number
  cpc: number
  difficulty: number
  trend: string
  serpFeatures: string[]
}

interface FaqSuggestion {
  question: string
}

interface SemanticResearchProps {
  formData?: any
}

export default function KeywordResearchPanel({ formData }: SemanticResearchProps) {
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(false)
  const [metrics, setMetrics] = useState<KeywordMetrics | null>(null)
  const [faqSuggestions, setFaqSuggestions] = useState<string[]>([])
  const [error, setError] = useState('')

  const handleLookup = async () => {
    if (!keyword.trim()) return
    setLoading(true)
    setError('')
    try {
      // Fetch keyword overview
      const overviewRes = await fetch(`/api/semrush?action=overview&keyword=${encodeURIComponent(keyword)}`)
      const overviewData = await overviewRes.json()

      if (overviewData.error) {
        setError(overviewData.error)
        setMetrics(null)
      } else if (overviewData.results && overviewData.results.length > 0) {
        const result = overviewData.results[0]
        setMetrics({
          keyword: result.keyword,
          volume: result.vol || 0,
          cpc: result.cpc || 0,
          difficulty: result.phrasedifficulty || 0,
          trend: result.trend || '',
          serpFeatures: result.serp_features || [],
        })

        // Also fetch FAQ suggestions
        const faqRes = await fetch(`/api/semrush?action=faq&keyword=${encodeURIComponent(keyword)}`)
        const faqData = await faqRes.json()
        if (faqData.questions) {
          setFaqSuggestions(faqData.questions)
        }
      } else {
        setError('No data found for this keyword')
        setMetrics(null)
      }
    } catch (err) {
      setError('Failed to fetch keyword data')
      setMetrics(null)
    } finally {
      setLoading(false)
    }
  }

  
  const getVolumeLabel = (vol: number) => {
    if (vol >= 10000) return 'High'
    if (vol >= 1000) return 'Medium'
    if (vol >= 100) return 'Low'
    return 'Very Low'
  }

  return (
    <div style={{
      padding: '16px',
      background: '#f8fafc',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      marginBottom: '12px',
    }}>
      <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>
        Semrush Keyword Research
      </h4>

      {/* Keyword Input */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Enter keyword (e.g. personal injury lawyer)"
          onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
          style={{
            flex: 1,
            padding: '8px 12px',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            fontSize: '13px',
            outline: 'none',
          }}
        />
        <button
          type="button"
          onClick={handleLookup}
          disabled={loading || !keyword.trim()}
          style={{
            padding: '8px 16px',
            background: loading ? '#94a3b8' : 'linear-gradient(to right, #00B4D8, #5BB6C9, #7C5CFF)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          {loading ? 'Loading...' : 'Lookup'}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          padding: '8px 12px',
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '6px',
          color: '#dc2626',
          fontSize: '12px',
          marginBottom: '12px',
        }}>
          {error}
        </div>
      )}

      {/* Metrics Display */}
      {metrics && (
        <div style={{
          background: 'white',
          borderRadius: '6px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          marginBottom: '12px',
        }}>
          {/* Keyword & Volume */}
          <div style={{
            padding: '12px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '2px' }}>KEYWORD</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{metrics.keyword}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '2px' }}>VOLUME</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                {metrics.volume.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            borderBottom: '1px solid #e2e8f0',
          }}>
            {[
              { label: 'CPC', value: `$${metrics.cpc.toFixed(2)}` },
              { label: 'Volume', value: getVolumeLabel(metrics.volume) },
            ].map((stat) => (
              <div key={stat.label} style={{
                padding: '10px 12px',
                borderRight: '1px solid #e2e8f0',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '2px' }}>{stat.label}</div>
                <div style={{
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#0f172a',
                }}>
                  {stat.value}
                </div>
              </div>
            ))}
          </div>

          {/* SERP Features */}
          {metrics.serpFeatures && metrics.serpFeatures.length > 0 && (
            <div style={{ padding: '10px 12px' }}>
              <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '6px' }}>SERP FEATURES</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                {metrics.serpFeatures.map((feature, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '2px 8px',
                      background: '#f1f5f9',
                      borderRadius: '4px',
                      fontSize: '11px',
                      color: '#475569',
                    }}
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* FAQ Suggestions */}
      {faqSuggestions.length > 0 && (
        <div>
          <div style={{
            fontSize: '11px',
            color: '#64748b',
            marginBottom: '8px',
            fontWeight: 600,
          }}>
            SUGGESTED FAQ QUESTIONS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {faqSuggestions.map((q, idx) => (
              <div
                key={idx}
                style={{
                  padding: '8px 10px',
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: '#334155',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  navigator.clipboard.writeText(q)
                }}
                title="Click to copy"
              >
                {q}
              </div>
            ))}
          </div>
          <div style={{
            marginTop: '8px',
            fontSize: '10px',
            color: '#94a3b8',
            textAlign: 'center',
          }}>
            Click to copy
          </div>
        </div>
      )}
    </div>
  )
}