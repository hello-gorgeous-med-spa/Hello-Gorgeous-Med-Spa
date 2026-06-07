import { Metadata } from "next";
import {
  HeroV3,
  TrustStrip,
  ServicesSection,
  TrifectaSection,
  HomepageTestimonials,
  HomepageClosingCTARow,
} from "@/components/homepage-v3";
import { MeetDaniRyanSection } from "@/components/marketing/MeetDaniRyanSection";
import { HomepageHydrafacialBanner } from "@/components/HomepageHydrafacialBanner";
import {
  SITE,
  SITE_OG_IMAGE,
  SITE_OG_IMAGE_ALT,
  pageMetadata,
  siteJsonLd,
  mainLocalBusinessJsonLd,
  breadcrumbJsonLd,
  imageGalleryJsonLd,
  getImagesByCategory,
  getMorpheus8HomepageImages,
  webPageJsonLd,
  HOME_FAQS,
  HOME_TESTIMONIALS,
  faqJsonLd,
  testimonialsJsonLd,
  bookingServiceJsonLd,
  homepageServicesItemListJsonLd,
  homepageServicesImageGalleryJsonLd,
} from "@/lib/seo";

const _homeBase = pageMetadata({
  title: "Med Spa in Oswego, IL — Botox, Weight Loss & Morpheus8",
  description: SITE.metaDescription,
  path: "/",
});

export const metadata: Metadata = {
  ..._homeBase,
  openGraph: {
    ..._homeBase.openGraph,
    images: [{ url: SITE_OG_IMAGE, width: 1200, height: 630, alt: SITE_OG_IMAGE_ALT }],
  },
  twitter: {
    ..._homeBase.twitter,
    images: [SITE_OG_IMAGE],
  },
};

export default function HomePage() {
  const homeBreadcrumbs = [{ name: "Home", url: SITE.url }];
  const injectablesImages = getImagesByCategory("injectables");
  const aestheticsImages = getImagesByCategory("aesthetics");
  const morpheus8BurstHomeImages = getMorpheus8HomepageImages();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mainLocalBusinessJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd(homeBreadcrumbs)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webPageJsonLd({
              title: "Hello Gorgeous Med Spa - NP-Directed Medical Spa in Oswego, IL",
              description:
                "#1 Best Med Spa in Oswego, IL. NP-directed medical spa and medical aesthetics clinic with Morpheus8 Burst, injectables, GLP-1, hormone support, Solaria CO₂, IV therapy, and advanced skin + body treatments.",
              path: "/",
              image: "/images/hero-banner.png",
              datePublished: "2023-01-01",
              dateModified: new Date().toISOString().split("T")[0],
            }),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homepageServicesItemListJsonLd()),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            imageGalleryJsonLd(injectablesImages, "Botox & Dermal Filler Treatments"),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            imageGalleryJsonLd(aestheticsImages, "Skin Rejuvenation Treatments"),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            imageGalleryJsonLd(
              morpheus8BurstHomeImages,
              "Morpheus8 Burst RF Microneedling — Verified Provider Oswego IL",
            ),
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homepageServicesImageGalleryJsonLd()),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd(HOME_FAQS, `${SITE.url}/`)),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(bookingServiceJsonLd()),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(testimonialsJsonLd(HOME_TESTIMONIALS)),
        }}
      />

      <main className="bg-black">
        <HeroV3 />
        <HomepageHydrafacialBanner />
        <TrustStrip />
        <ServicesSection />
        <TrifectaSection />
        <HomepageTestimonials />
        <MeetDaniRyanSection />
        <HomepageClosingCTARow />
      </main>
    </>
  );
}
