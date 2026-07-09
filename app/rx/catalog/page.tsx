import type { Metadata } from "next";
import { Suspense } from "react";

import { RegenCatalogClient } from "@/components/regen/catalog/RegenCatalogClient";
import { SITE, breadcrumbJsonLd, pageMetadata, siteJsonLd, webPageJsonLd } from "@/lib/seo";

const PATH = "/rx/catalog";
const TITLE = "RE GEN Catalog | Shop Compounded Rx Treatments Online";
const DESCRIPTION =
  "Browse ~195 compounded prescriptions from RE GEN by Hello Gorgeous — GLP-1 weight loss, peptides, hormones, intimacy, skin & hair, and longevity. NP review required. Flat $30 Illinois shipping.";

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: PATH,
  keywords: [
    "RE GEN catalog",
    "compounded semaglutide online Illinois",
    "peptide therapy catalog Oswego",
    "online hormone therapy Illinois",
    "Hello Gorgeous RX shop",
  ],
});

export default function RegenCatalogPage() {
  const jsonLd = [
    siteJsonLd(),
    breadcrumbJsonLd([
      { name: "Home", url: SITE.url },
      { name: "RE GEN", url: `${SITE.url}/rx` },
      { name: "Catalog", url: `${SITE.url}${PATH}` },
    ]),
    webPageJsonLd({
      name: TITLE,
      description: DESCRIPTION,
      url: `${SITE.url}${PATH}`,
    }),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Suspense
        fallback={
          <div className="flex min-h-[50vh] items-center justify-center bg-[#FFF9FB] text-black/50">
            Loading catalog…
          </div>
        }
      >
        <RegenCatalogClient />
      </Suspense>
    </>
  );
}
