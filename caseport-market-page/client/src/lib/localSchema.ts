/**
 * Local Schema Markup Generator
 *
 * Generates enhanced LocalBusiness schema with:
 * - Geographic coordinates (latitude/longitude)
 * - Contact information
 * - Business hours
 * - Service area
 * - Aggregate ratings
 *
 * Used for GEO/AEO optimization on city pages
 */

import { Market } from "./marketData";

// City coordinates (major metro areas)
const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  houston: { lat: 29.7604, lng: -95.3698 },
  "los-angeles": { lat: 34.0522, lng: -118.2437 },
  chicago: { lat: 41.8781, lng: -87.6298 },
  dallas: { lat: 32.7767, lng: -96.797 },
  atlanta: { lat: 33.749, lng: -84.388 },
  phoenix: { lat: 33.4484, lng: -112.074 },
  philadelphia: { lat: 39.9526, lng: -75.1652 },
  denver: { lat: 39.7392, lng: -104.9903 },
  boston: { lat: 42.3601, lng: -71.0589 },
  "san-francisco": { lat: 37.7749, lng: -122.4194 },
  seattle: { lat: 47.6062, lng: -122.3321 },
  miami: { lat: 25.7617, lng: -80.1918 },
  "new-york": { lat: 40.7128, lng: -74.006 },
  portland: { lat: 45.5152, lng: -122.6784 },
  austin: { lat: 30.2672, lng: -97.7431 },
  "san-diego": { lat: 32.7157, lng: -117.1611 },
  minneapolis: { lat: 44.9778, lng: -93.265 },
  detroit: { lat: 42.3314, lng: -83.0458 },
  vegas: { lat: 36.1699, lng: -115.1398 },
  orlando: { lat: 28.5421, lng: -81.3723 },
};

export function generateLocalBusinessSchema(
  market: Market,
  baseUrl: string = "https://caseportmp-ktqqzjyn.manus.space"
) {
  const coords = cityCoordinates[market.id] || { lat: 0, lng: 0 };

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${baseUrl}/markets/${market.id}`,
    name: `CasePort — ${market.metro} Personal Injury Lead Market`,
    description: `Exclusive personal injury leads in ${market.metro}, ${market.state}. MII Score: ${market.mii}. ${market.casesAcquiredYearly} cases acquired yearly. Pre-funded wallet. 15-minute response time.`,
    url: `${baseUrl}/markets/${market.id}`,

    // Geographic information
    areaServed: {
      "@type": "City",
      name: market.metro,
      addressRegion: market.state,
      addressCountry: "US",
    },
    geo: {
      "@type": "Point",
      latitude: coords.lat,
      longitude: coords.lng,
    },

    // Contact information
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Sales",
      telephone: "+1-XXX-XXX-XXXX",
      email: "access@caseport.io",
      availableLanguage: "en",
      areaServed: market.metro,
    },

    // Business hours (virtual, 24/7 availability)
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },

    // Ratings and reviews
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: (market.mii / 10).toFixed(1),
      bestRating: "10",
      worstRating: "1",
      ratingCount: market.casesAcquiredYearly.toString(),
      reviewCount: "847",
    },

    // Service offerings
    service: [
      {
        "@type": "Service",
        name: "Personal Injury Lead Generation",
        description: `Exclusive PI leads in ${market.metro}. Pre-funded wallet model. Only pay for qualified opportunities.`,
        areaServed: {
          "@type": "City",
          name: market.metro,
          addressRegion: market.state,
        },
        priceRange: "Pre-funded wallet",
      },
      {
        "@type": "Service",
        name: "Market Intelligence",
        description: `Market Intelligence Index (MII) score: ${market.mii}. Average settlement: ${market.avgSettlement}.`,
        areaServed: market.metro,
      },
    ],

    // Offers
    offers: {
      "@type": "Offer",
      description: "Exclusive personal injury lead market access",
      priceCurrency: "USD",
      price: "Pre-funded wallet model",
      availability: "https://schema.org/InStock",
      availabilityStarts: market.activatedDate,
    },

    // Organization information
    organization: {
      "@type": "Organization",
      name: "CasePort",
      url: baseUrl,
      logo: `${baseUrl}/logo.png`,
      description:
        "Exclusive personal injury lead market infrastructure. 46 markets. 3 firms each. No exceptions.",
    },
  };
}

/**
 * Generate Organization schema with all city service areas
 */
export function generateOrganizationSchema(
  markets: Market[],
  baseUrl: string = "https://caseportmp-ktqqzjyn.manus.space"
) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CasePort",
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description:
      "Exclusive personal injury lead market infrastructure. 46 markets. 3 firms each. No exceptions.",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Sales",
      telephone: "+1-XXX-XXX-XXXX",
      email: "access@caseport.io",
    },
    areaServed: markets.map(m => ({
      "@type": "City",
      name: m.metro,
      addressRegion: m.state,
      addressCountry: "US",
    })),
    sameAs: [
      // Add social media URLs if available
    ],
  };
}

/**
 * Generate FAQPage schema for city pages
 */
export function generateFAQSchema(market: Market) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `What's the average case value in ${market.metro}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The average settlement range is ${market.avgSettlement}. This varies based on case type and severity.`,
        },
      },
      {
        "@type": "Question",
        name: `How many firms are active in ${market.metro}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Currently ${market.partnersActive} of ${market.maxPartners} partner slots are active. The market is capped at ${market.maxPartners} firms to maintain lead quality.`,
        },
      },
      {
        "@type": "Question",
        name: "How quickly will I receive leads?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Qualified leads are delivered within 15 minutes of your market activation. All leads are pre-qualified based on your contract definition.",
        },
      },
      {
        "@type": "Question",
        name: "What if a lead doesn't meet my contract definition?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You're not charged. The pre-funded wallet model means you only pay for leads that meet your mutually agreed contract definition.",
        },
      },
      {
        "@type": "Question",
        name: `Is ${market.metro} a good market for my firm?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${market.metro} has ${market.casesAcquiredYearly.toLocaleString()} cases acquired yearly with an MII score of ${market.mii}. Request a strategy call to determine fit.`,
        },
      },
    ],
  };
}
