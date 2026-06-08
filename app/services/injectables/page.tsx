import type { Metadata } from "next";

import { ServiceMenuPageLayout } from "@/components/services/ServiceMenuPageLayout";
import { INJECTABLES_MENU } from "@/lib/injectables-menu";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata, siteJsonLd, SITE } from "@/lib/seo";

const PAGE_URL = `${SITE.url}${INJECTABLES_MENU.path}`;

export const metadata: Metadata = pageMetadata({
  title: INJECTABLES_MENU.metaTitle,
  description: INJECTABLES_MENU.metaDescription,
  path: INJECTABLES_MENU.path,
});

export default function InjectablesMenuPage() {
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
              { name: "Injectables Menu", url: PAGE_URL },
            ])
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(INJECTABLES_MENU.faqs, PAGE_URL)) }}
      />
      <ServiceMenuPageLayout config={INJECTABLES_MENU} />
    </>
  );
}
