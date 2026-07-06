import Image from "next/image";
import Link from "next/link";

import { INJECTABLES_INTRO_SPECIAL, INJECTABLES_MARKETING, INJECTABLES_PATH } from "@/lib/injectables-marketing";

export function InjectablesHomeBand() {
  return (
    <section className="relative overflow-hidden border-y-4 border-black bg-[#0a0a0a] text-white">
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-2 lg:items-center lg:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#FFB8DC]">{INJECTABLES_MARKETING.eyebrow}</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">
            Botox & fillers —{" "}
            <span className="bg-gradient-to-r from-[#FFB8DC] to-[#E6007E] bg-clip-text text-transparent">NP-led</span>
          </h2>
          <p className="mt-4 max-w-xl text-white/80">{INJECTABLES_MARKETING.subhead}</p>
          <p className="mt-6 text-2xl font-black text-[#FF2D8E]">
            {INJECTABLES_INTRO_SPECIAL.priceLabel}{" "}
            <span className="text-sm font-semibold text-white/60">/ unit Botox · lip filler from $450</span>
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={INJECTABLES_PATH}
              className="rounded-full bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-6 py-3 text-sm font-extrabold text-white"
            >
              Explore injectables
            </Link>
            <Link href={INJECTABLES_MARKETING.bookHref} className="rounded-full border-2 border-white/40 px-6 py-3 text-sm font-bold">
              Book consult
            </Link>
          </div>
        </div>
        <div className="overflow-hidden rounded-3xl border-4 border-[#E6007E]/40 bg-gradient-to-br from-[#2d1020] to-black p-8">
          <Image
            src={INJECTABLES_MARKETING.images.hero}
            alt="Botox and fillers at Hello Gorgeous Med Spa Oswego"
            width={600}
            height={600}
            className="mx-auto h-auto w-full max-w-sm object-contain"
          />
        </div>
      </div>
    </section>
  );
}
