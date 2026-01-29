import { site } from "@/content/site";

export function SiteJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": ["MedicalBusiness", "LocalBusiness"],
    name: site.name,
    url: site.url,
    description: site.description,
    telephone: site.phone,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      ...site.address,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.geo.latitude,
      longitude: site.geo.longitude,
    },
    areaServed: site.serviceAreas.map((name) => ({ "@type": "City", name })),
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

