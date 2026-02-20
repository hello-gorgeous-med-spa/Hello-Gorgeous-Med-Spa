import { Metadata } from "next";
import {
  HeroV3,
  TrustStrip,
  InjectablesConversion,
  ServicesSection,
  ExperienceSection,
  RxShowcaseSection,
  InnovationSection,
  AIAssistantsSection,
  PhilosophySection,
  HomepageFAQ,
  FinalCTA,
} from "@/components/homepage-v3";
import {
  SITE,
  pageMetadata,
  siteJsonLd,
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
      {/* Core Business Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
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
        <HeroV3 />
        <TrustStrip />
        <InjectablesConversion />
        <ServicesSection />
        <RxShowcaseSection />
        <ExperienceSection />
        <InnovationSection />
        <AIAssistantsSection />
        <PhilosophySection />
        <HomepageFAQ />
        <FinalCTA />
      </main>
    </>
  );
}
