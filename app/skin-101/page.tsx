import type { Metadata } from "next";

import { Skin101HubContent } from "@/components/skin-101/Skin101HubContent";
import { breadcrumbJsonLd, pageMetadata, SITE, siteJsonLd, webPageJsonLd } from "@/lib/seo";
import { SKIN_101_PATH } from "@/lib/skin-101-nav";

const URL = `${SITE.url}${SKIN_101_PATH}`;

const PAGE_DESCRIPTION =
  "Learn skincare science in plain language — acids, collagen types, and treatment basics from Hello Gorgeous Med Spa in Oswego, IL. Free guides for curious clients.";

export const metadata: Metadata = pageMetadata({
  title: "Skin 101 | Client Education Guides | Hello Gorgeous Med Spa Oswego IL",
  description: PAGE_DESCRIPTION,
  path: SKIN_101_PATH,
});

export default function Skin101HubPage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Skin 101", url: URL },
  ];

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${URL}#collection`,
    name: "Skin 101 — Science Explainer Series",
    description:
      "Client education guides on skincare acids, collagen science, and treatment basics from Hello Gorgeous Med Spa.",
    url: URL,
    isPartOf: { "@id": `${SITE.url}/#website` },
    publisher: { "@id": `${SITE.url}/#organization` },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webPageJsonLd({
              name: "Skin 101 | Hello Gorgeous Med Spa",
              description: PAGE_DESCRIPTION,
              url: URL,
            })
          ),
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      <Skin101HubContent />
    </>
  );
}
