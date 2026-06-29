import type { Metadata } from "next";
import Link from "next/link";

import { FadeUp, Section } from "@/components/Section";
import { CTA } from "@/components/CTA";
import { TwoDoorsForkBand } from "@/components/TwoDoorsForkBand";
import { SERVICES, pageMetadata, servicePublicPath, siteJsonLd } from "@/lib/seo";

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
        <div className="absolute inset-0 bg-gradient-to-b from-pink-100 via-pink-50 to-white" />
        <div className="relative z-10">
          <FadeUp>
            <p className="text-[#FF2D8E] text-lg md:text-xl font-medium mb-6 tracking-wide">
              EXPLORE CARE (SERVICES ATLAS™)
            </p>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight text-black">
              Our{" "}
              <span className="text-[#FF2D8E]">
                Services
              </span>
            </h1>
            <p className="mt-6 text-xl text-black/80 max-w-3xl leading-relaxed">
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
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md border border-[#FF2D8E]/30 text-[#FF2D8E] text-sm font-medium hover:bg-[#FF2D8E]/10 transition"
              >
                💎 Save 10% with VIP Membership
              </Link>
            </div>
          </FadeUp>
        </div>
      </Section>

      <Section className="!py-10 sm:!py-12">
        <div className="mx-auto max-w-6xl">
          <TwoDoorsForkBand activeDoor="med-spa" surface="light" />
        </div>
      </Section>

      <Section>
        <FadeUp>
          <div className="mb-10">
            <p className="text-[#FF2D8E] text-xs md:text-sm font-bold uppercase tracking-[0.2em] mb-2">
              ★ Spotlight pages
            </p>
            <h2 className="text-2xl md:text-3xl font-black text-black">
              Most-requested treatments — full guides
            </h2>
            <p className="mt-2 text-black/70 max-w-2xl">
              Deep-dive pages with FAQs, pricing transparency, what to expect, and links to book a free consult.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
            {[
              {
                href: "/services/solaria-co2",
                eyebrow: "★ NEW · $899 Launch Special",
                title: "Solaria CO₂ Laser — $899",
                blurb:
                  "InMode Solaria fractional CO₂ — gold-standard skin resurfacing. Full face $899 (typically $1,500+). Wrinkles, acne scars, sun damage in one session.",
                cta: "See the launch special",
                accent: true,
              },
              {
                href: "/services/botox",
                eyebrow: "Injectables · Most popular",
                title: "Botox in Oswego, IL",
                blurb:
                  "Same-week Botox + Dysport + Jeuveau, real provider, transparent unit pricing. Allē rewards eligible.",
                cta: "Read the Botox guide",
              },
              {
                href: "/services/microneedling-rf",
                eyebrow: "Skin tightening · Morpheus8 Burst",
                title: "RF Microneedling",
                blurb:
                  "The only spa in the area running Morpheus8 Burst at the full 8mm depth. Acne scars, jowls, body contouring.",
                cta: "See RF microneedling",
              },
              {
                href: "/services/weight-loss-therapy",
                eyebrow: "Medical weight loss · GLP-1",
                title: "Semaglutide + Tirzepatide",
                blurb:
                  "From $300/mo with real labs, body composition scans, and a provider who actually picks up the phone.",
                cta: "See GLP-1 program",
              },
            ].map((card, idx) => (
              <FadeUp key={card.href} delayMs={60 * idx}>
                <Link
                  href={card.href}
                  className={`group block rounded-3xl border-4 border-black p-6 hover:-translate-y-0.5 transition ${
                    card.accent
                      ? "bg-gradient-to-br from-[#FF2D8E] via-[#E6007E] to-[#9b0a4d] text-white shadow-[8px_8px_0_0_rgba(0,0,0,0.85)] hover:shadow-[10px_10px_0_0_rgba(0,0,0,1)]"
                      : "bg-white shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] hover:shadow-[10px_10px_0_0_rgba(230,0,126,0.55)]"
                  }`}
                >
                  <p
                    className={`text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] ${
                      card.accent ? "text-white/90" : "text-[#E6007E]"
                    }`}
                  >
                    {card.eyebrow}
                  </p>
                  <h3
                    className={`mt-2 text-xl md:text-2xl font-black ${
                      card.accent ? "text-white" : "text-black"
                    }`}
                  >
                    {card.title}
                  </h3>
                  <p
                    className={`mt-3 text-sm leading-relaxed ${
                      card.accent ? "text-white/95" : "text-black/80"
                    }`}
                  >
                    {card.blurb}
                  </p>
                  <p
                    className={`mt-5 text-sm font-bold inline-flex items-center gap-1 ${
                      card.accent ? "text-white" : "text-[#E6007E]"
                    }`}
                  >
                    {card.cta}
                    <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                  </p>
                </Link>
              </FadeUp>
            ))}
          </div>
          <div className="mb-8 border-t-4 border-black" />
          <p className="text-[#FF2D8E] text-xs md:text-sm font-bold uppercase tracking-[0.2em] mb-2">
            Full services catalog
          </p>
          <h2 className="text-2xl md:text-3xl font-black text-black mb-6">
            Everything we offer
          </h2>
        </FadeUp>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, idx) => (
            <FadeUp key={s.slug} delayMs={40 * idx}>
              <Link
                href={servicePublicPath(s)}
                className="group block rounded-2xl border-2 border-black bg-gradient-to-br from-pink-50 to-white p-6 hover:border-[#FF2D8E] transition"
              >
                <p className="text-[#FF2D8E] text-sm font-semibold tracking-wide">
                  {s.category.toUpperCase()}
                </p>
                <h2 className="mt-3 text-2xl font-bold text-black">{s.name}</h2>
                <p className="mt-3 text-black/80">{s.short}</p>
                <p className="mt-6 text-sm font-semibold text-[#FF2D8E]">
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

