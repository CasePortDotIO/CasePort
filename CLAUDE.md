# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server
pnpm devsafe      # Clean .next cache then start dev server
pnpm build        # Production build (8GB memory limit)
pnpm lint         # ESLint
pnpm test         # Run all tests (integration + e2e)
pnpm test:int     # Vitest integration tests (tests/int/**/*.int.spec.ts)
pnpm test:e2e     # Playwright e2e tests (Chromium only)
pnpm generate:types       # Regenerate Payload TypeScript types
pnpm generate:importmap   # Regenerate Payload component import map
```

Run a single Vitest test file:
```bash
pnpm vitest run tests/int/path/to/file.int.spec.ts
```

**Requirements:** Node `^24.x`, pnpm `^9 || ^10`

## Architecture

**Stack:** Payload CMS 3.x (headless) + Next.js 16 App Router + MongoDB (Mongoose) + Vercel Blob storage + Tailwind CSS 4 + Lexical rich text editor.

CasePort is a case acquisition platform for personal injury law firms across 46+ US markets.

### Directory Layout

```
src/
├── app/
│   ├── (frontend)/        # Public-facing Next.js routes
│   └── (payload)/         # Payload admin + API routes
├── collections/           # Payload collection configs
├── globals/               # Payload global configs (SiteSettings, HeaderNav, FooterNav, MarketsPage)
├── components/
│   ├── admin/             # Custom Payload admin components (unseen badges, mark-seen actions)
│   ├── insights/          # Article UI components
│   ├── request-access/    # Multi-step application wizard components
│   └── ui/                # Base UI components (shadcn/ui-style)
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities: schema generation, data fetching helpers, nav data, sitemap
├── contexts/              # React contexts
└── payload.config.ts      # Main Payload configuration
```

### Payload Collections

| Collection | Slug | Notes |
|---|---|---|
| Users | `users` | Admin auth |
| Media | `media` | Vercel Blob storage |
| Markets | `markets` | 46 US metros with metrics, partner caps, status |
| Applications | `applications` | Law firm applications with lead scoring/tiers |
| Waitlists | `waitlists` | Waitlist entries |
| IntelligenceBriefs | `intelligence-briefs` | AI/voice-search-optimized content |
| Categories | `categories` | Article categories |
| Authors | `authors` | Article authors |
| Articles | `articles` | Main blog/insights content — see below |
| InjuredLeads | `injured-leads` | Lead capture from injured individuals |

### Articles Collection

Articles have an extensive AEO/SEO field set: `directAnswer`, `aiCitationSummary`, `faqSection`, `keyStatistics`, `voiceAnswer`, `speakableCssSelectors`, `conversationalQueryVariants`, JSON-LD schema fields (`schemaType`, `howToSteps`, `customJsonLd`), and auto-calculated `aeoScore`/`seoScore`/`readTime`/`nextReviewDue` via `beforeChange` hooks. Versioning with drafts is enabled. Changes trigger `revalidatePath` for ISR.

### Frontend Routes

| Route | Component |
|---|---|
| `/` | `LandingPage` |
| `/insights` | `InsightsClient` |
| `/insights/[slug]` | `ArticleClient` |
| `/markets`, `/markets/[slug]` | `MarketsClient`, `CityMarketClient` |
| `/injured` | `InjuredClient` |
| `/intelligence` | `IntelligenceClient` |
| `/personal-injury-leads` | `ForLawFirmsClient` |
| `/request-access` | `RequestAccessWizard` |
| `/api/submit-lead` | POST — creates `InjuredLeads` via Local API |
| `/api/intelligence-subscribe` | POST — creates `IntelligenceBriefs` subscriptions |

### Key Patterns

**Payload Local API:** Always set `overrideAccess: false` when an authenticated user is present. Always pass `req` to nested Payload operations inside hooks to ensure transaction safety. Use `context` flags to prevent infinite hook loops (a hook triggering itself).

**Data flow:** Public forms → Next.js API routes → Payload Local API → MongoDB. Frontend data is fetched in Server Components where possible; ISR via `revalidatePath` on collection changes.

**Path aliases:** `@/*` → `src/*`, `@payload-config` → `src/payload.config.ts`.

**Type generation:** After modifying any collection or global schema, run `pnpm generate:types` to update `src/payload-types.ts`.

**Admin badges:** Custom nav badge components in `src/components/admin/` display unseen counts for Applications, InjuredLeads, and IntelligenceBriefs. Corresponding mark-seen endpoints live in `src/app/(payload)/api/`.

### Additional Reference Files

- `AGENTS.md` — Detailed Payload CMS development rules and security patterns
- `developer-task-sheet.md` — Active SEO/AEO improvement tasks
- `developer-implementation-guide.md` — Implementation guidance
- `.cursor/rules/` — Payload-specific patterns (access control, hooks, fields, queries, endpoints)
