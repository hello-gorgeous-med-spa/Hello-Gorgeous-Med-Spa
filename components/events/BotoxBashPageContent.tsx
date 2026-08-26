"use client";

import Image from "next/image";
import Link from "next/link";

import { CTA } from "@/components/CTA";
import { FadeUp, Section } from "@/components/Section";
import {
  BOTOX_BASH_CAMPAIGN,
  STUDIO_PHOTOS,
} from "@/lib/campaigns/botox-bash-aug-2026";
import { SITE } from "@/lib/seo";

const BRAND = {
  pink: "#E6007E",
  pinkHot: "#FF2D8E",
  rose: "#FFF0F7",
  dark: "#0a0a0a",
};

const JUMP = [
  { href: "#studio", label: "The new spa" },
  { href: "#event", label: "Botox Bash" },
  { href: "#book", label: "Book" },
] as const;

export function BotoxBashPageContent() {
  return (
    <div className="relative min-h-[100dvh]">
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-90"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% -10%, ${BRAND.pink}33 0%, transparent 55%),
            radial-gradient(ellipse 60% 40% at 100% 30%, ${BRAND.pinkHot}22 0%, transparent 50%),
            radial-gradient(ellipse 50% 35% at 0% 70%, ${BRAND.pink}18 0%, transparent 45%),
            linear-gradient(180deg, ${BRAND.rose} 0%, #ffffff 35%, #fafafa 100%)
          `,
        }}
      />

      <main>
        <Section className="relative border-b-4 border-black py-16 lg:py-24 !px-0">
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${BRAND.dark} 0%, #1a0a12 40%, #2d1020 70%, ${BRAND.dark} 100%)`,
            }}
          />
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background: `radial-gradient(circle at 20% 30%, ${BRAND.pink} 0%, transparent 45%),
                radial-gradient(circle at 85% 20%, ${BRAND.pinkHot} 0%, transparent 40%),
                radial-gradient(circle at 70% 80%, ${BRAND.pink}33 0%, transparent 35%)`,
            }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(0,0,0,0.5)_100%)]" />

          <div className="relative z-10 mx-auto max-w-4xl px-4 text-center md:px-6">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white backdrop-blur-sm">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[#E6007E]" aria-hidden />
              This weekend · Oswego
            </div>
            <p className="mb-4 text-xs font-medium uppercase tracking-widest text-[#FFB8DC] md:text-sm">
              74 W. Washington Street · downtown Oswego
            </p>
            <h1 className="mb-6 text-4xl font-black leading-tight text-white drop-shadow-lg md:text-6xl">
              Our new spa is ready.{" "}
              <span
                className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
                style={{ WebkitBackgroundClip: "text" }}
              >
                Weekend Botox Bash
              </span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-white/85 md:text-xl">
              Come walk the space we’ve been building — then celebrate with {BOTOX_BASH_CAMPAIGN.botoxPrice}{" "}
              authentic Botox Cosmetic, event lip filler, and Girls Night Out Friday{" "}
              {BOTOX_BASH_CAMPAIGN.fridayWindow}.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <CTA href={BOTOX_BASH_CAMPAIGN.bookPath} variant="gradient" className="shadow-[0_8px_32px_-4px_rgba(230,0,126,0.55)]">
                Book your spot
              </CTA>
              <a
                href={BOTOX_BASH_CAMPAIGN.telHref}
                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-md border-2 border-white px-10 py-4 text-sm font-semibold uppercase tracking-widest text-white transition hover:bg-white hover:text-black md:w-auto"
              >
                Call {BOTOX_BASH_CAMPAIGN.phoneDisplay}
              </a>
            </div>
          </div>
        </Section>

        <Section className="!py-10 border-b-4 border-black bg-white/70 backdrop-blur-sm">
          <nav aria-label="Page sections" className="mx-auto max-w-5xl px-4 md:px-6">
            <ul className="flex flex-wrap gap-2">
              {JUMP.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="inline-flex rounded-full border-2 border-black bg-gradient-to-b from-white to-rose-50 px-4 py-2 text-sm font-bold text-black shadow-sm hover:border-[#E6007E] hover:text-[#E6007E]"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </Section>

        <Section id="studio" className="scroll-mt-28 !py-16 md:!py-20 bg-gradient-to-b from-white to-[#FFF5FA]">
          <div className="mx-auto max-w-5xl px-4 md:px-6">
            <FadeUp>
              <div className="rounded-3xl border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] md:p-10">
                <div className="mb-6 flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-black bg-gradient-to-br from-[#FF2D8E] to-[#E6007E] text-lg font-black text-white">
                    1
                  </span>
                  <div>
                    <h2 className="text-2xl font-black leading-tight text-black md:text-3xl">
                      The new Hello Gorgeous
                    </h2>
                    <p className="mt-2 font-medium leading-relaxed text-black/65">
                      Reception with the Hello Gorgeous mosaic desk. Medical-grade retail. A lounge
                      built for how you actually wait — not a clinic hallway. This is downtown Oswego.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  {STUDIO_PHOTOS.map((photo) => (
                    <figure
                      key={photo.src}
                      className="overflow-hidden rounded-2xl border-4 border-black bg-[#f8f4f0]"
                    >
                      <div className="relative aspect-[4/5]">
                        <Image
                          src={photo.src}
                          alt={photo.alt}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, 30vw"
                        />
                      </div>
                      <figcaption className="border-t-2 border-black px-3 py-2 text-xs font-bold uppercase tracking-wide text-[#E6007E]">
                        {photo.caption}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            </FadeUp>
          </div>
        </Section>

        <Section id="event" className="scroll-mt-28 !py-16 md:!py-20 bg-white/50">
          <div className="mx-auto max-w-5xl px-4 md:px-6">
            <FadeUp>
              <div className="rounded-3xl border-4 border-black bg-white p-6 shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] md:p-10">
                <div className="mb-6 flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-black bg-gradient-to-br from-[#FF2D8E] to-[#E6007E] text-lg font-black text-white">
                    2
                  </span>
                  <div>
                    <h2 className="text-2xl font-black leading-tight text-black md:text-3xl">
                      Weekend Botox Bash
                    </h2>
                    <p className="mt-2 font-medium leading-relaxed text-black/65">
                      {BOTOX_BASH_CAMPAIGN.fridayLabel} {BOTOX_BASH_CAMPAIGN.girlsNightTitle}{" "}
                      {BOTOX_BASH_CAMPAIGN.fridayWindow}. {BOTOX_BASH_CAMPAIGN.saturdayLabel} during
                      Saturday hours. Bring your girls. Book a chair.
                    </p>
                  </div>
                </div>

                <dl className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border-2 border-black bg-[#FFF0F7] p-4">
                    <dt className="text-xs font-bold uppercase tracking-wide text-[#E6007E]">Botox</dt>
                    <dd className="mt-1 text-xl font-black text-black">{BOTOX_BASH_CAMPAIGN.botoxPrice}</dd>
                  </div>
                  <div className="rounded-2xl border-2 border-black bg-[#FFF0F7] p-4">
                    <dt className="text-xs font-bold uppercase tracking-wide text-[#E6007E]">Lip filler</dt>
                    <dd className="mt-1 text-xl font-black text-black">{BOTOX_BASH_CAMPAIGN.lipHalfPrice}</dd>
                  </div>
                  <div className="rounded-2xl border-2 border-black bg-[#FFF0F7] p-4">
                    <dt className="text-xs font-bold uppercase tracking-wide text-[#E6007E]">Vitamin shot</dt>
                    <dd className="mt-1 text-xl font-black text-black">{BOTOX_BASH_CAMPAIGN.doubleShotPrice}</dd>
                  </div>
                </dl>

                <p className="mt-6 text-sm font-medium leading-relaxed text-black/75">
                  ▸ Authentic Botox Cosmetic. Units are mapped at your visit — not sold off a flyer
                  count. Ryan Kent, FNP-BC on site. Medical Director Dr. Mukesh Arora, MD. Champagne
                  and appetizers Friday evening are 21+.
                </p>

                <div className="mt-8 grid gap-4 md:grid-cols-2">
                  <figure className="overflow-hidden rounded-2xl border-4 border-black">
                    <Image
                      src={BOTOX_BASH_CAMPAIGN.flyerFriday}
                      alt="Girls Night Out Botox Bash flyer — Friday August 28, 5 to 9 PM, $9 per unit"
                      width={900}
                      height={1200}
                      className="h-auto w-full"
                    />
                  </figure>
                  <figure className="overflow-hidden rounded-2xl border-4 border-black">
                    <Image
                      src={BOTOX_BASH_CAMPAIGN.flyerWeekend}
                      alt="Weekend Botox Bash flyer — August 28 and 29, Botox $9 per unit, lip filler, vitamin shots"
                      width={900}
                      height={1200}
                      className="h-auto w-full"
                    />
                  </figure>
                </div>
              </div>
            </FadeUp>
          </div>
        </Section>

        <Section
          id="book"
          className="relative scroll-mt-28 !px-0 !py-16 md:!py-20 bg-[linear-gradient(125deg,#FF2D8E_0%,#E6007E_45%,#9b0a4d_100%)]"
        >
          <div className="relative z-10 mx-auto max-w-3xl px-4 text-center md:px-6">
            <h2 className="text-3xl font-black text-white md:text-4xl">Book the weekend. Walk the new spa.</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg font-medium text-white/90">
              {BOTOX_BASH_CAMPAIGN.addressLine}. Call{" "}
              <a href={BOTOX_BASH_CAMPAIGN.telHref} className="font-black underline decoration-white/60 underline-offset-4">
                {BOTOX_BASH_CAMPAIGN.phoneDisplay}
              </a>{" "}
              or book online.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
              <CTA href={BOTOX_BASH_CAMPAIGN.bookPath} variant="white">
                Book online
              </CTA>
              <Link
                href="/contact"
                className="inline-flex min-h-[48px] items-center justify-center rounded-md border-2 border-white px-10 py-4 text-sm font-semibold uppercase tracking-widest text-white hover:bg-white hover:text-[#E6007E]"
              >
                Hours & map
              </Link>
            </div>
            <p className="mt-6 text-xs text-white/70">
              Serving {SITE.serviceAreas.slice(0, 4).join(" · ")}. Event pricing this weekend only.
            </p>
          </div>
        </Section>
      </main>
    </div>
  );
}
