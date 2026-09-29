import type { Metadata } from "next";

import { UpneeqPageContent } from "@/components/upneeq/UpneeqPageContent";
import {
  UPNEEQ_FAQ,
  UPNEEQ_OG_IMAGE,
  UPNEEQ_REGEN_SEO,
  UPNEEQ_REGEN_URL,
} from "@/lib/upneeq-marketing";
import { faqJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: UPNEEQ_REGEN_SEO.title,
  description: UPNEEQ_REGEN_SEO.description,
  alternates: { canonical: UPNEEQ_REGEN_URL },
  openGraph: {
    title: UPNEEQ_REGEN_SEO.title,
    description: UPNEEQ_REGEN_SEO.description,
    url: UPNEEQ_REGEN_URL,
    images: [{ url: `https://tryregenrx.com${UPNEEQ_OG_IMAGE}`, width: 1200, height: 630, alt: UPNEEQ_REGEN_SEO.ogAlt }],
  },
};

export default function RegenUpneeqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(UPNEEQ_FAQ, UPNEEQ_REGEN_URL)) }}
      />
      <UpneeqPageContent brand="regen" />
    </>
  );
}
