import { CityData } from "@/data/cityData";

/**
 * Generate JSON-LD schema markup for SEO and AEO optimization
 * Supports LocalBusiness, Service, BreadcrumbList, FAQPage, and AggregateOffer
 */

export function generateLocalBusinessSchema(cityData: CityData) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `https://www.caseport.io/injured/${cityData.slug}`,
    name: "CasePort.io",
    description: `Personal injury case matching service in ${cityData.city}, ${cityData.state}`,
    url: `https://www.caseport.io/injured/${cityData.slug}`,
    telephone: "+1-800-CASE-PORT",
    email: "support@caseport.io",
    areaServed: {
      "@type": "City",
      name: cityData.city,
      containedInPlace: {
        "@type": "State",
        name: cityData.state,
      },
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: cityData.latitude,
      longitude: cityData.longitude,
    },
    priceRange: "Free",
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "2847",
    },
  };
}

export function generateServiceSchema(cityData: CityData) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Personal Injury Case Matching in ${cityData.city}`,
    description: cityData.copy.description,
    provider: {
      "@type": "Organization",
      name: "CasePort.io",
      url: "https://www.caseport.io",
    },
    areaServed: {
      "@type": "City",
      name: cityData.city,
    },
    serviceType: "Personal Injury Legal Services",
    priceRange: "Free",
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: `https://www.caseport.io/injured/${cityData.slug}`,
      availableLanguage: "en",
    },
  };
}

export function generateBreadcrumbSchema(cityData: CityData) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.caseport.io",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Injured?",
        item: "https://www.caseport.io/injured",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: cityData.city,
        item: `https://www.caseport.io/injured/${cityData.slug}`,
      },
    ],
  };
}

export function generateFAQSchema(faqs: Array<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}

export function generateAggregateOfferSchema(cityData: CityData) {
  return {
    "@context": "https://schema.org",
    "@type": "AggregateOffer",
    name: `Personal Injury Settlement Estimates - ${cityData.city}`,
    description: `Average settlement amounts for personal injury cases in ${cityData.city}`,
    priceCurrency: "USD",
    offers: Object.entries(cityData.settlementRanges).map(([type, range]) => ({
      "@type": "Offer",
      name: type === "car-accident" ? "Car Accident" : type === "slip-fall" ? "Slip & Fall" : type === "medical-malpractice" ? "Medical Malpractice" : "Workplace Injury",
      price: range.avg.replace(/[^0-9]/g, ""),
      priceCurrency: "USD",
      description: `Estimated settlement range: ${range.range}`,
    })),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "2847",
    },
  };
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CasePort.io",
    url: "https://www.caseport.io",
    logo: "https://www.caseport.io/logo.png",
    description: "Connect with top 3% vetted personal injury lawyers in 2 minutes",
    sameAs: [
      "https://www.facebook.com/caseport",
      "https://www.twitter.com/caseport",
      "https://www.linkedin.com/company/caseport",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-800-CASE-PORT",
      contactType: "Customer Service",
      availableLanguage: "en",
    },
  };
}

/**
 * Inject schema markup into document head
 */
export function injectSchema(schema: Record<string, any>) {
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

/**
 * Inject multiple schemas
 */
export function injectSchemas(schemas: Record<string, any>[]) {
  schemas.forEach((schema) => injectSchema(schema));
}
