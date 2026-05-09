import type { Metadata } from "next";
import { SITE } from "@/lib/seo";
import { GalleryPageContent } from "@/components/gallery/GalleryPageContent";
import { QuantumRFRyanActionSlideshow } from "@/components/marketing/QuantumRFRyanActionSlideshow";

const TITLE =
  "Before & After Gallery — Real Results at Hello Gorgeous Med Spa | Oswego, IL";
const DESCRIPTION =
  "See real patient before & after photos and procedure videos from Hello Gorgeous Med Spa in Oswego, IL. Lip filler, Botox, Morpheus8 RF microneedling, Solaria CO₂ laser, Quantum RF, and more. NP-directed medical aesthetics.";
const CANONICAL = `${SITE.url}/gallery`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: CANONICAL },
  robots: { index: true, follow: true },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: CANONICAL,
    siteName: SITE.name,
    type: "website",
    images: [
      {
        url: `${SITE.url}/gallery/lip-filler-jen/after.jpg`,
        width: 1080,
        height: 1350,
        alt: "Lip filler before and after results at Hello Gorgeous Med Spa Oswego IL",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <GalleryPageContent />
      <QuantumRFRyanActionSlideshow />
    </>
  );
}
