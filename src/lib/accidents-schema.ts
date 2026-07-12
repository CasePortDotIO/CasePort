/* JSON-LD builders. Mirrors source `CP.ld.*` and the article extras
   (Speakable + ItemList) from `enhanceArticle`, kept additive. */
import { SITE_URL } from "./accidents-constants";
import { medReviewer } from "@/data";

export interface Faq {
  q: string;
  a: string;
}

export function organization() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CasePort",
    url: SITE_URL,
    description:
      "The definitive accident resource hub for state-specific negligence rules, city-level guides, and first-hour actions.",
  };
}

export function website() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url: SITE_URL,
    name: "CasePort",
  };
}

export function breadcrumb(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: SITE_URL + it.url,
    })),
  };
}

export function faqSchema(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function article(d: { headline: string; description: string; datePublished?: string; dateModified?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: d.headline,
    description: d.description,
    datePublished: d.datePublished || undefined,
    dateModified: d.dateModified || undefined,
    author: { "@type": "Organization", name: "CasePort" },
    publisher: { "@type": "Organization", name: "CasePort" },
  };
}

export function medicalWebPage(d: { headline: string; description: string; datePublished?: string; dateModified?: string }) {
  const now = new Date().toISOString().split('T')[0]
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    headline: d.headline,
    description: d.description,
    datePublished: d.datePublished || now,
    dateModified: d.dateModified || now,
    lastReviewed: d.dateModified || now,
    reviewedBy: { "@type": "Person", name: medReviewer.name, jobTitle: medReviewer.title },
    publisher: { "@type": "Organization", name: "CasePort" },
  };
}

export function howto(d: {
  name: string;
  description: string;
  steps: { name: string; text: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: d.name,
    description: d.description,
    step: d.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

export function definedTermSet(
  name: string,
  terms: { term: string; def: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name,
    hasDefinedTerm: terms.map((t) => ({
      "@type": "DefinedTerm",
      name: t.term,
      description: t.def,
    })),
  };
}

/** Speakable targets the Direct Answer lead + H1. */
export function speakable(url: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".cap-lead", ".answer-block .lede", "h1"],
    },
    url: SITE_URL + url,
  };
}

/** ItemList built from the page's TOC headings. */
export function itemList(headings: string[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: headings.map((name, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
    })),
  };
}

/** Organization + WebSite graph that every page carries. */
export function orgGraph() {
  return [organization(), website()];
}

// ─── Per-page JSON-LD Generator (AccidentPages collection) ─────────────────────

type Block = { blockType: string; [key: string]: any }

/** Find a block of a given type in the blocks array */
const findBlock = (blocks: Block[], type: string): Block | undefined =>
  blocks?.find((b) => b.blockType === type)

/** Get the full URL for an accident page */
function pageUrl(fullSlug: string): string {
  return `${SITE_URL}/accidents/${fullSlug}`
}

/**
 * Returns all applicable JSON-LD schemas for an accident page document.
 * Produces: Article (or schemaType), FAQPage, HowTo, Speakable, BreadcrumbList.
 * Call in the page renderer and render each as a <script type="application/ld+json"> tag.
 */
export function generateAccidentJsonLd(doc: any): object[] {
  if (!doc) return []
  const blocks: Block[] = doc.blocks || []
  const schemas: object[] = []
  const url = pageUrl(doc.fullSlug || '')

  // 1. Article / GuidePage schema
  const schemaType = doc.schemaType || 'GuidePage'
  const daBlock = findBlock(blocks, 'directAnswer')
  const heroBlock = findBlock(blocks, 'hero')
  const expertBlock = findBlock(blocks, 'expert')
  const authorObj = expertBlock?.author
  const authorName = typeof authorObj === 'object' ? authorObj?.name : 'CasePort'
  const heroImageUrl =
    typeof heroBlock?.heroImage === 'object' ? heroBlock?.heroImage?.url : null

  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'GuidePage', // All accident pages use GuidePage schema
    headline: doc.metaTitle || doc.title,
    description: doc.metaDescription || daBlock?.lead || daBlock?.text || '',
    image: heroImageUrl ? [heroImageUrl] : [],
    url,
    author: { '@type': 'Organization', name: authorName || 'CasePort' },
    publisher: {
      '@type': 'Organization',
      name: 'CasePort',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png`, width: 600, height: 60 },
    },
    datePublished: doc.publishedDate || undefined,
    dateModified: doc.updatedAt || undefined,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    ...(doc.readTime ? { timeRequired: `PT${doc.readTime}M` } : {}),
  })

  // 2. FAQPage schema — from faq block's items
  const faqBlock = findBlock(blocks, 'faq')
  const faqItems: any[] = faqBlock?.items || []
  if (faqItems.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems
        .filter((f: any) => f.question && f.answerText)
        .map((f: any) => ({
          '@type': 'Question',
          name: f.question,
          acceptedAnswer: { '@type': 'Answer', text: f.answerText },
        })),
    })
  }

  // 3. HowTo schema — from directAnswer block's howToSteps
  const steps: any[] = daBlock?.howToSteps || []
  if (schemaType === 'HowTo' && steps.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: doc.metaTitle || doc.title,
      description: doc.metaDescription || daBlock?.lead || '',
      step: steps.map((step: any, index: number) => ({
        '@type': 'HowToStep',
        position: index + 1,
        name: step.name,
        text: step.description,
        ...(step.image
          ? { image: { '@type': 'ImageObject', url: typeof step.image === 'object' ? step.image?.url : step.image } }
          : {}),
      })),
    })
  }

  // 4. Speakable schema — from directAnswer block's speakableCssSelectors
  const selectors: any[] = daBlock?.speakableCssSelectors || []
  if (selectors.length > 0) {
    const cssSelectors = selectors.map((s: any) => s.selector).filter(Boolean)
    if (cssSelectors.length > 0) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        url,
        speakable: { '@type': 'SpeakableSpecification', cssSelector: cssSelectors },
      })
    }
  }

  // 5. BreadcrumbList schema
  const crumbs = buildBreadcrumbs(doc.pageType, doc.fullSlug, doc.title)
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c) => ({
      '@type': 'ListItem',
      position: c.position,
      name: c.name,
      item: c.item,
    })),
  })

  return schemas
}

// ─── Breadcrumb builder ────────────────────────────────────────────────────────

type BreadcrumbItem = { position: number; name: string; item: string }

function buildBreadcrumbs(
  pageType: string,
  fullSlug: string,
  title: string,
): BreadcrumbItem[] {
  const url = pageUrl(fullSlug)
  const crumbs: BreadcrumbItem[] = [
    { position: 1, name: 'Home', item: SITE_URL },
    { position: 2, name: 'Accidents', item: `${SITE_URL}/accidents` },
  ]

  if (!fullSlug) return crumbs

  const parts = fullSlug.split('/')

  if (pageType === 'cityType' && parts.length >= 3) {
    const [stateKey, citySlug, typeSlug] = parts
    if (stateKey)
      crumbs.push({ position: 3, name: stateKey.toUpperCase(), item: `${SITE_URL}/accidents/${stateKey}` })
    if (citySlug)
      crumbs.push({
        position: 4,
        name: citySlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        item: `${SITE_URL}/accidents/${stateKey}/${citySlug}`,
      })
    if (typeSlug)
      crumbs.push({ position: 5, name: typeSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()), item: url })
  } else if (pageType === 'city' && parts.length >= 2) {
    const [stateKey, citySlug] = parts
    if (stateKey)
      crumbs.push({ position: 3, name: stateKey.toUpperCase(), item: `${SITE_URL}/accidents/${stateKey}` })
    if (citySlug)
      crumbs.push({ position: 4, name: citySlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()), item: url })
  } else if (pageType === 'state') {
    crumbs.push({ position: 3, name: fullSlug.toUpperCase(), item: url })
  } else if (pageType === 'stateTopic' && parts.length >= 2) {
    const [stateKey, ...topicParts] = parts
    if (stateKey)
      crumbs.push({ position: 3, name: stateKey.toUpperCase(), item: `${SITE_URL}/accidents/${stateKey}` })
    crumbs.push({
      position: 4,
      name: topicParts.join(' ').replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      item: url,
    })
  } else if (pageType === 'accidentType') {
    crumbs.push({ position: 3, name: fullSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()), item: url })
  } else if (pageType === 'quickAnswer') {
    crumbs.push({ position: 3, name: fullSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()), item: url })
  }

  return crumbs
}
