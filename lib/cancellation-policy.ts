/**
 * Canonical public cancellation / no-show / late policy — /cancellation-policy
 * Fee amounts match the published client-facing policy (not draft TBD placeholders).
 */

export const CANCELLATION_POLICY_PATH = "/cancellation-policy" as const;
export const CANCELLATION_POLICY_UPDATED = "July 12, 2026" as const;

export const CANCELLATION_POLICY = {
  noticeHoursStandard: 24,
  lateGraceMinutes: 15,
  lateCancelFeeUsd: 50,
  noShowFeeUsd: 50,
  depositUsd: 50,
  phoneDisplay: "(630) 636-6193",
  phoneHref: "tel:6306366193",
} as const;

export const CANCELLATION_POLICY_HTML_PATH =
  "/policies/HG_Cancellation_NoShow_Policy.html" as const;
export const CANCELLATION_POLICY_DOCX_PATH =
  "/policies/HelloGorgeous-CancellationPolicy.docx" as const;
