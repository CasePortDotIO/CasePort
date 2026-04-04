# Brand Fix Progress — Screenshot Review

## What's Working
- Glass panels now have correct 12px radius, 4% bg, 8% border ✓
- System labels now use JetBrains Mono at 12px with proper tracking ✓
- CTA gradient is now the correct 3-stop (#00B4D8 → #5BB6C9 → #7C5CFF) ✓
- Background is the correct dark navy oklch(0.06 0.01 250) ✓
- Nav matches the homepage exactly ✓
- Geist font is loading correctly ✓

## Issues to Fix
1. Hero headline "Signed Case." uses flat #22D3EE — should use gradient text (cyan→teal→purple) like the /for-law-firms page
2. The subline "46 markets. 3 firms each. No exceptions." uses Instrument Serif — should use Geist (the reference page doesn't use serif for sublines)
3. Hero headline is ~54px — the reference page uses 60px with -2.4px letter-spacing
4. Section headline "Geography Is Not a Detail. It Is the Strategy." also uses flat cyan — should use gradient text
5. Hero is NOT fully above the fold — the "Geography" section is visible, meaning the hero content ends well above the fold. Need to tighten or the hero is fine but there's too much empty space below it
6. The stat numbers in the hero glass panels use Geist Mono — should use Geist for numbers per the audit (stat numbers use Geist, not mono)
7. Body text below headline is 14-15px — should be 18px per the audit
8. The market count shows "46" but marketData.ts has 47 entries — need to verify

## Key Brand Rules to Apply in MarketPage.tsx
- H1: Geist, 60px, 700, -2.4px tracking, #F1F3F5
- H2: Geist, 60px, 700, -2.4px tracking, #F1F3F5
- H3: Geist, 30px, 700, white
- Section labels: JetBrains Mono, 12px, 500, 1.8px tracking, oklch(0.6 0.015 250)
- Body: Geist, 18px, 400, #B0B8C4
- Accent text: gradient (not flat cyan)
- Stat numbers: Geist (not mono), cyan or amber
- All mono font references in MarketPage should use JetBrains Mono
