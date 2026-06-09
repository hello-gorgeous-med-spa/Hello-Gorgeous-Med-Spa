import type { Metadata } from "next";

import { ServiceMenuPageLayout } from "@/components/services/ServiceMenuPageLayout";
import { PRP_FACIAL_MENU } from "@/lib/prp-facial-menu";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata, siteJsonLd, SITE } from "@/lib/seo";

const PAGE_URL = `${SITE.url}${PRP_FACIAL_MENU.path}`;

export const metadata: Metadata = pageMetadata({
  title: PRP_FACIAL_MENU.metaTitle,
  description: PRP_FACIAL_MENU.metaDescription,
  path: PRP_FACIAL_MENU.path,
});

export default function PrpFacialMenuPage() {
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
              { name: "PRP Facial Menu", url: PAGE_URL },
            ])
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(PRP_FACIAL_MENU.faqs, PAGE_URL)) }}
      />
      <ServiceMenuPageLayout config={PRP_FACIAL_MENU} />
    </>
  );
}
