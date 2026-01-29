import type { Metadata } from "next";
import Link from "next/link";

import { SiteJsonLd } from "@/components/seo/SiteJsonLd";
import { FadeUp } from "@/components/ui/FadeUp";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "Meet Hello Gorgeous Med Spa — luxury medical aesthetics in Oswego, IL serving Naperville, Aurora, and Plainfield.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <SiteJsonLd />

      <Section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-black to-black" />
        <Container className="relative z-10">
          <FadeUp>
            <p className="text-pink-400 text-lg md:text-xl font-medium mb-6 tracking-wide">
              LUXURY / CLINICAL / AESTHETIC
            </p>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              About{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                Hello Gorgeous
              </span>
            </h1>
            <p className="mt-6 text-xl text-gray-300 max-w-3xl leading-relaxed">
              We’re a modern medical spa in Oswego, IL focused on natural-looking results,
              trust-driven care, and a premium experience from the first consult to the final
              follow-up.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button asChild variant="gradient" shape="pill">
                <Link href="/book">Book a Consultation</Link>
              </Button>
              <Button asChild variant="outline" shape="pill">
                <Link href="/services">Explore Services</Link>
              </Button>
            </div>
          </FadeUp>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Provider-led care",
                body: "Evidence-based recommendations and personalized treatment plans—never one-size-fits-all.",
              },
              {
                title: "Natural-looking results",
                body: "We prioritize facial harmony and long-term skin health with subtle, high-impact enhancements.",
              },
              {
                title: "Local expertise",
                body: "Proudly serving Oswego, Naperville, Aurora, and Plainfield with luxury medical aesthetics.",
              },
            ].map((c, idx) => (
              <FadeUp key={c.title} delay={0.06 * idx}>
                <div className="rounded-2xl border border-gray-800 bg-gradient-to-b from-gray-950/60 to-black p-6">
                  <h2 className="text-xl font-bold text-white">{c.title}</h2>
                  <p className="mt-3 text-gray-300">{c.body}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}

