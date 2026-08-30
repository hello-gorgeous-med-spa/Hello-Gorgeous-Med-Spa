"use client";

import Image from "next/image";
import Link from "next/link";

import { RoseGoldFrame } from "@/components/marketing/RoseGoldFrame";
import { FadeUp } from "@/components/Section";
import {
  FALL_MAKEOVER_CAMPAIGN,
  FALL_MAKEOVER_CONTACT,
  FALL_MAKEOVER_PATH,
  HOME_FALL_SQUARES,
  HOME_THIS_IS_US_PHOTOS,
} from "@/lib/campaigns/fall-makeover-2026";

/** Homepage — This is us gallery + Fall Makeover. Replaces the expired Botox Bash flyer. */
export function NewStudioRevealBand() {
  const { bookHref } = FALL_MAKEOVER_CONTACT;

  return (
    <section
      id="this-is-us"
      className="scroll-mt-24 border-b border-white/10 bg-[radial-gradient(85%_95%_at_78%_8%,#1a0510,#000_62%)]"
      aria-labelledby="this-is-us-heading"
    >
      <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 sm:py-16 lg:py-20">
        <FadeUp>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[12px] font-extrabold uppercase tracking-[0.3em] text-[#FF2D8E]">
              Hello Gorgeous · downtown Oswego
            </p>
            <h2
              id="this-is-us-heading"
              className="mt-3 font-serif text-[34px] font-bold leading-[1.05] text-white sm:text-[46px]"
            >
              This is <span className="text-[#FF2D8E]">who we are</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/70 sm:text-lg">
              Real night in the new Washington Street studio — friends, treatments, and the room we
              built. Not a stock set. Come sit with us.
            </p>
          </div>
        </FadeUp>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
          {HOME_THIS_IS_US_PHOTOS.map((photo, i) => (
            <FadeUp key={photo.src} delayMs={i * 40}>
              <Link href={`${FALL_MAKEOVER_PATH}#who-we-are`} className="block">
                <RoseGoldFrame caption={photo.caption}>
                  <div className="relative aspect-[3/4] w-full">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-[1.03]"
                      style={{ objectPosition: photo.focus }}
                      sizes="(max-width: 1024px) 50vw, 25vw"
                      priority={i < 2}
                    />
                  </div>
                </RoseGoldFrame>
              </Link>
            </FadeUp>
          ))}
        </div>

        <FadeUp delayMs={80}>
          <div className="mt-16 border-t border-white/10 pt-14">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-[12px] font-extrabold uppercase tracking-[0.3em] text-[#E8C4B8]">
                Fall promotions
              </p>
              <h3 className="mt-3 font-serif text-[30px] font-bold leading-[1.05] text-white sm:text-[40px]">
                Repair. Prevent. <span className="text-[#FF2D8E]">Lose.</span>
              </h3>
              <p className="mt-4 text-base leading-relaxed text-white/70 sm:text-lg">
                Three inside + out lanes for the season. Launch savings apply at consult after Ryan
                Kent, FNP-BC maps candidacy — not a checkout coupon.
              </p>
            </div>

            <div className="-mx-4 mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:-mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-5 lg:gap-4">
              {HOME_FALL_SQUARES.map((square, i) => (
                <Link
                  key={square.src}
                  href={square.href}
                  className="w-[78vw] shrink-0 snap-start sm:w-auto"
                >
                  <RoseGoldFrame caption={square.caption}>
                    <div className="relative aspect-square w-full bg-black">
                      <Image
                        src={square.src}
                        alt={square.alt}
                        fill
                        className="object-contain transition duration-700 group-hover:scale-[1.02]"
                        sizes="(max-width: 640px) 78vw, (max-width: 1024px) 50vw, 20vw"
                        priority={i < 2}
                      />
                    </div>
                  </RoseGoldFrame>
                </Link>
              ))}
            </div>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href={FALL_MAKEOVER_PATH}
                className="inline-flex items-center justify-center rounded-full bg-[#FF2D8E] px-8 py-3.5 text-base font-extrabold text-black transition hover:-translate-y-0.5 hover:bg-white"
              >
                See Fall Makeover
              </Link>
              <Link
                href={bookHref}
                className="inline-flex items-center justify-center rounded-full border border-white/45 px-8 py-3.5 text-base font-bold text-white transition hover:-translate-y-0.5 hover:border-[#FF2D8E] hover:text-[#FF2D8E]"
              >
                Book a consult
              </Link>
            </div>
            <p className="mt-4 text-center text-xs text-white/45">
              {FALL_MAKEOVER_CAMPAIGN.seasonLabel} · savings lock at consult · one lane per client
            </p>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}
