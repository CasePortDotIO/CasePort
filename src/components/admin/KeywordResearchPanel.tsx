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

interface SecondaryKeyword {
  keyword: string
  volume: number
  cpc: number
  difficulty: number
}

interface SerpOpportunity {
  keyword: string
  volume: number
  serpFeature: string
  difficulty: number
  cpc: number
}

interface CompetitorGap {
  missedKeywords: { keyword: string; competitorVolume: number; missedOpportunity: boolean }[]
  sharedKeywords: string[]
  opportunities: string[]
}

interface RankResult {
  keyword: string
  currentRank: number
  previousRank: number
  change: number
  searchVolume: number
}

interface InternalLinkSuggestion {
  sourceArticle: string
  targetArticle: string
  targetKeyword: string
  relevanceScore: number
  reason: string
}

type TabType = 'keywords' | 'serp' | 'competitors' | 'rankings' | 'links'

export default function KeywordResearchPanel({ formData }: { formData?: any }) {
  const [activeTab, setActiveTab] = useState<TabType>('keywords')
  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Tab data states
  const [metrics, setMetrics] = useState<KeywordMetrics | null>(null)
  const [secondaryKeywords, setSecondaryKeywords] = useState<SecondaryKeyword[]>([])
  const [faqSuggestions, setFaqSuggestions] = useState<string[]>([])
  const [serpOpportunities, setSerpOpportunities] = useState<SerpOpportunity[]>([])
  const [competitorGap, setCompetitorGap] = useState<CompetitorGap | null>(null)
  const [rankings, setRankings] = useState<RankResult[]>([])
  const [internalLinks, setInternalLinks] = useState<InternalLinkSuggestion[]>([])

  const handleLookup = async () => {
    if (!keyword.trim()) return
    setLoading(true)
    setError('')
    setMetrics(null)
    setSecondaryKeywords([])
    setFaqSuggestions([])
    setSerpOpportunities([])
    setCompetitorGap(null)
    setRankings([])
    setInternalLinks([])

    try {
      // Fetch all data in parallel for efficiency
      const [overviewRes, secondaryRes, faqRes, serpRes, analyzeRes] = await Promise.all([
        fetch(`/api/semrush?action=overview&keyword=${encodeURIComponent(keyword)}`),
        fetch(`/api/semrush?action=secondary&keyword=${encodeURIComponent(keyword)}`),
        fetch(`/api/semrush?action=faq&keyword=${encodeURIComponent(keyword)}`),
        fetch(`/api/semrush?action=serp&keyword=${encodeURIComponent(keyword)}`),
        fetch(`/api/semrush?action=analyze&keyword=${encodeURIComponent(keyword)}`),
      ])

      // Overview data
      const overviewData = await overviewRes.json()
      if (overviewData.error) {
        setError(overviewData.error)
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
      }

      // Secondary keywords
      const secondaryData = await secondaryRes.json()
      if (secondaryData.secondary) {
        setSecondaryKeywords(secondaryData.secondary)
      }

      // FAQ suggestions
      const faqData = await faqRes.json()
      if (faqData.questions) {
        setFaqSuggestions(faqData.questions)
      }

      // SERP opportunities
      const serpData = await serpRes.json()
      if (serpData.opportunities) {
        setSerpOpportunities(serpData.opportunities)
      }

      // Full analysis
      const analyzeData = await analyzeRes.json()
      if (analyzeData.analysis) {
        const analysis = analyzeData.analysis
        if (analysis.secondary) setSecondaryKeywords(analysis.secondary)
        if (analysis.faqQuestions) setFaqSuggestions(analysis.faqQuestions)
        if (analysis.serpOpportunities) setSerpOpportunities(analysis.serpOpportunities)
        if (analysis.missedOpportunities && analysis.missedOpportunities.length > 0) {
          setCompetitorGap({
            missedKeywords: analysis.missedOpportunities.map((kw: string) => ({
              keyword: kw,
              competitorVolume: 0,
              missedOpportunity: true,
            })),
            sharedKeywords: [],
            opportunities: analysis.missedOpportunities,
          })
        }
      }
    } catch (err) {
      setError('Failed to fetch keyword data')
    } finally {
      setLoading(false)
    }
  }

  // Fetch rank tracking
  const handleTrackRankings = async () => {
    if (!keyword.trim()) return
    setLoading(true)
    try {
      const res = await fetch(`/api/semrush?action=rank-tracking&keywords=${encodeURIComponent(keyword)}`)
      const data = await res.json()
      if (data.rankings) setRankings(data.rankings)
    } catch (err) {
      setError('Failed to fetch ranking data')
    } finally {
      setLoading(false)
    }
  }

  // Fetch internal link suggestions
  const handleSuggestLinks = async () => {
    if (!keyword.trim()) return
    setLoading(true)
    try {
      // Get existing articles from formData or use empty
      const existingArticles = formData?.relatedArticles || []
      const res = await fetch(
        `/api/semrush?action=internal-links&title=${encodeURIComponent(formData?.title || keyword)}&articleKeywords=${encodeURIComponent(keyword)}&existingArticles=${encodeURIComponent(JSON.stringify(existingArticles))}`
      )
      const data = await res.json()
      if (data.suggestions) setInternalLinks(data.suggestions)
    } catch (err) {
      setError('Failed to fetch link suggestions')
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

  const getDifficultyColor = (diff: number) => {
    if (diff < 30) return '#10b981' // green - easy
    if (diff < 60) return '#f59e0b' // yellow - medium
    return '#ef4444' // red - hard
  }

  const tabs: { id: TabType; label: string }[] = [
    { id: 'keywords', label: 'Keywords' },
    { id: 'serp', label: 'SERP Features' },
    { id: 'competitors', label: 'Competitors' },
    { id: 'rankings', label: 'Rankings' },
    { id: 'links', label: 'Internal Links' },
  ]

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
          placeholder="Enter focus keyword (e.g. personal injury lawyer)"
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
          {loading ? 'Loading...' : 'Research'}
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

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '12px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '6px 12px',
              background: activeTab === tab.id ? '#1e293b' : 'transparent',
              color: activeTab === tab.id ? 'white' : '#64748b',
              border: 'none',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── TAB: Keywords (Primary + Secondary) ─── */}
      {activeTab === 'keywords' && (
        <div>
          {/* Primary Keyword Metrics */}
          {metrics && (
            <div style={{
              background: 'white',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              marginBottom: '12px',
            }}>
              <div style={{
                padding: '12px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <div>
                  <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '2px' }}>PRIMARY KEYWORD</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>{metrics.keyword}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '2px' }}>VOLUME</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
                    {metrics.volume.toLocaleString()}
                  </div>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                borderBottom: '1px solid #e2e8f0',
              }}>
                {[
                  { label: 'CPC', value: `$${metrics.cpc.toFixed(2)}` },
                  { label: 'DIFFICULTY', value: `${metrics.difficulty}%` },
                  { label: 'VOLUME LABEL', value: getVolumeLabel(metrics.volume) },
                ].map((stat) => (
                  <div key={stat.label} style={{
                    padding: '10px 12px',
                    borderRight: '1px solid #e2e8f0',
                    textAlign: 'center',
                  }}>
                    <div style={{ fontSize: '10px', color: '#64748b', marginBottom: '2px' }}>{stat.label}</div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{stat.value}</div>
                  </div>
                ))}
              </div>

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

          {/* Secondary Keywords */}
          {secondaryKeywords.length > 0 && (
            <div>
              <div style={{
                fontSize: '11px',
                color: '#64748b',
                marginBottom: '8px',
                fontWeight: 600,
              }}>
                SECONDARY KEYWORDS (for H2s & content)
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {secondaryKeywords.map((kw, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '8px 10px',
                      background: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span style={{ color: '#334155', fontWeight: 500 }}>{kw.keyword}</span>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <span style={{ color: '#64748b', fontSize: '10px' }}>Vol: {kw.volume.toLocaleString()}</span>
                      <span
                        style={{
                          color: getDifficultyColor(kw.difficulty),
                          fontSize: '10px',
                          fontWeight: 600,
                        }}
                      >
                        {kw.difficulty}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQ Suggestions */}
          {faqSuggestions.length > 0 && (
            <div style={{ marginTop: '12px' }}>
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
                    onClick={() => navigator.clipboard.writeText(q)}
                    title="Click to copy"
                  >
                    {q}
                  </div>
                ))}
              </div>
              <div style={{ fontSize: '10px', color: '#94a3b8', textAlign: 'center', marginTop: '4px' }}>
                Click to copy
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── TAB: SERP Features ─── */}
      {activeTab === 'serp' && (
        <div>
          {serpOpportunities.length > 0 ? (
            <div>
              <div style={{
                fontSize: '11px',
                color: '#64748b',
                marginBottom: '8px',
                fontWeight: 600,
              }}>
                SERP FEATURE OPPORTUNITIES
              </div>
              {serpOpportunities.map((opp, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '10px 12px',
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    marginBottom: '6px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b' }}>{opp.keyword}</span>
                    <span style={{
                      padding: '2px 8px',
                      background: '#dbeafe',
                      color: '#1d4ed8',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: 600,
                    }}>
                      {opp.serpFeature}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '10px', color: '#64748b' }}>
                    <span>Vol: {opp.volume.toLocaleString()}</span>
                    <span>Difficulty: {opp.difficulty}%</span>
                    <span>CPC: ${opp.cpc.toFixed(2)}</span>
                  </div>
                </div>
              ))}
              <div style={{
                marginTop: '12px',
                padding: '10px',
                background: '#f0fdf4',
                borderRadius: '6px',
                fontSize: '11px',
                color: '#166534',
              }}>
                💡 Target these keywords to capture featured snippets and People Also Ask boxes
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '12px', padding: '20px' }}>
              Run a keyword search first to see SERP opportunities
            </div>
          )}
        </div>
      )}

      {/* ─── TAB: Competitors ─── */}
      {activeTab === 'competitors' && (
        <div>
          {competitorGap ? (
            <div>
              <div style={{
                fontSize: '11px',
                color: '#64748b',
                marginBottom: '8px',
                fontWeight: 600,
              }}>
                CONTENT GAP ANALYSIS
              </div>

              {competitorGap.opportunities.length > 0 && (
                <div style={{
                  padding: '12px',
                  background: '#fef3c7',
                  borderRadius: '6px',
                  marginBottom: '12px',
                }}>
                  <div style={{ fontSize: '11px', color: '#92400e', fontWeight: 600, marginBottom: '6px' }}>
                    MISSED OPPORTUNITIES — Keywords competitors rank for that you don&apos;t
                  </div>
                  {competitorGap.opportunities.slice(0, 5).map((kw, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '6px 8px',
                        background: 'white',
                        borderRadius: '4px',
                        marginBottom: '4px',
                        fontSize: '12px',
                        color: '#1e293b',
                      }}
                      onClick={() => navigator.clipboard.writeText(kw)}
                    >
                      {kw}
                    </div>
                  ))}
                </div>
              )}

              {competitorGap.sharedKeywords.length > 0 && (
                <div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '6px' }}>
                    SHARED KEYWORDS (both you and competitors rank for)
                  </div>
                  {competitorGap.sharedKeywords.slice(0, 5).map((kw, idx) => (
                    <div
                      key={idx}
                      style={{
                        padding: '6px 8px',
                        background: '#f1f5f9',
                        borderRadius: '4px',
                        marginBottom: '4px',
                        fontSize: '12px',
                        color: '#475569',
                      }}
                    >
                      {kw}
                    </div>
                  ))}
                </div>
              )}

              <div style={{
                marginTop: '12px',
                padding: '10px',
                background: '#f0fdf4',
                borderRadius: '6px',
                fontSize: '11px',
                color: '#166534',
              }}>
                💡 Create content targeting these missed opportunities to outrank competitors
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '12px', padding: '20px' }}>
              Run a keyword search first to see competitor gaps
            </div>
          )}
        </div>
      )}

      {/* ─── TAB: Rank Tracking ─── */}
      {activeTab === 'rankings' && (
        <div>
          <button
            onClick={handleTrackRankings}
            disabled={loading || !keyword.trim()}
            style={{
              padding: '8px 16px',
              background: loading ? '#94a3b8' : '#1e293b',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '12px',
            }}
          >
            {loading ? 'Loading...' : 'Track Rankings'}
          </button>

          {rankings.length > 0 ? (
            <div>
              <div style={{
                fontSize: '11px',
                color: '#64748b',
                marginBottom: '8px',
                fontWeight: 600,
              }}>
                KEYWORD RANKINGS
              </div>
              {rankings.map((rank, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '10px 12px',
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    marginBottom: '6px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b' }}>{rank.keyword}</div>
                    <div style={{ fontSize: '10px', color: '#64748b' }}>Vol: {rank.searchVolume.toLocaleString()}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: rank.change > 0 ? '#10b981' : rank.change < 0 ? '#ef4444' : '#64748b',
                    }}>
                      #{rank.currentRank}
                    </div>
                    <div style={{
                      fontSize: '10px',
                      color: rank.change > 0 ? '#10b981' : rank.change < 0 ? '#ef4444' : '#64748b',
                    }}>
                      {rank.change > 0 ? `↑ ${rank.change}` : rank.change < 0 ? `↓ ${Math.abs(rank.change)}` : '—'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '12px', padding: '20px' }}>
              Click &quot;Track Rankings&quot; to see current rankings for this keyword
            </div>
          )}
        </div>
      )}

      {/* ─── TAB: Internal Links ─── */}
      {activeTab === 'links' && (
        <div>
          <button
            onClick={handleSuggestLinks}
            disabled={loading || !keyword.trim()}
            style={{
              padding: '8px 16px',
              background: loading ? '#94a3b8' : '#1e293b',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              marginBottom: '12px',
            }}
          >
            {loading ? 'Loading...' : 'Suggest Links'}
          </button>

          {internalLinks.length > 0 ? (
            <div>
              <div style={{
                fontSize: '11px',
                color: '#64748b',
                marginBottom: '8px',
                fontWeight: 600,
              }}>
                INTERNAL LINK SUGGESTIONS
              </div>
              {internalLinks.map((link, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '10px 12px',
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    marginBottom: '6px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b' }}>
                      → {link.targetArticle}
                    </span>
                    <span style={{
                      padding: '2px 8px',
                      background: '#dbeafe',
                      color: '#1d4ed8',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: 600,
                    }}>
                      {link.relevanceScore}% match
                    </span>
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748b' }}>
                    Use keyword: <strong>{link.targetKeyword}</strong>
                  </div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>
                    {link.reason}
                  </div>
                </div>
              ))}
              <div style={{
                marginTop: '12px',
                padding: '10px',
                background: '#f0fdf4',
                borderRadius: '6px',
                fontSize: '11px',
                color: '#166534',
              }}>
                💡 Add these links naturally within your article content for SEO benefit
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '12px', padding: '20px' }}>
              Click &quot;Suggest Links&quot; to find internal linking opportunities
            </div>
          )}
        </div>
      )}
    </div>
  )
}