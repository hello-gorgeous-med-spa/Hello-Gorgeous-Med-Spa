import type { Metadata } from "next";
import { SITE } from "@/lib/seo";
import { GalleryPageContent } from "@/components/gallery/GalleryPageContent";
import { QuantumRFRyanActionSlideshow } from "@/components/marketing/QuantumRFRyanActionSlideshow";

const TITLE =
  "Before & After Gallery — Real Results | Hello Gorgeous Med Spa Oswego IL";
const DESCRIPTION =
  "Real patient before & after photos and procedure videos from Hello Gorgeous Med Spa in Oswego, IL — microblading, powder brows, combo & nano brow PMU by Danielle Alcala, plus Solaria CO₂ laser, Quantum RF, Morpheus8 Burst, lip filler, Botox & more. Serving Naperville, Aurora, Plainfield & Kendall County. Individual results vary.";
const CANONICAL = `${SITE.url}/gallery`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  robots: { index: true, follow: true },
  keywords: [
    "microblading before after Oswego",
    "powder brows before after",
    "combo brows hybrid brows Illinois",
    "nano brows Oswego IL",
    "natural light stroke brows before after",
    "hair stroke microblading Oswego",
    "brow PMU Danielle Alcala",
    "permanent makeup eyebrows near me",
    "before and after med spa Oswego IL",
    "Solaria CO2 laser before after Oswego",
    "Quantum RF before after results",
    "Morpheus8 before after Oswego IL",
    "lip filler before after Oswego",
    "Botox before after near me",
    "med spa results Naperville IL",
    "skin resurfacing before after Illinois",
    "body contouring before after Oswego IL",
    "Hello Gorgeous Med Spa gallery",
  ],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: CANONICAL,
    siteName: SITE.name,
    type: "website",
    images: [
      {
        url: `${SITE.url}/gallery/quantum-rf-chin-1/after.jpg`,
        width: 1080,
        height: 1350,
        alt: "Quantum RF chin & neck contouring result — 1 week post — Hello Gorgeous Med Spa Oswego IL",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [`${SITE.url}/gallery/quantum-rf-chin-1/after.jpg`],
  },
};

/* ─── Gallery ImageGallery schema ─── */
const galleryJsonLd = {
  "@context": "https://schema.org",
  "@type": "ImageGallery",
  name: "Hello Gorgeous Med Spa — Before & After Results Gallery",
  description: DESCRIPTION,
  url: CANONICAL,
  provider: {
    "@type": "MedicalBusiness",
    name: SITE.name,
    url: SITE.url,
    telephone: SITE.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: "74 W. Washington Street",
      addressLocality: "Oswego",
      addressRegion: "IL",
      postalCode: "60543",
      addressCountry: "US",
    },
  },
};

/* ─── Individual ImageObject entries (boosts Google Image Search ranking) ─── */
const imageObjectsJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Before & After Results — Hello Gorgeous Med Spa Oswego IL",
  url: CANONICAL,
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "ImageObject",
        name: "Brow PMU Portfolio — Microblading, Powder, Combo & Nano Brows",
        description:
          "Before and after brow permanent makeup portfolio: microblading hair stroke, powder brows, combo hybrid brows, and nano brows by Danielle Alcala at Hello Gorgeous Med Spa, Oswego IL.",
        contentUrl: `${SITE.url}/images/brow/danielle-alcala-brow-pmu-portfolio-before-after.png`,
        url: `${SITE.url}/microblading-brow-pmu-oswego-il`,
        creator: { "@type": "Person", name: "Danielle Alcala" },
        copyrightHolder: { "@type": "Organization", name: SITE.name },
        keywords:
          "microblading, powder brows, combo brows, nano brows, brow PMU, permanent makeup eyebrows, before after, Oswego IL, Danielle Alcala",
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "ImageObject",
        name: "Powder Brows — Before & After PMU",
        description:
          "Powder brows ombré permanent makeup before and after at Hello Gorgeous Med Spa, Oswego IL.",
        contentUrl: `${SITE.url}/images/brow/powder-brows-before-after.png`,
        url: CANONICAL,
        creator: { "@type": "Organization", name: SITE.name },
        copyrightHolder: { "@type": "Organization", name: SITE.name },
        keywords: "powder brows, ombré brows, PMU, before after, Oswego IL",
      },
    },
    {
      "@type": "ListItem",
      position: 3,
      item: {
        "@type": "ImageObject",
        name: "Natural Light Stroke Brows — Before & After Microblading",
        description:
          "Natural light stroke hair-stroke microblading before and after by Danielle Alcala at Hello Gorgeous Med Spa, Oswego IL.",
        contentUrl: `${SITE.url}/images/brow/natural-light-stroke-brows-before-after-danielle-alcala.png`,
        url: `${SITE.url}/microblading-brow-pmu-oswego-il`,
        creator: { "@type": "Person", name: "Danielle Alcala" },
        copyrightHolder: { "@type": "Organization", name: SITE.name },
        keywords:
          "natural light stroke brows, hair stroke microblading, feather brows, before after, Oswego IL, Danielle Alcala",
      },
    },
    {
      "@type": "ListItem",
      position: 4,
      item: {
        "@type": "ImageObject",
        name: "Quantum RF Chin & Neck — Before & After (1 Week Post)",
        description:
          "Quantum RF subdermal contouring chin and neck before and after at Hello Gorgeous Med Spa, Oswego IL. Jawline definition visible at only 1 week post-treatment.",
        contentUrl: `${SITE.url}/gallery/quantum-rf-chin-1/after.jpg`,
        thumbnail: `${SITE.url}/gallery/quantum-rf-chin-1/before.jpg`,
        url: CANONICAL,
        creator: { "@type": "Organization", name: SITE.name },
        copyrightHolder: { "@type": "Organization", name: SITE.name },
        keywords: "Quantum RF, chin contouring, jawline, before after, Oswego IL",
      },
    },
    {
      "@type": "ListItem",
      position: 5,
      item: {
        "@type": "ImageObject",
        name: "Quantum RF Body Contouring — Before & After",
        description:
          "Quantum RF subdermal body contouring before and after at Hello Gorgeous Med Spa, Oswego IL. Loose skin tightened without surgery.",
        contentUrl: `${SITE.url}/gallery/quantum-rf-body-1/after.jpg`,
        thumbnail: `${SITE.url}/gallery/quantum-rf-body-1/before.jpg`,
        url: CANONICAL,
        creator: { "@type": "Organization", name: SITE.name },
        copyrightHolder: { "@type": "Organization", name: SITE.name },
        keywords: "Quantum RF, body contouring, skin tightening, before after, Oswego IL",
      },
    },
    {
      "@type": "ListItem",
      position: 6,
      item: {
        "@type": "ImageObject",
        name: "Solaria CO2 Laser Before, During & After — Hello Gorgeous Med Spa",
        description:
          "Solaria fractional CO2 laser resurfacing before, during, and healed after result at Hello Gorgeous Med Spa, Oswego IL. Texture, tone, and fine lines treated.",
        contentUrl: `${SITE.url}/gallery/solaria-client-5/before-during-after.jpg`,
        url: CANONICAL,
        creator: { "@type": "Organization", name: SITE.name },
        copyrightHolder: { "@type": "Organization", name: SITE.name },
        keywords: "Solaria CO2 laser, laser resurfacing, before after, Oswego IL",
      },
    },
    {
      "@type": "ListItem",
      position: 4,
      item: {
        "@type": "ImageObject",
        name: "Solaria CO2 Laser Before & After — Hyperpigmentation & Texture",
        description:
          "Solaria fractional CO2 laser before and after for hyperpigmentation, skin texture, and redness at Hello Gorgeous Med Spa, Oswego IL.",
        contentUrl: `${SITE.url}/gallery/solaria-client-4/after.jpg`,
        thumbnail: `${SITE.url}/gallery/solaria-client-4/before.jpg`,
        url: CANONICAL,
        creator: { "@type": "Organization", name: SITE.name },
        copyrightHolder: { "@type": "Organization", name: SITE.name },
        keywords: "Solaria CO2 laser, hyperpigmentation, before after, Oswego IL",
      },
    },
    {
      "@type": "ListItem",
      position: 5,
      item: {
        "@type": "ImageObject",
        name: "Solaria CO2 Laser Before & After — Skin Renewal",
        description:
          "Solaria fractional CO2 laser skin renewal before and after at Hello Gorgeous Med Spa, Oswego IL. Smoother texture and lifted tone.",
        contentUrl: `${SITE.url}/gallery/client-2/after.jpg`,
        thumbnail: `${SITE.url}/gallery/client-2/before.jpg`,
        url: CANONICAL,
        creator: { "@type": "Organization", name: SITE.name },
        copyrightHolder: { "@type": "Organization", name: SITE.name },
        keywords: "Solaria CO2 laser, skin renewal, before after, Oswego IL",
      },
    },
    {
      "@type": "ListItem",
      position: 6,
      item: {
        "@type": "ImageObject",
        name: "Lip Filler Before, During & After — Hello Gorgeous Med Spa",
        description:
          "Natural lip filler enhancement before, during procedure, and after at Hello Gorgeous Med Spa, Oswego IL. Defined cupid's bow, soft natural shape.",
        contentUrl: `${SITE.url}/gallery/lip-filler-jen/before-during-after.jpg`,
        url: CANONICAL,
        creator: { "@type": "Organization", name: SITE.name },
        copyrightHolder: { "@type": "Organization", name: SITE.name },
        keywords: "lip filler, dermal filler, before after, Oswego IL, Naperville IL",
      },
    },
  ],
};

/* ─── FAQ schema targeting high-intent gallery searches ─── */
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Are the before and after photos at Hello Gorgeous Med Spa real?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Every photo and video in our gallery is from a real patient of Hello Gorgeous Med Spa in Oswego, IL, published with their consent. Photos are unedited and unfiltered. All procedures were performed by our licensed medical providers. Individual results vary.",
      },
    },
    {
      "@type": "Question",
      name: "How many treatments does Quantum RF take to see results?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Many clients see dramatic contouring results after just one Quantum RF treatment. Our gallery includes a before and after showing jawline definition visible at only 1 week post-treatment. A series of 3 treatments is often recommended for optimal results. Consult with our provider to determine your candidacy.",
      },
    },
    {
      "@type": "Question",
      name: "How long does it take to heal after Solaria CO2 laser?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most clients experience redness, swelling, and peeling for 5–7 days after Solaria CO2 fractional laser resurfacing. Our gallery shows before, immediately-after, and healed results so you can see what to expect at each stage. Full results continue to improve over 3–6 months.",
      },
    },
    {
      "@type": "Question",
      name: "Does Hello Gorgeous Med Spa serve Naperville and Aurora IL?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Hello Gorgeous Med Spa is located at 74 W. Washington Street in Oswego, IL and serves patients from Naperville, Aurora, Plainfield, Montgomery, Yorkville, Sugar Grove, and the greater western Chicago suburbs.",
      },
    },
  ],
};

/* ─── Breadcrumb ─── */
const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
    {
      "@type": "ListItem",
      position: 2,
      name: "Before & After Gallery",
      item: CANONICAL,
    },
  ],
};

export default function GalleryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(galleryJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(imageObjectsJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <GalleryPageContent />
      <QuantumRFRyanActionSlideshow />
    </>
  );
}
