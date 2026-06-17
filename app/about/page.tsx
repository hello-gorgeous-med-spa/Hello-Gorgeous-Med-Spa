import type { Metadata } from "next";

import { AboutPageContent } from "@/components/about/AboutPageContent";
import {
  ABOUT_PAGE_SEO_DESCRIPTION,
  aboutPageGraphJsonLd,
} from "@/lib/founder-credentials";
import { breadcrumbJsonLd, pageMetadata, SITE, siteJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Danielle Alcala-Glazier & Ryan Kent, FNP-BC | Hello Gorgeous Med Spa Oswego IL",
  description: ABOUT_PAGE_SEO_DESCRIPTION,
  path: "/about",
  keywords: [
    "Danielle Alcala-Glazier",
    "Hello Gorgeous Med Spa Oswego",
    "med spa owner Oswego IL",
    "Ryan Kent FNP-BC",
    "nurse practitioner med spa Oswego",
    "Best of Oswego med spa",
    "Morpheus8 Oswego",
    "med spa Naperville Aurora Plainfield",
  ],
});

export default function AboutPage() {
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: SITE.url },
    { name: "About Dani & Ryan", url: `${SITE.url}/about` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutPageGraphJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />

      <AboutPageContent />
    </>
  );
}
