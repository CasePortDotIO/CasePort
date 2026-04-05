# Article Page Typography Audit — Apple Design Standards

## Current State Analysis

### Font Stack
- **Display**: Space Grotesk (good choice for headlines, geometric and modern)
- **Body**: Geist Sans (clean, readable, but generic)
- **Mono**: JetBrains Mono (appropriate for code/technical elements)

### Hierarchy Issues (Rated from Apple perspective: 3/10)

#### 1. **Hero Section**
- Title: `text-5xl lg:text-6xl` (60-80px) ✅ Good weight and scale
- Subtitle: `text-xl` (20px) ❌ **TOO SMALL** — Should be 24-28px for premium feel
- Author role: `text-sm` (14px) ✅ Appropriate
- Metadata: `text-xs` (12px) ✅ Appropriate

#### 2. **Executive Summary Section**
- Heading: `text-2xl` (24px) ❌ **TOO SMALL** — Should be 28-32px
- Body text: `text-lg` (18px) ✅ Good for readability
- Key Insight: `text-sm` (14px) ✅ Appropriate

#### 3. **Key Takeaways**
- Heading: `text-4xl lg:text-5xl` (48-64px) ✅ Good scale
- List items: `text-slate-700` (default 16px) ✅ Readable
- **Issue**: White cards on dark background create visual break (separate from transition issue)

#### 4. **Article Body Sections**
- Section headings: `text-4xl lg:text-5xl` (48-64px) ✅ Good scale
- Body paragraphs: `text-lg` (18px) with `leading-[2]` (line-height: 2) ✅ Excellent readability
- **Issue**: Line height is generous (good for readability) but creates visual heaviness

#### 5. **Sidebar Elements**
- Sidebar heading: `text-sm` (14px) uppercase ✅ Appropriate for UI
- Subscribe heading: `text-lg` (18px) ✅ Good
- Body copy: `text-sm` (14px) ✅ Appropriate

---

## Apple Design Perspective Rating: 5.5/10

### What Apple Would Say:

**Strengths:**
- ✅ Good use of Space Grotesk for display (distinctive, not generic)
- ✅ Generous line-height (2) shows understanding of readability
- ✅ Clear hierarchy between hero, sections, and body
- ✅ Appropriate use of white space

**Critical Issues:**
- ❌ **Subtitle is undersized** — Hero subtitle at 20px feels cramped for a premium brand
- ❌ **Executive Summary heading too small** — 24px doesn't command attention
- ❌ **Font weight inconsistency** — No clear distinction between font-bold and font-semibold usage
- ❌ **Geist Sans is generic** — Apple would use something more distinctive (SF Pro Display, or equivalent)
- ❌ **No optical sizing** — Font sizes don't adjust for visual weight balance
- ❌ **Letter spacing not optimized** — No tracking adjustments for headlines

---

## Recommended Fixes (To reach 9/10)

### 1. **Upgrade Hero Subtitle**
```
Current: text-xl (20px)
Recommended: text-2xl (24px) with tracking-wide and font-medium
```

### 2. **Elevate Executive Summary Heading**
```
Current: text-2xl (24px)
Recommended: text-3xl (30px) with font-bold and tracking-tight
```

### 3. **Establish Font Weight Hierarchy**
```
- Headlines: font-bold (700) with tracking-tight
- Subheadings: font-semibold (600) with tracking-normal
- Body: font-normal (400) with tracking-normal
- UI/Labels: font-medium (500) with tracking-wide
```

### 4. **Replace Geist Sans with Premium Alternative**
```
Current: Geist Sans (too generic)
Recommended: 
- "Sohne" (Apple-inspired, premium)
- "Founders Grotesk" (distinctive, editorial)
- Or keep Geist but add "Inter" as fallback (better than current)
```

### 5. **Add Optical Sizing for Headlines**
```
Section headings: text-5xl lg:text-6xl → Add tracking-tighter for 5xl
Executive Summary: text-3xl → Add tracking-tight
```

### 6. **Improve Line Height Consistency**
```
Hero subtitle: Add leading-relaxed (1.625)
Body paragraphs: Keep leading-[2] but reduce to leading-relaxed (1.625) for tighter feel
```

---

## The Transition Issue (Separate from Typography)

The transition point you mentioned is likely caused by:
1. **Key Takeaways cards** (white boxes on dark) create visual break
2. **Font color shift** — Gray text on dark → Black text on white
3. **Spacing change** — Hero has generous padding, Executive Summary has different padding

**Fix**: Make Executive Summary text light gray (not white) to soften the visual break, and ensure Key Takeaways cards have subtle dark background instead of pure white.

---

## Overall Assessment: 5.5/10 → 9/10 Potential

With typography refinements + subtle transition fixes, this becomes a **world-class article template**.
