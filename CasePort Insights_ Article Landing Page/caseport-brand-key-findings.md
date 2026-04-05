# CasePort Brand System - Key Findings for /Markets Page

## Brand Voice
- **Dan Lok meets Apple**: Direct, authoritative, zero fluff, high-status
- Never beg, never oversell
- State facts. Let the system speak for itself
- Use "structured," "disciplined," "controlled" — NOT "best" or "guaranteed"

## Design System
### Fonts
- **Geist Sans**: Body text, UI elements (weights: 400, 500, 600, 700)
- **Instrument Serif**: Display headlines only, used sparingly for "exhale" moments
- **JetBrains Mono**: System labels, data points, specs, technical elements

### Colors
- **Background**: #0A0E17 (deep navy-black)
- **Primary Text**: #F1F3F5 (headlines, primary content)
- **Secondary Text**: #B0B8C4 (body copy, descriptions)
- **Muted Text**: #6B7280 (labels, footnotes, disclaimers)
- **Accent Cyan**: #22D3EE (system elements, trust signals, highlights)
- **Gold**: #F59E0B (ROI/value moments ONLY — never decorative)
- **System Green**: #10B981 (active status, positive indicators)
- **Glass Border**: rgba(255,255,255,0.06)
- **Glass Background**: rgba(255,255,255,0.03)

### Layout
- Asymmetric hero (60/40 split — copy left, system visualization right)
- Content max-width: 1200px, centered
- Sections flow in continuous gradient zones — NO isolated floating cards
- Sections within same zone share one background gradient
- Zone transitions use overlapping gradients, NOT hard breaks
- Inhale/Exhale rhythm: Bold statements + minimal elements → Detailed proof + cards/specs

### Typography Scale
- Hero H1: 64-72px, 700 Bold, Geist Sans
- Section H2: 36-44px, 600 Semibold, Geist Sans
- Spotlight Quotes: 32-40px, 300 Light, Geist Sans (NOT italic)
- Body Copy: 16-17px, 400 Regular, Geist Sans
- Card Titles: 18-20px, 600 Semibold, Geist Sans
- Card Body: 15px, 400 Regular, Geist Sans
- System Labels: 11-12px, 500 Medium, JetBrains Mono, uppercase, 0.2em tracking
- Data/Stats: 48-56px, 700 Bold, Geist Sans

### Glass Panels
```css
background: rgba(255, 255, 255, 0.03);
border: 1px solid rgba(255, 255, 255, 0.06);
border-radius: 16px;
backdrop-filter: blur(20px);
```

### Buttons
- **Primary CTA**: Linear gradient (#06B6D4 → #8B5CF6), white text, 48px height, 28px horizontal padding, 12px border-radius
- **Secondary CTA**: Transparent background, 1px border rgba(255,255,255,0.15), white text, arrow icon (→)
- **Hover**: Slight scale (1.02) + increased shadow/glow

### Animations
- Subtle, purposeful — NEVER attention-seeking
- Scroll-triggered fade-up: 20px translateY, 0.6s ease-out
- Staggered card reveals: 0.1s delay between cards
- Breathing glow orbs on zone backgrounds: slow pulse, 8-12s cycle
- Floating hero card: gentle 10px vertical oscillation, 6s cycle
- CTA button shimmer: subtle light sweep on hover
- **NO bouncing, spinning, or parallax**

## Conversion Philosophy

### PASTOR Sequence (Every Page)
1. **P — Problem**: Name the pain the audience feels
2. **A — Amplify**: Show the cost of inaction
3. **S — Story/Solution**: Introduce CasePort as the system that solves it
4. **T — Testimony**: Social proof, metrics, third-party validation
5. **O — Offer**: What they get (system access, exclusivity, ROI)
6. **R — Response**: Clear CTA with urgency

### Inhale/Exhale Rhythm
- **Inhale sections**: Bold statement, large type, minimal elements (e.g., spotlight quotes)
- **Exhale sections**: Detailed proof, cards, specs, data (e.g., system specs grid)
- Alternate between the two to create visual breathing

### Temperature Shifts
- **Cyan** = System, trust, infrastructure
- **Gold** = Value, ROI, money (used sparingly — ONLY ROI Calculator and value projections)
- **White** = Authority, clarity
- Shift from cyan → gold → back to cyan across the page

### Scarcity (Real, Not Manufactured)
- "3 firms per metro area"
- "Review-first onboarding"
- "Market-capped access"
- "Founding partner slots" with live counter

### Trust Signals (Six Pillars)
1. Market-Capped Exclusivity — Limited firms per region to preserve lead quality
2. Review-First Onboarding — Every firm is evaluated before access is granted
3. Transparent Reporting — Full visibility into case flow activity, qualification metrics, and opportunity handling
4. Compliance-First Design — Built with legal advertising compliance in mind. No misleading claims. No guaranteed outcomes.
5. Dedicated Support — Every partner firm has a direct line to our team. No ticket queues. No chatbots.
6. Qualification Standards — Every opportunity passes through our screening layer before reaching your intake team.

## Legal Compliance
- **NO guaranteed outcomes** — ever
- **NO misleading claims** about conversion rates or case values
- Include disclaimers where projections are shown (ROI Calculator, stats)
- Use: "Results vary based on market, practice area, and firm capacity"
- Use: "For illustrative purposes only"
- **NO claims that could be interpreted as attorney advertising**

## SEO / GEO / AEO
- Semantic HTML5 landmarks: `<main>`, `<article>`, `<section>`, `<nav>`, `<footer>`
- Schema.org JSON-LD: Organization, Product, FAQPage, Service, WebSite
- Geo meta tags targeting US market (15 priority states)
- FAQ answers written in conversational voice-search patterns
- Hidden AEO content blocks targeting high-value queries:
  - "What is a case acquisition system?"
  - "Best personal injury lead generation companies"
  - "How to get exclusive personal injury leads"
  - "Personal injury lead generation cost"
  - "How do law firms get car accident cases?"
- Welcome AI crawlers in robots.txt: GPTBot, PerplexityBot, ClaudeBot, Google-Extended

## Brand Details
- **Company Name**: CasePort
- **Domain**: CasePort.io
- **Tagline**: Case Flow Without Guesswork
- **Contact Email**: access@caseport.io
- **Positioning**: Premium case acquisition system for personal injury law firms
- **Target Audience**: Growth-oriented PI law firms ($5M–$50M annual billing)
