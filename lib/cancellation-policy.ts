/**
 * Canonical public cancellation / no-show / late policy — /cancellation-policy
 */

export const CANCELLATION_POLICY_PATH = "/cancellation-policy" as const;
export const CANCELLATION_POLICY_UPDATED = "July 12, 2026" as const;

export const CANCELLATION_POLICY = {
  noticeHoursStandard: 24,
  noticeHoursAdvanced: 48,
  lateGraceMinutes: 15,
  /** Late cancel: greater of flat fee or % of service */
  lateCancelFeeUsd: 50,
  lateCancelFeePercent: 50,
  /** No-show: greater of flat fee or % of service */
  noShowFeeUsd: 100,
  noShowFeePercent: 100,
  depositUsd: 50,
  phoneDisplay: "(630) 636-6193",
  phoneHref: "tel:6306366193",
  advancedServiceExamples: "CO₂, Morpheus8 / RF, and other longer bookings",
} as const;

export const CANCELLATION_POLICY_HTML_PATH =
  "/policies/HG_Cancellation_NoShow_Policy.html" as const;
export const CANCELLATION_POLICY_DOCX_PATH =
  "/policies/HelloGorgeous-CancellationPolicy.docx" as const;
