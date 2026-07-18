import type { Metadata } from "next";

import { RegenCategoryRoute } from "@/components/rx/RegenCategoryRoute";
import { getRegenCategoryHub } from "@/lib/rx-category-hubs";
import { REGEN_SITE } from "@/lib/regen-site";
import { pageMetadata, SITE } from "@/lib/seo";

const PAGE_PATH = "/rx/hair-skin";
const PAGE_URL = `${SITE.url}${PAGE_PATH}`;

const hub = getRegenCategoryHub("hair-skin")!;

const baseMeta = pageMetadata({
  title: `${REGEN_SITE.name} Hair & Skin | GHK-Cu Copper Peptide + Biotin | Oswego, IL`,
  description:
    "GHK-Cu copper peptide cream for collagen and skin repair, plus injectable biotin for hair, skin, and nails. NP-supervised RE GEN by Hello Gorgeous Med Spa — telehealth, then ship.",
  path: PAGE_PATH,
  keywords: [
    "GHK-Cu cream Illinois",
    "copper peptide Oswego",
    "biotin injection hair skin nails",
    "RE GEN hair and skin",
    "prescription dermatology Naperville",
    "hair regrowth telehealth Illinois",
  ],
});

export const metadata: Metadata = {
  ...baseMeta,
  openGraph: {
    ...baseMeta.openGraph,
    url: PAGE_URL,
    images: [
      {
        url: `${SITE.url}/images/regen/catalog/ghk-cu.png`,
        width: 1200,
        height: 900,
        alt: "RE GEN GHK-Cu copper peptide cream — hair and skin care",
      },
    ],
  },
};

export default function RegenHairSkinPage() {
  return <RegenCategoryRoute hub={hub} />;
}
