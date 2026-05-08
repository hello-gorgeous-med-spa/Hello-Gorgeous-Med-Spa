import { Metadata } from "next";
import {
  HeroV3,
  TrustStrip,
  PartnerBadges,
  ServicesSection,
  FaceBlueprintSection,
  ProductsCatalogHomeSection,
  TrifectaSection,
  HomepageTestimonials,
  HomepageProfessionalGrid,
  HomepageCherryFaqRow,
  HomepageClosingCTARow,
  OurPromiseSection,
} from "@/components/homepage-v3";
import { TheBookBadge } from "@/components/the-book";
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
  title: "Hello Gorgeous Med Spa | NP-Directed Medical Spa in Oswego, IL",
  description:
    "#1 Best Med Spa in Oswego, IL. NP-directed medical spa and medical aesthetics clinic offering Morpheus8 Burst, Quantum RF, Solaria CO2, Botox, fillers, GLP-1 weight loss, and hormone care. Serving Oswego, Naperville, Aurora, and Plainfield.",
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
              title: "Hello Gorgeous Med Spa - NP-Directed Medical Spa in Oswego, IL",
              description:
                "#1 Best Med Spa in Oswego, IL. NP-directed medical spa and medical aesthetics clinic with Morpheus8 Burst, injectables, GLP-1, hormone support, Solaria CO₂, IV therapy, and advanced skin + body treatments.",
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
        <HomepagePromoRail />
        <section className="bg-black text-white border-y border-white/10">
          <div className="max-w-6xl mx-auto px-4 py-10 md:py-12">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
              <div>
                <p className="text-[#FFB8DC] text-xs uppercase tracking-[0.24em] font-semibold">
                  Featured Event Video
                </p>
                <h2 className="mt-2 text-2xl md:text-3xl font-black">
                  Luxora InMode Event Launch
                </h2>
                <p className="mt-2 text-white/75 text-sm md:text-base max-w-2xl">
                  Watch the event preview and share it with friends before VIP Device Night and The Glow Social.
                </p>
              </div>
              <a
                href="/events/vip-device-night"
                className="inline-flex items-center justify-center rounded-full bg-[#E6007E] hover:bg-[#c90a68] px-6 py-3 text-sm font-bold transition-colors"
              >
                View event details
              </a>
            </div>
            <div className="rounded-2xl overflow-hidden border border-white/15 bg-black shadow-[0_12px_40px_rgba(230,0,126,0.3)]">
              <video
                controls
                preload="metadata"
                poster="/images/events/glow-social-win-big-may-14.png"
                className="w-full h-auto"
              >
                <source src="/videos/luxora-inmode-event-launch.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </section>
        <HeroV3 />
        <TrustStrip />
        <OurPromiseSection />
        <Morpheus8SkinRebuildSection />
        <Morpheus8VerifiedProviderSection />
        <TrifectaSection />
        <PartnerBadges />
        <ServicesSection />
        <FaceBlueprintSection />
        <ProductsCatalogHomeSection />
        <HomepageProfessionalGrid />
        <HomepageTestimonials />
        <HomepageCherryFaqRow />
        <HomepageClosingCTARow />
        <TheBookBadge />
      </main>
    </>
  );
}
