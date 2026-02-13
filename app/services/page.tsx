import type { Metadata } from "next";
import Link from "next/link";

import { FadeUp, Section } from "@/components/Section";
import { CTA } from "@/components/CTA";
import { SERVICES, pageMetadata, siteJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Services",
  description:
    "Explore services at Hello Gorgeous Med Spa in Oswego, IL—Botox/Dysport, dermal fillers, GLP‑1 weight loss, hormone therapy, PRF/PRP.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
      />

      <Section className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-pink-900/10 via-black to-black" />
        <div className="relative z-10">
          <FadeUp>
            <p className="text-pink-400 text-lg md:text-xl font-medium mb-6 tracking-wide">
              EXPLORE CARE (SERVICES ATLAS™)
            </p>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-pink-400">
                Services
              </span>
            </h1>
            <p className="mt-6 text-xl text-gray-300 max-w-3xl leading-relaxed">
              Prefer a guided experience? Start with Explore Care to navigate by how you feel—no pressure, education first.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 flex-wrap">
              <CTA href="/explore-care" variant="gradient">
                Explore Care (Services Atlas™)
              </CTA>
              <CTA href="/providers" variant="outline">
                Meet Your Care Team
              </CTA>
              <Link
                href="/membership"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md border border-pink-500/30 text-pink-400 text-sm font-medium hover:bg-pink-500/10 transition"
              >
                💎 Save 10% with VIP Membership
              </Link>
            </div>
          </FadeUp>
        </div>
      </Section>

      <Section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, idx) => (
            <FadeUp key={s.slug} delayMs={40 * idx}>
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
      </Section>
    </>
  );
}

