import type { Metadata } from "next";
import { SITE } from "@/lib/seo";
import { VIPSkinTighteningContent } from "./VIPSkinTighteningContent";

const BASE_URL = SITE.url;
const PAGE_URL = `${BASE_URL}/vip-skin-tightening`;

export const metadata: Metadata = {
  title: "VIP Skin Tightening Launch | Quantum RF & Morpheus8 | Hello Gorgeous Med Spa",
  description:
    "Exclusive VIP access to Quantum RF & Morpheus8 skin tightening. First 10 clients get FREE Full Face CO₂ ($1,800 value). $500 refundable deposit. Limited spots in Oswego, IL.",
  keywords: [
    "Quantum RF",
    "Morpheus8",
    "skin tightening",
    "VIP waitlist",
    "minimally invasive",
    "loose skin",
    "body contouring",
    "Hello Gorgeous Med Spa",
    "Oswego IL",
    "Naperville",
  ],
  openGraph: {
    title: "🔥 VIP Skin Tightening Launch — Limited Spots",
    description: "Quantum RF & Morpheus8 at introductory pricing. First 10 clients get FREE Full Face CO₂ ($1,800 value). Secure your spot with $500 refundable deposit.",
    url: PAGE_URL,
    siteName: "Hello Gorgeous Med Spa",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: `${BASE_URL}/images/morpheus8/facetite-chin.png`,
        width: 1200,
        height: 630,
        alt: "VIP Skin Tightening Launch - Quantum RF & Morpheus8 at Hello Gorgeous Med Spa",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "🔥 VIP Skin Tightening Launch — Limited Spots",
    description: "Quantum RF & Morpheus8 at introductory pricing. First 10 clients get FREE Full Face CO₂ ($1,800 value).",
    images: [`${BASE_URL}/images/morpheus8/facetite-chin.png`],
  },
  alternates: { canonical: PAGE_URL },
  robots: {
    index: true,
    follow: true,
  },
};

export default function VIPSkinTighteningPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalProcedure",
            name: "VIP Skin Tightening Launch - Quantum RF & Morpheus8",
            description: "Minimally invasive subdermal RF skin tightening. Quantum RF and Morpheus8 VIP launch waitlist with introductory pricing.",
            procedureType: "Cosmetic",
            howPerformed: "Minimally invasive subdermal RF; local anesthesia",
            preparation: "Consultation and $500 refundable deposit to secure VIP spot",
            followup: "Post-procedure care protocol provided",
            status: "https://schema.org/Recruiting",
            relevantCondition: {
              "@type": "MedicalCondition",
              name: "Skin laxity, body contouring",
            },
            location: {
              "@type": "Place",
              name: SITE.name,
              address: {
                "@type": "PostalAddress",
                streetAddress: SITE.address.streetAddress,
                addressLocality: SITE.address.addressLocality,
                addressRegion: SITE.address.addressRegion,
                postalCode: SITE.address.postalCode,
              },
            },
          }),
        }}
      />
      <VIPSkinTighteningContent />
    </>
  );
}
