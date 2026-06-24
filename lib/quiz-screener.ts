/** Shared types for readiness screeners (/quiz/*-readiness). */

export type ScreenerQuizStep = {
  id: string;
  question: string;
  subtitle?: string;
  options: { id: string; label: string; icon: string }[];
};

export type ScreenerQuizResult = {
  tier: "strong" | "review" | "not_eligible";
  title: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export type ScreenerAnswers = Record<string, string>;

export const SCREENER_DEFAULT_DISCLAIMER =
  "Educational screener only — not medical advice or a guarantee of treatment. A licensed NP must evaluate your full history, labs, and goals before any prescription or hormone protocol.";
