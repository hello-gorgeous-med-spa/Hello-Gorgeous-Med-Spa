import type { Metadata } from "next";

import { FLOWWAVE_MARKETING, FLOWWAVE_PATH } from "@/lib/flowwave-marketing";
import {
  SITE,
  breadcrumbJsonLd,
  pageMetadata,
  siteJsonLd,
  webPageJsonLd,
} from "@/lib/seo";

const PATH = "/services/flowwave/brochure";
const BROCHURE_HTML = "/flowwave-brochure-site/index.html";

const title = "FlowWave Brochure | Shockwave Therapy | Hello Gorgeous Med Spa";
const description =
  "Interactive FlowWave FOCUS shockwave therapy brochure — focused acoustic-wave treatment for pain relief, recovery, and men's wellness at Hello Gorgeous Med Spa, Oswego IL.";

export const metadata: Metadata = {
  ...pageMetadata({
    title,
    description,
    path: PATH,
    keywords: ["FlowWave brochure", "shockwave therapy brochure", "FlowWave FOCUS"],
  }),
  robots: { index: true, follow: true },
};

export default function FlowWaveBrochurePage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "FlowWave", url: `${SITE.url}${FLOWWAVE_PATH}` },
    { name: "Brochure", url: `${SITE.url}${PATH}` },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
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
              title,
              description,
              path: PATH,
              image: FLOWWAVE_MARKETING.images.deviceBanner,
            }),
          ),
        }}
      />

      <div className="fixed inset-0 z-0 h-[100dvh] w-full bg-black">
        <iframe
          src={BROCHURE_HTML}
          className="h-full w-full border-0"
          title="FlowWave Shockwave Therapy Brochure — Hello Gorgeous Med Spa"
        />
      </div>

      <section className="sr-only" aria-label="FlowWave shockwave therapy brochure">
        <h1>{title}</h1>
        <p>{description}</p>
        <p>{FLOWWAVE_MARKETING.trustLine}</p>
        <a href={FLOWWAVE_PATH}>Back to FlowWave</a>
        <a href="/brochure/flowwave-shockwave-therapy.pdf">Download PDF brochure</a>
      </section>
    </>
  );
}
