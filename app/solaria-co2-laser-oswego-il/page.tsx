import type { Metadata } from "next";
import { pageMetadata, SITE } from "@/lib/seo";
import {
  HeroSection,
  TreatmentOverview,
  ConditionsTreated,
  TreatmentAreas,
  BeforeAfterGallery,
  VIPOffer,
  FAQSection,
  CallToAction,
} from "@/components/marketing/solaria";

export const metadata: Metadata = pageMetadata({
  title: "CO2 Laser Near Me | Solaria Oswego, Naperville, Aurora IL | Hello Gorgeous",
  description:
    "CO2 laser near me — Solaria fractional laser resurfacing. Only Oswego-area med spa with Solaria. 15 min from Naperville, Aurora, Plainfield. Wrinkles, acne scars, skin texture. Book free consultation.",
  path: "/solaria-co2-laser-oswego-il",
  keywords: [
    "CO2 laser near me",
    "Solaria CO2 near me",
    "CO2 laser Oswego",
    "CO2 laser Naperville",
    "CO2 laser Aurora",
    "fractional CO2 laser Illinois",
    "acne scar laser treatment",
    "skin resurfacing Oswego",
    "Solaria CO2 laser",
    "fractional laser resurfacing near me",
    "CO2 laser treatment Chicago suburbs",
    "skin tightening laser Oswego IL",
    "wrinkle treatment Naperville",
  ],
});

export default function SolariaPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MedicalProcedure",
            name: "Solaria CO₂ Fractional Laser Resurfacing",
            procedureType: "Laser Skin Resurfacing",
            bodyLocation: "Face, Neck, Chest",
            description:
              "Advanced fractional CO₂ laser resurfacing for wrinkles, acne scars, sun damage, and skin tightening. Gold standard in skin rejuvenation technology.",
            howPerformed:
              "Fractional CO₂ laser energy is delivered to microscopic zones of skin, removing damaged tissue and stimulating collagen production for smoother, tighter skin.",
            preparation:
              "Topical numbing cream is applied 20-30 minutes before treatment for patient comfort.",
            followup:
              "Mild redness for 1-3 days. Light peeling days 3-5. Smoother skin by day 7. Collagen remodeling continues 3-6 months.",
            status: "https://schema.org/ActiveActionStatus",
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
              geo: {
                "@type": "GeoCoordinates",
                latitude: SITE.address.lat,
                longitude: SITE.address.lng,
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
            "@type": "LocalBusiness",
            name: SITE.name,
            telephone: SITE.phone,
            url: SITE.url,
            priceRange: "$$",
            address: {
              "@type": "PostalAddress",
              streetAddress: SITE.address.streetAddress,
              addressLocality: SITE.address.addressLocality,
              addressRegion: SITE.address.addressRegion,
              postalCode: SITE.address.postalCode,
              addressCountry: "US",
            },
            areaServed: [
              { "@type": "City", name: "Oswego" },
              { "@type": "City", name: "Naperville" },
              { "@type": "City", name: "Aurora" },
              { "@type": "City", name: "Plainfield" },
              { "@type": "City", name: "Montgomery" },
              { "@type": "City", name: "Yorkville" },
            ],
          }),
        }}
      />
      <main className="bg-white">
        <HeroSection />
        <TreatmentOverview />
        <ConditionsTreated />
        <TreatmentAreas />
        <BeforeAfterGallery />
        <VIPOffer />
        <FAQSection />
        <CallToAction />
      </main>
    </>
  );
}
