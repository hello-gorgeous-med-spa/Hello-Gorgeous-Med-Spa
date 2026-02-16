"use client";

/**
 * Homepage Wireframe - Bold Hot Pink / Black / White luxury aesthetic
 * Section 1: Hero | 2: Services Grid | 3: Why Hello Gorgeous | 4: Providers | 5: CTA Band | 6: Footer
 */

import { Hero } from "@/components/Hero";
import { PinkWaveDivider, PinkGradientBand, PinkBlobDivider } from "@/components/PinkDivider";
import { ServicesGrid } from "@/components/ServicesGrid";
import { WhyHelloGorgeous } from "@/components/WhyHelloGorgeous";
import { AboutSection } from "@/components/AboutSection";
import { MeetProviders } from "@/components/MeetProviders";
import { CtaBand } from "@/components/CtaBand";

export function HomepageWireframe() {
  return (
    <>
      <Hero />
      <PinkGradientBand />
      <ServicesGrid />
      <PinkWaveDivider />
      <WhyHelloGorgeous />
      <PinkBlobDivider />
      <AboutSection />
      <MeetProviders />
      <CtaBand />
    </>
  );
}
