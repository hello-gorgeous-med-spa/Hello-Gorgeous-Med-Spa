import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LASER_HAIR_MEMBERSHIPS, LASER_HAIR_MEMBERSHIPS_CITIES } from "@/data/laser-hair-memberships";
import { SITE } from "@/lib/seo";
import { LaserHairMembershipsContent } from "./LaserHairMembershipsContent";

const CITY_SLUGS = LASER_HAIR_MEMBERSHIPS_CITIES.map((c) => `${c.slug}-il`);

export async function generateStaticParams() {
  return CITY_SLUGS.map((city) => ({ city }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  const cityConfig = LASER_HAIR_MEMBERSHIPS_CITIES.find((c) => `${c.slug}-il` === city);
  if (!cityConfig) return { title: "Laser Hair Memberships | Hello Gorgeous" };

  const cityName = cityConfig.name;
  return {
    title: `Laser Hair Removal Memberships Near ${cityName} IL | From $69/month | Hello Gorgeous`,
    description: `Laser hair removal memberships from $69/month near ${cityName}, IL. Up to 30% savings. Excellent results after 2 visits! Small, Medium, Large & Full Body plans. ${cityConfig.driveTime} from ${cityName}.`,
    keywords: [
      `laser hair removal ${cityName}`,
      `laser hair membership ${cityName}`,
      `permanent hair removal ${cityName} IL`,
      `bikini laser ${cityName}`,
      `underarm laser ${cityName}`,
      `laser hair removal near ${cityName}`,
    ],
    alternates: { canonical: `${SITE.url}/laser-hair-memberships/${city}` },
    openGraph: {
      url: `${SITE.url}/laser-hair-memberships/${city}`,
      title: `Laser Hair Memberships Near ${cityName} | From $69/month | Hello Gorgeous`,
      description: `From $69/month. Excellent results after 2 visits. ${cityConfig.driveTime} from ${cityName}.`,
    },
  };
}

export default async function LaserHairMembershipsCityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  const cityConfig = LASER_HAIR_MEMBERSHIPS_CITIES.find((c) => `${c.slug}-il` === city);
  if (!cityConfig) notFound();

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: "Laser Hair Removal Membership",
    description: `Laser hair removal membership program near ${cityConfig.name}, IL. From $69/month. Up to 30% savings. Excellent results after 2 visits. Guaranteed permanent results.`,
    procedureType: "Cosmetic",
    provider: {
      "@type": "MedicalBusiness",
      name: SITE.name,
      url: SITE.url,
      telephone: SITE.phone,
      address: {
        "@type": "PostalAddress",
        streetAddress: SITE.address.streetAddress,
        addressLocality: SITE.address.addressLocality,
        addressRegion: SITE.address.addressRegion,
        postalCode: SITE.address.postalCode,
      },
    },
    areaServed: { "@type": "City", name: `${cityConfig.name}, IL` },
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: `${SITE.name} - Laser Hair Removal Near ${cityConfig.name}`,
    url: `${SITE.url}/laser-hair-memberships/${city}`,
    description: `Laser hair removal memberships from $69/month. Up to 30% savings. Serving ${cityConfig.name}, IL and surrounding areas.`,
    telephone: SITE.phone,
    address: { "@type": "PostalAddress", ...SITE.address },
    areaServed: SITE.serviceAreas.map((area) => ({ "@type": "Place", name: area })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: LASER_HAIR_MEMBERSHIPS.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <LaserHairMembershipsContent city={cityConfig} />
    </>
  );
}
