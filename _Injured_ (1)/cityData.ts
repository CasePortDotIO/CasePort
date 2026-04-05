/**
 * City data with settlements, copy, and JSON-LD schema
 * Used for geo-personalization and per-city landing pages
 */

export interface CitySettlement {
  name: string;
  city: string;
  state: string;
  stateCode: string;
  injury: string;
  amount: string;
  timeframe: string;
}

export interface CityData {
  city: string;
  state: string;
  stateCode: string;
  slug: string;
  latitude: number;
  longitude: number;
  copy: {
    headline: string;
    subheadline: string;
    description: string;
  };
  settlements: CitySettlement[];
  settlementRanges: Record<string, { range: string; avg: string }>;
  stats: {
    casesMatched: number;
    avgResponse: number;
    firmAcceptance: number;
  };
}

export const cityDatabase: Record<string, CityData> = {
  "los-angeles": {
    city: "Los Angeles",
    state: "California",
    stateCode: "CA",
    slug: "los-angeles",
    latitude: 34.0522,
    longitude: -118.2437,
    copy: {
      headline: "Car Accidents in Los Angeles",
      subheadline: "Get connected to top personal injury firms in LA",
      description:
        "Los Angeles has some of the highest settlement amounts in the nation. Our network includes the top 3% of personal injury firms in LA County.",
    },
    settlements: [
      { name: "James M.", city: "Los Angeles", state: "CA", stateCode: "CA", injury: "Car Accident", amount: "$450K", timeframe: "14 months ago" },
      { name: "Michael R.", city: "Los Angeles", state: "CA", stateCode: "CA", injury: "Car Accident", amount: "$520K", timeframe: "16 months ago" },
      { name: "Patricia L.", city: "Los Angeles", state: "CA", stateCode: "CA", injury: "Slip & Fall", amount: "$380K", timeframe: "12 months ago" },
      { name: "David C.", city: "Los Angeles", state: "CA", stateCode: "CA", injury: "Workplace Injury", amount: "$425K", timeframe: "10 months ago" },
      { name: "Sarah J.", city: "Los Angeles", state: "CA", stateCode: "CA", injury: "Medical Malpractice", amount: "$750K", timeframe: "18 months ago" },
      { name: "Robert K.", city: "Los Angeles", state: "CA", stateCode: "CA", injury: "Car Accident", amount: "$385K", timeframe: "8 months ago" },
    ],
    settlementRanges: {
      "car-accident": { range: "$200K - $850K", avg: "~$425K" },
      "slip-fall": { range: "$100K - $500K", avg: "~$250K" },
      "medical-malpractice": { range: "$300K - $2M+", avg: "~$850K" },
      "workplace-injury": { range: "$150K - $600K", avg: "~$300K" },
    },
    stats: {
      casesMatched: 487,
      avgResponse: 2,
      firmAcceptance: 82,
    },
  },
  chicago: {
    city: "Chicago",
    state: "Illinois",
    stateCode: "IL",
    slug: "chicago",
    latitude: 41.8781,
    longitude: -87.6298,
    copy: {
      headline: "Personal Injury Cases in Chicago",
      subheadline: "Connect with top-rated Illinois personal injury lawyers",
      description:
        "Chicago's legal market is competitive and experienced. Our vetted firms have a strong track record of settlements and trial wins.",
    },
    settlements: [
      { name: "Maria S.", city: "Chicago", state: "IL", stateCode: "IL", injury: "Slip & Fall", amount: "$320K", timeframe: "11 months ago" },
      { name: "Thomas B.", city: "Chicago", state: "IL", stateCode: "IL", injury: "Car Accident", amount: "$380K", timeframe: "9 months ago" },
      { name: "Jennifer W.", city: "Chicago", state: "IL", stateCode: "IL", injury: "Workplace Injury", amount: "$290K", timeframe: "13 months ago" },
      { name: "Christopher M.", city: "Chicago", state: "IL", stateCode: "IL", injury: "Medical Malpractice", amount: "$620K", timeframe: "15 months ago" },
      { name: "Amanda R.", city: "Chicago", state: "IL", stateCode: "IL", injury: "Slip & Fall", amount: "$275K", timeframe: "7 months ago" },
      { name: "Kevin T.", city: "Chicago", state: "IL", stateCode: "IL", injury: "Car Accident", amount: "$410K", timeframe: "12 months ago" },
    ],
    settlementRanges: {
      "car-accident": { range: "$150K - $700K", avg: "~$350K" },
      "slip-fall": { range: "$75K - $400K", avg: "~$200K" },
      "medical-malpractice": { range: "$250K - $1.5M", avg: "~$650K" },
      "workplace-injury": { range: "$100K - $500K", avg: "~$250K" },
    },
    stats: {
      casesMatched: 356,
      avgResponse: 2,
      firmAcceptance: 79,
    },
  },
  houston: {
    city: "Houston",
    state: "Texas",
    stateCode: "TX",
    slug: "houston",
    latitude: 29.7604,
    longitude: -95.3698,
    copy: {
      headline: "Personal Injury Claims in Houston",
      subheadline: "Get matched with experienced Texas injury lawyers",
      description:
        "Houston's legal market is known for aggressive representation and strong jury verdicts. Our network includes the best firms in the Houston area.",
    },
    settlements: [
      { name: "David L.", city: "Houston", state: "TX", stateCode: "TX", injury: "Medical Malpractice", amount: "$875K", timeframe: "18 months ago" },
      { name: "Lisa H.", city: "Houston", state: "TX", stateCode: "TX", injury: "Car Accident", amount: "$520K", timeframe: "14 months ago" },
      { name: "Marcus D.", city: "Houston", state: "TX", stateCode: "TX", injury: "Workplace Injury", amount: "$385K", timeframe: "11 months ago" },
      { name: "Nicole P.", city: "Houston", state: "TX", stateCode: "TX", injury: "Slip & Fall", amount: "$310K", timeframe: "10 months ago" },
      { name: "James E.", city: "Houston", state: "TX", stateCode: "TX", injury: "Medical Malpractice", amount: "$725K", timeframe: "16 months ago" },
      { name: "Rachel G.", city: "Houston", state: "TX", stateCode: "TX", injury: "Car Accident", amount: "$445K", timeframe: "13 months ago" },
    ],
    settlementRanges: {
      "car-accident": { range: "$175K - $750K", avg: "~$400K" },
      "slip-fall": { range: "$80K - $420K", avg: "~$220K" },
      "medical-malpractice": { range: "$300K - $2M+", avg: "~$800K" },
      "workplace-injury": { range: "$120K - $550K", avg: "~$280K" },
    },
    stats: {
      casesMatched: 412,
      avgResponse: 2,
      firmAcceptance: 81,
    },
  },
  "new-york": {
    city: "New York",
    state: "New York",
    stateCode: "NY",
    slug: "new-york",
    latitude: 40.7128,
    longitude: -74.006,
    copy: {
      headline: "Personal Injury Cases in New York",
      subheadline: "Connect with top Manhattan and NYC injury lawyers",
      description:
        "New York has the most experienced personal injury bar in the nation. Our network includes the top 3% of firms in NYC and the surrounding area.",
    },
    settlements: [
      { name: "Alex T.", city: "New York", state: "NY", stateCode: "NY", injury: "Car Accident", amount: "$485K", timeframe: "15 months ago" },
      { name: "Victoria S.", city: "New York", state: "NY", stateCode: "NY", injury: "Medical Malpractice", amount: "$920K", timeframe: "19 months ago" },
      { name: "Daniel F.", city: "New York", state: "NY", stateCode: "NY", injury: "Slip & Fall", amount: "$350K", timeframe: "12 months ago" },
      { name: "Sophie M.", city: "New York", state: "NY", stateCode: "NY", injury: "Workplace Injury", amount: "$420K", timeframe: "14 months ago" },
      { name: "Andrew K.", city: "New York", state: "NY", stateCode: "NY", injury: "Car Accident", amount: "$510K", timeframe: "17 months ago" },
      { name: "Emma L.", city: "New York", state: "NY", stateCode: "NY", injury: "Medical Malpractice", amount: "$850K", timeframe: "20 months ago" },
    ],
    settlementRanges: {
      "car-accident": { range: "$200K - $800K", avg: "~$450K" },
      "slip-fall": { range: "$120K - $500K", avg: "~$280K" },
      "medical-malpractice": { range: "$350K - $2.5M+", avg: "~$900K" },
      "workplace-injury": { range: "$150K - $600K", avg: "~$320K" },
    },
    stats: {
      casesMatched: 523,
      avgResponse: 2,
      firmAcceptance: 84,
    },
  },
  miami: {
    city: "Miami",
    state: "Florida",
    stateCode: "FL",
    slug: "miami",
    latitude: 25.7617,
    longitude: -80.1918,
    copy: {
      headline: "Personal Injury Claims in Miami",
      subheadline: "Get connected to top Florida injury lawyers",
      description:
        "Miami's legal market is known for aggressive representation and high-value settlements. Our network includes the best personal injury firms in South Florida.",
    },
    settlements: [
      { name: "Casey R.", city: "Miami", state: "FL", stateCode: "FL", injury: "Workplace Injury", amount: "$340K", timeframe: "8 months ago" },
      { name: "Monica L.", city: "Miami", state: "FL", stateCode: "FL", injury: "Car Accident", amount: "$465K", timeframe: "13 months ago" },
      { name: "Ricardo V.", city: "Miami", state: "FL", stateCode: "FL", injury: "Slip & Fall", amount: "$295K", timeframe: "9 months ago" },
      { name: "Isabella C.", city: "Miami", state: "FL", stateCode: "FL", injury: "Medical Malpractice", amount: "$780K", timeframe: "17 months ago" },
      { name: "Carlos M.", city: "Miami", state: "FL", stateCode: "FL", injury: "Car Accident", amount: "$510K", timeframe: "15 months ago" },
      { name: "Gabriela S.", city: "Miami", state: "FL", stateCode: "FL", injury: "Workplace Injury", amount: "$375K", timeframe: "11 months ago" },
    ],
    settlementRanges: {
      "car-accident": { range: "$180K - $700K", avg: "~$380K" },
      "slip-fall": { range: "$85K - $410K", avg: "~$210K" },
      "medical-malpractice": { range: "$280K - $1.8M", avg: "~$750K" },
      "workplace-injury": { range: "$130K - $520K", avg: "~$270K" },
    },
    stats: {
      casesMatched: 378,
      avgResponse: 2,
      firmAcceptance: 80,
    },
  },
  phoenix: {
    city: "Phoenix",
    state: "Arizona",
    stateCode: "AZ",
    slug: "phoenix",
    latitude: 33.4484,
    longitude: -112.074,
    copy: {
      headline: "Personal Injury Cases in Phoenix",
      subheadline: "Connect with top Arizona injury lawyers",
      description:
        "Phoenix's legal market is competitive and efficient. Our network includes experienced personal injury firms throughout the Phoenix metropolitan area.",
    },
    settlements: [
      { name: "Sarah K.", city: "Phoenix", state: "AZ", stateCode: "AZ", injury: "Workplace Injury", amount: "$275K", timeframe: "9 months ago" },
      { name: "Brandon H.", city: "Phoenix", state: "AZ", stateCode: "AZ", injury: "Car Accident", amount: "$395K", timeframe: "11 months ago" },
      { name: "Megan T.", city: "Phoenix", state: "AZ", stateCode: "AZ", injury: "Slip & Fall", amount: "$265K", timeframe: "8 months ago" },
      { name: "Tyler J.", city: "Phoenix", state: "AZ", stateCode: "AZ", injury: "Medical Malpractice", amount: "$650K", timeframe: "14 months ago" },
      { name: "Jessica N.", city: "Phoenix", state: "AZ", stateCode: "AZ", injury: "Car Accident", amount: "$420K", timeframe: "12 months ago" },
      { name: "Nathan R.", city: "Phoenix", state: "AZ", stateCode: "AZ", injury: "Workplace Injury", amount: "$310K", timeframe: "10 months ago" },
    ],
    settlementRanges: {
      "car-accident": { range: "$160K - $650K", avg: "~$340K" },
      "slip-fall": { range: "$70K - $380K", avg: "~$190K" },
      "medical-malpractice": { range: "$240K - $1.6M", avg: "~$700K" },
      "workplace-injury": { range: "$110K - $480K", avg: "~$240K" },
    },
    stats: {
      casesMatched: 298,
      avgResponse: 2,
      firmAcceptance: 78,
    },
  },
  seattle: {
    city: "Seattle",
    state: "Washington",
    stateCode: "WA",
    slug: "seattle",
    latitude: 47.6062,
    longitude: -122.3321,
    copy: {
      headline: "Personal Injury Claims in Seattle",
      subheadline: "Get matched with top Washington state injury lawyers",
      description:
        "Seattle's legal market is known for progressive representation and strong jury verdicts. Our network includes the best personal injury firms in the Pacific Northwest.",
    },
    settlements: [
      { name: "Jessica T.", city: "Seattle", state: "WA", stateCode: "WA", injury: "Slip & Fall", amount: "$380K", timeframe: "12 months ago" },
      { name: "Matthew P.", city: "Seattle", state: "WA", stateCode: "WA", injury: "Car Accident", amount: "$475K", timeframe: "14 months ago" },
      { name: "Lauren D.", city: "Seattle", state: "WA", stateCode: "WA", injury: "Workplace Injury", amount: "$340K", timeframe: "10 months ago" },
      { name: "Joshua C.", city: "Seattle", state: "WA", stateCode: "WA", injury: "Medical Malpractice", amount: "$820K", timeframe: "18 months ago" },
      { name: "Rachel M.", city: "Seattle", state: "WA", stateCode: "WA", injury: "Car Accident", amount: "$510K", timeframe: "16 months ago" },
      { name: "Kevin B.", city: "Seattle", state: "WA", stateCode: "WA", injury: "Slip & Fall", amount: "$345K", timeframe: "11 months ago" },
    ],
    settlementRanges: {
      "car-accident": { range: "$190K - $750K", avg: "~$410K" },
      "slip-fall": { range: "$95K - $450K", avg: "~$240K" },
      "medical-malpractice": { range: "$310K - $2M", avg: "~$800K" },
      "workplace-injury": { range: "$140K - $550K", avg: "~$290K" },
    },
    stats: {
      casesMatched: 334,
      avgResponse: 2,
      firmAcceptance: 81,
    },
  },
};

/**
 * Get city data by slug or return default (New York)
 */
export function getCityData(slug: string): CityData {
  return cityDatabase[slug.toLowerCase()] || cityDatabase["new-york"];
}

/**
 * Get nearest cities by latitude/longitude
 */
export function getNearestCities(latitude: number, longitude: number, limit = 3): CityData[] {
  const distances = Object.values(cityDatabase).map((city) => ({
    city,
    distance: Math.sqrt(Math.pow(city.latitude - latitude, 2) + Math.pow(city.longitude - longitude, 2)),
  }));

  return distances.sort((a, b) => a.distance - b.distance).slice(0, limit).map((d) => d.city);
}

/**
 * Get all city slugs for routing
 */
export function getAllCitySlugs(): string[] {
  return Object.keys(cityDatabase);
}
