"use client";

import Image from "next/image";

import { RoseGoldFrame } from "@/components/marketing/RoseGoldFrame";
import { FadeUp } from "@/components/Section";
import { HOME_THIS_IS_US_PHOTOS } from "@/lib/campaigns/fall-makeover-2026";

/** Homepage — This is us studio gallery. */
export function NewStudioRevealBand() {
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
              <RoseGoldFrame caption={photo.caption}>
                <div className="relative aspect-[3/4] w-full">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover"
                    style={{ objectPosition: photo.focus }}
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    priority={i < 2}
                  />
                </div>
              </RoseGoldFrame>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
