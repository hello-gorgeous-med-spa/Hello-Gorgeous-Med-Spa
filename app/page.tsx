import { Metadata } from "next";
import {
  HeroV3,
  TrustStrip,
  PartnerBadges,
  InjectablesConversion,
  ServicesSection,
  FaceBlueprintSection,
  ExperienceSection,
  RxShowcaseSection,
  ProductsCatalogHomeSection,
  InnovationSection,
  TrifectaSection,
  AIAssistantsSection,
  PhilosophySection,
  HomepageOurStory,
  HomepageTestimonials,
  HomepageFAQ,
  HomepageLetsChat,
  FinalCTA,
} from "@/components/homepage-v3";
import { GlowUpEventBanner } from "@/components/GlowUpEventBanner";
import { CherryWidget } from "@/components/CherryWidget";
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
} from "@/lib/seo";
import { CHERRY_PAY_URL } from "@/lib/flows";

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
              description: "#1 Best Med Spa in Oswego, IL. Newest Morpheus8 Burst — deepest RF at 8mm for face AND body. Botox, fillers, weight loss. Serving Naperville, Aurora, Plainfield.",
              path: "/",
              image: "/images/hero-banner.png",
              datePublished: "2023-01-01",
              dateModified: new Date().toISOString().split("T")[0],
            })
          ),
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

      {/* FAQPage Schema — can trigger FAQ rich results in search */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd(HOME_FAQS)),
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
        <InjectablesConversion />
        <ServicesSection />
        <FaceBlueprintSection />
        <RxShowcaseSection />
        <ProductsCatalogHomeSection />
        <ExperienceSection />
        <InnovationSection />
        <AIAssistantsSection />
        <PhilosophySection />
        <HomepageOurStory />
        <HomepageTestimonials />
        <HomepageFAQ />
        <section id="financing" className="bg-white py-12 md:py-16 border-t border-gray-100">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-black text-center mb-2">Flexible Payment Options</h2>
            <p className="text-gray-600 text-center mb-6">Pay over time with Cherry. No surprises — apply in seconds.</p>
            <div className="flex justify-center mb-8">
              <a
                href={CHERRY_PAY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-[#E6007E] text-white font-semibold px-8 py-4 hover:bg-[#c9006e] transition-colors"
              >
                Apply with Cherry
                <span aria-hidden>→</span>
              </a>
            </div>
            <CherryWidget />
          </div>
        </section>
        <HomepageLetsChat />
        <FinalCTA />
      </main>
    </>
  );
}
