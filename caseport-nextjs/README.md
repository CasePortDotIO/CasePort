# CasePort — Next.js Production Build

A production **Next.js 15 (App Router) + TypeScript + Tailwind** rebuild of the
approved CasePort site — pixel-faithful to the source HTML, with every page,
widget, animation, and SEO signal intact.

- **1,537 statically generated pages** (`next build`, 0 errors, 0 dead-ends)
- Real, readable `.tsx` for every page and component — **no `dangerouslySetInnerHTML`
  for page bodies** (only JSON-LD `<script>` tags use it)
- Four hubs verified pixel-for-pixel against the source: **Accidents · Injuries · Guide · CheckMyCase**

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000  ( / → /accidents )
npm run build      # statically generates all ~1,530 routes
npm run start      # serve the production build
```

Node 18+ recommended (built/verified on Node 22). Fonts load from Google Fonts
(Cormorant Garamond + Plus Jakarta Sans), matching the source `<head>`.

---

## Architecture

```
src/
  app/
    layout.tsx                 root: <html>/<body>, fonts, metadata (chrome-free)
    page.tsx                   / → redirect('/accidents')
    sitemap.ts  robots.ts      all ~1,530 URLs + robots
    (site)/                    ← route group that carries the site chrome
      layout.tsx               Nav, Footer, MobileStickyCTA, grain texture, ScrollFX, globals.css
      not-found.tsx            graceful 404
      accidents/page.tsx                     hub
      accidents/[...slug]/page.tsx           type · quick-answer · resources · state · state-topic · city · city-type · city-special
      injuries/page.tsx                      hub
      injuries/[...slug]/page.tsx            type · spoke · 2 standalone money pages
      guide/page.tsx                         hub
      guide/[...slug]/page.tsx               pillar · spoke · faq · glossary
      data/[slug]/page.tsx                   /data/[state]-car-accident-statistics alias
    checkmycase/page.tsx       the multi-step qualifier (own scoped CSS, no site chrome)
    start/page.tsx             /start → redirect('/checkmycase')
  components/
    Nav, Footer, MobileStickyCTA, ScrollFX, Icon, CTABand, ImageBand, FAQ,
    ActionKit, ReportBlock, RecoveryViz, JsonLd
    article/    HeroPhoto, Breadcrumbs, Byline, KeyTakeaways, Capsule,
                InGuideTOC, SectionTOC, ProseSections, StatTiles, Expert,
                Sources (cite + copy), ArticleOverlays (reading-progress + back-to-top)
    widgets/    StateMap, StatuteCountdown, AdjusterPlaybook, StateComparison,
                SettlementEstimator, HubSearch, CityFinder, SymptomMatcher,
                EmergencyTriage, InvisibleInjury, TakeHome, ClaimRoadmap, GlossaryBrowser
    pages/      one component per page type (AccidentTypePage, QuickAnswerPage,
                StateLandingPage, StateTopicPage, CityPage, CityResourcePage,
                ResourcesPage, InjuryTypePage, InjurySpokePage, GuidePillarPage,
                GuideSpokePage, GuideMiscPages, StandaloneInjuryPages)
    checkmycase/  CheckMyCase.tsx (full qualifier) + data.ts (city/provider tables)
  data/
    index.ts      typed facade over the verbatim source data
    _cp.ts        shared CP namespace object
    _src/*.ts     the source data/*.js + genStateLaw/stateLawFor, ported verbatim
    load.ts       side-effect loader (preserves source order)
  lib/            schema builders, slug/state resolvers, article + guide helpers
  styles/
    globals.css       the ported design system (verbatim from source styles.css)
    checkmycase.css   the CheckMyCase design system (verbatim, scoped to that route)
public/accidents/img/ scene images
```

### Why the `(site)` route group
The site chrome (sticky Nav, Footer, mobile sticky CTA, grain texture) and
`globals.css` live in `(site)/layout.tsx`. `/checkmycase` is a standalone
full-screen app with its **own** CSS and nav, so it sits outside the group —
this prevents duplicate navs and class collisions (`.nav`, `.opt`, etc.).

### Data layer (zero transcription risk)
The source `accidents/data/*.js` files are loaded as lightly-edited TS modules
(only the `window.CP = …` initializer line was swapped for a shared import) into
one live `CP` object, then re-exported through a typed facade in `src/data/index.ts`.
The data is therefore **byte-identical** to the approved source. `genStateLaw` /
`stateLawFor` (the generator that gives all 50 states + DC full content) were
ported the same way.

---

## Route map (every URL resolves — no 404 dead-ends)

| Pattern | Count |
|---|---|
| `/accidents` hub | 1 |
| `/accidents/[type]` | 12 |
| `/accidents/[quick-answer]` (+ `qaAlias`) | 9 |
| `/accidents/resources` | 1 |
| `/accidents/[state]` (canonical full-name; abbr forms resolve dynamically) | 51 |
| `/accidents/[state]/[topic]` | 255 |
| `/accidents/[state]/[city]` | 64 |
| `/accidents/[state]/[city]/[type]` | 768 |
| `/accidents/[state]/[city]/[special]` | 192 |
| `/data/[state]-car-accident-statistics` | 51 |
| `/injuries` hub + 12 types + 48 spokes + 2 standalone | 63 |
| `/guide` hub + 16 pillars + 44 spokes + faq + glossary | 63 |
| `/checkmycase`, `/start`, `/` | 3 |
| **Total static pages** | **1,537** |

States resolve by 2-letter abbr **and** full hyphenated name (`/accidents/ca` and
`/accidents/california`); disambiguation order mirrors the source `router.js`.

---

## What's implemented

- **Article stack** (article pages only, in canonical order): Hero → Byline →
  Key Takeaways → Direct Answer → in-guide TOC (scroll-spy, 3+ sections) → body →
  page tool → FAQ → **Sources & Citations** (cite + copy) → Expert (E-E-A-T) →
  Related → CTA band, plus reading-progress bar (top) and back-to-top (bottom-right).
- **All 13 interactive widgets** as real React client components (state map,
  statute countdown, adjuster playbook, state comparison, settlement estimator,
  symptom matcher + body map, emergency triage, X-ray/MRI slider, take-home
  calculator, claim roadmap, glossary search, city finder, hub answer search).
- **Animations**: reveal-on-scroll, fonts-ready gate, hover lifts, data-viz bar
  draw, mobile menu — ported from the source CSS/behavior.
- **SEO / AEO**: per-page `<title>`, meta description, canonical, and additive
  JSON-LD per the §8 table (Article / MedicalWebPage+reviewedBy / FAQPage /
  BreadcrumbList / HowTo / Speakable / ItemList / DefinedTermSet / Organization +
  WebSite). `sitemap.xml` + `robots.txt` generated.
- Every CTA wired to `/checkmycase`.

---

## QA results (this build)

- ✅ `npm run build` → **1,537/1,537** static pages, **0 errors, 0 baked-404s**
- ✅ **215/215** unique internal links resolve (crawled across every page type)
- ✅ **0 JS/console errors** and all scene images load across 23 representative routes
- ✅ Every page type screenshot-compared to the source HTML — pixel-faithful
- ✅ No horizontal overflow at 320 / 390 / 414 / 768 px
- ✅ All CTAs → `/checkmycase`; `/` → `/accidents`; `/start` → `/checkmycase`
- ✅ `tsc --noEmit` clean

### Notes for the team
- `/checkmycase` is a demo qualifier: OTP accepts any 6-digit code; form submit is
  simulated client-side (no backend). Wire the submit handler + OTP to your API.
- The CheckMyCase off-ramp's "Do I have a PI case?" link points to `/guide`
  (the source referenced an unbuilt `/guide/do-i-have-a-pi-case`).
- Abbr state landing URLs (`/accidents/ca`) render on-demand; canonical full-name
  URLs (`/accidents/california`) are pre-rendered and listed in the sitemap.
- Verification screenshots live in `.screens/` (git-ignored); regenerate with
  `node scripts/shot.mjs <url> <out.png>`.

---

*Reference source (ground truth) lives under `caseport_extract/` (git-ignored).*
