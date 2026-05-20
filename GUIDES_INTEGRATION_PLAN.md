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
- Fields (copied from Articles essentials + guide-specific fields):

**Essential fields (from Articles):**
- `title` — text
- `slug` — text, unique
- `author` — relationship to `authors`
- `heroImage` — upload to `media`
- `excerpt` — textarea
- `content` — richText (Lexical)
- `publishedAt` — datetime (for sorting)

**Guide-specific fields (new):**
- `guideCategory` — relationship: `guideCategories`
- `pageType` — select: `category | guide | state | city | faq`
- `testimonials[]` — array: `{ name, location, settlement, settlementValue, injuryType, caseType, quote, rating, date, caseResolutionTime }`
- `settlementData` — group: `{ average, successRate, timeline, upfrontCost, minSettlement, maxSettlement, avgSettlement, rangesByInjury[] }`
- `statuteOfLimitations` — group: `{ years, description, exceptions[], byState[] }`
- `attorneyComparison[]` — array: `{ label, withoutAttorney, withAttorney }`
- `targetGeo` — group: `{ state, city, zip }`
- `difficultyLevel` — select: `beginner | intermediate | advanced`
- `estimatedCompletionTime` — text
- `faqSection[]` — array: `{ question, answer }`
- `directAnswer` — textarea
- `voiceAnswer` — textarea
- `keyTakeaways[]` — array: `{ point }`
- `schemaType` — select: `HowTo | GuidePage | FAQPage | Article`
- `howToSteps[]` — array: `{ name, description }`
- `relatedGuides[]` — relationship: `guideArticles`, hasMany
- `publishedDate` — datetime
- `metaTitle` — text
- `metaDescription` — textarea

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
1. Server Component that fetches from Payload by slug + contentType/pageType
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