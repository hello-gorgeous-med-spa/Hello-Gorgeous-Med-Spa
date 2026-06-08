import type { Metadata } from "next";

import { ServiceMenuPageLayout } from "@/components/services/ServiceMenuPageLayout";
import { WELLNESS_MENU } from "@/lib/wellness-menu";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata, siteJsonLd, SITE } from "@/lib/seo";

const PAGE_URL = `${SITE.url}${WELLNESS_MENU.path}`;

export const metadata: Metadata = pageMetadata({
  title: WELLNESS_MENU.metaTitle,
  description: WELLNESS_MENU.metaDescription,
  path: WELLNESS_MENU.path,
});

export default function WellnessMenuPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: SITE.url },
              { name: "Services", url: `${SITE.url}/services` },
              { name: "Wellness Menu", url: PAGE_URL },
            ])
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(WELLNESS_MENU.faqs, PAGE_URL)) }}
      />
      <ServiceMenuPageLayout config={WELLNESS_MENU} />
    </>
  );
}
