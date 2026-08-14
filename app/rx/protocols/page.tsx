import type { Metadata } from "next";

import { RxProtocolIndexContent } from "@/components/rx/RxProtocolIndexContent";
import { clinicalPageJsonLd } from "@/lib/medical-authority";
import {
  protocolIndexGroups,
  publishedProtocolModels,
  RX_PROTOCOLS_PATH,
} from "@/lib/regen/catalog/protocol-pages";
import { breadcrumbJsonLd, pageMetadata, SITE, siteJsonLd } from "@/lib/seo";

const PAGE_URL = `${SITE.url}${RX_PROTOCOLS_PATH}`;
const COUNT = publishedProtocolModels().length;

const baseMeta = pageMetadata({
  title: `RE GEN Protocols — ${COUNT} Compound Guides | Hello Gorgeous Oswego`,
  description:
    "Educational protocol pages for Hello Gorgeous RX in Oswego, IL: what each compound is, what it's studied for, who should pause, and catalog starting prices. NP-supervised consult-first care.",
  path: RX_PROTOCOLS_PATH,
  keywords: [
    "peptide protocols Oswego",
    "RE GEN protocols",
    "Hello Gorgeous RX",
    "compounded peptides Illinois",
  ],
});

export const metadata: Metadata = {
  ...baseMeta,
  robots: { index: true, follow: true },
};

export default function RxProtocolsIndexPage() {
  const groups = protocolIndexGroups();
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "RE GEN", url: `${SITE.url}/rx` },
    { name: "Protocols", url: PAGE_URL },
  ];
  const clinicalLd = clinicalPageJsonLd({
    url: PAGE_URL,
    name: "RE GEN compound protocols",
    description: baseMeta.description ?? undefined,
    siteUrl: SITE.url,
    extraNodes: [breadcrumbJsonLd(breadcrumbs)],
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(clinicalLd) }} />
      <RxProtocolIndexContent groups={groups} count={COUNT} />
    </>
  );
}
