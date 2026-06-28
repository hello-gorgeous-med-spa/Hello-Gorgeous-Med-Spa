import Link from "next/link";

import { HG_RX_TELEHEALTH_BOOKING_LABEL, HG_RX_TELEHEALTH_BOOKING_URL } from "@/lib/flows";
import { HELLO_GORGEOUS_RX } from "@/lib/hello-gorgeous-rx";

type RxTelehealthHandoffProps = {
  /** Show Fresha booking CTA (after consult pre-pay for new protocols). */
  showBooking?: boolean;
  statusHref?: string;
};

export function RxTelehealthHandoff({ showBooking = true, statusHref }: RxTelehealthHandoffProps) {
  return (
    <div className="mt-5 mx-auto max-w-md rounded-2xl border-2 border-black bg-[#FFF0F7] p-5 text-left shadow-[4px_4px_0_0_rgba(230,0,126,0.2)]">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#E6007E]">
        NP telehealth visit
      </p>
      <p className="mt-2 text-lg font-black text-black">{HELLO_GORGEOUS_RX.providerName}</p>
      <p className="mt-2 text-sm text-black/70 leading-relaxed">
        Plan on about <strong className="text-black">15 minutes</strong> by secure video. Ryan reviews
        your health history, goals, and whether your requested protocol is safe and appropriate.{" "}
        <strong className="text-black">Nothing ships without clinical approval.</strong>
      </p>
      <ul className="mt-3 space-y-1.5 text-xs text-black/65">
        <li>▸ Have your medication list handy</li>
        <li>▸ Quiet space with good phone or laptop camera</li>
        <li>
          ▸{" "}
          {showBooking
            ? "Book on Fresha — you'll get a confirmation email with the video link"
            : "Fresha booking unlocks right after your consult payment above"}
        </li>
      </ul>
      {showBooking ? (
        <a
          href={HG_RX_TELEHEALTH_BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-[#E6007E] px-6 py-3.5 text-sm font-bold text-white hover:bg-black transition-colors"
        >
          {HG_RX_TELEHEALTH_BOOKING_LABEL} →
        </a>
      ) : null}
      {statusHref ? (
        <Link
          href={statusHref}
          className="mt-3 block text-center text-xs font-semibold text-[#E6007E] underline"
        >
          Track full order status →
        </Link>
      ) : null}
    </div>
  );
}
