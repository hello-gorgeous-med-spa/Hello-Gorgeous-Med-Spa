import type { Metadata } from "next";
import { ReferralContent } from "./ReferralContent";

export const metadata: Metadata = {
  title: "Referral Program - Give $25, Get $25 | Hello Gorgeous Med Spa",
  description:
    "Refer a friend to Hello Gorgeous Med Spa and you'll BOTH receive $25 off your next service. Share the glow and save together!",
  keywords: [
    "referral program",
    "refer a friend",
    "med spa referral",
    "Hello Gorgeous Med Spa",
    "Oswego IL",
    "save on treatments",
  ],
  openGraph: {
    title: "Give $25, Get $25 | Hello Gorgeous Referral Program",
    description:
      "Refer a friend and you'll BOTH receive $25 off your next service!",
    type: "website",
    url: "https://hellogorgeousmedspa.com/referral",
  },
};

export default function ReferralPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Offer",
            name: "Referral Program - Give $25, Get $25",
            description:
              "Refer a friend to Hello Gorgeous Med Spa and both receive $25 off",
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
            },
          }),
        }}
      />
      <ReferralContent />
    </>
  );
}
