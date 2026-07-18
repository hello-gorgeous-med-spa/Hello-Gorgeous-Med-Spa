import type { Metadata } from "next";

import { ServiceMenuPageLayout } from "@/components/services/ServiceMenuPageLayout";
import { FACIALS_PEELS_MENU } from "@/lib/facials-peels-menu";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata, siteJsonLd, SITE } from "@/lib/seo";

const PAGE_URL = `${SITE.url}${FACIALS_PEELS_MENU.path}`;

export const metadata: Metadata = pageMetadata({
  title: FACIALS_PEELS_MENU.metaTitle,
  description: FACIALS_PEELS_MENU.metaDescription,
  path: FACIALS_PEELS_MENU.path,
});

export default function FacialsPeelsMenuPage() {
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
              { name: "Facials & Peels", url: PAGE_URL },
            ])
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FACIALS_PEELS_MENU.faqs, PAGE_URL)) }}
      />
      <ServiceMenuPageLayout config={FACIALS_PEELS_MENU} />
    </>
  );
}
