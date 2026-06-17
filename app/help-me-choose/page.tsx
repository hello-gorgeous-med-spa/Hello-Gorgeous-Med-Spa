import type { Metadata } from "next";

import { HelpMeChooseContent } from "@/components/help-me-choose/HelpMeChooseContent";
import { breadcrumbJsonLd, SITE, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Help Me Choose a Treatment | Hello Gorgeous Med Spa Oswego IL",
  description:
    "Not sure what to book? Find the right med spa treatment at Hello Gorgeous in Oswego, IL — Botox, Morpheus8, Solaria CO₂, Quantum RF, weight loss, hormones, fillers, and more.",
  path: "/help-me-choose",
  keywords: [
    "med spa treatment guide Oswego",
    "what treatment should I get med spa",
    "Botox vs filler Oswego",
    "skin tightening Oswego IL",
    "help me choose med spa",
  ],
});

export default function HelpMeChoosePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: SITE.url },
              { name: "Help Me Choose", url: `${SITE.url}/help-me-choose` },
            ]),
          ),
        }}
      />
      <HelpMeChooseContent />
    </>
  );
}
