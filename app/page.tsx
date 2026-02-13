import type { Metadata } from "next";

import { Hero } from "@/components/Hero";
import { HomepageGeoLinks } from "@/components/HomepageGeoLinks";
import { MascotHeroSection } from "@/components/MascotHeroSection";
import { HomeCareTeam } from "@/components/HomeCareTeam";
import { OffersSection } from "@/components/OffersSection";
import { PhotoGallery } from "@/components/PhotoGallery";
import { MeetProviders } from "@/components/MeetProviders";
import { PartnersGrid } from "@/components/PartnersGrid";
import { Testimonials } from "@/components/Testimonials";
import { LocationMap } from "@/components/LocationMap";
import { AnteAGEShowcase } from "@/components/AnteAGEShowcase";
import { PharmacyShowcase } from "@/components/PharmacyShowcase";
import { FullscriptSection } from "@/components/FullscriptSection";
import { BioteSection } from "@/components/BioteSection";
import { EmailBanner } from "@/components/EmailCapture";
import { HomepageInteractiveTools } from "@/components/HomepageInteractiveTools";
import { VirtualTryOn } from "@/components/VirtualTryOn";
import { QuizCTA } from "@/components/QuizCTA";
import { FixWhatBothersMeFeature } from "@/components/FixWhatBothersMeFeature";
import { ImmediateCareBanner } from "@/components/ImmediateCareBanner";
import { TriggerPointSection } from "@/components/TriggerPointSection";
import { LaserHairSection } from "@/components/LaserHairSection";
import { MicroneedlingShowcase } from "@/components/MicroneedlingShowcase";
import { HOME_FAQS, HOME_TESTIMONIALS, SITE, breadcrumbJsonLd, faqJsonLd, pageMetadata, siteJsonLd, testimonialsJsonLd } from "@/lib/seo";
import { getBannerContent } from "@/lib/cms-readers";
import { HomepageBanner } from "@/components/HomepageBanner";

export const metadata: Metadata = pageMetadata({
  title: "Botox, Fillers & Weight Loss Med Spa",
  description:
    "Hello Gorgeous Med Spa in Oswego, IL offers Botox ($10/unit), dermal fillers, Semaglutide weight loss, Biote hormone therapy, IV therapy & more. ⭐ 5-Star Rated. Serving Naperville, Aurora, Plainfield. Book free consultation!",
  path: "/",
});

export default async function HomePage() {
  const [cmsBanner] = await Promise.all([getBannerContent()]);

  const homeBreadcrumbs = [
    { name: "Home", url: SITE.url },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(HOME_FAQS)) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(homeBreadcrumbs)) }}
      />
      {HOME_TESTIMONIALS.length > 0 &&
        testimonialsJsonLd(HOME_TESTIMONIALS).map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      <Hero />
      <HomepageGeoLinks />
      <HomepageBanner banner={cmsBanner} />
      <section className="relative py-16 md:py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-pink-950/10" />
        <div className="relative z-10 max-w-5xl mx-auto px-4">
          <MascotHeroSection />
        </div>
      </section>
      <FixWhatBothersMeFeature />
      <QuizCTA />
      <OffersSection />
      <HomepageInteractiveTools />
      <VirtualTryOn />
      <HomeCareTeam />
      <PharmacyShowcase />
      <FullscriptSection />
      <BioteSection />
      <TriggerPointSection />
      <MicroneedlingShowcase />
      <AnteAGEShowcase />
      <LaserHairSection />
      <Testimonials />
      <ImmediateCareBanner />
      <PartnersGrid />
      <PhotoGallery />
      <MeetProviders />
      <EmailBanner />
      <LocationMap />
    </>
  );
}

