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