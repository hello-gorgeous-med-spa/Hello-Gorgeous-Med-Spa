import Image from "next/image";
import Link from "next/link";

import { FadeUp } from "@/components/Section";
import { HOMEPAGE_RYAN_CARE } from "@/lib/homepage-ryan-care";

/** Ryan with patient — second homepage band below the hero image. */
export function HomepageRyanCareSection() {
  const { image, imageAlt, eyebrow, headline, body, primaryCta, secondaryCta, tertiaryCta } =
    HOMEPAGE_RYAN_CARE;

  return (
    <section
      className="border-b border-white/10 bg-black"
      aria-labelledby="homepage-ryan-care-heading"
    >
      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-12 md:py-14">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-12">
          <FadeUp>
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
              <div className="relative aspect-[4/3] w-full sm:aspect-[16/11]">
                <Image
                  src={image}
                  alt={imageAlt}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                />
              </div>
            </div>
          </FadeUp>

          <FadeUp delayMs={80}>
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/45">
              {eyebrow}
            </p>
            <h2
              id="homepage-ryan-care-heading"
              className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl"
            >
              {headline}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/70">{body}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href={primaryCta.href}
                className="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-neutral-100"
              >
                {primaryCta.label}
              </Link>
              <Link
                href={secondaryCta.href}
                className="inline-flex items-center justify-center rounded-lg border border-white/25 px-5 py-3 text-sm font-medium text-white transition hover:border-white/40 hover:bg-white/5"
              >
                {secondaryCta.label}
              </Link>
              <a
                href={tertiaryCta.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg border border-white/15 px-5 py-3 text-sm font-medium text-white/80 transition hover:border-white/30 hover:text-white"
              >
                {tertiaryCta.label}
              </a>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
