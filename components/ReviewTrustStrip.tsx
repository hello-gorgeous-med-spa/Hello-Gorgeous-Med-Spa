import Link from "next/link";

import {
  formatFreshaReviewBadge,
  formatGoogleReviewBadge,
  resolveReviewTrust,
} from "@/lib/review-trust";
import { SITE } from "@/lib/seo";
import type { GooglePlace } from "@/lib/seo/google-places";

type Props = {
  livePlace?: GooglePlace | null;
  theme?: "dark" | "light";
  className?: string;
};

function StarRow({ className }: { className: string }) {
  return (
    <span className={`flex items-center gap-0.5 ${className}`} aria-hidden>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      ))}
    </span>
  );
}

/** Labeled Google + Fresha proof — one source of truth, no blended scores. */
export function ReviewTrustStrip({ livePlace, theme = "dark", className = "" }: Props) {
  const trust = resolveReviewTrust(livePlace);
  const isDark = theme === "dark";
  const chip = isDark
    ? "rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white"
    : "rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs text-black/80";

  return (
    <div className={`flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center ${className}`}>
      <a
        href={SITE.googleReviewUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 transition-colors hover:text-[#E6007E] ${chip}`}
        aria-label={`Read our Google reviews — ${formatGoogleReviewBadge(trust)}`}
      >
        <StarRow className="text-[#E6007E]" />
        <span className="font-semibold">{formatGoogleReviewBadge(trust)}</span>
      </a>
      <span className={`inline-flex items-center gap-2 ${chip}`}>
        <StarRow className={isDark ? "text-[#FFD86B]" : "text-[#E6007E]"} />
        <span className="font-semibold">{formatFreshaReviewBadge(trust)}</span>
        <span className={isDark ? "text-white/50" : "text-black/45"}>· booking platform</span>
      </span>
    </div>
  );
}
