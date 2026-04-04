/**
 * Sitemap Page
 * 
 * Serves XML sitemap for search engine crawling
 * Route: /sitemap.xml
 */

import { generateSitemap } from "@/lib/sitemap";

export default function Sitemap() {
  const sitemap = generateSitemap("https://caseportmp-ktqqzjyn.manus.space");
  
  return (
    <div>
      <pre>{sitemap}</pre>
    </div>
  );
}
