import Link from "next/link";

import {
  CLINICAL_REVIEW_COPY,
  CLINICAL_REVIEW_DATE,
  MEDICAL_DIRECTOR,
  MEDICAL_DIRECTOR_SPECIALTY,
  NP_ON_SITE_PHRASE,
  PRESCRIBING_NP,
  formatReviewMonth,
} from "@/lib/medical-authority";

type Props = {
  /** ISO date (YYYY-MM-DD) the page's clinical content was last reviewed. */
  reviewDate?: string;
  /** Single-line treatment for dense surfaces like product pages. */
  compact?: boolean;
  /** Dark surfaces (RX product hero, dark hubs) invert the palette. */
  surface?: "light" | "dark";
  className?: string;
};

/**
 * Clinical review byline — the credential line that closes clinical content.
 *
 * All names, roles, and links come from `lib/medical-authority`, so this reads as
 * a credential rather than a claim, and it can never drift from the provider pages
 * it links to. Render it once per page, and not on pages that already carry
 * `MedicalTrustBand` (which makes the same point at full width).
 */
export function ClinicalReview({
  reviewDate = CLINICAL_REVIEW_DATE,
  compact = false,
  surface = "light",
  className = "",
}: Props) {
  const reviewedLabel = formatReviewMonth(reviewDate);
  const dark = surface === "dark";

  const reviewerLink = (
    <Link
      href={PRESCRIBING_NP.profilePath}
      className={`font-bold underline decoration-2 underline-offset-2 ${
        dark ? "text-[#FFB8DC] decoration-[#FF2D8E] hover:text-white" : "text-[#E6007E] decoration-[#E6007E] hover:text-black"
      }`}
    >
      {PRESCRIBING_NP.displayName}
    </Link>
  );

  const directorLink = (
    <Link
      href={MEDICAL_DIRECTOR.profilePath}
      className={`font-bold underline decoration-2 underline-offset-2 ${
        dark ? "text-[#FFB8DC] decoration-[#FF2D8E] hover:text-white" : "text-[#E6007E] decoration-[#E6007E] hover:text-black"
      }`}
    >
      {MEDICAL_DIRECTOR.displayName}
    </Link>
  );

  if (compact) {
    return (
      <aside
        aria-label="Clinical review"
        className={`rounded-2xl border-2 ${
          dark ? "border-white/15 bg-white/5 text-white/75" : "border-black bg-white text-black/75"
        } px-4 py-3 text-xs leading-relaxed ${className}`}
      >
        <p>
          {CLINICAL_REVIEW_COPY.reviewerLabel} {reviewerLink} — {CLINICAL_REVIEW_COPY.reviewerCredentialLine}.{" "}
          {CLINICAL_REVIEW_COPY.oversightLabel}: {directorLink}, {MEDICAL_DIRECTOR_SPECIALTY}.
          {reviewedLabel ? ` Last reviewed ${reviewedLabel}.` : ""}
        </p>
      </aside>
    );
  }

  return (
    <aside
      aria-label="Clinical review"
      className={`rounded-3xl border-4 ${
        dark
          ? "border-white/20 bg-white/[0.04]"
          : "border-black bg-white shadow-[8px_8px_0_0_rgba(230,0,126,0.35)]"
      } p-5 sm:p-6 ${className}`}
    >
      <p
        className={`text-[10px] font-bold uppercase tracking-[0.25em] ${
          dark ? "text-[#FFB8DC]" : "text-[#E6007E]"
        }`}
      >
        Clinical review
      </p>
      <p
        className={`mt-3 text-sm leading-relaxed sm:text-base ${
          dark ? "text-white/80" : "text-black/80"
        }`}
      >
        {CLINICAL_REVIEW_COPY.reviewerLabel} {reviewerLink} — {CLINICAL_REVIEW_COPY.reviewerCredentialLine},{" "}
        {NP_ON_SITE_PHRASE} in Oswego. {CLINICAL_REVIEW_COPY.oversightLabel}: {directorLink},{" "}
        {MEDICAL_DIRECTOR_SPECIALTY}.
      </p>
      <p
        className={`mt-3 text-xs font-medium ${dark ? "text-white/50" : "text-black/50"}`}
      >
        {reviewedLabel ? <>Last reviewed {reviewedLabel}. </>: null}
        {CLINICAL_REVIEW_COPY.disclaimer}
      </p>
    </aside>
  );
}
