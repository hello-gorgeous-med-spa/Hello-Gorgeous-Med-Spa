import type { Metadata } from "next";

import { MicroneedlingIntelligenceStudio } from "@/components/education/MicroneedlingIntelligenceStudio";
import { MICRONEEDLING_INTELLIGENCE_PATH } from "@/data/microneedling-intelligence";
import { breadcrumbJsonLd, pageMetadata, SITE, siteJsonLd } from "@/lib/seo";

const baseMeta = pageMetadata({
  title: "Microneedling Intelligence | Hello Gorgeous Provider Education",
  description:
    "Internal microneedling chairside tool — upload photo, get tier, serum, device, depth, and offer recommendations for Hello Gorgeous providers.",
  path: MICRONEEDLING_INTELLIGENCE_PATH,
});

export const metadata: Metadata = {
  ...baseMeta,
  robots: { index: false, follow: false },
};

export default function MicroneedlingIntelligencePage() {
  const url = `${SITE.url}${MICRONEEDLING_INTELLIGENCE_PATH}`;
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Provider Education", url },
    { name: "Microneedling Intelligence", url },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }}
      />
      <MicroneedlingIntelligenceStudio />
    </>
  );
}
