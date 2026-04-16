# CasePort Developer Guide
## What to build on the article page — plain English, nothing missed

---

Hey. This document tells you exactly what to add to the article page on the frontend.
Every single item here has a specific purpose. Nothing is decoration.
I'll tell you what it is, why it matters, and exactly what to do.

---

## PART 1: THE PAGE `<head>` — Hidden tags Google and AI engines read

These tags are invisible to visitors but are the most important things on the page for rankings.
They go in the Next.js `generateMetadata()` function.

---

### 1. Page Title (the browser tab + Google blue link)
Pull from: `article.metaTitle`
Fallback to: `article.title`

```ts
title: article.metaTitle ?? article.title
```

---

### 2. Meta Description (the grey text under the Google blue link)
Pull from: `article.metaDescription`
Fallback to: `article.excerpt`

```ts
description: article.metaDescription ?? article.excerpt
```

---

### 3. Canonical URL (tells Google which version of the page is the "real" one)
Pull from: `article.canonicalUrl`
Fallback to: `https://caseport.io/insights/` + the article slug

```ts
alternates: {
  canonical: article.canonicalUrl ?? `https://caseport.io/insights/${article.slug}`
}
```

---

### 4. Robots (tells Google whether to index the page or not)
If `article.noIndex` is true → tell Google to skip it
If `article.noIndex` is false → tell Google to index it

```ts
robots: article.noIndex ? 'noindex,nofollow' : 'index,follow'
```

---

### 5. Open Graph tags (controls how the article looks when shared on LinkedIn, iMessage, Facebook)

```ts
openGraph: {
  title: article.openGraph?.ogTitle ?? article.metaTitle ?? article.title,
  description: article.openGraph?.ogDescription ?? article.metaDescription ?? article.excerpt,
  images: article.openGraph?.ogImage?.url
    ? [{ url: article.openGraph.ogImage.url, width: 1200, height: 630 }]
    : [],
  type: 'article',
  publishedTime: article.publishedDate,
  modifiedTime: article.updatedAt,
  siteName: 'CasePort',
}
```

---

### 6. Twitter/X Card tags (controls how the article looks when shared on X/Twitter)

```ts
twitter: {
  card: article.twitterCard?.twitterCardType ?? 'summary_large_image',
  title: article.twitterCard?.twitterTitle ?? article.metaTitle ?? article.title,
  description: article.twitterCard?.twitterDescription ?? article.metaDescription,
  images: article.twitterCard?.twitterImage?.url
    ? [article.twitterCard.twitterImage.url]
    : article.openGraph?.ogImage?.url
    ? [article.openGraph.ogImage.url]
    : [],
}
```

---

### 7. JSON-LD Structured Data (the most important hidden code on the page)

This is what generates Google's rich results (FAQ cards, HowTo steps, breadcrumbs)
and gets CasePort cited by ChatGPT, Perplexity, and Google AI Overview.

Import the generator function from the patch file:

```ts
import { generateArticleJsonLd } from '@/lib/article-schema'
```

Then inside the page component, inject every schema object into the `<head>`:

```tsx
const schemas = generateArticleJsonLd(article)

return (
  <>
    {schemas.map((schema, i) => (
      <script
        key={i}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    ))}
    {/* rest of page */}
  </>
)
```

The generator automatically creates:
- Article schema (always)
- FAQ schema (if FAQs are filled in)
- HowTo schema (if schema type is HowTo and steps are filled in)
- Speakable schema (if speakable selectors are filled in — more on this below)
- Breadcrumb schema (always)

You don't need to build any of this manually. Just call the function and inject the output.

---

---

## PART 2: THE PAGE BODY — Visible elements with specific CSS classes

This is the critical part most developers miss.
Some of the CSS classes below are not just for styling — they are used by Google's
Speakable schema to identify which parts of the page to read aloud for voice search.
If the classes are wrong or missing, the voice optimization doesn't work.

---

### 8. The H1 Headline

Standard `<h1>` tag. Nothing special needed.
The Speakable schema already targets `h1` by default.

```tsx
<h1>{article.title}</h1>
```

---

### 9. Direct Answer Block — THE most important element on the page

This is the block that gets extracted by ChatGPT, Perplexity, Google AI Overview,
and Google's Featured Snippet algorithm.

**It must:**
- Have the CSS class `direct-answer-block`
- Be visually distinct (different background, border, or style — make it stand out)
- Appear near the top of the page, before any other body content
- Render the text from `article.directAnswer`

```tsx
{article.directAnswer && (
  <div className="direct-answer-block">
    <p>{article.directAnswer}</p>
  </div>
)}
```

Style it so it looks like a highlighted answer box — think of it like a pull quote
at the top of the article. Editors will see it on the live page and know it's special.

---

### 10. Key Takeaways Box

Must have the CSS class `key-takeaways`.
This is also a Speakable target — Google Assistant may read this section aloud.

```tsx
{article.keyTakeaways?.length > 0 && (
  <div className="key-takeaways">
    <h3>Key Takeaways</h3>
    <ul>
      {article.keyTakeaways.map((item, i) => (
        <li key={i}>{item.takeaway}</li>
      ))}
    </ul>
  </div>
)}
```

---

### 11. FAQ Section — must use specific class on each answer

Each FAQ answer element must have the class `faq-answer`.
This is a Speakable target. It also enables the FAQ JSON-LD schema
to match the visible content on the page.

```tsx
{article.faqItems?.length > 0 && (
  <section>
    <h2>Frequently Asked Questions</h2>
    {article.faqItems.map((faq, i) => (
      <div key={i} className="faq-item">
        <h3>{faq.question}</h3>
        <div className="faq-answer">
          <p>{faq.answer}</p>
        </div>
      </div>
    ))}
  </section>
)}
```

You can make this an accordion/expandable component. Just make sure the
`faq-answer` class is on the element containing the answer text,
not the wrapper.

---

### 12. Key Statistics Section

Display the stats from `article.keyStatistics` with their source attribution.
These must be visible on the page — not just stored in the CMS.
Sourced statistics build credibility with lawyers (who will verify them)
and signal data richness to AI engines.

```tsx
{article.keyStatistics?.length > 0 && (
  <div className="key-statistics">
    {article.keyStatistics.map((stat, i) => (
      <div key={i} className="stat-item">
        <p className="stat-text">{stat.stat}</p>
        <p className="stat-source">
          Source: {stat.sourceUrl
            ? <a href={stat.sourceUrl} target="_blank" rel="noopener">{stat.source}</a>
            : stat.source
          }
          {stat.statYear && ` (${stat.statYear})`}
        </p>
      </div>
    ))}
  </div>
)}
```

---

### 13. Expert Quotes

Display any expert quotes from `article.expertQuotes`.
These are E-E-A-T signals — Google trusts pages with attributed expert quotes.

```tsx
{article.expertQuotes?.map((quote, i) => (
  <blockquote key={i} className="expert-quote">
    <p>"{quote.quote}"</p>
    <cite>— {quote.speakerName}, {quote.speakerTitle}</cite>
  </blockquote>
))}
```

---

### 14. Entity Definitions (Glossary / Term Definitions)

If `article.entityDefinitions` has entries, render them as a definition list.
These teach AI engines to associate CasePort with specific industry terms.

```tsx
{article.entityDefinitions?.length > 0 && (
  <div className="entity-definitions">
    <h3>Key Terms</h3>
    <dl>
      {article.entityDefinitions.map((item, i) => (
        <div key={i}>
          <dt>{item.term}</dt>
          <dd>{item.definition}</dd>
        </div>
      ))}
    </dl>
  </div>
)}
```

---

### 15. Byline — Author + Dates + Verified Date

Show author name, published date, last verified date, and read time near the top of the article.
The "Last Verified" date is a trust signal — especially important for legal content.
Lawyers notice this.

```tsx
<div className="article-byline">
  {article.author?.name && <span>By {article.author.name}</span>}
  {article.publishedDate && (
    <time dateTime={article.publishedDate}>
      {formatDate(article.publishedDate)}
    </time>
  )}
  {article.lastVerifiedDate && (
    <span className="verified-date">
      ✓ Verified {formatDate(article.lastVerifiedDate)}
    </span>
  )}
  {article.readTime && <span>{article.readTime} min read</span>}
</div>
```

---

### 16. Expert Reviewer Credit (if filled in)

Show near the byline or at the bottom of the article.
This is an E-E-A-T signal. Google confirms content reviewed by verifiable experts ranks higher.

```tsx
{article.expertReviewerName && (
  <div className="expert-reviewer">
    <small>Reviewed by {article.expertReviewerName}</small>
  </div>
)}
```

---

### 17. Breadcrumb — visible + in schema

The JSON-LD generator already adds Breadcrumb schema to the `<head>`.
But you also need the visible breadcrumb on the page itself.

```tsx
<nav aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/insights">Insights</a></li>
    <li>{article.title}</li>
  </ol>
</nav>
```

---

### 18. Related Articles

Pull from `article.relatedArticles` and display as article cards at the bottom.
Internal links build topic clusters — critical for topical authority.

```tsx
{article.relatedArticles?.length > 0 && (
  <section className="related-articles">
    <h3>Related Articles</h3>
    {article.relatedArticles.map((related) => (
      <a key={related.slug} href={`/insights/${related.slug}`}>
        <h4>{related.title}</h4>
        <p>{related.excerpt}</p>
      </a>
    ))}
  </section>
)}
```

---

### 19. APA Citation (for research-style articles)

If `article.citation` is filled in, display a "Cite This Article" section at the bottom.
This gets CasePort cited in academic and professional writing — backlinks and authority.

```tsx
{article.citation && (
  <div className="cite-this">
    <h4>Cite This Article</h4>
    <p>{article.citation}</p>
    <button onClick={() => navigator.clipboard.writeText(article.citation)}>
      Copy Citation
    </button>
  </div>
)}
```

---

### 20. Legal Disclaimer

Display the appropriate disclaimer at the bottom of every article.
This is ABA compliance. Non-negotiable.

```tsx
const disclaimers = {
  standard: 'This article is for general informational purposes only and does not constitute legal advice. The information provided may not apply to your specific situation. CasePort is not a law firm and does not provide legal services. Consult a licensed attorney in your jurisdiction for legal counsel.',
  'no-legal-advice': 'This content discusses general industry practices and operational strategy. It does not constitute legal advice. CasePort is not a law firm.',
  platform: 'This content describes CasePort\'s services and platform capabilities. CasePort is not a law firm and does not provide legal representation.',
  none: null,
}

const disclaimerText = disclaimers[article.legalDisclaimer ?? 'standard']

{disclaimerText && (
  <div className="legal-disclaimer">
    <small>{disclaimerText}</small>
  </div>
)}
```

---

### 21. Mid-Article CTA

You already have the fields for this in your CMS.
Make sure the mid-article CTA block renders roughly 60% through the article body
(after the main educational content, before the FAQ section).

```tsx
{article.midArticleCta?.heading && (
  <div className="mid-article-cta">
    <h3>{article.midArticleCta.heading}</h3>
    <p>{article.midArticleCta.body}</p>
    {article.midArticleCta.primaryButtonLabel && (
      <a href={article.midArticleCta.primaryButtonUrl}>
        {article.midArticleCta.primaryButtonLabel}
      </a>
    )}
    {article.midArticleCta.secondaryButtonLabel && (
      <a href={article.midArticleCta.secondaryButtonUrl}>
        {article.midArticleCta.secondaryButtonLabel}
      </a>
    )}
  </div>
)}
```

---

---

## PART 3: SITEMAP — Tell Google every article exists

Add the articles collection to your Next.js sitemap.

```ts
// app/sitemap.ts
export default async function sitemap() {
  const articles = await getPublishedArticles() // your Payload fetch

  return articles.map((article) => ({
    url: `https://caseport.io/insights/${article.slug}`,
    lastModified: article.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.8,
  }))
}
```

---

## PART 4: CSS CLASSES SUMMARY

This is the complete list of CSS classes that must exist and what they're for.
The first three are critical for Speakable schema (voice search).

| CSS Class | Applied To | Why It Exists |
|---|---|---|
| `direct-answer-block` | The Direct Answer box | Voice search + AI extraction + featured snippet |
| `key-takeaways` | The Key Takeaways box | Voice search speakable target |
| `faq-answer` | Each FAQ answer div | Voice search + FAQ schema matching |
| `expert-quote` | Each blockquote | Styling — E-E-A-T signal |
| `key-statistics` | Stats wrapper | Styling — data credibility |
| `stat-item` | Each stat row | Styling |
| `stat-source` | The source attribution | Styling |
| `entity-definitions` | Term definitions section | Styling |
| `article-byline` | Author / date row | Styling |
| `verified-date` | The "Verified" date | Trust signal display |
| `expert-reviewer` | Reviewer credit | E-E-A-T display |
| `related-articles` | Related articles section | Internal link cluster |
| `cite-this` | APA citation box | Citability / backlink bait |
| `legal-disclaimer` | Disclaimer block | ABA compliance |
| `mid-article-cta` | CTA block | Conversion |

---

## PART 5: THE ORDER THINGS APPEAR ON THE PAGE

This order is based on how Google scans, how AI engines extract, and how readers convert.
Do not rearrange it.

```
1. Breadcrumb navigation
2. Article H1
3. Byline (author, date, verified date, read time)
4. Hero Image
5. Direct Answer Block        ← class: direct-answer-block
6. Key Takeaways Box          ← class: key-takeaways
7. Executive Summary (if filled)
8. Article Body (rich text)
   — Key Statistics appear inside or after relevant sections
   — Expert Quotes appear inside the body
   — Mid-Article CTA appears ~60% through the body
9. Entity Definitions / Key Terms
10. FAQ Section               ← each answer: class: faq-answer
11. Related Articles
12. End-of-article CTA
13. APA Citation box (if filled)
14. Expert Reviewer credit
15. Legal Disclaimer
```

---

## PART 6: WHAT NOT TO DO

- Do not lazy-load the JSON-LD scripts. They must be in the initial HTML.
- Do not put the `faq-answer` class on the question — only on the answer.
- Do not skip the canonical tag. Missing canonical = potential duplicate content penalty.
- Do not set `noIndex: true` on any article that's supposed to be public.
- Do not render the Direct Answer inside the rich text body — it has its own separate field and its own separate block.
- Do not skip the legal disclaimer. Even if it feels unnecessary. Even for "light" articles.

---

That's everything. If any field name doesn't match what comes back from the Payload API,
check the field `name` values in the collection files. The names in the code examples
above match exactly what was defined in the CMS patch.

Questions → bring them to the content lead before making assumptions.
