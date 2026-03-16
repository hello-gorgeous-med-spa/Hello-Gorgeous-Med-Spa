import type { Metadata } from "next";
import { SpringBreakPromo } from "@/components/marketing/SpringBreakPromo";
import { SPRING_BREAK_SPECIAL } from "@/data/spring-break-special";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: `Semaglutide $299/month Spring Break Special | Ozempic Weight Loss | Hello Gorgeous`,
  description: `Spring Break Special: Semaglutide/Ozempic medical weight loss for $299/month — oversight, screening & medicine included. Get beach-ready. Oswego, Naperville, Aurora, Plainfield. Book now!`,
  keywords: [
    ...SPRING_BREAK_SPECIAL.keywords,
    "semaglutide oswego",
    "ozempic naperville",
    "weight loss aurora",
    "GLP-1 plainfield",
    "spring break special",
  ],
  alternates: { canonical: `${SITE.url}/semaglutide-spring-break-special` },
  openGraph: {
    type: "website",
    url: `${SITE.url}/semaglutide-spring-break-special`,
    title: "Semaglutide $299/month — Spring Break Special | Hello Gorgeous",
    description: "Get beach-ready. $299/month includes oversight, screening & medicine. Limited time.",
    siteName: SITE.name,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SpecialAnnouncement",
  name: "Semaglutide Spring Break Special — $299/month",
  description: "Medical weight loss with Semaglutide. $299/month includes medical oversight, screening, and medication. Limited time Spring Break special.",
  startDate: "2025-03-01",
  endDate: "2025-04-30",
  category: "Medical Weight Loss",
  provider: {
    "@type": "MedicalBusiness",
    name: SITE.name,
    url: SITE.url,
    telephone: SITE.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.streetAddress,
      addressLocality: SITE.address.addressLocality,
      addressRegion: SITE.address.addressRegion,
      postalCode: SITE.address.postalCode,
    },
  },
  areaServed: SPRING_BREAK_SPECIAL.cities.map((c) => ({ "@type": "City", name: `${c.name}, IL` })),
};

export default function SemaglutideSpringBreakSpecialPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SpringBreakPromo />
    </>
  );
}
