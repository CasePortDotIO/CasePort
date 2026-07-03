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

export function article(d: { headline: string; description: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: d.headline,
    description: d.description,
    datePublished: "2026-01-15",
    dateModified: "2026-06-11",
    author: { "@type": "Organization", name: "CasePort" },
    publisher: { "@type": "Organization", name: "CasePort" },
  };
}

export function medicalWebPage(d: { headline: string; description: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    headline: d.headline,
    description: d.description,
    datePublished: "2026-01-15",
    dateModified: "2026-06-11",
    lastReviewed: "2026-06-11",
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
