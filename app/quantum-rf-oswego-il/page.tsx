import type { Metadata } from "next";
import { pageMetadata, SITE } from "@/lib/seo";
import { treatments } from "@/data/treatments";
import { TreatmentPageTemplate } from "@/components/marketing/TreatmentPageTemplate";
import { QuantumRFRyanActionSlideshow } from "@/components/marketing/QuantumRFRyanActionSlideshow";
import { QuantumRFLaunchPromoSection } from "@/components/marketing/QuantumRFLaunchPromoSection";

const t = treatments.quantumRF;

const _quantumNearMeMeta = pageMetadata({
  title: "InMode Quantum RF Body Contouring Near Me | Oswego, Naperville, Aurora IL",
  description:
    "InMode Quantum RF near me in Oswego, IL: minimally invasive subdermal skin tightening and body contouring with tiny entry points (not large excisional incisions). Serving Naperville, Aurora, Plainfield. Book your consultation.",
  path: "/quantum-rf-oswego-il",
  keywords: [
    "InMode Quantum RF near me",
    "Quantum RF body contouring Oswego",
    "QuantumRF Oswego",
    "QuantumRF Naperville",
    "non surgical lipo Illinois",
    "neck tightening RF Aurora IL",
    "abdomen contouring without surgery",
    "post GLP-1 skin laxity Oswego",
    "Morpheus8 Burst Oswego",
    "subdermal RF tightening",
    "Hello Gorgeous Quantum RF",
    "Cherry financing med spa",
  ],
});

export const metadata: Metadata = _quantumNearMeMeta;

const CROSS_LINKS = [
  { label: "Solaria CO₂ Laser", href: "/solaria-co2-laser-oswego-il" },
  { label: "Morpheus8 Burst", href: "/morpheus8-burst-oswego-il" },
  { label: "InMode Trifecta", href: "/specials" },
];

export default function QuantumRFPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalProcedure",
            name: "QuantumRF Subdermal Skin Tightening",
            procedureType: "Radiofrequency Skin Tightening",
            bodyLocation: "Face, Neck, Body",
            description: t.description,
            howPerformed:
              "A small probe delivers controlled radiofrequency energy beneath the skin surface with real-time temperature monitoring, causing internal tissue contraction and long-term collagen stimulation.",
            disambiguatingDescription:
              "This is a minimally invasive procedure performed through tiny access points under local anesthesia, not a large-incision excisional surgery.",
            preparation: "Local anesthesia applied to treatment area.",
            followup: "3-7 days mild swelling. Compression garment for body areas. Progressive tightening over 3-6 months.",
            provider: {
              "@type": "MedicalBusiness",
              name: SITE.name,
              telephone: SITE.phone,
              url: SITE.url,
              areaServed: SITE.serviceAreas,
              address: {
                "@type": "PostalAddress",
                streetAddress: SITE.address.streetAddress,
                addressLocality: SITE.address.addressLocality,
                addressRegion: SITE.address.addressRegion,
                postalCode: SITE.address.postalCode,
                addressCountry: "US",
              },
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: t.faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: { "@type": "Answer", text: faq.answer },
            })),
          }),
        }}
      />
      <TreatmentPageTemplate treatment={t} crossLinks={CROSS_LINKS} />
      <QuantumRFLaunchPromoSection id="packages" />
      <QuantumRFRyanActionSlideshow />
    </>
  );
}
