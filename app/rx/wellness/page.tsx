import type { Metadata } from "next";

import { RegenCategoryRoute } from "@/components/rx/RegenCategoryRoute";
import { getRegenCategoryHub } from "@/lib/rx-category-hubs";
import { REGEN_SITE } from "@/lib/regen-site";
import { pageMetadata, SITE } from "@/lib/seo";

const PAGE_PATH = "/rx/wellness";
const PAGE_URL = `${SITE.url}${PAGE_PATH}`;

const hub = getRegenCategoryHub("wellness")!;

const baseMeta = pageMetadata({
  title: `${REGEN_SITE.name} Daily Wellness | B12, NAD+ & Vitamin Injections | Oswego, IL`,
  description:
    "Injectable daily wellness — B12, NAD+, vitamin D3, biotin, glutathione & LDN. NP-reviewed RE GEN supplies shipped across Illinois. In-clinic Vitamin Bar still available in Oswego.",
  path: PAGE_PATH,
  keywords: [
    "RE GEN daily wellness",
    "vitamin injections Illinois",
    "B12 injection telehealth",
    "NAD+ at home Oswego",
    "wellness shots Naperville",
    "Hello Gorgeous vitamin bar",
  ],
});

export const metadata: Metadata = {
  ...baseMeta,
  openGraph: {
    ...baseMeta.openGraph,
    url: PAGE_URL,
    images: [
      {
        url: `${SITE.url}/images/shop-rx/nad-plus.png`,
        width: 1200,
        height: 900,
        alt: "RE GEN daily wellness — injectable B12 and NAD+ supplies",
      },
    ],
  },
};

export default function RegenWellnessPage() {
  return <RegenCategoryRoute hub={hub} />;
}
