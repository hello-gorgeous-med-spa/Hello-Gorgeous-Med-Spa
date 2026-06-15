import type { Metadata } from "next";

import { IvShotsPageContent } from "@/components/iv-shots/IvShotsPageContent";
import { ivDripMenuItemListJsonLd } from "@/lib/iv-drip-menu";
import { IV_SHOTS_FAQS, IV_SHOTS_META, IV_SHOTS_PATH } from "@/lib/iv-shots-page";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata, SITE } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: IV_SHOTS_META.title,
  description: IV_SHOTS_META.description,
  path: IV_SHOTS_PATH,
  keywords: [
    "IV therapy Oswego IL",
    "vitamin shots Oswego",
    "IV drip Naperville",
    "drive thru vitamin bar",
    "NAD+ injection Oswego",
    "Myers cocktail Oswego",
    "Hello Gorgeous vitamin bar",
  ],
});

export default function IvShotsPage() {
  const pageUrl = `${SITE.url}${IV_SHOTS_PATH}`;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ivDripMenuItemListJsonLd(pageUrl)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: SITE.url },
              { name: "IV Therapy & Shots", url: pageUrl },
            ]),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd([...IV_SHOTS_FAQS], pageUrl)),
        }}
      />
      <IvShotsPageContent />
    </>
  );
}
