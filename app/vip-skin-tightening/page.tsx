import type { Metadata } from "next";
import { SITE } from "@/lib/seo";
import { VIPSkinTighteningContent } from "./VIPSkinTighteningContent";

const BASE_URL = SITE.url;
const PAGE_URL = `${BASE_URL}/vip-skin-tightening`;

export const metadata: Metadata = {
  title:
    "VIP Skin Tightening | Quantum RF Live — Contour Lift Model Days May 4 & 12 | Hello Gorgeous",
  description:
    "Quantum RF is live at Hello Gorgeous. Hello Gorgeous Contour Lift™ Model Days May 4 & May 12, 2026 — limited model spots from $1,499 (Quantum RF + Morpheus8 Body Deep). Morpheus8 & Solaria booking. $500 refundable VIP deposit where applicable.",
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
    title: "VIP Skin Tightening — Quantum RF Live · Contour Lift Model Days | Hello Gorgeous",
    description:
      "Quantum RF is booking now. Model Days May 4 & 12, 2026: save up to $1,000 on Contour Lift packages. Morpheus8 & Solaria also booking.",
    type: "website",
    url: PAGE_URL,
  },
  alternates: { canonical: PAGE_URL },
};

const MEDICAL_PROCEDURE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "MedicalProcedure",
  name: "Quantum RF and Morpheus8 VIP Skin Tightening",
  description:
    "Quantum RF subdermal contouring is live — Hello Gorgeous Contour Lift Model Days with introductory model pricing. Morpheus8 Burst & Solaria CO₂ booking.",
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
