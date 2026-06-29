import type { Metadata } from "next";

import { RxOnlineGuidePage } from "@/components/rx/RxOnlineGuidePage";
import { RX_ONLINE_GUIDE_PATH } from "@/lib/rx-online-guide";
import { breadcrumbJsonLd, pageMetadata, SITE, siteJsonLd } from "@/lib/seo";

const PAGE_URL = `${SITE.url}${RX_ONLINE_GUIDE_PATH}`;

const baseMeta = pageMetadata({
  title: "Hello Gorgeous RX™ — Your Online Refill Guide",
  description:
    "Bookmark your RX refill guide: care hub, track status, message our team, GLP-1 & peptide refills, telehealth, and the Hello Gorgeous app.",
  path: RX_ONLINE_GUIDE_PATH,
  keywords: [
    "Hello Gorgeous RX guide",
    "GLP-1 refill Oswego",
    "peptide refill Illinois",
    "RX patient portal",
    "medical weight loss refill online",
  ],
});

export const metadata: Metadata = {
  ...baseMeta,
  openGraph: {
    ...baseMeta.openGraph,
    url: PAGE_URL,
    images: [
      {
        url: `${SITE.url}/images/homepage-buyer-paths/hello-gorgeous-rx.png`,
        width: 1024,
        height: 576,
        alt: "Hello Gorgeous RX Online Refill Guide",
      },
    ],
  },
};

export default function RxGuidePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      siteJsonLd(),
      breadcrumbJsonLd([
        { name: "Home", url: SITE.url },
        { name: "Hello Gorgeous RX", url: `${SITE.url}/rx` },
        { name: "Online Refill Guide", url: PAGE_URL },
      ]),
      {
        "@type": "WebPage",
        "@id": `${PAGE_URL}#webpage`,
        url: PAGE_URL,
        name: "Hello Gorgeous RX — Your Online Refill Guide",
        description: baseMeta.description,
        isPartOf: { "@id": `${SITE.url}/#website` },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <RxOnlineGuidePage />
    </>
  );
}
