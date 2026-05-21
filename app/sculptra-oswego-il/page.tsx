import { Metadata } from "next";
import { LocationServicePage } from "@/components/LocationServicePage";
import { TOP_SERVICES, SERVICE_AREAS, generateLocationKeywords } from "@/lib/location-seo";
import { SITE } from "@/lib/seo";

const service = TOP_SERVICES.find((s) => s.slug === "sculptra-biostimulator")!;
const area = SERVICE_AREAS.find((a) => a.slug === "oswego")!;
const nearbyAreas = SERVICE_AREAS.filter((a) => a.slug !== "oswego");

export const metadata: Metadata = {
  title: `Sculptra & Biostimulator Oswego IL | Hello Gorgeous Med Spa`,
  description: `Sculptra biostimulator collagen treatments in Oswego, IL. Gradual volume & skin quality — not instant filler. Book free consult at Hello Gorgeous. Naperville, Aurora, Fox Valley.`,
  keywords: generateLocationKeywords(service, "Oswego"),
  alternates: { canonical: `${SITE.url}/sculptra-oswego-il` },
  openGraph: {
    type: "website",
    url: `${SITE.url}/sculptra-oswego-il`,
    title: `Sculptra Oswego IL | Hello Gorgeous Med Spa`,
    description: service.description,
    images: [{ url: `${SITE.url}${service.heroImage}`, width: 1200, height: 630 }],
  },
};

export default function SculptraOswegoPage() {
  return <LocationServicePage service={service} area={area} nearbyAreas={nearbyAreas} />;
}
