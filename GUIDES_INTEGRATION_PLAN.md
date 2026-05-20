# CLAUDE.md — Guides Integration Plan

> **Purpose:** This is the authoritative execution plan for integrating `_Guide CoNTENT HUB/` content into CasePort as a dynamic, Payload CMS-driven guide system.
> **Read this when:** starting work, getting lost, or starting something not on the plan.

---

## Architecture Overview

### Content Model
- **Collections**: Separate focused collections per content type (not one universal collection)
  - `articles` → Insights/Blog content (unchanged, production-safe)
  - `guideArticles` → Educational claimant guides (new, dedicated)
  - `accidentArticles` → (future) Accident-specific guides
- Each collection has only the fields it needs — no conditional logic, no field bloat
- **GuideCategories** collection relates to `guideArticles` via relationship

### URL Structure
```
/guide                          ← Hub (all categories)
/guide/[category]              ← Category landing page (e.g., /guide/car-accident)
/guide/[category]/[slug]       ← Specific guide (e.g., /guide/car-accident/what-to-do)
/guide/states/[state]          ← State page (e.g., /guide/states/california)
/guide/cities/[city]           ← City page (e.g., /guide/cities/los-angeles)
/guide/faq/[slug]              ← FAQ page (e.g., /guide/faq/statute-of-limitations)
```

---

## Payload Schema Changes

### GuideCategories Collection (DONE ✅)
- `title`, `slug`, `description`, `icon`, `heroImage`, `displayOrder`
- File: `src/collections/GuideCategories.ts`
- Registered in `payload.config.ts`

### GuideArticles Collection (NEW — to create)
- **NOT extending Articles** — new standalone collection for safety
- Slug: `guideArticles`
- **All fields from Articles are copied here** (SEO, AEO, Voice, Schema, GEO, etc.)
- Plus guide-specific fields listed below

---

#### TAB: Content
| Field | Type | Notes |
|-------|------|-------|
| `title` | text | 50-80 chars |
| `currentReaders` | number | |
| `citationCount` | number | |
| `signalStrength` | number | 0-100 |
| `slug` | text | indexed, unique |
| `author` | relationship | → `authors` |
| `heroImage` | upload | → `media` |
| `excerpt` | textarea | maxLength 300 |
| `subtitle` | text | |
| `executiveSummary` | textarea | |
| `content` | richText | Lexical |
| `tags` | array | `{ tag: text }` |
| `relatedArticles` | relationship | → `articles`, hasMany |
| `keyTakeaways` | array | `{ point: text }` |
| `roiTable` | group | `{ enableTable, tableName, headers, rows[] }` |

#### TAB: SEO Core
| Field | Type | Notes |
|-------|------|-------|
| `focusKeyword` | text | |
| `keywordDifficulty` | number | 0-100 |
| `monthlySearchVolume` | number | |
| `currentRankingPosition` | number | |
| `secondaryKeywords` | array | `{ keyword: text }` |
| `metaTitle` | text | maxLength 60 |
| `metaDescription` | textarea | maxLength 160 |
| `canonicalUrl` | text | |
| `socialHeadline` | text | |
| `socialDescription` | textarea | |
| `socialShareImage` | upload | → `media` |
| `xCardType` | select | summary_large_image, summary |
| `xCardTitle` | text | |
| `xCardDescription` | textarea | |
| `xCardImage` | upload | → `media` |
| `competingUrl` | text | |
| `contentGap` | array | `{ gap: text }` |

#### TAB: AEO and AI Citation
| Field | Type | Notes |
|-------|------|-------|
| `directAnswer` | textarea | |
| `aiCitationSummary` | textarea | |
| `primaryAiQuery` | text | |
| `keyStatistics` | array | `{ text, sourceName, sourceUrl, year }` |
| `faqSection` | array | `{ question: text, answer: textarea }` |
| `termDefinitions` | array | `{ term, definition, isProprietary }` |
| `expertQuotes` | array | `{ quote: textarea, speakerName, credentials }` |

#### TAB: Voice Search
| Field | Type | Notes |
|-------|------|-------|
| `voiceAnswer` | textarea | |
| `speakableCssSelectors` | array | `{ selector: text }` |
| `conversationalQueryVariants` | array | `{ query: text }` |
| `targetsSpecificLocation` | checkbox | |
| `locationTargets` | array | `{ state: text, city: text }` (conditional) |

#### TAB: Schema
| Field | Type | Notes |
|-------|------|-------|
| `schemaType` | select | Article, FAQPage, HowTo, NewsArticle, LegalScholarlyArticle, **GuidePage** |
| `howToSteps` | array | `{ name: text, description: textarea, image }` (conditional on HowTo) |
| `sameAsEntityUrls` | array | `{ url: text }` |
| `articleSection` | text | |
| `apaCitation` | text | |

#### TAB: Authority & Compliance
| Field | Type | Notes |
|-------|------|-------|
| `legalDisclaimer` | select | Standard, No Legal Advice, CasePort Platform, None |
| `abaComplianceVerified` | checkbox | |
| `expertReviewer` | text | |
| `expertCredentials` | text | |
| `expertQuote` | textarea | |
| `externalSources` | array | `{ name, url, credibilityTier }` |
| `pressMentions` | array | `{ source, url, date }` |
| `ctaOverride` | group | `{ heading, body, primaryLabel, primaryUrl, secondaryLabel, secondaryUrl }` |
| `contentUpdateHistory` | array | `{ date, summary, updatedBy }` |

#### TAB: GEO Optimization
| Field | Type | Notes |
|-------|------|-------|
| `targetStates` | select (hasMany) | 50 US states |
| `targetCities` | select (hasMany) | ~63 US cities |
| `jurisdiction` | text | Primary Jurisdiction |
| `serviceAreaDescription` | textarea | |
| `localSchemaType` | select | LocalBusiness, Attorney, ServiceArea |
| `stateSpecificDeadline` | number | Statute of Limitations (years) |
| `stateSpecificExceptions` | textarea | |
| `tollingProvisions` | array | `{ state, tollingRule }` |

#### TAB: SGE Optimization
| Field | Type | Notes |
|-------|------|-------|
| `sgeAnswerability` | number | readOnly, 0-100 |
| `sgeOptimizedAnswer` | textarea | 40-60 words |
| `uniqueContentSignals` | array | `{ signal, description }` |
| `freshnessSignal` | select | Breaking News, Recent Update, Evergreen |
| `competitorComparison` | textarea | |

#### TAB: Dominance Scoring (all readOnly, auto-calculated)
`seoScore`, `aeoScore`, `geoScore`, `sgeScore`, `voiceSearchScore`, `overallDominanceScore`, `dominanceRank`, `competitiveAdvantageScore`

#### TAB: Competitor Analysis
| Field | Type | Notes |
|-------|------|-------|
| `topCompetitors` | array | `{ url, estimatedScore, yourAdvantage }` |
| `competitiveGapAnalysis` | textarea | |
| `uniqueAdvantages` | array | `{ advantage: text }` |

#### TAB: Performance Metrics (all readOnly)
`totalFormSubmissions`, `totalEmailCaptures`, `averageLeadQualityScore`, `leadToCaseConversionRate`, `estimatedRevenue`, `estimatedProfit`, `roi`, `performanceStatus`, `recommendedAction`

#### TAB: Search Engine Submission (all readOnly)
`googleSubmitted`, `googleSubmissionTime`, `googleSubmissionMessage`, `bingSubmitted`, `bingSubmissionTime`, `bingSubmissionMessage`

#### TAB: Entity Extraction
| Field | Type | Notes |
|-------|------|-------|
| `primaryEntity` | text | |
| `entityDefinition` | textarea | |
| `relatedEntities` | array | `{ entity: text }` |
| `entityImportance` | select | Critical, Important, Supporting |

#### TAB: Content Validation (all readOnly)
`contentLength`, `h2Count`, `h3Count`, `faqCount`, `validationStatus`, `validationErrors[]`

#### TAB: Internal Linking
`internalLinks[]` — `{ linkedArticleId: relationship, anchorText, relevanceScore }`

#### TAB: Content Freshness (all readOnly except `lastReviewDate`)
`lastReviewDate`, `nextReviewDue`, `daysOld`, `freshnessStatus`

#### TAB: Featured Snippet Optimization
| Field | Type | Notes |
|-------|------|-------|
| `targetSnippetType` | select | Paragraph, List, Table, Definition |
| `snippetContent` | textarea | 40-60 words |
| `currentSnippetRank` | number | |
| `snippetOptimizationScore` | number | readOnly, 0-100 |

#### TAB: Backlink Tracking (all readOnly)
`totalBacklinks`, `highQualityBacklinks`, `referringDomains`, `backlinkGrowth`, `backlinkLastUpdated`

#### TAB: Keyword Rankings (readOnly)
`keywordRankings[]` — `{ keyword, currentRank, previousRank, rankChange, searchVolume, lastUpdated }`

#### TAB: Traffic & Engagement (all readOnly)
`monthlyVisitors`, `bounceRate`, `averageTimeOnPage`, `scrollDepth`, `trafficSources[]`

#### TAB: AI Citation Tracking (all readOnly)
`claudeCitations`, `chatgptCitations`, `perplexityCitations`, `totalAiCitations`, `shareOfVoice`, `lastUpdated`

#### TAB: Conversion Funnel (all readOnly)
`uniqueVisitors`, `formViews`, `formSubmissions`, `emailCaptures`, `confirmedLeads`, `confirmedCases`, `visitorToFormRate`, `formToLeadRate`, `leadToCaseRate`

#### SIDEBAR FIELDS (readOnly unless noted)
| Field | Type | Notes |
|-------|------|-------|
| `publishedDate` | date | |
| `updatedAt` | date | readOnly |
| `aeoScore` | number | readOnly |
| `seoScore` | number | readOnly, auto-calc 0-100 |
| `readTime` | number | readOnly |
| `searchIntent` | select | Informational, Commercial Investigation, Transactional, Navigational |
| `targetSerpFeature` | text | |
| `contentConfidence` | select | High, Medium, Low |
| `hideFromSearchEngines` | checkbox | |
| `reviewCycle` | select | 3 Months, 6 Months, 12 Months, Evergreen |
| `nextReviewDue` | date | readOnly |
| `lastFactVerified` | date | |
| `contentQualityScore` | number | readOnly, 0-100 |

---

#### GUIDE-SPECIFIC FIELDS (new — not in Articles)
| Field | Type | Notes |
|-------|------|-------|
| `guideCategory` | relationship | → `guideCategories` |
| `pageType` | select | `category \| guide \| state \| city \| faq` |
| `testimonials` | array | `{ name, location, settlement, settlementValue, injuryType, caseType, quote, rating, date, caseResolutionTime }` |
| `settlementData` | group | `{ average, successRate, timeline, upfrontCost, minSettlement, maxSettlement, avgSettlement, rangesByInjury[] }` |
| `statuteOfLimitations` | group | `{ years, description, exceptions[], byState[] }` |
| `attorneyComparison` | array | `{ label, withoutAttorney, withAttorney }` |
| `difficultyLevel` | select | `beginner \| intermediate \| advanced` |
| `estimatedCompletionTime` | text | e.g., "5 min read" |
| `relatedGuides` | relationship | → `guideArticles`, hasMany |

**NOT touching `Articles` collection** — production-safe, unchanged.

---

## What's REQUIRED (Must Have)

### Phase 1 — Route Architecture
- [ ] Create `src/app/(frontend)/guide/page.tsx` — Hub page (Server Component)
- [ ] `src/app/(frontend)/guide/[category]/page.tsx` — Category page (Server Component)
- [ ] `src/app/(frontend)/guide/[category]/[slug]/page.tsx` — Specific guide (Server Component)
- [ ] `src/app/(frontend)/guide/states/[state]/page.tsx` — State page (Server Component)
- [ ] `src/app/(frontend)/guide/cities/[city]/page.tsx` — City page (Server Component)
- [ ] `src/app/(frontend)/guide/faq/[slug]/page.tsx` — FAQ page (Server Component)

Each page.tsx:
1. Server Component that fetches from Payload by slug + pageType
2. Uses `generateMetadata` for SEO metadata
3. Uses `revalidate = 3600` for ISR
4. Returns `notFound()` for invalid slugs
5. Passes data to a Client Component for rendering

### Phase 2 — Client Template Components
- [ ] `GuidesHubClient.tsx` — Hub page client component
- [ ] `CategoryGuideTemplate.tsx` — Category landing template (from `_Guide CoNTENT HUB/CategoryGuideTemplate.tsx`)
- [ ] `GuideTemplate.tsx` — Specific guide template (from `_Guide CoNTENT HUB/GuideTemplate.tsx`)
- [ ] `StatePageTemplate.tsx` — State page template (from `_Guide CoNTENT HUB/StatePage.tsx`)
- [ ] `CityPageTemplate.tsx` — City page template (from `_Guide CoNTENT HUB/CityPage.tsx`)
- [ ] `FAQPageTemplate.tsx` — FAQ page template (from `_Guide CoNTENT HUB/FAQPage.tsx`)

Each template component:
- Receives data as **props** (no hardcoded data, no direct Payload calls)
- Uses shared UI components where applicable
- Renders sections appropriate to its pageType

### Phase 3 — Shared UI Components
These are reused across multiple templates — build once:
- [ ] `FAQAccordion.tsx` — Accordion FAQ (used in ALL page types)
- [ ] `PeopleAlsoAsk.tsx` — Secondary FAQ accordion
- [ ] `Testimonials.tsx` — Client settlement cards with staggered animation
- [ ] `SettlementTable.tsx` — Injury type table with amounts + recovery times
- [ ] `AttorneyComparison.tsx` — "Going alone vs With attorney" rows
- [ ] `QuickAnswerStats.tsx` — 4-column stats grid
- [ ] `UrgencySection.tsx` — Statute of limitations by state
- [ ] `SchemaMarkup.tsx` — JSON-LD renderer (use existing `useSchemaMarkup` hook)
- [ ] `GuideHero.tsx` — Hero with breadcrumb, title, subtitle
- [ ] `MobileStickyCTA.tsx` — Mobile sticky call-to-action
- [ ] `DynamicBreadcrumbs.tsx` — Auto-generated from URL params

### Phase 4 — Type Generation + Verification
- [ ] Run `npm run generate:types` to update TypeScript types
- [ ] Run `npm run build` to verify no type errors
- [ ] Navigate `/guide` → `/guide/car-accident` → `/guide/car-accident/rear-end` to verify

---

## What's NICE TO HAVE (Not Required)

- [ ] Seed script to import `_Guide CoNTENT HUB/pageData.ts` into Payload
- [ ] `accidentArticles` collection — future, separate collection when needed
- [ ] SettlementCalculator integration from `src/components/SettlementCalculator.tsx`
- [ ] Dynamic sidebar navigation component
- [ ] Payload admin customization for guide editing experience

---

## Integration with Existing CasePort Patterns

- Use existing `useSchemaMarkup` hook from `src/hooks/useSchemaMarkup.ts`
- Use existing UI components from `src/components/ui/` where possible
- Follow existing CSS variable conventions (`--cream`, `--teal`, `--terra`, `--sage`, `--gold`)
- Follow existing `revalidatePath` pattern for ISR on content changes
- Reuse `SettlementCalculator` from `src/components/SettlementCalculator.tsx`
- Follow `src/app/(frontend)/insights/[slug]/page.tsx` as the exact pattern to replicate

---

## Key File References

| File | Purpose |
|------|---------|
| `src/collections/GuideArticles.ts` | New guide articles collection (to create) |
| `src/collections/GuideCategories.ts` | Guide categories collection (done) |
| `src/payload.config.ts` | Collections registered here |
| `src/app/(frontend)/insights/[slug]/page.tsx` | **Exact pattern to replicate** for route architecture |
| `src/app/(frontend)/insights/InsightsClient.tsx` | Example client component pattern |
| `_Guide CoNTENT HUB/CategoryGuideTemplate.tsx` | Source for category template |
| `_Guide CoNTENT HUB/GuideTemplate.tsx` | Source for guide template |
| `_Guide CoNTENT HUB/StatePage.tsx` | Source for state template |
| `_Guide CoNTENT HUB/CityPage.tsx` | Source for city template |
| `_Guide CoNTENT HUB/FAQPage.tsx` | Source for FAQ template |
| `_Guide CoNTENT HUB/guideData.ts` | Category data source |
| `_Guide CoNTENT HUB/pageData.ts` | State/city/FAQ data source |

---

## Execution Order

1. **Phase 1 first** — Route architecture (creates the scaffold)
2. **Phase 2 second** — Template components (filling in the scaffold)
3. **Phase 3 third** — Shared UI components (used by templates)
4. **Phase 4 last** — Type generation + verification

**Do NOT skip phases.** Each phase depends on the previous.

---

---

## Payload Query Logic (Per Route)

### Step 1 — `/guide` (Hub Page)
**Payload collection:** `guideCategories`
**No filter** — fetches all categories to display as cards.

```typescript
const { docs: categories } = await payload.find({
  collection: 'guideCategories',
  sort: 'displayOrder',
})
```

Each category's `slug` → links to `/guide/[categorySlug]`.

---

### Step 2 — `/guide/[category]` (Category Page)
**Payload collection:** `guideArticles`
**Filter by:** `guideCategory` relationship

```typescript
// First get the category by slug to get its ID
const { docs: [category] } = await payload.find({
  collection: 'guideCategories',
  where: { slug: { equals: categorySlug } },
})

// Then get all articles in that category
const { docs: articles } = await payload.find({
  collection: 'guideArticles',
  where: { guideCategory: { equals: category.id } },
})
```

Each article's `slug` + category slug → links to `/guide/[category]/[articleSlug]`.

---

### Step 3 — `/guide/[category]/[slug]` (Article Page)
**Payload collection:** `guideArticles`
**Filter by:** `slug` + `guideCategory` relationship (validates correct category)

```typescript
const { docs: [article] } = await payload.find({
  collection: 'guideArticles',
  where: {
    AND: [
      { slug: { equals: articleSlug } },
      { guideCategory: { equals: categoryId } }, // validates URL is correct
    ]
  },
})
if (!article) return notFound()
```

---

### State/City/FAQ Pages
**Payload collection:** `guideArticles`
These use `pageType` instead of `guideCategory` relationship:

| Route | Filter |
|-------|--------|
| `/guide/states/[state]` | `pageType = 'state'` + `targetGeo.state = stateSlug` |
| `/guide/cities/[city]` | `pageType = 'city'` + `targetGeo.city = citySlug` |
| `/guide/faq/[slug]` | `pageType = 'faq'` + `slug = faqSlug` |

All queries return `notFound()` if no document is found.

---

## If Lost

1. Read this file
2. Check `IMPLEMENTATION_TRACKER.md` for what was last done
3. Re-read `src/app/(frontend)/insights/[slug]/page.tsx` to recall the pattern
4. Ask user for direction if still unclear