import { Metadata } from "next";
import { LocationServicePage } from "@/components/LocationServicePage";
import { cityFiveFaqsMerged, getCityFivePageCopy } from "@/lib/city-five-page-copy";
import { TOP_SERVICES, SERVICE_AREAS, generateLocationKeywords } from "@/lib/location-seo";
import { formatPageTitle, SITE } from "@/lib/seo";

const SLUG = "morpheus8-montgomery-il" as const;
const copy = getCityFivePageCopy(SLUG)!;
const service = TOP_SERVICES.find((s) => s.slug === "morpheus8")!;
const area = SERVICE_AREAS.find((a) => a.slug === "montgomery")!;
const nearbyAreas = SERVICE_AREAS.filter((a) => a.slug !== "montgomery");
const pageTitle = formatPageTitle(copy.title);

export const metadata: Metadata = {
  title: { absolute: pageTitle },
  description: copy.metaDescription,
  keywords: [
    ...generateLocationKeywords(service, "Montgomery"),
    "morpheus8 burst montgomery il",
    "rf microneedling montgomery",
    "skin tightening montgomery",
  ],
  alternates: { canonical: `${SITE.url}/${SLUG}` },
  openGraph: {
    type: "website",
    url: `${SITE.url}/${SLUG}`,
    title: pageTitle,
    description: copy.metaDescription,
    images: [{ url: `${SITE.url}${service.heroImage}`, width: 1200, height: 630 }],
  },
};

export default function Morpheus8MontgomeryPage() {
  return (
    <LocationServicePage
      service={service}
      area={area}
      nearbyAreas={nearbyAreas}
      headline={copy.h1}
      localIntro={copy.intro}
      faqs={cityFiveFaqsMerged(SLUG, service.faqs)}
    />
  );
}
