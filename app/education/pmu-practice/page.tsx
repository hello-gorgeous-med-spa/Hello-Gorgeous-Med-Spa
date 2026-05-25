import type { Metadata } from "next";

import { PmuPracticeStudio } from "@/components/education/PmuPracticeStudio";
import { PMU_PRACTICE_PATH } from "@/data/pmu-practice";
import { breadcrumbJsonLd, pageMetadata, SITE, siteJsonLd } from "@/lib/seo";

const baseMeta = pageMetadata({
  title: "PMU Practice Studio | Hello Gorgeous Provider Education",
  description:
    "Internal digital PMU practice tool — brow mapping, microblading strokes, nano, shading, and pigment swatches for Hello Gorgeous provider training.",
  path: PMU_PRACTICE_PATH,
});

export const metadata: Metadata = {
  ...baseMeta,
  robots: { index: false, follow: false },
};

export default function PmuPracticePage() {
  const url = `${SITE.url}${PMU_PRACTICE_PATH}`;
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Provider Education", url: url },
    { name: "PMU Practice Studio", url },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }}
      />
      <PmuPracticeStudio />
    </>
  );
}
