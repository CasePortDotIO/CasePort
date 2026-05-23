/**
 * JSON-LD Schema Generator for Answer Engine Optimization (AEO)
 * 
 * This module generates structured data for:
 * - FAQ Schema (common settlement questions)
 * - Settlement Range Schema (by injury type + state)
 * - Statute of Limitations Schema (jurisdiction-specific)
 * - BreadcrumbList Schema (navigation hierarchy)
 * - LocalBusiness/Attorney Schema (network information)
 * - Dynamic Schema (calculator results)
 * 
 * All schemas follow Google's structured data guidelines for maximum AEO visibility
 */

// Settlement data by injury type and state
const settlementBenchmarks = {
  carAccident: {
    california: { low: 112500, mid: 337500, high: 1125000 },
    texas: { low: 95000, mid: 285000, high: 950000 },
    florida: { low: 105000, mid: 315000, high: 1050000 },
    newyork: { low: 125000, mid: 375000, high: 1250000 },
    illinois: { low: 100000, mid: 300000, high: 1000000 },
  },
  slipAndFall: {
    california: { low: 75000, mid: 225000, high: 750000 },
    texas: { low: 60000, mid: 180000, high: 600000 },
    florida: { low: 70000, mid: 210000, high: 700000 },
    newyork: { low: 85000, mid: 255000, high: 850000 },
    illinois: { low: 65000, mid: 195000, high: 650000 },
  },
  truckAccident: {
    california: { low: 225000, mid: 675000, high: 2250000 },
    texas: { low: 190000, mid: 570000, high: 1900000 },
    florida: { low: 210000, mid: 630000, high: 2100000 },
    newyork: { low: 250000, mid: 750000, high: 2500000 },
    illinois: { low: 200000, mid: 600000, high: 2000000 },
  },
  medicalMalpractice: {
    california: { low: 300000, mid: 900000, high: 3000000 },
    texas: { low: 250000, mid: 750000, high: 2500000 },
    florida: { low: 280000, mid: 840000, high: 2800000 },
    newyork: { low: 350000, mid: 1050000, high: 3500000 },
    illinois: { low: 280000, mid: 840000, high: 2800000 },
  },
  workplaceInjury: {
    california: { low: 150000, mid: 450000, high: 1500000 },
    texas: { low: 120000, mid: 360000, high: 1200000 },
    florida: { low: 140000, mid: 420000, high: 1400000 },
    newyork: { low: 170000, mid: 510000, high: 1700000 },
    illinois: { low: 140000, mid: 420000, high: 1400000 },
  },
};

// Statute of limitations by state
const statuteOfLimitations = {
  california: { years: 2, description: "2 years from injury date" },
  texas: { years: 2, description: "2 years from injury date" },
  florida: { years: 4, description: "4 years from injury date" },
  newyork: { years: 3, description: "3 years from injury date" },
  illinois: { years: 2, description: "2 years from injury date" },
};

// FAQ Schema for AEO
export const generateFAQSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How is a personal injury settlement calculated?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A personal injury settlement is calculated by adding economic damages (medical bills, lost wages, future care) and multiplying by a pain and suffering multiplier (typically 1.5x to 5x based on injury severity). The total is then reduced by attorney fees (usually 33%) and case costs.",
        },
      },
      {
        "@type": "Question",
        name: "What is the average settlement for a car accident?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Average car accident settlements vary significantly by state and injury severity. In California, settlements range from $112,500 (minor injuries) to $1,125,000 (catastrophic injuries). Texas averages $95,000 to $950,000. Consult our settlement calculator for jurisdiction-specific estimates.",
        },
      },
      {
        "@type": "Question",
        name: "Should I hire an attorney for my personal injury case?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Hiring an attorney typically increases settlement amounts by 40-60% through expert negotiation, despite the 33% contingency fee. Insurance companies often offer lower settlements to unrepresented claimants. Our calculator shows both attorney and non-attorney outcomes for comparison.",
        },
      },
      {
        "@type": "Question",
        name: "What is the statute of limitations for a personal injury claim?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The statute of limitations varies by state and injury type. Most states allow 2-4 years from the injury date to file a claim. California and Texas: 2 years. Florida: 4 years. New York: 3 years. Time is critical—missing the deadline bars your claim permanently.",
        },
      },
      {
        "@type": "Question",
        name: "How long does a personal injury settlement take?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Settlement timelines vary: simple cases may settle in 3-6 months, while complex cases can take 1-3 years. Factors include injury severity, liability clarity, insurance company responsiveness, and whether litigation is required.",
        },
      },
      {
        "@type": "Question",
        name: "What damages can I recover in a personal injury case?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can recover economic damages (medical expenses, lost wages, future care costs) and non-economic damages (pain and suffering, emotional distress, loss of enjoyment). Punitive damages are available in cases of gross negligence or intentional misconduct.",
        },
      },
      {
        "@type": "Question",
        name: "Do I have to pay upfront costs for legal representation?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Personal injury attorneys work on contingency—they only get paid if you win. They advance case costs (expert fees, filing fees, investigation) and recover them from the settlement. You pay nothing upfront.",
        },
      },
      {
        "@type": "Question",
        name: "What is comparative negligence and how does it affect my settlement?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Comparative negligence reduces your settlement by your percentage of fault. If you're 20% at fault, your settlement is reduced by 20%. Some states (like California) allow recovery even if you're up to 99% at fault, while others bar recovery if you're more than 50% responsible.",
        },
      },
    ],
  };
};

// Settlement Range Schema for specific injury types and states
export const generateSettlementRangeSchema = (
  injuryType: string,
  state: string
) => {
  const normalizedInjury = injuryType.toLowerCase().replace(/\s+/g, "");
  const normalizedState = state.toLowerCase().replace(/\s+/g, "");

  const injuryData = settlementBenchmarks[normalizedInjury as keyof typeof settlementBenchmarks];
  if (!injuryData) return null;
  
  const benchmark = injuryData[normalizedState as keyof typeof injuryData];

  if (!benchmark) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Average ${injuryType} Settlement in ${state}`,
    description: `Settlement ranges for ${injuryType} cases in ${state}. Low: $${benchmark.low.toLocaleString()}, Mid: $${benchmark.mid.toLocaleString()}, High: $${benchmark.high.toLocaleString()}.`,
    author: {
      "@type": "Organization",
      name: "www.CasePort.io",
      url: "https://www.caseport.io",
    },
    datePublished: new Date().toISOString().split("T")[0],
    articleBody: `Settlement ranges for ${injuryType} cases in ${state} vary based on injury severity, liability clarity, and insurance company responsiveness. Our data shows: Low (minor injuries): $${benchmark.low.toLocaleString()}, Mid (moderate injuries): $${benchmark.mid.toLocaleString()}, High (catastrophic injuries): $${benchmark.high.toLocaleString()}.`,
  };
};

// Statute of Limitations Schema
export const generateStatuteOfLimitationsSchema = (state: string) => {
  const normalizedState = state.toLowerCase().replace(/\s+/g, "");
  const statute =
    statuteOfLimitations[normalizedState as keyof typeof statuteOfLimitations];

  if (!statute) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Statute of Limitations for Personal Injury in ${state}`,
    description: `The statute of limitations for personal injury claims in ${state} is ${statute.years} years from the date of injury.`,
    author: {
      "@type": "Organization",
      name: "www.CasePort.io",
      url: "https://www.caseport.io",
    },
    datePublished: new Date().toISOString().split("T")[0],
    articleBody: `In ${state}, you have ${statute.years} years from the date of your injury to file a personal injury claim. ${statute.description}. Missing this deadline bars your claim permanently. Time is critical—contact an attorney immediately to protect your rights.`,
  };
};

// BreadcrumbList Schema for navigation
export const generateBreadcrumbSchema = (path: string[]) => {
  const items = path.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item,
    item: `https://www.caseport.io/${path.slice(0, index + 1).join("/")}`,
  }));

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
};

// LocalBusiness/Attorney Schema
export const generateAttorneyNetworkSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "www.CasePort.io Attorney Network",
    description:
      "Vetted personal injury attorneys across the United States. Free case review and settlement estimation.",
    url: "https://www.caseport.io",
    telephone: "1-800-227-3669",
    areaServed: [
      { "@type": "State", name: "California" },
      { "@type": "State", name: "Texas" },
      { "@type": "State", name: "Florida" },
      { "@type": "State", name: "New York" },
      { "@type": "State", name: "Illinois" },
    ],
    priceRange: "Free Consultation",
    sameAs: [
      "https://www.caseport.io",
      "https://www.caseport.io/injured/california",
      "https://www.caseport.io/injured/texas",
    ],
  };
};

// Dynamic Schema for Calculator Results
export const generateCalculatorResultSchema = (
  injuryType: string,
  state: string,
  economicDamages: number,
  painAndSufferingMultiplier: number,
  estimatedSettlement: number,
  leadScore: number
) => {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${injuryType} Settlement Estimate in ${state}`,
    description: `Personalized settlement estimate for ${injuryType} case in ${state}. Estimated settlement: $${estimatedSettlement.toLocaleString()}. Economic damages: $${economicDamages.toLocaleString()}. Lead quality score: ${leadScore}/100.`,
    author: {
      "@type": "Organization",
      name: "www.CasePort.io",
      url: "https://www.caseport.io",
    },
    datePublished: new Date().toISOString().split("T")[0],
    articleBody: `Based on your ${injuryType} case in ${state}, your estimated settlement range is: Economic damages: $${economicDamages.toLocaleString()}. Pain and suffering multiplier: ${painAndSufferingMultiplier}x. Total estimated settlement: $${estimatedSettlement.toLocaleString()}. This estimate is based on comparable cases in your jurisdiction and current settlement trends.`,
  };
};

// Organization Schema (for homepage)
export const generateOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "www.CasePort.io",
    url: "https://www.caseport.io",
    logo: "https://www.caseport.io/logo.png",
    description:
      "The authoritative source for personal injury law. Attorney-reviewed guides, settlement calculator, and attorney network.",
    sameAs: [
      "https://www.caseport.io",
      "https://www.caseport.io/injured/california",
      "https://www.caseport.io/injured/texas",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      telephone: "1-800-227-3669",
    },
  };
};

// WebSite Schema (for search engines)
export const generateWebsiteSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "www.CasePort.io",
    url: "https://www.caseport.io",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://www.caseport.io?search={search_term_string}",
      },
      query_input: "required name=search_term_string",
    },
  };
};
