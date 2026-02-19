import type { Metadata } from "next";
import { VirtualConsultationBody } from "@/components/VirtualConsultationBody";
import { pageMetadata, siteJsonLd, SITE, breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Virtual Consultation | Personalized Treatment Recommendations | Oswego, IL",
  description:
    "Get instant treatment recommendations tailored to your concerns. Select your areas of interest—forehead, lips, skin, weight & more—and our team will create your personalized plan. Free, no-pressure.",
  path: "/virtual-consultation",
});

export default function VirtualConsultationPage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Virtual Consultation", url: `${SITE.url}/virtual-consultation` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }}
      />

      <VirtualConsultationBody />
    </>
  );
}
