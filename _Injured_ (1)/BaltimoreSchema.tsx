import React from 'react';

export function BaltimoreSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "CasePort - Baltimore Personal Injury Attorneys",
    "description": "Connect with experienced Maryland personal injury attorneys in Baltimore. Car accidents, truck collisions, serious injuries. 2-minute case check.",
    "url": "https://www.caseport.io/injured-in-baltimore",
    "telephone": "1-800-CASE-NOW",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Baltimore",
      "addressRegion": "MD",
      "addressCountry": "US"
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "Baltimore",
        "addressRegion": "MD"
      },
      {
        "@type": "State",
        "name": "Maryland"
      },
      {
        "@type": "City",
        "name": "Washington",
        "addressRegion": "DC"
      }
    ],
    "priceRange": "$$",
    "sameAs": [
      "https://www.caseport.io"
    ],
    "knowsAbout": [
      "Personal Injury Law",
      "Car Accident Claims",
      "Truck Accident Claims",
      "Motorcycle Accident Claims",
      "Pedestrian Accident Claims",
      "Maryland Negligence Law",
      "Insurance Claims"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "150"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BaltimoreArticleSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "Baltimore Car Accident Guide: Your Rights Under Maryland Law",
    "description": "Understanding your rights after a Baltimore car accident. Maryland comparative negligence law, insurance tactics, and how to protect yourself.",
    "image": "https://www.caseport.io/baltimore-accident-guide.jpg",
    "datePublished": "2026-04-01",
    "dateModified": "2026-04-04",
    "author": {
      "@type": "Organization",
      "name": "CasePort"
    },
    "publisher": {
      "@type": "Organization",
      "name": "CasePort",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.caseport.io/logo.png"
      }
    },
    "mainEntity": {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Do I need a lawyer after a Baltimore car accident?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "If you have injuries or significant property damage, yes. Insurance companies have teams of lawyers. You should too."
          }
        },
        {
          "@type": "Question",
          "name": "What if I was partly at fault in a Maryland accident?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Maryland law allows recovery even if you're partially at fault. Your compensation is reduced by your percentage of fault."
          }
        },
        {
          "@type": "Question",
          "name": "What is the statute of limitations for a Maryland personal injury claim?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The statute of limitations in Maryland is 3 years. However, evidence degrades and memories fade. Act within days, not months."
          }
        }
      ]
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
