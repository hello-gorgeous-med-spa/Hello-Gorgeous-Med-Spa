import Image from "next/image";
import Link from "next/link";

import { SOLARIA_CO2_PATH, SOLARIA_LAUNCH_SPECIAL, SOLARIA_MARKETING } from "@/lib/solaria-marketing";

export function SolariaHomeBand() {
  return (
    <section className="relative overflow-hidden border-b-4 border-black bg-white text-black">
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-2 lg:items-center lg:px-8">
        <div className="order-2 lg:order-1 overflow-hidden rounded-3xl border-4 border-black shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]">
          <Image src={SOLARIA_MARKETING.images.faceBa} alt="Solaria CO2 full face before and after" width={800} height={600} className="h-auto w-full" />
        </div>
        <div className="order-1 lg:order-2">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#E6007E]">{SOLARIA_MARKETING.eyebrow}</p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">
            Solaria CO₂ —{" "}
            <span className="text-[#E6007E]">fractional laser resurfacing</span>
          </h2>
          <p className="mt-4 max-w-xl text-black/75">{SOLARIA_MARKETING.subhead}</p>
          <p className="mt-6 text-2xl font-black text-[#E6007E]">{SOLARIA_LAUNCH_SPECIAL.priceLabel} <span className="text-sm font-semibold text-black/55">full face launch</span></p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={SOLARIA_CO2_PATH} className="rounded-full bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-6 py-3 text-sm font-extrabold text-white">Explore Solaria CO₂</Link>
            <Link href={SOLARIA_MARKETING.bookHref} className="rounded-full border-2 border-black px-6 py-3 text-sm font-bold">Book consult</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
