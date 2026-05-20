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

---

## 🔄 IN PROGRESS

| Date | Item | Notes |
|------|------|-------|
| — | Create `src/collections/GuideArticles.ts` | New standalone collection for guide content (NOT extending Articles) |

---

## ⏳ PENDING

### Phase 1 — Route Architecture
- [ ] `src/app/(frontend)/guide/page.tsx` — Hub page (Server Component)
- [ ] `src/app/(frontend)/guide/[category]/page.tsx` — Category page
- [ ] `src/app/(frontend)/guide/[category]/[slug]/page.tsx` — Specific guide
- [ ] `src/app/(frontend)/guide/states/[state]/page.tsx` — State page
- [ ] `src/app/(frontend)/guide/cities/[city]/page.tsx` — City page
- [ ] `src/app/(frontend)/guide/faq/[slug]/page.tsx` — FAQ page

### Phase 2 — Client Template Components
- [ ] `GuidesHubClient.tsx` — Hub client component
- [ ] `CategoryGuideTemplate.tsx` — Category landing template
- [ ] `GuideTemplate.tsx` — Specific guide template
- [ ] `StatePageTemplate.tsx` — State page template
- [ ] `CityPageTemplate.tsx` — City page template
- [ ] `FAQPageTemplate.tsx` — FAQ page template

### Phase 3 — Shared UI Components
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
- [ ] Run `npm run generate:types`
- [ ] Run `npm run build` — verify no type errors
- [ ] Manual smoke test: `/guide` → `/guide/car-accident` → `/guide/car-accident/rear-end`

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