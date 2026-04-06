/*
  DESIGN: "The Observatory" — CasePort Insights
  Data layer: Article content, categories, and signals
*/

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: Category;
  date: string;
  readTime: string;
  author: string;
  tags: string[];
  badge?: "Editor's Pick" | "Most Read" | "New";
  featured?: boolean;
  signalStrength: number; // 0-100
  thumbnail: string;
}

// Category thumbnail map
export const categoryThumbnails: Record<Category, string> = {
  "Case Acquisition": "https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/AtP97UDSfYwW9WKCZmFxDF/thumb-case-acquisition-ZAwSYgwXtR28wSaGnALayj.webp",
  Intake: "https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/AtP97UDSfYwW9WKCZmFxDF/thumb-intake-C4gq8UCqLBQad58qGakqju.webp",
  "Search & GEO": "https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/AtP97UDSfYwW9WKCZmFxDF/thumb-search-geo-VihiwtPgCP2FmMMfKtFBCE.webp",
  "Lead Economics": "https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/AtP97UDSfYwW9WKCZmFxDF/thumb-lead-economics-ERs8uGoqRADMrMktRWpgmR.webp",
  "Law Firm Growth": "https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/AtP97UDSfYwW9WKCZmFxDF/thumb-law-firm-growth-cr45fXTeSMN8qwzUyRnpkB.webp",
  "Market Signals": "https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/AtP97UDSfYwW9WKCZmFxDF/thumb-market-signals-WU6pYyAGbPrWZMC8qaifXT.webp",
};

export interface Signal {
  id: string;
  number: string;
  title: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  date: string;
  signalStrength: number;
}

export type Category =
  | "Case Acquisition"
  | "Intake"
  | "Search & GEO"
  | "Lead Economics"
  | "Law Firm Growth"
  | "Market Signals";

export interface TopicCluster {
  name: Category;
  description: string;
  articleCount: number;
  icon: string;
}

export const categories: Category[] = [
  "Case Acquisition",
  "Intake",
  "Search & GEO",
  "Lead Economics",
  "Law Firm Growth",
  "Market Signals",
];

export const articles: Article[] = [
  {
    id: "1",
    slug: "hidden-cost-of-intake-leakage-personal-injury",
    title: "The Hidden Cost of Intake Leakage in Personal Injury",
    excerpt:
      "Firms often assume the problem starts at lead quality. In many cases, value is already being lost after the inquiry arrives through response delay, weak intake discipline, routing friction, and inconsistent qualification.",
    category: "Intake",
    date: "Mar 22, 2026",
    readTime: "8 min read",
    author: "CasePort Editorial",
    tags: ["Intake friction", "Response discipline", "Retained value"],
    featured: true,
    badge: "Editor's Pick",
    signalStrength: 92,
    thumbnail: "https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/AtP97UDSfYwW9WKCZmFxDF/thumb-intake-C4gq8UCqLBQad58qGakqju.webp",
  },
  {
    id: "2",
    slug: "ai-search-reshape-personal-injury-case-discovery",
    title: "How AI Search May Reshape Personal Injury Case Discovery",
    excerpt:
      "What changing search behavior could mean for discovery, visibility, and future case acquisition strategy. The shift from ten blue links to AI-generated answers is accelerating.",
    category: "Search & GEO",
    date: "Mar 20, 2026",
    readTime: "7 min read",
    author: "CasePort Editorial",
    tags: ["AI search", "SGE", "Discovery behavior"],
    badge: "New",
    signalStrength: 88,
    thumbnail: "https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/AtP97UDSfYwW9WKCZmFxDF/thumb-search-geo-VihiwtPgCP2FmMMfKtFBCE.webp",
  },
  {
    id: "3",
    slug: "why-more-leads-does-not-always-mean-more-signed-cases",
    title: "Why More Leads Does Not Always Mean More Signed Cases",
    excerpt:
      "Volume can mask conversion weakness. Better routing, qualification, and follow-up often matter more than raw lead count. The economics of intake discipline.",
    category: "Lead Economics",
    date: "Mar 18, 2026",
    readTime: "6 min read",
    author: "CasePort Editorial",
    tags: ["Lead volume", "Conversion", "Qualification"],
    signalStrength: 78,
    thumbnail: "https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/AtP97UDSfYwW9WKCZmFxDF/thumb-lead-economics-ERs8uGoqRADMrMktRWpgmR.webp",
  },
  {
    id: "4",
    slug: "personal-injury-lead-buying-vs-building-demand-engine",
    title: "Personal Injury Lead Buying vs Building Your Own Demand Engine",
    excerpt:
      "The tradeoff between rented attention and owned visibility, and where long-term control really comes from. Why the most disciplined firms are shifting strategy.",
    category: "Case Acquisition",
    date: "Mar 17, 2026",
    readTime: "9 min read",
    author: "CasePort Editorial",
    tags: ["Demand generation", "Owned visibility", "Lead buying"],
    badge: "Editor's Pick",
    signalStrength: 95,
    thumbnail: "https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/AtP97UDSfYwW9WKCZmFxDF/thumb-case-acquisition-ZAwSYgwXtR28wSaGnALayj.webp",
  },
  {
    id: "5",
    slug: "why-intake-delay-quietly-kills-case-value",
    title: "Why Intake Delay Quietly Kills Case Value",
    excerpt:
      "Delay compounds loss. The best firms reduce decision lag, routing friction, and follow-up gaps fast. Every hour of delay is measurable in retained case value.",
    category: "Intake",
    date: "Mar 15, 2026",
    readTime: "5 min read",
    author: "CasePort Editorial",
    tags: ["Response time", "Case value", "Intake speed"],
    signalStrength: 82,
    thumbnail: "https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/AtP97UDSfYwW9WKCZmFxDF/thumb-intake-C4gq8UCqLBQad58qGakqju.webp",
  },
  {
    id: "6",
    slug: "seo-vs-geo-personal-injury-demand-capture",
    title: "SEO vs GEO for Personal Injury Demand Capture",
    excerpt:
      "Traditional ranking still matters, but answer-engine visibility is becoming part of discovery too. How disciplined operators are adapting their search strategy.",
    category: "Search & GEO",
    date: "Mar 14, 2026",
    readTime: "6 min read",
    author: "CasePort Editorial",
    tags: ["SEO", "GEO", "Answer engines"],
    signalStrength: 74,
    thumbnail: "https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/AtP97UDSfYwW9WKCZmFxDF/thumb-search-geo-VihiwtPgCP2FmMMfKtFBCE.webp",
  },
  {
    id: "7",
    slug: "markets-where-acquisition-costs-quietly-rising",
    title: "The Markets Where Acquisition Costs Are Quietly Rising",
    excerpt:
      "A look at why some markets become harder to buy efficiently and what disciplined operators watch early. Cost-per-case trends across 15 priority states.",
    category: "Lead Economics",
    date: "Mar 12, 2026",
    readTime: "8 min read",
    author: "CasePort Editorial",
    tags: ["Market costs", "CPA trends", "Regional analysis"],
    badge: "Most Read",
    signalStrength: 86,
    thumbnail: "https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/AtP97UDSfYwW9WKCZmFxDF/thumb-lead-economics-ERs8uGoqRADMrMktRWpgmR.webp",
  },
  {
    id: "8",
    slug: "why-firms-misread-lead-quality-problems",
    title: "Why Firms Misread Lead Quality Problems",
    excerpt:
      "The issue is often not the lead alone. Intake standards, speed, and qualification logic shape outcomes downstream. A framework for diagnosing the real bottleneck.",
    category: "Law Firm Growth",
    date: "Mar 10, 2026",
    readTime: "7 min read",
    author: "CasePort Editorial",
    tags: ["Lead quality", "Diagnosis", "Intake standards"],
    signalStrength: 70,
    thumbnail: "https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/AtP97UDSfYwW9WKCZmFxDF/thumb-law-firm-growth-cr45fXTeSMN8qwzUyRnpkB.webp",
  },
  {
    id: "9",
    slug: "what-high-intent-demand-actually-looks-like",
    title: "What High-Intent Demand Actually Looks Like",
    excerpt:
      "Not every inquiry deserves the same weight. Intent signals help separate noise from real opportunity. How to identify and prioritize the cases that matter.",
    category: "Market Signals",
    date: "Mar 8, 2026",
    readTime: "6 min read",
    author: "CasePort Editorial",
    tags: ["Intent signals", "Demand quality", "Prioritization"],
    signalStrength: 68,
    thumbnail: "https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/AtP97UDSfYwW9WKCZmFxDF/thumb-market-signals-WU6pYyAGbPrWZMC8qaifXT.webp",
  },
  {
    id: "10",
    slug: "why-intake-delay-quietly-kills-case-value",
    title: "Why Intake Delay Quietly Kills Case Value",
    excerpt:
      "Delay compounds loss. The best firms reduce decision lag, routing friction, and follow-up gaps fast. Every hour of delay is measurable in retained case value.",
    category: "Intake",
    date: "Mar 15, 2026",
    readTime: "5 min read",
    author: "CasePort Editorial",
    tags: ["Response time", "Case value", "Intake speed"],
    signalStrength: 82,
    thumbnail: "https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/AtP97UDSfYwW9WKCZmFxDF/thumb-intake-C4gq8UCqLBQad58qGakqju.webp",
  },
  {
    id: "11",
    slug: "seo-vs-geo-personal-injury-demand-capture",
    title: "SEO vs GEO for Personal Injury Demand Capture",
    excerpt:
      "Traditional ranking still matters, but answer-engine visibility is becoming part of discovery too. How disciplined operators are adapting their search strategy.",
    category: "Search & GEO",
    date: "Mar 14, 2026",
    readTime: "6 min read",
    author: "CasePort Editorial",
    tags: ["SEO", "GEO", "Answer engines"],
    signalStrength: 74,
    thumbnail: "https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/AtP97UDSfYwW9WKCZmFxDF/thumb-search-geo-VihiwtPgCP2FmMMfKtFBCE.webp",
  },
  {
    id: "12",
    slug: "why-more-leads-does-not-always-mean-more-signed-cases",
    title: "Why More Leads Does Not Always Mean More Signed Cases",
    excerpt:
      "Volume can mask conversion weakness. Better routing, qualification, and follow-up often matter more than raw lead count. The economics of intake discipline.",
    category: "Lead Economics",
    date: "Mar 18, 2026",
    readTime: "6 min read",
    author: "CasePort Editorial",
    tags: ["Lead volume", "Conversion", "Qualification"],
    signalStrength: 78,
    thumbnail: "https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/AtP97UDSfYwW9WKCZmFxDF/thumb-lead-economics-ERs8uGoqRADMrMktRWpgmR.webp",
  },
  {
    id: "13",
    slug: "personal-injury-lead-buying-vs-building-demand-engine",
    title: "Personal Injury Lead Buying vs Building Your Own Demand Engine",
    excerpt:
      "The tradeoff between rented attention and owned visibility, and where long-term control really comes from. Why the most disciplined firms are shifting strategy.",
    category: "Case Acquisition",
    date: "Mar 17, 2026",
    readTime: "9 min read",
    author: "CasePort Editorial",
    tags: ["Demand generation", "Owned visibility", "Lead buying"],
    badge: "Editor's Pick",
    signalStrength: 95,
    thumbnail: "https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/AtP97UDSfYwW9WKCZmFxDF/thumb-case-acquisition-ZAwSYgwXtR28wSaGnALayj.webp",
  },
  {
    id: "14",
    slug: "markets-where-acquisition-costs-quietly-rising",
    title: "The Markets Where Acquisition Costs Are Quietly Rising",
    excerpt:
      "A look at why some markets become harder to buy efficiently and what disciplined operators watch early. Cost-per-case trends across 15 priority states.",
    category: "Lead Economics",
    date: "Mar 12, 2026",
    readTime: "8 min read",
    author: "CasePort Editorial",
    tags: ["Market costs", "CPA trends", "Regional analysis"],
    badge: "Most Read",
    signalStrength: 86,
    thumbnail: "https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/AtP97UDSfYwW9WKCZmFxDF/thumb-lead-economics-ERs8uGoqRADMrMktRWpgmR.webp",
  },
  {
    id: "15",
    slug: "why-firms-misread-lead-quality-problems",
    title: "Why Firms Misread Lead Quality Problems",
    excerpt:
      "The issue is often not the lead alone. Intake standards, speed, and qualification logic shape outcomes downstream. A framework for diagnosing the real bottleneck.",
    category: "Law Firm Growth",
    date: "Mar 10, 2026",
    readTime: "7 min read",
    author: "CasePort Editorial",
    tags: ["Lead quality", "Diagnosis", "Intake standards"],
    signalStrength: 70,
    thumbnail: "https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/AtP97UDSfYwW9WKCZmFxDF/thumb-law-firm-growth-cr45fXTeSMN8qwzUyRnpkB.webp",
  },
  {
    id: "16",
    slug: "ai-search-reshape-personal-injury-case-discovery",
    title: "How AI Search May Reshape Personal Injury Case Discovery",
    excerpt:
      "What changing search behavior could mean for discovery, visibility, and future case acquisition strategy. The shift from ten blue links to AI-generated answers is accelerating.",
    category: "Search & GEO",
    date: "Mar 20, 2026",
    readTime: "7 min read",
    author: "CasePort Editorial",
    tags: ["AI search", "SGE", "Discovery behavior"],
    badge: "New",
    signalStrength: 88,
    thumbnail: "https://d2xsxph8kpxj0f.cloudfront.net/310519663482465617/AtP97UDSfYwW9WKCZmFxDF/thumb-search-geo-VihiwtPgCP2FmMMfKtFBCE.webp",
  },
];

export const signals: Signal[] = [
  {
    id: "s1",
    number: "01",
    title: "What we're watching in injury search this month",
    priority: "HIGH",
    date: "Mar 2026",
    signalStrength: 90,
  },
  {
    id: "s2",
    number: "02",
    title: "A quiet trend in lead pricing",
    priority: "MEDIUM",
    date: "Mar 2026",
    signalStrength: 65,
  },
  {
    id: "s3",
    number: "03",
    title: "Why intake speed is still underestimated",
    priority: "HIGH",
    date: "Mar 2026",
    signalStrength: 85,
  },
  {
    id: "s4",
    number: "04",
    title: "Where firms may be overpaying for volume",
    priority: "MEDIUM",
    date: "Mar 2026",
    signalStrength: 60,
  },
];

export const topicClusters: TopicCluster[] = [
  {
    name: "Case Acquisition",
    description: "How firms attract, route, and retain better case opportunities.",
    articleCount: 12,
    icon: "target",
  },
  {
    name: "Intake",
    description: "Where value is won or lost after the inquiry arrives.",
    articleCount: 9,
    icon: "funnel",
  },
  {
    name: "Search & GEO",
    description: "SEO, GEO, SGE, and emerging discovery behavior.",
    articleCount: 8,
    icon: "search",
  },
  {
    name: "Lead Economics",
    description: "The cost, quality, and retained-value side of growth.",
    articleCount: 11,
    icon: "chart",
  },
  {
    name: "Market Signals",
    description: "What appears to be shifting across demand and competition.",
    articleCount: 7,
    icon: "signal",
  },
  {
    name: "Law Firm Growth",
    description: "Operational and strategic lessons for smarter growth.",
    articleCount: 6,
    icon: "growth",
  },
];
