import type { Metadata } from "next";

import { UpneeqPageContent } from "@/components/upneeq/UpneeqPageContent";
import {
  UPNEEQ_FAQ,
  UPNEEQ_OG_IMAGE,
  UPNEEQ_PATH,
  UPNEEQ_SEO,
} from "@/lib/upneeq-marketing";
import { SITE, breadcrumbJsonLd, faqJsonLd, pageMetadata, siteJsonLd } from "@/lib/seo";

const PAGE_URL = `${SITE.url}${UPNEEQ_PATH}`;
const OG = `${SITE.url}${UPNEEQ_OG_IMAGE}`;

const baseMeta = pageMetadata({
  title: UPNEEQ_SEO.title,
  description: UPNEEQ_SEO.description,
  path: UPNEEQ_PATH,
  keywords: [
    "Upneeq Oswego",
    "Upneeq eye drops Illinois",
    "acquired ptosis Oswego IL",
    "droopy eyelid drop Naperville",
    "Hello Gorgeous Upneeq",
  ],
});

export const metadata: Metadata = {
  ...baseMeta,
  openGraph: {
    ...baseMeta.openGraph,
    url: PAGE_URL,
    images: [{ url: OG, width: 1200, height: 630, alt: UPNEEQ_SEO.ogAlt }],
  },
  twitter: {
    ...baseMeta.twitter,
    images: [OG],
  },
};

export default function UpneeqPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: SITE.url },
              { name: "Injectables", url: `${SITE.url}/injectables` },
              { name: "Upneeq", url: PAGE_URL },
            ]),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(UPNEEQ_FAQ, PAGE_URL)) }}
      />
      <UpneeqPageContent brand="hg" />
    </>
  );
}
