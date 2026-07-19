import type { Metadata } from "next";

import { ServicesHubPageContent } from "@/components/services/ServicesHubPageContent";
import { pageMetadata, siteJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Services",
  description:
    "Explore services at Hello Gorgeous Med Spa in Oswego, IL—Botox/Dysport, dermal fillers, facials, Morpheus8, Solaria CO₂, GLP‑1 weight loss, hormone therapy, and RE GEN RX.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />
      <ServicesHubPageContent />
    </>
  );
}
