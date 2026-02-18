import type { Metadata } from "next";

import { Hero } from "@/components/Hero";
import { HomepageGeoLinks } from "@/components/HomepageGeoLinks";
import { MascotHeroSection } from "@/components/MascotHeroSection";
import { HomeCareTeam } from "@/components/HomeCareTeam";
import { OffersSection } from "@/components/OffersSection";
import { PhotoGallery } from "@/components/PhotoGallery";
import { PartnersGrid } from "@/components/PartnersGrid";
import { Testimonials } from "@/components/Testimonials";
import { TestimonialsCarousel } from "@/components/TestimonialsCarousel";
import { CertificationBadges } from "@/components/CertificationBadges";
import { LocationMap } from "@/components/LocationMap";
import { AnteAGEShowcase } from "@/components/AnteAGEShowcase";
import { PharmacyShowcase } from "@/components/PharmacyShowcase";
import { FullscriptSection } from "@/components/FullscriptSection";
import { BioteSection } from "@/components/BioteSection";
import { EmailBanner } from "@/components/EmailCapture";
import { HomepageInteractiveTools } from "@/components/HomepageInteractiveTools";
import { QuizCTA } from "@/components/QuizCTA";
import { MembershipSection } from "@/components/MembershipSection";
import { AboutSection } from "@/components/AboutSection";
import { FixWhatBothersMeFeature } from "@/components/FixWhatBothersMeFeature";
import { ImmediateCareBanner } from "@/components/ImmediateCareBanner";
import { TriggerPointSection } from "@/components/TriggerPointSection";
import { LaserHairSection } from "@/components/LaserHairSection";
import { MicroneedlingShowcase } from "@/components/MicroneedlingShowcase";
import { TikTokEmbed } from "@/components/TikTokEmbed";
import { HOME_FAQS, HOME_TESTIMONIALS, SITE, breadcrumbJsonLd, faqJsonLd, pageMetadata, siteJsonLd, testimonialsJsonLd } from "@/lib/seo";
import { getBannerContent } from "@/lib/cms-readers";
import { HomepageBanner } from "@/components/HomepageBanner";
import { getHomepage } from "@/lib/cms/fetch-cms";
import { DynamicHomepage } from "@/components/DynamicHomepage";

export const metadata: Metadata = pageMetadata({
  title: "Botox, Fillers & Weight Loss Med Spa",
  description:
    "Hello Gorgeous Med Spa in Oswego, IL offers Botox ($10/unit), dermal fillers, Semaglutide weight loss, Biote hormone therapy, IV therapy & more. 5-Star Rated. Serving Naperville, Aurora, Plainfield. Book free consultation!",
  path: "/",
});

export default async function HomePage() {
  // Try to load from CMS first
  const cmsPage = await getHomepage();
  const [cmsBanner] = await Promise.all([getBannerContent()]);

  const homeBreadcrumbs = [
    { name: "Home", url: SITE.url },
  ];

  // If CMS has content, render dynamically
  if (cmsPage && cmsPage.sections && cmsPage.sections.length > 0) {
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(HOME_FAQS)) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(homeBreadcrumbs)) }}
        />
        {HOME_TESTIMONIALS.length > 0 &&
          testimonialsJsonLd(HOME_TESTIMONIALS).map((schema, i) => (
            <script
              key={i}
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />
          ))}
        <DynamicHomepage sections={cmsPage.sections} />
      </>
    );
  }

  // Fallback to hardcoded content if CMS is empty
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(HOME_FAQS)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(homeBreadcrumbs)) }}
      />
      {HOME_TESTIMONIALS.length > 0 &&
        testimonialsJsonLd(HOME_TESTIMONIALS).map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      
      {/* SECTION 1 - HERO (White) */}
      <Hero />
      
      {/* Geo Links */}
      <HomepageGeoLinks />
      
      {/* CMS Banner */}
      <HomepageBanner banner={cmsBanner} />
      
      {/* SECTION 2 - SERVICES / MASCOT (White) */}
      <section className="section-white section-padding">
        <div className="container">
          <MascotHeroSection />
        </div>
      </section>
      
      {/* Fix What Bothers Me - Interactive Feature */}
      <FixWhatBothersMeFeature />
      
      {/* SECTION 3 - QUIZ CTA (Black) */}
      <QuizCTA />
      
      {/* SECTION 4 - ABOUT (White) */}
      <AboutSection />
      
      {/* SECTION 6 - OFFERS (White) */}
      <OffersSection />
      
      {/* SECTION 7 - MEMBERSHIP (White/Black alternation handled internally) */}
      <MembershipSection />
      
      {/* Interactive Tools */}
      <HomepageInteractiveTools />
      
      {/* Pharmacy & Partner Showcases */}
      <PharmacyShowcase />
      <FullscriptSection />
      <BioteSection />
      <TriggerPointSection />
      <MicroneedlingShowcase />
      <AnteAGEShowcase />
      <LaserHairSection />
      
      {/* TikTok Embed */}
      <TikTokEmbed />
      
      {/* SECTION - TESTIMONIALS CAROUSEL (Black) */}
      <TestimonialsCarousel />
      
      {/* CERTIFICATION BADGES */}
      <CertificationBadges />
      
      {/* Immediate Care Banner */}
      <ImmediateCareBanner />
      
      {/* Partners */}
      <PartnersGrid />
      
      {/* Gallery */}
      <PhotoGallery />
      
      {/* SECTION 5 - HOT PINK CTA STRIP */}
      <EmailBanner />
      
      {/* Location Map */}
      <LocationMap />
    </>
  );
}
