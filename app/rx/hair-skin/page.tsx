import type { Metadata } from "next";

import { RegenCategoryRoute } from "@/components/rx/RegenCategoryRoute";
import { getRegenCategoryHub } from "@/lib/rx-category-hubs";
import { REGEN_SITE } from "@/lib/regen-site";
import { pageMetadata, SITE } from "@/lib/seo";

const PAGE_PATH = "/rx/hair-skin";
const PAGE_URL = `${SITE.url}${PAGE_PATH}`;

const hub = getRegenCategoryHub("hair-skin")!;

const baseMeta = pageMetadata({
  title: `${REGEN_SITE.name} Hair & Skin Rx | ManeTain, GHK-Cu & Dermatology | Oswego, IL`,
  description:
    "Prescription hair regrowth and dermatology creams — ManeTain, minoxidil, Glow, Miracle & Erase. NP-supervised RE GEN by Hello Gorgeous Med Spa. Pay first, intake, telehealth, then ship.",
  path: PAGE_PATH,
  keywords: [
    "RE GEN hair loss",
    "ManeTain minoxidil",
    "prescription skin cream Illinois",
    "GHK-Cu Oswego",
    "hair regrowth telehealth",
    "Rx dermatology Naperville",
  ],
});

export const metadata: Metadata = {
  ...baseMeta,
  openGraph: {
    ...baseMeta.openGraph,
    url: PAGE_URL,
    images: [
      {
        url: `${SITE.url}/images/regen/prod-manetain.png`,
        width: 1200,
        height: 900,
        alt: "RE GEN hair and skin prescription care — ManeTain and dermatology creams",
      },
    ],
  },
};

export default function RegenHairSkinPage() {
  return <RegenCategoryRoute hub={hub} />;
}
