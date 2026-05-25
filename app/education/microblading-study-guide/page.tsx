import type { Metadata } from "next";

import { MicrobladingStudyGuideContent } from "@/components/education/MicrobladingStudyGuideContent";
import {
  MICROBLADING_GUIDE_META,
  MICROBLADING_STUDY_GUIDE_PATH,
} from "@/data/microblading-study-guide";
import { breadcrumbJsonLd, pageMetadata, SITE, siteJsonLd } from "@/lib/seo";

const baseMeta = pageMetadata({
    title: `${MICROBLADING_GUIDE_META.title} | Hello Gorgeous Provider Education`,
    description:
      "Hello Gorgeous microblading study guide — brow mapping, spine strokes (low, medium, high), five-step technique, color theory, sterile setup, and aftercare for providers and trainees in Oswego, IL.",
    path: MICROBLADING_STUDY_GUIDE_PATH,
  });

export const metadata: Metadata = {
  ...baseMeta,
  robots: { index: false, follow: false },
};

export default function MicrobladingStudyGuidePage() {
  const url = `${SITE.url}${MICROBLADING_STUDY_GUIDE_PATH}`;
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Provider Education", url: url },
    { name: "Microblading Study Guide", url },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }}
      />
      <MicrobladingStudyGuideContent />
    </>
  );
}
