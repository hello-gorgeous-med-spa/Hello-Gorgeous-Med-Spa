import type { InModeTreatmentAreaCard } from "@/lib/inmode-treatment-landing";

/** Shared “areas we treat” cards for Botox / Dysport / Jeuveau landings. */
export const NEUROTOXIN_AREA_CARDS: InModeTreatmentAreaCard[] = [
  {
    title: "Forehead lines",
    blurb: "Gently soften horizontal forehead lines for a calmer, smoother look.",
  },
  {
    title: "Frown lines (11s)",
    blurb: "Relax the lines between the brows for a more rested expression.",
  },
  {
    title: "Crow’s feet",
    blurb: "Soften fine lines at the outer corners of the eyes.",
  },
  {
    title: "Bunny lines",
    blurb: "Soften nose lines from smiling or scrunching.",
  },
  {
    title: "Lip flip & smoker’s lines",
    blurb: "Subtle upper-lip show or smoother vertical lip lines when appropriate.",
    href: "/lip-flip-oswego-il",
  },
  {
    title: "Masseter & jawline",
    blurb: "Slim and contour a bulky jaw when clinically appropriate.",
    href: "/masseter-botox-oswego-il",
  },
  {
    title: "Chin & DAO",
    blurb: "Smooth chin dimpling and soften downturned mouth corners.",
  },
  {
    title: "Neck bands",
    blurb: "Soften platysmal bands for a firmer-looking neck.",
  },
  {
    title: "Men’s toxin (Brotox)",
    blurb: "Subtle smoothing tailored to male facial structure and stronger muscles.",
    href: "/brotox",
  },
];

export const NEUROTOXIN_TRUST = [
  "NP-directed medical clinic",
  "Natural, never frozen",
  "Day-14 touch-up window",
  "Same-day often available",
] as const;
