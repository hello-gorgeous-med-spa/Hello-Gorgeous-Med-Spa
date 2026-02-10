import type { Metadata } from "next";

import { Hero } from "@/components/Hero";
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
import { BotoxCalculator } from "@/components/BotoxCalculator";
import { VirtualTryOn } from "@/components/VirtualTryOn";
import { QuizCTA } from "@/components/QuizCTA";
import { FixWhatBothersMeFeature } from "@/components/FixWhatBothersMeFeature";
import { ImmediateCareBanner } from "@/components/ImmediateCareBanner";
import { TriggerPointSection } from "@/components/TriggerPointSection";
import { LaserHairSection } from "@/components/LaserHairSection";
import { MicroneedlingShowcase } from "@/components/MicroneedlingShowcase";
import { HOME_FAQS, SITE, faqJsonLd, pageMetadata, siteJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { getHeroContent, getBannerContent } from "@/lib/cms-readers";
import { BOOKING_URL } from "@/lib/flows";
import { HomepageBanner } from "@/components/HomepageBanner";

export const metadata: Metadata = pageMetadata({
  title: "Botox, Fillers & Weight Loss Med Spa",
  description:
    "Hello Gorgeous Med Spa in Oswego, IL offers Botox ($10/unit), dermal fillers, Semaglutide weight loss, Biote hormone therapy, IV therapy & more. ⭐ 5-Star Rated. Serving Naperville, Aurora, Plainfield. Book free consultation!",
  path: "/",
});

const HERO_FALLBACK = {
  headline: "",
  subheadline: "",
  cta_text: "✨ Book Your Appointment →",
  cta_url: BOOKING_URL,
};

export default async function HomePage() {
  const [cmsHero, cmsBanner] = await Promise.all([getHeroContent(), getBannerContent()]);
  const hero = cmsHero ?? HERO_FALLBACK;

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
      <Hero
        headline={hero.headline || undefined}
        subheadline={hero.subheadline || undefined}
        ctaText={hero.cta_text || undefined}
        ctaUrl={hero.cta_url || undefined}
      />
      <HomepageBanner banner={cmsBanner} />
      <FixWhatBothersMeFeature />
      <QuizCTA />
      <OffersSection />
      <BotoxCalculator />
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

