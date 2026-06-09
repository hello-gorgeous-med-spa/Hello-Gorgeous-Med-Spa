import type { Metadata } from "next";

import { ServiceMenuPageLayout } from "@/components/services/ServiceMenuPageLayout";
import { PRP_THERAPY_MENU } from "@/lib/prp-therapy-menu";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata, siteJsonLd, SITE } from "@/lib/seo";

const PAGE_URL = `${SITE.url}${PRP_THERAPY_MENU.path}`;

export const metadata: Metadata = pageMetadata({
  title: PRP_THERAPY_MENU.metaTitle,
  description: PRP_THERAPY_MENU.metaDescription,
  path: PRP_THERAPY_MENU.path,
});

export default function PrpTherapyMenuPage() {
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
              { name: "PRP Therapy Menu", url: PAGE_URL },
            ])
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(PRP_THERAPY_MENU.faqs, PAGE_URL)) }}
      />
      <ServiceMenuPageLayout config={PRP_THERAPY_MENU} />
    </>
  );
}
