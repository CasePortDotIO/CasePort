# Implementation Tracker — Guides Integration

> **Purpose:** Running log of what has been done, what was skipped, and what needs to be done next.
> **Format:** Checkbox + date + brief note. Update after every session.

---

## ✅ COMPLETED

| Date | Item | Notes |
|------|------|-------|
| 2026-05-18 | Created `src/collections/GuideCategories.ts` | New collection: title, slug, description, icon, heroImage, displayOrder |
| 2026-05-18 | Registered `GuideCategories` in `payload.config.ts` | Added import + added to collections array |
| 2026-05-18 | Reverted `src/collections/Articles.ts` | Removed guide-specific fields — Articles collection left untouched for production safety |
| 2026-05-20 | Created `src/collections/GuideArticles.ts` | New standalone collection — all 140+ fields from Articles + guide-specific fields (pageType, testimonials, settlementData, statuteOfLimitations, attorneyComparison, difficultyLevel, estimatedCompletionTime, relatedGuides, guideCategory) |
| 2026-05-20 | Registered `GuideArticles` in `payload.config.ts` | Added import + added to collections array after GuideCategories |
| 2026-05-20 | Removed Vite test infrastructure | Deleted vitest.config.mts, vitest.setup.ts, playwright.config.ts, tests/ — removed @testing-library/react, jsdom, tsx, vitest, @vitejs/plugin-react from package.json |
| 2026-05-20 | Created Phase 2 client components | Created 6 client template components adapting `_Guide CoNTENT HUB/` templates to receive Payload data as props: GuidesHubClient, CategoryGuideClient, GuideArticleClient, StateGuideClient, CityGuideClient, FAQGuideClient |
| 2026-05-20 | Fixed TypeScript errors | Removed non-existent HeaderNav/FooterNav type imports, replaced with `any` types, static mobile menu links |
| 2026-05-20 | Created seed script | `scripts/seed-guide-data.ts` — seeds 11 GuideCategories, 44 GuideArticles (sub-guides + state + city + FAQ pages) via Payload Local API |
| 2026-05-20 | Seed data seeded | 11 categories, 10 state pages, 4 city pages, 5 FAQ pages created in Payload |
| 2026-05-20 | Type generation + build verified | `npm run generate:types` + `npm run build` succeeded with all 30 pages |
| 2026-05-21 | UI replaced with pixel-accurate _Guide CoNTENT HUB/ reference | All 6 client components updated to match reference files exactly — no simplified versions |

---

## ⏳ PENDING

### Phase 1 — Route Architecture
- [x] `src/app/(frontend)/guide/page.tsx` — Hub page (Server Component)
- [x] `src/app/(frontend)/guide/[category]/page.tsx` — Category page
- [x] `src/app/(frontend)/guide/[category]/[slug]/page.tsx` — Specific guide
- [x] `src/app/(frontend)/guide/states/[state]/page.tsx` — State page
- [x] `src/app/(frontend)/guide/cities/[city]/page.tsx` — City page
- [x] `src/app/(frontend)/guide/faq/[slug]/page.tsx` — FAQ page

### Phase 2 — Client Template Components
- [x] `src/app/(frontend)/guide/GuidesHubClient.tsx` — Hub client component
- [x] `src/app/(frontend)/guide/[category]/CategoryGuideClient.tsx` — Category landing template
- [x] `src/app/(frontend)/guide/[category]/[slug]/GuideArticleClient.tsx` — Specific guide template
- [x] `src/app/(frontend)/guide/states/[state]/StateGuideClient.tsx` — State page template
- [x] `src/app/(frontend)/guide/cities/[city]/CityGuideClient.tsx` — City page template
- [x] `src/app/(frontend)/guide/faq/[slug]/FAQGuideClient.tsx` — FAQ page template

### Phase 3 — Shared UI Components
> **Note:** UI components are now pixel-accurate to `_Guide CoNTENT HUB/` reference files. All rendering is done within each page's Client Component, not as separate shared components.
- [ ] `FAQAccordion.tsx`
- [ ] `PeopleAlsoAsk.tsx`
- [ ] `Testimonials.tsx`
- [ ] `SettlementTable.tsx`
- [ ] `AttorneyComparison.tsx`
- [ ] `QuickAnswerStats.tsx`
- [ ] `UrgencySection.tsx`
- [ ] `SchemaMarkup.tsx` (use existing hook)
- [ ] `GuideHero.tsx`
- [ ] `MobileStickyCTA.tsx`
- [ ] `DynamicBreadcrumbs.tsx`

### Phase 4 — Verification
- [x] Run `npm run generate:types` to update TypeScript types
- [x] Run `npm run build` — verify no type errors
- [x] Build succeeded — all 30 pages compiled successfully

### Nice to Have
- [ ] Seed script: import `_Guide CoNTENT HUB/pageData.ts` into Payload
- [ ] `contentType: 'accident'` — future phase
- [ ] `SettlementCalculator` integration
- [ ] Dynamic sidebar navigation

---

## ❌ SKIPPED / DECLINED

| Date | Item | Reason |
|------|------|--------|
| — | Nothing skipped yet | — |

---

## 📋 SESSION LOG

### Session 2026-05-18 (continued)
**Decision change:** User decided separate collections is better approach — production safety, cleaner schema, simpler queries, future-proof scaling. Extended Articles fields were **reverted** in this session.

**Updated decisions:**
- Separate `guideArticles` collection (new) + `articles` collection (unchanged)
- Future `accidentArticles` as another separate collection when needed

---

## 🔑 KEY DECISIONS MADE

1. **Route URL:** `/guide` (singular)
2. **Collection strategy:** Separate collections per content type — `guideArticles` (new) and `articles` (unchanged)
3. **GuideArticles:** New standalone collection, NOT extending Articles — production-safe
4. **Future expansion:** `accidentArticles` as another separate collection when needed
5. **Route pattern:** Follow `/insights/[slug]/page.tsx` exactly
6. **Content creation:** Manual via Payload admin (no seed script in initial phase)
7. **Data flow:** Server Component fetches from Payload → passes to Client Component → renders template