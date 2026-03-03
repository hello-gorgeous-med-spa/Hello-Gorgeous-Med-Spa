import type { Metadata } from "next";
import { SITE } from "@/lib/seo";
import { VIPSkinTighteningContent } from "./VIPSkinTighteningContent";

const BASE_URL = SITE.url;
const PAGE_URL = `${BASE_URL}/vip-skin-tightening`;

export const metadata: Metadata = {
  title: "VIP Skin Tightening Launch Waitlist | Quantum RF & Morpheus8 | Hello Gorgeous Med Spa",
  description:
    "Secure introductory pricing on Quantum RF and Morpheus8. $500 refundable deposit. First 10 Quantum RF clients get FREE Full Face CO₂ ($1,800 value). Limited spots.",
  keywords: [
    "Quantum RF",
    "Morpheus8",
    "skin tightening",
    "VIP waitlist",
    "minimally invasive",
    "Hello Gorgeous Med Spa",
    "Oswego IL",
  ],
  openGraph: {
    title: "VIP Skin Tightening Launch — Quantum RF & Morpheus8",
    description: "Introductory pricing. $500 deposit. First clients get FREE Full Face CO₂.",
    url: PAGE_URL,
    type: "website",
  },
  alternates: { canonical: PAGE_URL },
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
