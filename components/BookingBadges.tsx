import Image from "next/image";

import { BOOKING_URL, SQUARE_MAILING_LIST_ENROLL_URL } from "@/lib/flows";

/** Printable Square Appointments QR (from Square Dashboard). Raster preview: `square-appointments-qr.png`. */
const SQUARE_QR_PDF_PATH = "/booking/square-appointments-qr.pdf";
const SQUARE_QR_PREVIEW_PNG_PATH = "/booking/square-appointments-qr.png";

/** QR preview raster dimensions (generated from PDF at checkout). */
const QR_PREVIEW_W = 1224;
const QR_PREVIEW_H = 1584;

/**
 * Square booking QR + optional Fresha “Best in Class” trust badges (legacy partnership recognition).
 */
export function BookingBadges({ className = "" }: { className?: string }) {
  return (
    <div className={`mt-6 ${className}`.trim()}>
      <p className="mb-3 text-xs uppercase tracking-wider text-white/60">Book online · Square</p>
      <div className="flex flex-col flex-wrap items-start gap-6 sm:flex-row sm:items-end">
        <div className="flex flex-col items-start gap-2">
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="block overflow-hidden rounded-lg border border-white/20 bg-white/5 p-1 transition-colors hover:border-[#FF2D8E]/50 focus:outline-none focus:ring-2 focus:ring-[#FF2D8E] focus:ring-offset-2 focus:ring-offset-black"
            aria-label="Open Square Appointments booking — tap or scan QR on your phone"
          >
            <Image
              src={SQUARE_QR_PREVIEW_PNG_PATH}
              alt="Square Appointments QR — scan to book Hello Gorgeous Med Spa online"
              width={QR_PREVIEW_W}
              height={QR_PREVIEW_H}
              className="h-auto w-[min(200px,72vw)]"
              sizes="200px"
            />
          </a>
          <a
            href={SQUARE_QR_PDF_PATH}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-[#FF2D8E] underline decoration-[#FF2D8E]/40 underline-offset-2 hover:text-white hover:decoration-white"
          >
            Download QR (PDF) — print for front desk · tent cards
          </a>
          <a
            href={SQUARE_MAILING_LIST_ENROLL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-medium text-white/70 underline underline-offset-2 hover:text-[#FF2D8E]"
          >
            Join mailing list · offers &amp; updates (Square)
          </a>
        </div>
        <div className="flex max-w-md flex-wrap items-center gap-3">
          <Image
            src="/images/badges/fresha-best-in-class-2026.png"
            alt="Fresha Best in Class 2026"
            width={120}
            height={150}
            className="h-24 w-auto"
            sizes="120px"
          />
          <Image
            src="/images/badges/fresha-best-in-class-past-years.png"
            alt="Fresha Best in Class awards 2023 and 2025"
            width={280}
            height={120}
            className="h-16 w-auto sm:h-20"
            sizes="(max-width: 640px) 240px, 280px"
          />
        </div>
      </div>
    </div>
  );
}

/** @deprecated Use `BookingBadges`. */
export const FreshaBadges = BookingBadges;
