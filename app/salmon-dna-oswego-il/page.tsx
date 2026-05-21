import { Metadata } from "next";
import { LocationServicePage } from "@/components/LocationServicePage";
import { TOP_SERVICES, SERVICE_AREAS, generateLocationKeywords } from "@/lib/location-seo";
import { SITE } from "@/lib/seo";

const service = TOP_SERVICES.find((s) => s.slug === "salmon-dna-glass-facial")!;
const area = SERVICE_AREAS.find((a) => a.slug === "oswego")!;
const nearbyAreas = SERVICE_AREAS.filter((a) => a.slug !== "oswego");

export const metadata: Metadata = {
  title: `Salmon DNA Glass Facial Oswego IL | PDRN Red Carpet | Hello Gorgeous`,
  description: `Salmon DNA / PDRN glass skin facial in Oswego, IL. Red carpet glow with optional microneedling or IPL. Hello Gorgeous Med Spa — 10+ years in the Fox Valley.`,
  keywords: generateLocationKeywords(service, "Oswego"),
  alternates: { canonical: `${SITE.url}/salmon-dna-oswego-il` },
  openGraph: {
    type: "website",
    url: `${SITE.url}/salmon-dna-oswego-il`,
    title: `Salmon DNA Facial Oswego IL | Hello Gorgeous`,
    description: service.description,
    images: [{ url: `${SITE.url}${service.heroImage}`, width: 1200, height: 630 }],
  },
};

export default function SalmonDnaOswegoPage() {
  return <LocationServicePage service={service} area={area} nearbyAreas={nearbyAreas} />;
}
