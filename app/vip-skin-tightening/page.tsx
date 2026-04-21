import type { Metadata } from "next";
import { SITE } from "@/lib/seo";
import { VIPSkinTighteningContent } from "./VIPSkinTighteningContent";

const BASE_URL = SITE.url;
const PAGE_URL = `${BASE_URL}/vip-skin-tightening`;

export const metadata: Metadata = {
  title: "VIP Skin Tightening | Quantum RF Waitlist | Morpheus8 & Solaria Now Booking | Hello Gorgeous",
  description:
    "Morpheus8 Burst & Solaria CO₂ now booking. Quantum RF coming soon — join the waitlist for priority access. $500 refundable deposit. First Quantum clients receive FREE Full Face CO₂.",
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
    title: "VIP Skin Tightening — Morpheus8 & Solaria Now Booking | Quantum RF Coming Soon",
    description: "Morpheus8 Burst & Solaria CO₂ now taking clients. Quantum RF waitlist open. $500 deposit. First Quantum clients get FREE Full Face CO₂.",
    type: "website",
    url: PAGE_URL,
  },
  alternates: { canonical: PAGE_URL },
};

const MEDICAL_PROCEDURE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "MedicalProcedure",
  name: "Quantum RF and Morpheus8 VIP Skin Tightening",
  description: "Morpheus8 Burst & Solaria CO₂ now booking. Quantum RF subdermal contouring coming soon — VIP waitlist with introductory pricing.",
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
    codingSystem: SITE.url,
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
