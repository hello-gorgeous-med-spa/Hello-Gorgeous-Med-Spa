import type { Metadata } from "next";

import { QuantumRFPageContent } from "@/components/quantum-rf/QuantumRFPageContent";
import {
  QUANTUM_RF_FAQS,
  QUANTUM_RF_MARKETING,
  QUANTUM_RF_PATH,
  QUANTUM_RF_SEO,
} from "@/lib/quantum-rf-marketing";
import {
  SITE,
  breadcrumbJsonLd,
  faqJsonLd,
  localBusinessJsonLd,
  pageMetadata,
  siteJsonLd,
  webPageJsonLd,
} from "@/lib/seo";

/** Quantum RF MedicalProcedure schema with treating physician */
function quantumRfProcedureJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    "@id": `${SITE.url}${QUANTUM_RF_PATH}#procedure`,
    name: "Quantum RF Subdermal Skin Tightening",
    alternateName: ["QuantumRF", "InMode Quantum RF", "Luxora Quantum RF"],
    procedureType: "https://schema.org/NoninvasiveProcedure",
    description:
      "QuantumRF by InMode delivers precise fat reduction and skin tightening with a small probe under local anesthesia — minimally invasive, in-office without an operating room.",
    bodyLocation: ["Face", "Neck", "Jawline", "Abdomen", "Arms", "Thighs"],
    howPerformed:
      "A small probe delivers controlled radiofrequency energy beneath the skin surface under local anesthesia with real-time temperature monitoring.",
    preparation: "Local anesthesia applied to treatment area. Consultation required for candidacy assessment.",
    followup:
      "3-7 days mild swelling. Compression garment for body areas. Progressive tightening over 3-6 months as collagen rebuilds.",
    status: "https://schema.org/EventScheduled",
    image: `${SITE.url}${QUANTUM_RF_MARKETING.images.hero}`,
    provider: {
      "@type": "MedicalBusiness",
      "@id": `${SITE.url}/#organization`,
      name: SITE.name,
    },
    medicalDirector: {
      "@type": "Physician",
      "@id": `${SITE.url}/#dr-mukesh-arora`,
      name: "Dr. Mukesh Arora, MD",
      honorificPrefix: "Dr.",
      jobTitle: "Medical Director",
      medicalSpecialty: "Internal Medicine",
      description:
        "Medical Director of Hello Gorgeous Med Spa. Board-certified Internal Medicine physician with 30+ years of experience.",
      worksFor: { "@id": `${SITE.url}/#organization` },
    },
    areaServed: SITE.serviceAreas.map((area) => ({ "@type": "Place", name: area })),
    potentialAction: {
      "@type": "ReserveAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE.url}/book`,
      },
      result: { "@type": "Reservation", name: "Quantum RF Consultation" },
    },
  };
}

export const revalidate = 3600;

const baseMeta = pageMetadata({
  title: QUANTUM_RF_SEO.title,
  description: QUANTUM_RF_SEO.description,
  path: QUANTUM_RF_PATH,
  keywords: [
    "Quantum RF Oswego IL",
    "QuantumRF InMode",
    "non surgical body contouring Naperville",
    "neck fat reduction Aurora IL",
    "Luxora InMode",
  ],
});

export const metadata: Metadata = {
  ...baseMeta,
  alternates: { canonical: `${SITE.url}${QUANTUM_RF_PATH}` },
  openGraph: {
    ...baseMeta.openGraph,
    images: [{ url: `${SITE.url}${QUANTUM_RF_MARKETING.images.hero}`, width: 1200, height: 630, alt: QUANTUM_RF_SEO.ogAlt }],
  },
  twitter: { ...baseMeta.twitter, images: [`${SITE.url}${QUANTUM_RF_MARKETING.images.hero}`] },
};

export default function QuantumRfServicePage() {
  const breadcrumbs = [
    { name: "Home", url: SITE.url },
    { name: "Services", url: `${SITE.url}/services` },
    { name: "Quantum RF", url: `${SITE.url}${QUANTUM_RF_PATH}` },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd("Oswego")) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(breadcrumbs)) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webPageJsonLd({
              title: QUANTUM_RF_SEO.title,
              description: QUANTUM_RF_SEO.description,
              path: QUANTUM_RF_PATH,
              image: QUANTUM_RF_MARKETING.images.hero,
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            faqJsonLd(
              QUANTUM_RF_FAQS.map((f) => ({ question: f.q, answer: f.a })),
              `${SITE.url}${QUANTUM_RF_PATH}`,
            ),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(quantumRfProcedureJsonLd()) }}
      />
      <QuantumRFPageContent />
    </>
  );
}
