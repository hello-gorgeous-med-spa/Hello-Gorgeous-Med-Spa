import { Metadata } from "next";
import {
  HeroV3,
  TrustStrip,
  PartnerBadges,
  ServicesSection,
  FaceBlueprintSection,
  RxShowcaseSection,
  ProductsCatalogHomeSection,
  TrifectaSection,
  HomepageTestimonials,
  HomepageProfessionalGrid,
  HomepageCherryFaqRow,
  HomepageClosingCTARow,
  ContourSignatureSection,
  ContourWhoForSection,
  ContourVideoPreviewSection,
  ContourMobileStickyCta,
} from "@/components/homepage-v3";
import { TheBookHomeSection } from "@/components/the-book";
import { HomepagePromoRail } from "@/components/HomepagePromoRail";
import { Morpheus8SkinRebuildSection } from "@/components/Morpheus8SkinRebuildSection";
import { Morpheus8VerifiedProviderSection } from "@/components/Morpheus8VerifiedProviderSection";
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
  title: "Botox, Fillers & Weight Loss Med Spa",
  description:
    "Hello Gorgeous Med Spa in Oswego, IL offers Botox ($10/unit), dermal fillers, Semaglutide weight loss, Biote hormone therapy, IV therapy & more. 5-Star Rated. Serving Naperville, Aurora, Plainfield. Book free consultation!",
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

  // Image gallery schemas for Google Images SEO
  const injectablesImages = getImagesByCategory("injectables");
  const rxImages = getImagesByCategory("rx");
  const aestheticsImages = getImagesByCategory("aesthetics");
  const morpheus8BurstHomeImages = getMorpheus8HomepageImages();

  return (
    <>
      {/* Core MedicalBusiness Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />
      
      {/* LocalBusiness Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(mainLocalBusinessJsonLd()) }}
      />
      
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd(homeBreadcrumbs)),
        }}
      />

      {/* WebPage Schema with Primary Image */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            webPageJsonLd({
              title: "Hello Gorgeous Med Spa — The Hello Gorgeous Contour Lift (Quantum RF) & full aesthetic medicine",
              description:
                "Flagship: Hello Gorgeous Contour Lift, powered by InMode Quantum RF, for advanced minimally invasive body and face contouring. Oswego, IL. Also Morpheus8, Solaria CO₂, injectables, medical wellness, and same-day care when available.",
              path: "/",
              image: "/images/quantum-rf/clinical-ba-abdomen-skin-tightening.png",
              datePublished: "2023-01-01",
              dateModified: new Date().toISOString().split("T")[0],
            })
          ),
        }}
      />

      {/* ItemList — homepage service cards (matches ServicesSection) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homepageServicesItemListJsonLd()),
        }}
      />

      {/* Image Gallery Schemas for Google Images */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            imageGalleryJsonLd(injectablesImages, "Botox & Dermal Filler Treatments")
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            imageGalleryJsonLd(rxImages, "Medical Weight Loss & Hormone Therapy")
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            imageGalleryJsonLd(aestheticsImages, "Skin Rejuvenation Treatments")
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            imageGalleryJsonLd(
              morpheus8BurstHomeImages,
              "Morpheus8 Burst RF Microneedling — Verified Provider Oswego IL"
            )
          ),
        }}
      />

      {/* Homepage service card images — full gallery aligned with ItemList */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homepageServicesImageGalleryJsonLd()),
        }}
      />

      {/* FAQPage Schema — can trigger FAQ rich results in search */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd(HOME_FAQS, `${SITE.url}/`)),
        }}
      />

      {/* Service + ReserveAction — supports "Book" in local/search */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(bookingServiceJsonLd()),
        }}
      />

      {/* Review Schema for Testimonials */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(testimonialsJsonLd(HOME_TESTIMONIALS)),
        }}
      />

      <main className="bg-white pb-20 md:pb-0">
        <HeroV3 />
        <ContourSignatureSection />
        <ContourWhoForSection />
        <ContourVideoPreviewSection />
        <TheBookHomeSection />
        <TrustStrip />
        <TrifectaSection />
        <PartnerBadges />
        <ServicesSection />
        <FaceBlueprintSection />
        <RxShowcaseSection />
        <ProductsCatalogHomeSection />
        <HomepageProfessionalGrid />
        <HomepageTestimonials />
        <HomepageCherryFaqRow />
        <Morpheus8SkinRebuildSection />
        <Morpheus8VerifiedProviderSection />
        <HomepagePromoRail />
        <HomepageClosingCTARow />
        <ContourMobileStickyCta />
      </main>
    </>
  );
}
