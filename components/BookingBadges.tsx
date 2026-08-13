import Image from "next/image";

import { BOOK_PAGE_PATH } from "@/lib/flows";

/** Legacy Square Appointments QR assets (front-desk print). Link targets `/book` (Square embed). */
const LEGACY_QR_PDF_PATH = "/booking/square-appointments-qr.pdf";
const LEGACY_QR_PREVIEW_PNG_PATH = "/booking/square-appointments-qr.png";

/** QR preview raster dimensions (generated from PDF at checkout). */
const QR_PREVIEW_W = 1224;
const QR_PREVIEW_H = 1584;

/** Years Hello Gorgeous earned the Best in Class award, newest first. */
const BEST_IN_CLASS_YEARS = [2026, 2025, 2023] as const;

function StarRow() {
  return (
    <span className="flex items-center gap-0.5 text-[#FF2D8E]" aria-hidden>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} className="h-2.5 w-2.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      ))}
    </span>
  );
}

/**
 * Best in Class award years, rendered as type rather than the awarding platform's
 * supplied artwork — that artwork carried a Fresha wordmark we no longer display.
 */
function BestInClassBadge() {
  const years = BEST_IN_CLASS_YEARS.join(" · ");
  return (
    <div
      className="inline-flex items-center gap-3 rounded-xl border border-[#FF2D8E]/40 bg-[#FF2D8E]/10 px-4 py-2.5"
      role="img"
      aria-label={`Best in Class award winner ${BEST_IN_CLASS_YEARS.join(", ")}`}
    >
      <span className="text-lg leading-none" aria-hidden>
        🏆
      </span>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-[#FF2D8E]">Best in Class</p>
        <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-white/70">
          <StarRow />
          <span>{years}</span>
        </p>
      </div>
    </div>
  );
}

/**
 * Book-online QR + trust badges. Online scheduling via Square at `/book`.
 */
export function BookingBadges({ className = "" }: { className?: string }) {
  return (
    <div className={`mt-6 ${className}`.trim()}>
      <p className="mb-3 text-xs uppercase tracking-wider text-white/60">Book online · Square</p>
      <div className="flex flex-col flex-wrap items-start gap-6 sm:flex-row sm:items-end">
        <div className="flex flex-col items-start gap-2">
          <a
            href={BOOK_PAGE_PATH}
            className="block overflow-hidden rounded-lg border border-white/20 bg-white/5 p-1 transition-colors hover:border-[#FF2D8E]/50 focus:outline-none focus:ring-2 focus:ring-[#FF2D8E] focus:ring-offset-2 focus:ring-offset-black"
            aria-label="Book Hello Gorgeous online — tap or scan QR on your phone"
          >
            <Image
              src={LEGACY_QR_PREVIEW_PNG_PATH}
              alt="Book Hello Gorgeous Med Spa online — scan QR"
              width={QR_PREVIEW_W}
              height={QR_PREVIEW_H}
              className="h-auto w-[min(200px,72vw)]"
              sizes="200px"
            />
          </a>
          <a
            href={LEGACY_QR_PDF_PATH}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-[#FF2D8E] underline decoration-[#FF2D8E]/40 underline-offset-2 hover:text-white hover:decoration-white"
          >
            Download QR (PDF) — print for front desk · tent cards
          </a>
        </div>
        <div className="flex max-w-md flex-wrap items-center gap-3">
          <BestInClassBadge />
        </div>
      </div>
    </div>
  );
}