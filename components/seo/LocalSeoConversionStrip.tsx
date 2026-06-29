import Link from "next/link";

import { ReviewTrustStrip } from "@/components/ReviewTrustStrip";
import { LOCAL_DOMINANCE_ACTIONS, LOCAL_DOMINANCE_TAGLINE } from "@/lib/local-dominance";
import { PRIMARY_BOOKING_CTA } from "@/lib/primary-cta";

type Props = {
  /** Show RX catalog CTA on weight-loss / hormone SEO pages */
  showRxCatalog?: boolean;
  className?: string;
};

/** Phase 8 — conversion footer for LocationServicePage and GBP landers. */
export function LocalSeoConversionStrip({ showRxCatalog = false, className = "" }: Props) {
  return (
    <section className={`border-y-4 border-black bg-[#FFF0F7] py-10 md:py-12 ${className}`}>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#E6007E]">
          Illinois&apos;s trusted med spa
        </p>
        <p className="mt-3 text-sm font-medium text-black/70">{LOCAL_DOMINANCE_TAGLINE}</p>
        <div className="mt-6 flex justify-center">
          <ReviewTrustStrip theme="light" className="justify-center" />
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {LOCAL_DOMINANCE_ACTIONS.map((action) => (
            <a
              key={action.id}
              href={action.href}
              {...(action.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className={
                action.primary
                  ? "inline-flex items-center rounded-full bg-[#E6007E] px-4 py-2 text-xs font-bold uppercase tracking-wide text-white shadow-[3px_3px_0_0_rgba(0,0,0,0.85)]"
                  : "inline-flex items-center rounded-full border-2 border-black bg-white px-4 py-2 text-xs font-bold text-black hover:border-[#E6007E] hover:text-[#E6007E]"
              }
            >
              {action.label}
            </a>
          ))}
          {showRxCatalog ? (
            <Link
              href="/rx/request"
              className="inline-flex items-center rounded-full border-2 border-[#E6007E] bg-white px-4 py-2 text-xs font-bold text-[#E6007E] hover:bg-[#FFF0F7]"
            >
              Browse RX catalog
            </Link>
          ) : null}
        </div>
        <p className="mt-4 text-xs text-black/50">
          Primary booking:{" "}
          <Link href={PRIMARY_BOOKING_CTA.href} className="font-semibold text-[#E6007E] underline">
            {PRIMARY_BOOKING_CTA.label}
          </Link>
        </p>
      </div>
    </section>
  );
}
