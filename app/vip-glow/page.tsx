import type { Metadata } from "next";

import { VipGlowNightPageContent } from "@/components/vip-glow/VipGlowNightPageContent";
import { SITE, breadcrumbJsonLd, faqJsonLd, pageMetadata, siteJsonLd } from "@/lib/seo";
import { VIP_GLOW_FLYER, VIP_GLOW_PATH, VIP_GLOW_SEO } from "@/lib/vip-glow-night";

const PAGE_URL = `${SITE.url}${VIP_GLOW_PATH}`;
const OG = `${SITE.url}${VIP_GLOW_FLYER}`;

const FAQS = [
  {
    question: "How do I RSVP for VIP Glow Night?",
    answer:
      "Open hellogorgeousmedspa.com/vip-glow, pick a time between 5:00 PM and 9:30 PM, tap the treatments you want, and tell us what your friend wants if she is coming. No login.",
  },
  {
    question: "What is the VIP Glow Night pricing?",
    answer:
      "Night-of only: Solaria / CO₂ $450, vitamin injection $15, Botox $7/unit, Morpheus8 $399, IV $79, dermal filler $399, microblading $399 including the 6-week touch-up. Solaria and Morpheus are limited to 12 spots.",
  },
  {
    question: "Can I bring a friend?",
    answer:
      "Yes. Toggle Yes + guest, add her name and phone, and select her glow goals so we can prep IV bags and numbing for both of you.",
  },
];

const baseMeta = pageMetadata({
  title: VIP_GLOW_SEO.title,
  description: VIP_GLOW_SEO.description,
  path: VIP_GLOW_PATH,
  keywords: [
    "VIP Glow Night Oswego",
    "Hello Gorgeous Med Spa event",
    "Botox special Oswego",
    "Morpheus8 special Naperville",
    "microblading Oswego",
  ],
});

export const metadata: Metadata = {
  ...baseMeta,
  openGraph: {
    ...baseMeta.openGraph,
    url: PAGE_URL,
    images: [{ url: OG, width: 1080, height: 1920, alt: VIP_GLOW_SEO.ogAlt }],
  },
  twitter: {
    ...baseMeta.twitter,
    images: [OG],
  },
};

export default function VipGlowNightPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: SITE.url },
              { name: "Specials", url: `${SITE.url}/specials` },
              { name: "VIP Glow Night", url: PAGE_URL },
            ]),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS, PAGE_URL)) }}
      />
      <VipGlowNightPageContent />
    </>
  );
}
