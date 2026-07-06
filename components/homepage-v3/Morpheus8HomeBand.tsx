import Image from "next/image";
import Link from "next/link";

import { MORPHEUS8_INTRO_SPECIAL, MORPHEUS8_MARKETING, MORPHEUS8_PATH } from "@/lib/morpheus8-marketing";

export function Morpheus8HomeBand() {
  return (
    <section className="relative overflow-hidden border-y-4 border-black bg-[#0a0a0a] text-white">
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-2 lg:items-center lg:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FFB8DC]">{MORPHEUS8_MARKETING.eyebrow}</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">
            Deepest RF microneedling —{" "}
            <span className="bg-gradient-to-r from-[#FFB8DC] to-[#E6007E] bg-clip-text text-transparent">face & body</span>
          </h2>
          <p className="mt-4 max-w-xl text-white/80">{MORPHEUS8_MARKETING.subhead}</p>
          <p className="mt-6 text-2xl font-black text-[#FF2D8E]">{MORPHEUS8_INTRO_SPECIAL.priceLabel} <span className="text-sm font-semibold text-white/60">face sessions</span></p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={MORPHEUS8_PATH} className="rounded-full bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-6 py-3 text-sm font-extrabold text-white">Explore Morpheus8</Link>
            <Link href={MORPHEUS8_MARKETING.bookHref} className="rounded-full border-2 border-white/40 px-6 py-3 text-sm font-bold">Book consult</Link>
          </div>
        </div>
        <div className="overflow-hidden rounded-3xl border-4 border-[#E6007E]/40">
          <Image src={MORPHEUS8_MARKETING.images.neckBa} alt="Morpheus8 neck tightening before and after" width={627} height={490} className="h-auto w-full" />
        </div>
      </div>
    </section>
  );
}
