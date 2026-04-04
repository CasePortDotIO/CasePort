# CasePort.io Homepage — Bricks Builder Transfer Guide

**Version:** 1.0 | **Date:** March 27, 2026 | **Prepared for:** CasePort.io Founding Team

---

## Table of Contents

1. [Pre-Build Checklist](#1-pre-build-checklist)
2. [Global Setup in WordPress + Bricks](#2-global-setup-in-wordpress--bricks)
3. [Section-by-Section Build Guide](#3-section-by-section-build-guide)
   - Section 01: Header / Navigation
   - Section 02: Hero
   - Section 03: Trust Bar
   - Section 04: Spotlight Statement
   - Section 05: Market Intelligence
   - Section 06: Problem
   - Section 07: Transformation (Before vs. After)
   - Section 08: Buyer Reality
   - Section 09: System Proof
   - Section 10: Core System (Three Pillars)
   - Section 11: System Specs
   - Section 12: How It Works
   - Section 13: ROI Calculator
   - Section 14: Lead Magnet
   - Section 15: Trust Architecture
   - Section 16: Social Proof
   - Section 17: Founder Video
   - Section 18: FAQ
   - Section 19: Scarcity
   - Section 20: Final CTA
   - Section 21: Footer
4. [Zone Background Gradients](#4-zone-background-gradients)
5. [Animation Guide](#5-animation-guide)
6. [Responsive Breakpoints](#6-responsive-breakpoints)
7. [SEO / GEO / AEO Implementation](#7-seo--geo--aeo-implementation)
8. [ROI Calculator — Custom Code Block](#8-roi-calculator--custom-code-block)
9. [Asset List](#9-asset-list)

---

## 1. Pre-Build Checklist

Before touching Bricks, set up your WordPress environment:

| Step | Action | Details |
|------|--------|---------|
| 1 | Install Bricks Builder | Purchase from bricksbuilder.io ($149/yr). Activate as theme. |
| 2 | Install Rank Math SEO | Free version is sufficient. Handles meta tags, Schema, sitemaps. |
| 3 | Install WP Rocket or LiteSpeed Cache | Cloudways has LiteSpeed — use their caching plugin. |
| 4 | Create a single page | Title: "Home". Set as static front page in Settings > Reading. |
| 5 | Disable Gutenberg on this page | Bricks replaces the editor. Go to Bricks > Settings > General. |
| 6 | Set permalink structure | Settings > Permalinks > "Post name" (/%postname%/). |

### Required WordPress Plugins

| Plugin | Purpose | Free/Paid |
|--------|---------|-----------|
| Bricks Builder | Page builder (theme) | Paid ($149/yr) |
| Rank Math SEO | SEO, Schema markup, sitemaps | Free |
| WP Rocket or LS Cache | Performance/caching | Paid / Free on Cloudways |
| WPForms Lite | Contact/application forms | Free (upgrade later) |
| Jetstyle or Jetelements | Optional: advanced animations | Free |

---

## 2. Global Setup in WordPress + Bricks

### 2.1 Fonts — Add via Bricks > Settings > Custom Fonts

You need three font families. Add them in **Bricks > Settings > General > Custom Code (Header)**:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800&family=Instrument+Serif&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

Then in **Bricks > Settings > General > Custom Code (Body/Footer)** or a child theme's `style.css`, add the font-family declarations so Bricks recognizes them.

### 2.2 Color Palette — Define in Bricks > Settings > Theme Styles

Create these as **Global Colors** in Bricks so you can reuse them everywhere:

| Color Name | Hex Value | Usage |
|------------|-----------|-------|
| CP Black | `#030608` | Page background, zone bases |
| CP Dark | `#0A0E14` | Card backgrounds, mobile menu |
| CP Body Text | `#B0B8C4` | Primary body copy |
| CP Body Strong | `#D1D5DB` | Card text, emphasized items |
| CP Label | `#6B7280` | System labels, meta text |
| CP Muted | `#4B5563` | Disclaimers, fine print |
| CP Subtle | `#374151` | Barely visible labels |
| CP Border | `rgba(255,255,255,0.06)` | Card/section borders |
| CP Border Hover | `rgba(255,255,255,0.08)` | Hover state borders |
| CP White | `#FFFFFF` | Headlines, strong text |
| CP White 40 | `rgba(255,255,255,0.40)` | Dimmed headline parts |
| CP Cyan | `#00D4FF` | Primary accent |
| CP Cyan Muted | `rgba(0,212,255,0.5)` | Muted cyan for icons |
| CP Violet | `#7C5CFF` | Secondary accent |
| CP Gold | `#F59E0B` | ROI/value accent |
| CP Gold Bright | `#FBBF24` | Gold gradient endpoint |
| CP Red | `#DC2626` | "Without Control" items |
| CP Red Muted | `rgba(220,38,38,0.5)` | Muted red for labels |

### 2.3 Typography Scale — Set in Bricks > Theme Styles > Typography

| Role | Font | Weight | Size (Desktop) | Size (Tablet) | Size (Mobile) | Line Height | Tracking | Color |
|------|------|--------|-----------------|----------------|----------------|-------------|----------|-------|
| H1 (Hero only) | Geist | 700 (Bold) | 68px (4.25rem) | 52px (3.25rem) | 40px (2.5rem) | 0.95 | -0.04em | White |
| H2 Major | Geist | 600 (Semibold) | 44px (2.75rem) | 36px (2.25rem) | 28px (1.75rem) | 1.05 | -0.03em | White |
| H2 Minor | Geist | 600 (Semibold) | 36px (2.25rem) | 28px (1.75rem) | 24px (1.5rem) | 1.05 | -0.03em | White |
| H3 (Card titles) | Geist | 600 (Semibold) | 17px (1.0625rem) | 17px | 17px | 1.35 | 0 | White |
| Body | Geist | 400 (Regular) | 17px (1.0625rem) | 17px | 17px | 1.75 | 0 | #B0B8C4 |
| Body Strong | Geist | 500 (Medium) | 15px | 15px | 15px | 1.65 | 0 | #D1D5DB |
| System Label | JetBrains Mono | 500 | 11px (0.6875rem) | 11px | 11px | 1.2 | 0.22em | #6B7280 |
| Spotlight Quote | Geist | 300 (Light) | 40px (2.5rem) | 32px (2rem) | 24px (1.5rem) | 1.25 | -0.01em | White/40% |

### 2.4 Global CSS — Add to Bricks > Settings > Custom Code (Header) or Child Theme

This is the **critical CSS** that powers the entire design. Paste this into **Bricks > Settings > Page Settings > Custom Code > CSS** (or site-wide custom CSS):

```css
/* ═══ CASEPORT GLOBAL STYLES ═══ */

/* Base */
body {
  background: #030608;
  font-family: 'Geist', system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  color: #B0B8C4;
}

html {
  scroll-behavior: smooth;
}

/* System Label */
.system-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  color: #6B7280;
}

/* Glass Panel */
.glass-panel {
  background: linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%);
  border: 1px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}

/* Grid Background Pattern */
.grid-bg {
  background-image:
    linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
  background-size: 40px 40px;
}

/* Gradient Text */
.text-gradient-cyan {
  background: linear-gradient(135deg, #00D4FF 0%, #5BB6C9 50%, #7C5CFF 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.text-gradient-gold {
  background: linear-gradient(135deg, #F59E0B 0%, #FBBF24 50%, #F59E0B 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Glow Effects */
.glow-cyan {
  box-shadow: 0 0 40px rgba(0,212,255,0.15), 0 0 80px rgba(0,212,255,0.05);
}

.glow-gold {
  box-shadow: 0 0 40px rgba(245,158,11,0.15), 0 0 80px rgba(245,158,11,0.05);
}

/* CTA Button — Cyan Gradient */
.btn-cta-cyan {
  background: linear-gradient(135deg, #00B4D8 0%, #5BB6C9 40%, #7C5CFF 100%);
  color: white;
  border-radius: 9999px;
  padding: 12px 28px;
  font-size: 14px;
  font-weight: 600;
  font-family: 'Geist', sans-serif;
  box-shadow: 0 0 30px rgba(0,212,255,0.25);
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}
.btn-cta-cyan:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 40px rgba(0,212,255,0.4);
}

/* CTA Button — Gold Gradient */
.btn-cta-gold {
  background: linear-gradient(135deg, #F59E0B 0%, #FBBF24 50%, #F59E0B 100%);
  color: black;
  border-radius: 9999px;
  padding: 14px 32px;
  font-size: 14px;
  font-weight: 600;
  font-family: 'Geist', sans-serif;
  box-shadow: 0 20px 60px rgba(245,158,11,0.3);
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
}
.btn-cta-gold:hover {
  transform: translateY(-2px);
  box-shadow: 0 24px 70px rgba(245,158,11,0.4);
}

/* Card Base */
.cp-card {
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,0.06);
  background: rgba(255,255,255,0.02);
  padding: 24px;
  transition: all 0.3s ease;
}
.cp-card:hover {
  border-color: rgba(0,212,255,0.12);
  background: rgba(255,255,255,0.04);
}

/* Animations */
@keyframes pulse-dot {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(0.85); }
}
.animate-pulse-dot {
  animation: pulse-dot 2.4s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
.animate-float {
  animation: float 6s ease-in-out infinite;
}

@keyframes glow-pulse {
  0%, 100% { opacity: 0.15; }
  50% { opacity: 0.3; }
}
.animate-glow-pulse {
  animation: glow-pulse 4s ease-in-out infinite;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* Link Underline Animation */
.link-underline {
  position: relative;
}
.link-underline::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: linear-gradient(90deg, #00D4FF, #7C5CFF);
  transition: width 0.3s ease;
}
.link-underline:hover::after {
  width: 100%;
}

/* Custom Scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }

/* Selection */
::selection {
  background: rgba(0,212,255,0.25);
  color: white;
}
```

---

## 3. Section-by-Section Build Guide

> **How to read this guide:** Each section below maps to a Bricks "Section" element. Inside each section, I describe the exact Bricks elements to use, the CSS classes to apply, the copy to paste, and the responsive adjustments. The term "Container" means a Bricks Container element (not the CSS `.container` class).

### Important Bricks Concepts

- **Section**: The outermost wrapper. In Bricks, this is the "Section" element. Set background here.
- **Container**: Inside each Section, add a Container with `max-width: 1280px`, `margin: 0 auto`, `padding: 0 20px` (mobile), `0 24px` (tablet), `0 32px` (desktop).
- **Div**: Generic wrapper for grouping elements.
- **Heading**: For H1, H2, H3 elements.
- **Rich Text / Basic Text**: For paragraphs.
- **Code**: For the ROI Calculator (custom HTML/JS).

---

### Section 01: HEADER / NAVIGATION

**Bricks Element:** Section (set as Header template in Bricks > Templates > Header)

**Structure:**

```
Section (sticky, z-index: 50)
  └── Container (max-width: 1280px, flex, justify-between, align-center)
      ├── Div (Logo)
      │   ├── Heading (CASEPORT)
      │   └── Text (Case Flow Without Guesswork)
      ├── Nav (Desktop links — hidden on mobile)
      │   ├── Link: For Law Firms → #system
      │   ├── Link: Insights → #insights
      │   ├── Link: Intelligence → #intelligence
      │   └── Link: Injured? → #injured
      └── Div (CTA area)
          ├── Text: FOR QUALIFIED FIRMS ONLY
          └── Button: Request Private Access
```

**CSS for the Section:**

```css
/* Apply to the Header Section element */
position: sticky;
top: 0;
z-index: 50;
border-bottom: 1px solid rgba(255,255,255,0.06);
background: rgba(3,6,8,0.80);
backdrop-filter: blur(40px);
-webkit-backdrop-filter: blur(40px);
```

**Logo:**

| Property | Value |
|----------|-------|
| Font | Geist |
| Weight | 800 (Extra Bold) |
| Size | 17px |
| Tracking | 0.28em |
| Color | White |
| Text | CASEPORT |

**Tagline (below logo):**

| Property | Value |
|----------|-------|
| Class | system-label |
| Color | #6B7280 |
| Font Size | 8px (0.5rem) |
| Tracking | 0.22em |
| Text | Case Flow Without Guesswork |

**Nav Links:**

| Property | Value |
|----------|-------|
| Font | Geist |
| Weight | 500 |
| Size | 13px |
| Color | #9CA3AF |
| Hover Color | White |
| Class | link-underline |
| Gap between links | 32px (2rem) |
| Display | Hidden on mobile, flex on desktop (1024px+) |

**CTA Area (right side):**

| Element | Property | Value |
|---------|----------|-------|
| "FOR QUALIFIED FIRMS ONLY" | Class | system-label |
| | Font Size | 8px |
| | Color | #6B7280 |
| | Text Align | Center |
| | Margin Bottom | 4px |
| Button | Class | btn-cta-cyan |
| | Text | Request Private Access |
| | Padding | 8px 20px |
| | Font Size | 13px |

**Mobile Menu:** Use Bricks' built-in hamburger menu (Bricks > Templates > Header > Mobile Menu). Style the off-canvas panel:

```css
/* Mobile menu panel */
background: #0A0E14;
border-left: 1px solid rgba(255,255,255,0.06);
```

---

### Section 02: HERO

**Zone:** This section lives inside Zone 1 (Deep Space). See [Zone Background Gradients](#4-zone-background-gradients) for the wrapper.

**Bricks Structure:**

```
Section (padding: 48px 0 16px on desktop, 32px 0 16px on mobile)
  └── Container (max-width: 1280px)
      └── Div (Grid: 2 columns on desktop — 55% / 45%, 1 column on mobile)
          ├── Div (Left — Copy)
          │   ├── Div (Badge pill)
          │   │   ├── Div (green dot)
          │   │   └── Text: For Growth-Oriented Personal Injury Law Firms
          │   ├── Heading H1: Stop Buying Leads. / Start Controlling / Case Flow.
          │   ├── Paragraph (body copy)
          │   ├── Div (CTA row)
          │   │   ├── Button: Request Private Access
          │   │   └── Link: See How It Works →
          │   └── Text (micro-copy)
          └── Div (Right — Case Flow Engine Card)
              └── Div (glass-panel card with grid-bg)
```

**Hero H1 Copy:**

```
Stop Buying Leads.
Start Controlling    ← Apply class "text-gradient-cyan" to this line
Case Flow.
```

**H1 Styling:**

| Property | Desktop | Tablet | Mobile |
|----------|---------|--------|--------|
| Font | Geist | Geist | Geist |
| Weight | 700 | 700 | 700 |
| Size | 68px (4.25rem) | 52px (3.25rem) | 40px (2.5rem) |
| Line Height | 0.95 | 0.95 | 0.95 |
| Letter Spacing | -0.04em | -0.04em | -0.04em |
| Color | White | White | White |

**Badge Pill (above H1):**

```css
display: inline-flex;
align-items: center;
gap: 10px;
border-radius: 9999px;
border: 1px solid rgba(255,255,255,0.08);
background: rgba(255,255,255,0.03);
padding: 6px 16px;
margin-bottom: 20px;
```

The green dot inside the pill:

```css
width: 8px;
height: 8px;
border-radius: 50%;
background: #22D3EE; /* cyan-400 */
animation: pulse-dot 2.4s ease-in-out infinite;
```

The text inside the pill uses the `system-label` class with color `#9CA3AF`.

**Body Paragraph:**

```
CasePort is a premium case acquisition system for personal injury law firms
that want more control over demand, intake quality, follow-up, and recovery
— without relying on inconsistent channels alone.
```

| Property | Value |
|----------|-------|
| Font | Geist |
| Weight | 400 |
| Size | 17px |
| Line Height | 1.75 |
| Color | #B0B8C4 |
| Max Width | 560px (max-w-xl) |
| Margin Top | 20px |

**CTA Button:**

| Property | Value |
|----------|-------|
| Class | btn-cta-cyan |
| Text | Request Private Access |
| Padding | 12px 28px |
| Font Size | 14px |

**Secondary Link ("See How It Works"):**

| Property | Value |
|----------|-------|
| Font | Geist |
| Weight | 500 |
| Size | 14px |
| Color | #9CA3AF |
| Hover Color | White |
| Icon | Arrow right (→) |
| href | #how-it-works |

**Micro-copy below CTA:**

```
Review-first. Market-capped. Built for firms that care about intake quality.
```

| Property | Value |
|----------|-------|
| Size | 12px |
| Color | #4B5563 |
| Margin Top | 12px |

**Case Flow Engine Card (Right Column):**

This is the floating glass card. In Bricks, create a Div with class `glass-panel animate-float`:

```css
/* Card wrapper */
border-radius: 16px;
padding: 20px;
box-shadow: 0 20px 80px rgba(0,0,0,0.4);
```

Inside the card, add a Div with class `grid-bg` as an absolute overlay (opacity: 0.3).

**Card Header:**

| Element | Text | Style |
|---------|------|-------|
| Left label | The Case Flow Engine™ | system-label, color #6B7280 |
| Right badge | Private View | system-label, 9px, border pill |

**Card Body — 6-step grid (3 columns × 2 rows):**

Each step is a small card:

```css
border-radius: 8px;
border: 1px solid rgba(255,255,255,0.06);
background: rgba(255,255,255,0.02);
padding: 10px;
```

Steps: `01 Search Intent`, `02 Demand Capture`, `03 Qualification`, `04 Routing`, `05 Recovery`, `06 Retained Value`

Each step has:
- A cyan dot (8px × 1.5px, `#22D3EE`)
- Step number in mono (8px, `#6B7280`)
- Step name (11px, font-weight 500, white)

**Card Bottom — 2-column info boxes:**

Left box (cyan tint):

```css
border-radius: 8px;
border: 1px solid rgba(34,211,238,0.1);
background: rgba(34,211,238,0.03);
padding: 10px;
```

Content: "System Activity" label + 3 bullet items (9px, #9CA3AF)

Right box (violet tint):

```css
border-radius: 8px;
border: 1px solid rgba(124,92,255,0.1);
background: rgba(124,92,255,0.03);
padding: 10px;
```

Content: "Core Design Intent" label + paragraph (9px, #9CA3AF)

---

### Section 03: TRUST BAR

**Bricks Structure:**

```
Section (padding: 16px 0 on desktop, 16px 0 on mobile)
  └── Container (max-width: 1280px)
      └── Div (flex, wrap, center, gap: 10px)
          ├── Pill: Market-Capped Access
          ├── Pill: Review-First Onboarding
          ├── Pill: Verified Standards
          └── Pill: Controlled Case Distribution
```

**Each Pill:**

```css
border-radius: 9999px;
border: 1px solid rgba(255,255,255,0.06);
background: rgba(255,255,255,0.02);
padding: 6px 14px;
```

Text inside: `system-label` class, color `#6B7280`, font-size `9.6px` (0.6rem).

---

### Section 04: SPOTLIGHT STATEMENT

**Bricks Structure:**

```
Section (padding: 64px 0 on desktop, 80px 0 on large desktop)
  └── Container (max-width: 896px, text-center)
      └── Paragraph
```

**Copy:**

```
You are not losing case opportunities because there is no demand.
You are losing them because value breaks down after inquiry.
```

**Styling:**

| Property | Desktop | Tablet | Mobile |
|----------|---------|--------|--------|
| Font | Geist | Geist | Geist |
| Weight | 300 (Light) | 300 | 300 |
| Size | 40px (2.5rem) | 32px (2rem) | 24px (1.5rem) |
| Line Height | 1.25 | 1.25 | 1.25 |
| Letter Spacing | -0.01em | -0.01em | -0.01em |
| Color | rgba(255,255,255,0.40) | same | same |

The second sentence ("You are losing them...") should have class `text-gradient-cyan` and `font-weight: 500`.

---

### Section 05: MARKET INTELLIGENCE

**Zone:** Zone 2 (Emergence — gold temperature shift). See [Zone Gradients](#4-zone-background-gradients).

**Bricks Structure:**

```
Section (id="intelligence", padding: 80px 0 desktop, 128px 0 large)
  └── Container (max-width: 1280px)
      ├── Div (text-center, max-width: 768px, margin: 0 auto, mb: 56px)
      │   ├── Text: "Market Intelligence" (system-label, color: rgba(245,158,11,0.7))
      │   ├── Heading H2: The Opportunity Is Massive
      │   └── Paragraph
      └── Div (Grid: 4 columns desktop, 2 tablet, 1 mobile, gap: 16px)
          ├── Stat Card: $61.7B
          ├── Stat Card: 6M+
          ├── Stat Card: $1,500
          └── Stat Card: $50K–500K
```

**Section Label:** `system-label` class but with color `rgba(245,158,11,0.7)` (gold tint).

**H2:**

```
The Opportunity Is Massive    ← "Massive" has class text-gradient-gold
```

Uses H2 Major sizing (44px desktop, 36px tablet, 28px mobile).

**Body:**

```
The personal injury market is one of the largest and most competitive legal
verticals in the United States. The firms that control case flow — not just
lead flow — will dominate the next decade.
```

**Stat Cards:**

Each card:

```css
border-radius: 16px;
border: 1px solid rgba(245,158,11,0.1);
background: rgba(255,255,255,0.02);
padding: 24px;
text-align: center;
```

| Stat | Value | Label | Sub |
|------|-------|-------|-----|
| 1 | $61.7B | U.S. Personal Injury Market | Annual market size |
| 2 | 6M+ | Auto Accidents Per Year | In the United States |
| 3 | $1,500 | Average Cost Per Lead | For high-intent PI leads |
| 4 | $50K–500K | Average Case Value | Auto accident settlements |

Value styling: `font-family: 'JetBrains Mono'; font-size: 24px (sm: 30px); font-weight: 600; color: white;`

Label: `15px, font-weight 500, color #D1D5DB, margin-top: 10px`

Sub: `13px, color #6B7280, margin-top: 4px`

> **Note:** In the React version, these numbers animate up from 0. In Bricks, you can either display them statically or use a lightweight counter script (see [Animation Guide](#5-animation-guide)).

---

### Section 06: PROBLEM

**Bricks Structure:**

```
Section (id="problem", padding: 64px 0 desktop)
  └── Container (max-width: 1280px)
      └── Div (Grid: 2 columns desktop, 1 mobile, gap: 48px desktop / 64px large)
          ├── Div (Left — Copy)
          │   ├── Text: "The Problem" (system-label)
          │   ├── Heading H2
          │   ├── Paragraph 1
          │   └── Paragraph 2
          └── Div (Right — Two-column comparison)
              ├── Div (Without Control — red)
              └── Div (With Discipline — cyan)
```

**H2:**

```
The Problem Isn't Lead Volume.
It's What Happens After the Lead.    ← color: rgba(255,255,255,0.40)
```

**Body Paragraphs:**

```
Most personal injury law firms are not losing case opportunities because
there is no demand. They are losing them because value breaks down after
the inquiry appears.

CasePort was built to reduce that silent loss through a more disciplined
case flow system.
```

**"Without Control" Column:**

Label: `system-label`, color `rgba(220,38,38,0.6)`, with X icon

Items (each in a card):

```css
border-radius: 12px;
border: 1px solid rgba(255,255,255,0.04);
background: rgba(255,255,255,0.015);
padding: 12px 16px;
```

Text: 15px, color #9CA3AF

Items:
1. Missed calls and slow response
2. Delayed or inconsistent follow-up
3. Weak-fit demand draining capacity
4. Fragmented intake processes
5. No structured recovery system

**"With Discipline" Column:**

Label: `system-label`, color `rgba(0,212,255,0.6)`, with checkmark icon

Items (each in a card):

```css
border-radius: 12px;
border: 1px solid rgba(0,212,255,0.08);
background: rgba(0,212,255,0.03);
padding: 12px 16px;
```

Text: 15px, color #D1D5DB, font-weight 500

Items:
1. Cleaner intake standards
2. More visible case flow
3. Stronger routing clarity
4. Reduced preventable breakdowns
5. More controlled opportunity handling

---

### Section 07: TRANSFORMATION (Before vs. After)

**Bricks Structure:**

```
Section (padding: 64px 0)
  └── Container (max-width: 1280px)
      ├── Div (Header — text-center, max-width: 768px, mx-auto, mb: 56px)
      │   ├── Text: "The Transformation" (system-label)
      │   └── Heading H2: From Chaos to Control. / That Is the Shift.
      ├── Div (Grid: 2 columns, gap: 24px)
      │   ├── Div (BEFORE card — red tint)
      │   └── Div (AFTER card — cyan tint)
      └── Div (Quote — text-center, mt: 40px)
```

**BEFORE Card:**

```css
border-radius: 16px;
border: 1px solid rgba(220,38,38,0.1);
padding: 28px 32px;
background: linear-gradient(180deg, rgba(220,38,38,0.04) 0%, rgba(255,255,255,0.01) 100%);
```

Header: Red circle icon + "Before CasePort" system-label (red)
Title: "Reactive. Fragmented. Leaking Value." (18px, semibold, white)

Items (with X icons, color #9CA3AF):
1. Leads come in from 5 different sources — no unified view
2. Intake team overwhelmed by unqualified inquiries
3. 30-40% of viable cases lost to slow follow-up
4. No system to recover dropped opportunities
5. Paying premium prices for commodity leads

**AFTER Card:**

```css
border-radius: 16px;
border: 1px solid rgba(0,212,255,0.15);
padding: 28px 32px;
background: linear-gradient(180deg, rgba(0,212,255,0.05) 0%, rgba(255,255,255,0.01) 100%);
```

Header: Cyan circle icon + "With CasePort" system-label (cyan)
Title: "Structured. Controlled. Compounding." (18px, semibold, white)

Items (with checkmark icons, color #D1D5DB):
1. One system. One pipeline. Complete visibility.
2. Pre-qualified opportunities — your team only sees what fits
3. Sub-90-second response protocols reduce silent loss
4. Structured recovery catches what others let die
5. Premium positioning commands premium case quality

**Quote below:**

```
"The difference between a $2M firm and a $20M firm is not more leads.
It is a better system."
```

Styling: 18px (sm: 20px), color rgba(255,255,255,0.30). "It is a better system." in rgba(255,255,255,0.60).

---

### Section 08: BUYER REALITY

**Bricks Structure:**

```
Section (padding: 64px 0)
  └── Container (max-width: 1280px)
      ├── Div (Header — text-center, max-width: 768px, mx-auto, mb: 56px)
      │   ├── Text: "Buyer Reality" (system-label)
      │   ├── Heading H2
      │   └── Paragraph
      └── Div (Grid: 2 columns desktop, 1 mobile, gap: 16px)
          └── 6 × Pain Point Cards
```

**H2:**

```
What Serious Personal Injury Law Firms
Are Actually Tired Of    ← class text-gradient-cyan
```

**Body:**

```
If any of these sound familiar, you are not alone. And you are not crazy
for wanting something better.
```

**Pain Point Cards:**

Each card:

```css
border-radius: 16px;
border: 1px solid rgba(255,255,255,0.06);
background: rgba(255,255,255,0.02);
padding: 24px;
```

Hover: `border-color: rgba(0,212,255,0.12); background: rgba(255,255,255,0.04); transform: translateY(-2px);`

Each card has:
- Icon (20px, color #6B7280) — use Lucide icons or SVG equivalents
- Text (15px, color #D1D5DB, font-weight 500)

| # | Icon | Text |
|---|------|------|
| 1 | Target | Tired of buying volume when what you really need is control |
| 2 | Filter | Tired of weak-fit demand draining intake capacity |
| 3 | Eye | Tired of silent leakage after the lead arrives |
| 4 | Shield | Tired of vague promises with no real standards |
| 5 | Users | Tired of oversaturated markets pretending to be premium |
| 6 | Zap | Tired of systems that create more work instead of better outcomes |

---

### Section 09: SYSTEM PROOF

**Zone:** Zone 3 (Revelation — cyan). See [Zone Gradients](#4-zone-background-gradients).

**Bricks Structure:**

```
Section (id="system", padding: 80px 0 desktop, 128px 0 large)
  └── Container (max-width: 1280px)
      └── Div (Grid: 2 columns, gap: 48px desktop)
          ├── Div (Left — Copy)
          │   ├── Text: "The System" (system-label)
          │   ├── Heading H2
          │   └── Paragraph
          └── Div (Right — System Surface Card)
              └── Div (glass-panel card)
```

**H2:**

```
This Is Not Another Lead Gen Service.
This Is Case Acquisition Infrastructure.    ← class text-gradient-cyan
```

**Body:**

```
CasePort is a structured case acquisition system designed to give personal
injury law firms more control over demand capture, intake quality, and
opportunity handling — from first search intent to signed case.
```

**System Surface Card (Right):**

A glass-panel card containing a 2-column grid of 6 system modules:

| # | Module Name | Icon |
|---|-------------|------|
| 01 | Demand Capture Engine | Zap |
| 02 | Qualification Layer | Filter |
| 03 | Intake Control System | Route |
| 04 | Opportunity Routing | Target |
| 05 | Recovery Protocols | RefreshCw |
| 06 | Retained Value Framework | TrendingUp |

Module 01 and 06 span full width (2 columns). Module 01 has cyan tint border, Module 06 has violet tint border.

Each module card:

```css
border-radius: 12px;
border: 1px solid rgba(255,255,255,0.06);
background: rgba(255,255,255,0.02);
padding: 16px;
```

---

### Section 10: CORE SYSTEM (Three Pillars)

**Bricks Structure:**

```
Section (padding: 64px 0)
  └── Container (max-width: 1280px)
      ├── Div (Header — text-center, max-width: 768px, mx-auto, mb: 56px)
      │   ├── Text: "Core System" (system-label)
      │   ├── Heading H2
      │   └── Paragraph
      ├── Image (System visualization — centered, max-width: 896px, opacity: 0.4)
      └── Div (Grid: 3 columns desktop, 1 mobile, gap: 20px)
          ├── Pillar 1: Demand Capture (cyan tint)
          ├── Pillar 2: Intake Control (white/elevated)
          └── Pillar 3: Opportunity Continuity (violet tint)
```

**H2:**

```
More Than Leads.
A Complete Case Acquisition System.    ← class text-gradient-cyan
```

**Image:** Use the system visualization image (URL from assets list). Set `opacity: 0.4`, `max-width: 896px`, centered.

**Pillar Cards:**

| Pillar | Border | Background | Icon Color |
|--------|--------|------------|------------|
| Demand Capture | `rgba(0,212,255,0.12)` | `linear-gradient(180deg, rgba(0,212,255,0.06) 0%, rgba(255,255,255,0.02) 100%)` | Cyan |
| Intake Control | `rgba(255,255,255,0.08)` | `linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%)` | White |
| Opportunity Continuity | `rgba(124,92,255,0.10)` | `linear-gradient(180deg, rgba(124,92,255,0.05) 0%, rgba(255,255,255,0.02) 100%)` | Violet |

The middle pillar (Intake Control) should be slightly elevated: `transform: translateY(-8px)` on desktop, with `box-shadow: 0 20px 80px rgba(0,0,0,0.3)`.

Each pillar card:

```css
border-radius: 16px;
padding: 28px;
```

Content per pillar:
- Label (system-label, #6B7280)
- Number (system-label, #4B5563, right-aligned)
- Icon (20px)
- Title (17px, semibold, white)
- Body (15px, #B0B8C4, line-height 1.75)

**Pillar Content:**

| # | Label | Title | Body |
|---|-------|-------|------|
| 01 | Demand Capture | Show up with more structure when intent is strongest. | High-intent personal injury demand appears at moments of urgency. CasePort is designed to help firms show up with more structure when that intent is strongest. |
| 02 | Intake Control | Cleaner standards. Less intake friction. | Cleaner standards help reduce weak-fit demand, intake friction, and wasted attention inside the firm. |
| 03 | Opportunity Continuity | Recover what others let die. | Structured follow-up and recovery protocols help reduce preventable breakdowns between inquiry and signed case. |

---

### Section 11: SYSTEM SPECS

**Bricks Structure:**

```
Section (padding: 64px 0)
  └── Container (max-width: 1280px)
      ├── Div (Header — text-center, max-width: 768px, mx-auto, mb: 56px)
      │   ├── Text: "System Specifications" (system-label)
      │   ├── Heading H2
      │   └── Paragraph
      ├── Div (Grid: 4 columns desktop, 2 tablet, 1 mobile, gap: 16px)
      │   └── 4 × Spec Cards
      └── Div (Disclaimer — text-center, mt: 24px)
```

**H2:**

```
Engineered to a Standard.
Not Built to a Budget.    ← color: rgba(255,255,255,0.40)
```

**Spec Cards:**

```css
border-radius: 16px;
border: 1px solid rgba(0,212,255,0.08);
background: rgba(255,255,255,0.02);
padding: 24px;
text-align: center;
transition: all 0.3s ease;
```

Hover: `border-color: rgba(0,212,255,0.2); background: rgba(255,255,255,0.04);`

| Metric | Label | Description |
|--------|-------|-------------|
| <90s | Target Response Time | System designed for sub-90-second first contact on qualified opportunities. |
| 87% | Qualification Accuracy Target | Multi-layer screening designed to filter weak-fit demand before it reaches your intake. |
| 3 Max | Firms Per Metro Area | Hard cap. No exceptions. Your market is protected or it is not available. |
| 6-Layer | Qualification Depth | From initial intent signal through case-fit verification — six structured checkpoints. |

Metric: `font-family: 'JetBrains Mono'; font-size: 24px (sm: 30px); font-weight: 700; color: white;`

**Disclaimer:**

```
* These are system design targets, not guaranteed outcomes. Actual performance
varies by market, firm capacity, and operational factors.
```

12px, #4B5563, italic.

---

### Section 12: HOW IT WORKS

**Bricks Structure:**

```
Section (id="how-it-works", padding: 80px 0 desktop, 128px 0 large)
  └── Container (max-width: 1280px)
      ├── Div (Header — text-center, max-width: 768px, mx-auto, mb: 56px)
      │   ├── Text: "Process" (system-label)
      │   ├── Heading H2: How CasePort Works
      │   └── Paragraph
      └── Div (Grid: 4 columns desktop, 2 tablet, 1 mobile, gap: 16px)
          └── 4 × Step Cards
```

**Step Cards:**

```css
/* cp-card class */
border-radius: 16px;
border: 1px solid rgba(255,255,255,0.06);
background: rgba(255,255,255,0.02);
padding: 24px;
height: 100%;
```

Hover: `border-color: rgba(0,212,255,0.15); background: rgba(255,255,255,0.04);`

| Step | Title | Description |
|------|-------|-------------|
| 01 | Apply for Access | Submit your firm for review. We evaluate fit, capacity, and market alignment before onboarding. Not every firm qualifies. That is by design. |
| 02 | System Activation | Once approved, your market is protected. Demand capture, qualification, and routing layers are configured specifically for your firm. |
| 03 | Qualified Opportunities | Receive pre-screened, qualified case opportunities routed directly to your intake team with full context. No junk. No noise. |
| 04 | Retained Value | Structured follow-up and recovery protocols help reduce preventable breakdowns between inquiry and signed case. The money is in the follow-up. |

Step number: `font-size: 24px; font-weight: 300; color: rgba(255,255,255,0.08);` (right-aligned)
Icon: 20px, color `rgba(0,212,255,0.4)` (left-aligned)
Title: 17px, semibold, white
Body: 15px, #B0B8C4, line-height 1.75

---

### Section 13: ROI CALCULATOR

**Zone:** Zone 4 (Golden Moment). See [Zone Gradients](#4-zone-background-gradients).

This is the most complex section. See [Section 8: ROI Calculator — Custom Code Block](#8-roi-calculator--custom-code-block) for the full implementation.

---

### Section 14: LEAD MAGNET

**Bricks Structure:**

```
Section (padding: 64px 0)
  └── Container (max-width: 896px)
      └── Div (Card — gold-tinted)
          └── Div (Grid: 60% / 40% desktop, 1 column mobile)
              ├── Div (Left — Copy)
              │   ├── Text: "Free Intelligence Report" (system-label, gold)
              │   ├── Heading H3
              │   ├── Paragraph
              │   └── 3 × Bullet items
              └── Div (Right — CTA)
                  ├── Button: Download Free Playbook
                  └── Text (micro-copy)
```

**Card:**

```css
border-radius: 16px;
border: 1px solid rgba(245,158,11,0.15);
padding: 32px 40px (desktop), 32px (mobile);
background: linear-gradient(135deg, rgba(245,158,11,0.06) 0%, rgba(251,191,36,0.02) 50%, rgba(255,255,255,0.02) 100%);
```

**H3:** "The Case Acquisition Playbook" — 24px (sm: 28px), semibold, white

**Bullet Items:**

- Why 73% of PI leads never convert (and how to fix it)
- The 6-layer qualification framework
- Market protection strategies that eliminate competition

Each with a gold checkmark icon (14px, `rgba(245,158,11,0.7)`).

**Button:** Class `btn-cta-gold`, text "Download Free Playbook" with download icon.

---

### Section 15: TRUST ARCHITECTURE

**Zone:** Zone 5 (Proof). See [Zone Gradients](#4-zone-background-gradients).

**Bricks Structure:**

```
Section (id="trust", padding: 80px 0 desktop, 128px 0 large)
  └── Container (max-width: 1280px)
      ├── Div (Header)
      └── Div (Grid: 3 columns desktop, 2 tablet, 1 mobile, gap: 16px)
          └── 6 × Trust Signal Cards
```

**H2:**

```
Built for Trust.
Designed for Control.    ← color: rgba(255,255,255,0.40)
```

**Trust Signal Cards:** Use `cp-card` class. Each has icon (20px, cyan), title (15px, semibold, white), description (15px, #B0B8C4).

| Title | Description |
|-------|-------------|
| Market-Capped Exclusivity | Each market is protected. We limit the number of firms per region to preserve lead quality and prevent oversaturation. |
| Review-First Onboarding | Every firm is evaluated before access is granted. We work with firms that meet our intake quality and capacity standards. |
| Transparent Performance Reporting | Full visibility into case flow activity, qualification metrics, and opportunity handling — no black boxes. |
| Compliance-First Design | Built with legal advertising compliance in mind. No misleading claims. No guaranteed outcomes. Structured for ethical lead handling. |
| Dedicated Support | Every partner firm has a direct line to our team. No ticket queues. No chatbots. Real people who understand case acquisition. |
| Qualification Standards | Every opportunity passes through our screening layer before reaching your intake team. We focus on fit, not just volume. |

---

### Section 16: SOCIAL PROOF

**Bricks Structure:**

```
Section (padding: 64px 0)
  └── Container (max-width: 1280px)
      ├── Div (Founding Cohort Status — centered card)
      ├── Div (Grid: 3 columns, gap: 16px — testimonial cards)
      └── Div (Disclaimer)
```

**Founding Cohort Card:**

```css
border-radius: 16px;
border: 1px solid rgba(255,255,255,0.06);
background: rgba(255,255,255,0.02);
padding: 28px 36px;
text-align: center;
```

Stats row (flex, centered, gap: 48px):

| Value | Label | Color |
|-------|-------|-------|
| 8 | Firms Onboarded | White |
| 25 | Total Founding Slots | #F59E0B (gold) |
| 14 | Markets Protected | White |

Progress bar below: `height: 8px; border-radius: 9999px; background: rgba(255,255,255,0.06);`
Fill: `width: 32%; background: linear-gradient(90deg, #00B4D8, #7C5CFF);`
Text below: "8 of 25 founding partner slots filled · 17 remaining" (13px, #6B7280)

**Testimonial Cards:**

Each card: `cp-card` class with MessageCircle icon (16px, `rgba(0,212,255,0.4)`)

| Quote | Name | Role |
|-------|------|------|
| "The market-capped model is the right approach. Oversaturation is what kills lead quality in legal." | Legal Marketing Advisor | 15+ Years in PI Marketing |
| "Most firms do not have a lead problem. They have an intake discipline problem. CasePort addresses the real gap." | Law Firm Growth Consultant | Scaled 40+ PI Firms |
| "The qualification layer is what separates this from every other lead gen service I have evaluated." | PI Firm Operations Director | Multi-State Practice |

**Disclaimer:**

```
* Testimonials represent feedback from advisory reviewers during system
development. Named case studies will be published as the founding cohort matures.
```

12px, #4B5563, italic.

---

### Section 17: FOUNDER VIDEO

**Bricks Structure:**

```
Section (padding: 64px 0)
  └── Container (max-width: 896px)
      ├── Div (Header — text-center)
      └── Div (Video placeholder — aspect-ratio 16/9)
```

**H2:** "Why We Built CasePort"

**Video Placeholder:**

```css
border-radius: 16px;
border: 1px solid rgba(255,255,255,0.08);
aspect-ratio: 16/9;
background: linear-gradient(135deg, rgba(0,212,255,0.04) 0%, rgba(124,92,255,0.03) 50%, rgba(0,0,0,0.2) 100%);
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
cursor: pointer;
```

Center content:
- Play button circle: `border: 2px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.1); padding: 20px; border-radius: 50%; backdrop-filter: blur(8px);`
- Text: "Watch the 90-Second Overview" (15px, #9CA3AF, font-weight 500)
- Sub: "Coming soon — video in production" (12px, #4B5563)

> **When your video is ready:** Replace this placeholder with a Bricks Video element or embed a YouTube/Vimeo player.

---

### Section 18: FAQ

**Zone:** Zone 6 (Resolution). See [Zone Gradients](#4-zone-background-gradients).

**Bricks Structure:**

```
Section (id="faq", padding: 80px 0 desktop, 128px 0 large)
  └── Container (max-width: 896px)
      ├── Div (Header — text-center)
      └── Div (Accordion — Bricks Accordion element)
```

**H2:**

```
Straight Answers.
No Runaround.    ← color: rgba(255,255,255,0.40)
```

**Accordion Styling:**

Use Bricks' built-in **Accordion** element. Style each item:

```css
/* Accordion item */
border-radius: 16px;
border: 1px solid rgba(255,255,255,0.06);
background: rgba(255,255,255,0.02);
padding: 0 24px;
margin-bottom: 12px;
overflow: hidden;
```

Open state: `border-color: rgba(0,212,255,0.12); background: rgba(255,255,255,0.03);`

Question text: 15px, semibold, white
Answer text: 15px, #B0B8C4, line-height 1.8

**FAQ Content:**

| Question | Answer |
|----------|--------|
| How is CasePort different from other lead generation companies? | Most lead gen companies sell you a list. They generate volume, blast it to multiple firms, and let you fight over scraps. CasePort is not a lead vendor. It is a case acquisition system — built around qualification, routing, and retained value. We cap the number of firms per market. We screen every opportunity before it reaches you. And we do not disappear after the lead is delivered. The difference is not incremental. It is structural. |
| What happens if the leads do not convert? | First — we do not sell 'leads.' We deliver qualified case opportunities that have passed through a multi-layer screening process. That said, conversion depends on your firm's intake speed, follow-up discipline, and case selection. We provide full transparency into opportunity quality metrics so you can see exactly what is working and what needs adjustment. We also have structured recovery protocols designed to reduce preventable breakdowns after delivery. |
| How do you qualify opportunities before routing them? | Every opportunity passes through our 6-layer qualification framework — from initial intent signal through case-fit verification. We evaluate injury type, timing, liability indicators, geographic alignment, and firm capacity match. The goal is simple: your intake team should only see opportunities that fit. We would rather send you 10 qualified opportunities than 100 unqualified ones. |
| What does 'market-capped' actually mean? | It means we limit the number of partner firms per metropolitan area to a maximum of three. Hard cap. No exceptions. This is not a marketing gimmick — it is a structural decision that protects lead quality and prevents the oversaturation that destroys ROI in every other lead gen model. If your market is full, you go on a waitlist. Period. |
| Can I see the system before committing? | We offer a structured review process — not a free trial. You apply, we evaluate fit, and if both sides align, we walk you through the system architecture, performance targets, and market availability before any commitment. We are selective because the model only works when both sides are serious. |
| Why should I trust a new company in this space? | You should not trust us based on promises. You should evaluate us based on structure. Our market-capped model means we have a financial incentive to make every partner successful — because we cannot just replace you with the next firm. Our transparent reporting means you see everything. And our compliance-first design means we are not cutting corners to generate volume. Trust is earned through structure, not slogans. |
| What is the pricing model? | Pricing is discussed during the review process and varies based on market, case type, and volume tier. We do not publish pricing because every market has different dynamics. What we can tell you is this: if the ROI calculator on this page does not show numbers that make sense for your firm, we are probably not the right fit. And that is fine. |
| How quickly can I expect to see results? | System activation typically takes 2-3 weeks after approval. Initial qualified opportunities begin flowing within the first 30 days. However, we do not promise overnight results — building a controlled case acquisition pipeline is a compounding process. Firms that commit to the system for 90+ days see the strongest returns. This is infrastructure, not a quick fix. |

---

### Section 19: SCARCITY

**Bricks Structure:**

```
Section (padding: 64px 0)
  └── Container (max-width: 896px, text-center)
      ├── Div (Badge pill — gold)
      ├── Heading H2
      ├── Paragraph
      └── Div (Grid: 3 columns, gap: 16px, max-width: 512px, mx-auto)
          ├── Stat: 17 / Founding Slots Left
          ├── Stat: 3 / Max Per Metro (gold border)
          └── Stat: 14 / Markets Protected
```

**Badge Pill:**

```css
display: inline-flex;
align-items: center;
gap: 10px;
border-radius: 9999px;
border: 1px solid rgba(245,158,11,0.15);
background: rgba(245,158,11,0.04);
padding: 10px 20px;
margin-bottom: 32px;
```

Dot: `8px, bg #FBBF24, animate-pulse`
Text: "LIMITED AVAILABILITY" — 12px, semibold, #F59E0B, uppercase, tracking 0.15em

**H2:**

```
We Partner With a Maximum of
3 Firms Per Metro Area.    ← class text-gradient-gold, larger size (56px desktop)
```

**Stat Cards:**

Small cards (padding: 16px, border-radius: 12px). Middle card has gold border (`rgba(245,158,11,0.12)`) and gold background tint.

---

### Section 20: FINAL CTA

**Bricks Structure:**

```
Section (padding: 80px 0 desktop, 144px 0 large)
  └── Container (max-width: 896px, text-center)
      ├── Text: "Next Step" (system-label, cyan)
      ├── Heading H2
      ├── Paragraph
      ├── Div (CTA row — flex, center)
      │   ├── Button: Request Private Access (btn-cta-cyan)
      │   └── Link: See ROI Projection →
      └── Text (micro-copy)
```

**H2:**

```
Ready to Stop Chasing Leads
and Start Controlling Case Flow?
```

Uses H2 Major sizing. On extra-large screens, bump to 52px (3.25rem).

---

### Section 21: FOOTER

**Bricks Structure:**

```
Section (border-top: 1px solid rgba(255,255,255,0.04), bg: #020405, padding: 48px 0 desktop)
  └── Container (max-width: 1280px)
      ├── Div (Grid: 4 columns — 30% / 20% / 20% / 25%)
      │   ├── Div (Brand)
      │   ├── Div (Platform links)
      │   ├── Div (Resources links)
      │   └── Div (Contact)
      ├── Div (Service Areas — mt: 40px, border-top)
      └── Div (Legal Disclaimer + Copyright — mt: 32px, border-top)
```

**Brand Column:**
- "CASEPORT" (17px, extrabold, tracking 0.28em, white)
- "Case Flow Without Guesswork" (system-label, #4B5563)
- Description paragraph (15px, #6B7280, max-width 320px)

**Platform Links:**
- For Law Firms → #system
- How It Works → #how-it-works
- ROI Projection → #roi-calculator
- Why CasePort → #trust
- FAQ → #faq

**Resources Links:**
- Insights → #insights
- Intelligence → #intelligence
- Injured? → #injured

**Contact:**
- access@caseport.io (linked)

**Service Areas:**

```
CasePort serves personal injury law firms across the United States, including
major markets in California (Los Angeles, San Diego, San Francisco), Texas
(Houston, Dallas, San Antonio, Austin), Florida (Miami, Tampa, Orlando,
Jacksonville), New York (New York City, Buffalo), Illinois (Chicago),
Pennsylvania (Philadelphia, Pittsburgh), Georgia (Atlanta), Arizona (Phoenix,
Tucson), Ohio (Columbus, Cleveland), New Jersey (Newark, Jersey City),
Michigan (Detroit), North Carolina (Charlotte, Raleigh), Virginia (Virginia
Beach, Richmond), Colorado (Denver), and Nevada (Las Vegas).
```

11px, #4B5563, line-height 1.8.

**Legal Disclaimer:**

```
Legal Disclaimer: CasePort provides case acquisition infrastructure services.
We do not guarantee any specific number of leads, cases, signed retainers, or
revenue outcomes. All projections, estimates, and performance metrics presented
on this website are illustrative and based on general market data. Actual results
depend on numerous factors including but not limited to market conditions, firm
capacity, case quality, conversion rates, and operational execution. CasePort is
not a law firm and does not provide legal advice. All advertising and lead
generation activities are conducted in compliance with applicable state bar rules
and legal advertising regulations. Past performance is not indicative of future
results.
```

12px, #4B5563, line-height 1.75.

**Copyright:** `© 2026 CasePort. All rights reserved.` + Privacy Policy / Terms of Service links.

---

## 4. Zone Background Gradients

The page is divided into 6 "zones" — each is a wrapper Section in Bricks with a specific background gradient. Sections within each zone share the same background.

**In Bricks:** Create a Section element for each zone. Place the individual content sections inside as nested Containers/Divs.

### Zone 1: Deep Space (Hero + Trust + Spotlight)

```css
background: linear-gradient(180deg, #030608 0%, #040A10 20%, #060C14 45%, #050B12 65%, #040A10 80%, #030608 100%);
```

**Glow orbs** (absolute positioned divs inside the zone):

| Position | Size | Color | Blur | Animation |
|----------|------|-------|------|-----------|
| left: -10%, top: 5% | 448px | rgba(0,212,255,0.10) | 120px | glow-pulse |
| right: -5%, top: 15% | 352px | rgba(124,92,255,0.08) | 100px | glow-pulse (delay 2s) |
| left: 30%, top: 55% | 320px | rgba(0,212,255,0.05) | 100px | glow-pulse (delay 4s) |

Also includes the hero background image at `opacity: 0.2; mix-blend-mode: screen;` covering the top 60%.

### Zone 2: Emergence (Market Intelligence + Problem + Transformation + Buyer Reality)

```css
background: linear-gradient(180deg, #030608 0%, #080804 8%, #0E0C04 20%, #120E06 35%, #100E06 50%, #0C0A04 65%, #080804 80%, #060A10 90%, #080E18 95%, #030608 100%);
```

Gold glow orb at center-top: `radial-gradient(circle, rgba(245,158,11,0.2) 0%, rgba(251,191,36,0.08) 40%, transparent 70%); opacity: 0.2;`

### Zone 3: Revelation (System Proof + Core + Specs + How It Works)

```css
background: linear-gradient(180deg, #030608 0%, #050C14 10%, #071018 25%, #091420 40%, #0B1624 50%, #091420 60%, #071018 75%, #050C14 90%, #030608 100%);
```

Cyan glow orbs at various positions.

### Zone 4: Golden Moment (ROI Calculator + Lead Magnet)

```css
background: linear-gradient(180deg, #030608 0%, #080804 10%, #0E0C04 25%, #120E06 40%, #100E06 55%, #0C0A04 70%, #080804 85%, #030608 100%);
```

Gold glow orbs.

### Zone 5: Proof (Trust + Social Proof + Founder Video)

```css
background: linear-gradient(180deg, #030608 0%, #060A10 15%, #080E16 35%, #060A10 60%, #040810 80%, #030608 100%);
```

Cyan/violet glow orb at center.

### Zone 6: Resolution (FAQ + Scarcity + Final CTA)

```css
background: linear-gradient(180deg, #030608 0%, #050A10 15%, #070D16 30%, #0A1020 50%, #070D16 70%, #050A10 85%, #030608 100%);
```

**How to create glow orbs in Bricks:**

1. Inside each Zone Section, add a Div with `position: absolute; inset: 0; overflow: hidden; pointer-events: none;`
2. Inside that Div, add child Divs for each orb with the specified position, size, border-radius: 50%, background color, and blur filter.
3. Add class `animate-glow-pulse` for the breathing animation.

---

## 5. Animation Guide

The React version uses Framer Motion for scroll-triggered animations. In Bricks, you have several options:

### Option A: Bricks Built-in Interactions (Recommended)

Bricks 1.9+ has built-in scroll-triggered animations. For each section:

1. Select the element in Bricks editor
2. Go to **Style > Interactions**
3. Add a "Scroll Into View" trigger
4. Set animation: Fade Up (translateY: 20px → 0, opacity: 0 → 1)
5. Duration: 600ms
6. Easing: ease-out

### Option B: CSS-only with Intersection Observer (Lightweight)

Add this to your global custom JS (Bricks > Settings > Custom Code > Body):

```html
<script>
document.addEventListener('DOMContentLoaded', function() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
});
</script>
```

Then add this CSS:

```css
.reveal-on-scroll {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}
.reveal-on-scroll.revealed {
  opacity: 1;
  transform: translateY(0);
}
```

Apply class `reveal-on-scroll` to any element you want to animate on scroll.

### Animation Map (which elements to animate)

| Section | Element | Animation |
|---------|---------|-----------|
| Hero | Left column (copy) | Fade up |
| Hero | Right column (card) | Scale in (scale 0.95 → 1) |
| Every H2 | Section header block | Fade up |
| Stat cards | Grid of cards | Stagger fade up (each card 80ms delay) |
| Problem | Left column | Slide in from left |
| Problem | Right column | Slide in from right |
| Before/After | Cards | Stagger fade up |
| Pillar cards | 3 cards | Stagger fade up |
| How It Works | 4 step cards | Stagger fade up |
| ROI Calculator | Calculator panel | Scale in |
| Trust cards | 6 cards | Stagger fade up |
| FAQ | Accordion | Fade up |

---

## 6. Responsive Breakpoints

Match these to Bricks' responsive breakpoints:

| Breakpoint | Bricks Name | Width | Key Changes |
|------------|-------------|-------|-------------|
| Base | Mobile | < 640px | 1 column, smaller text, hamburger menu |
| sm | Tablet | 640px+ | 2-column grids, medium text |
| lg | Desktop | 1024px+ | Full layout, all columns, desktop nav |
| xl | Large Desktop | 1280px+ | Max container width, largest text |

**Key responsive rules:**

- All grids collapse to 1 column on mobile, 2 on tablet, full on desktop
- H1: 40px → 52px → 68px
- H2: 28px → 36px → 44px
- Container padding: 16px → 24px → 32px
- Section padding: 64px 0 → 80px 0 → 96-128px 0
- Nav links: hidden on mobile (hamburger menu)
- CTA area: hidden on mobile (in hamburger menu instead)

---

## 7. SEO / GEO / AEO Implementation

### SEO — Rank Math Setup

1. **Install Rank Math** and run the setup wizard
2. **Homepage SEO** (Rank Math > Titles & Meta > Homepage):
   - Title: `CasePort | Case Acquisition System for Personal Injury Law Firms`
   - Description: `CasePort is a premium case acquisition system for personal injury law firms. Market-capped access. Review-first onboarding. Structured case flow from search intent to signed retainer.`
   - Focus Keyword: `case acquisition system personal injury`

3. **Schema Markup** (Rank Math > Schema):
   - Add Organization schema
   - Add FAQPage schema (Rank Math auto-detects FAQ blocks)
   - Add Product schema for the service

### GEO — Local Targeting

1. **Service area text in footer** (already included in the copy above)
2. **Create city landing pages later** (e.g., `/los-angeles-personal-injury-leads/`)
3. **Add geo meta tags** in Rank Math or custom header code:

```html
<meta name="geo.region" content="US" />
<meta name="geo.placename" content="United States" />
```

### AEO — AI Engine Optimization

1. **Hidden semantic content** for AI crawlers — add a Bricks "Rich Text" element with `display: none` (or use `sr-only` class) containing the Q&A content from the AEO block. This helps AI search engines understand your content.

2. **robots.txt** — In Rank Math > General Settings > Edit robots.txt:

```
User-agent: *
Allow: /
Disallow: /wp-admin/
Sitemap: https://www.caseport.io/sitemap_index.xml

# Welcome AI crawlers
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: ClaudeBot
Allow: /
```

---

## 8. ROI Calculator — Custom Code Block

The ROI Calculator requires JavaScript. In Bricks, use a **Code** element (HTML + CSS + JS).

Paste this complete, self-contained code into a Bricks Code element where the ROI Calculator should appear:

```html
<div id="roi-calc" class="roi-calculator">
  <div class="roi-header">
    <div class="system-label" style="color: rgba(245,158,11,0.8); margin-bottom: 20px;">Value Projection</div>
    <h2 style="font-family: 'Geist', sans-serif; font-size: clamp(28px, 4vw, 44px); font-weight: 600; color: white; line-height: 1.05; letter-spacing: -0.03em;">
      See What Controlled Case Flow<br>
      <span class="text-gradient-gold">Could Mean for Your Firm</span>
    </h2>
    <p style="margin-top: 20px; max-width: 640px; margin-left: auto; margin-right: auto; font-size: 17px; color: #B0B8C4; line-height: 1.75;">
      Adjust the inputs below to model your potential return. These projections are illustrative and based on the parameters you provide.
    </p>
  </div>

  <div class="roi-grid">
    <div class="roi-inputs">
      <div class="system-label" style="color: rgba(245,158,11,0.6); margin-bottom: 28px;">Your Parameters</div>
      <div class="roi-slider-group">
        <div class="roi-slider">
          <div class="roi-slider-header">
            <span>Qualified Leads per Month</span>
            <span id="leads-display" class="roi-value">20</span>
          </div>
          <input type="range" id="leads-slider" min="5" max="100" step="5" value="20">
        </div>
        <div class="roi-slider">
          <div class="roi-slider-header">
            <span>Average Case Settlement Value</span>
            <span id="case-display" class="roi-value">$75K</span>
          </div>
          <input type="range" id="case-slider" min="10000" max="500000" step="5000" value="75000">
        </div>
        <div class="roi-slider">
          <div class="roi-slider-header">
            <span>Estimated Conversion Rate</span>
            <span id="rate-display" class="roi-value">15%</span>
          </div>
          <input type="range" id="rate-slider" min="5" max="40" step="1" value="15">
        </div>
      </div>
    </div>

    <div class="roi-results">
      <div class="system-label" style="color: rgba(245,158,11,0.6); margin-bottom: 28px;">Projected Outcome</div>
      <div class="roi-results-list">
        <div class="roi-row highlight"><span>Signed Cases / Month</span><span id="r-cases">3</span></div>
        <div class="roi-row highlight"><span>Monthly Revenue Potential</span><span id="r-revenue">$225K</span></div>
        <div class="roi-divider"></div>
        <div class="roi-row"><span>Estimated Monthly Investment</span><span id="r-cost">$15K</span></div>
        <div class="roi-row highlight"><span>Net Monthly Value</span><span id="r-profit">$210K</span></div>
        <div class="roi-divider"></div>
        <div class="roi-row highlight large"><span>Projected Annual Revenue</span><span id="r-annual">$2.7M</span></div>
        <div class="roi-row highlight large"><span>Estimated ROI</span><span id="r-roi">1400%</span></div>
      </div>
      <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid rgba(245,158,11,0.1);">
        <p style="font-size: 11px; color: #6B7280; line-height: 1.6;">
          * These figures are illustrative projections only and do not constitute a guarantee of results. Actual outcomes depend on market conditions, case quality, firm capacity, and other factors.
        </p>
      </div>
    </div>
  </div>

  <div style="margin-top: 40px; text-align: center;">
    <a href="#" class="btn-cta-gold" style="display: inline-block; text-decoration: none;">Request Private Access</a>
    <p style="margin-top: 14px; font-size: 13px; color: #6B7280;">Market-capped. Review-first. For qualified firms only.</p>
  </div>
</div>

<style>
.roi-calculator { max-width: 1152px; margin: 0 auto; padding: 0 20px; }
.roi-header { text-align: center; }
.roi-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 48px; }
@media (max-width: 768px) { .roi-grid { grid-template-columns: 1fr; } }
.roi-inputs {
  border-radius: 16px;
  border: 1px solid rgba(245,158,11,0.15);
  background: linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);
  padding: 28px 32px;
  backdrop-filter: blur(20px);
}
.roi-results {
  border-radius: 16px;
  border: 1px solid rgba(245,158,11,0.2);
  background: linear-gradient(180deg, rgba(245,158,11,0.08) 0%, rgba(251,191,36,0.03) 50%, rgba(255,255,255,0.02) 100%);
  padding: 28px 32px;
  backdrop-filter: blur(20px);
  box-shadow: 0 0 40px rgba(245,158,11,0.15), 0 0 80px rgba(245,158,11,0.05);
}
.roi-slider-group { display: flex; flex-direction: column; gap: 36px; }
.roi-slider-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 10px; }
.roi-slider-header span:first-child { font-size: 14px; color: #9CA3AF; }
.roi-value { font-family: 'JetBrains Mono', monospace; font-size: 20px; font-weight: 600; color: white; }
input[type="range"] { width: 100%; height: 6px; border-radius: 9999px; appearance: none; -webkit-appearance: none; cursor: pointer; background: rgba(255,255,255,0.1); }
input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; height: 18px; width: 18px; border-radius: 50%; background: white; cursor: pointer; box-shadow: 0 0 10px rgba(245,158,11,0.4), 0 2px 8px rgba(0,0,0,0.3); border: 2px solid #F59E0B; }
input[type="range"]::-moz-range-thumb { height: 18px; width: 18px; border-radius: 50%; background: white; cursor: pointer; box-shadow: 0 0 10px rgba(245,158,11,0.4), 0 2px 8px rgba(0,0,0,0.3); border: 2px solid #F59E0B; }
.roi-results-list { display: flex; flex-direction: column; gap: 20px; }
.roi-row { display: flex; justify-content: space-between; align-items: baseline; }
.roi-row span:first-child { font-size: 14px; color: #6B7280; }
.roi-row.highlight span:first-child { color: #D1D5DB; }
.roi-row span:last-child { font-family: 'JetBrains Mono', monospace; font-size: 18px; font-weight: 600; color: #9CA3AF; }
.roi-row.highlight span:last-child { color: white; }
.roi-row.large span:last-child { font-size: 24px; }
.roi-divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(245,158,11,0.2), transparent); }
</style>

<script>
(function() {
  const leadsSlider = document.getElementById('leads-slider');
  const caseSlider = document.getElementById('case-slider');
  const rateSlider = document.getElementById('rate-slider');

  function formatCurrency(n) {
    if (n >= 1000000) return '$' + (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return '$' + (n / 1000).toFixed(0) + 'K';
    return '$' + n.toLocaleString();
  }

  function updateTrack(slider) {
    const pct = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
    slider.style.background = 'linear-gradient(to right, #F59E0B 0%, #F59E0B ' + pct + '%, rgba(255,255,255,0.1) ' + pct + '%, rgba(255,255,255,0.1) 100%)';
  }

  function calculate() {
    const leads = parseInt(leadsSlider.value);
    const caseVal = parseInt(caseSlider.value);
    const rate = parseInt(rateSlider.value);

    document.getElementById('leads-display').textContent = leads;
    document.getElementById('case-display').textContent = formatCurrency(caseVal);
    document.getElementById('rate-display').textContent = rate + '%';

    const signed = Math.round(leads * (rate / 100));
    const monthlyRev = signed * caseVal;
    const annualRev = monthlyRev * 12;
    const monthlyCost = leads * 750;
    const monthlyProfit = monthlyRev - monthlyCost;
    const roi = monthlyCost > 0 ? Math.round((monthlyProfit / monthlyCost) * 100) : 0;

    document.getElementById('r-cases').textContent = signed;
    document.getElementById('r-revenue').textContent = formatCurrency(monthlyRev);
    document.getElementById('r-cost').textContent = formatCurrency(monthlyCost);
    document.getElementById('r-profit').textContent = formatCurrency(monthlyProfit);
    document.getElementById('r-annual').textContent = formatCurrency(annualRev);
    document.getElementById('r-roi').textContent = roi + '%';

    updateTrack(leadsSlider);
    updateTrack(caseSlider);
    updateTrack(rateSlider);
  }

  leadsSlider.addEventListener('input', calculate);
  caseSlider.addEventListener('input', calculate);
  rateSlider.addEventListener('input', calculate);

  // Initial calculation
  calculate();
})();
</script>
```

---

## 9. Asset List

### Images (CDN URLs — use directly)

| Asset | URL | Usage |
|-------|-----|-------|
| Hero Background | `https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/nCnayMKq9Pz5mA74JpJ7kV/caseport-hero-abstract-kBJt36idRAGWzQHKVgWUij.webp` | Zone 1 background, opacity 0.2, mix-blend-mode: screen |
| System Visualization | `https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/nCnayMKq9Pz5mA74JpJ7kV/caseport-system-viz-GvikZj8cjQ4W4t5xEWt5hZ.webp` | Core System section, opacity 0.4 |

### Icons

Use [Lucide Icons](https://lucide.dev/) — available as SVG. Download the specific icons used:

Shield, Zap, Target, BarChart3, ArrowRight, CheckCircle2, XCircle, Phone, Clock, Users, TrendingUp, Lock, Eye, Filter, Route, RefreshCw, Award, ChevronRight, Menu, ArrowUpRight, Play, Download, MessageCircle, AlertTriangle, Gauge, MapPin

You can either:
1. Download SVGs from lucide.dev and upload to WordPress Media Library
2. Use inline SVG in Bricks Icon elements
3. Install a Lucide icon plugin for WordPress

---

## Quick Start Checklist

1. [ ] WordPress + Cloudways set up
2. [ ] Bricks Builder installed and activated
3. [ ] Fonts loaded (Geist, Instrument Serif, JetBrains Mono)
4. [ ] Global CSS pasted into Bricks custom code
5. [ ] Color palette defined in Bricks global colors
6. [ ] Header template created with sticky nav
7. [ ] Home page created with 6 zone wrappers
8. [ ] Sections built inside zones (top to bottom)
9. [ ] ROI Calculator code block added
10. [ ] Scroll animations configured
11. [ ] Rank Math SEO configured
12. [ ] robots.txt updated for AI crawlers
13. [ ] Mobile menu tested
14. [ ] All links working (#anchors)
15. [ ] Legal disclaimer in footer

---

*This guide was prepared by Manus AI for CasePort.io. All design specifications, copy, and code are derived from the approved homepage build.*
