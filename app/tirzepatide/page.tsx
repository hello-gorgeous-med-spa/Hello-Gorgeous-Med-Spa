import type { Metadata } from "next";

import { TirzepatideLearnPageContent } from "@/components/tirzepatide/TirzepatideLearnPageContent";
import { clinicalPageJsonLd } from "@/lib/medical-authority";
import {
  SITE,
  breadcrumbJsonLd,
  faqJsonLd,
  pageMetadata,
  siteJsonLd,
  webPageJsonLd,
} from "@/lib/seo";
import { TIRZEPATIDE_LEARN, TIRZEPATIDE_LEARN_FAQS, TIRZEPATIDE_LEARN_PATH } from "@/lib/tirzepatide-learn";

const PAGE_URL = `${SITE.url}${TIRZEPATIDE_LEARN_PATH}`;

const baseMeta = pageMetadata({
  title: TIRZEPATIDE_LEARN.title,
  description: TIRZEPATIDE_LEARN.description,
  path: TIRZEPATIDE_LEARN_PATH,
  keywords: [
    "tirzepatide Oswego IL",
    "tirzepatide weight loss Naperville",
    "compounded tirzepatide Illinois",
    "GLP-1 GIP Oswego",
    "Hello Gorgeous RX tirzepatide",
    "medical weight loss Aurora Plainfield",
    "Zepbound alternative Oswego",
    "NP supervised tirzepatide Yorkville Montgomery",
  ],
});

export const metadata: Metadata = {
  ...baseMeta,
  openGraph: {
    ...baseMeta.openGraph,
    url: PAGE_URL,
    images: [
      {
        url: `${SITE.url}${TIRZEPATIDE_LEARN.image}`,
        width: 1200,
        height: 1600,
        alt: TIRZEPATIDE_LEARN.imageAlt,
      },
    ],
  },
  twitter: {
    ...baseMeta.twitter,
    card: "summary_large_image",
    images: [`${SITE.url}${TIRZEPATIDE_LEARN.image}`],
  },
};

export const revalidate = 3600;

export default function TirzepatideLearnPage() {
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", url: SITE.url },
    { name: "Hello Gorgeous RX", url: `${SITE.url}/rx` },
    { name: "Tirzepatide", url: PAGE_URL },
  ]);

  const webPage = webPageJsonLd({
    title: TIRZEPATIDE_LEARN.title,
    description: TIRZEPATIDE_LEARN.description,
    path: TIRZEPATIDE_LEARN_PATH,
    image: TIRZEPATIDE_LEARN.image,
  });

  const clinicalLd = clinicalPageJsonLd({
    url: PAGE_URL,
    name: TIRZEPATIDE_LEARN.title,
    description: TIRZEPATIDE_LEARN.description,
    siteUrl: SITE.url,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPage) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(TIRZEPATIDE_LEARN_FAQS, PAGE_URL)) }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(clinicalLd) }} />
      <TirzepatideLearnPageContent />
    </>
  );
}
