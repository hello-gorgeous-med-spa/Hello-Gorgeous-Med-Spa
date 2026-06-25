import type { Metadata } from "next";

import { WellnessPriceListFlyerPrint } from "@/components/marketing/WellnessPriceListFlyerPrint";
import { pageMetadata } from "@/lib/seo";
import { WELLNESS_PRICE_LIST_FLYER_PATH } from "@/lib/wellness-price-list";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Wellness Menu Brochure — Print | Hello Gorgeous Med Spa",
    description:
      "Print-ready Hello Gorgeous wellness brochure — peptides, vitamin shots, hormones, and GLP-1 pricing with branded thumbnails.",
    path: WELLNESS_PRICE_LIST_FLYER_PATH,
  }),
  robots: { index: false, follow: false },
};

export default function WellnessPriceListFlyerPage() {
  return <WellnessPriceListFlyerPrint />;
}
