# Article Template — Whitespace & Readability Forensic Audit

## Current Spacing Values (measured from code)

### Section-to-Section Gaps
- Value at Risk → Executive Summary: `mb-24 lg:mb-32` (96px → 128px) — NEEDS MORE
- Executive Summary → Key Takeaways: `mb-24 lg:mb-32` (96px → 128px) — NEEDS MORE
- Key Takeaways → Data Stats: `mb-24 lg:mb-32` (96px → 128px) — NEEDS MORE
- Each article section: `mb-24 lg:mb-36` (96px → 144px) — DECENT but could be more
- Section dividers: `mt-24 lg:mt-36` — OK
- FAQ → Cite: `mb-24 lg:mb-36` — OK
- Cite → Author: `mb-24 lg:mb-36` — OK

### Body Text
- Paragraph text: `text-[17px] lg:text-[19px] leading-[1.9]` — GOOD size, GOOD line height
- Paragraph spacing: `mb-8` (32px) — NEEDS MORE for reading comfort, should be 40-48px
- Section headings: `mb-10` (40px) after heading — NEEDS MORE, should be 48-56px

### Card Internal Padding
- Glass panels: `p-10 lg:p-12` (40px → 48px) — DECENT
- Key takeaway cards: `p-7` (28px) — TOO TIGHT, should be 32-40px
- Data stat cards: `p-6 lg:p-7` (24px → 28px) — TOO TIGHT
- FAQ items: `px-7 lg:px-9` — OK horizontally, vertical could be more

### Hero
- Hero pt: `pt-28 lg:pt-36` — OK
- Hero content overlap: `-mt-44 lg:-mt-60 pb-20 lg:pb-32` — pb needs more
- Title mb: `mb-10` — NEEDS MORE, should be 14-16
- Subtitle mb: `mb-14` — OK

### Reading Column
- Max width: `max-w-[720px]` — GOOD for readability (ideal is 600-720px)
- Content column to sidebar gap: `gap-16 xl:gap-24` — OK

### What Needs to Change for 10/10:
1. Increase ALL section gaps from mb-24/mb-32 to mb-32/mb-44 (128px → 176px)
2. Increase paragraph spacing from mb-8 to mb-10 (32px → 40px)
3. Increase heading-to-body gap from mb-10 to mb-14 (40px → 56px)
4. Increase card internal padding across the board
5. Increase hero bottom padding
6. Add more space before/after blockquotes
7. Increase FAQ item internal padding
8. Increase space between the bottom CTA and footer
