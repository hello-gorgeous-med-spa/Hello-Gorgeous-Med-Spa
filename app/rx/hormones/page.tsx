import type { Metadata } from "next";

import { RegenCategoryRoute } from "@/components/rx/RegenCategoryRoute";
import { getRegenCategoryHub } from "@/lib/rx-category-hubs";
import { REGEN_SITE } from "@/lib/regen-site";
import { pageMetadata, SITE } from "@/lib/seo";

const PAGE_PATH = "/rx/hormones";
const PAGE_URL = `${SITE.url}${PAGE_PATH}`;

const hub = getRegenCategoryHub("hormones")!;

const baseMeta = pageMetadata({
  title: `${REGEN_SITE.name} Hormone Therapy | TRT & HRT Illinois | Oswego, IL`,
  description:
    "Testosterone, bioidentical HRT, and lab-guided hormone optimization — Ryan Kent, FNP-BC. RE GEN pay-first, intake, telehealth, ship to door.",
  path: PAGE_PATH,
  keywords: [
    "RE GEN hormones",
    "TRT Oswego",
    "bioidentical HRT Illinois",
    "testosterone telehealth",
    "women's hormones Naperville",
  ],
});

export const metadata: Metadata = {
  ...baseMeta,
  openGraph: {
    ...baseMeta.openGraph,
    url: PAGE_URL,
    images: [
      {
        url: `${SITE.url}/images/shop-rx/hrt/testosterone-trt.png`,
        width: 1200,
        height: 900,
        alt: "RE GEN hormone therapy — TRT and HRT",
      },
    ],
  },
};

export default function RegenHormonesPage() {
  return <RegenCategoryRoute hub={hub} />;
}
