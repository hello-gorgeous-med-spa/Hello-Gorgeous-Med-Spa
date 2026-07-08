// ============================================================
// Public booking — /book embeds Square Appointments widget
// ============================================================

import type { Metadata } from "next";

import { SquareBookPageContent } from "@/components/booking/SquareBookPageContent";
import { pageMetadata, SITE, siteJsonLd, breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Book Consultation | Hello Gorgeous Med Spa",
    description:
      "Book your consultation at Hello Gorgeous Med Spa in Oswego, IL. Schedule injectables, Morpheus8, Quantum RF, Solaria CO2, medical weight loss, and wellness visits online with Square.",
    path: "/book",
  }),
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function BookPage() {
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: SITE.url },
    { name: "Book", url: `${SITE.url}/book` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <SquareBookPageContent />
    </>
  );
}
