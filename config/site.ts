import { brandConfig } from "./brand";

export const siteConfig = {
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  name: brandConfig.name,
  description: brandConfig.description,
  ogImage: brandConfig.ogImage,

  // Schema.org LocalBusiness structured data
  schema: {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    name: brandConfig.name,
    description: brandConfig.description,
    url: process.env.NEXT_PUBLIC_SITE_URL,
    telephone: brandConfig.contact.phone,
    email: brandConfig.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: brandConfig.location.address,
      addressLocality: brandConfig.location.city,
      addressCountry: brandConfig.location.countryCode,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: brandConfig.location.coordinates.lat,
      longitude: brandConfig.location.coordinates.lng,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "07:00",
        closes: "23:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Saturday", "Sunday"],
        opens: "08:00",
        closes: "22:00",
      },
    ],
    sameAs: Object.values(brandConfig.social).filter(Boolean),
  },
} as const;
