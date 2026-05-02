# CasePort Total Dominance Master Guide

**Purpose:** Build a top 0.01% personal injury law content platform dominating AEO/SEO/GEO/SGE/AI from day 1.

**Key Metrics (Target):**
| Metric | Score |
|---|---|
| Overall Dominance | 94/100 |
| AEO Score | 98/100 |
| SEO Score | 96/100 |
| SGE Score | 97/100 |
| GEO Score | 90/100 |
| Voice Search Score | 85/100 |
| E-E-A-T Signals | 94/100 |
| Topical Authority | 94/100 |

---

## Part 1: Frontend Template — Truck Accident Article

**Live URL:** `/insights/[slug]`
**Template:** `src/app/(frontend)/insights/[slug]/ArticleClient.tsx`

### 17 Content Sections

1. **Hero & Metadata** — Title, subtitle, author credentials, published/updated dates, read time, badges
2. **Direct Answer (AEO/SGE)** — 250+ char extractable answer with bold critical terms
3. **TL;DR Action Plan** — Numbered time-based list (0-5 min, 5-15 min, 24 hrs, 48 hrs)
4. **Key Takeaways** — 6 checkmark points reinforcing conversion messages
5. **First 24-Hour Checklist** — H2 steps with time estimates (Safety → Document → Medical → Attorney → Settlement)
6. **Medical Documentation** — Why critical for settlement + conversion angle
7. **Settlement Table** — With Attorney vs Without comparison (5x difference)
8. **Real Settlement Examples** — 3 case studies with $ amounts, injury types, timelines
9. **State-by-State Breakdown** — Settlement ranges table by injury severity + state selector
10. **Statute of Limitations** — State selector with urgency CTA (tel: link)
11. **People Also Ask** — Conversational Q&A matching SERP feature
12. **FAQ Section** — 8 expandable FAQs with 50-100 word answers (FAQPage schema)
13. **Legal Authority & Citations** — FMCSA, ABA, state statutes references
14. **About the Author** — Board Certified, $50M+ recovered, 15+ years
15. **Update Log** — Quarterly update history (freshness signal)
16. **Related Injury Guides** — 4 linked guides with descriptions
17. **Final CTA** — "Don't Navigate This Alone" with benefits + phone CTA

### UI Components

- **Sticky Header** (scrolled): Logo, breadcrumb, "Free Case Review" tel: button, cream bg, warm brown CTA
- **Right Sidebar TOC** (desktop): Sticky, 280px, active section highlight (left border + bold)
- **Reading Progress Bar**: Cyan-purple gradient, top-fixed
- **Back to Top Button**: Fixed bottom-right, dark bg, appears at 600px scroll

### Design System

| Token | Value |
|---|---|
| Primary CTA | `#c4714a` (warm brown) |
| Accent | `#4a8c7e` (teal) |
| Background | `#f9f5ef` (cream) |
| Text | `#1a4a5a` (dark slate) |
| Borders | `#e8e2d8` |
| Hover | `#d4855e` |

### Schema Markup

- `Article` schema (headline, author, dates, image, keywords)
- `FAQPage` schema (mainEntity with all FAQs)

### Performance Targets

- Page Load: < 2s
- Mobile Score: > 90
- LCP: < 2.5s
- CLS: < 0.1

---

## Part 2: Payload CMS Backend

**Collection:** `Articles` (`src/collections/Articles.ts`)

### 17 Field Groups

| # | Group | Fields |
|---|---|---|
| 1 | GEO Optimization | targetStates (50), targetCities, jurisdiction, serviceAreaDescription, localSchemaType, stateSpecificDeadline, stateSpecificExceptions, tollingProvisions, stateSpecificSettlementRanges |
| 2 | SGE Optimization | sgeAnswerability, sgeOptimizedAnswer (40-60 words), uniqueContentSignals, freshnessSignal, competitorComparison |
| 3 | Dominance Scoring | seoScore, aeoScore, geoScore, sgeScore, voiceSearchScore, overallDominanceScore, dominanceRank, competitiveAdvantageScore (all readOnly, auto-calculated) |
| 4 | Competitor Analysis | topCompetitors (url, estimatedScore, yourAdvantage), competitiveGapAnalysis, uniqueAdvantages |
| 5 | Performance Metrics | totalFormSubmissions, totalEmailCaptures, averageLeadQualityScore, leadToCaseConversionRate, estimatedRevenue, estimatedProfit, roi, performanceStatus, recommendedAction (readOnly) |
| 6 | Search Engine Submission | googleSubmitted, googleSubmissionTime, googleSubmissionMessage, bingSubmitted, bingSubmissionTime, bingSubmissionMessage (readOnly) |
| 7 | Entity Extraction | primaryEntity, entityDefinition, relatedEntities, entityImportance |
| 8 | Content Validation | contentLength, h2Count, h3Count, faqCount, validationStatus, validationErrors (readOnly) |
| 9 | Internal Links | linkedArticleId, anchorText, relevanceScore (readOnly, auto-generated) |
| 10 | Content Freshness | lastReviewDate, nextReviewDue, daysOld, freshnessStatus (readOnly, auto-calculated) |
| 11 | Featured Snippet Optimization | targetSnippetType, snippetContent, currentSnippetRank, snippetOptimizationScore |
| 12 | Backlink Tracking | totalBacklinks, highQualityBacklinks, referringDomains, backlinkGrowth, backlinkLastUpdated (readOnly) |
| 13 | Keyword Ranking Tracking | keyword, currentRank, previousRank, rankChange, searchVolume, lastUpdated (readOnly) |
| 14 | Traffic & Engagement | monthlyVisitors, bounceRate, averageTimeOnPage, scrollDepth, trafficSources (readOnly) |
| 15 | AI Citation Tracking | claudeCitations, chatgptCitations, perplexityCitations, totalAiCitations, shareOfVoice, lastUpdated (readOnly) |
| 16 | Conversion Funnel | uniqueVisitors, formViews, formSubmissions, emailCaptures, confirmedLeads, confirmedCases, visitorToFormRate, formToLeadRate, leadToCaseRate (readOnly) |
| 17 | Content Quality Score | contentQualityScore (0-100, readOnly, auto-calculated) |

### 6 Hooks

| Hook | Type | Purpose |
|---|---|---|
| Content Validation | `beforeValidate` | Validates: content ≥2000 chars, ≥3 H2, ≥6 H3, ≥5 FAQs, directAnswer ≥40 chars, sgeOptimizedAnswer ≥40 chars |
| Auto-Calculate Scores | `beforeChange` | Calculates geoScore, sgeScore, voiceSearchScore, overallDominanceScore, dominanceRank; auto-generates internal links |
| Performance Metrics | `afterChange` | Updates form/cases count, conversion rate, lead quality, revenue, profit, roi, performanceStatus, recommendedAction |
| Freshness Tracking | `beforeChange` | Calculates daysOld, nextReviewDue (lastReviewDate + 90 days), freshnessStatus |
| Content Validation (post-save) | `afterChange` | Validates final content structure, sets validationStatus |
| SEO Auto-Submit | `afterChange` | On publish: revalidates Next.js path, submits to Google Indexing API, pings IndexNow |

### Scoring Logic (beforeChange hook)

```
overallDominanceScore =
  (seoScore × 0.25) +
  (aeoScore × 0.25) +
  (geoScore × 0.25) +
  (sgeScore × 0.15) +
  (voiceScore × 0.10)

dominanceRank:
  ≥80 → 'dominant'
  ≥60 → 'strong'
  ≥40 → 'weak'
  <40 → 'critical'
```

### Performance Metrics Logic (afterChange hook)

```
estimatedRevenue = totalCases × averageSettlement × 0.33
annualCost = productionCost + (monthlyMaintenance × 12)
estimatedProfit = estimatedRevenue - annualCost
roi = (estimatedProfit / annualCost) × 100

performanceStatus:
  profit ≥ $5,000 → 'highly_profitable'
  profit ≥ $1,000 → 'profitable'
  profit ≥ $0 → 'breakeven'
  profit < $0 → 'loss'

recommendedAction:
  'highly_profitable' → 'expand'
  'profitable' → 'maintain'
  'breakeven' → 'optimize'
  'loss' → 'remove'
```

---

## Expected Results

| Metric | Target |
|---|---|
| AEO Score | 98/100 |
| SEO Score | 96/100 |
| Featured Snippet Rank | #1-3 |
| AI Citation Share | Top 3 vs competitors |
| Lead-to-Case Conversion | 5x vs no-attorney baseline |
| Settlement Average | $250K with attorney vs $50K without |

---

**Status:** SPEC COMPLETE — implementation pending
