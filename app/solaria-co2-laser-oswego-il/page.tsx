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
  title: "Solaria CO₂ Laser Resurfacing | Hello Gorgeous Med Spa Oswego IL",
  description:
    "Advanced CO₂ laser resurfacing in Oswego IL. Improve wrinkles, acne scars and skin texture with Solaria fractional laser at Hello Gorgeous Med Spa. VIP launch special $1,895.",
  path: "/solaria-co2-laser-oswego-il",
  keywords: [
    "CO2 laser Oswego",
    "CO2 laser Naperville",
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
