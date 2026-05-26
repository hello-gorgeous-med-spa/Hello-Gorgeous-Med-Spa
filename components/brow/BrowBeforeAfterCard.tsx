import Image from "next/image";
import Link from "next/link";

import { BROW_PMU_OSWEGO_PATH } from "@/data/brow-pmu-seo";

export type BrowBeforeAfterData = {
  src: string;
  alt: string;
  title: string;
  caption: string;
};

type Props = {
  data: BrowBeforeAfterData;
  className?: string;
  showCta?: boolean;
  aspectClass?: string;
};

export function BrowBeforeAfterCard({
  data,
  className = "",
  showCta = true,
  aspectClass = "aspect-[4/5] sm:aspect-[16/11]",
}: Props) {
  const { src, alt, title, caption } = data;

  return (
    <section
      className={`rounded-2xl border-4 border-black bg-white shadow-[8px_8px_0_0_rgba(230,0,126,0.35)] overflow-hidden ${className}`}
    >
      <div className="border-b-2 border-black bg-gradient-to-r from-[#FFF0F7] to-white px-4 py-3 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#E6007E]">Real client result</p>
        <h3 className="mt-1 font-black text-lg text-black">{title}</h3>
        <p className="mt-1 text-sm text-black/70 font-medium">{caption}</p>
      </div>
      <div className={`relative w-full ${aspectClass} bg-black`}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 680px"
          priority={false}
        />
      </div>
      <p className="px-4 py-3 text-[11px] text-black/55 text-center border-t border-black/10">
        Individual results vary. Healing timeline and touch-up visits affect final color and shape.
      </p>
      {showCta ? (
        <div className="px-4 pb-4 flex flex-wrap justify-center gap-3 print:hidden">
          <Link
            href={BROW_PMU_OSWEGO_PATH}
            className="text-sm font-bold text-[#E6007E] hover:underline underline-offset-4"
          >
            All brow PMU results →
          </Link>
          <Link
            href="/forms/brow-intake"
            className="text-sm font-bold text-black/70 hover:text-[#E6007E] hover:underline underline-offset-4"
          >
            Brow intake form
          </Link>
        </div>
      ) : null}
    </section>
  );
}
