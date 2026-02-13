import type { Metadata } from "next";

import { VirtualConsultation } from "@/components/VirtualConsultation";
import { Section } from "@/components/Section";
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

      <Section className="relative min-h-[80vh]">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-pink-950/20" />
        <div className="relative z-10 py-12 md:py-20">
          <VirtualConsultation />
        </div>
      </Section>
    </>
  );
}
