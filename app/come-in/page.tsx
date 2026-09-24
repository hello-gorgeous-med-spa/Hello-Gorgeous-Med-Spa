import type { Metadata } from "next";
import Image from "next/image";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";
import { pageMetadata, SITE } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Come In — We're Here For You | Hello Gorgeous Med Spa Oswego",
  description:
    "Come in — we're here for you. Hello Gorgeous Med Spa in downtown Oswego. New patients welcome. Book a free consult or call (630) 636-6193.",
  path: "/come-in",
});

const STOREFRONT = "/images/marketing/hello-gorgeous-storefront-windows-2026.png";

const INSIDE = [
  "5 neurotoxins — Botox, Jeuveau, Dysport, Daxxify, Xeomin",
  "Lip & cheek filler",
  "Morpheus8 Burst & Body 2.0",
  "CO₂ fractional laser",
  "IV therapy · vitamin injections",
  "Hormone & peptide therapy",
  "Medical-grade facials · lashes · microblading",
] as const;

export default function ComeInPage() {
  return (
    <div className="relative min-h-[100dvh]">
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -10%, #E6007E33 0%, transparent 55%),
            radial-gradient(ellipse 60% 40% at 100% 30%, #FF2D8E22 0%, transparent 50%),
            linear-gradient(180deg, #FFF0F7 0%, #ffffff 40%, #fafafa 100%)
          `,
        }}
      />

      <Section className="relative border-b-4 border-black py-16 lg:py-24 !px-0">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #0a0a0a 0%, #1a0a12 40%, #2d1020 70%, #0a0a0a 100%)",
          }}
        />
        <div className="relative z-10 mx-auto max-w-5xl px-4 text-center text-white">
          <FadeUp>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[#FFB8DC]">
              74 W. Washington St · Oswego, IL
            </p>
            <h1 className="text-4xl font-black leading-tight md:text-6xl">
              Come in.{" "}
              <span
                className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
                style={{ WebkitBackgroundClip: "text" }}
              >
                We&apos;re here for you.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/85">
              New patients welcome. Walk in, book online, or call — Hello Gorgeous is open on Washington Street.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <CTA href={PRIMARY_BOOKING_CTA.href} variant="gradient">
                {PRIMARY_BOOKING_CTA.label}
              </CTA>
              <CTA href={`tel:${SITE.phone}`} variant="outline">
                Call {SITE.phone}
              </CTA>
            </div>
          </FadeUp>
        </div>
      </Section>

      <Section className="border-b-4 border-black bg-white py-12">
        <FadeUp>
          <div className="mx-auto max-w-3xl overflow-hidden rounded-3xl border-4 border-black bg-white shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
            <Image
              src={STOREFRONT}
              alt="Hello Gorgeous Medical Spa storefront on Washington Street in Oswego"
              width={752}
              height={1024}
              className="h-auto w-full"
              priority
            />
          </div>
        </FadeUp>
      </Section>

      <Section className="border-b-4 border-black bg-gradient-to-b from-[#FFF0F7] to-white py-16">
        <FadeUp>
          <div className="mx-auto max-w-3xl rounded-3xl border-4 border-black bg-white p-8 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] md:p-10">
            <p className="mb-3 inline-block rounded-xl border-2 border-black bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
              Inside
            </p>
            <h2 className="text-3xl font-black text-black">What you&apos;ll find when you pull up</h2>
            <ul className="mt-6 space-y-3">
              {INSIDE.map((line) => (
                <li key={line} className="flex gap-3 text-base font-medium text-black/85">
                  <span className="font-bold text-[#E6007E]">▸</span>
                  {line}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-black/55">
              Medical evaluation required for prescription wellness. Individual results vary.
            </p>
          </div>
        </FadeUp>
      </Section>

      <section
        className="border-b-4 border-black px-4 py-16 text-center text-white"
        style={{
          background: "linear-gradient(125deg, #FF2D8E 0%, #E6007E 45%, #9b0a4d 100%)",
        }}
      >
        <h2 className="text-3xl font-black md:text-4xl">We&apos;re here for you</h2>
        <p className="mx-auto mt-4 max-w-xl text-white/90">
          {SITE.address.streetAddress}, {SITE.address.addressLocality}, {SITE.address.addressRegion}{" "}
          {SITE.address.postalCode}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <CTA href={PRIMARY_BOOKING_CTA.href} variant="white">
            Book now
          </CTA>
          <a
            href={SITE.googleBusinessUrl}
            className="inline-flex min-h-[48px] items-center justify-center rounded-md border border-white px-10 py-4 text-sm font-semibold uppercase tracking-widest text-white"
          >
            Get directions
          </a>
        </div>
      </section>
    </div>
  );
}
