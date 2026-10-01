import { Metadata } from "next";
import { LocationServicePage } from "@/components/LocationServicePage";
import { SERVICE_AREAS, generateLocationKeywords, getServiceBySlug } from "@/lib/location-seo";
import { SITE } from "@/lib/seo";

const service = getServiceBySlug("microneedling") ?? getServiceBySlug("morpheus8")!;
const area = SERVICE_AREAS.find((a) => a.slug === "yorkville")!;
const nearbyAreas = SERVICE_AREAS.filter((a) => a.slug !== "yorkville");

const YORKVILLE_MICRO_FAQS = [
  {
    question: "Where is the best microneedling in Yorkville, IL?",
    answer:
      "Hello Gorgeous Med Spa does not have a Yorkville office. Yorkville patients drive about 8–10 minutes north on Route 47 toward Route 34, to 74 W. Washington Street in downtown Oswego. RF microneedling, including Morpheus8 Burst, is performed after a medical screening. Call (630) 636-6193 or book at hellogorgeousmedspa.com/book.",
  },
  {
    question: "How far is microneedling from Yorkville?",
    answer:
      "Yorkville to the Oswego clinic is typically 8–10 minutes north on Route 47 to Route 34. The address is 74 W. Washington Street, Oswego, IL 60543.",
  },
];

export const metadata: Metadata = {
  title: `RF Microneedling for Yorkville, IL | Hello Gorgeous Med Spa`,
  description:
    "Yorkville patients come to Hello Gorgeous Med Spa in downtown Oswego, about 8–10 minutes north, for RF microneedling including Morpheus8 Burst. Medical screening before treatment. Book a consult.",
  keywords: service ? generateLocationKeywords(service, "Yorkville") : ["microneedling", "yorkville il", "morpheus8"],
  alternates: { canonical: `${SITE.url}/microneedling-yorkville-il` },
  openGraph: {
    type: "website",
    url: `${SITE.url}/microneedling-yorkville-il`,
    title: "RF Microneedling for Yorkville patients | Hello Gorgeous Med Spa",
    description: "RF microneedling in downtown Oswego, about 8–10 minutes from Yorkville.",
    images: service?.heroImage ? [{ url: `${SITE.url}${service.heroImage}`, width: 1200, height: 630 }] : undefined,
  },
};

export default function MicroneedlingYorkvillePage() {
  return (
    <LocationServicePage
      service={service}
      area={area}
      nearbyAreas={nearbyAreas}
      headline="Microneedling for Yorkville patients, in downtown Oswego"
      localIntro="Yorkville patients who want microneedling come to Hello Gorgeous Med Spa at 74 W. Washington Street in downtown Oswego, about 8–10 minutes north on Route 47 to Route 34. We do not have a Yorkville office. RF microneedling, including Morpheus8 Burst, is performed after a medical screening. Call (630) 636-6193 or book at hellogorgeousmedspa.com/book."
      faqs={[...YORKVILLE_MICRO_FAQS, ...service.faqs]}
    />
  );
}
