import type { Metadata } from "next";

import { ServiceMenuPageLayout } from "@/components/services/ServiceMenuPageLayout";
import { HAIR_RESTORATION_EXOSOMES_MENU } from "@/lib/hair-restoration-exosomes-menu";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata, siteJsonLd, SITE } from "@/lib/seo";

const PAGE_URL = `${SITE.url}${HAIR_RESTORATION_EXOSOMES_MENU.path}`;
const OG_IMAGE = `${SITE.url}/images/anteage/hair/mdx-biosome-hair-solution-ba.png`;

export const metadata: Metadata = {
  ...pageMetadata({
    title: HAIR_RESTORATION_EXOSOMES_MENU.metaTitle,
    description: HAIR_RESTORATION_EXOSOMES_MENU.metaDescription,
    path: HAIR_RESTORATION_EXOSOMES_MENU.path,
    keywords: [
      "AnteAGE MDX Biosome Hair Solution",
      "AnteAGE scalp treatment Oswego",
      "exosome hair restoration Oswego IL",
      "biosome hair serum med spa",
      "hair thinning treatment Naperville",
      "growth factor scalp treatment Aurora IL",
      "non surgical hair restoration Plainfield",
    ],
  }),
  openGraph: {
    title: HAIR_RESTORATION_EXOSOMES_MENU.metaTitle,
    description: HAIR_RESTORATION_EXOSOMES_MENU.metaDescription,
    url: PAGE_URL,
    images: [{ url: OG_IMAGE, alt: "AnteAGE MDX Biosome Hair Solution before and after" }],
  },
  twitter: {
    card: "summary_large_image",
    title: HAIR_RESTORATION_EXOSOMES_MENU.metaTitle,
    description: HAIR_RESTORATION_EXOSOMES_MENU.metaDescription,
    images: [OG_IMAGE],
  },
};

export default function HairRestorationExosomesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: SITE.url },
              { name: "Services", url: `${SITE.url}/services` },
              { name: "AnteAGE Hair Restoration", url: PAGE_URL },
            ]),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd(HAIR_RESTORATION_EXOSOMES_MENU.faqs, PAGE_URL)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalProcedure",
            name: "AnteAGE MDX Biosome Hair Scalp Treatment",
            alternateName: [
              "AnteAGE MDX Hair Biosomes",
              "AnteAGE MD Scalp Treatment",
              "Exosome hair restoration",
              "Biosome hair solution",
            ],
            procedureType: "https://schema.org/NoninvasiveProcedure",
            description: HAIR_RESTORATION_EXOSOMES_MENU.metaDescription,
            bodyLocation: "Scalp",
            image: OG_IMAGE,
            url: PAGE_URL,
            performer: {
              "@type": "MedicalBusiness",
              name: SITE.name,
              url: SITE.url,
              telephone: SITE.phone,
              address: {
                "@type": "PostalAddress",
                streetAddress: SITE.address.streetAddress,
                addressLocality: SITE.address.addressLocality,
                addressRegion: SITE.address.addressRegion,
                postalCode: SITE.address.postalCode,
                addressCountry: "US",
              },
            },
            offers: [
              {
                "@type": "Offer",
                name: "AnteAGE MD Scalp Treatment",
                priceCurrency: "USD",
                price: "350",
                availability: "https://schema.org/InStock",
                url: PAGE_URL,
              },
              {
                "@type": "Offer",
                name: "Hair Restoration with Exosome Injections",
                priceCurrency: "USD",
                price: "499",
                availability: "https://schema.org/InStock",
                url: PAGE_URL,
              },
            ],
          }),
        }}
      />
      <ServiceMenuPageLayout config={HAIR_RESTORATION_EXOSOMES_MENU} />
    </>
  );
}
