import type { Metadata } from "next";
import { pageMetadata, SITE } from "@/lib/seo";
import { treatments } from "@/data/treatments";
import { TreatmentPageTemplate } from "@/components/marketing/TreatmentPageTemplate";

const t = treatments.morpheus8Burst;

export const metadata: Metadata = pageMetadata({
  title: "Morpheus8 Burst Near Me | Oswego, Naperville, Aurora IL | Hello Gorgeous",
  description:
    "Morpheus8 Burst near me — the deepest RF microneedling at 8mm. Only Oswego-area med spa with Burst. 15 min from Naperville, Aurora, Plainfield. Tighten skin, reduce wrinkles. Book free consultation.",
  path: "/morpheus8-burst-oswego-il",
  keywords: [
    "morpheus8 burst near me",
    "Morpheus8 Burst Oswego",
    "Morpheus8 Burst Naperville",
    "Morpheus8 Burst Aurora",
    "RF microneedling Oswego IL",
    "RF microneedling near me",
    "skin tightening Oswego",
    "Morpheus8 vs standard",
    "deepest RF microneedling",
    "loose skin treatment after weight loss",
    "acne scar treatment Oswego",
    "non surgical skin tightening Illinois",
  ],
});

const CROSS_LINKS = [
  { label: "Solaria CO₂ Laser", href: "/solaria-co2-laser-oswego-il" },
  { label: "QuantumRF Skin Tightening", href: "/quantum-rf-oswego-il" },
  { label: "InMode Trifecta VIP", href: "/trifecta-vip" },
];

export default function Morpheus8BurstPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalProcedure",
            name: "Morpheus8 Burst RF Microneedling",
            procedureType: "Radiofrequency Microneedling",
            bodyLocation: "Face, Neck, Body",
            description: t.description,
            howPerformed:
              "Burst technology delivers radiofrequency energy at 3 simultaneous depths (up to 8mm) through micro-pins, creating controlled micro-injuries while heating deep tissue to stimulate collagen production.",
            preparation: "Topical numbing cream applied 20-30 minutes before treatment.",
            followup: "3-5 days redness/swelling. Makeup-ready by day 5-7. Collagen remodeling continues 3-6 months.",
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
