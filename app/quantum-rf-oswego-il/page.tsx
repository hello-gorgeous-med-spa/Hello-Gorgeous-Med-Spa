import type { Metadata } from "next";
import { pageMetadata, SITE } from "@/lib/seo";
import { treatments } from "@/data/treatments";
import { TreatmentPageTemplate } from "@/components/marketing/TreatmentPageTemplate";

const t = treatments.quantumRF;

export const metadata: Metadata = pageMetadata({
  title: "QuantumRF Near Me | Oswego, Naperville, Aurora IL | Hello Gorgeous",
  description:
    "QuantumRF near me — subdermal skin tightening without surgery. Only Oswego-area med spa with QuantumRF. 15 min from Naperville, Aurora, Plainfield. Tighten loose skin, contour body. Book free consultation.",
  path: "/quantum-rf-oswego-il",
  keywords: [
    "QuantumRF near me",
    "QuantumRF Oswego",
    "QuantumRF Naperville",
    "QuantumRF Aurora",
    "QuantumRF skin tightening",
    "subdermal RF tightening",
    "non surgical skin tightening Oswego",
    "non surgical facelift Naperville",
    "body contouring Oswego IL",
    "loose skin treatment after weight loss",
    "skin tightening without surgery",
    "radiofrequency skin tightening Illinois",
  ],
});

const CROSS_LINKS = [
  { label: "Solaria CO₂ Laser", href: "/solaria-co2-laser-oswego-il" },
  { label: "Morpheus8 Burst", href: "/morpheus8-burst-oswego-il" },
  { label: "InMode Trifecta VIP", href: "/trifecta-vip" },
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
            preparation: "Local anesthesia applied to treatment area.",
            followup: "3-7 days mild swelling. Compression garment for body areas. Progressive tightening over 3-6 months.",
            provider: {
              "@type": "MedicalBusiness",
              name: SITE.name,
              telephone: SITE.phone,
              url: SITE.url,
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
    </>
  );
}
