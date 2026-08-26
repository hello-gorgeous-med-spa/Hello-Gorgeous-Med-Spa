import type { Metadata } from "next";

import { BotoxBashPageContent } from "@/components/events/BotoxBashPageContent";
import {
  BOTOX_BASH_CAMPAIGN,
  BOTOX_BASH_FAQS,
  BOTOX_BASH_PATH,
  STUDIO_PHOTOS,
} from "@/lib/campaigns/botox-bash-aug-2026";
import {
  SITE,
  breadcrumbJsonLd,
  eventJsonLd,
  faqJsonLd,
  imageGalleryJsonLd,
  pageMetadata,
  siteJsonLd,
} from "@/lib/seo";

const PAGE_URL = `${SITE.url}${BOTOX_BASH_PATH}`;
const OG_IMAGE = `${SITE.url}${BOTOX_BASH_CAMPAIGN.studioImagePath}`;

const DESCRIPTION =
  "See the new Hello Gorgeous Med Spa in downtown Oswego — then Weekend Botox Bash Fri Aug 28 (Girls Night 5–9 PM) & Sat Aug 29. Botox $9/unit + tax. Book now.";

const baseMeta = pageMetadata({
  title: "New Spa + Weekend Botox Bash — Aug 28–29 Oswego",
  description: DESCRIPTION,
  path: BOTOX_BASH_PATH,
  keywords: [
    "Botox Bash Oswego",
    "Botox special Oswego IL",
    "Hello Gorgeous Med Spa new studio",
    "Girls Night Out Botox Oswego",
    "$9 Botox Oswego",
  ],
});

export const metadata: Metadata = {
  ...baseMeta,
  openGraph: {
    ...baseMeta.openGraph,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 900,
        alt: "Hello Gorgeous Med Spa reception — new downtown Oswego studio",
      },
    ],
  },
  twitter: {
    ...baseMeta.twitter,
    images: [OG_IMAGE],
  },
};

export default function BotoxBashPage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Specials", url: `${SITE.url}/specials` },
    { name: "Weekend Botox Bash", url: PAGE_URL },
  ];

  const studioGallery = STUDIO_PHOTOS.map((photo) => ({
    src: photo.src,
    alt: photo.alt,
    title: `Hello Gorgeous Med Spa — ${photo.caption}`,
  }));

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
            eventJsonLd({
              name: "Girls Night Out Botox Bash",
              startDate: BOTOX_BASH_CAMPAIGN.fridayStartIso,
              endDate: BOTOX_BASH_CAMPAIGN.fridayEndIso,
              description:
                "Girls Night Out at Hello Gorgeous Med Spa — authentic Botox Cosmetic $9/unit + tax, champagne & appetizers (21+).",
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            eventJsonLd({
              name: "Weekend Botox Bash",
              startDate: BOTOX_BASH_CAMPAIGN.weekendStartIso,
              endDate: BOTOX_BASH_CAMPAIGN.weekendEndIso,
              description:
                "Weekend Botox Bash at the new downtown Oswego studio — $9/unit Botox + tax, event ½ syringe lip filler $399, double vitamin shot $50.",
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd([...BOTOX_BASH_FAQS], PAGE_URL)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            imageGalleryJsonLd(studioGallery, "New Hello Gorgeous Med Spa studio — downtown Oswego"),
          ),
        }}
      />
      <BotoxBashPageContent />
    </>
  );
}
