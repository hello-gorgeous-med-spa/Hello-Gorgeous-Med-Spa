import type { Metadata } from "next";

import { ServiceMenuPageLayout } from "@/components/services/ServiceMenuPageLayout";
import { PRF_PRP_MENU } from "@/lib/prf-prp-menu";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata, siteJsonLd, SITE } from "@/lib/seo";

const PAGE_URL = `${SITE.url}${PRF_PRP_MENU.path}`;

export const metadata: Metadata = pageMetadata({
  title: PRF_PRP_MENU.metaTitle,
  description: PRF_PRP_MENU.metaDescription,
  path: PRF_PRP_MENU.path,
});

export default function PrfPrpMenuPage() {
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
              { name: "PRF / PRP Menu", url: PAGE_URL },
            ])
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(PRF_PRP_MENU.faqs, PAGE_URL)) }}
      />
      <ServiceMenuPageLayout config={PRF_PRP_MENU} />
    </>
  );
}
