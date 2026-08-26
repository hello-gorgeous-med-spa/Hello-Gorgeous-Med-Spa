"use client";

import Image from "next/image";
import Link from "next/link";

import { CTA } from "@/components/CTA";
import { FadeUp } from "@/components/Section";
import {
  BOTOX_BASH_CAMPAIGN,
  BOTOX_BASH_PATH,
  STUDIO_PHOTOS,
} from "@/lib/campaigns/botox-bash-aug-2026";

const OFFERS = [
  { label: "Botox Cosmetic", value: BOTOX_BASH_CAMPAIGN.botoxPrice },
  { label: "Lip filler · event ½ syringe", value: BOTOX_BASH_CAMPAIGN.lipHalfPrice },
  { label: "Double vitamin shot", value: BOTOX_BASH_CAMPAIGN.doubleShotPrice },
] as const;

/** Homepage reveal — new downtown studio photos + this weekend’s Botox Bash. */
export function NewStudioRevealBand() {
  return (
    <section
      className="border-b-4 border-black bg-gradient-to-br from-[#0a0a0a] via-[#1a0a14] to-[#2d1020]"
      aria-labelledby="new-studio-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-12 md:px-6 md:py-16">
        <FadeUp>
          <div className="text-center">
            <p className="inline-flex items-center gap-2 rounded-full border-2 border-white/20 bg-white/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.28em] text-white backdrop-blur">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[#E6007E]" aria-hidden />
              New downtown studio · this weekend only
            </p>
            <h2
              id="new-studio-heading"
              className="mt-5 font-black text-3xl leading-tight text-white sm:text-5xl"
            >
              Come see what we’ve been{" "}
              <span
                className="bg-gradient-to-r from-[#FFB8DC] via-[#FF2D8E] to-[#E6007E] bg-clip-text text-transparent"
                style={{ WebkitBackgroundClip: "text" }}
              >
                working for
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
              {`Hello Gorgeous is home on Washington Street. Walk the new lobby, then book Weekend Botox Bash — ${BOTOX_BASH_CAMPAIGN.fridayLabel} Girls Night ${BOTOX_BASH_CAMPAIGN.fridayWindow}, plus ${BOTOX_BASH_CAMPAIGN.saturdayLabel}.`}
            </p>
          </div>
        </FadeUp>

        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-5">
          {STUDIO_PHOTOS.map((photo, i) => (
            <FadeUp key={photo.src} delayMs={i * 40}>
              <Link
                href={BOTOX_BASH_PATH}
                className="group relative block overflow-hidden rounded-2xl border-4 border-black bg-white shadow-[6px_6px_0_0_rgba(230,0,126,0.35)]"
              >
                <div className="relative aspect-[3/4]">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 50vw, 20vw"
                    priority={i < 2}
                  />
                </div>
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-3 py-2 text-xs font-bold uppercase tracking-wide text-white">
                  {photo.caption}
                </span>
              </Link>
            </FadeUp>
          ))}
        </div>

        <FadeUp delayMs={80}>
          <div className="mt-8 overflow-hidden rounded-3xl border-4 border-black bg-white shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
            <div className="grid md:grid-cols-[1.1fr_0.9fr]">
              <div className="border-b-4 border-black p-6 md:border-b-0 md:border-r-4 md:p-8">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#E6007E]">
                  Weekend Botox Bash
                </p>
                <h3 className="mt-2 font-black text-2xl text-black sm:text-3xl">
                  {BOTOX_BASH_CAMPAIGN.fridayLabel} & {BOTOX_BASH_CAMPAIGN.saturdayLabel}
                </h3>
                <p className="mt-2 text-sm font-semibold text-black/70">
                  Friday {BOTOX_BASH_CAMPAIGN.fridayWindow} · {BOTOX_BASH_CAMPAIGN.girlsNightTitle} · Saturday
                  clinic hours
                </p>
                <ul className="mt-5 space-y-3">
                  {OFFERS.map((offer) => (
                    <li
                      key={offer.label}
                      className="flex items-baseline justify-between gap-4 border-b border-black/10 pb-2 last:border-0"
                    >
                      <span className="font-bold text-[#E6007E]">▸ {offer.label}</span>
                      <span className="text-right font-black text-black">{offer.value}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs leading-relaxed text-black/60">
                  Authentic Botox Cosmetic. Units are mapped at your visit. Event pricing this weekend
                  only. Champagne service is 21+.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <CTA href={BOTOX_BASH_CAMPAIGN.bookPath} variant="gradient">
                    Book the Bash
                  </CTA>
                  <CTA href={BOTOX_BASH_PATH} variant="outline">
                    See the new spa
                  </CTA>
                </div>
              </div>
              <Link href={BOTOX_BASH_PATH} className="relative min-h-[260px] bg-[#FFF0F7]">
                <Image
                  src={BOTOX_BASH_CAMPAIGN.flyerWeekend}
                  alt="Weekend Botox Bash flyer — $9 per unit Botox, Friday August 28 and Saturday August 29"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              </Link>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
