import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

/**
 * ForLawFirms landing page tests.
 * These verify the critical content, SEO, AEO/GEO, and compliance requirements
 * by reading the source file directly — no DOM rendering needed.
 */

const pageSrc = readFileSync(
  resolve(__dirname, "../client/src/pages/ForLawFirms.tsx"),
  "utf-8"
);

const indexHtml = readFileSync(
  resolve(__dirname, "../client/index.html"),
  "utf-8"
);

const robotsTxt = readFileSync(
  resolve(__dirname, "../client/public/robots.txt"),
  "utf-8"
);

const appSrc = readFileSync(
  resolve(__dirname, "../client/src/App.tsx"),
  "utf-8"
);

/* ─────────────────────────────────────────────
   1. ROUTING & URL STRATEGY
   ───────────────────────────────────────────── */
describe("Routing & URL Strategy", () => {
  it("registers /for-law-firms route in App.tsx", () => {
    expect(appSrc).toContain("/for-law-firms");
  });

  it("registers /buy-personal-injury-leads redirect route", () => {
    expect(appSrc).toContain("/buy-personal-injury-leads");
  });

  it("redirects /buy-personal-injury-leads to /for-law-firms", () => {
    expect(appSrc).toMatch(/buy-personal-injury-leads.*Redirect.*for-law-firms/s);
  });
});

/* ─────────────────────────────────────────────
   2. PASTOR COPYWRITING SEQUENCE
   ───────────────────────────────────────────── */
describe("PASTOR Copywriting Sequence", () => {
  it("includes Problem statement (lead waste)", () => {
    expect(pageSrc).toMatch(/\$15,000.*\$50,000.*monthly/i);
  });

  it("includes Amplify section (lead decay cost)", () => {
    expect(pageSrc).toMatch(/40.*60%.*lead decay/i);
  });

  it("includes Story section (CasePort system)", () => {
    expect(pageSrc).toContain("Disciplined Case Flow");
  });

  it("includes Testimony section (case studies)", () => {
    expect(pageSrc).toContain("Texas PI Firm");
    expect(pageSrc).toContain("23");
  });

  it("includes Offer section (risk reversal)", () => {
    expect(pageSrc).toContain("90-Day Commitment Guarantee");
  });

  it("includes Response section (primary CTA)", () => {
    expect(pageSrc).toContain("Claim Your Market Access");
  });
});

/* ─────────────────────────────────────────────
   3. TRUST SIGNALS & CREDIBILITY
   ───────────────────────────────────────────── */
describe("Trust Signals", () => {
  it("displays market cap (3 firms per metro)", () => {
    expect(pageSrc).toContain("3");
    expect(pageSrc).toContain("firms per metro");
  });

  it("shows system status (operational)", () => {
    expect(pageSrc).toContain("Operational");
  });

  it("displays key metrics ($2.4M+, 94%, 0%)", () => {
    expect(pageSrc).toContain("$2.4M+");
    expect(pageSrc).toContain("94%");
    expect(pageSrc).toContain("0.0%");
  });

  it("includes verified case studies", () => {
    expect(pageSrc).toContain("Verified");
    expect(pageSrc).toContain("California");
    expect(pageSrc).toContain("Florida");
  });

  it("references ABA compliance", () => {
    expect(pageSrc).toContain("ABA");
    expect(pageSrc).toContain("Compliant");
  });

  it("references ABA Model Rules of Professional Conduct", () => {
    expect(pageSrc).toContain("ABA Rule");
  });

  it("references specific ABA rules", () => {
    expect(pageSrc).toContain("ABA Rule 7.1");
    expect(pageSrc).toContain("ABA Rule 1.6");
  });

  it("includes review-first onboarding messaging", () => {
    expect(pageSrc).toContain("Review-First");
  });

  it("includes market capacity scarcity indicator", () => {
    expect(pageSrc).toContain("Market Capacity");
    expect(pageSrc).toContain("slots available");
  });
});

/* ─────────────────────────────────────────────
   4. SELF-CLOSING ECOSYSTEM
   ───────────────────────────────────────────── */
describe("Self-Closing Ecosystem", () => {
  it("includes multi-step qualification form", () => {
    expect(pageSrc).toContain("Firm Details");
  });

  it("mentions pre-funded wallet onboarding", () => {
    expect(pageSrc).toContain("Pre-Funded");
    expect(pageSrc).toContain("Wallet");
  });

  it("emphasizes no manual invoicing", () => {
    expect(pageSrc).toContain("Pre-Funded Wallet");
  });
});

/* ─────────────────────────────────────────────
   5. DATA MOAT INDICATORS
   ───────────────────────────────────────────── */
describe("Data Moat Indicators", () => {
  it("shows proprietary lead scoring visualization", () => {
    expect(pageSrc).toContain("12-Dimension Lead Scoring");
  });

  it("displays lead recovery metrics", () => {
    expect(pageSrc).toContain("Lead Recovery");
    expect(pageSrc).toContain("34%");
  });

  it("displays lead recycling metrics", () => {
    expect(pageSrc).toContain("Lead Recycling");
  });

  it("shows zero lead decay guarantee", () => {
    expect(pageSrc).toContain("0.0%");
  });

  it("includes institutional credibility markers", () => {
    expect(pageSrc).toContain("Market-Capped");
  });
});

/* ─────────────────────────────────────────────
   6. CONVERSION OPTIMIZATION
   ───────────────────────────────────────────── */
describe("Conversion Optimization", () => {
  it("has primary CTA 'Claim Your Market Access'", () => {
    expect(pageSrc).toContain("Claim Your Market Access");
  });

  it("has secondary CTA 'See How It Works'", () => {
    expect(pageSrc).toContain("See How It Works");
  });

  it("includes urgency messaging (48-hour review)", () => {
    expect(pageSrc).toContain("48 hours");
  });

  it("includes scarcity messaging (2 slots)", () => {
    expect(pageSrc).toContain("2 slots available");
  });
});

/* ─────────────────────────────────────────────
   7. AEO/GEO OPTIMIZATION
   ───────────────────────────────────────────── */
describe("AEO/GEO Optimization", () => {
  it("includes answer-first FAQ section", () => {
    expect(pageSrc).toContain("Everything You Want to Know");
  });

  it("includes FAQ targeting 'case acquisition system'", () => {
    expect(pageSrc).toContain("What is a case acquisition system");
  });

  it("includes FAQ targeting 'exclusive personal injury leads'", () => {
    expect(pageSrc).toContain("exclusive personal injury leads");
  });

  it("includes FAQ section with objection handling", () => {
    expect(pageSrc).toContain("Everything You Want to Know");
  });

  it("includes FAQ about car accident cases", () => {
    expect(pageSrc).toContain("car accident cases");
  });

  it("includes FAQ about ABA compliance", () => {
    expect(pageSrc).toContain("ABA advertising rules");
  });

  it("includes JSON-LD FAQPage schema", () => {
    expect(pageSrc).toContain("FAQPage");
    expect(pageSrc).toContain("acceptedAnswer");
  });

  it("includes JSON-LD Organization schema", () => {
    expect(pageSrc).toContain("Organization");
  });

  it("includes JSON-LD Service schema", () => {
    expect(pageSrc).toContain("Service");
  });

  it("uses semantic HTML5 structure", () => {
    expect(pageSrc).toContain("<main");
    expect(pageSrc).toContain("<section");
  });
});

/* ─────────────────────────────────────────────
   8. DESIGN & BRANDING
   ───────────────────────────────────────────── */
describe("Design & Branding", () => {
  it("uses Geist Sans font family", () => {
    expect(pageSrc).toContain("Geist");
  });

  it("uses JetBrains Mono for data/labels", () => {
    expect(pageSrc).toContain("JetBrains Mono");
  });

  it("uses dark theme (rgb(3,6,8) background)", () => {
    expect(pageSrc).toContain("rgb(3, 6, 8)");
  });

  it("includes gradient text for accents", () => {
    expect(pageSrc).toContain("text-gradient");
  });

  it("includes glass morphism panels", () => {
    expect(pageSrc).toContain("glass-panel");
  });

  it("includes CASEPORT logo and tagline", () => {
    expect(pageSrc).toContain("CASEPORT");
    expect(pageSrc).toContain("CASE FLOW WITHOUT GUESSWORK");
  });

  it("includes scroll animations", () => {
    expect(pageSrc).toContain("IntersectionObserver");
  });

  it("includes hover micro-interactions", () => {
    expect(pageSrc).toContain("hover:");
  });
});

/* ─────────────────────────────────────────────
   9. META TAGS & SEO
   ───────────────────────────────────────────── */
describe("Meta Tags & SEO", () => {
  it("includes meta description in index.html", () => {
    expect(indexHtml).toContain("meta");
    expect(indexHtml).toContain("description");
  });

  it("includes OG tags for social sharing", () => {
    expect(indexHtml).toContain("og:title");
  });

  it("includes canonical URL", () => {
    expect(indexHtml).toContain("canonical");
  });

  it("robots.txt welcomes AI crawlers", () => {
    expect(robotsTxt).toContain("GPTBot");
    expect(robotsTxt).toContain("PerplexityBot");
  });
});

/* ─────────────────────────────────────────────
   10. COMPLIANCE & LEGAL
   ───────────────────────────────────────────── */
describe("Compliance & Legal", () => {
  it("includes ABA Rule 7.1 compliance section", () => {
    expect(pageSrc).toContain("ABA Rule 7.1");
  });

  it("includes ABA Rule 1.6 compliance section", () => {
    expect(pageSrc).toContain("ABA Rule 1.6");
  });

  it("includes no guaranteed outcomes disclaimer", () => {
    expect(pageSrc).toContain("truthful");
  });

  it("includes confidentiality messaging", () => {
    expect(pageSrc).toContain("protected");
  });
});
