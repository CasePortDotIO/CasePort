# /Market Page — Design Brainstorm

The existing homepage covers the PASTOR sequence comprehensively: problem, amplification, system overview, testimonials, ROI calculator, and CTA. The /Market page must not repeat any of that. Instead, it must answer a completely different question: **"Where does CasePort operate, and why does geography matter for case acquisition?"**

The unique angle: This page is about **territorial intelligence** — showing law firms that their market is a finite, contested resource, and CasePort is the infrastructure that controls access to it.

---

<response>

## Idea 1: "The War Room" — Strategic Command Center

<text>

**Design Movement:** Military-grade intelligence dashboard meets Bloomberg Terminal. Think NORAD command center aesthetics applied to legal market intelligence.

**Core Principles:**
1. Information density with clarity — every pixel earns its place
2. Real-time system awareness — the page itself feels "alive" with data
3. Territorial thinking — markets are territories to be claimed, not lists to browse
4. Scarcity through visibility — show what's taken, not just what's available

**Color Philosophy:** The existing brand palette (deep navy #0A0E17) is pushed further into operational territory. Cyan (#22D3EE) becomes the "active signal" color — it pulses where markets are live. Gold (#F59E0B) appears only on capacity warnings ("2 slots remaining"). A new addition: a muted red-amber (#FF6B35) for "Market Capped" status indicators, creating genuine urgency without feeling salesy.

**Layout Paradigm:** A full-bleed, edge-to-edge data canvas. The page opens with a massive US map visualization (not Google Maps — a custom SVG with glowing metro nodes). Below, a stacked "intelligence feed" layout where each market region is a horizontal band stretching the full viewport width, with data flowing left-to-right like a stock ticker. No cards. No grids. Just continuous horizontal data streams separated by thin cyan dividers.

**Signature Elements:**
1. Pulsing metro nodes on the map — each node breathes slowly (8s cycle) in cyan when active, amber when near-cap, and dims to muted when capped
2. A persistent "System Status" bar at the top of the page (below nav) showing live aggregate data: "47 Markets Active | 14 Markets Capped | 3 Markets in Review"
3. Horizontal scroll regions for each state cluster, revealing market depth on interaction

**Interaction Philosophy:** The page rewards exploration. Hovering over a metro node reveals a glass panel with market intelligence: search volume, average case value, current partner count, and availability status. Clicking opens a detailed market profile inline (no modal, no new page). The interaction model says: "This is your intelligence briefing. Study it."

**Animation:** Slow, deliberate, operational. Map nodes pulse on a staggered 8-12s cycle. Data counters use a smooth counting animation on scroll-in (not fast — takes 2 full seconds to count up). The system status bar has a subtle left-to-right scan line that repeats every 15 seconds, like a radar sweep. No bouncing, no parallax, no playfulness.

**Typography System:** JetBrains Mono dominates — this is a data page. Market names in Geist Sans 600. Status labels in JetBrains Mono uppercase with 0.2em tracking. The only Instrument Serif moment: a single "exhale" quote midway through the page about market control.

</text>
<probability>0.06</probability>

</response>

---

<response>

## Idea 2: "The Territory Report" — Editorial Intelligence Briefing

<text>

**Design Movement:** Long-form editorial design meets financial research report. Think McKinsey market report crossed with Monocle magazine's cartographic storytelling. The page reads like a published intelligence document, not a marketing page.

**Core Principles:**
1. Authority through depth — the page itself is a piece of market intelligence worth bookmarking
2. Geographic storytelling — each region has a narrative, not just a data point
3. Structured scarcity — availability is woven into the narrative naturally, not as a sales tactic
4. Asymmetric information advantage — reading this page gives firms intelligence their competitors don't have

**Color Philosophy:** A deliberate temperature shift from the homepage. The page opens in the standard brand dark (#0A0E17) for the hero, then transitions into a slightly warmer dark zone (#0D1117) for the editorial body — subtle enough to feel different, consistent enough to stay on-brand. Cyan is reserved exclusively for interactive elements and data callouts. Gold appears in the "Market Value Index" data visualization. The dominant text color shifts between #F1F3F5 (headlines) and #B0B8C4 (body) with generous line-height (1.7) for readability.

**Layout Paradigm:** A single-column editorial flow with strategic breakouts. The main content column is narrow (680px max) for optimal reading, but "data breakout" sections expand to full width (1200px) for maps, charts, and market grids. This creates a breathing rhythm: read → absorb data → read → absorb data. The left margin features a persistent, subtle "section indicator" showing which region the reader is currently in.

**Signature Elements:**
1. A "Market Intelligence Index" — a proprietary-looking scoring system (0-100) for each metro area, combining search volume, competition density, average case value, and growth trajectory into a single number displayed in large JetBrains Mono type
2. Regional "intelligence cards" that break out of the reading column — each one a mini-report with a custom SVG map silhouette of the metro area, key stats, and availability status
3. A "Reading Progress" indicator in the left gutter that doubles as a table of contents — clicking any region name scrolls to that section

**Interaction Philosophy:** This page is designed to be read, not clicked. The primary interaction is scrolling. But strategic interactive moments reward engagement: hovering over a Market Intelligence Index score reveals the breakdown. Clicking "Check Availability" on any market opens a minimal inline form (not a new page). The philosophy: "We've done the research. You just need to read it."

**Animation:** Scroll-triggered reveals with editorial timing. Sections fade in with a 20px translateY, but the timing is slower (0.8s) and uses a custom ease curve that feels like turning a page. Data numbers count up when they enter the viewport. The map visualization builds progressively as you scroll — nodes appear one by one in a geographic sweep from west to east. No glow orbs on this page — the aesthetic is print-inspired, not screen-inspired.

**Typography System:** This is the Instrument Serif page. Region names and section headers use Instrument Serif at 36-44px — the "exhale" moments. Body copy in Geist Sans 400 at 17px with 1.7 line-height for true editorial readability. Data callouts in JetBrains Mono. Pull quotes from market data in Geist Sans 300 italic at 28px. The typography alone should make this page feel like a published report.

</text>
<probability>0.08</probability>

</response>

---

<response>

## Idea 3: "The Access Grid" — Controlled Infrastructure Map

<text>

**Design Movement:** Infrastructure design meets luxury real estate listing. Think of how Apple presents their data center locations crossed with how Soho House presents their club locations — exclusive, geographic, and status-driven. The page communicates: "These are the ports. They are limited. Your market may already be spoken for."

**Core Principles:**
1. Exclusivity through structure — the grid itself communicates scarcity without saying "hurry"
2. Geographic precision — every market is a specific, defined territory with clear boundaries
3. System confidence — the page radiates that CasePort already has infrastructure in place
4. Status awareness — firms should immediately see where they stand relative to their market

**Color Philosophy:** The brand palette is used with maximum restraint. The background is pure #0A0E17 throughout — no gradient zones, no temperature shifts. This creates a canvas where the content elements pop with more authority. Cyan (#22D3EE) is used for "Open" status indicators and interactive borders. A new status color system: Emerald (#10B981) for "Active" (partners already in place), Amber (#F59E0B) for "Limited" (1-2 slots remaining), and a cool gray (#6B7280) for "Capped" (market full). White (#F1F3F5) is used more boldly here — large type, strong contrast, no subtlety.

**Layout Paradigm:** A hero section with a bold statement, then immediately into a massive, full-width responsive grid of market tiles. No preamble. No storytelling. Just the infrastructure, laid bare. Each tile is a glass panel showing: metro name, state, status indicator, partner count (e.g., "2 of 3"), and a single key metric (search volume or avg case value). Below the grid: a "Market Deep Dive" section where clicking any tile expands it into a detailed profile. The grid is the page. Everything else serves the grid.

**Signature Elements:**
1. The "Port Status" system — each market tile has a left-edge status bar (4px wide) that glows in the status color (emerald/amber/gray). This creates a visual heat map when viewing the full grid — you can instantly see which markets are open, limited, or capped
2. A "Market Search" input at the top of the grid — type your city and the grid filters in real-time with a smooth layout animation. If the market isn't listed, a message appears: "This market is under evaluation. Request priority access."
3. A floating "Your Market" prompt — after 5 seconds on the page, a subtle glass panel slides in from the bottom-right asking "Which market are you in?" with a search input. This captures intent without being intrusive.

**Interaction Philosophy:** Direct and functional. No storytelling, no editorial. The page is a tool. Search your market. See the status. Take action. Every interaction leads to one of three outcomes: (1) Request access for an open market, (2) Join the waitlist for a limited market, or (3) Get notified when a capped market opens. The philosophy: "The infrastructure exists. The question is whether there's room for you."

**Animation:** Minimal and grid-focused. Tiles stagger in on page load (0.05s delay between each, creating a cascade effect). Status bars pulse once on load then settle. Hovering a tile lifts it slightly (translateY -4px) with a subtle shadow increase. The search filter uses a smooth Framer Motion layout animation as tiles rearrange. The floating prompt slides in with a spring animation (stiffness: 200, damping: 25). No scroll animations on the grid itself — it should feel immediately present, not progressively revealed.

**Typography System:** Geist Sans dominates with extreme weight contrast. Market names in Geist Sans 700 at 20px. Status labels in JetBrains Mono 500 uppercase at 11px with 0.2em tracking. The hero headline in Geist Sans 700 at 64px. Partner count ("2 of 3") in JetBrains Mono 400 at 14px. The only Instrument Serif usage: a single line above the grid — "47 markets. 3 firms each. No exceptions." — in Instrument Serif 300 at 32px.

</text>
<probability>0.07</probability>

</response>

---

## Decision

**Selected: Idea 3 — "The Access Grid"** with selective elements from Idea 1 (the system status bar) and Idea 2 (the Market Intelligence Index scoring).

**Rationale:** The homepage already does the storytelling, the PASTOR sequence, the editorial persuasion. The /Market page needs to be a fundamentally different experience — a functional infrastructure map that communicates scarcity, precision, and system confidence. The Access Grid does this by making the grid itself the primary content. It also creates the strongest conversion pathway: see your market → check status → take action.

**Enhancements from other ideas:**
- From Idea 1: The "System Status" bar at the top showing aggregate market data
- From Idea 2: The Market Intelligence Index score on each market tile (adds depth without adding clutter)
- From Idea 2: The editorial "exhale" moment with Instrument Serif before the grid

This approach ensures the /Market page is completely distinct from the homepage while maintaining brand DNA.
