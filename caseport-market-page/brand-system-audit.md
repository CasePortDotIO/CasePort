# CasePort.io Brand System Audit — Extracted from /for-law-firms

## BODY / PAGE BACKGROUND
- Background: oklch(0.06 0.01 250) — very dark navy/charcoal
- Text color: oklch(0.95 0.005 250) — near-white with slight cool tint
- Font: Geist, system-ui, -apple-system, sans-serif
- Base size: 16px / line-height: 24px

## TYPOGRAPHY

### H1 (Hero headline)
- Font: Geist, system-ui, -apple-system, sans-serif
- Size: 60px | Weight: 700 | Line-height: 69px | Letter-spacing: -2.4px
- Color: rgb(241, 243, 245) — #F1F3F5

### H2 (Section headlines)
- Font: Geist | Size: 60px | Weight: 700 | Line-height: 75px | Letter-spacing: -2.4px
- Color: rgb(241, 243, 245) — #F1F3F5

### H3 (Sub-section headlines)
- Font: Geist | Size: 30px | Weight: 700 | Line-height: 36px
- Color: rgb(255, 255, 255) — pure white

### Section labels (e.g., "CASE ACQUISITION SYSTEM", "RECOVERY PROTOCOL", "PROPRIETARY INTELLIGENCE")
- Font: JetBrains Mono, Geist Mono, monospace
- Size: 12px | Weight: 500 | Letter-spacing: 1.8px
- Color: oklch(0.6 0.015 250) — muted gray-blue
- Text-transform: uppercase

### Body text (paragraphs)
- Font: Geist | Size: 18px | Weight: 400 | Line-height: 29.25px
- Color: rgb(176, 184, 196) — #B0B8C4 — muted silver

### Trust badges (e.g., "Market-Capped Access", "ABA Compliant")
- Font: JetBrains Mono, monospace
- Size: 12px | Weight: 400 | Letter-spacing: 0.6px
- Color: rgb(107, 114, 128) — #6B7280

### Panel labels (e.g., "OPPORTUNITIES ROUTED TODAY")
- Font: Geist | Size: varies | Weight: varies
- Color: muted

## ACCENT / GRADIENT TEXT
- Gradient: linear-gradient(135deg, rgb(0, 212, 255), rgb(91, 182, 201), rgb(124, 92, 255))
- That's: #00D4FF → #5BB6C9 → #7C5CFF
- Applied via background-clip: text + -webkit-text-fill-color: transparent

## STAT NUMBERS
- In-panel stats (47, 84/100): Geist, 36px, 700, color: oklch(0.78 0.13 195) — cyan/teal
- Big hero stats ($2.4M+, 94%): Geist, 60px, 700, color: rgb(245, 158, 11) — amber/gold #F59E0B, letter-spacing: -1.2px
- Stat labels below: JetBrains Mono, 12px, uppercase, letter-spacing: 1.8px, muted gray

## BUTTONS

### Primary CTA (gradient)
- Background: linear-gradient(135deg, rgb(0, 180, 216), rgb(91, 182, 201) 40%, rgb(124, 92, 255))
- That's: #00B4D8 → #5BB6C9 → #7C5CFF
- Color: white | Font: Geist, 14px, 600
- Border-radius: 12px | Padding: 0px 20px
- No visible border

### Secondary/outline button
- Background: transparent
- Color: white | Font: Geist, 14px, 500
- Border: 1px solid oklch(1 0 0 / 0.15) — white at 15% opacity
- Border-radius: 12px | Padding: 0px 28px

## GLASS PANELS / CARDS
- Background: rgba(255, 255, 255, 0.04) — white at 4% opacity
- Backdrop-filter: blur(20px)
- Border: 1px solid oklch(1 0 0 / 0.08) — white at 8% opacity
- Border-radius: 12px
- No box-shadow

## NAV
- Position: fixed
- Background: transparent (with backdrop blur on scroll)
- CTA in nav: gradient button same as primary

## STATUS INDICATORS
- "Operational" green dot + text: Geist, 16px, 400, oklch(0.95 0.005 250)
- Green dot for active, amber for limited

## COLOR PALETTE SUMMARY
| Role | Value | Hex Approx |
|------|-------|-----------|
| Page BG | oklch(0.06 0.01 250) | ~#0A0E17 |
| Primary text | rgb(241, 243, 245) | #F1F3F5 |
| Body text | rgb(176, 184, 196) | #B0B8C4 |
| Muted/label | oklch(0.6 0.015 250) | ~#7A8494 |
| Trust badge | rgb(107, 114, 128) | #6B7280 |
| Accent gradient start | rgb(0, 212, 255) | #00D4FF |
| Accent gradient mid | rgb(91, 182, 201) | #5BB6C9 |
| Accent gradient end | rgb(124, 92, 255) | #7C5CFF |
| CTA gradient start | rgb(0, 180, 216) | #00B4D8 |
| Stat cyan | oklch(0.78 0.13 195) | ~#22D3EE |
| Stat amber | rgb(245, 158, 11) | #F59E0B |
| Glass bg | rgba(255,255,255,0.04) | white 4% |
| Glass border | oklch(1 0 0 / 0.08) | white 8% |
| Outline border | oklch(1 0 0 / 0.15) | white 15% |
| Card border-radius | 12px | — |

## KEY VISUAL PATTERNS
1. Dark navy background throughout — never pure black
2. Glass panels with 4% white bg + 20px blur + 8% white border
3. Gradient text for accent/highlight words (cyan→teal→purple)
4. JetBrains Mono for ALL system labels, badges, and small caps
5. Geist for everything else (headlines, body, buttons)
6. Section labels: 12px, uppercase, JetBrains Mono, 1.8px letter-spacing, muted color
7. Generous whitespace between sections
8. Cards have subtle glass effect, no shadows
9. Stat numbers in cyan or amber depending on context
10. Hero: two-column layout (copy left, live panel right)
