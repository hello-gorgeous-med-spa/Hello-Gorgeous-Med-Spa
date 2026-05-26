/** Brow PMU / microblading — SEO copy, portfolio asset, and technique terms (Oswego + west suburbs). */

export const BROW_PMU_OSWEGO_PATH = "/microblading-brow-pmu-oswego-il" as const;

/** Four-technique before & after collage — Danielle Alcala / Hello Gorgeous (client consent on file). */
export const BROW_PMU_PORTFOLIO_BEFORE_AFTER = {
  src: "/images/brow/danielle-alcala-brow-pmu-portfolio-before-after.png",
  alt:
    "Microblading hair stroke, powder brows, combo brows, and nano brows before and after by Danielle Alcala at Hello Gorgeous Med Spa Oswego IL — permanent makeup eyebrow portfolio",
  title: "Brow PMU — My Work",
  caption:
    "Real client transformations: microblading (hair stroke), powder / ombré brows, combo (hybrid) brows, and nano brows — performed at our medically supervised Oswego studio.",
  artist: "Danielle Alcala",
  business: "Hello Gorgeous Med Spa",
} as const;

/** Natural light stroke / hair-stroke microblading — split before & after (client consent on file). */
export const NATURAL_LIGHT_STROKE_BROWS_BEFORE_AFTER = {
  src: "/images/brow/natural-light-stroke-brows-before-after-danielle-alcala.png",
  alt:
    "Natural light stroke brows before and after microblading hair strokes by Danielle Alcala at Hello Gorgeous Med Spa Oswego IL Naperville Aurora",
  title: "Natural Light Stroke Brows",
  caption:
    "Fine hair-like microblading strokes for soft, feathery fullness — natural arch and definition by Danielle Alcala.",
  artist: "Danielle Alcala",
  business: "Hello Gorgeous Med Spa",
} as const;

/** Natural light stroke — vertical before/after with technique title (client consent on file). */
export const NATURAL_LIGHT_STROKE_VERTICAL_BEFORE_AFTER = {
  src: "/images/brow/natural-light-stroke-brows-vertical-before-after-danielle-alcala.png",
  alt:
    "Natural light stroke brows before and after hand-stroke microblading by Danielle Alcala at Hello Gorgeous Med Spa Oswego IL",
  title: "Natural Light Stroke Brows",
  caption:
    "Hand-stroke microblading for soft, realistic hair strokes — fuller shape with a natural arch.",
} as const;

/** Powder / nano ombré brows — fair skin, light hair (client consent on file). */
export const POWDER_NANO_BROWS_BEFORE_AFTER = {
  src: "/images/brow/powder-nano-brows-before-after-danielle-alcala.png",
  alt:
    "Powder and nano brow PMU before and after ombré shading by Danielle Alcala at Hello Gorgeous Med Spa Oswego IL",
  title: "Powder & Nano Brows",
  caption:
    "Soft ombré powder shading with defined tail — ideal when natural brow hair is very light or sparse.",
} as const;

/** All brow before/after assets for gallery grids and SEO loops. */
export const BROW_PMU_BEFORE_AFTER_SET = [
  BROW_PMU_PORTFOLIO_BEFORE_AFTER,
  NATURAL_LIGHT_STROKE_BROWS_BEFORE_AFTER,
  NATURAL_LIGHT_STROKE_VERTICAL_BEFORE_AFTER,
  POWDER_NANO_BROWS_BEFORE_AFTER,
] as const;

export const BROW_PMU_TECHNIQUES = [
  {
    id: "microblading",
    name: "Microblading (Hair Stroke)",
    short: "Fine hair-like strokes for a soft, feathery brow — including natural light stroke technique.",
    seoTerms: ["microblading Oswego", "natural light stroke brows", "hair stroke brows", "feather brows PMU"],
  },
  {
    id: "powder-brows",
    name: "Powder Brows",
    short: "Ombré shading for a filled-in, makeup-soft finish.",
    seoTerms: ["powder brows Oswego", "ombré brows", "shaded brow PMU"],
  },
  {
    id: "combo-brows",
    name: "Combo Brows",
    short: "Hair strokes at the front plus powder density through the body and tail.",
    seoTerms: ["combo brows", "hybrid brows Oswego", "combo brow PMU"],
  },
  {
    id: "nano-brows",
    name: "Nano Brows",
    short: "Ultra-fine nano strokes for crisp, hyper-realistic definition.",
    seoTerms: ["nano brows Oswego", "nano stroke brows", "machine hair strokes"],
  },
] as const;

export const BROW_PMU_SEO_KEYWORDS = [
  "microblading near me",
  "microblading Oswego IL",
  "brow PMU Oswego",
  "permanent makeup eyebrows Oswego",
  "powder brows Naperville",
  "combo brows Aurora IL",
  "nano brows Plainfield",
  "eyebrow tattoo med spa",
  "Danielle Alcala brow artist",
  "Hello Gorgeous Med Spa brows",
  "before and after microblading",
  "natural light stroke brows",
  "hair stroke microblading Oswego",
  "feather brows permanent makeup",
  "permanent makeup Kendall County",
] as const;

export const BROW_PMU_FAQS = [
  {
    question: "Where can I get microblading and brow PMU in Oswego, IL?",
    answer:
      "Hello Gorgeous Med Spa offers microblading, powder brows, combo (hybrid) brows, and nano brows at 74 W Washington St, Oswego, IL 60543 — serving Naperville, Aurora, Plainfield, Yorkville, and Kendall County. Brow services are performed by Danielle Alcala under our medically supervised practice.",
  },
  {
    question: "What is the difference between microblading, powder brows, combo, and nano brows?",
    answer:
      "Microblading uses hair-stroke technique for a soft, feathery look. Powder brows use ombré shading for a filled-in makeup effect. Combo brows blend hair strokes at the front with powder density through the arch and tail. Nano brows use an ultra-fine machine needle for crisp, realistic strokes — ideal when you want maximum definition.",
  },
  {
    question: "Are brow PMU results at Hello Gorgeous medically supervised?",
    answer:
      "Yes. We screen you like a medical practice, because we are one. A board-certified Nurse Practitioner oversees our studio, so numbing, sanitation, and health screening meet clinical standards — not just cosmetic tattoo-shop norms.",
  },
  {
    question: "How do I book a brow consultation?",
    answer:
      "Complete our digital brow intake at hellogorgeousmedspa.com/forms/brow-intake, review Your Brow Journey guide, and call (630) 636-6193 or book online. We'll map your brows, discuss technique options, and plan healing and touch-ups.",
  },
] as const;
