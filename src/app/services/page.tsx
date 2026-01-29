import type { Metadata } from "next";
import Link from "next/link";

import { SiteJsonLd } from "@/components/seo/SiteJsonLd";
import { FadeUp } from "@/components/ui/FadeUp";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { services } from "@/content/services";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Services",
  description:
    "Explore medical aesthetics services at Hello Gorgeous Med Spa in Oswego, IL—Botox/Dysport, fillers, GLP‑1 weight loss, hormone therapy, PRF/PRP, and more.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <SiteJsonLd />

      <Section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-black to-black" />
        <Container className="relative z-10">
          <FadeUp>
            <p className="text-pink-400 text-lg md:text-xl font-medium mb-6 tracking-wide">
              TREATMENTS BUILT FOR NATURAL-LOOKING RESULTS
            </p>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                Services
              </span>
            </h1>
            <p className="mt-6 text-xl text-gray-300 max-w-3xl leading-relaxed">
              Browse our core offerings and book with confidence. Serving Oswego, Naperville,
              Aurora, and Plainfield.
            </p>
          </FadeUp>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s, idx) => (
              <FadeUp key={s.slug} delay={0.04 * idx}>
                <Link
                  href={`/services/${s.slug}`}
                  className="group block rounded-2xl border border-gray-800 bg-gradient-to-b from-gray-950/60 to-black p-6 hover:border-white/20 transition"
                >
                  <p className="text-pink-400 text-sm font-semibold tracking-wide">
                    {s.category.toUpperCase()}
                  </p>
                  <h2 className="mt-3 text-2xl font-bold text-white">{s.name}</h2>
                  <p className="mt-3 text-gray-300">{s.short}</p>
                  <p className="mt-6 text-sm font-semibold text-white/90">
                    Learn more{" "}
                    <span className="inline-block transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </p>
                </Link>
              </FadeUp>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}

