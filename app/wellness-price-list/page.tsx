import type { Metadata } from "next";

import { WellnessPriceListContent } from "@/components/marketing/WellnessPriceListContent";
import { breadcrumbJsonLd, pageMetadata, siteJsonLd, SITE } from "@/lib/seo";
import {
  WELLNESS_PRICE_LIST_META,
  WELLNESS_PRICE_LIST_PATH,
} from "@/lib/wellness-price-list";

const PAGE_URL = `${SITE.url}${WELLNESS_PRICE_LIST_PATH}`;

export const metadata: Metadata = pageMetadata({
  title: WELLNESS_PRICE_LIST_META.title,
  description: WELLNESS_PRICE_LIST_META.description,
  path: WELLNESS_PRICE_LIST_PATH,
});

export default function WellnessPriceListPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: SITE.url },
              { name: "Wellness Price List", url: PAGE_URL },
            ]),
          ),
        }}
      />
      <WellnessPriceListContent />
    </>
  );
}
