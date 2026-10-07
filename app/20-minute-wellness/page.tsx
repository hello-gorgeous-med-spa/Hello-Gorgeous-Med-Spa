import type { Metadata } from "next";

import { WellnessDriveThruPageContent } from "@/components/wellness-drive-thru/WellnessDriveThruPageContent";
import {
  WELLNESS_DRIVE_THRU_FAQ,
  WELLNESS_DRIVE_THRU_PATH,
  WELLNESS_DRIVE_THRU_SEO,
} from "@/lib/wellness-drive-thru";
import { SITE, breadcrumbJsonLd, faqJsonLd, pageMetadata, siteJsonLd } from "@/lib/seo";

const PAGE_URL = `${SITE.url}${WELLNESS_DRIVE_THRU_PATH}`;

export const metadata: Metadata = pageMetadata({
  title: WELLNESS_DRIVE_THRU_SEO.title,
  description: WELLNESS_DRIVE_THRU_SEO.description,
  path: WELLNESS_DRIVE_THRU_PATH,
  keywords: [
    "vitamin shot Oswego",
    "$20 B12 shot Oswego IL",
    "wellness injection lunch break",
    "glutathione shot Oswego",
    "Hello Gorgeous vitamin bar",
  ],
});

export default function WellnessDriveThruPage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Specials", url: `${SITE.url}/specials` },
    { name: "20-Minute Wellness", url: PAGE_URL },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd([...WELLNESS_DRIVE_THRU_FAQ], PAGE_URL)),
        }}
      />
      <WellnessDriveThruPageContent />
    </>
  );
}
