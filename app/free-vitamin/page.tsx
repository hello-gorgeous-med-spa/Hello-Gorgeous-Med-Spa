import type { Metadata } from "next";
import { FreeVitaminContent } from "./FreeVitaminContent";

export const metadata: Metadata = {
  title: "FREE Vitamin Injection | Hello Gorgeous Med Spa",
  description:
    "Claim your FREE vitamin injection (up to $65 value) at Hello Gorgeous Med Spa in Oswego, IL. Choose from B12, Vitamin D, Biotin, or Glutathione. Limited time offer!",
  keywords: [
    "free vitamin injection",
    "free B12 shot",
    "free vitamin D injection",
    "Hello Gorgeous Med Spa",
    "Oswego IL med spa",
    "vitamin injections near me",
    "free wellness offer",
  ],
  openGraph: {
    title: "FREE Vitamin Injection | Hello Gorgeous Med Spa",
    description:
      "Claim your FREE vitamin injection (up to $65 value). Choose B12, Vitamin D, Biotin, or Glutathione!",
    type: "website",
    url: "https://hellogorgeousmedspa.com/free-vitamin",
    images: [
      {
        url: "/images/free-vitamin-og.jpg",
        width: 1200,
        height: 630,
        alt: "Free Vitamin Injection Offer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FREE Vitamin Injection | Hello Gorgeous Med Spa",
    description: "Claim your FREE vitamin injection (up to $65 value)!",
  },
};

export default function FreeVitaminPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Offer",
            name: "Free Vitamin Injection",
            description:
              "Complimentary vitamin injection for new subscribers at Hello Gorgeous Med Spa",
            price: "0",
            priceCurrency: "USD",
            availability: "https://schema.org/LimitedAvailability",
            validFrom: new Date().toISOString(),
            seller: {
              "@type": "LocalBusiness",
              name: "Hello Gorgeous Med Spa",
              address: {
                "@type": "PostalAddress",
                streetAddress: "74 W. Washington St",
                addressLocality: "Oswego",
                addressRegion: "IL",
                postalCode: "60543",
              },
              telephone: "630-636-6193",
            },
          }),
        }}
      />
      <FreeVitaminContent />
    </>
  );
}
