import type { Metadata } from "next";

import { RegenCategoryRoute } from "@/components/rx/RegenCategoryRoute";
import { getRegenCategoryHub } from "@/lib/rx-category-hubs";
import { REGEN_SITE } from "@/lib/regen-site";
import { pageMetadata, SITE } from "@/lib/seo";

const PAGE_PATH = "/rx/hair-skin";
const PAGE_URL = `${SITE.url}${PAGE_PATH}`;

const hub = getRegenCategoryHub("hair-skin")!;

const baseMeta = pageMetadata({
  title: `${REGEN_SITE.name} Hair & Skin | Hair-Loss Evaluation | Oswego, IL`,
  description:
    "Hair-loss and skin evaluation with Ryan Kent, FNP-BC. Prescription topicals are considered only after a medical visit. Biotin shots remain available at the Oswego Vitamin Bar.",
  path: PAGE_PATH,
  keywords: [
    "hair-loss evaluation Oswego",
    "prescription dermatology Illinois",
    "biotin injection hair skin nails",
    "RE GEN hair and skin",
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
        url: `${SITE.url}/images/regen/hero-hair-skin.jpg`,
        width: 1200,
        height: 900,
        alt: "RE GEN hair-loss and skin evaluation — Hello Gorgeous RX",
      },
    ],
  },
};

export default function RegenHairSkinPage() {
  return <RegenCategoryRoute hub={hub} />;
}
