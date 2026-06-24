import type { Metadata } from "next";

import { MensHormonesPageContent } from "@/components/mens-hormones/MensHormonesPageContent";
import {
  MENS_HORMONES_FAQS,
  MENS_HORMONES_HERO_IMAGE,
  MENS_HORMONES_PATH,
} from "@/lib/mens-hormones";
import {
  SITE,
  pageMetadata,
  siteJsonLd,
  mainLocalBusinessJsonLd,
  breadcrumbJsonLd,
  webPageJsonLd,
  faqJsonLd,
} from "@/lib/seo";

const PAGE_URL = `${SITE.url}${MENS_HORMONES_PATH}`;
const PAGE_DESCRIPTION =
  "Men's hormone optimization in Oswego, IL — lab-guided TRT, BioTE pellets, and testosterone protocols with NP oversight by Ryan Kent, FNP-BC. Free consult. Naperville, Aurora, Plainfield.";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "Men's Hormone Optimization Oswego IL | TRT & Testosterone | Hello Gorgeous",
  description: PAGE_DESCRIPTION,
  path: MENS_HORMONES_PATH,
  keywords: [
    "TRT oswego il",
    "testosterone replacement therapy oswego",
    "mens hormone therapy near me",
    "low testosterone oswego il",
    "hormone optimization men chicago suburbs",
    "men's hormone clinic near naperville",
  ],
});

export default function MensHormonesPage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Men's Wellness", url: `${SITE.url}/mens-wellness` },
    { name: "Men's Hormone Optimization", url: PAGE_URL },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mainLocalBusinessJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webPageJsonLd({
              title: "Men's Hormone Optimization | Hello Gorgeous Med Spa Oswego",
              description: PAGE_DESCRIPTION,
              path: MENS_HORMONES_PATH,
              image: MENS_HORMONES_HERO_IMAGE,
              dateModified: new Date().toISOString().split("T")[0],
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd(MENS_HORMONES_FAQS, PAGE_URL)),
        }}
      />

      <MensHormonesPageContent />
    </>
  );
}
