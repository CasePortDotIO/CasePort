# CasePort.io — Full Audit: Typography, Conversion Sequence, Sticky CTA

## STICKY CTA FIX
**Problem:** `top-[60px]` makes it float below the nav with a visible gap. Looks tacky.
**Fix:** Make it `top-0` and merge it INTO the nav bar itself — or make it a slim bar that sits directly below the nav at `top-[57px]` (exact nav height) with NO gap. Better: replace the floating bar with a slim integrated bar that extends the nav's bottom border.

Actually, the BEST Apple approach: The sticky CTA should be part of the header itself. When user scrolls past hero, the header transforms — the nav CTA area morphs to show the scarcity message + gold CTA. This is how Apple does it (the "Buy" button appears in the nav on scroll). No separate floating bar needed.

## CONVERSION SEQUENCE AUDIT

**Current order:**
1. Hero (Promise + Primary CTA)
2. Trust Bar (Credibility signals)
3. Spotlight Statement (Emotional hook)
4. Problem (Pain)
5. Transformation (Before/After)
6. Buyer Reality (Empathy/Amplify)
7. System Proof (Solution intro)
8. Core System (3 Pillars)
9. System Specs (Technical proof)
10. How It Works (Process)
11. Market Intelligence (Opportunity size)
12. ROI Calculator (Value proof)
13. Lead Magnet (Secondary CTA)
14. Trust Architecture (Why us)
15. Social Proof (Testimonials)
16. Founder Video (Human connection)
17. FAQ (Objection handling)
18. Scarcity (Urgency)
19. Final CTA (Close)

**Issues:**
- Market Intelligence (stats) should come EARLIER — before the system reveal. Lawyers need to believe the opportunity is massive BEFORE they care about your system.
- Trust Architecture should come BEFORE the ROI Calculator — build trust first, then show the money.
- Social Proof + Founder Video should be closer to the FAQ — proof → objections → close is the classic close sequence.
- Lead Magnet should come AFTER FAQ — it's for people who read everything but aren't ready. It's the "exit ramp" before the final close.

**Optimal PASTOR+ sequence:**
1. Hero (Promise + CTA) ✅
2. Trust Bar ✅
3. Spotlight (Emotional hook) ✅
4. Market Intelligence (Opportunity — "this market is massive") — MOVED UP
5. Problem (Pain) ✅
6. Transformation (Before/After) ✅
7. Buyer Reality (Amplify) ✅
8. System Proof (Solution intro) ✅
9. Core System (3 Pillars) ✅
10. How It Works (Process) ✅
11. System Specs (Technical proof) ✅
12. Trust Architecture (Why us) — MOVED UP
13. ROI Calculator (Value proof) — now after trust is established
14. Social Proof (Testimonials)
15. Founder Video (Human connection)
16. FAQ (Objection handling)
17. Lead Magnet (Secondary CTA for non-converters) — MOVED DOWN
18. Scarcity (Urgency)
19. Final CTA (Close)

## TYPOGRAPHY AUDIT

**Current state:**
- Font: Geist (sans) + JetBrains Mono (labels)
- Hero H1: 4.5rem bold, tracking -0.04em
- Section H2: 2.75rem semibold, tracking -0.03em
- Body: 1.0625rem (17px), color #B0B8C4, line-height 1.75
- System labels: 0.625rem (10px) JetBrains Mono uppercase
- Card text: 14px
- FAQ questions: 15px semibold
- FAQ answers: 14px

**Issues for PI lawyer audience:**
1. **Geist may not be loading** — Google Fonts doesn't have "Geist" as a standard family. Need to verify. If it's falling back to Inter/system-ui, that's fine but not intentional.
2. **Body text at 14px in cards is too small** — lawyers are often 40-60 years old. Bump to 15-16px.
3. **System labels at 10px are decorative but borderline unreadable** — fine for decoration but ensure they're not carrying critical info.
4. **Section H2s are all the same size (2.75rem)** — no hierarchy variation between zones. Some should be bigger (golden moment) and some smaller (supporting sections).
5. **FAQ answers at 14px are too small** — these are the objection-destroying content. Should be 15-16px.
6. **No display font variation** — everything is Geist at different weights. Apple uses SF Pro Display for headlines and SF Pro Text for body. We need a display font for the big moments.
7. **Line height on headlines (1.05) is tight** — good for hero, but multi-line section heads need 1.15-1.2.

**Typography fixes:**
- Add a proper display font: "Instrument Serif" or "Playfair Display" for the spotlight quotes (the italic exhale moments)
- Bump card body text to 15px minimum
- Bump FAQ answers to 15px
- Add H2 size variation: golden moment sections get 3rem+, supporting sections stay at 2.5rem
- Ensure Geist is actually loading (check Google Fonts availability)
