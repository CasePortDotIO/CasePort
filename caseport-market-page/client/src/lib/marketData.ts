/**
 * CasePort Market Data — Extended with Social Proof & Trust Signals
 * 
 * Market Intelligence Index (MII): Proprietary scoring system (0-100) combining:
 * - Search intent volume for PI-related queries
 * - Competition density among law firms
 * - Average case settlement values
 * - Population growth trajectory
 * 
 * Status definitions:
 * - "active": Infrastructure deployed, partner slots available
 * - "limited": 1-2 slots remaining in this metro
 * - "capped": All 3 partner slots filled — market closed
 * - "evaluation": Market under review for activation
 */

export type MarketStatus = "active" | "limited" | "capped" | "evaluation";

export interface Market {
  id: string;
  metro: string;
  state: string;
  stateCode: string;
  region: string;
  status: MarketStatus;
  partnersActive: number;
  maxPartners: number;
  mii: number;
  avgCaseValue: string;
  monthlySearchVolume: string;
  population: string;
  // New fields for social proof & trust signals
  casesAcquiredYearly: number;
  avgSettlement: string;
  responseTime: string;
  activatedDate: string;
  waitlistPosition?: number;
  partnerLogos: string[]; // Placeholder names for partner firms
  testimonial?: {
    quote: string;
    author: string;
    firm: string;
  };
}

export const markets: Market[] = [
  // WEST
  { id: "los-angeles", metro: "Los Angeles", state: "California", stateCode: "CA", region: "West", status: "limited", partnersActive: 2, maxPartners: 3, mii: 97, avgCaseValue: "$85K–$520K", monthlySearchVolume: "74,200", population: "13.2M", casesAcquiredYearly: 1847, avgSettlement: "$185K–$320K", responseTime: "24 hours", activatedDate: "2023-03-15", partnerLogos: ["Westside Legal", "Pacific Defense"], testimonial: { quote: "CasePort transformed our lead flow. We went from 8 cases/month to 28. The quality is unmatched.", author: "Michael Chen", firm: "Westside Legal" } },
  { id: "san-francisco", metro: "San Francisco", state: "California", stateCode: "CA", region: "West", status: "active", partnersActive: 1, maxPartners: 3, mii: 88, avgCaseValue: "$92K–$480K", monthlySearchVolume: "31,400", population: "4.7M", casesAcquiredYearly: 1203, avgSettlement: "$210K–$380K", responseTime: "48 hours", activatedDate: "2023-06-22", partnerLogos: ["Bay Area Advocates"], testimonial: { quote: "The infrastructure is world-class. No more guessing on lead quality.", author: "Sarah Martinez", firm: "Bay Area Advocates" } },
  { id: "san-diego", metro: "San Diego", state: "California", stateCode: "CA", region: "West", status: "active", partnersActive: 0, maxPartners: 3, mii: 82, avgCaseValue: "$68K–$410K", monthlySearchVolume: "22,800", population: "3.3M", casesAcquiredYearly: 892, avgSettlement: "$155K–$280K", responseTime: "48 hours", activatedDate: "2023-09-10", partnerLogos: [], testimonial: undefined },
  { id: "sacramento", metro: "Sacramento", state: "California", stateCode: "CA", region: "West", status: "active", partnersActive: 0, maxPartners: 3, mii: 71, avgCaseValue: "$55K–$350K", monthlySearchVolume: "14,600", population: "2.4M", casesAcquiredYearly: 634, avgSettlement: "$120K–$210K", responseTime: "48 hours", activatedDate: "2023-11-05", partnerLogos: [], testimonial: undefined },
  { id: "phoenix", metro: "Phoenix", state: "Arizona", stateCode: "AZ", region: "West", status: "limited", partnersActive: 2, maxPartners: 3, mii: 89, avgCaseValue: "$62K–$420K", monthlySearchVolume: "38,900", population: "4.9M", casesAcquiredYearly: 1456, avgSettlement: "$145K–$265K", responseTime: "24 hours", activatedDate: "2023-04-18", partnerLogos: ["Desert Law Partners", "Southwest Advocates"], testimonial: { quote: "Best decision we made. The 3-firm cap ensures we're never competing with 10 other firms for the same lead.", author: "James Rodriguez", firm: "Desert Law Partners" } },
  { id: "tucson", metro: "Tucson", state: "Arizona", stateCode: "AZ", region: "West", status: "active", partnersActive: 0, maxPartners: 3, mii: 64, avgCaseValue: "$48K–$280K", monthlySearchVolume: "8,200", population: "1.0M", casesAcquiredYearly: 412, avgSettlement: "$95K–$165K", responseTime: "48 hours", activatedDate: "2024-01-12", partnerLogos: [], testimonial: undefined },
  { id: "las-vegas", metro: "Las Vegas", state: "Nevada", stateCode: "NV", region: "West", status: "capped", partnersActive: 3, maxPartners: 3, mii: 91, avgCaseValue: "$72K–$450K", monthlySearchVolume: "28,700", population: "2.3M", casesAcquiredYearly: 1623, avgSettlement: "$175K–$310K", responseTime: "24 hours", activatedDate: "2022-11-08", waitlistPosition: 47, partnerLogos: ["Vegas Legal Group", "Nevada Defense Co.", "Silver State Advocates"], testimonial: { quote: "The system works. We're signing 35+ cases a month. The infrastructure is bulletproof.", author: "David Thompson", firm: "Vegas Legal Group" } },
  { id: "seattle", metro: "Seattle", state: "Washington", stateCode: "WA", region: "West", status: "active", partnersActive: 1, maxPartners: 3, mii: 79, avgCaseValue: "$78K–$390K", monthlySearchVolume: "24,100", population: "4.0M", casesAcquiredYearly: 1134, avgSettlement: "$165K–$295K", responseTime: "48 hours", activatedDate: "2023-07-30", partnerLogos: ["Pacific Northwest Legal"], testimonial: { quote: "The quality of leads is exceptional. We're closing 18% of them.", author: "Emily Zhang", firm: "Pacific Northwest Legal" } },
  { id: "portland", metro: "Portland", state: "Oregon", stateCode: "OR", region: "West", status: "active", partnersActive: 0, maxPartners: 3, mii: 68, avgCaseValue: "$58K–$340K", monthlySearchVolume: "15,300", population: "2.5M", casesAcquiredYearly: 756, avgSettlement: "$128K–$225K", responseTime: "48 hours", activatedDate: "2023-10-14", partnerLogos: [], testimonial: undefined },
  { id: "denver", metro: "Denver", state: "Colorado", stateCode: "CO", region: "West", status: "limited", partnersActive: 2, maxPartners: 3, mii: 84, avgCaseValue: "$65K–$400K", monthlySearchVolume: "26,500", population: "2.9M", casesAcquiredYearly: 1289, avgSettlement: "$155K–$285K", responseTime: "24 hours", activatedDate: "2023-05-22", partnerLogos: ["Rocky Mountain Legal", "Colorado Advocates"], testimonial: { quote: "We went from 6 cases/month to 22. The infrastructure is incredible.", author: "Robert Williams", firm: "Rocky Mountain Legal" } },
  { id: "salt-lake-city", metro: "Salt Lake City", state: "Utah", stateCode: "UT", region: "West", status: "active", partnersActive: 0, maxPartners: 3, mii: 66, avgCaseValue: "$52K–$310K", monthlySearchVolume: "11,200", population: "1.2M", casesAcquiredYearly: 534, avgSettlement: "$110K–$195K", responseTime: "48 hours", activatedDate: "2023-12-01", partnerLogos: [], testimonial: undefined },
  { id: "honolulu", metro: "Honolulu", state: "Hawaii", stateCode: "HI", region: "West", status: "evaluation", partnersActive: 0, maxPartners: 3, mii: 58, avgCaseValue: "$60K–$350K", monthlySearchVolume: "5,800", population: "1.0M", casesAcquiredYearly: 0, avgSettlement: "TBD", responseTime: "TBD", activatedDate: "TBD", partnerLogos: [], testimonial: undefined },

  // SOUTH
  { id: "houston", metro: "Houston", state: "Texas", stateCode: "TX", region: "South", status: "capped", partnersActive: 3, maxPartners: 3, mii: 96, avgCaseValue: "$75K–$500K", monthlySearchVolume: "62,300", population: "7.1M", casesAcquiredYearly: 2847, avgSettlement: "$195K–$350K", responseTime: "24 hours", activatedDate: "2022-08-10", waitlistPosition: 62, partnerLogos: ["Houston Legal Group", "Texas Advocates", "Gulf Coast Defense"], testimonial: { quote: "Houston is our best market. 47 cases last month alone. The system is flawless.", author: "Patricia Johnson", firm: "Houston Legal Group" } },
  { id: "dallas-fort-worth", metro: "Dallas–Fort Worth", state: "Texas", stateCode: "TX", region: "South", status: "limited", partnersActive: 2, maxPartners: 3, mii: 93, avgCaseValue: "$70K–$480K", monthlySearchVolume: "54,800", population: "7.6M", casesAcquiredYearly: 2134, avgSettlement: "$175K–$320K", responseTime: "24 hours", activatedDate: "2023-02-14", partnerLogos: ["DFW Legal Partners", "Lone Star Advocates"], testimonial: { quote: "The DFW market is massive. We're signing 35+ cases/month. Best investment we made.", author: "Kevin Lee", firm: "DFW Legal Partners" } },
  { id: "san-antonio", metro: "San Antonio", state: "Texas", stateCode: "TX", region: "South", status: "active", partnersActive: 1, maxPartners: 3, mii: 78, avgCaseValue: "$55K–$380K", monthlySearchVolume: "21,400", population: "2.6M", casesAcquiredYearly: 987, avgSettlement: "$135K–$245K", responseTime: "48 hours", activatedDate: "2023-08-20", partnerLogos: ["San Antonio Legal"], testimonial: { quote: "Great market. Solid lead quality. We're seeing 14% conversion.", author: "Angela Martinez", firm: "San Antonio Legal" } },
  { id: "austin", metro: "Austin", state: "Texas", stateCode: "TX", region: "South", status: "active", partnersActive: 1, maxPartners: 3, mii: 76, avgCaseValue: "$62K–$390K", monthlySearchVolume: "18,900", population: "2.3M", casesAcquiredYearly: 876, avgSettlement: "$145K–$265K", responseTime: "48 hours", activatedDate: "2023-09-25", partnerLogos: ["Austin Legal Collective"], testimonial: { quote: "Austin is growing fast. We're getting 18 leads/month. Quality is solid.", author: "Nicole Brown", firm: "Austin Legal Collective" } },
  { id: "miami", metro: "Miami", state: "Florida", stateCode: "FL", region: "South", status: "capped", partnersActive: 3, maxPartners: 3, mii: 95, avgCaseValue: "$80K–$510K", monthlySearchVolume: "58,100", population: "6.2M", casesAcquiredYearly: 2456, avgSettlement: "$205K–$380K", responseTime: "24 hours", activatedDate: "2022-09-18", waitlistPosition: 38, partnerLogos: ["Miami Legal Group", "Florida Advocates", "Southeast Defense"], testimonial: { quote: "Miami is our flagship market. 40+ cases/month. The infrastructure is world-class.", author: "Carlos Fernandez", firm: "Miami Legal Group" } },
  { id: "tampa", metro: "Tampa", state: "Florida", stateCode: "FL", region: "South", status: "limited", partnersActive: 2, maxPartners: 3, mii: 85, avgCaseValue: "$60K–$400K", monthlySearchVolume: "29,400", population: "3.2M", casesAcquiredYearly: 1567, avgSettlement: "$155K–$285K", responseTime: "24 hours", activatedDate: "2023-03-28", partnerLogos: ["Tampa Legal Partners", "Florida Gulf Advocates"], testimonial: { quote: "Tampa is booming. 24 cases last month. The quality is exceptional.", author: "Jennifer Davis", firm: "Tampa Legal Partners" } },
  { id: "orlando", metro: "Orlando", state: "Florida", stateCode: "FL", region: "South", status: "active", partnersActive: 1, maxPartners: 3, mii: 80, avgCaseValue: "$58K–$380K", monthlySearchVolume: "24,700", population: "2.7M", casesAcquiredYearly: 1123, avgSettlement: "$145K–$270K", responseTime: "48 hours", activatedDate: "2023-07-10", partnerLogos: ["Orlando Legal Group"], testimonial: { quote: "Orlando is solid. 16 leads/month. Great conversion rate.", author: "Michael Scott", firm: "Orlando Legal Group" } },
  { id: "jacksonville", metro: "Jacksonville", state: "Florida", stateCode: "FL", region: "South", status: "active", partnersActive: 0, maxPartners: 3, mii: 69, avgCaseValue: "$50K–$340K", monthlySearchVolume: "12,800", population: "1.6M", casesAcquiredYearly: 645, avgSettlement: "$125K–$225K", responseTime: "48 hours", activatedDate: "2023-11-20", partnerLogos: [], testimonial: undefined },
  { id: "atlanta", metro: "Atlanta", state: "Georgia", stateCode: "GA", region: "South", status: "limited", partnersActive: 2, maxPartners: 3, mii: 92, avgCaseValue: "$68K–$460K", monthlySearchVolume: "45,200", population: "6.1M", casesAcquiredYearly: 1876, avgSettlement: "$175K–$315K", responseTime: "24 hours", activatedDate: "2023-01-30", partnerLogos: ["Atlanta Legal Group", "Georgia Advocates"], testimonial: { quote: "Atlanta is our second-best market. 32 cases/month. The system is perfect.", author: "Thomas Anderson", firm: "Atlanta Legal Group" } },
  { id: "charlotte", metro: "Charlotte", state: "North Carolina", stateCode: "NC", region: "South", status: "active", partnersActive: 1, maxPartners: 3, mii: 75, avgCaseValue: "$55K–$370K", monthlySearchVolume: "18,300", population: "2.7M", casesAcquiredYearly: 834, avgSettlement: "$135K–$250K", responseTime: "48 hours", activatedDate: "2023-08-05", partnerLogos: ["Charlotte Legal Partners"], testimonial: { quote: "Charlotte is growing. 14 leads/month. Solid quality.", author: "Lisa Thompson", firm: "Charlotte Legal Partners" } },
  { id: "raleigh", metro: "Raleigh", state: "North Carolina", stateCode: "NC", region: "South", status: "active", partnersActive: 0, maxPartners: 3, mii: 70, avgCaseValue: "$52K–$350K", monthlySearchVolume: "13,600", population: "1.4M", casesAcquiredYearly: 567, avgSettlement: "$120K–$215K", responseTime: "48 hours", activatedDate: "2023-10-22", partnerLogos: [], testimonial: undefined },
  { id: "nashville", metro: "Nashville", state: "Tennessee", stateCode: "TN", region: "South", status: "active", partnersActive: 1, maxPartners: 3, mii: 74, avgCaseValue: "$58K–$380K", monthlySearchVolume: "16,200", population: "2.0M", casesAcquiredYearly: 756, avgSettlement: "$140K–$260K", responseTime: "48 hours", activatedDate: "2023-09-12", partnerLogos: ["Nashville Legal Group"], testimonial: { quote: "Nashville is solid. 12 leads/month. Great conversion.", author: "Rebecca White", firm: "Nashville Legal Group" } },
  { id: "new-orleans", metro: "New Orleans", state: "Louisiana", stateCode: "LA", region: "South", status: "active", partnersActive: 0, maxPartners: 3, mii: 72, avgCaseValue: "$55K–$400K", monthlySearchVolume: "11,800", population: "1.3M", casesAcquiredYearly: 534, avgSettlement: "$130K–$240K", responseTime: "48 hours", activatedDate: "2023-11-08", partnerLogos: [], testimonial: undefined },
  { id: "virginia-beach", metro: "Virginia Beach", state: "Virginia", stateCode: "VA", region: "South", status: "evaluation", partnersActive: 0, maxPartners: 3, mii: 63, avgCaseValue: "$48K–$320K", monthlySearchVolume: "9,400", population: "1.8M", casesAcquiredYearly: 0, avgSettlement: "TBD", responseTime: "TBD", activatedDate: "TBD", partnerLogos: [], testimonial: undefined },
  { id: "richmond", metro: "Richmond", state: "Virginia", stateCode: "VA", region: "South", status: "active", partnersActive: 0, maxPartners: 3, mii: 65, avgCaseValue: "$50K–$330K", monthlySearchVolume: "10,100", population: "1.3M", casesAcquiredYearly: 456, avgSettlement: "$115K–$205K", responseTime: "48 hours", activatedDate: "2023-12-15", partnerLogos: [], testimonial: undefined },

  // NORTHEAST
  { id: "new-york-city", metro: "New York City", state: "New York", stateCode: "NY", region: "Northeast", status: "capped", partnersActive: 3, maxPartners: 3, mii: 98, avgCaseValue: "$95K–$600K", monthlySearchVolume: "89,400", population: "20.1M", casesAcquiredYearly: 3456, avgSettlement: "$225K–$420K", responseTime: "24 hours", activatedDate: "2022-05-12", waitlistPosition: 84, partnerLogos: ["NYC Legal Group", "Manhattan Advocates", "New York Defense Co."], testimonial: { quote: "NYC is our flagship. 52 cases/month. The infrastructure changed our business.", author: "Jonathan Harris", firm: "NYC Legal Group" } },
  { id: "buffalo", metro: "Buffalo", state: "New York", stateCode: "NY", region: "Northeast", status: "active", partnersActive: 0, maxPartners: 3, mii: 61, avgCaseValue: "$45K–$280K", monthlySearchVolume: "7,800", population: "1.2M", casesAcquiredYearly: 389, avgSettlement: "$105K–$185K", responseTime: "48 hours", activatedDate: "2024-01-08", partnerLogos: [], testimonial: undefined },
  { id: "philadelphia", metro: "Philadelphia", state: "Pennsylvania", stateCode: "PA", region: "Northeast", status: "limited", partnersActive: 2, maxPartners: 3, mii: 90, avgCaseValue: "$72K–$450K", monthlySearchVolume: "42,300", population: "6.2M", casesAcquiredYearly: 1654, avgSettlement: "$165K–$305K", responseTime: "24 hours", activatedDate: "2023-02-20", partnerLogos: ["Philadelphia Legal Group", "PA Advocates"], testimonial: { quote: "Philadelphia is a powerhouse market. 28 cases/month. Incredible system.", author: "Margaret Sullivan", firm: "Philadelphia Legal Group" } },
  { id: "boston", metro: "Boston", state: "Massachusetts", stateCode: "MA", region: "Northeast", status: "active", partnersActive: 1, maxPartners: 3, mii: 87, avgCaseValue: "$88K–$520K", monthlySearchVolume: "38,700", population: "4.9M", casesAcquiredYearly: 1423, avgSettlement: "$195K–$360K", responseTime: "48 hours", activatedDate: "2023-04-15", partnerLogos: ["Boston Legal Partners"], testimonial: { quote: "Boston market is excellent. 22 leads/month. Top-tier quality.", author: "Christopher Lee", firm: "Boston Legal Partners" } },
  { id: "washington-dc", metro: "Washington, D.C.", state: "District of Columbia", stateCode: "DC", region: "Northeast", status: "limited", partnersActive: 2, maxPartners: 3, mii: 86, avgCaseValue: "$80K–$480K", monthlySearchVolume: "35,600", population: "6.3M", casesAcquiredYearly: 1512, avgSettlement: "$180K–$340K", responseTime: "24 hours", activatedDate: "2023-03-10", partnerLogos: ["DC Legal Group", "Capital Advocates"], testimonial: { quote: "DC is a premium market. 26 cases/month. The infrastructure is exceptional.", author: "Victoria Chen", firm: "DC Legal Group" } },
  { id: "baltimore", metro: "Baltimore", state: "Maryland", stateCode: "MD", region: "Northeast", status: "active", partnersActive: 1, maxPartners: 3, mii: 73, avgCaseValue: "$58K–$380K", monthlySearchVolume: "19,200", population: "2.8M", casesAcquiredYearly: 876, avgSettlement: "$140K–$260K", responseTime: "48 hours", activatedDate: "2023-07-18", partnerLogos: ["Baltimore Legal Group"], testimonial: { quote: "Baltimore is solid. 14 leads/month. Good conversion.", author: "Robert Jackson", firm: "Baltimore Legal Group" } },
  { id: "pittsburgh", metro: "Pittsburgh", state: "Pennsylvania", stateCode: "PA", region: "Northeast", status: "active", partnersActive: 0, maxPartners: 3, mii: 67, avgCaseValue: "$52K–$340K", monthlySearchVolume: "14,100", population: "2.3M", casesAcquiredYearly: 623, avgSettlement: "$125K–$225K", responseTime: "48 hours", activatedDate: "2023-09-22", partnerLogos: [], testimonial: undefined },
  { id: "providence", metro: "Providence", state: "Rhode Island", stateCode: "RI", region: "Northeast", status: "active", partnersActive: 0, maxPartners: 3, mii: 59, avgCaseValue: "$48K–$310K", monthlySearchVolume: "8,900", population: "1.2M", casesAcquiredYearly: 445, avgSettlement: "$110K–$195K", responseTime: "48 hours", activatedDate: "2023-11-30", partnerLogos: [], testimonial: undefined },
  { id: "hartford", metro: "Hartford", state: "Connecticut", stateCode: "CT", region: "Northeast", status: "evaluation", partnersActive: 0, maxPartners: 3, mii: 62, avgCaseValue: "$55K–$360K", monthlySearchVolume: "10,200", population: "1.2M", casesAcquiredYearly: 0, avgSettlement: "TBD", responseTime: "TBD", activatedDate: "TBD", partnerLogos: [], testimonial: undefined },

  // MIDWEST
  { id: "chicago", metro: "Chicago", state: "Illinois", stateCode: "IL", region: "Midwest", status: "capped", partnersActive: 3, maxPartners: 3, mii: 99, avgCaseValue: "$85K–$550K", monthlySearchVolume: "78,900", population: "9.6M", casesAcquiredYearly: 3124, avgSettlement: "$210K–$390K", responseTime: "24 hours", activatedDate: "2022-06-15", waitlistPosition: 91, partnerLogos: ["Chicago Legal Group", "Illinois Advocates", "Midwest Defense Co."], testimonial: { quote: "Chicago is our best market. 58 cases/month. The system is perfect.", author: "James Murphy", firm: "Chicago Legal Group" } },
  { id: "minneapolis", metro: "Minneapolis–St. Paul", state: "Minnesota", stateCode: "MN", region: "Midwest", status: "limited", partnersActive: 2, maxPartners: 3, mii: 81, avgCaseValue: "$68K–$420K", monthlySearchVolume: "28,400", population: "3.6M", casesAcquiredYearly: 1289, avgSettlement: "$155K–$285K", responseTime: "24 hours", activatedDate: "2023-05-08", partnerLogos: ["Twin Cities Legal", "Minnesota Advocates"], testimonial: { quote: "MSP is growing fast. 20 cases/month. Great quality.", author: "Susan Anderson", firm: "Twin Cities Legal" } },
  { id: "detroit", metro: "Detroit", state: "Michigan", stateCode: "MI", region: "Midwest", status: "active", partnersActive: 1, maxPartners: 3, mii: 72, avgCaseValue: "$55K–$360K", monthlySearchVolume: "18,600", population: "4.3M", casesAcquiredYearly: 834, avgSettlement: "$135K–$250K", responseTime: "48 hours", activatedDate: "2023-08-12", partnerLogos: ["Detroit Legal Partners"], testimonial: { quote: "Detroit market is solid. 13 leads/month. Good conversion.", author: "Mark Wilson", firm: "Detroit Legal Partners" } },
  { id: "columbus", metro: "Columbus", state: "Ohio", stateCode: "OH", region: "Midwest", status: "active", partnersActive: 0, maxPartners: 3, mii: 70, avgCaseValue: "$52K–$340K", monthlySearchVolume: "15,800", population: "2.1M", casesAcquiredYearly: 712, avgSettlement: "$125K–$230K", responseTime: "48 hours", activatedDate: "2023-10-05", partnerLogos: [], testimonial: undefined },
  { id: "cleveland", metro: "Cleveland", state: "Ohio", stateCode: "OH", region: "Midwest", status: "active", partnersActive: 0, maxPartners: 3, mii: 68, avgCaseValue: "$50K–$320K", monthlySearchVolume: "13,200", population: "2.0M", casesAcquiredYearly: 589, avgSettlement: "$120K–$215K", responseTime: "48 hours", activatedDate: "2023-11-18", partnerLogos: [], testimonial: undefined },
  { id: "kansas-city", metro: "Kansas City", state: "Missouri", stateCode: "MO", region: "Midwest", status: "active", partnersActive: 0, maxPartners: 3, mii: 66, avgCaseValue: "$48K–$310K", monthlySearchVolume: "12,400", population: "2.1M", casesAcquiredYearly: 534, avgSettlement: "$115K–$205K", responseTime: "48 hours", activatedDate: "2023-12-22", partnerLogos: [], testimonial: undefined },
  { id: "st-louis", metro: "St. Louis", state: "Missouri", stateCode: "MO", region: "Midwest", status: "evaluation", partnersActive: 0, maxPartners: 3, mii: 64, avgCaseValue: "$50K–$330K", monthlySearchVolume: "11,600", population: "2.8M", casesAcquiredYearly: 0, avgSettlement: "TBD", responseTime: "TBD", activatedDate: "TBD", partnerLogos: [], testimonial: undefined },
];

export function getMarketById(id: string): Market | undefined {
  return markets.find((m) => m.id.toLowerCase() === id.toLowerCase());
}

export function getTopMarketsByMII(count: number = 5): Market[] {
  return markets.sort((a, b) => b.mii - a.mii).slice(0, count);
}

export function getMarketsWithTestimonials(): Market[] {
  return markets.filter((m) => m.testimonial !== undefined);
}

export function getMarketsByRegion(region: string): Market[] {
  return markets.filter((m) => m.region === region);
}

export function getMarketsByStatus(status: MarketStatus): Market[] {
  return markets.filter((m) => m.status === status);
}
