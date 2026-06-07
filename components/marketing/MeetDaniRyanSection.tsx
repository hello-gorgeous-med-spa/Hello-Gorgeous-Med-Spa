"use client";

import Image from "next/image";
import Link from "next/link";
import { HG_TAGLINE } from "@/lib/brand-tagline";
import { DANI_IMAGE, RYAN_IMAGE } from "@/lib/founder-credentials";
import {
  SHOWCASE_ACCENTS,
  TrifectaShowcaseSection,
  type ShowcaseAccent,
  useShowcaseVisible,
} from "@/components/homepage-v3/trifecta-showcase";

function FounderTrifectaCard({
  image,
  imageAlt,
  heading,
  role,
  credentials,
  body,
  ctaLabel,
  ctaHref,
  accent,
  delayMs,
}: {
  image: string;
  imageAlt: string;
  heading: string;
  role: string;
  credentials: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  accent: ShowcaseAccent;
  delayMs: number;
}) {
  const visible = useShowcaseVisible();

  return (
    <div
      className={`group relative transition-all duration-700 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
      }`}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      <div
        className="relative h-full overflow-hidden rounded-2xl backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl"
        style={{ backgroundColor: "rgba(24, 24, 27, 0.8)", border: `1px solid ${accent.border}` }}
      >
        <div className="relative flex h-56 items-center justify-center overflow-hidden bg-zinc-900">
          <div className="relative h-36 w-36 overflow-hidden rounded-2xl border-2 border-white/20">
            <Image src={image} alt={imageAlt} fill className="object-cover object-center" sizes="144px" />
          </div>
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(24, 24, 27, 1) 0%, rgba(24, 24, 27, 0.3) 50%, transparent 100%)",
            }}
          />
        </div>

        <div className="relative -mt-4 px-6 pb-6">
          <div className="mb-4">
            <h3 className="mb-1 text-2xl font-bold" style={{ color: "#ffffff" }}>
              {heading}
            </h3>
            <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: accent.subtitle }}>
              {role}
            </p>
          </div>

          <p className="mb-4 text-sm font-semibold" style={{ color: "rgba(255,255,255,0.75)" }}>
            {credentials}
          </p>

          <p className="mb-6 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
            {body}
          </p>

          <Link
            href={ctaHref}
            className="block w-full rounded-xl px-6 py-3 text-center font-semibold transition-all duration-300 hover:shadow-lg"
            style={{
              background: `linear-gradient(to right, ${accent.buttonFrom}, ${accent.buttonTo})`,
              color: "#ffffff",
            }}
          >
            <span className="flex items-center justify-center gap-2">
              {ctaLabel}
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export function MeetDaniRyanSection() {
  return (
    <TrifectaShowcaseSection
      className="border-b-4 border-black"
      pill={HG_TAGLINE}
      title={
        <>
          Meet{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: "linear-gradient(to right, #ec4899, #60a5fa, #f59e0b)",
            }}
          >
            Dani &amp; Ryan
          </span>
        </>
      }
      description="Real founders. Real credentials. On site every week — not a rented medical director from another state."
      footer={
        <>
          <div
            className="mx-auto mb-10 max-w-2xl rounded-2xl px-6 py-8 backdrop-blur-sm md:px-10"
            style={{
              backgroundColor: "rgba(24, 24, 27, 0.8)",
              border: "1px solid rgba(236, 72, 153, 0.3)",
            }}
          >
            <p className="mb-2 text-xs font-bold uppercase tracking-wider" style={{ color: "#f472b6" }}>
              A Founder&apos;s Letter
            </p>
            <h3 className="mb-3 text-2xl font-bold text-white md:text-3xl">My Jerry Maguire Moment</h3>
            <p className="mb-5 text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
              Almost 10 years in, Dani shares the truth about business ownership — the risk, the resilience,
              the boundaries, and the next chapter of Hello Gorgeous.{" "}
              <span className="italic" style={{ color: "#f472b6" }}>
                &ldquo;Still standing. Still learning. Still growing. Still gorgeous.&rdquo;
              </span>
            </p>
            <Link
              href="/blog/my-jerry-maguire-moment"
              className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold transition-all duration-300 hover:scale-105"
              style={{
                background: "linear-gradient(to right, #ec4899, #db2777)",
                color: "#ffffff",
              }}
            >
              Read the full letter →
            </Link>
          </div>

          <p className="mx-auto mb-5 max-w-2xl text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
            Having both a male and female practitioner is not just convenient — it is a real advantage for
            comfort, balance, and treatment planning.
          </p>
          <Link
            href="/blog/male-female-practitioners-med-spa-advantage-oswego-il"
            className="inline-flex items-center justify-center gap-2 rounded-xl px-8 py-4 font-bold transition-all duration-300 hover:scale-105"
            style={{ backgroundColor: "#ffffff", color: "#000000" }}
          >
            Read why our team works this way →
          </Link>
        </>
      }
    >
      <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
        <FounderTrifectaCard
          image={DANI_IMAGE}
          imageAlt="Danielle Alcala-Glazier, Owner and Founder of Hello Gorgeous Med Spa"
          heading="Meet Dani"
          role="Owner & Founder"
          credentials="Licensed Esthetician, Phlebotomist, CMAA, CNA (RN in progress)"
          body="10+ years owning this practice. Still in the office every day. Started with severe acne at 12, opened my first chair with help from the aunt who raised me, and I'm still here."
          ctaLabel="Read Dani's founder's letter"
          ctaHref="/blog/founder-letter-morpheus8-solaria-oswego-il"
          accent={SHOWCASE_ACCENTS[0]}
          delayMs={200}
        />
        <FounderTrifectaCard
          image={RYAN_IMAGE}
          imageAlt="Ryan Kent, FNP-BC, Medical Director at Hello Gorgeous Med Spa"
          heading="Meet Ryan"
          role="Medical Director"
          credentials="Ryan Kent, FNP-BC — Family Nurse Practitioner, Board-Certified"
          body="Full prescriptive authority in Illinois. On site 7 days a week. Every clinical protocol at Hello Gorgeous — from Botox dosing to GLP-1 weight loss to hormone therapy — goes through me."
          ctaLabel="Meet Ryan"
          ctaHref="/about#ryan"
          accent={SHOWCASE_ACCENTS[1]}
          delayMs={350}
        />
      </div>
    </TrifectaShowcaseSection>
  );
}
