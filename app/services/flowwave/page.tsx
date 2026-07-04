import type { Metadata } from "next";

import { FlowWavePageContent } from "@/components/flowwave/FlowWavePageContent";
import {
  FLOWWAVE_FAQS,
  FLOWWAVE_MARKETING,
  FLOWWAVE_PATH,
} from "@/lib/flowwave-marketing";
import {
  SITE,
  breadcrumbJsonLd,
  faqJsonLd,
  pageMetadata,
  siteJsonLd,
  webPageJsonLd,
} from "@/lib/seo";

const PATH = FLOWWAVE_PATH;
const OG_IMAGE = FLOWWAVE_MARKETING.images.recoveryBanner;

const title = "FlowWave Shockwave Therapy in Oswego, IL | Hello Gorgeous Med Spa";
const description =
  "FlowWave FOCUS focused shockwave therapy in Oswego, IL — deep-tissue pain relief, recovery, and men's wellness. Non-invasive, drug-free, 3–10 minute sessions. Intro special $175 first session. NP-directed care.";

const baseMeta = pageMetadata({
  title,
  description,
  path: PATH,
  keywords: [
    "FlowWave",
    "shockwave therapy Oswego",
    "focused shockwave therapy",
    "FlowWave FOCUS",
    "pain relief Naperville",
    "men's shockwave therapy Illinois",
    "acoustic wave therapy",
  ],
});

export const metadata: Metadata = {
  ...baseMeta,
  openGraph: {
    ...baseMeta.openGraph,
    images: [
      {
        url: `${SITE.url}${OG_IMAGE}`,
        width: 1672,
        height: 941,
        alt: "FlowWave FOCUS shockwave therapy — Hello Gorgeous Med Spa",
      },
    ],
  },
  twitter: {
    ...baseMeta.twitter,
    images: [`${SITE.url}${OG_IMAGE}`],
  },
};

export default function FlowWavePage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Services", url: `${SITE.url}/services` },
    { name: "FlowWave Shockwave Therapy", url: `${SITE.url}${PATH}` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webPageJsonLd({
              title,
              description,
              path: PATH,
              image: OG_IMAGE,
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            faqJsonLd(
              FLOWWAVE_FAQS.map((f) => ({ question: f.q, answer: f.a })),
              `${SITE.url}${PATH}`,
            ),
          ),
        }}
      />
      <FlowWavePageContent />
    </>
  );
}
