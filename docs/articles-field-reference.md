# Articles Collection — Field Group Reference

**Purpose:** Understand every field in the Articles collection, what it does, and where it surfaces (admin UI, frontend, schema, API).

---

## 1. GEO Optimization (`targetStates`, `targetCities`, `jurisdiction`...)

| Field | Type | What It Does | Where Used |
|---|---|---|---|
| `targetStates` | text (array) | States this article targets | Hook auto-calculates `geoScore`, schema `localBusiness` fallback |
| `targetCities` | array (city/state/radius) | Metro areas + service radius | Service area display on article page |
| `jurisdiction` | text | Court jurisdiction | Legal authority section |
| `serviceAreaDescription` | textarea | Natural language service area | Footer schema, local SEO |
| `localSchemaType` | select | LocalBusiness subtype | Article schema generation |
| `stateSpecificDeadline` | text | SOL for target state | Statute of Limitations section |
| `stateSpecificExceptions` | textarea | Tollings, exceptions to SOL | Statute of Limitations section |
| `tollingProvisions` | array | Rules that pause the clock | Statute of Limitations section |

**Hook:** `geoScore` auto-calculated on every save based on how many states/cities are filled + field completeness.

---

## 2. SGE Optimization (`sgeAnswerability`, `sgeOptimizedAnswer`...)

| Field | Type | What It Does | Where Used |
|---|---|---|---|
| `sgeAnswerability` | number (0-100) | Manual rating of how well content answers SGE queries | Score calculation input |
| `sgeOptimizedAnswer` | textarea (40-60 words) | Direct, extractable answer for Google SGE | **This is the #1 field for SGE visibility** |
| `uniqueContentSignals` | array | What makes this content better than competitors | SGE scoring, content quality |
| `freshnessSignal` | date | Last major update date | SGE scoring, E-E-A-T |
| `competitorComparison` | textarea | How content beats competitors | SGE scoring |

**Hook:** `sgeScore` auto-calculated on save. Fields to fill: `sgeOptimizedAnswer` (critical), `sgeAnswerability`, `freshnessSignal`.

---

## 3. Dominance Scoring (all readOnly — auto-calculated)

| Field | Type | What It Does | Where Used |
|---|---|---|---|
| `seoScore` | number | SEO completeness (0-100) | Admin sidebar, content quality dashboard |
| `aeoScore` | number | Answer Engine Optimization score | Admin sidebar |
| `geoScore` | number | GEO score from field completeness | Admin sidebar |
| `sgeScore` | number | SGE optimization score | Admin sidebar |
| `voiceSearchScore` | number | Voice search readiness score | Admin sidebar |
| `overallDominanceScore` | number | Weighted composite (formula below) | Admin sidebar, sortable list view |
| `dominanceRank` | select | `dominant` ≥80, `strong` ≥60, `weak` ≥40, `critical` <40 | Admin sidebar badge |
| `competitiveAdvantageScore` | number | Content advantage over competitors | Admin sidebar |

**Formula:**
```
overallDominanceScore = (seoScore × 0.25) + (aeoScore × 0.25) + (geoScore × 0.25) + (sgeScore × 0.15) + (voiceScore × 0.10)
```

**To improve your score:** Fill in all fields in tabs 1, 2, 4, 5, 11 — more fields filled = higher scores.

---

## 4. Competitor Analysis

| Field | Type | What It Does | Where Used |
|---|---|---|---|
| `topCompetitors` | array (url, estimatedScore, yourAdvantage) | Track top 3 competitors | Competitive analysis dashboard |
| `competitiveGapAnalysis` | textarea | What's missing from competitors | Content planning |
| `uniqueAdvantages` | textarea | Your unique value proposition | Content strategy, Schema |

**No auto-calculation.** Fill manually by auditing competitor pages.

---

## 5. Performance Metrics (all readOnly — auto-calculated)

| Field | Type | What It Does | Where Used |
|---|---|---|---|
| `totalFormSubmissions` | number | Leads captured from this article | ROI dashboard |
| `totalEmailCaptures` | number | Email newsletter signups | Email metrics |
| `averageLeadQualityScore` | number | Avg score of all leads (0-100) | Lead quality tracking |
| `leadToCaseConversionRate` | number | % of leads that became paying cases | Revenue calculator |
| `estimatedRevenue` | number | `totalCases × avgSettlement × 0.33` | Revenue dashboard |
| `estimatedProfit` | number | `estimatedRevenue - annualCost` | Profitability tracker |
| `roi` | number | Return on investment % | Campaign ROI reporting |
| `performanceStatus` | select | `highly_profitable` / `profitable` / `breakeven` / `loss` | Admin dashboard badge |
| `recommendedAction` | select | `expand` / `maintain` / `optimize` / `remove` | Action recommendations |

**Hook:** Auto-calculates from `formSubmissions` + `cases` collections (these need to be built separately). Until then, all values are 0.

**Annual cost formula:** `productionCost + (monthlyMaintenance × 12)`
Defaults: `productionCost = $500`, `monthlyMaintenance = $50`.

---

## 6. Search Engine Submission (all readOnly — auto-calculated)

| Field | Type | What It Does | Where Used |
|---|---|---|---|
| `googleSubmitted` | boolean | Whether submitted to Google | Admin UI only |
| `googleSubmissionTime` | date | When submitted | Admin UI only |
| `googleSubmissionMessage` | textarea | Google response message | Admin UI only |
| `bingSubmitted` | boolean | Whether submitted to Bing | Admin UI only |
| `bingSubmissionTime` | date | When submitted | Admin UI only |
| `bingSubmissionMessage` | textarea | Bing response message | Admin UI only |

**Hook:** Submits to Google Indexing API + IndexNow on every publish (Hook 6 — currently commented out pending function verification).

---

## 7. Entity Extraction

| Field | Type | What It Does | Where Used |
|---|---|---|---|
| `primaryEntity` | text | Main topic/entity | Schema.org `@type`, internal linking |
| `entityDefinition` | textarea (1-2 sentences) | Plain-language definition | FAQ schema, internal linking |
| `relatedEntities` | array (entity, importance) | Supporting entities | Cross-linking strategy |
| `entityImportance` | textarea | Why these entities matter for SEO | Internal linking decisions |

**Used by:** Internal linking hook to auto-suggest related articles based on entity overlap.

---

## 8. Content Validation (all readOnly — auto-calculated)

| Field | Type | What It Does | Where Used |
|---|---|---|---|
| `contentLength` | number | Character count from Lexical content | Validation dashboard |
| `h2Count` | number | H2 headings in article | Validation dashboard |
| `h3Count` | number | H3 headings in article | Validation dashboard |
| `faqCount` | number | FAQ items in `faqSection` | Validation dashboard |
| `validationStatus` | select | `validated` / `has_errors` | Admin badge on article list |
| `validationErrors` | array (string) | List of validation failures | Admin error panel |

**Hook:** Validates on every save:
- Content ≥ 2000 chars
- ≥ 3 H2 headings
- ≥ 6 H3 headings
- ≥ 5 FAQ items
- `directAnswer` ≥ 40 chars
- `sgeOptimizedAnswer` ≥ 40 chars

---

## 9. Internal Links (all readOnly — auto-generated)

| Field | Type | What It Does | Where Used |
|---|---|---|---|
| `linkedArticleId` | relationship (article) | Auto-linked related article | Frontend "Related Articles" section |
| `anchorText` | text | Auto-generated anchor text | Internal link text |
| `relevanceScore` | number (0-100) | Entity overlap score | Which article gets linked first |

**Hook:** On save, scans other articles for entity overlap and auto-generates relevance scores. Highest-scoring match gets linked.

---

## 10. Content Freshness (all readOnly — auto-calculated)

| Field | Type | What It Does | Where Used |
|---|---|---|---|
| `lastReviewDate` | date | Last time content was reviewed | Admin sidebar, update log |
| `nextReviewDue` | date | `lastReviewDate + 90 days` | Admin dashboard, overdue alerts |
| `daysOld` | number | Days since `lastReviewDate` | Content age tracking |
| `freshnessStatus` | select | `fresh` / `aging` / `needs_update` / `outdated` | Admin badge |

**Thresholds:**
- `fresh` ≤ 90 days since lastReviewDate
- `aging` 91-180 days
- `needs_update` 181-365 days
- `outdated` > 365 days

**Hook:** Auto-calculates `nextReviewDue` (lastReviewDate + 90 days) on every save.

---

## 11. Featured Snippet Optimization

| Field | Type | What It Does | Where Used |
|---|---|---|---|
| `targetSnippetType` | select | `how-to` / `definition` / `list` / `table` / `paragraph` | Schema type for featured snippet |
| `snippetContent` | textarea (40-60 words) | Optimized snippet content | **This is what Google reads for featured snippets** |
| `currentSnippetRank` | number | Position in Google featured snippets | Tracking only |
| `snippetOptimizationScore` | number (0-100) | How well `snippetContent` matches SERP intent | Score dashboard |

**Highest-impact field:** `snippetContent` — write it as a complete, standalone answer in 40-60 words.

---

## 12. Backlink Tracking (all readOnly — manual entry for now)

| Field | Type | What It Does | Where Used |
|---|---|---|---|
| `totalBacklinks` | number | Total links pointing to this article | SEO dashboard |
| `highQualityBacklinks` | number | Links from DA 50+ sites | SEO quality metrics |
| `referringDomains` | number | Unique domains linking here | SEO authority metrics |
| `backlinkGrowth` | number | Links gained/lost this month | Trend tracking |
| `backlinkLastUpdated` | date | Last refresh from Ahrefs/SEMrush | Data freshness |

**Note:** Fields are editable now — eventually hook will auto-populate from Ahrefs/SEMrush API (not implemented yet).

---

## 13. Keyword Ranking Tracking (all readOnly — manual entry for now)

| Field | Type | What It Does | Where Used |
|---|---|---|---|
| `keyword` | text | Target keyword phrase | Ranking dashboard |
| `currentRank` | number | Current Google position | Tracking |
| `previousRank` | number | Position last check | Tracking |
| `rankChange` | number | Difference (current - previous) | Trend arrow |
| `searchVolume` | number | Monthly searches (from Ahrefs/SEMrush) | Traffic potential |
| `lastUpdated` | date | Last rank check | Data freshness |

**Note:** Currently manual entry — eventually auto-populated from rank tracking API (not implemented yet).

---

## 14. Traffic & Engagement (all readOnly — manual entry for now)

| Field | Type | What It Does | Where Used |
|---|---|---|---|
| `monthlyVisitors` | number | Unique visitors per month | Traffic dashboard |
| `bounceRate` | number | % who leave after 1 page | Engagement metric |
| `averageTimeOnPage` | number | MM:SS format | Engagement metric |
| `scrollDepth` | number | % who scroll to bottom | Content engagement |
| `trafficSources` | array | organic / direct / referral / social breakdown | Traffic mix |

**Note:** Currently manual entry — eventually auto-populated from GA4 (not implemented yet).

---

## 15. AI Citation Tracking (all readOnly — manual entry for now)

| Field | Type | What It Does | Where Used |
|---|---|---|---|
| `claudeCitations` | number | Times cited by Claude | AI visibility metric |
| `chatgptCitations` | number | Times cited by ChatGPT | AI visibility metric |
| `perplexityCitations` | number | Times cited by Perplexity | AI visibility metric |
| `totalAiCitations` | number | Sum of all AI citations | AI share of voice |
| `shareOfVoice` | number | % of total citations in niche | Competitive AI metric |
| `lastUpdated` | date | Last citation check | Data freshness |

**Note:** Currently manual entry — check monthly via Google searches for your article title + "AI answer" or use an AI citation tracking tool (not implemented yet).

---

## 16. Conversion Funnel (all readOnly — auto-calculated when collections exist)

| Field | Type | What It Does | Where Used |
|---|---|---|---|
| `uniqueVisitors` | number | Total visitors to article page | Funnel top |
| `formViews` | number | Times the lead form was viewed | Funnel step 2 |
| `formSubmissions` | number | Times form was submitted | Funnel step 3 |
| `emailCaptures` | number | Newsletter signups | Email list growth |
| `confirmedLeads` | number | Leads marked as qualified | Funnel step 4 |
| `confirmedCases` | number | Leads that became paying clients | Funnel step 5 |
| `visitorToFormRate` | number | % who view → submit form | Conversion metric |
| `formToLeadRate` | number | % who submit → become lead | Conversion metric |
| `leadToCaseRate` | number | % who lead → become case | Conversion metric |

**Hook:** Auto-calculates rates on every save from the `InjuredLeads` collection (coming when Injured page is built).

---

## 17. Content Quality Score (readOnly — auto-calculated)

| Field | Type | What It Does | Where Used |
|---|---|---|---|
| `contentQualityScore` | number (0-100) | Overall content quality | Admin sidebar badge, sortable |

**Formula:** Weighted combination of SEO score, AEO score, content length, FAQ count, and freshness.

---

## How to Use Each Tab

### When Creating a New Article:
1. **Basic Info** — Fill title, excerpt, author, categories first
2. **AEO/SEO** — Fill `directAnswer`, `faqSection`, `aiCitationSummary`, `voiceAnswer`
3. **GEO Optimization** — Set `targetStates`, `targetCities`, `jurisdiction`, `stateSpecificDeadline`
4. **SGE Optimization** — Write 40-60 word `sgeOptimizedAnswer` (critical for SGE)
5. **Competitor Analysis** — Add 2-3 top competitors and your advantage
6. **Content** — Write your Lexical article body
7. **Featured Snippet** — Set `targetSnippetType` + write `snippetContent`
8. **Entity Extraction** — Define primary + related entities
9. **Content Freshness** — Set `lastReviewDate`

### To Check Article Health:
1. **Sidebar scores** — See `seoScore`, `aeoScore`, `geoScore`, `sgeScore`, `overallDominanceScore`
2. **Dominance Scoring tab** — See exact breakdown of what's filled vs missing
3. **Content Validation tab** — See any validation errors
4. **Content Freshness tab** — See if article is overdue for review

### To Track Performance:
1. **Performance Metrics** — See estimated revenue/profit (after formSubmissions/cases built)
2. **Keyword Rankings** — Track keyword positions manually
3. **AI Citations** — Update monthly by searching for your article in AI tools
4. **Conversion Funnel** — See funnel rates (after Injured page built)

---

## What Shows on the Frontend

These field groups are for **backend tracking, scoring, and SEO optimization** — most don't render directly on the article page. However:

| Field Group | Frontend Impact |
|---|---|
| `directAnswer` | Rendered in the "Direct Answer" section of article hero |
| `faqSection` | Rendered as expandable FAQ accordions + FAQPage schema |
| `keyStatistics` | Rendered in a stats callout box |
| `voiceAnswer` | Used for voice search results (Alexa/Siri) |
| `targetCities` / `serviceAreaDescription` | Used in localBusiness schema |
| `expertReviewer` | Displayed in "About the Author" section |
| `sgeOptimizedAnswer` | Used for SGE / AI overview snippets |
| `snippetContent` | Used for Google featured snippet targeting |
| `keywords` | Injected into `<meta keywords>` + schema |

The remaining field groups are **admin-only** — they inform editorial strategy, scoring, and future automation, but don't render on the public article page.