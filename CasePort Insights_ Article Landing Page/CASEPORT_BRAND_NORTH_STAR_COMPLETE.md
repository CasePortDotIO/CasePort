# CasePort.io Brand System — Complete North Star

## Core Mission
**CasePort is the Apple of legal lead generation.** Premium case acquisition system for personal injury law firms. Every design decision reflects engineered precision, not marketing fluff.

---

## Brand Voice
**Dan Lok meets Apple** — Direct, authoritative, zero fluff, high-status.
- Never beg. Never oversell.
- State facts. Let the system speak for itself.
- Use words: "structured," "disciplined," "controlled"
- Never use: "best," "guaranteed"

---

## Design System

### Fonts
- **Geist Sans** — Body text, UI elements (weights: 400, 500, 600, 700)
- **Instrument Serif** — Display headlines only, used sparingly for "exhale" moments
- **JetBrains Mono** — System labels, data points, specs, technical elements

### Colors
| Token | Hex | Usage |
|-------|-----|-------|
| Background | #0A0E17 | Deep navy-black page background |
| Primary Text | #F1F3F5 | Headlines, primary content |
| Secondary Text | #B0B8C4 | Body copy, descriptions |
| Muted Text | #6B7280 | Labels, footnotes, disclaimers |
| Accent Cyan | #22D3EE | System elements, trust signals, highlights |
| Gold | #F59E0B | ROI/value moments ONLY — never decorative |
| System Green | #10B981 | Active status, positive indicators |
| Glass Border | rgba(255,255,255,0.06) | Card borders, dividers |
| Glass Background | rgba(255,255,255,0.03) | Card/panel fills |
| CTA Gradient Start | #06B6D4 | Left side of primary button gradient |
| CTA Gradient End | #8B5CF6 | Right side of primary button gradient |

### Layout
- **Asymmetric hero** (60/40 split — copy left, system visualization right)
- **Content max-width:** 1200px, centered
- **Sections flow** in continuous gradient zones (no isolated floating cards)
- **Zone transitions** use overlapping gradients, not hard breaks
- **Mobile-first responsive** — scales down from desktop

### Typography Scale
| Element | Desktop | Weight | Font |
|---------|---------|--------|------|
| Hero H1 | 64-72px | 700 Bold | Geist Sans |
| Section H2 | 36-44px | 600 Semibold | Geist Sans |
| Spotlight Quotes | 32-40px | 300 Light | Geist Sans (NO italic) |
| Body Copy | 16-17px | 400 Regular | Geist Sans |
| Card Titles | 18-20px | 600 Semibold | Geist Sans |
| Card Body | 15px | 400 Regular | Geist Sans |
| System Labels | 11-12px | 500 Medium | JetBrains Mono, uppercase, 0.2em tracking |
| Data/Stats | 48-56px | 700 Bold | Geist Sans |

### Glass Panels
```css
background: rgba(255, 255, 255, 0.03);
border: 1px solid rgba(255, 255, 255, 0.06);
border-radius: 16px;
backdrop-filter: blur(20px);
```

### Buttons
- **Primary CTA:** Linear gradient (#06B6D4 → #8B5CF6), white text, 48px height, 28px horizontal padding, 12px border-radius
- **Secondary CTA:** Transparent background, 1px border rgba(255,255,255,0.15), white text, arrow icon (→)
- **Hover:** Slight scale (1.02) + increased shadow/glow
- **No bouncing, spinning, or parallax** — animations are subtle and purposeful

### Animations
- **Scroll-triggered fade-up:** 20px translateY, 0.6s ease-out
- **Staggered card reveals:** 0.1s delay between cards
- **Breathing glow orbs** on zone backgrounds (slow pulse, 8-12s cycle)
- **Floating hero card:** Gentle 10px vertical oscillation, 6s cycle
- **CTA shimmer:** Subtle light sweep on hover
- **No attention-seeking effects** — all animations reinforce hierarchy

---

## Conversion Philosophy

### PASTOR Sequence (Every Page)
1. **P — Problem:** Name the pain the audience feels
2. **A — Amplify:** Show the cost of inaction
3. **S — Story/Solution:** Introduce CasePort as the system that solves it
4. **T — Testimony:** Social proof, metrics, third-party validation
5. **O — Offer:** What they get (system access, exclusivity, ROI)
6. **R — Response:** Clear CTA with urgency

### Inhale/Exhale Rhythm
- **Inhale sections:** Bold statement, large type, minimal elements (e.g., spotlight quotes)
- **Exhale sections:** Detailed proof, cards, specs, data (e.g., system specs grid)
- **Alternate between** to create visual breathing

### Temperature Shifts
- **Cyan** = System, trust, infrastructure
- **Gold** = Value, ROI, money (used sparingly — only ROI Calculator and value projections)
- **White** = Authority, clarity
- **Shift pattern:** Cyan → Gold → back to Cyan across the page

### Scarcity (Real, Not Manufactured)
- "3 firms per metro area"
- "Review-first onboarding"
- "Market-capped access"
- "Founding partner slots" with live counter

---

## Trust Signals (6 Pillars — Appear on All Pages)

1. **Market-Capped Exclusivity** — Limited firms per region to preserve lead quality
2. **Review-First Onboarding** — Every firm is evaluated before access is granted
3. **Transparent Reporting** — Full visibility into case flow activity and metrics
4. **Compliance-First Design** — Built with legal advertising compliance in mind
5. **Dedicated Support** — Direct line to the team, no ticket queues
6. **Qualification Standards** — Every opportunity is screened before routing

---

## Legal Compliance

**CRITICAL — Must appear on every page:**
- No guaranteed outcomes — ever
- No misleading claims about conversion rates or case values
- Include disclaimers where projections are shown (ROI Calculator, stats)
- Use language: "Results vary based on market, practice area, and firm capacity"
- Use language: "For illustrative purposes only" on financial projections
- No claims that could be interpreted as attorney advertising
- Use "case opportunities" not "cases"

---

## SEO / AEO / GEO / Voice Search Optimization

### SEO (Traditional Search)
- Semantic HTML5 landmarks (`<main>`, `<article>`, `<section>`, `<nav>`, `<footer>`)
- Schema.org JSON-LD: Organization, Product, FAQPage, Service, WebSite
- Meta descriptions (160 chars)
- Open Graph tags (og:title, og:description, og:image, og:url)
- Proper heading hierarchy (H1, H2, H3)
- Alt text on all images
- Internal linking strategy
- Breadcrumb navigation
- Mobile-responsive design

### AEO (Answer Engine Optimization)
- FAQ sections written in conversational tone
- Direct answers to high-value queries
- Cite sources and data
- Include "According to..." statements
- Structured data for FAQPage
- Clear, concise answers (2-3 sentences)
- Link to detailed content

### GEO (Generative Engine Optimization)
- Content optimized for AI synthesis
- Clear topic clusters and semantic relationships
- Factual, well-sourced claims
- Avoid marketing fluff (AI ignores it)
- Include data, statistics, research
- Use structured data (Schema.org)
- Create content blocks for high-value queries
- Hidden AEO content blocks targeting:
  - "What is a case acquisition system?"
  - "Best personal injury lead generation companies"
  - "How to get exclusive personal injury leads"
  - "Personal injury lead generation cost"
  - "How do law firms get car accident cases?"

### Voice Search
- FAQ answers written in conversational patterns
- Natural language, not keyword-stuffed
- Answer questions directly (who, what, when, where, why, how)
- Include featured snippets
- Short, clear sentences
- Local intent optimization

### robots.txt
```
User-agent: GPTBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /
```

---

## Brand Details

| Field | Value |
|-------|-------|
| Company Name | CasePort |
| Domain | CasePort.io |
| Tagline | Case Flow Without Guesswork |
| Contact Email | access@caseport.io |
| Positioning | Premium case acquisition system for personal injury law firms |
| Target Audience | Growth-oriented PI law firms ($5M–$50M annual billing) |

---

## Page Structure Requirements

### All Pages Must Include:
1. **Navbar** (logo, nav links, CTA button)
2. **Hero Section** (asymmetric 60/40, problem statement)
3. **PASTOR Sequence** (Problem → Amplify → Story → Testimony → Offer → Response)
4. **Trust Signals** (6 pillars displayed)
5. **Footer** (links, contact, legal)
6. **Mobile Responsive** (375px minimum, tested)
7. **SEO/AEO/GEO/Voice Optimized** (schema, meta tags, semantic HTML)

---

## Mobile Responsiveness Requirements

- **Responsive typography** (scales from 375px to 1920px)
- **Touch-friendly buttons** (minimum 48px height)
- **Responsive padding/margins** (adjusts for screen size)
- **No horizontal overflow**
- **Readable on all devices** (tested on iPhone, Android, tablet, desktop)
- **Fast load times** (images optimized, lazy loading)
- **Accessible** (WCAG 2.1 AA minimum)

---

## Current Status

**RequestAccess Form:** ✅ 9.8/10 (Apple-level, mobile-responsive, one question per screen, white background, glassmorphism)

**Missing Pages:**
- ❌ For Law Firms (institutional positioning)
- ❌ Markets (market-capped visualization)
- ❌ Intelligence (teaser for qualified firms)
- ❌ Insights Hub (SEO/AEO/GEO optimized)
- ❌ Individual Article Pages (mobile-responsive, SEO-ready)

**Next Priority:** Rebuild all pages to brand spec with SEO + AEO + GEO + Voice optimization.
