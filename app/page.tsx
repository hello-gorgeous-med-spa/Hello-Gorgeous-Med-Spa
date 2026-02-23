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
  InnovationSection,
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
import { SolariaComingSoonBanner } from "@/components/SolariaComingSoonBanner";
import {
  SITE,
  pageMetadata,
  siteJsonLd,
  mainLocalBusinessJsonLd,
  breadcrumbJsonLd,
  imageGalleryJsonLd,
  getImagesByCategory,
  webPageJsonLd,
  HOME_TESTIMONIALS,
  testimonialsJsonLd,
} from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Botox, Fillers & Weight Loss Med Spa",
  description:
    "Hello Gorgeous Med Spa in Oswego, IL offers Botox ($10/unit), dermal fillers, Semaglutide weight loss, Biote hormone therapy, IV therapy & more. 5-Star Rated. Serving Naperville, Aurora, Plainfield. Book free consultation!",
  path: "/",
});

export default function HomePage() {
  const homeBreadcrumbs = [{ name: "Home", url: SITE.url }];

  // Image gallery schemas for Google Images SEO
  const injectablesImages = getImagesByCategory("injectables");
  const rxImages = getImagesByCategory("rx");
  const aestheticsImages = getImagesByCategory("aesthetics");

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
              title: "Hello Gorgeous Med Spa - Botox, Fillers & Weight Loss",
              description: "Premium medical aesthetics in Oswego, IL. Botox, dermal fillers, weight loss, hormone therapy. Serving Naperville, Aurora, Plainfield.",
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

      {/* Review Schema for Testimonials */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(testimonialsJsonLd(HOME_TESTIMONIALS)),
        }}
      />

      <main className="bg-white">
        <GlowUpEventBanner />
        <SolariaComingSoonBanner />
        <HeroV3 />
        <TrustStrip />
        <PartnerBadges />
        <InjectablesConversion />
        <ServicesSection />
        <FaceBlueprintSection />
        <RxShowcaseSection />
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
            <p className="text-gray-600 text-center mb-8">Pay over time with Cherry. No surprises — apply in seconds.</p>
            <CherryWidget />
          </div>
        </section>
        <HomepageLetsChat />
        <FinalCTA />
      </main>
    </>
  );
}
