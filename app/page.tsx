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
} from "@/components/homepage-v3";
import { GlowUpEventBanner } from "@/components/GlowUpEventBanner";
import { Morpheus8Banner } from "@/components/Morpheus8Banner";
import { Morpheus8SkinRebuildSection } from "@/components/Morpheus8SkinRebuildSection";
import { Morpheus8VerifiedProviderSection } from "@/components/Morpheus8VerifiedProviderSection";
import { Morpheus8ModelCallBanner } from "@/components/Morpheus8ModelCallBanner";
import { SolariaComingSoonBanner } from "@/components/SolariaComingSoonBanner";
import {
  SITE,
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

export const metadata: Metadata = pageMetadata({
  title: "Hello Gorgeous Med Spa | Newest Morpheus8 Burst Face & Body | Oswego, IL",
  description:
    "#1 Best Med Spa in Oswego, IL. Newest Morpheus8 Burst — deepest RF at 8mm for face AND body. Only med spa with Morpheus8 Burst, Quantum RF, Solaria CO2. Botox $10/unit, fillers, Semaglutide. Book free consultation!",
  path: "/",
});

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
              title: "Hello Gorgeous Med Spa - Newest Morpheus8 Burst Face & Body",
              description:
                "#1 Best Med Spa in Oswego, IL. Morpheus8 Burst, injectables, GLP-1 weight loss, hormones, Solaria CO₂, IV therapy, Rx, peptides, laser hair removal, IPL, vitamin injections, lash bar. Serving Naperville, Aurora, Plainfield.",
              path: "/",
              image: "/images/hero-banner.png",
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

      <main className="bg-white">
        <Morpheus8ModelCallBanner />
        <Morpheus8Banner />
        <GlowUpEventBanner />
        <SolariaComingSoonBanner />
        <HeroV3 />
        <TrustStrip />
        <Morpheus8SkinRebuildSection />
        <Morpheus8VerifiedProviderSection />
        <TrifectaSection />
        <PartnerBadges />
        <ServicesSection />
        <FaceBlueprintSection />
        <RxShowcaseSection />
        <ProductsCatalogHomeSection />
        <HomepageProfessionalGrid />
        <HomepageTestimonials />
        <HomepageCherryFaqRow />
        <HomepageClosingCTARow />
      </main>
    </>
  );
}
