import Image from "next/image";
import Link from "next/link";

import {
  BROW_PMU_OSWEGO_PATH,
  BROW_PMU_PORTFOLIO_BEFORE_AFTER,
  BROW_PMU_TECHNIQUES,
} from "@/data/brow-pmu-seo";

type Props = {
  className?: string;
  showCta?: boolean;
  priority?: boolean;
};

export function BrowPmuPortfolioShowcase({
  className = "",
  showCta = true,
  priority = false,
}: Props) {
  const { src, alt, title, caption, artist, business } = BROW_PMU_PORTFOLIO_BEFORE_AFTER;

  return (
    <section
      className={`rounded-2xl border-4 border-black bg-white shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] overflow-hidden ${className}`}
      aria-labelledby="brow-pmu-portfolio-heading"
    >
      <div className="border-b-2 border-black bg-gradient-to-r from-[#FFF0F7] to-white px-4 py-3 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#E6007E]">
          Permanent makeup brows · Oswego, IL
        </p>
        <h2 id="brow-pmu-portfolio-heading" className="mt-1 font-black text-lg sm:text-xl text-black">
          {title}
        </h2>
        <p className="mt-1 text-sm text-black/70 font-medium max-w-2xl mx-auto">{caption}</p>
        <p className="mt-2 text-xs font-semibold text-[#E6007E]">
          {artist} · {business}
        </p>
      </div>

      <figure className="relative w-full aspect-[16/10] sm:aspect-[2/1] bg-[#1a0a12]">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 960px"
          priority={priority}
        />
        <figcaption className="sr-only">
          Before and after brow permanent makeup portfolio showing microblading hair stroke, powder
          brows, combo hybrid brows, and nano brows performed by {artist} at {business} in Oswego,
          Illinois.
        </figcaption>
      </figure>

      <ul
        className="grid grid-cols-2 sm:grid-cols-4 gap-2 px-3 py-3 border-t border-black/10 bg-rose-50/80"
        aria-label="Brow PMU techniques shown"
      >
        {BROW_PMU_TECHNIQUES.map((t) => (
          <li
            key={t.id}
            className="rounded-lg border-2 border-black/15 bg-white px-2 py-2 text-center"
          >
            <span className="block text-[10px] font-black uppercase tracking-wide text-[#E6007E] leading-tight">
              {t.name}
            </span>
            <span className="mt-1 block text-[10px] text-black/65 font-medium leading-snug">
              {t.short}
            </span>
          </li>
        ))}
      </ul>

      <p className="px-4 py-3 text-[11px] text-black/55 text-center border-t border-black/10">
        Individual results vary. Technique, skin type, and touch-up visits affect final color and shape.
        Client consent on file.
      </p>

      {showCta ? (
        <div className="px-4 pb-4 flex flex-wrap justify-center gap-3 print:hidden">
          <Link
            href={BROW_PMU_OSWEGO_PATH}
            className="text-sm font-bold text-[#E6007E] hover:underline underline-offset-4"
          >
            Brow PMU in Oswego →
          </Link>
          <Link
            href="/gallery"
            className="text-sm font-bold text-black/70 hover:text-[#E6007E] hover:underline underline-offset-4"
          >
            Full gallery
          </Link>
          <Link
            href="/forms/brow-intake"
            className="text-sm font-bold text-black/70 hover:text-[#E6007E] hover:underline underline-offset-4"
          >
            Brow intake
          </Link>
        </div>
      ) : null}
    </section>
  );
}
