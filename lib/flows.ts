import type { PersonaId } from "@/lib/personas/types";

/**
 * Booking page — all "Book" / "Book Now" links. Default: first-party /book.
 * Override with NEXT_PUBLIC_BOOKING_URL if needed (e.g. full URL).
 * This system is the canonical source for new appointments. External systems (e.g. Fresha) are not live-integrated.
 */
export const BOOKING_URL =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_BOOKING_URL) || "/book";

/** Reviews page URL — "See our reviews" / "Leave a review" links and QR. Default: first-party /reviews. Set NEXT_PUBLIC_REVIEWS_URL for absolute URL (e.g. for QR codes). */
export const REVIEWS_URL =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_REVIEWS_URL) || "/reviews";

/** @deprecated Use REVIEWS_URL. Kept for compatibility. */
export const FRESHA_REVIEWS_URL = REVIEWS_URL;

/** Hello Gorgeous Fullscript dispensary (supplements). Used by Peppi CTA and sections. */
export const FULLSCRIPT_DISPENSARY_URL = "https://us.fullscript.com/welcome/dglazier";

export type CareModuleId =
  | "education"
  | "preconsult"
  | "booking"
  | "postcare"
  | "confidence-check"
  | "ask-before-book"
  | "normal-checker"
  | "timeline-simulator"
  | "beauty-roadmap";

export type PreConsultAnswer = {
  goals: string;
  experienceLevel: "first-time" | "returning" | "pro" | "unsure";
  timeframe: "asap" | "2-4weeks" | "1-3months" | "just-researching";
  concerns: string;
};

export const PRECONSULT_DEFAULTS: PreConsultAnswer = {
  goals: "",
  experienceLevel: "unsure",
  timeframe: "just-researching",
  concerns: "",
};

export function suggestPersonaForServiceSlug(slug: string): PersonaId {
  const s = slug.toLowerCase();
  if (s.includes("botox") || s.includes("dysport") || s.includes("jeuveau")) return "beau-tox";
  if (s.includes("filler")) return "filla-grace";
  if (s.includes("hormone") || s.includes("trt") || s.includes("peptide")) return "ryan";
  if (s.includes("weight")) return "ryan";
  return "peppi";
}

export function suggestServiceSlugsFromPreConsult(a: PreConsultAnswer): string[] {
  const text = `${a.goals} ${a.concerns}`.toLowerCase();
  const slugs = new Set<string>();

  // Very conservative heuristic suggestions (non-binding).
  if (/(wrinkle|lines|forehead|11s|crow)/i.test(text)) slugs.add("botox-dysport-jeuveau");
  if (/(lip|volume|cheek|jaw|chin|balance)/i.test(text)) slugs.add("dermal-fillers");
  if (/(lip filler)/i.test(text)) slugs.add("lip-filler");
  if (/(weight|glp|ozempic|semag|tirzep)/i.test(text)) slugs.add("weight-loss-therapy");
  if (/(hormone|trt|menopause|testosterone|low t)/i.test(text)) slugs.add("biote-hormone-therapy");
  if (/(microneed|texture|pores|scar|acne)/i.test(text)) slugs.add("rf-microneedling");
  if (/(energy|hydration|iv)/i.test(text)) slugs.add("iv-therapy");

  // Always provide at least one reasonable entry point.
  if (slugs.size === 0) slugs.add("botox-dysport-jeuveau");

  return Array.from(slugs).slice(0, 4);
}

