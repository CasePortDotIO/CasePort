# CasePort Request Private Access — Design Brainstorm

## Context
This is a premium multi-step qualification flow for plaintiff-side PI law firms. It must feel like controlled access to serious infrastructure — not a form, not a waitlist, not a vendor application. The experience opens from the "Request Private Access" button on the CasePort homepage.

---

<response>

## Idea 1: "The Vault Door" — Brutalist Luxury Meets Controlled Access

<text>

### Design Movement
Neo-Brutalist Luxury — raw structural confidence meets institutional precision. Think Bloomberg Terminal crossed with a Swiss private bank's client onboarding portal.

### Core Principles
1. **Structural honesty** — every element serves a purpose, nothing decorative
2. **Controlled revelation** — information unfolds only as earned through qualification
3. **Monolithic confidence** — single dominant surfaces, no scattered cards
4. **Tactile weight** — inputs feel heavy, deliberate, consequential

### Color Philosophy
The page background is warm stone (#F5F0EB) — not white, not gray. The application shell is a single deep navy-charcoal monolith (#0A0E17 → #111827 radial gradient) that sits on this warm surface like a vault door. Inner input surfaces are off-white (#FAFAF8) with hairline warm borders. Gold (#F59E0B) appears only on the progress indicator — a thin, precise line that advances like a loading bar on institutional software.

### Layout Paradigm
Single-column monolithic shell. The entire form lives inside one large dark card that dominates the viewport. No sidebar preview panels. No floating elements. The shell itself IS the experience. On desktop, the shell is 680px wide, centered, with generous warm stone visible around it. On mobile, it bleeds edge-to-edge.

### Signature Elements
1. **The Monolith** — a single dark card with subtle inner glow at the top edge, like light escaping a vault
2. **Precision Progress Line** — a 2px gold line at the top of the shell that advances with mathematical precision

### Interaction Philosophy
Every tap feels like turning a dial in a control room. Cards for options have a subtle press-down effect (translateY + shadow reduction). Auto-advance after selection creates a sense of the system responding to you, not you filling out a form.

### Animation
- Step transitions: content fades out (opacity 0, translateY -8px, 200ms), then new content fades in (opacity 1, translateY 0, 300ms ease-out)
- Option card selection: scale(0.98) + border-color shift to cyan for 150ms, then auto-advance
- Progress line: smooth width transition (400ms cubic-bezier)
- Hard stop screen: content dissolves to a calm, centered message with a slow fade (600ms)
- No bouncing, no sliding panels, no parallax

### Typography System
- Headlines: Geist Sans 600, 28-32px, #F1F3F5
- Body/helper: Geist Sans 400, 15-16px, #B0B8C4
- System labels (progress phases, microcopy): JetBrains Mono 500, 11px, uppercase, tracking 0.15em
- Option card text: Geist Sans 500, 16px
- CTA buttons: Geist Sans 600, 15px

</text>
<probability>0.06</probability>

</response>

---

<response>

## Idea 2: "The Command Layer" — Institutional Dashboard Aesthetic

<text>

### Design Movement
Institutional Command Interface — inspired by Bloomberg, military command centers, and Apple's Pro product line. The qualification flow feels like you're being onboarded into a system, not filling out a form.

### Core Principles
1. **Layered depth** — hero shell sits above a warm ambient background, form card floats above the shell
2. **Asymmetric intelligence** — left side holds the form, right side holds contextual system information
3. **Progressive trust** — each step reveals more about CasePort's seriousness
4. **Quiet authority** — the design speaks through restraint, not decoration

### Color Philosophy
Warm ivory page (#F5F1EC) creates ambient warmth. The hero zone uses the CasePort deep navy-charcoal (#0A0E17) with a subtle radial gradient brightening toward center (#131B2E). The form card is a glassmorphic panel (rgba(255,255,255,0.04), border rgba(255,255,255,0.08)) floating inside the dark shell. Input surfaces are soft white (#FAFAF8). Accent cyan (#22D3EE) marks active states and the current progress phase. Gold (#F59E0B) appears only on the progress bar fill.

### Layout Paradigm
Split hero: 55% left (headline + form shell) / 45% right (contextual preview panel showing what the current step evaluates). Below the hero, the form card is centered at 720px max-width inside the dark shell. The right panel on desktop shows a subtle "what we're evaluating" sidebar that updates per step — reinforcing that this is a real qualification system, not a form.

### Signature Elements
1. **The Evaluation Sidebar** — a translucent panel on the right (desktop only) that shows contextual qualification criteria for each step, making the applicant feel observed and evaluated
2. **Phase Markers** — five small dots/labels (Firm → Markets → Intake → Funding → Contact) with the active one glowing cyan, connected by a thin line
3. **System Status Bar** — a thin bar at the very top of the shell showing "Private Access Application — Under Qualification" in JetBrains Mono

### Interaction Philosophy
The form responds to you like a system. When you select an option, the sidebar updates. When you advance, the phase marker transitions. The experience teaches you that CasePort is watching, evaluating, qualifying — without saying it explicitly.

### Animation
- Step transitions: crossfade with slight vertical shift (translateY 12px → 0, 350ms ease-out, staggered 50ms between headline and options)
- Sidebar content: fade + slide from right (translateX 20px → 0, 400ms)
- Phase marker: active dot scales up (1 → 1.3) with cyan glow pulse
- Progress bar: smooth fill with subtle shimmer
- Option hover: border brightens from 0.06 to 0.15 opacity, 200ms
- Hard stop: form content fades, replaced by centered message with a subtle red-shifted border glow

### Typography System
- Hero headline: Geist Sans 700, 48-56px (desktop), #F1F3F5
- Form step headlines: Geist Sans 600, 24-28px, #F1F3F5
- Body/helper: Geist Sans 400, 15px, #B0B8C4
- Sidebar labels: JetBrains Mono 500, 11px, uppercase, tracking 0.2em, #6B7280
- Option cards: Geist Sans 500, 15-16px, #E5E7EB
- Progress phase labels: JetBrains Mono 500, 10px, uppercase
- CTA: Geist Sans 600, 15px, gradient background

</text>
<probability>0.08</probability>

</response>

---

<response>

## Idea 3: "The Private Terminal" — Dark Luxury Application Portal

<text>

### Design Movement
Dark Luxury Terminal — the intersection of a private equity deal room and Apple's Pro aesthetic. Every pixel communicates: this is not for everyone.

### Core Principles
1. **Full-bleed authority** — the dark shell extends to fill the viewport, no warm background peeking through on the main flow (warm ivory only on hard-stop/confirmation screens)
2. **Single-focus clarity** — one question, one screen, zero distraction
3. **Earned progression** — each step forward feels like clearing a gate
4. **Sensory premium** — subtle glow, depth, and texture make every surface feel expensive

### Color Philosophy
The entire application flow lives inside a full-viewport dark environment (#0A0E17 base with subtle radial gradient to #0F1629 at center). This creates total immersion — you've entered CasePort's system. Cards and input surfaces use glassmorphic treatment (rgba(255,255,255,0.03-0.06)). Option cards have a subtle warm border on hover (rgba(255,255,255,0.12)). The progress bar uses a gradient from cyan (#22D3EE) to a muted violet (#8B5CF6) — matching the CTA gradient from the brand system. Gold appears nowhere in the flow — it's reserved for the confirmation screen to signal "you've been received." The warm ivory (#F5F1EC) appears only on the confirmation/hard-stop screens as a dramatic tonal shift — you've exited the system.

### Layout Paradigm
Vertically centered, single-column. The form content sits in the vertical and horizontal center of the viewport inside a generous glassmorphic panel (max-width 640px). Above the panel: the CASEPORT wordmark and a thin system status line. Below: persistent microcopy. The entire viewport is the dark shell. No sidebars, no split layouts. Pure focus.

### Signature Elements
1. **The Glow Ring** — a subtle radial glow behind the form panel that pulses very slowly (12s cycle), like a breathing system
2. **Gate Cleared Indicator** — when you complete a step, a thin cyan line briefly flashes across the top of the form panel before the next step loads
3. **The Tonal Shift** — hard-stop and confirmation screens break out of the dark environment into warm ivory, creating a dramatic "you've left the system" feeling

### Interaction Philosophy
You are inside the system. The dark environment is immersive. Every selection feels like a command input. The form doesn't ask — it qualifies. Auto-advance on single-choice questions makes it feel like the system is processing your input, not waiting for you.

### Animation
- Entry: form panel fades in from opacity 0 + scale(0.98) → 1, 500ms ease-out
- Step transitions: current content slides left and fades (translateX -30px, opacity 0, 250ms), new content enters from right (translateX 30px → 0, opacity 1, 350ms ease-out)
- Option selection: selected card gets cyan border + subtle scale(1.01), unselected cards fade to 0.5 opacity, 200ms
- Progress: thin line at top of panel, gradient fill, smooth 400ms transition
- Hard stop transition: dark background fades to warm ivory (800ms), form panel morphs to a lighter card
- Glow ring: radial-gradient opacity oscillates between 0.03 and 0.08, 12s sine cycle
- Back button: subtle fade-in on hover, no aggressive styling

### Typography System
- Wordmark: Geist Sans 700, 18px, tracking 0.15em, #F1F3F5
- System status: JetBrains Mono 500, 11px, uppercase, tracking 0.2em, #6B7280
- Step headlines: Geist Sans 600, 26-30px, #F1F3F5
- Body/helper: Geist Sans 400, 15px, #94A3B8
- Option text: Geist Sans 500, 15px, #E2E8F0
- Microcopy: Geist Sans 400, 13px, #64748B
- Progress labels: JetBrains Mono 500, 10px, uppercase, tracking 0.15em
- CTA button: Geist Sans 600, 15px, white on gradient

</text>
<probability>0.07</probability>

</response>

---

## Selected Approach: Idea 2 — "The Command Layer"

### Rationale
This approach best balances the spec requirements:
- The warm ivory background + dark shell + glassmorphic form card matches the exact color direction specified
- The asymmetric layout with evaluation sidebar creates perceived institutional value
- The split hero matches the homepage's 60/40 asymmetric pattern
- The contextual sidebar reinforces "you're being qualified" without saying it
- It bridges the homepage aesthetic (dark hero, warm sections) into the application flow
- The phase markers and system status bar create the "serious infrastructure" feeling
- It avoids the pitfalls of looking like a startup waitlist or generic SaaS form
