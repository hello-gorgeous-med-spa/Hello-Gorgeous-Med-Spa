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
import { HOME_FAQS, SITE, faqJsonLd, pageMetadata, siteJsonLd, breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Botox, Fillers & Weight Loss Med Spa",
  description:
    "Hello Gorgeous Med Spa in Oswego, IL offers Botox ($10/unit), dermal fillers, Semaglutide weight loss, Biote hormone therapy, IV therapy & more. ⭐ 5-Star Rated. Serving Naperville, Aurora, Plainfield. Book free consultation!",
  path: "/",
});

export default function HomePage() {
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
      <Hero />
      <OffersSection />
      <BotoxCalculator />
      <VirtualTryOn />
      <HomeCareTeam />
      <PharmacyShowcase />
      <FullscriptSection />
      <BioteSection />
      <AnteAGEShowcase />
      <Testimonials />
      <PartnersGrid />
      <PhotoGallery />
      <MeetProviders />
      <EmailBanner />
      <LocationMap />
    </>
  );
}

