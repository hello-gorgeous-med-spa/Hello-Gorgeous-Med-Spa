'use client';

/**
 * Dynamic CMS Section Renderer
 * Maps CMS section types to actual React components
 * Allows full website control from admin panel
 */

import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import components to keep bundle size manageable
const Hero = dynamic(() => import('@/components/Hero').then(m => m.Hero));
const HomepageGeoLinks = dynamic(() => import('@/components/HomepageGeoLinks').then(m => m.HomepageGeoLinks));
const HomepageBanner = dynamic(() => import('@/components/HomepageBanner').then(m => m.HomepageBanner));
const MascotHeroSection = dynamic(() => import('@/components/MascotHeroSection').then(m => m.MascotHeroSection));
const FixWhatBothersMeFeature = dynamic(() => import('@/components/FixWhatBothersMeFeature').then(m => m.FixWhatBothersMeFeature));
const QuizCTA = dynamic(() => import('@/components/QuizCTA').then(m => m.QuizCTA));
const HormoneLabInsightTool = dynamic(() => import('@/components/HormoneLabInsightTool').then(m => m.HormoneLabInsightTool));
const MeetProviders = dynamic(() => import('@/components/MeetProviders').then(m => m.MeetProviders));
const OffersSection = dynamic(() => import('@/components/OffersSection').then(m => m.OffersSection));
const MembershipSection = dynamic(() => import('@/components/MembershipSection').then(m => m.MembershipSection));
const HomepageInteractiveTools = dynamic(() => import('@/components/HomepageInteractiveTools').then(m => m.HomepageInteractiveTools));
const HomeCareTeam = dynamic(() => import('@/components/HomeCareTeam').then(m => m.HomeCareTeam));
const PharmacyShowcase = dynamic(() => import('@/components/PharmacyShowcase').then(m => m.PharmacyShowcase));
const FullscriptSection = dynamic(() => import('@/components/FullscriptSection').then(m => m.FullscriptSection));
const BioteSection = dynamic(() => import('@/components/BioteSection').then(m => m.BioteSection));
const TriggerPointSection = dynamic(() => import('@/components/TriggerPointSection').then(m => m.TriggerPointSection));
const MicroneedlingShowcase = dynamic(() => import('@/components/MicroneedlingShowcase').then(m => m.MicroneedlingShowcase));
const AnteAGEShowcase = dynamic(() => import('@/components/AnteAGEShowcase').then(m => m.AnteAGEShowcase));
const LaserHairSection = dynamic(() => import('@/components/LaserHairSection').then(m => m.LaserHairSection));
const TikTokEmbed = dynamic(() => import('@/components/TikTokEmbed').then(m => m.TikTokEmbed));
const Testimonials = dynamic(() => import('@/components/Testimonials').then(m => m.Testimonials));
const ImmediateCareBanner = dynamic(() => import('@/components/ImmediateCareBanner').then(m => m.ImmediateCareBanner));
const PartnersGrid = dynamic(() => import('@/components/PartnersGrid').then(m => m.PartnersGrid));
const PhotoGallery = dynamic(() => import('@/components/PhotoGallery').then(m => m.PhotoGallery));
const EmailBanner = dynamic(() => import('@/components/EmailCapture').then(m => m.EmailBanner));
const LocationMap = dynamic(() => import('@/components/LocationMap').then(m => m.LocationMap));

export interface CMSSection {
  id: string;
  type: string;
  visible: boolean;
  content: Record<string, unknown>;
}

// Map section types to components
const SECTION_MAP: Record<string, React.ComponentType<any>> = {
  hero: Hero,
  geo_links: HomepageGeoLinks,
  promo_banner: HomepageBanner,
  mascots: MascotHeroSection,
  fix_what_bothers_me: FixWhatBothersMeFeature,
  quiz_cta: QuizCTA,
  hormone_tool: HormoneLabInsightTool,
  providers: MeetProviders,
  offers: OffersSection,
  membership: MembershipSection,
  interactive_tools: HomepageInteractiveTools,
  care_team: HomeCareTeam,
  pharmacy: PharmacyShowcase,
  fullscript: FullscriptSection,
  biote: BioteSection,
  trigger_point: TriggerPointSection,
  microneedling: MicroneedlingShowcase,
  anteage: AnteAGEShowcase,
  laser_hair: LaserHairSection,
  tiktok: TikTokEmbed,
  testimonials: Testimonials,
  immediate_care: ImmediateCareBanner,
  partners: PartnersGrid,
  photo_gallery: PhotoGallery,
  email_capture: EmailBanner,
  location_map: LocationMap,
};

// Wrapper for mascot section
function MascotWrapper({ content }: { content: Record<string, unknown> }) {
  return (
    <section className="py-20 md:py-28 px-6 md:px-12 bg-white">
      <div className="max-w-5xl mx-auto min-w-0">
        <MascotHeroSection />
      </div>
    </section>
  );
}

// Override mascots with wrapper
SECTION_MAP.mascots = MascotWrapper;

// Banner wrapper to pass content correctly
function BannerWrapper({ content }: { content: Record<string, unknown> }) {
  const banner = {
    headline: content.headline as string,
    subheadline: content.subheadline as string,
    cta_text: content.cta_text as string,
    cta_url: content.cta_url as string,
    is_active: true,
  };
  return <HomepageBanner banner={banner} />;
}
SECTION_MAP.promo_banner = BannerWrapper;

// Hero wrapper to pass props
function HeroWrapper({ content }: { content: Record<string, unknown> }) {
  return (
    <Hero
      headline={content.headline as string}
      headlineAccent={content.headline_accent as string || ""}
      subheadline={content.subheadline as string}
      ctaText={content.cta_text as string}
      ctaUrl={content.cta_url as string}
      imageSrc={content.image_url as string}
    />
  );
}
SECTION_MAP.hero = HeroWrapper;

/**
 * Render a single CMS section
 */
export function renderCMSSection(section: CMSSection): React.ReactNode {
  if (!section.visible) return null;

  const Component = SECTION_MAP[section.type];
  
  if (!Component) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Unknown CMS section type: ${section.type}`);
    }
    return null;
  }

  return <Component key={section.id} content={section.content} />;
}

/**
 * Render all CMS sections for a page
 */
export function CMSPageRenderer({ sections }: { sections: CMSSection[] }) {
  return (
    <>
      {sections.map(section => renderCMSSection(section))}
    </>
  );
}

export { SECTION_MAP };
