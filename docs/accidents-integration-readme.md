# Accidents Site — Integration README

## Overview

The `/accidents`, `/guide`, and `/injuries` routes are a fully isolated **light theme editorial site** integrated into the main CasePort Next.js project. It was ported from `caseport-nextjs/` and runs alongside the existing dark-theme `(frontend)` routes with complete CSS isolation.

**Last verified:** June 2026 — all routes render pixel-perfect identical to the original `caseport-nextjs` site.

---

## Architecture

### Folder Structure

```
src/
├── app/
│   ├── layout.tsx                        # Root layout — <html>, <body>, GA scripts
│   ├── styles.css                         # Root CSS (Tailwind v4 dark theme)
│   │
│   ├── (accidents-site)/                 # SIBLING of (frontend) — NOT nested
│   │   ├── layout.tsx                   # Google Fonts <link> tags + chrome
│   │   ├── accidents/
│   │   │   ├── page.tsx                 # /accidents hub
│   │   │   └── [...slug]/page.tsx        # /accidents/[type] pages
│   │   ├── guide/
│   │   │   ├── page.tsx                 # /guide hub
│   │   │   └── [...slug]/page.tsx        # /guide/[pillar/spoke] pages
│   │   └── injuries/
│   │       ├── page.tsx                 # /injuries hub
│   │       └── [...slug]/page.tsx        # /injuries/[type/spoke] pages
│   │
│   ├── (frontend)/                       # Dark theme site (/, /markets, /insights, etc.)
│   │   ├── layout.tsx                   # Passes children through only
│   │   ├── styles.css                    # Tailwind v4 dark theme
│   │   └── [all existing routes]
│   │
│   └── (payload)/                        # Payload CMS admin + API
│
├── components/
│   ├── article/                          # Shared editorial UI components
│   │   ├── HeroPhoto.tsx
│   │   ├── Breadcrumbs.tsx
│   │   ├── Byline.tsx
│   │   ├── Capsule.tsx
│   │   ├── Expert.tsx
│   │   ├── InGuideTOC.tsx
│   │   ├── KeyTakeaways.tsx
│   │   ├── ProseSections.tsx
│   │   ├── SectionTOC.tsx
│   │   ├── Sources.tsx
│   │   ├── StatTiles.tsx
│   │   └── ArticleOverlays.tsx
│   │
│   ├── accidents-pages/                  # Page template components
│   │   ├── AccidentTypePage.tsx          # /accidents/[slug]
│   │   ├── CityPage.tsx                  # /accidents/[state]/[city]
│   │   ├── CityResourcePage.tsx          # City-level resource pages
│   │   ├── GuideMiscPages.tsx            # Glossary, FAQ pages
│   │   ├── GuidePillarPage.tsx          # Pillar pages (e.g., /guide/insurance)
│   │   ├── GuideSpokePage.tsx            # Spoke pages (e.g., /guide/insurance/settlement)
│   │   ├── InjurySpokePage.tsx           # Injury spoke pages
│   │   ├── InjuryTypePage.tsx            # /injuries/[slug]
│   │   ├── QaVisual.tsx                 # Visual QA components
│   │   ├── QuickAnswerPage.tsx           # Quick answer pages
│   │   ├── ResourcesPage.tsx             # /accidents/resources
│   │   ├── StandaloneInjuryPages.tsx     # Standalone injury type pages
│   │   ├── StateLandingPage.tsx          # /accidents/[state]
│   │   └── StateTopicPage.tsx            # /accidents/[state]/[topic]
│   │
│   ├── accidents-widgets/               # Interactive widget components
│   │   ├── SettlementEstimator.tsx       # Settlement calculator
│   │   ├── ClaimRoadmap.tsx             # Step-by-step claim roadmap
│   │   ├── StateMap.tsx                  # Interactive state map
│   │   ├── StatuteCountdown.tsx         # Filing deadline countdown
│   │   ├── EmergencyTriage.tsx           # Emergency decision tree
│   │   ├── SymptomMatcher.tsx            # Symptom-to-injury matcher
│   │   ├── GlossaryBrowser.tsx          # A-Z glossary browser
│   │   ├── HubSearch.tsx                # Search on hub pages
│   │   ├── CityFinder.tsx              # City finder widget
│   │   ├── AdjusterPlaybook.tsx        # Insurance adjuster tactics
│   │   ├── InvisibleInjury.tsx          # Invisible injury awareness
│   │   ├── StateComparison.tsx          # State-by-state comparison
│   │   └── TakeHome.tsx                # Key takeaways widget
│   │
│   ├── AccidentsNav.tsx                 # Light theme nav (renamed from Nav)
│   ├── AccidentsFooter.tsx              # Light theme footer
│   ├── AccidentsIcon.tsx                # SVG icon set (renamed from Icon)
│   ├── AccidentsMobileStickyCTA.tsx     # Mobile sticky CTA
│   ├── AccidentsScrollFX.tsx            # Scroll animations
│   ├── AccidentsFAQ.tsx                  # FAQ accordion
│   ├── AccidentsCTABand.tsx             # Call-to-action band
│   ├── AccidentsJsonLd.tsx             # JSON-LD schema markup
│   ├── AccidentsReportBlock.tsx        # Report generator
│   ├── AccidentsRecoveryViz.tsx        # Recovery timeline viz
│   ├── AccidentsImageBand.tsx           # Image band component
│   └── Icon.tsx                        # Re-exports AccidentsIcon
│
├── data/
│   ├── _cp.ts                          # Shared mutable namespace (CP: any = {})
│   ├── load.ts                         # Side-effect import orchestrator
│   ├── index.ts                        # Typed facade over CP namespace
│   └── _src/                           # Content data files
│       ├── accident-types.ts            # 12 accident types with sections
│       ├── injuries.ts                  # 12 injury types + body regions
│       ├── guides.ts                    # 16 guide pillars
│       ├── states.ts                    # 50 states + DC with metrics
│       ├── cities.ts                    # City data per state
│       ├── resources.ts                 # External resources links
│       ├── glossary.ts                  # A-Z legal terms
│       ├── quick-answers.ts            # FAQ-style quick answers
│       ├── state-law.ts                 # State-specific negligence rules
│       └── state-law-gen.ts             # Generated state law content
│
├── lib/
│   ├── accidents-constants.ts            # Site constants (reviewer name, etc.)
│   ├── accidents-article.ts             # Article utilities (toSections, readingMinutes)
│   ├── accidents-schema.ts              # JSON-LD schema builders
│   ├── accidents-state.ts               # State resolution utilities
│   ├── accidents-accident.ts           # Accident type utilities
│   ├── accidents-guide.ts              # Guide pillar/spoke utilities
│   ├── accidents-firstHour.ts         # First-hour action content
│   └── accidents-text.ts              # Text generation utilities
│
└── styles/
    ├── accidents-theme.css              # Light theme CSS (1,100+ lines)
    └── [root styles.css lives in src/app/]
```

---

## CSS Architecture — Critical

### How Theme Isolation Works

```
src/app/layout.tsx           → loads src/app/styles.css (Tailwind v4 dark)
                                defines --font-sans: 'Geist'
                                        --font-display: 'Space Grotesk'

src/app/(accidents-site)/layout.tsx → loads src/styles/accidents-theme.css
                                      defines --sans: 'Plus Jakarta Sans'
                                      defines --serif: 'Cormorant Garamond'
                                      defines --mono, --code
```

**Key insight:** These are DIFFERENT CSS variable names. The accidents CSS uses `--sans`, `--serif`, `--mono` while the root CSS uses `--font-sans`, `--font-display`, `--font-mono`. They do NOT conflict.

### accidents-theme.css CSS Variables

```css
:root {
  /* Surfaces */
  --bg: #f9f5ef;           /* Cream background */
  --bg-2: #f0f8f6;         /* Teal-tinted background */
  --bg-warm: #faf8f5;
  --white: #ffffff;
  --teal: #1a4a5a;         /* Primary brand color */
  --sage: #4a8c7e;         /* Secondary brand color */
  --terra: #c4714a;         /* Accent color */
  --gold: #c9a84c;          /* Accent color */
  --text: #1c2b32;          /* Primary text */
  --ink: #2e4350;           /* Secondary text */
  --line: #e8e2d8;          /* Borders */

  /* Typography */
  --serif: "Cormorant Garamond", Georgia, serif;   /* Display/headings */
  --sans: "Plus Jakarta Sans", system-ui, sans-serif; /* Body */
  --mono: "Plus Jakarta Sans", system-ui, sans-serif;
  --code: ui-monospace, "SF Mono", "JetBrains Mono", Menlo, monospace;
}
```

### Global Heading Rule

```css
h1, h2, h3, h4 { font-family: var(--serif); font-weight: 700; letter-spacing: -0.01em; }
```

All headings use Cormorant Garamond by default. Individual classes can override.

### DO NOT Add These to accidents-theme.css

- `font-synthesis: none` — breaks bold weight rendering (browser needs synthesis to approximate bold on web fonts)
- `!important` on font-weight — prevents legitimate overrides
- Nesting inside Tailwind `@layer base` — Tailwind v4 cascade will override

### Google Fonts URL Format

The Google Fonts link MUST use only weights that Cormorant Garamond actually supports:

```
CORRECT:
https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600;1,700;1,800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap

WRONG (400 error — weights 100-900 don't exist for this font):
https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@100;200;300;400;500;600;700;800;900&...
```

---

## Font Loading

### Where Fonts Are Loaded

In `src/app/(accidents-site)/layout.tsx`, Google Fonts are loaded via `<link>` tags directly in the JSX (NOT via `metadata.links` — that doesn't work in route group layouts):

```tsx
export default function AccidentsSiteLayout({ children }) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600;1,700;1,800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
      />
      <div id="accidents-app">
        <ScrollFX /><Nav /><main>{children}</main><Footer /><MobileStickyCTA />
      </div>
    </>
  );
}
```

### Why Not next/font?

`next/font` doesn't work cleanly across route groups with different font themes. The `<link>` approach is simpler and more reliable for this use case.

---

## Component Naming Convention

Components that exist in both the dark theme `(frontend)` and light theme `(accidents-site)` are **prefixed with `Accidents`** to avoid conflicts:

| Original Name | Accidents Version | Purpose |
|---|---|---|
| `Nav` | `AccidentsNav` | Nav with light theme styles |
| `Footer` | `AccidentsFooter` | Footer with light theme styles |
| `Icon` | `AccidentsIcon` | SVG icon component |
| `MobileStickyCTA` | `AccidentsMobileStickyCTA` | Light theme sticky CTA |
| `ScrollFX` | `AccidentsScrollFX` | Light theme scroll animations |
| `FAQ` | `AccidentsFAQ` | FAQ accordion |
| `CTABand` | `AccidentsCTABand` | CTA band |
| `JsonLd` | `AccidentsJsonLd` | JSON-LD schema |
| `ReportBlock` | `AccidentsReportBlock` | Report block |
| `RecoveryViz` | `AccidentsRecoveryViz` | Recovery timeline |
| `ImageBand` | `AccidentsImageBand` | Image band |
| `ActionKit` | `AccidentsActionKit` | Action kit widget |

`Icon.tsx` at root level re-exports `AccidentsIcon` for backwards compatibility.

---

## Page Routes and Resolution Logic

### `/accidents` Hub
- Lists all accident types, state map, quick answers, settlement estimator, FAQ

### `/accidents/[...slug]` — Accident Type Pages
Resolver in `src/app/(accidents-site)/accidents/[...slug]/page.tsx` with 8 resolution cases:
1. Accident type (e.g., `car-accident`) → `AccidentTypePage`
2. State → state overview → `StateLandingPage`
3. State + topic → topic detail → `StateTopicPage`
4. State + city → city page → `CityPage`
5. State + city + resource → `CityResourcePage`
6. Quick answer (e.g., `how-to-file-claim`) → `QuickAnswerPage`
7. Resources index → `ResourcesPage`
8. Falls through → `AccidentTypePage` (default)

### `/guide` Hub
- Lists all 16 guide pillars with icons and descriptions

### `/guide/[...slug]` — Guide Pages
Resolver with 3 resolution cases:
1. Pillar (e.g., `insurance`) → `GuidePillarPage`
2. Spoke (e.g., `insurance/settlement`) → `GuideSpokePage`
3. Misc (glossary, faq) → `GuideMiscPages`

### `/injuries` Hub
- Lists injury types organized by body region

### `/injuries/[...slug]` — Injury Pages
Resolver with 3 resolution cases:
1. Injury type → `InjuryTypePage`
2. Body region spoke → `InjurySpokePage`
3. Standalone injury page → `StandaloneInjuryPages`

---

## Data Architecture

### CP Namespace Pattern

All data is loaded into a shared mutable namespace:

```typescript
// src/data/_cp.ts
export const CP: any = {};

// src/data/load.ts — side-effect imports load all _src files
import './_src/accident-types'
import './_src/injuries'
import './_src/guides'
// ... etc

// src/data/index.ts — typed facade
export const accidentTypes = CP.accidentTypes
export const injuries = CP.injuries
export const states = CP.states
// etc.
```

### Static Generation

All 400+ accident/guide/injury pages use `generateStaticParams` for full static prerendering:

```typescript
export function generateStaticParams() {
  return Object.keys(accidentTypes).map((slug) => ({ slug }))
}
export const dynamicParams = false // 404 for unknown slugs
```

---

## Backend Integration Points

### When Integrating with Payload CMS

The accidents site currently uses **static JSON data** from `src/data/`. When you migrate to Payload CMS backend, here's what needs to change:

#### 1. Collections to Create in Payload

| Collection | Slug | Content |
|---|---|---|
| AccidentTypes | `accident-types` | 12 accident types with sections, stats, key facts |
| InjuryTypes | `injury-types` | Injury types organized by body region |
| GuidePillars | `guide-pillars` | 16 guide pillars with spokes |
| States | `states` | 50 states + DC with metrics, negligence rules |
| Cities | `cities` | City data per state |
| QuickAnswers | `quick-answers` | FAQ-style quick answers |
| Glossary | `glossary` | A-Z legal glossary terms |
| Resources | `resources` | External resource links |

#### 2. Payload Local API Usage

Replace static data imports with Payload queries:

```typescript
// BEFORE (static)
import { accidentTypes } from '@/data'
const data = accidentTypes[slug]

// AFTER (Payload)
import payload from '@/lib/payload'
const data = await payload.findByID({
  collection: 'accidentTypes',
  id: slug,
  depth: 2,
})
```

#### 3. ISR / Revalidation

When data changes in Payload, trigger ISR revalidation:

```typescript
// In Payload beforeChange hook
import { revalidatePath } from 'next/cache'

revalidatePath('/accidents')
revalidatePath('/accidents/[slug]', 'page')
revalidatePath('/guide')
revalidatePath('/guide/[slug]', 'page')
revalidatePath('/injuries')
revalidatePath('/injuries/[slug]', 'page')
```

#### 4. JSON-LD Schema

The `AccidentsJsonLd` component generates JSON-LD for articles. When migrating to Payload, the schema fields will come from the collection fields (directAnswer, aiCitationSummary, faqSection, keyStatistics, etc. — same fields that exist on the `Articles` collection for the insights section).

#### 5. Search / HubSearch Widget

Currently uses static data. When integrating with Payload, replace with:

```typescript
// Payload's built-in search or a dedicated search collection
const results = await payload.find({
  collection: 'accidentTypes',
  where: {
    OR: [
      { title: { like: query } },
      { 'sections.content': { like: query } },
    ]
  }
})
```

---

## Known Issues & Solutions

### Font Looks Bolder/Heavier Than Original
**Cause:** `font-synthesis: none` on body, OR wrong font URL, OR font not loading
**Fix:** 
1. Remove `font-synthesis: none` from body
2. Verify Google Fonts URL uses valid weights only (400, 500, 600, 700, 800 for Cormorant)
3. Verify `<link>` tag is in `<head>` (not in `metadata.links` — that doesn't work in route groups)
4. Check Chrome DevTools → Network for `fonts.gstatic.com` woff2 returning 200

### Tailwind Dark Theme Bleeding Into Accidents
**Cause:** `(accidents-site)` nested inside `(frontend)` in folder structure
**Fix:** Keep `(accidents-site)` as a sibling of `(frontend)`, not nested. The route group parentheses prevent URL prefix leakage.

### Heading Font-Weight Won't Change
**Cause:** Global `h1, h2, h3, h4 { font-weight: 700 !important; }` rule
**Fix:** Remove `!important` from the global rule. Then individual classes can override.

### CSS Variable Name Conflict
**Cause:** Root `styles.css` defines `--font-sans: 'Geist'`. Accidents CSS defines `--sans: 'Plus Jakarta Sans'`. These are DIFFERENT variables and won't conflict — but if you use `--font-sans` in accidents CSS, you'll get Geist.
**Fix:** Always use `--serif`, `--sans`, `--mono`, `--code` (from accidents-theme.css), NOT `--font-sans`, `--font-serif` (from styles.css).

---

## Build & Deployment

```bash
npm run dev        # Development server
npm run build      # Production build (all 400+ pages prerendered)
```

All accidents routes build as **Static (○)** or **SSG (●)** — no server-side rendering needed.

### Metadata
Each page exports `generateMetadata` for SEO:
```typescript
export const metadata = {
  title: `${t.title} | CasePort`,
  description: t.directAnswer.slice(0, 180),
  alternates: { canonical: `/accidents/${slug}` },
}
```

### Robots / Sitemap
The accidents routes inherit the root `robots.txt` and `sitemap.xml`. No separate sitemap needed — the root sitemap picks up all static routes automatically.

---

## File Ownership

When modifying anything in the accidents site:
- **Components:** Files in `src/components/accidents-*` and `src/components/article/` are accident-specific
- **Data:** Files in `src/data/_src/` are accident content data
- **CSS:** `src/styles/accidents-theme.css` — the single source of truth for light theme
- **Routes:** `src/app/(accidents-site)/`

Do NOT add accident-specific code to `src/app/(frontend)/` or `src/styles.css`.
