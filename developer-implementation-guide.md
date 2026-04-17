# CASEPORT

## Developer Implementation Guide

**Article System: SEO · AEO · AI Citation · Voice Search · Schema · CTA**
Version 3.0 · Confidential · April 2026

## Scope of this document

This document contains every instruction the developer needs to implement the complete CasePort article system in one session. It covers the Payload CMS collection, the Next.js article page template, JSON-LD structured data, metadata, voice search, call-to-action requirements, the legal disclaimer, the sitemap, and the final verification checklist. Nothing is in a separate file. Read the full document before starting.

---

## 1. Overview

**What we are building**
CasePort publishes articles on caseport.io/insights. These articles serve two purposes: they educate PI law firm partners and injured claimants, and they convert readers into CasePort customers by linking to the appropriate call to action on every single page.

The current article system has strong content but almost no technical optimisation underneath it. Google cannot read the FAQ answers. No structured data exists. The meta title is 29 characters too long. AI engines like ChatGPT and Perplexity cannot extract a clean citation from the pages. This implementation fixes all of that while adding the infrastructure needed for long-term dominance in the PI law vertical.

**Technology stack**

- Payload CMS (v3) — the content management system where articles are written and published
- Next.js (App Router) — the frontend framework that renders the article pages
- MongoDB — the database where all article data is stored
- Vercel — the hosting platform
- TypeScript — all code is TypeScript throughout

**The golden rule**
**Important**
The developer builds everything described in this document exactly once. After that, the content team fills in boxes in Payload CMS and clicks Publish. Every SEO signal, AI citation block, schema markup, meta tag, Open Graph tag, voice search target, call to action, legal disclaimer, and sitemap entry generates automatically from whatever the content team entered. The developer never touches the article system again for routine publishing.

---

## 2. Files to create

The implementation requires five files to be created or updated. Each file is described in full in its own section below.

| File path                         | Action                | What it does                                                                                                       |
| :-------------------------------- | :-------------------- | :----------------------------------------------------------------------------------------------------------------- |
| `/collections/Articles.ts`        | Replace existing file | The Payload CMS collection definition. Contains all 47 fields, all validation rules, all automatic hooks.          |
| `/lib/article-schema.ts`          | Create new file       | The JSON-LD schema generator. Takes Payload article data and produces all structured data automatically.           |
| `/app/insights/[slug]/page.tsx`   | Update existing file  | The Next.js article page. Renders all content in correct order, injects schemas, handles metadata.                 |
| `/components/LegalDisclaimer.tsx` | Create new file       | Renders the correct ABA-compliant disclaimer at the bottom of every article based on the type selected in Payload. |
| `/app/sitemap.ts`                 | Create or update      | Generates the sitemap.xml file that tells Google every published article exists.                                   |

---

## 3. Payload CMS — Articles collection

**What to do**
Take the file named Articles.collection.ts from the shared project files and place it at `/collections/Articles.ts` in the project, overwriting whatever is there now. Then open the Payload configuration file (`payload.config.ts` at the project root) and confirm the Articles collection is registered in the collections array. Restart the Payload server.

**Before you start**
Back up the existing articles data from MongoDB before replacing the collection file. This is a safety step. If anything goes wrong during migration you have a restore point. Also copy the existing `Articles.ts` to `Articles.backup.ts` before overwriting it.

**What the collection contains**
The new collection has 47 fields organised into six tabs plus a sidebar panel. The sidebar panel is always visible regardless of which tab the editor is on.

### Sidebar panel — always visible

These fields sit in the right-hand panel and stay on screen at all times. Three of them fill themselves automatically on every save — the editor does not touch them.

| Field                        | What the content team does / What it does on the live page                                                                                          |
| :--------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Status**                   | Editor selects: Draft, In Review, Published, Scheduled, or Archived. The website only returns articles where status equals Published.               |
| **Published date**           | Editor sets the date. Used in article byline and JSON-LD schema. Also used to automatically calculate the next review date.                         |
| **AEO Score**                | AUTOMATIC. Calculates 0–100 on every save. Measures AI citation readiness. Target 80+. Below 60 means AI engines will not cite the article.         |
| **Read time**                | AUTOMATIC. Counts words in the article body and divides by 200 to get minutes. Shown in byline as "X min read."                                     |
| **Search intent**            | REQUIRED. Editor chooses: Informational, Commercial Investigation, Transactional, or Navigational. Controls which CTA style appears on the article. |
| **Target SERP feature**      | Editor chooses which Google rich result this article is engineered to win. Must match the schema type selected in the Schema tab.                   |
| **Content confidence**       | Editor chooses: High, Medium, or Low. Do not publish Low confidence articles. Lawyers verify every claim.                                           |
| **Hide from search engines** | Checkbox. Only tick for staging previews. Never on live articles. Re-indexing takes weeks to undo.                                                  |
| **Review cycle**             | Editor chooses how often this article must be re-verified: 3 months, 6 months, 12 months, or Evergreen.                                             |
| **Next review due**          | AUTOMATIC. Calculated from published date plus review cycle. Shown in list view so the team can see overdue articles.                               |
| **Last fact-verified**       | Editor enters the date they last checked all data is accurate. Shown near byline as a trust signal.                                                 |

### Content tab

Everything the reader sees on the article page.

| Field                 | What the content team does / What it does on the live page                                                                                                                                       |
| :-------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Article title**     | REQUIRED. The main H1 shown on the page. Must include the focus keyword naturally. 50–80 characters. Also used as fallback if meta title is left blank.                                          |
| **Slug (URL)**        | REQUIRED + AUTOMATIC. Auto-generated from title on first save. Lowercase, hyphens only. Must be reviewed before publishing. Once live, changing this breaks links.                               |
| **Author**            | REQUIRED. Relationship to the Users collection. Powers the author bio at the bottom of the article. Named attribution increases Google trust.                                                    |
| **Content pillar**    | REQUIRED. Which topic cluster: For Law Firms, Auto Accident Cases, Claimant Education, Case Acquisition Strategy, PI Industry Intelligence, Intake Excellence, Lead Economics, Platform Updates. |
| **Content format**    | REQUIRED. Pillar Page, Cluster Article, FAQ Article, How-To Guide, News, Research Report, Case Study, Comparison, or Definition. Determines page template and schema type.                       |
| **Hero image**        | REQUIRED. Upload field linked to media collection. Alt text must be set in the media library after uploading.                                                                                    |
| **Excerpt**           | REQUIRED. 2–3 sentence summary. 50–300 characters. Shown in article cards. Fallback for meta description.                                                                                        |
| **Subtitle**          | Optional. Short punchy line shown under the H1. Like "Your CRM isn't showing you the loss. It's reclassifying it."                                                                               |
| **Executive summary** | Optional. Larger editorial paragraph shown after hero image. Bridges headline and article body.                                                                                                  |
| **Key takeaways**     | REQUIRED. Array of 3–5 bullet points. Each must be specific and data-backed. AI engines extract from this box. Speakable schema target.                                                          |
| **Article body**      | REQUIRED. Rich text editor. H2 for major sections, H3 for sub-sections. Always lead with the most important answer.                                                                              |
| **Tags**              | Optional. 3–8 specific topic tags. Shown as pills on article page. Used to filter insights index.                                                                                                |
| **Related articles**  | REQUIRED. Relationship to other articles. 3–5 selections. Shown as Continue Reading section. Critical for topical authority.                                                                     |

### SEO core tab

| Field                        | What the content team does / What it does on the live page                                                                                                                     |
| :--------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Focus keyword**            | REQUIRED. The single keyword this article targets. Must appear in title, first paragraph, one H2, meta title, meta description, and 3+ times in body. One keyword per article. |
| **Keyword difficulty**       | Optional. Number from Semrush, 0–100. Stored for tracking.                                                                                                                     |
| **Monthly search volume**    | Optional. From Semrush. Tracked over time.                                                                                                                                     |
| **Current ranking position** | Optional. Updated monthly from Search Console. Tracks progress.                                                                                                                |
| **Secondary keywords**       | REQUIRED. 4–12 related phrases from Semrush Related Keywords. Included in JSON-LD keywords field.                                                                              |
| **Meta title**               | REQUIRED. 50–60 characters maximum. The blue link in Google results. Completely separate from article title. Ends with "\| CasePort".                                          |
| **Meta description**         | REQUIRED. 140–160 characters. Formula: pain + CasePort solution + soft CTA with arrow. Must include focus keyword.                                                             |
| **Canonical URL**            | Optional. Leave blank for original articles. Only fill for republished content. System auto-sets it otherwise.                                                                 |
| **Social headline**          | Optional. More human version of the headline for LinkedIn and iMessage previews.                                                                                               |
| **Social description**       | Optional. 1–2 punchy sentences. Falls back to meta description if blank.                                                                                                       |
| **Social share image**       | Optional. 1200x630px branded image for LinkedIn previews. Falls back to hero image.                                                                                            |
| **X card fields**            | Optional. Twitter/X card type, title, description, image. Fall back to social preview fields.                                                                                  |
| **Competing URL**            | REQUIRED. The #1 Google result for this keyword. Writer must read this before writing.                                                                                         |
| **Content gap**              | REQUIRED. 3+ specific things this article covers that the competitor does not. Cannot be blank if competing URL is filled.                                                     |

### AEO and AI citation tab

This tab determines whether AI engines cite CasePort. The AEO score is calculated entirely from these fields.

| Field                   | What the content team does / What it does on the live page                                                                                                                                                                                                                                                       |
| :---------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Direct answer**       | REQUIRED + CRITICAL. 40–80 words. Must start with "According to CasePort," — must mention CasePort by name — must include one specific fact — must make complete sense read in total isolation. AI engines extract this verbatim. Also the featured snippet target. Worth 25 points of the AEO score on its own. |
| **AI citation summary** | REQUIRED. 2–3 sentences for Perplexity, ChatGPT, Google AI Overview. Sentence 1: stat + source. Sentence 2: what CasePort does. Sentence 3: the differentiator.                                                                                                                                                  |
| **Primary AI query**    | REQUIRED. The exact question someone types into ChatGPT or Perplexity. This article must be the best answer to this question on the internet.                                                                                                                                                                    |
| **Key statistics**      | REQUIRED — minimum 2. Specific stats with source name, source URL, and year. Rendered visibly on page. Never hidden. Lawyers verify every one.                                                                                                                                                                   |
| **FAQ section**         | REQUIRED — minimum 4 with full answers. 40–120 words per answer. Standalone answers. CRITICAL: See Section 4 for the exact FAQ rendering requirement.                                                                                                                                                            |
| **Term definitions**    | Optional but high impact. Defines every industry term. Builds semantic authority over time. Mark CasePort proprietary terms separately.                                                                                                                                                                          |
| **Expert quotes**       | Optional but high impact. Named, attributed quotes. Never fabricate. AI engines and journalists favour named sources.                                                                                                                                                                                            |

### Voice search tab

| Field                              | What the content team does / What it does on the live page                                                                                                    |
| :--------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Voice answer**                   | REQUIRED. Under 30 words. Natural spoken answer. Test by reading it aloud. Used in Speakable JSON-LD schema.                                                  |
| **Speakable CSS selectors**        | REQUIRED. Standard set: `h1`, `.direct-answer-block`, `.key-takeaways`, `.faq-answer`. These must match the actual CSS classes on the rendered page elements. |
| **Conversational query variants**  | Optional. 4–8 voice query variants. How someone would ask the question hands-free.                                                                            |
| **Targets specific state or city** | Checkbox. When ticked, a second field appears for adding state and city names.                                                                                |

### Schema tab

| Field                  | What the content team does / What it does on the live page                                                                                                                                                     |
| :--------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Schema type**        | REQUIRED. Article, FAQPage, HowTo, NewsArticle, or LegalScholarlyArticle. Must match Target SERP Feature in sidebar. FAQPage generates expandable FAQ cards in Google.                                         |
| **How-to steps**       | Conditional — only shown when schema type is HowTo. Step name, description, and optional image per step.                                                                                                       |
| **SameAs entity URLs** | REQUIRED. All platforms where CasePort has verified presence: LinkedIn, Crunchbase, Google Business Profile, AngelList, BBB. Fill once, copy to all articles. Used in publisher schema for entity recognition. |
| **Article section**    | Optional. Broad category within Insights. Used in Article schema.                                                                                                                                              |
| **APA citation**       | Optional but smart. Full APA-format citation. Shown in Cite This Article box with copy button. Earns backlinks.                                                                                                |
| **Custom JSON-LD**     | Developer use only. Leave blank unless developer explicitly adds custom schema.                                                                                                                                |

### Authority and compliance tab

| Field                        | What the content team does / What it does on the live page                                                                                         |
| :--------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Legal disclaimer**         | REQUIRED. Standard, No Legal Advice, CasePort Platform, or None. Controls which ABA-compliant text renders at article bottom.                      |
| **ABA compliance verified**  | Checkbox. Tick only after legal review. Required before publishing legal-adjacent content.                                                         |
| **Expert reviewer**          | Optional. Name and credentials of PI attorney who reviewed article. Shown near byline. Strong E-E-A-T signal.                                      |
| **External sources cited**   | REQUIRED. Every external source used. Name, URL, and credibility tier. Lawyers will check.                                                         |
| **Press mentions**           | Optional. Log every press citation. Every week CasePort must be written about somewhere.                                                           |
| **Mid-article CTA override** | Optional. Heading, body text, primary button, and secondary button. If blank, system renders default CTA. See Section 6 for full CTA requirements. |
| **Content update history**   | Log every meaningful update with date, summary, and name. Most recent date used as dateModified in JSON-LD. Shown near byline.                     |

**How the AEO score is calculated**
The score calculates automatically in the `beforeChange` hook every time an article is saved. The editor never does anything to make it update — it updates itself. The breakdown is as follows.

| Field                                                | Points | Condition                                                                                    |
| :--------------------------------------------------- | :----- | :------------------------------------------------------------------------------------------- |
| Direct Answer (40+ characters AND mentions CasePort) | 25 pts | Full points only if both conditions met. 12 points if length met but CasePort not mentioned. |
| AI Citation Summary (80+ characters)                 | 15 pts | Required.                                                                                    |
| FAQ items with answers — 4 or more valid pairs       | 20 pts | 10 pts for 2–3 pairs. 5 pts for 1 pair. Answer must be 40+ characters to count as valid.     |
| Key Statistics with sources — 3 or more              | 15 pts | 10 pts for 2 stats. 5 pts for 1 stat. Source field must be filled to count.                  |
| Voice Answer (10+ characters, under 35 words)        | 10 pts | Required.                                                                                    |
| Entity Definitions — 2 or more entries               | 5 pts  | Optional but adds score.                                                                     |
| Meta Title AND Meta Description both filled          | 5 pts  | Both fields must meet minimum length.                                                        |
| Expert Quote present                                 | 5 pts  | At least one quote with speaker name filled.                                                 |

Publish gates: 80–100 = publish immediately. 60–79 = deadline-critical only. Below 60 = do not publish. AI engines will not cite this article.

---

## 4. The FAQ accordion fix

**Urgent**
This is the single highest-priority item. The FAQ answers already exist on the live site but are invisible to AI crawlers because of how the accordion currently works. This fix unlocks FAQ schema, People Also Ask targeting, and AI citation from content already written. It can be deployed independently of everything else and should go live as soon as possible.

**The problem explained**
The current FAQ accordion uses JavaScript to show and hide answers. When a human clicks a question, JavaScript adds the answer text to the page. That works for readers.
AI engine crawlers — ChatGPT, Perplexity, Google AI Overview, and Googlebot for rich results — do not execute JavaScript. They download the raw HTML and read it as plain text. If the answer text only appears after JavaScript runs, those crawlers see seven unanswered questions. They skip the page entirely for citation purposes.

**The fix**
The answer text must be written into the HTML from the very beginning, before any JavaScript runs. The visual hiding should happen through CSS only — specifically using `max-height: 0` and `overflow: hidden`, then animating to a large max-height value when the reader clicks.
This way: the text is always in the raw HTML. Crawlers can read it. Readers still get the accordion experience. Nothing visible changes for the end user.

**What never to do**

- Never use `display: none` to hide FAQ answers. This removes the element from the DOM and crawlers cannot see it.
- Never render the answer text conditionally in JavaScript — only adding it to the DOM after a click event.
- Never rely on JavaScript-only rendering for any content that must be read by AI crawlers or Google. This includes FAQ answers, Direct Answer blocks, Key Takeaways, and statistics.

**How to verify the fix worked**
Right-click anywhere on the live article page and select View Page Source (not Inspect — the actual page source). Use Ctrl+F to search for text from one of the FAQ answers. If the answer text appears in the raw source code before any JavaScript, the fix is working. AI crawlers will now read those answers.
Additionally, go to search.google.com/test/rich-results, paste the article URL, and run the test. After deploying the fix and the JSON-LD schema from Section 5, this should show FAQPage detected with all question and answer pairs listed.

---

## 5. The JSON-LD schema generator

**What this file does**
This is a utility function that sits at `/lib/article-schema.ts`. It takes the article data object from Payload and automatically produces all the structured data needed for rich results and AI citation. It runs server-side every time an article page is requested.
The content team never touches this file. The developer writes it once. It runs on every article automatically forever.

**What schemas it generates**
The function produces up to five separate JSON-LD schema blocks per article, depending on what the content team filled in Payload.

1. **Article schema — always generated**
   Every article gets this regardless of content. It tells Google: what type of content this is (Article, NewsArticle, etc.), the headline, the description, when it was published and last modified, who wrote it, who published it (CasePort), the image, and critically — the SameAs URLs from Payload that link CasePort to its LinkedIn, Crunchbase, Google Business Profile, and other verified platform presences.
   The SameAs field is how AI knowledge graphs learn to recognise CasePort as a known, citable entity — not just a website. Every article that includes these URLs reinforces that recognition.

2. **FAQPage schema — generated when FAQ items exist with answers**
   Only generates if the article has at least one FAQ item where both the question field and the answer field have content. The answer must be at least 20 characters to count.
   This is what creates the expandable Q and A cards that appear directly in Google search results. Without this schema, those cards never appear regardless of how the FAQ section looks on the page.
   DEPENDENCY: The FAQ answers must be in the raw HTML of the page at load time (see Section 4). If answers are hidden by JavaScript, this schema will be present in the page head but Google will reject it because the matching content is not visible in the HTML.

3. **HowTo schema — generated when schema type is set to HowTo**
   Only generates when the content team sets the schema type to HowTo in the Schema tab and fills in at least one step.
   Creates visual numbered step cards in Google search results. Each step has a position number, a name, and a description. An image can optionally be added per step.

4. **Speakable schema — generated when speakable selectors are filled**
   Only generates when the content team has added at least one selector in the Voice Search tab.
   This tells Google Assistant exactly which parts of the page to read aloud when someone asks a related question by voice. The standard selectors are `h1`, `.direct-answer-block`, `.key-takeaways`, and `.faq-answer`.
   DEPENDENCY: These exact CSS class names must be applied to the correct HTML elements on the article page. If the classes do not exist on the page, this schema points to elements that do not exist and voice search optimisation silently fails.

5. **BreadcrumbList schema — always generated**
   Every article gets this. It creates three breadcrumb levels: Home → Insights → Article Title.
   Controls the breadcrumb display shown underneath the blue link in Google search results. Also helps Google understand the site hierarchy.

**Injection into the page**
The schema generator returns an array of plain JavaScript objects. In the Next.js article page component, loop through that array and render each one as a script tag with type set to `application/ld+json`. These script tags go at the very top of the component return — before the breadcrumb, before the H1, before everything the reader sees.
**Critical**
The schema script tags must be rendered server-side in the initial HTML. Do not render them inside useEffect or any client-side React hook. AI engine crawlers and Googlebot do not wait for JavaScript to execute. If the schemas are injected client-side, crawlers never see them.

---

## 6. The Next.js article page

**File location**
The article page lives at `/app/insights/[slug]/page.tsx`. The square brackets in the folder name tell Next.js this is a dynamic route — it handles any URL that matches the pattern caseport.io/insights/any-article-slug-here.

**Data fetching**
The page needs a function that fetches article data from the Payload API given the slug from the URL. This function queries Payload for an article where the slug matches and the status equals published. If no match is found, it calls Next.js's built-in notFound() function to return a proper 404 page.
Set the depth parameter in the Payload query to 2. This instructs Payload to expand all relationship fields — so instead of returning just an author ID number, it returns the full author object including their name and bio.
Use Next.js's built-in fetch caching. Set revalidate to 3600 seconds (one hour). The page serves cached content for up to an hour before checking Payload for updates. This keeps the site fast without rebuilding on every draft save.

**The generateMetadata function**
This is a special Next.js function that runs server-side and automatically populates the page head with all required meta tags. It must be exported from the same file as the page component. It should set the following, all sourced from the Payload article data.

| Meta tag                  | Source from Payload                                                                                                        |
| :------------------------ | :------------------------------------------------------------------------------------------------------------------------- |
| `title`                   | Use meta title field. If blank, fall back to article title.                                                                |
| `description`             | Use meta description field. If blank, fall back to excerpt.                                                                |
| `robots`                  | If the noIndex checkbox is ticked in Payload, output "noindex,nofollow". Otherwise output "index,follow".                  |
| `alternates.canonical`    | Use canonical URL field if filled. Otherwise construct automatically: https://caseport.io/insights/ plus the article slug. |
| `openGraph.title`         | Use social headline field. Fall back to meta title. Fall back to article title.                                            |
| `openGraph.description`   | Use social description field. Fall back to meta description. Fall back to excerpt.                                         |
| `openGraph.images`        | Use social share image URL. Fall back to hero image URL.                                                                   |
| `openGraph.type`          | Always set to "article".                                                                                                   |
| `openGraph.publishedTime` | Use published date field.                                                                                                  |
| `openGraph.modifiedTime`  | Use most recent entry from content update log. Fall back to last verified date. Fall back to Payload updatedAt timestamp.  |
| `twitter.card`            | Use X card type field. Default to "summary_large_image".                                                                   |
| `twitter.title`           | Use X card title field. Fall back to social headline. Fall back to meta title.                                             |
| `twitter.description`     | Use X card description field. Fall back to social description. Fall back to meta description.                              |
| `twitter.images`          | Use X card image URL. Fall back to social share image. Fall back to hero image.                                            |

**Page element order**
The order elements appear in the HTML matters both for how AI engines scan the page and for conversion. Build them in exactly this sequence.

1. **JSON-LD schema scripts** Before everything. Invisible to readers. See Section 5.
2. **Breadcrumb navigation** Home / Insights / Article Title. Standard nav element with aria-label="Breadcrumb".
3. **Category badge** Shows the content pillar value. Small styled pill.
4. **H1 headline** The article title. Standard h1 tag. Speakable schema target by default.
5. **Subtitle** Short punchy subheadline under H1. Only render if the subtitle field is filled.
6. **Byline row** Author name, published date, read time, last verified date, expert reviewer name. All in one row. Only show elements that have data.
7. **Hero image** Full width. Alt text from media library. Width and height attributes set from Payload media data.
8. **Direct Answer block** CRITICAL. CSS class `direct-answer-block` is mandatory. Styled as visually distinct highlighted box. Never inside an accordion. Always render if the field is filled.
9. **Key Takeaways box** CSS class `key-takeaways` is mandatory. Always visible. Never inside an accordion. Render as a styled box with a bulleted list inside.
10. **Executive summary** Shown if filled. Plain paragraph.
11. **Article body** Rendered using the Payload rich text renderer package.
12. **Key statistics** Rendered visibly on the page with source attribution. Each stat shows the stat text and the source name as a link if a URL was provided.
13. **Mid-article CTA block** See Section 7 for the full CTA implementation requirements. Position here — after the main body content and before the FAQ section.
14. **FAQ section** CSS class `faq-answer` on every answer div. See Section 4 for the accordion implementation requirement.
15. **Expert quotes** Rendered as styled blockquotes with cite attribution.
16. **Term definitions** Rendered as a glossary section with a definition list. Only show if entries exist.
17. **External sources** Rendered as a numbered sources list with links. Only show if entries exist.
18. **APA citation box** Shown with a copy-to-clipboard button if the citation field is filled.
19. **Related articles** Shown as Continue Reading card grid if related articles are selected.
20. **Legal disclaimer** Always rendered. See Section 8 for the disclaimer component.

**Mandatory CSS classes**
Three CSS classes are mandatory because they are the targets for the Speakable schema. Without these exact class names applied to the correct elements, voice search optimisation does not work regardless of what the content team fills in Payload.
Three mandatory classes — do not rename these:

- `direct-answer-block` — applied to the div element wrapping the Direct Answer text. Style this as a visually prominent highlighted box with a distinct background colour and left border accent. This is the most important element on the page.
- `key-takeaways` — applied to the div element wrapping the Key Takeaways section.
- `faq-answer` — applied to each individual answer div in the FAQ section. Applied to the answer only — not the question element and not the wrapper div containing both.

All other CSS classes (article-byline, verified-date, hero-image, executive-summary, article-body, key-statistics, mid-article-cta, faq-section, faq-question, expert-quote, entity-definitions, sources-list, cite-this, related-articles, legal-disclaimer, category-badge) are for styling purposes only. They do not affect schema or search ranking. Name and style them however the design requires.

---

## 7. Call to action — every article must convert

**Non-negotiable requirement**
Every single article on caseport.io/insights must contain at least two conversion points that link readers back to CasePort's primary actions. There are no exceptions. Content without a conversion path is a cost, not an asset.

**The two CTA positions**
**Position 1: Mid-article CTA**
This appears approximately 60% through the article — after the main educational content has been delivered and the reader understands the problem, but before the FAQ section. This is the moment of maximum engagement and the highest-converting position on the page.
The mid-article CTA block contains a heading, a short body paragraph, a primary button, and an optional secondary button. Style it as a visually distinct section that breaks from the article prose — different background, clear button, not buried.

**Position 2: End-of-article CTA**
This appears after the related articles section and before the legal disclaimer. It serves readers who consumed the full article and are now ready to act. It should be stronger in tone than the mid-article CTA.
For the end-of-article position, always show a CTA regardless of what the content team fills in. This one is never optional.

**The CTA logic**
The mid-article CTA works as follows. If the content team filled the Mid-Article CTA Override group in the Authority and Compliance tab, use exactly what they entered — their heading, body, and button labels. If that group is blank (which it will be for most articles), render a default CTA.
The default CTA is determined by two fields: Search Intent from the sidebar and Content Pillar from the Content tab. Use the following logic to select the correct default.

| Search intent            | Content pillar                                                                          | Default CTA heading                                                        | Default button label + URL                    |
| :----------------------- | :-------------------------------------------------------------------------------------- | :------------------------------------------------------------------------- | :-------------------------------------------- |
| Informational            | For Law Firms / Case Acquisition / Intake Excellence / Lead Economics / PI Intelligence | See how CasePort eliminates the guesswork                                  | Explore the Platform → `/request-access`      |
| Commercial Investigation | Any law firm pillar                                                                     | Find out if your market is still available                                 | Check Market Availability → `/markets`        |
| Transactional            | Any law firm pillar                                                                     | Ready to access qualified cases in your market?                            | Apply for Market Access → `/request-access`   |
| Any intent               | Claimant Education                                                                      | Were you injured in an accident? Get matched with a qualified PI attorney. | Start Your Free Case Review → `/injured`      |
| Any intent               | Platform Updates                                                                        | Want to know when new features launch?                                     | Join the Intelligence Brief → `/intelligence` |

**End-of-article CTA**
The end-of-article CTA is always rendered for articles targeting law firm audiences. It is never conditional. It appears after the Related Articles section. Use the following defaults.
**Default end-of-article CTA — law firm articles**

- Heading: "Stop losing cases to slow intake. Start winning them."
- Body text: "CasePort delivers pre-qualified auto accident case opportunities to approved PI firms in real time — with medical verification complete before delivery. Your market may still be available."
- Primary button: "Apply for Market Access →" linking to `/request-access`
- Secondary button: "See how it works" linking to the homepage or a demo page

**Default end-of-article CTA — claimant education articles**

- Heading: "Injured in an accident? You deserve qualified legal help."
- Body text: "CasePort connects accident victims with vetted personal injury attorneys who specialise in cases like yours. Free. No obligation."
- Primary button: "Start Your Free Case Review →" linking to `/injured`

**CTA styling requirements**
The CTA blocks must be visually unmissable. They must not look like body text. Apply a distinct background, a clear button with hover state, and sufficient padding. The primary button should be the most visually prominent interactive element on the page after the article headline.
Do not make the CTA feel pushy or interruptive. The language should always match the educational tone of the article. The mid-article CTA in particular should feel like a natural next step, not an advertisement.
All CTA buttons must be real anchor tags linking to the correct internal URLs. Not JavaScript onClick handlers. Real href links. This ensures they work in email forwards, social shares, and are crawlable by search engines.

---

## 8. Legal disclaimer component

Create a small reusable component at `/components/LegalDisclaimer.tsx`. This component takes one prop — the disclaimer type string from Payload — and renders the appropriate disclaimer text at the bottom of every article.
The four disclaimer types and their text
Map each type exactly as follows. Do not paraphrase. ABA compliance language must be precise.

**Standard** — for general educational content about PI law
This article is for general informational purposes only and does not constitute legal advice. The information provided may not apply to your specific situation. CasePort is not a law firm and does not provide legal services. Consult a licensed attorney in your jurisdiction for legal counsel.

**No Legal Advice** — for operational or strategy content
This content discusses general industry practices and operational strategy. It does not constitute legal advice. CasePort is not a law firm and does not provide legal representation or legal services of any kind.

**CasePort Platform** — for articles about CasePort services only
This content describes CasePort's platform capabilities and service offerings. CasePort is not a law firm and does not provide legal representation. Case acquisition outcomes vary based on market, practice area, and firm response standards.

**None** — only for content with zero legal subject matter
When the type is None, the component renders nothing. An empty return. No element is added to the DOM.

**Placement**
The legal disclaimer is always the last content element on the page, after the related articles section and after the end-of-article CTA. It appears on every published article without exception. The only variation is which text renders based on the type selected in Payload.

---

## 9. Sitemap

Create a file at `/app/sitemap.ts`. Next.js automatically serves the output of this file at caseport.io/sitemap.xml. This file tells Google every published article exists and when it was last updated.
What the sitemap should include
The sitemap function queries the Payload API for all articles where status equals published, with a limit of 1000. For each article, output four properties.

| Property          | How to populate it                                                                                                                                                                  |
| :---------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `url`             | Full URL: https://caseport.io/insights/ followed by the article slug.                                                                                                               |
| `lastModified`    | The most recent date from the content update log if available. Otherwise the updatedAt timestamp from Payload. This is the date Google uses to decide whether to re-crawl the page. |
| `changeFrequency` | Set to "monthly" for all articles. PI content does not change daily.                                                                                                                |
| `priority`        | Set to 0.8 for all articles. This tells Google articles are important but not as critical as the homepage (which gets 1.0).                                                         |

**After deployment**
After deploying the sitemap file, submit the sitemap URL to Google Search Console by going to the Sitemaps section in Search Console and entering caseport.io/sitemap.xml. Google will begin discovering and crawling all published articles.
For existing articles that need to be updated — particularly the lead decay article once the FAQ fix and new schema are deployed — go to the URL Inspection tool in Search Console, paste in the article URL, and click Request Indexing. This tells Google to re-crawl that specific page immediately rather than waiting for its regular crawl schedule.

---

## 10. Verification checklist

Go through every item on this list before signing off. Each item requires live confirmation on the deployed site — not just code inspection.

**Payload CMS**

- Open a new article in Payload admin. Confirm six tabs are visible: Content, SEO Core, AEO and AI Citation, Voice Search, Schema, and Authority and Compliance.
- Save the new article with no fields filled. Confirm the AEO Score shows 0 in the sidebar.
- Fill in the Direct Answer field with a 50-word answer that mentions CasePort. Save. Confirm the AEO Score increases to 25.
- Fill in all required fields on a test article. Save. Confirm the AEO Score reaches 80 or above.
- Confirm the Read Time field updates automatically when body content is added.
- Confirm the Next Review Due date auto-populates after setting a Published Date and Review Cycle.
- Confirm that publishing an article with the Hide from Search Engines checkbox ticked results in a noindex meta tag in the page source.

**Article page**

- Open any published article. Right-click and select View Page Source. Search for text from one of the FAQ answers. It must appear in the raw source before any JavaScript.
- Confirm the Direct Answer block renders visibly on the page with a distinct visual style different from body text.
- Confirm the Key Takeaways box renders visibly and is not inside an accordion.
- Use browser DevTools to inspect the FAQ answer divs. Confirm each has the CSS class `faq-answer`.
- Confirm the Direct Answer block has the CSS class `direct-answer-block`.
- Confirm the Key Takeaways box has the CSS class `key-takeaways`.
- Open the FAQ accordion. Confirm it opens and closes correctly. Confirm the animation is smooth.
- Confirm the mid-article CTA block renders approximately 60% through the article.
- Confirm the end-of-article CTA renders after the Related Articles section.
- Confirm all CTA buttons are real anchor tags with correct href attributes.
- Confirm the legal disclaimer text renders at the very bottom of every article.
- Confirm the author bio renders at the bottom when an author is assigned in Payload.
- Confirm the last verified date shows near the byline when filled in Payload.

**Metadata and schema**

- Go to search.google.com/test/rich-results. Paste the lead decay article URL. Run the test. Confirm FAQPage is detected with no errors and all answer pairs are listed.
- Confirm Article is detected in the rich results test.
- Confirm BreadcrumbList is detected in the rich results test.
- View page source on a published article. Search for application/ld+json. Confirm at least three separate script tags with that type exist.
- Go to opengraph.xyz. Paste the article URL. Confirm the social share preview shows the correct title (meta title, not article title), description, and image.
- Confirm the meta title in View Page Source is between 50 and 60 characters.
- Confirm the meta description in View Page Source is between 140 and 160 characters.
- Confirm the canonical URL in View Page Source matches caseport.io/insights/ plus the article slug.
- Confirm pages with the noIndex checkbox ticked have the robots meta tag set to noindex,nofollow.

**Sitemap and indexing**

- Go to caseport.io/sitemap.xml in a browser. Confirm the sitemap loads and contains article URLs.
- Confirm the sitemap has been submitted in Google Search Console.
- Request re-indexing of the lead decay article in the URL Inspection tool in Search Console.

---

## 11. Important notes for ongoing use

**What happens when a new article is published**
The content team fills in the 47 fields in Payload and clicks Publish. Immediately and automatically: the AEO score updates, the read time calculates, the next review date sets, the article appears on caseport.io/insights at its slug URL, the page head populates with all meta tags, all JSON-LD schemas inject into the page, the sitemap regenerates to include the new article, and both CTA positions render with the correct copy based on the search intent and content pillar.
The developer does nothing. The content team does nothing except fill the Payload fields and publish.

**JSON-LD is unique per article and automatic**
Each article gets its own completely unique JSON-LD that reflects its specific data — its own title, its own FAQ pairs, its own author, its own published date, its own slug URL. The developer writes the generator function once. After that it runs for every article automatically.

**The SameAs URLs**
The SameAs entity URLs in the Schema tab need to be filled on the first article published. After that, copy the same set of URLs to every subsequent article. This is a one-time setup task that builds CasePort's entity recognition in AI knowledge graphs. LinkedIn, Crunchbase, Google Business Profile, AngelList, and any legal directory listings where CasePort has a verified presence.

**Content update freshness**
Every time a meaningful change is made to an existing article, an entry must be added to the Content Update History array in the Authority and Compliance tab. The most recent update date in that log is used as the dateModified field in the Article JSON-LD schema. This signals content freshness to Google and keeps rankings stable over time.

**The AEO score and the publish gate**
The AEO score is for internal guidance, not for readers. Readers never see it. It exists solely to help the content team know whether an article is ready to be cited by AI engines. The content team should treat 80 as the minimum acceptable score before clicking Publish. The developer does not need to enforce this technically — it is an editorial standard.

---

## 12. robots.txt

**What it is**
`robots.txt` is a plain text file served at caseport.io/robots.txt. Every search engine crawler and AI crawler checks this file before doing anything else on the site. It tells them which pages they are allowed to crawl and which they are not.
It is not a security tool — a malicious bot ignores it entirely. But every legitimate crawler from Google, Bing, Perplexity, OpenAI, Anthropic, Apple, and LinkedIn follows it precisely. Think of it as a set of traffic rules that all the legitimate visitors on your site agree to obey.

**Why CasePort needs one urgently**
Check this today
Go to caseport.io/robots.txt right now. If you see a 404 or a blank page, there is no robots.txt file. Every crawler is currently making its own decisions about what to crawl — including Payload admin routes, API endpoints, and Next.js internal paths that should never be indexed.
Without robots.txt, Google wastes crawl budget on admin and API routes instead of article pages. Google's crawl budget is finite. Every admin page crawled is one fewer article page indexed.

**What to block**
The following paths must be blocked from all crawlers. These are Payload CMS admin pages, Payload API endpoints, Next.js internal routes, and any routes that should never appear in search results.

- `/admin`
- `/api`
- `/_next`
- `/static`
- `/cdn-cgi`
- `*.json$`
- `/preview`
- `/draft`

**What to allow — and specifically which AI crawlers**
Allow all legitimate crawlers access to the public-facing site. The following AI and search crawler bot names should be explicitly listed as allowed so there is no ambiguity about CasePort's intention to be indexed and cited.

| Bot name      | Who it belongs to | Why it matters                                 |
| :------------ | :---------------- | :--------------------------------------------- |
| Googlebot     | Google            | Google Search, Google AI Overview, Google News |
| Bingbot       | Microsoft         | Bing Search, Microsoft Copilot                 |
| GPTBot        | OpenAI            | ChatGPT training and browsing citations        |
| Claude-Web    | Anthropic         | Claude AI citation and browsing                |
| PerplexityBot | Perplexity        | Perplexity AI answer citations                 |
| Applebot      | Apple             | Siri, Spotlight, Safari suggestions            |
| LinkedInBot   | LinkedIn          | LinkedIn link preview cards                    |
| Twitterbot    | X/Twitter         | X card previews when articles are shared       |
| DuckDuckBot   | DuckDuckGo        | DuckDuckGo search results                      |
| Slurp         | Yahoo             | Yahoo Search                                   |
| Baiduspider   | Baidu             | Baidu Search — relevant if any Asian PI market |

**Where the file lives in Next.js**
In the Next.js App Router, create a file at `/app/robots.ts`. This is not a plain text file — it is a TypeScript function that Next.js automatically converts to the correctly formatted robots.txt and serves it at the right URL. The function exports a metadata object with an array of rules.
The function should define one universal rule for all crawlers that blocks the paths listed above, then a separate allow-all rule that permits crawling of everything else. Point every crawler to the sitemap by including the sitemap URL in the function output.

**Verification**
After deploying this file, go to caseport.io/robots.txt in a browser and confirm the file loads correctly. Then go to Google Search Console, navigate to Settings, and use the robots.txt tester to confirm Google can read it and that the rules are applying as expected.

---

## 13. llms.txt — the AI crawler file

**What it is**
`llms.txt` is an emerging standard — a plain text file served at caseport.io/llms.txt. It is specifically written for large language model crawlers to read. Think of it as a human-readable brief that tells AI engines: what this site is, what it does, which pages carry the most authority, and how to use the content responsibly.
It is not yet universal. That is exactly why implementing it now matters. CasePort will be one of the first PI case acquisition companies to have one. Early adopters get compounding citation advantage as AI engines increasingly weight sites that make themselves easy to understand and cite.

**Who reads it**
Anthropic, Perplexity, and several other AI companies have either adopted the standard or are moving toward it. OpenAI has their own variant. The core idea is consistent across all of them: give AI crawlers a structured, plain-language summary of your site so they can cite you accurately and confidently.

**Why acting early matters**
This is roughly analogous to what schema.org did for structured data in 2011. Most sites ignored it for years. The ones that adopted it early dominated rich results for a decade. llms.txt is in the same early-adopter window right now.

**What CasePort's llms.txt should say**
The file is written in plain English — not code. It should contain the following sections in this order.

**1. What CasePort is**
A plain one-paragraph description of CasePort written specifically for an AI to read. Include: what the company does, who it serves (PI law firms and injured claimants), what makes it different (pre-qualification, exclusive routing, real-time delivery, medical verification), and what the primary call to action is.
Write it as if you are briefing an AI assistant who has never heard of CasePort and needs to explain it to a PI attorney who just asked about case acquisition options.

**2. The most authoritative pages**
A list of the most important pages on the site with a one-line description of each. Include the homepage, the For Law Firms page, the Markets page, the Injured page, and the five or six highest-value Insights articles.
Format: the full URL on one line, then a one-line plain English description of what that page covers. No markdown. No headers. Just clean plain text.

**3. Content usage guidance**
A short paragraph telling AI engines how CasePort's content may be used. Something like: CasePort publishes original research and analysis on personal injury case acquisition, lead economics, and PI law firm intake operations. This content may be cited with attribution. CasePort is the primary source for data on PI lead response time, lead decay, and case acquisition qualification standards.
This is where you stake your claim as the authoritative source on specific topics. AI engines use these self-declarations as a citation priority signal.

**4. What CasePort does not want cited**
A short note about any content that should not be used as a citation source — for example, draft articles, the admin section, pricing pages that change frequently, or any content that is time-sensitive.
Keep this short. One or two sentences. The point is to help AI engines understand which content is stable and authoritative versus which content is operational and subject to change.

**Where the file lives in Next.js**
Create a static file at `/public/llms.txt`. Next.js automatically serves any file in the `/public` directory at its root URL. The file will be accessible at caseport.io/llms.txt immediately after deployment with no additional configuration.
Update this file every time a major new Insights article is published that should be on the authoritative pages list. This is a content team task, not a developer task, once the file is created.

**Connect it to robots.txt**
Also add a reference to llms.txt inside the robots.txt file so AI crawlers find it immediately without having to guess. Add a line that reads: `# AI model training and citation guidance: https://caseport.io/llms.txt`

---

## 14. Auto-generated Open Graph images

**The problem this solves**
Right now when any CasePort article is shared on LinkedIn, Facebook, iMessage, or X, the preview image is whatever was uploaded as the hero image — cropped to 1200 by 630 pixels. Hero images are designed for the top of an article, not for a social share card. The result is a generic, inconsistently branded preview that does not identify CasePort.
A PI law firm partner sharing a CasePort article on LinkedIn is giving CasePort free advertising to their entire professional network. That share preview is the first impression CasePort makes on every attorney who sees it in their feed. It should be unmistakably CasePort — the logo, the article headline, a clean branded layout. Every time. Automatically.

**What Vercel OG is**
Vercel provides a package called `@vercel/og` that generates custom images on demand as PNG files. When LinkedIn fetches the Open Graph image for a URL, instead of getting a static uploaded file, it hits a Next.js API endpoint that generates a perfectly branded image in real time using the article title, category, and author name from Payload. The image is generated once and cached. No content team action required.

**What every auto-generated image should contain**
The branded template for every article share image should include the following elements, all rendered automatically from Payload data.

- CasePort logo — top left, white version on dark background
- Article category badge — the content pillar, styled as a small coloured pill
- Article headline — large, white, bold — the meta title field from Payload, not the article title
- Author name — smaller, below the headline
- A consistent CasePort branded background — navy with a subtle geometric pattern or gradient that matches the brand
- The URL — caseport.io/insights — small, bottom right

**Where the API endpoint lives**
Create a new file at `/app/og/route.tsx`. This is a Next.js API route that accepts a slug as a query parameter, fetches the article data from Payload, and returns a dynamically generated PNG image using the `@vercel/og` package.
The Open Graph image URL for each article will be: `https://caseport.io/og?slug=article-slug-here`. This URL goes into the generateMetadata function in the article page file — in the openGraph.images array.

**Connecting it to the article metadata**
In the generateMetadata function in the article page (Section 6 of this document), update the openGraph.images field. Instead of pointing to the static social share image from Payload, point to the OG endpoint URL with the article slug passed as a query parameter. Keep the Payload social share image as a fallback for cases where a custom image has been manually uploaded — if the field is filled in Payload, use that. If it is blank, use the auto-generated OG endpoint.

**Installation note**
Install `@vercel/og` as a dependency: `npm install @vercel/og`. This package is built specifically for Vercel's edge runtime and generates images extremely fast — typically under 100 milliseconds. It uses a subset of CSS (flexbox only) for layout. The developer will need to load the CasePort font as a buffer from the `/public` directory to match the brand typography.

---

## 15. Author profile pages

**Why this matters more than most teams realise**
Google's E-E-A-T framework — Experience, Expertise, Authoritativeness, Trustworthiness — is a core ranking signal. Content written by anonymous "editorial teams" consistently ranks lower than content written by named, verifiable, credentialed individuals with their own indexable web presence. A lawyer deciding whether to trust CasePort will look up the author. If there is nothing to find, trust decreases.
A dedicated author page at `/authors/martha-kechicha` that is fully indexed, links to her LinkedIn and professional affiliations, shows all her published articles, and displays her credentials — that page itself becomes an E-E-A-T signal that lifts every article she has ever written.

**Payload Users collection — fields to add**
The existing Users collection already powers the Author field on articles. Add the following new fields to the Users collection. These extend the author profile without changing any existing functionality.

| Field name                | What it does                                                                                                                                              |
| :------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Photo**                 | Upload field linked to media collection. Used in byline and author page. Recommended size: 400x400px square.                                              |
| **Job title**             | Text field. Example: Senior Analyst, CasePort Editorial. Shown under name in author page header.                                                          |
| **Short bio**             | Textarea. 2–3 sentences. Used in the author bio box at the bottom of every article.                                                                       |
| **Full bio**              | Rich text. 2–4 paragraphs. Used on the dedicated author profile page only. Can include career history, publications, areas of expertise.                  |
| **LinkedIn URL**          | Text field. Full LinkedIn profile URL. Shown as a link on the author page. Also used in the Person schema for that author.                                |
| **Bar number**            | Text field. Optional. Only for authors who are licensed attorneys. Example: Texas Bar #12345678. Strong E-E-A-T signal.                                   |
| **Credentials**           | Array of text entries. List professional credentials and affiliations. Example: ABA Member, Texas Trial Lawyers Association, Martindale-Hubbell AV Rated. |
| **Areas of expertise**    | Array of text entries. Topics this author covers. Example: PI law firm intake operations, lead economics, auto accident case qualification.               |
| **External publications** | Array with title and URL. Lists articles or research this author has published elsewhere. Backlink credibility signal.                                    |
| **Author slug**           | Text field. Auto-generated from name. Used to build the author page URL: `/authors/martha-kechicha`.                                                      |
| **Is public**             | Checkbox. Controls whether this author has a public-facing author page. Some users may be admin-only and should not have a public page.                   |

**The author page template**
Create a new Next.js page at `/app/authors/[slug]/page.tsx`. This follows the same dynamic route pattern as the article page. It fetches the user from Payload by their author slug and renders the full author profile.
The author page should contain the following elements in order.

- Author photo — large, circular crop
- Author name — large H1
- Job title and organisation
- Credentials listed as badges or a styled list
- Areas of expertise as tags
- Full bio in rich text
- LinkedIn link and any other professional links
- External publications list with links
- All articles by this author — fetched from the articles collection filtered by author relationship — shown as article cards

**Author JSON-LD schema**
The author page needs its own JSON-LD schema. Use the Person type from schema.org. Include the author name, job title, organisation (CasePort), LinkedIn URL in the sameAs field, areas of expertise in the knowsAbout field, and links to their published articles in the workExample field.
The article page JSON-LD (Section 5) already includes a basic author object. Update it to also include the author's LinkedIn URL in the author sameAs field once that field is added to the Users collection. This strengthens the E-E-A-T signal by connecting the article attribution to a verifiable external identity.

**Author page in the sitemap**
Update the sitemap function (Section 9) to also include all author pages where the Is Public checkbox is ticked. Use `/authors/` as the URL prefix. Set priority to 0.6 — lower than articles but still indexed.

---

## 16. Google News sitemap

**What it is and why it exists separately**
Google operates two completely separate discovery systems for content. The standard sitemap covers all pages and is used for general web indexing. The Google News sitemap covers only news and timely content and is used specifically for Top Stories — the news carousel that appears at the very top of Google results for relevant queries.
These are two different formats with two different submission processes. Having only a standard sitemap means CasePort's news articles and press coverage pieces can never appear in Top Stories, regardless of how good the content is. Top Stories is one of the highest-visibility placements in all of Google Search.

**Which articles qualify**
Google News only indexes articles published within the last 30 days that cover news or timely topics. In CasePort's article system, the articles that qualify are those where the Content Format field in Payload is set to News or Announcement. All other content formats (Pillar Page, Cluster Article, FAQ Article, etc.) belong only in the standard sitemap.

**Where it lives and how to build it**
Create a separate file at `/app/news-sitemap.xml/route.ts`. This is a Next.js API route that returns a properly formatted XML response. Unlike the standard sitemap which uses Next.js's built-in sitemap format, the Google News sitemap requires a custom XML format with specific Google News namespace elements.
The news sitemap function should query Payload for all articles where: status equals published, contentFormat equals "news", and publishedDate is within the last 30 days. For each article, the sitemap entry must include the full URL, the publication name (CasePort), the publication language (en), the article title, and the exact publication date and time in ISO 8601 format.

**No new Payload fields needed**
Google News has strict quality requirements. Articles must have a clear publication date, a human-readable headline, and be written in a news style. CasePort's existing Meta Title field serves as the news title. The Published Date field serves as the publication timestamp. No additional Payload fields are needed — the existing data is sufficient.

**Submitting to Google News**
After deploying the news sitemap, go to Google Search Console. Navigate to Sitemaps and submit the news sitemap URL: caseport.io/news-sitemap.xml. Google News has a separate review process — it typically takes 24–48 hours for new publishers to be approved. Once approved, eligible articles begin appearing in Top Stories.
To be approved, the site must have: a clear publication name (CasePort), a publicly accessible news sitemap, articles published on a consistent schedule, and content that meets Google News quality guidelines. CasePort's existing content quality easily meets these standards.

---

## 17. Payload content intelligence dashboard

**What it is**
Payload v3 allows custom admin views — completely custom pages inside the Payload admin panel. This section describes a single custom admin page that gives the content team a bird's-eye view of the entire article portfolio: which articles are healthy, which have critical gaps, which are overdue for a review, and which are dragging the overall AEO performance down.
Without this, a content manager has to open 50 articles individually to find the ones with scores below 60. With it, every gap is visible in one table in under 10 seconds. This is the difference between managing content reactively and running a content operation proactively.

**What the dashboard displays**
The dashboard is a single page accessible from the Payload admin sidebar under a label like "Content Intelligence." It displays a table of all published articles with the following columns.

| Column                      | Data source                | How it is displayed                                                                         |
| :-------------------------- | :------------------------- | :------------------------------------------------------------------------------------------ |
| **Article title**           | title field                | Clickable link that opens the article in Payload editor                                     |
| **AEO Score**               | aeoScore field             | Number with colour coding: green 80+, amber 60–79, red below 60                             |
| **Status**                  | status field               | Coloured pill badge                                                                         |
| **Missing critical fields** | Computed from field values | Red warning icons for: no Direct Answer, no FAQ answers, no meta description, no meta title |
| **Review due**              | nextReviewDate field       | Date shown in red if past due, amber if within 30 days, green otherwise                     |
| **Last verified**           | lastVerifiedDate field     | Date shown in red if more than 6 months ago                                                 |
| **Content pillar**          | contentPillar field        | Plain text                                                                                  |
| **Published date**          | publishedDate field        | Plain text                                                                                  |

**Summary metrics at the top**
Above the table, show four summary metric cards that give an instant health snapshot of the entire content operation.

- Total published articles
- Average AEO score across all published articles
- Number of articles below 60 AEO score (shown in red if greater than zero)
- Number of articles overdue for review (shown in red if greater than zero)

**Filtering and sorting**
The table should support filtering by content pillar and sorting by any column. The most useful default sort is AEO score ascending — lowest scores at the top — so the content team immediately sees what needs attention without having to search for it.

**How to build it in Payload**
In the Payload configuration file, add a custom view under the admin.components.views key. This creates a new route in the Payload admin panel. The view component is a standard React component that uses Payload's built-in REST API to fetch the articles collection data client-side.
The component queries the Payload API for all articles with status equal to published, requesting only the fields needed for the table (title, slug, aeoScore, status, directAnswer, faqItems, metaTitle, metaDescription, nextReviewDate, lastVerifiedDate, contentPillar, publishedDate). It then computes the missing fields warnings client-side and renders the table with colour-coded values.

**Safe to implement**
This dashboard is read-only. It does not modify any data. It only queries and displays. This makes it safe to build without any risk to existing article data.

---

## 18. Image optimisation

**Why this affects rankings directly**
Core Web Vitals are confirmed Google ranking signals. Two of them are directly affected by images: Largest Contentful Paint (LCP), which measures how quickly the main content of the page becomes visible, and Cumulative Layout Shift (CLS), which measures how much the page layout shifts as content loads. Hero images that load slowly or cause layout shift directly reduce rankings.
The current implementation likely uses standard img tags rendering whatever format was uploaded. This section describes three specific changes that immediately improve Core Web Vitals scores for every article.

**1. Switch all images to the Next.js Image component**
Next.js has a built-in Image component that handles optimisation automatically. Replace every standard HTML img tag in the article page template with the Next.js Image component.
The Image component automatically converts images to WebP format (25–35% smaller file size than JPEG or PNG), generates multiple sizes and serves the correct size for the device, lazy-loads images below the fold so they do not delay initial page load, and prevents layout shift by reserving the correct space before the image loads.
For the hero image specifically, add the priority prop so it loads immediately rather than being lazy-loaded. The hero image is the Largest Contentful Paint element on the page — it must load as fast as possible.

**2. Set explicit width and height on every image**
Every image rendered on the article page must have explicit width and height attributes set. These should come from the Payload media object — Payload stores the original width and height of every uploaded image.
Without explicit dimensions, the browser does not know how much space to reserve for the image before it loads. The page renders, then shifts when the image appears. That shift is Cumulative Layout Shift — a direct ranking penalty.
The article hero image, the author photo, the social share image, and any images inside the related articles cards all need explicit dimensions.

**3. Add descriptive alt text enforcement to the media library**
Alt text serves two purposes: accessibility for screen readers, and an image SEO signal. Images with descriptive, keyword-relevant alt text rank in Google Image Search and provide an additional relevance signal for the article page.
In the Payload media collection, add a required validation rule to the alt field. Make it required with a minimum of 20 characters. This prevents anyone from uploading an image without adding descriptive alt text.
For existing uploaded images, the content team needs to go back and add alt text. Prioritise the hero images on the highest-traffic articles first.

---

## 19. Updated verification checklist — version 3 additions

Add these items to the end of the Section 10 verification checklist. All original verification items from Section 10 still apply.

**robots.txt**

- Go to caseport.io/robots.txt in a browser. Confirm the file loads and is not a 404.
- Confirm the `/admin` and `/api` paths are blocked.
- Confirm the Sitemap URL is listed in the robots.txt output.
- Go to Google Search Console, Settings, robots.txt Tester. Confirm Google can read the file and the rules apply correctly.

**llms.txt**

- Go to caseport.io/llms.txt in a browser. Confirm the file loads with plain text content.
- Confirm the file describes CasePort accurately and lists the most authoritative article URLs.
- Confirm the robots.txt file includes a comment pointing to llms.txt.

**Auto-generated OG images**

- Go to caseport.io/og?slug=why-personal-injury-leads-die-in-24-hours in a browser. Confirm a branded image loads showing the article headline and CasePort logo.
- Share the article URL on LinkedIn or use opengraph.xyz. Confirm the auto-generated branded image appears in the preview.
- Confirm the fallback logic works: if a manual social share image is uploaded in Payload, that takes priority over the auto-generated image.

**Author profile pages**

- Go to caseport.io/authors/martha-kechicha. Confirm the page loads with full author profile.
- Confirm the author page appears in the sitemap output.
- View page source on the author page. Confirm Person JSON-LD schema is present.
- Confirm the article byline links to the author page.

**Google News sitemap**

- Go to caseport.io/news-sitemap.xml. Confirm the sitemap loads with correct XML format.
- Confirm only articles with contentFormat equal to news and publishedDate within 30 days appear in it.
- Confirm the Google News sitemap has been submitted in Search Console.

**Content intelligence dashboard**

- Log into Payload admin. Confirm the Content Intelligence item appears in the sidebar navigation.
- Confirm the dashboard loads a table of published articles with AEO scores.
- Confirm the colour coding works: green for 80+, amber for 60–79, red for below 60.
- Confirm the review due dates turn red when past the due date.

**Image optimisation**

- Run PageSpeed Insights (pagespeed.web.dev) on the lead decay article. Check LCP score. Target under 2.5 seconds.
- Check for Cumulative Layout Shift warnings in the PageSpeed report. Target CLS score under 0.1.
- View page source and confirm hero image has explicit width and height attributes.
- Confirm hero image has the priority attribute set (Next.js Image component).

---

**End of document — Version 3**
