import type { Metadata } from "next";
import { SITE } from "@/lib/seo";
import { VIPSkinTighteningContent } from "./VIPSkinTighteningContent";

const BASE_URL = SITE.url;
const PAGE_URL = `${BASE_URL}/vip-skin-tightening`;

export const metadata: Metadata = {
  title: "VIP Skin Tightening Launch Waitlist | Quantum RF & Morpheus8 | Hello Gorgeous Med Spa",
  description:
    "Secure introductory pricing on Quantum RF and Morpheus8. $500 refundable deposit. First clients receive FREE Full Face CO₂. Limited priority placements.",
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
    description: "Introductory pricing. $500 deposit. First clients get FREE Full Face CO₂ ($1,800 value).",
    type: "website",
    url: PAGE_URL,
  },
  alternates: { canonical: PAGE_URL },
};

const MEDICAL_PROCEDURE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "MedicalProcedure",
  name: "Quantum RF and Morpheus8 VIP Skin Tightening",
  description: "Minimally invasive subdermal RF skin tightening (Quantum RF) and RF microneedling (Morpheus8). VIP launch waitlist with introductory pricing.",
  procedureType: "Cosmetic",
  howPerformed: "Minimally invasive radiofrequency treatment with local anesthesia",
  preparation: "Consultation and pre-procedure care protocol",
  followup: "Post-procedure care protocol",
  status: "https://schema.org/ActiveAction",
  relevantSpecialty: {
    "@type": "MedicalSpecialty",
    name: "Cosmetic Dermatology",
  },
  code: {
    "@type": "MedicalCode",
    codeValue: "VIP-WAITLIST-2026",
    codingSystem: "https://hellogorgeousmedspa.com",
  },
  performer: {
    "@type": "MedicalBusiness",
    name: SITE.name,
    address: { "@type": "PostalAddress", ...SITE.address },
    telephone: SITE.phone,
  },
};

export default function VIPSkinTighteningPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(MEDICAL_PROCEDURE_SCHEMA) }}
      />
      <VIPSkinTighteningContent />
    </>
  );
}
