import type { Metadata } from "next";

import { MicroneedlingServicePage } from "@/components/services/MicroneedlingServicePage";
import {
  MICRONEEDLING_MENU_FAQS,
  MICRONEEDLING_MENU_PATH,
} from "@/lib/microneedling-menu";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata, siteJsonLd, SITE } from "@/lib/seo";

const PAGE_URL = `${SITE.url}${MICRONEEDLING_MENU_PATH}`;

const meta = pageMetadata({
  title: "Microneedling Menu | Classic, Baby Tox, Exosomes & Morpheus8 | Hello Gorgeous Oswego",
  description:
    "Hello Gorgeous Med Spa microneedling menu in Oswego, IL — classic AnteAGE microneedling from $249, Baby Tox Luxe & exosomes $499, Morpheus8 Burst RF from $850. Serving Naperville, Aurora & Plainfield.",
  path: MICRONEEDLING_MENU_PATH,
});

export const metadata: Metadata = meta;

export default function MicroneedlingMenuPage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", url: SITE.url },
    { name: "Services", url: `${SITE.url}/services` },
    { name: "Microneedling Menu", url: PAGE_URL },
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd([...MICRONEEDLING_MENU_FAQS], PAGE_URL)) }}
      />
      <MicroneedlingServicePage />
    </>
  );
}
