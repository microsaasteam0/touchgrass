import React from 'react';

export const OrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "TouchGrass",
  "url": "https://touchgrass.now",
  "logo": "https://touchgrass.now/logo.png",
  "description": "Daily accountability platform using behavioral psychology to build lasting habits.",
  "sameAs": [
    "https://twitter.com/touchgrass",
    "https://linkedin.com/company/touchgrass",
    "https://github.com/touchgrass"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "support@touchgrass.now",
    "contactType": "customer support"
  }
});

export const FAQSchema = (questions = []) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": questions.map(q => ({
    "@type": "Question",
    "name": q.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": q.answer
    }
  }))
});

export const BreadcrumbSchema = (items = []) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});

export const ProductSchema = () => ({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "TouchGrass",
  "description": "Daily accountability platform using streak-based psychology to build outdoor habits.",
  "applicationCategory": "HealthApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "1248"
  }
});