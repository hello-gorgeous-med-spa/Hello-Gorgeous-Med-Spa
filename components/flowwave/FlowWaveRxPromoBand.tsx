import Link from "next/link";

import { FlowWaveLogo } from "@/components/flowwave/FlowWaveLogo";
import { FLOWWAVE_INTRO_SPECIAL, FLOWWAVE_MARKETING, FLOWWAVE_PATH } from "@/lib/flowwave-marketing";

/** Cross-sell shockwave on RE GEN / rx funnels — in-spa recovery complement to telehealth. */
export function FlowWaveRxPromoBand() {
  return (
    <section
      className="mt-6 overflow-hidden rounded-2xl border-2 border-black bg-[#0a0a0a] shadow-[6px_6px_0_0_rgba(230,0,126,0.35)]"
      aria-label="STEMWAVE shockwave therapy at Hello Gorgeous Med Spa"
    >
      <div className="p-5 sm:p-6">
        <Link href={FLOWWAVE_PATH} className="inline-block">
          <FlowWaveLogo href={FLOWWAVE_PATH} width={280} className="rounded-md" />
        </Link>
        <p className="mt-4 text-sm font-medium leading-relaxed text-white/75">
          {FLOWWAVE_MARKETING.subhead}
        </p>
        <p className="mt-2 text-xs font-bold uppercase tracking-wide text-[#FFB8DC]">
          {FLOWWAVE_INTRO_SPECIAL.badge} · {FLOWWAVE_INTRO_SPECIAL.priceLabel}{" "}
          {FLOWWAVE_INTRO_SPECIAL.priceNote}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={FLOWWAVE_MARKETING.bookHref}
            className="inline-flex rounded-full bg-gradient-to-r from-[#FF2D8E] to-[#E6007E] px-5 py-2.5 text-sm font-bold text-white transition hover:brightness-110"
          >
            Book shockwave
          </Link>
          <Link
            href={FLOWWAVE_PATH}
            className="inline-flex rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Learn more
          </Link>
        </div>
      </div>
    </section>
  );
}
