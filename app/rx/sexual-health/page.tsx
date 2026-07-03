import type { Metadata } from "next";

import { RegenCategoryRoute } from "@/components/rx/RegenCategoryRoute";
import { getRegenCategoryHub } from "@/lib/rx-category-hubs";
import { REGEN_SITE } from "@/lib/regen-site";
import { pageMetadata, SITE } from "@/lib/seo";

const PAGE_PATH = "/rx/sexual-health";
const PAGE_URL = `${SITE.url}${PAGE_PATH}`;

const hub = getRegenCategoryHub("sexual-health")!;

const baseMeta = pageMetadata({
  title: `${REGEN_SITE.name} Sexual Health | ED & Libido Rx Illinois | Oswego, IL`,
  description:
    "Discreet sexual wellness — sildenafil, tadalafil, Scream Cream, PT-141. NP-supervised RE GEN by Hello Gorgeous Med Spa. Illinois telehealth.",
  path: PAGE_PATH,
  keywords: [
    "RE GEN sexual health",
    "ED treatment Oswego",
    "sildenafil Illinois telehealth",
    "women's libido cream",
    "PT-141 peptide",
  ],
});

export const metadata: Metadata = {
  ...baseMeta,
  openGraph: {
    ...baseMeta.openGraph,
    url: PAGE_URL,
    images: [
      {
        url: `${SITE.url}/images/shop-rx/pt-141.png`,
        width: 1200,
        height: 900,
        alt: "RE GEN sexual health and intimacy support",
      },
    ],
  },
};

export default function RegenSexualHealthPage() {
  return <RegenCategoryRoute hub={hub} />;
}
