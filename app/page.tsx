import { Metadata } from "next";
import {
  HeroV3,
  TrustStrip,
  InjectablesConversion,
  ServicesSection,
  ExperienceSection,
  InnovationSection,
  AIAssistantsSection,
  PhilosophySection,
  FinalCTA,
} from "@/components/homepage-v3";
import { SITE, pageMetadata, siteJsonLd, breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Botox, Fillers & Weight Loss Med Spa",
  description:
    "Hello Gorgeous Med Spa in Oswego, IL offers Botox ($10/unit), dermal fillers, Semaglutide weight loss, Biote hormone therapy, IV therapy & more. 5-Star Rated. Serving Naperville, Aurora, Plainfield. Book free consultation!",
  path: "/",
});

export default function HomePage() {
  const homeBreadcrumbs = [{ name: "Home", url: SITE.url }];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd(homeBreadcrumbs)),
        }}
      />

      <main className="bg-white">
        <HeroV3 />
        <TrustStrip />
        <InjectablesConversion />
        <ServicesSection />
        <ExperienceSection />
        <InnovationSection />
        <AIAssistantsSection />
        <PhilosophySection />
        <FinalCTA />
      </main>
    </>
  );
}
