/**
 * /gentlemens-club/testosterone — visual TRT funnel (Fridays-style layout, Gentlemen's Club pricing).
 * Single source: reuses lib/gentlemens-club.ts — do not invent new TRT prices here.
 */

import { PROGRAM_CONSULT_BOOKING_URL } from "@/lib/flows";
import {
  GENTLEMENS_CLUB_FAQS,
  GENTLEMENS_CLUB_HORMONE_ADD_ONS,
  GENTLEMENS_CLUB_HORMONES_IMAGE,
  GENTLEMENS_CLUB_PATH,
  GENTLEMENS_CLUB_TIERS,
  GENTLEMENS_CLUB_TRT_APPROACH_1,
  GENTLEMENS_CLUB_TRT_APPROACH_2,
  GENTLEMENS_CLUB_TRT_INCLUDED,
  GENTLEMENS_CLUB_TRT_QUICK_FACTS,
} from "@/lib/gentlemens-club";

export const GENTLEMENS_CLUB_TESTOSTERONE_PATH = `${GENTLEMENS_CLUB_PATH}/testosterone` as const;

export const GC_TRT_HERO = {
  eyebrow: "The Gentlemen's Club · Men's TRT",
  headline: "Boost.",
  headlineMid: "Your.",
  headlineAccent: "Testosterone.",
  subhead:
    "Lab-guided TRT in Oswego — injections, BioTE pellets, or cream. Ryan Kent, FNP-BC on site 7 days a week. Not telehealth-only — real relationship, real monitoring.",
} as const;

export type SymptomTransform = {
  before: string;
  after: string;
};

export const GC_TRT_SYMPTOM_TRANSFORMS: SymptomTransform[] = [
  { before: "Always tired", after: "All-day energy" },
  { before: "Losing strength", after: "Stronger than ever" },
  { before: "Low desire", after: "Confidence back" },
  { before: "Foggy focus", after: "Sharp mind" },
  { before: "Irritable", after: "Steady mood" },
];

export type GcTrtTreatmentOption = {
  id: string;
  name: string;
  badge?: string;
  bullets: string[];
  fromMonthlyUsd?: number;
  priceLabel?: string;
  priceNote: string;
  image: string;
  imageAlt: string;
  learnHref?: string;
};

/** Pricing matches Gentlemen's Club FAQ & quick facts — not Fridays tiers. */
export const GC_TRT_TREATMENT_OPTIONS: GcTrtTreatmentOption[] = [
  {
    id: "injectable-trt",
    name: "Injectable TRT",
    badge: "Most popular",
    bullets: [
      "Weekly self-injection at home after training",
      "Supports strength, focus & drive",
      "All-inclusive program pricing",
    ],
    fromMonthlyUsd: 200,
    priceNote: "Typically $200–350/mo all-inclusive · dose-dependent",
    image: GENTLEMENS_CLUB_HORMONES_IMAGE,
    imageAlt: "Injectable testosterone TRT — Hello Gorgeous Gentlemen's Club Oswego IL",
  },
  {
    id: "topical-trt",
    name: "Topical testosterone",
    bullets: ["Daily cream protocol", "Alternative when injections aren't ideal", "NP titrated to labs"],
    priceLabel: "From $150/mo",
    priceNote: "Topical programs typically $150–300/mo",
    image: GENTLEMENS_CLUB_HORMONES_IMAGE,
    imageAlt: "Topical testosterone cream TRT — Hello Gorgeous Oswego IL",
  },
  {
    id: "enclomiphene",
    name: "Enclomiphene",
    bullets: [
      "Stimulates your body's own testosterone",
      "Fertility-friendly alternative to TRT",
      "Oral daily capsule when appropriate",
    ],
    fromMonthlyUsd: 275,
    priceNote: "Add-on or standalone protocol · NP evaluation required",
    image: "/images/gentlemens-club/add-ons/enclomiphene.png",
    imageAlt: "Enclomiphene for men's testosterone — Hello Gorgeous Med Spa Oswego IL",
    learnHref: "/blog/hello-gorgeous-rx-hormone-enclomiphene-citrate",
  },
];

export const GC_TRT_BIOTE_NOTE =
  "BioTE® pellet therapy: $750–1,200 per insertion every 4–6 months — in-office procedure with sustained release.";

export const GC_TRT_TRUST_PILLS = [
  "Transparent pricing at consult",
  "Baseline labs ~$250–450",
  "In-person Oswego care",
  "HSA / FSA receipts",
] as const;

export type GcTrtJourneyStep = {
  when: string;
  title: string;
  body: string;
};

export const GC_TRT_JOURNEY_STEPS: GcTrtJourneyStep[] = [
  {
    when: "Today",
    title: "Screener or $49 consult",
    body: "Take the 2-minute TRT Readiness Screener or book your NP consult on Fresha — same team, correct visit type.",
  },
  {
    when: "Before start",
    title: "Baseline labs",
    body: "Comprehensive hormone panel at Quest or Access Labs — total & free testosterone, SHBG, thyroid & more. ~$250–450.",
  },
  {
    when: "Visit",
    title: "Consult with Ryan Kent, FNP-BC",
    body: "Review symptoms, labs, fertility goals, and delivery options — injections, cream, pellets, or enclomiphene when appropriate.",
  },
  {
    when: "Week 1+",
    title: "Your custom protocol",
    body: "Start TRT or optimization plan with training, follow-up labs at 6–8 weeks, then quarterly monitoring.",
  },
];

export type GcTrtResultsPhase = {
  when: string;
  title: string;
  body: string;
};

export const GC_TRT_RESULTS_PHASES: GcTrtResultsPhase[] = [
  {
    when: "Weeks 3–6",
    title: "Energy, mood & focus",
    body: "Many men notice improved energy and mental clarity first — individual response varies.",
  },
  {
    when: "Months 2–3",
    title: "Libido & performance",
    body: "Desire and sexual function often improve as levels stabilize with monitoring.",
  },
  {
    when: "Months 3–6",
    title: "Body composition & strength",
    body: "Lean mass, recovery, and sustained drive with consistent protocol and lifestyle support.",
  },
];

export const GC_TRT_EDGE_BENEFITS = [
  {
    title: "Improve energy",
    body: "Restore natural vitality — reduce fatigue and power through your day when clinically optimized.",
  },
  {
    title: "Stronger body",
    body: "Support lean muscle and strength alongside training — monitored, not bro-science.",
  },
  {
    title: "Better libido",
    body: "Reignite desire and confidence — with fertility implications discussed upfront.",
  },
] as const;

export const GC_TRT_EXPERT_CARE = [
  "Licensed NP oversight — Ryan Kent, FNP-BC",
  "Evidence-based protocols & lab monitoring",
  "Ongoing dose adjustments",
  "In-person Oswego — not algorithm-only telehealth",
] as const;

export const GC_TRT_FAQS = GENTLEMENS_CLUB_FAQS.filter((faq) =>
  /TRT|testosterone|fertility|cost|hormone/i.test(faq.question),
);

export const GC_TRT_CTA = {
  screener: { label: "Take TRT screener", href: "/quiz/trt-readiness" },
  consult: { label: "Book $49 consult", href: PROGRAM_CONSULT_BOOKING_URL },
  club: { label: "Gentlemen's Club", href: GENTLEMENS_CLUB_PATH },
  membershipFrom: GENTLEMENS_CLUB_TIERS[0]?.pricePerMonth ?? 99,
} as const;

export const GC_TRT_DISCLAIMER =
  "Medications prescribed only when clinically appropriate after evaluation. Compounded products prepared by licensed pharmacies. Individual results vary. Not available outside Illinois service area.";

export { GENTLEMENS_CLUB_TRT_INCLUDED, GENTLEMENS_CLUB_TRT_QUICK_FACTS, GENTLEMENS_CLUB_HORMONE_ADD_ONS };
