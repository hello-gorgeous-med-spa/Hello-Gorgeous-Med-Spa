import type { Metadata } from "next";

import { RxCategoryLanding } from "@/components/rx/RxCategoryLanding";
import { getRegenCategoryHub } from "@/lib/rx-category-hubs";
import { REGEN_SITE } from "@/lib/regen-site";
import { pageMetadata, SITE } from "@/lib/seo";

const PAGE_PATH = "/rx/weight-loss";
const PAGE_URL = `${SITE.url}${PAGE_PATH}`;

const hub = getRegenCategoryHub("weight-loss")!;

const baseMeta = pageMetadata({
  title: `${REGEN_SITE.name} Weight Loss | GLP-1 Programs | Oswego, IL`,
  description:
    "Compounded semaglutide and tirzepatide with NP supervision — online intake, telehealth when needed, medication shipped to your door. RE GEN by Hello Gorgeous Med Spa, Oswego IL.",
  path: PAGE_PATH,
  keywords: [
    "RE GEN weight loss",
    "GLP-1 Oswego",
    "semaglutide Illinois",
    "tirzepatide prescription",
    "medical weight loss Naperville",
    "Ryan Kent FNP",
  ],
});

export const metadata: Metadata = {
  ...baseMeta,
  openGraph: {
    ...baseMeta.openGraph,
    url: PAGE_URL,
    images: [
      {
        url: `${SITE.url}/images/shop-rx/tirzepatide-glp1.png`,
        width: 1200,
        height: 900,
        alt: "RE GEN medical weight loss — compounded GLP-1 programs",
      },
    ],
  },
};

export default function RegenWeightLossPage() {
  return <RxCategoryLanding hub={hub} />;
}
