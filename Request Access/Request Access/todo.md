# CasePort Access Flow — TODO

## World-Class Improvements (10-point plan)

- [x] 1. Backend DB persistence — store every submission in database with all answers, score, UTM, timestamp
- [x] 2. Lead scoring engine — score each applicant 0-100 based on their answers, store with submission
- [x] 3. Email confirmation to applicant — send branded confirmation email after submission
- [x] 4. Owner notification — notify owner via built-in notification on new submission
- [x] 5. UTM/source tracking — capture utm_source, utm_medium, utm_campaign, utm_content from URL params
- [x] 6. localStorage progress recovery — save form state to localStorage, restore on return
- [x] 7. Premium option card micro-animations — left-border accent on hover, satisfying checkmark on selection
- [x] 8. Dynamic evaluation sidebar — sidebar content reacts to user's actual answers
- [x] 9. Credibility indicators — add trust signals in the flow (firm count, review time, ABA compliance note)
- [x] 10. Hard-stop recovery path — "notify me when this changes" + "refer a colleague" on disqualified screen
- [x] Mobile experience polish — better tap targets, bottom padding for mobile chrome, responsive chip grids
- [x] Vitest tests — 8/8 passing (lead scoring engine + auth logout)
- [x] TypeScript — zero compilation errors
- [x] Rate limiting — IP-based in-memory rate limiter (3 submissions/hr, 5 waitlist/hr per IP)
- [x] ABA compliance disclaimer — added to all three screen footers (main flow, hard stop, confirmation)
- [x] Mobile safe-area padding — env(safe-area-inset-*) applied to root div and screen containers
- [x] Confirmation screen — upgraded "What Happens Next" to structured 3-step layout with icons
- [x] Vitest tests — 13/13 passing (lead scoring + auth logout + rate limiter)

## Completed
- [x] Basic multi-step qualification flow (14 screens)
- [x] Hard stop screens
- [x] Soft fail modals
- [x] Confirmation screen
- [x] Evaluation sidebar (static)
- [x] Progress bar with phases
- [x] Fit-to-screen layout
- [x] Readability polish pass
- [x] Chip grid scroll constraint

## UX Refinements
- [x] Remove "Step X of 14" counter — replaced with nothing (Option A: phase labels + progress bar only)

## Bug Fixes
- [x] Fix overlapping text — removed flex-1 stretch from single-choice option cards; panel now scrolls internally; microcopy no longer bleeds over cards

## Audit Fixes (All 7)
- [x] Fix 1: Lead scoring option IDs — rewrote leadScoring.ts with correct formData option IDs (1a/1b/2a etc)
- [x] Fix 2: EvaluationSidebar signal IDs — updated all signal detection to match formData
- [x] Fix 3: Submitting state — spinner + "Submitting..." on button; submitError shown; back button hidden during submission
- [x] Fix 4: Scroll-to-top — scrollPanelRef resets scrollTop to 0 on every screen transition
- [x] Fix 5: Enter key advance — keydown listener advances single-choice screens on Enter (ignores inputs/textareas/buttons)
- [x] Fix 6: OG/Twitter/JSON-LD meta tags — added to index.html with noindex for private page
- [x] Fix 7: robots.txt — created in client/public/ blocking all crawlers
- [x] All 13 tests passing (3 test files: leadScoring, rateLimiter, auth.logout)

## Bug Fixes (Continued)
- [x] Fix React 19 / Framer Motion element.ref deprecation error — upgraded framer-motion 12.23.22 → 12.38.0 (contains explicit React 19 ref handling in PopChild)

## Full Interaction & Mobile Audit
- [x] Audit all 14 screens for overlapping text, clipped content, broken clicks
- [x] Fix mobile layout — switched root from h-screen overflow-hidden to min-h-screen on mobile; sm+ keeps fixed layout
- [x] Fix footer overlap — all three screens (main, confirmation, hardstop) now use flex-col sm:flex-row for brand/links row
- [x] Fix ChipSelect selected chips — added max-h-24 overflow-y-auto to prevent pushing grid off-screen
- [x] Fix FormScreen microcopy — guarded empty microcopy to remove phantom spacing
- [x] Fix OptionCard — responsive px-4 sm:px-5 padding, minHeight 52px for mobile tap targets
- [x] Fix ProgressBar — gap-1.5 sm:gap-2 between dot and label
- [x] Fix scroll-to-top — also calls window.scrollTo on mobile where panel is not fixed-height
- [x] 13/13 tests passing, zero TypeScript errors

## Critical Bug Fix (Current)
- [x] Fix Continue button on ChipSelect screen — reduced chip grid max-height from 240px to 160px to prevent overflow; button now fully clickable and functional (tested in live preview)

## Legibility Audit
- [x] Increase opacity on all secondary/tertiary text across all screens for improved legibility

## Readability & Spacing Fixes (Current)
- [x] Increase margins/padding in header and intro section for breathing room
- [x] Tighten form panel internal spacing (p-6 sm:p-10)
- [x] Improve typography line-height and letter-spacing for clarity
- [x] Increase chip padding and grid gaps for better visual separation
- [x] Bump font sizes on mobile for readability (no layout changes)
- [x] Test readability at 375px, 768px, and 1024px breakpoints (desktop and mobile verified, spacing improvements hold across all breakpoints)

## Final Status
- [x] All 14 screens fully functional and tested
- [x] No overlapping text anywhere
- [x] All buttons clickable and responsive
- [x] Mobile responsive (375px–1440px)
- [x] 13/13 tests passing
- [x] Zero TypeScript errors
- [x] Comprehensive spacing and typography improvements applied
- [x] Production ready
