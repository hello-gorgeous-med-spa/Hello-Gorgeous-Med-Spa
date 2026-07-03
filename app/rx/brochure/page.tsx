import type { Metadata } from "next";

import { RegenBrochureSharePage } from "@/components/regen/RegenBrochureSharePage";
import {
  REGEN_BROCHURE_SHARE_PATH,
  REGEN_BROCHURE_THUMBNAIL,
} from "@/lib/regen-brochure";
import { REGEN_BRAND, REGEN_MARKETING } from "@/lib/regen-brand";
import { breadcrumbJsonLd, pageMetadata, SITE, webPageJsonLd } from "@/lib/seo";

const PAGE_PATH = REGEN_BROCHURE_SHARE_PATH;
const PAGE_URL = `${SITE.url}${PAGE_PATH}`;
const THUMB_URL = `${SITE.url}${REGEN_MARKETING.ogImage}`;
const PREVIEW_IMAGE = `${SITE.url}${REGEN_BROCHURE_THUMBNAIL}`;

const title = `${REGEN_BRAND.name} Brochure & Pricing | Hello Gorgeous Med Spa`;
const description =
  "Download the RE GEN patient brochure or browse transparent pricing for GLP-1 weight loss, peptides, hormones and wellness — NP-directed care from Hello Gorgeous Med Spa, Oswego IL.";

const baseMeta = pageMetadata({
  title,
  description,
  path: PAGE_PATH,
  keywords: [
    "RE GEN brochure",
    "Hello Gorgeous Med Spa handout",
    "GLP-1 weight loss Oswego",
    "peptide therapy Illinois",
    "medical weight loss brochure",
  ],
});

export const metadata: Metadata = {
  ...baseMeta,
  openGraph: {
    ...baseMeta.openGraph,
    url: PAGE_URL,
    type: "website",
    images: [
      {
        url: THUMB_URL,
        width: 1200,
        height: 630,
        alt: "RE GEN brochure — medical weight loss, peptides and hormones",
      },
    ],
  },
  twitter: {
    ...baseMeta.twitter,
    card: "summary_large_image",
    images: [THUMB_URL],
  },
};

const breadcrumbs = breadcrumbJsonLd([
  { name: "Home", url: SITE.url },
  { name: "RE GEN", url: `${SITE.url}/rx` },
  { name: "Brochure", url: PAGE_URL },
]);

const webPage = webPageJsonLd({ title, description, path: PAGE_PATH, image: PREVIEW_IMAGE });

export default function RegenBrochureShareRoute() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPage) }}
      />
      <RegenBrochureSharePage />
    </>
  );
}
