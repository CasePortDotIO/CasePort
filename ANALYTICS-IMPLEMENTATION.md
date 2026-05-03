# CasePort Analytics Implementation Plan

**Date:** April 2026 | **Status:** Not yet implemented

---

## Governing Principle

Most companies track traffic. CasePort tracks revenue events. Every metric must connect to one of these six outcomes:

1. Buyer applications generated per article
2. Claimant submissions generated per guide or market page
3. Search position and AI citation rate — compounding authority signals
4. Content-to-conversion path — which articles do buyers read before applying?
5. Lead quality by source — which content produces the highest-scoring opportunities?
6. Newsletter-to-application attribution — how much revenue does the Intelligence briefing generate?

---

## Three-Tool Stack

| Tool | Purpose | What It Owns |
|---|---|---|
| **PostHog** | Product & conversion analytics | Events, funnels, session data, UTM attribution, content engagement |
| **Google Search Console API** | Search visibility | Impressions, clicks, CTR, position by page, top queries per article |
| **Internal CasePort Ledger** | Revenue attribution | Source → Application → Opportunity → Signed case |

> Do not add GA4, Mixpanel, Amplitude, or any fourth tool.

---

## Implementation Checklist

### Part 1 — PostHog Setup

- [ ] `pnpm install posthog-js posthog-node googleapis`
- [ ] Create `src/lib/posthog.ts` — init function with GDPR-compliant input masking
- [ ] Create `src/app/providers.tsx` — PostHog provider, proxied through `/ingest` to avoid ad blockers
- [ ] Add rewrite rule to `next.config.ts` to proxy PostHog through own domain

### Part 2 — UTM & Content Path Tracking

- [ ] Create `src/lib/utm.ts` — `captureAndPersistUTM()`, `getStoredUTM()`, `clearUTM()`
- [ ] Create `src/lib/contentPath.ts` — `appendToContentPath()`, `getContentPath()`, `getLastReadArticle()`, `getLastReadGuide()`
- [ ] Create `src/lib/trafficSource.ts` — `getTrafficSource()` with AI engine detection (Perplexity, Claude, ChatGPT, Bing Copilot, Phind, You)
- [ ] Create `src/hooks/usePageView.ts` — fires on every route change, captures UTM, tracks content path, fires `page_viewed` event
- [ ] Register `usePageView` in `src/app/(frontend)/layout.tsx`

### Part 3 — Event Taxonomy

**Content Events:**
- [ ] `article_read_started` — IntersectionObserver on first content paragraph
- [ ] `article_read_completed` — IntersectionObserver target at 80% of article
- [ ] `article_cta_clicked` — CTA clicks in articles (inline, end-of-article, sidebar, sticky bar)
- [ ] `faq_expanded` — FAQ accordion expansion tracking

**Conversion Events:**
- [ ] `buyer_application_started` — fires on `/request-access` load, includes content path + UTM
- [ ] `buyer_application_submitted` — fires on successful form submission
- [ ] `claimant_otp_sent`, `claimant_otp_verified`, `claimant_otp_abandoned`
- [ ] `claimant_intake_submitted` — fires on successful claimant form
- [ ] `newsletter_subscribed` — fires on intelligence newsletter signup
- [ ] `roi_calculator_used` — tracks calculator interactions

### Part 4 — Google Search Console API

- [ ] Create Google Cloud service account, enable Search Console API
- [ ] Add env vars: `GSC_CLIENT_EMAIL`, `GSC_PRIVATE_KEY`
- [ ] Create `src/lib/searchConsole.ts`:
  - `getArticlePageMetrics(slug, days)` — impressions, clicks, CTR, position
  - `getArticleTopQueries(slug, days)` — top 25 queries + near-breakthrough (pos 11-20, 200+ impressions)
  - `getAllPagesMetrics(days)` — all indexed pages
  - `getRichResultStatus(slug)` — detect featured snippet candidates (pos ≤1.5, CTR ≥15%)

### Part 5 — Payload CMS Fields

**Analytics Snapshot Group** (add to Articles collection):
- [ ] Search: `avgSearchPosition`, `searchImpressions28d`, `searchClicks28d`, `searchCTR`, `positionLastWeek`, `positionTrend`, `hasFeaturedSnippet`, `snippetQueryCount`
- [ ] Top queries: `topSearchQueries[]`, `nearBreakthroughQueries[]`
- [ ] Engagement: `totalViews`, `uniqueVisitors30d`, `readCompletionRate`, `avgReadTimeSeconds`, `ctaClickRate`
- [ ] AI Referral: `aiReferralClicks28d`, `topAISource`, `firstAICitationDetectedAt`
- [ ] Conversions: `buyerApplicationsGenerated`, `buyerApplicationsInPath`, `claimantSubmissionsGenerated`, `newsletterSubscribersGenerated`, `newsletterReferredApplications`
- [ ] Sync: `lastSyncedAt`, `syncStatus`

**Content Freshness Field:**
- [ ] `lastMeaningfullyUpdatedAt` — separate from `updatedAt`, manually updated only for substantive changes, used to flag articles needing refresh after 90 days

### Part 6 — AnalyticsHistory Collection

- [ ] Create `src/collections/AnalyticsHistory.ts` — immutable weekly snapshots per article
- [ ] Fields: `articleId`, `collection`, `slug`, `weekStarting`, search metrics, engagement metrics, AI metrics, conversion metrics, `aeoScore`, `daysSinceLastMeaningfulUpdate`, `recordedAt`
- [ ] Indexes: unique on `(articleId, weekStarting)`, plus `collection+weekStarting`, `avgSearchPosition`, `buyerApplicationsGenerated`

### Part 7 — Sync Jobs

**2-Hour Content Sync** (`inngest/workflows/analytics.contentSync.ts`):
- [ ] Runs every 2 hours (`0 */2 * * *`)
- [ ] Fetches all published articles, updates `analyticsSnapshot` on each
- [ ] Detects first AI citation (fires alert when `firstAICitationDetectedAt` goes from null → populated)
- [ ] Calculates `positionTrend` by comparing current position vs `positionLastWeek`
- [ ] Calls `checkAndFireAlerts()` for threshold-based alerts

**Weekly History Snapshot** (`inngest/workflows/analytics.weeklySnapshot.ts`):
- [ ] Runs Sunday 3am (`0 3 * * 0`)
- [ ] Inserts one `AnalyticsHistory` record per published article
- [ ] Idempotent — skips if record for that week already exists

### Part 8 — Alert System

- [ ] Create `src/lib/alerts/contentAlerts.ts` — `sendContentAlert()` to Slack `#content-performance`
- [ ] Alerts:
  - Position decay ≥5 spots → warning, ≥10 → critical
  - High impressions (5000+) but low CTR (<3%) → warning (meta title issue)
  - AEO score <80 on published article → critical
  - First AI citation detected → info
  - Featured snippet lost → critical
  - Near-breakthrough queries (pos 11-20, 200+ impressions) → info
  - High-converting article (>90 days since update, pos >10) → warning
  - First newsletter-attributed application → info

### Part 9 — Payload Admin Component

- [ ] Create `src/components/admin/ArticleAnalyticsPanel.tsx`
- [ ] Registers via `admin.components.afterFields` in Articles collection
- [ ] Shows: search position + trend, impressions/clicks/CTR, top queries, near-breakthrough queries, AI citation status, engagement metrics, bottom-line conversions
- [ ] Fetches from `/api/analytics/article/[id]` and `/api/analytics/history/[id]`

### Part 10 — API Routes

- [ ] `GET /api/analytics/article/[id]?collection=X` — returns live analytics snapshot for one article
- [ ] `GET /api/analytics/history/[id]?weeks=8` — returns 8 weeks of AnalyticsHistory records

---

## Environment Variables Required

```env
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
GSC_CLIENT_EMAIL=
GSC_PRIVATE_KEY=
SLACK_CONTENT_WEBHOOK_URL=
```

---

## Notes

- PostHog proxy (`/ingest`) prevents ad blockers from blocking analytics
- Beehiiv newsletter UTM convention: `utm_source=caseport_intelligence`, `utm_medium=email`, `utm_campaign=weekly_brief_YYYY_MM_DD`, `utm_content=ARTICLE_SLUG`
- Content path stored in sessionStorage (last 10 pages, no duplicates for same slug)
- AI referral detection: Perplexity, Claude, ChatGPT, Bing Copilot, Phind, You
- GA4 currently installed for Search Console linking only — do not add custom tracking to it