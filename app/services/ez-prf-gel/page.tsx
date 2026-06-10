import type { Metadata } from "next";

import { ServiceMenuPageLayout } from "@/components/services/ServiceMenuPageLayout";
import { EZ_PRF_GEL_MENU } from "@/lib/ez-prf-gel-menu";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata, siteJsonLd, SITE } from "@/lib/seo";

const PAGE_URL = `${SITE.url}${EZ_PRF_GEL_MENU.path}`;

export const metadata: Metadata = pageMetadata({
  title: EZ_PRF_GEL_MENU.metaTitle,
  description: EZ_PRF_GEL_MENU.metaDescription,
  path: EZ_PRF_GEL_MENU.path,
});

export default function EzPrfGelMenuPage() {
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
              { name: "EZ PRF Gel Menu", url: PAGE_URL },
            ])
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(EZ_PRF_GEL_MENU.faqs, PAGE_URL)) }}
      />
      <ServiceMenuPageLayout config={EZ_PRF_GEL_MENU} />
    </>
  );
}
