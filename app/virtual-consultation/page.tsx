import type { Metadata } from "next";
import { VirtualConsultationBody } from "@/components/VirtualConsultationBody";
import { pageMetadata, siteJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Virtual Consultation | Personalized Treatment Recommendations | Oswego, IL",
  description:
    "Get instant treatment recommendations tailored to your concerns. Select your areas of interest—forehead, lips, skin, weight & more—and our team will create your personalized plan. Free, no-pressure.",
  path: "/virtual-consultation",
});

export default function VirtualConsultationPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />

      <VirtualConsultationBody />
    </>
  );
}
