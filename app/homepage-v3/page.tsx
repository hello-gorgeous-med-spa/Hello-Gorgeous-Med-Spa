import { Metadata } from "next";
import {
  HeroV3,
  TrustStrip,
  InjectablesConversion,
  ServicesSection,
  ExperienceSection,
  InnovationSection,
  PhilosophySection,
  FinalCTA,
} from "@/components/homepage-v3";

export const metadata: Metadata = {
  title: "Hello Gorgeous Med Spa | Luxury Aesthetic Medicine in Oswego, IL",
  description:
    "Modern aesthetic medicine built for confidence. Advanced injectables, skin treatments, and wellness — designed with precision and delivered with intention.",
  openGraph: {
    title: "Hello Gorgeous Med Spa | Luxury Aesthetic Medicine",
    description:
      "Advanced injectables, skin treatments, and wellness — designed with precision and delivered with intention.",
    type: "website",
  },
};

export default function HomepageV3() {
  return (
    <main className="bg-white">
      <HeroV3 />
      <TrustStrip />
      <InjectablesConversion />
      <ServicesSection />
      <ExperienceSection />
      <InnovationSection />
      <PhilosophySection />
      <FinalCTA />
    </main>
  );
}
