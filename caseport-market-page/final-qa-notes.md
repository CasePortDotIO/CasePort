# Final QA Notes — Market Page AEO/Hero Optimization

## Hero Above-the-Fold
- Confirmed: entire hero (nav + status bar + headline + subline + body text + stats grid) fits within ~500px viewport height
- Two-column layout works well: copy left, stats right
- Stats counter animation triggers on view
- "Geography Is Not a Detail" section starts just below fold — perfect scroll teaser

## Access Grid Section
- 4-column grid on desktop, responsive
- Limited markets sorted first (amber), then Open (green), then Capped (gray), then In Review (cyan)
- Search, region filter, and status filter pills all functional
- "46 markets found" counter updates in real-time

## AEO/GEO/SGE Elements Confirmed
- 5 JSON-LD schema blocks: Organization, Service, WebPage+SpeakableSpecification, BreadcrumbList, FAQPage
- data-speakable attributes on hero-headline, hero-subline, geography-intro, faq-answer
- Hidden sr-only AEO content blocks targeting 7 long-tail conversational queries
- FAQ section has 8 questions with itemScope/itemProp microdata
- All aria-labels present on interactive elements
- Meta tags include subject, topic, classification, category, coverage, target
- Canonical URL set to https://www.caseport.io/markets

## Page Structure
- Semantic HTML5: section, article, nav, main, role attributes
- All sections have aria-label attributes with keyword-rich descriptions
- FAQ questions target specific voice search patterns
