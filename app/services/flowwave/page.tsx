import type { Metadata } from "next";

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

      {/* Interactive FlowWave landing — full viewport, no site chrome (see ConditionalLayout). */}
      <div className="fixed inset-0 z-0 h-[100dvh] w-full bg-black">
        <iframe
          src="/flowwave-site/index.html"
          className="h-full w-full border-0"
          title="FlowWave Shockwave Therapy — Hello Gorgeous Med Spa"
        />
      </div>

      {/* Crawlable copy — sr-only so the design iframe stays full-screen */}
      <section
        className="sr-only"
        aria-label="FlowWave shockwave therapy Oswego Illinois"
      >
        <h1>
          FlowWave Shockwave Therapy in Oswego, IL — Hello Gorgeous Med Spa
        </h1>
        <p>{description}</p>
        <p>{FLOWWAVE_MARKETING.trustLine}</p>
        <ul>
          <li>
            <a href={FLOWWAVE_MARKETING.bookHref}>Book a FlowWave session</a>
          </li>
          <li>
            <a href={FLOWWAVE_MARKETING.phoneHref}>
              Call {FLOWWAVE_MARKETING.phoneDisplay}
            </a>
          </li>
        </ul>
        {FLOWWAVE_FAQS.map((faq) => (
          <div key={faq.q}>
            <h2>{faq.q}</h2>
            <p>{faq.a}</p>
          </div>
        ))}
      </section>
    </>
  );
}
