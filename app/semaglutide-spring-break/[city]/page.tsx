import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SpringBreakPromo } from "@/components/marketing/SpringBreakPromo";
import { SPRING_BREAK_SPECIAL } from "@/data/spring-break-special";
import { SITE } from "@/lib/seo";

const CITY_SLUGS = SPRING_BREAK_SPECIAL.cities.map((c) => `${c.slug}-il`);

export async function generateStaticParams() {
  return CITY_SLUGS.map((city) => ({ city }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  const cityConfig = SPRING_BREAK_SPECIAL.cities.find((c) => `${c.slug}-il` === city);
  if (!cityConfig) return { title: "Spring Break Special | Hello Gorgeous" };

  const cityName = cityConfig.name;
  return {
    title: `Semaglutide $299/month Near ${cityName} IL | Spring Break Special | Hello Gorgeous`,
    description: `Spring Break Special: Semaglutide/Ozempic weight loss $299/month near ${cityName}, IL. Oversight, screening & medicine included. ${cityConfig.driveTime} from ${cityName}. Book now!`,
    keywords: [
      `semaglutide ${cityName}`,
      `ozempic ${cityName}`,
      `weight loss ${cityName} IL`,
      `GLP-1 ${cityName}`,
      ...SPRING_BREAK_SPECIAL.keywords,
    ],
    alternates: { canonical: `${SITE.url}/semaglutide-spring-break/${city}` },
    openGraph: {
      url: `${SITE.url}/semaglutide-spring-break/${city}`,
      title: `Semaglutide $299 Near ${cityName} | Spring Break Special`,
      description: `Get beach-ready. $299/month — ${cityConfig.driveTime} from ${cityName}.`,
    },
  };
}

export default async function SemaglutideSpringBreakCityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  const cityConfig = SPRING_BREAK_SPECIAL.cities.find((c) => `${c.slug}-il` === city);
  if (!cityConfig) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    name: "Semaglutide Medical Weight Loss",
    description: `Semaglutide weight loss program near ${cityConfig.name}, IL. $299/month Spring Break special includes oversight, screening, and medication.`,
    procedureType: "Medical",
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SpringBreakPromo city={cityConfig} />
    </>
  );
}
