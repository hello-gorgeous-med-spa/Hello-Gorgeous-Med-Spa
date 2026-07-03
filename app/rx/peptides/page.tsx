import type { Metadata } from "next";

import { RegenCategoryRoute } from "@/components/rx/RegenCategoryRoute";
import { getRegenCategoryHub } from "@/lib/rx-category-hubs";
import { REGEN_SITE } from "@/lib/regen-site";
import { pageMetadata, SITE } from "@/lib/seo";

const PAGE_PATH = "/rx/peptides";
const PAGE_URL = `${SITE.url}${PAGE_PATH}`;

const hub = getRegenCategoryHub("peptides")!;

const baseMeta = pageMetadata({
  title: `${REGEN_SITE.name} Peptide Therapy | BPC-157, NAD+ & Sermorelin | Oswego, IL`,
  description:
    "Prescription peptide protocols — BPC-157, NAD+, sermorelin, CJC/ipamorelin & more. NP-supervised RE GEN by Hello Gorgeous Med Spa. Pay first, intake, telehealth, then ship across Illinois.",
  path: PAGE_PATH,
  keywords: [
    "RE GEN peptides",
    "BPC-157 Illinois",
    "NAD+ injection telehealth",
    "sermorelin Oswego",
    "peptide therapy Naperville",
    "Hello Gorgeous RX peptides",
  ],
});

export const metadata: Metadata = {
  ...baseMeta,
  openGraph: {
    ...baseMeta.openGraph,
    url: PAGE_URL,
    images: [
      {
        url: `${SITE.url}/images/shop-rx/bpc-157.png`,
        width: 1200,
        height: 900,
        alt: "RE GEN peptide therapy — BPC-157 and NAD+ protocols",
      },
    ],
  },
};

export default function RegenPeptidesPage() {
  return <RegenCategoryRoute hub={hub} />;
}
