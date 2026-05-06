import { SITE } from "@/lib/seo";

export function providerPersonJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Ryan Kent, FNP-BC",
    jobTitle: "Nurse Practitioner",
    worksFor: {
      "@type": "MedicalBusiness",
      name: SITE.name,
      url: SITE.url,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.streetAddress,
      addressLocality: SITE.address.addressLocality,
      addressRegion: SITE.address.addressRegion,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.addressCountry,
    },
  };
}

export function howToJsonLd(title: string, description: string, steps: string[]) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: title,
    description,
    step: steps.map((text, idx) => ({
      "@type": "HowToStep",
      position: idx + 1,
      text,
    })),
  };
}

export function reviewSchemaPlaceholder(itemName: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: {
      "@type": "Service",
      name: itemName,
      provider: {
        "@type": "MedicalBusiness",
        name: SITE.name,
        url: SITE.url,
      },
    },
    reviewBody: "Placeholder review schema. Publish only approved, consented, real review content.",
    author: { "@type": "Person", name: "Approved Patient" },
    reviewRating: {
      "@type": "Rating",
      ratingValue: "5",
      bestRating: "5",
      worstRating: "1",
    },
  };
}
