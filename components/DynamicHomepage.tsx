'use client';

/**
 * Dynamic Homepage Component
 * Renders homepage sections from CMS data
 * Enables full website control from admin panel
 */

import { Hero } from "@/components/Hero";
import { HomepageGeoLinks } from "@/components/HomepageGeoLinks";
import { MascotHeroSection } from "@/components/MascotHeroSection";
import { HomeCareTeam } from "@/components/HomeCareTeam";
import { OffersSection } from "@/components/OffersSection";
import { PhotoGallery } from "@/components/PhotoGallery";
import { AboutSection } from "@/components/AboutSection";
import { PartnersGrid } from "@/components/PartnersGrid";
import { Testimonials } from "@/components/Testimonials";
import { LocationMap } from "@/components/LocationMap";
import { AnteAGEShowcase } from "@/components/AnteAGEShowcase";
import { PharmacyShowcase } from "@/components/PharmacyShowcase";
import { FullscriptSection } from "@/components/FullscriptSection";
import { BioteSection } from "@/components/BioteSection";
import { EmailBanner } from "@/components/EmailCapture";
import { HomepageInteractiveTools } from "@/components/HomepageInteractiveTools";
import { QuizCTA } from "@/components/QuizCTA";
import { MembershipSection } from "@/components/MembershipSection";
import { FixWhatBothersMeFeature } from "@/components/FixWhatBothersMeFeature";
import { ImmediateCareBanner } from "@/components/ImmediateCareBanner";
import { TriggerPointSection } from "@/components/TriggerPointSection";
import { LaserHairSection } from "@/components/LaserHairSection";
import { MicroneedlingShowcase } from "@/components/MicroneedlingShowcase";
import { TikTokEmbed } from "@/components/TikTokEmbed";
import { HomepageBanner } from "@/components/HomepageBanner";

interface CMSSection {
  id: string;
  type: string;
  visible: boolean;
  content: Record<string, unknown>;
}

interface Props {
  sections: CMSSection[];
}

// Render a single section based on type
function renderSection(section: CMSSection) {
  if (!section.visible) return null;

  const { type, content, id } = section;

  switch (type) {
    case 'hero':
      return (
        <Hero
          key={id}
          headline={content.headline as string}
          headlineAccent={(content.headline_accent as string) || ""}
          subheadline={content.subheadline as string}
          ctaText={content.cta_text as string}
          ctaUrl={content.cta_url as string}
          imageSrc={content.image_url as string}
        />
      );

    case 'geo_links':
      return <HomepageGeoLinks key={id} />;

    case 'promo_banner':
      return (
        <HomepageBanner
          key={id}
          banner={{
            headline: content.headline as string,
            subheadline: content.subheadline as string,
            cta_text: content.cta_text as string,
            cta_url: content.cta_url as string,
            is_active: true,
          }}
        />
      );

    case 'mascots':
      // Temporarily disabled - needs redesign for professional look
      return null;

    case 'fix_what_bothers_me':
      return <FixWhatBothersMeFeature key={id} />;

    case 'quiz_cta':
      return <QuizCTA key={id} />;

    case 'about':
      return <AboutSection key={id} />;

    case 'providers':
      // Meet the Team now lives on About page only
      return null;

    case 'offers':
      return <OffersSection key={id} />;

    case 'membership':
      return <MembershipSection key={id} />;

    case 'interactive_tools':
      return <HomepageInteractiveTools key={id} />;

    case 'care_team':
      // Temporarily disabled - needs redesign
      return null;

    case 'pharmacy':
      return <PharmacyShowcase key={id} />;

    case 'fullscript':
      return <FullscriptSection key={id} />;

    case 'biote':
      return <BioteSection key={id} />;

    case 'trigger_point':
      return <TriggerPointSection key={id} />;

    case 'microneedling':
      return <MicroneedlingShowcase key={id} />;

    case 'anteage':
      return <AnteAGEShowcase key={id} />;

    case 'laser_hair':
      return <LaserHairSection key={id} />;

    case 'tiktok':
      return <TikTokEmbed key={id} />;

    case 'testimonials':
      return <Testimonials key={id} />;

    case 'immediate_care':
      return <ImmediateCareBanner key={id} />;

    case 'partners':
      return <PartnersGrid key={id} />;

    case 'photo_gallery':
      return <PhotoGallery key={id} />;

    case 'email_capture':
      return <EmailBanner key={id} />;

    case 'location_map':
      return <LocationMap key={id} />;

    default:
      // Unknown section type - skip in production, warn in dev
      if (process.env.NODE_ENV === 'development') {
        console.warn(`Unknown CMS section type: ${type}`);
      }
      return null;
  }
}

export function DynamicHomepage({ sections }: Props) {
  return (
    <>
      {sections.map(section => renderSection(section))}
    </>
  );
}
