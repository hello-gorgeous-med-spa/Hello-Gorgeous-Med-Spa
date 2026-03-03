import type { Metadata } from "next";
import { SITE } from "@/lib/seo";
import { TrifectaVIPContent } from "./TrifectaVIPContent";

const BASE_URL = SITE.url;
const PAGE_URL = `${BASE_URL}/trifecta-vip`;

export const metadata: Metadata = {
  title: "Trifecta VIP Waitlist — $100 Off Any Service | Hello Gorgeous Med Spa",
  description:
    "Join the VIP waitlist for Morpheus8, QuantumRF & Solaria CO₂. Get $100 off any service at Hello Gorgeous Med Spa in Oswego, IL. Limited spots.",
  keywords: [
    "Morpheus8",
    "QuantumRF",
    "Solaria CO2",
    "VIP waitlist",
    "$100 off",
    "Hello Gorgeous Med Spa",
    "Oswego IL",
    "RF microneedling",
    "fractional laser",
    "skin tightening",
  ],
  openGraph: {
    title: "Trifecta VIP — $100 Off When You Join Our Waitlist",
    description: "Join the VIP waitlist for our most advanced treatments. Get $100 off any service.",
    type: "website",
    url: PAGE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Trifecta VIP — $100 Off Any Service | Hello Gorgeous Med Spa",
    description: "Join the VIP waitlist. Get $100 off any service.",
  },
  alternates: { canonical: PAGE_URL },
};

export default function TrifectaVIPPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Offer",
            name: "Trifecta VIP Waitlist — $100 Off Any Service",
            description:
              "Join the VIP waitlist for Morpheus8, QuantumRF, and Solaria CO₂. Get $100 off any service at Hello Gorgeous Med Spa.",
            priceSpecification: {
              "@type": "PriceSpecification",
              price: "100",
              priceCurrency: "USD",
              valueAddedTaxIncluded: false,
            },
            availability: "https://schema.org/LimitedAvailability",
            validFrom: new Date().toISOString(),
            url: PAGE_URL,
            seller: {
              "@type": "LocalBusiness",
              name: SITE.name,
              address: {
                "@type": "PostalAddress",
                streetAddress: SITE.address.streetAddress,
                addressLocality: SITE.address.addressLocality,
                addressRegion: SITE.address.addressRegion,
                postalCode: SITE.address.postalCode,
              },
              telephone: SITE.phone,
            },
          }),
        }}
      />
      <TrifectaVIPContent />
    </>
  );
}
