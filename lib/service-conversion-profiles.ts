/** Phase 3 conversion template — priority Oswego service landings. */

export type ServiceConversionProfile = {
  helpsWith: string[];
  idealFor: string[];
  downtime: string;
  treatmentPlan: string;
  pricingNote: string;
};

export const PRIORITY_CONVERSION_SLUGS = [
  "botox-oswego",
  "lip-filler-oswego",
  "morpheus8-burst-oswego",
  "solaria-co2-oswego",
  "quantum-rf-oswego",
  "glp-1-weight-loss-oswego",
  "biote-hormone-therapy-oswego",
] as const;

export type PriorityConversionSlug = (typeof PRIORITY_CONVERSION_SLUGS)[number];

export const SERVICE_CONVERSION_PROFILES: Record<PriorityConversionSlug, ServiceConversionProfile> = {
  "botox-oswego": {
    helpsWith: [
      "Forehead lines, frown lines (11s), and crow's feet",
      "Expression lines that deepen when you move",
      "Lip flip, gummy smile, and masseter (jaw slimming)",
      "Preventive wrinkle management for younger clients",
    ],
    idealFor: [
      "Healthy adults who want a refreshed look — not a different face",
      "First-time neurotoxin clients who want honest unit counts",
      "Clients comparing Botox, Dysport, or Jeuveau options",
      "Anyone who values NP oversight and published as-low-as $9/unit pricing",
    ],
    downtime: "None for most clients — tiny pinpoints may last a few hours. Avoid workout, lying flat, and rubbing for 4 hours.",
    treatmentPlan: "Single visit · results in 3–14 days · typically every 3–4 months (20–40 units for upper face is common).",
    pricingNote: "As low as $9/unit Botox — Allergan & US distributors only. Exact units quoted at your free consultation before we inject.",
  },
  "lip-filler-oswego": {
    helpsWith: [
      "Thin or uneven lips, loss of definition at the vermillion border",
      "Cupid's bow shaping and subtle volume enhancement",
      "Hydration and softness for dry or aging lips",
      "Asymmetry between upper and lower lips",
    ],
    idealFor: [
      "Clients who want natural lips — not an overfilled look",
      "First-time filler clients starting with a half or full syringe",
      "Brides and event clients planning 3–4 weeks ahead",
      "Anyone nervous about 'duck lips' who wants conservative dosing",
    ],
    downtime: "Swelling 24–72 hours (lips look fuller than final result at first). Bruising possible — plan events accordingly.",
    treatmentPlan: "One visit · assess at 2 weeks · maintenance every 9–15 months (1 syringe typical to start).",
    pricingNote: "$450 per syringe · $399 each when you book 2 — confirmed at consult.",
  },
  "morpheus8-burst-oswego": {
    helpsWith: [
      "Skin laxity, jowls, neck crepeiness, and early sagging",
      "Acne scars, stretch marks, enlarged pores, and uneven texture",
      "Mild to moderate wrinkles when collagen — not filler — is the answer",
      "Face, neck, and select body areas in one InMode platform",
    ],
    idealFor: [
      "Clients who want tightening without surgery or long CO₂ downtime",
      "Acne-scar and texture concerns across skin tones (energy below pigment)",
      "Those building a Trifecta plan with Solaria or Quantum RF",
      "Anyone ready for a series — not a one-and-done miracle",
    ],
    downtime: "2–3 days social downtime — redness and pinpoint dots fade in 24–48 hours for most.",
    treatmentPlan: "Series of 3 treatments · 4–6 weeks apart · collagen rebuilds for 3–6 months after.",
    pricingNote: "Treatments start at $799/session · packages quoted at your free consultation.",
  },
  "solaria-co2-oswego": {
    helpsWith: [
      "Sun damage, deep lines, acne scars, and enlarged pores",
      "Uneven tone, dullness, and texture that skincare can't fix",
      "Perioral lines, crow's feet, and aging skin on face, neck, or hands",
      "Dramatic resurfacing when microneedling isn't enough",
    ],
    idealFor: [
      "Clients who can plan 5–7 days of visible healing",
      "Fitzpatrick I–IV skin tones (we assess candidacy honestly)",
      "Those wanting one powerful session vs. endless light treatments",
      "Trifecta clients pairing surface resurfacing with Morpheus8",
    ],
    downtime: "5–7 days — skin sloughs, then pink new skin emerges. Full post-care kit and day-14 check-in included.",
    treatmentPlan: "Often 1 session for strong results · aggressive cases may need 2–3 spaced 3–4 months apart.",
    pricingNote: "$899 with buy-one-get-one-free area — depth confirmed at consult.",
  },
  "quantum-rf-oswego": {
    helpsWith: [
      "Neck laxity, submental fullness, and jawline definition",
      "Abdominal skin laxity and contour after weight change",
      "Fat reduction with simultaneous skin tightening — no surgery",
      "Body areas where Morpheus8 alone isn't the right tool",
    ],
    idealFor: [
      "Clients with realistic body goals — not a substitute for weight loss",
      "Neck and abdomen candidates who want surgical-level results without OR time",
      "Those qualifying for launch packages with FREE Morpheus8 Burst",
      "Anyone who prefers local anesthesia only — no general anesthesia",
    ],
    downtime: "Mild swelling and soreness 3–7 days · most return to normal activities within a week.",
    treatmentPlan: "1–2 treatments per area · results build up to 6 months · packages include Morpheus8 Burst bonus.",
    pricingNote: "Neck $2,499 · Abdomen $3,999 — financing available · consult required.",
  },
  "glp-1-weight-loss-oswego": {
    helpsWith: [
      "Stubborn weight despite diet and exercise",
      "Constant hunger, food noise, and portion control struggles",
      "Metabolic reset with medical oversight — not a diet pill",
      "Semaglutide or tirzepatide paths under NP supervision",
    ],
    idealFor: [
      "Adults with BMI and health history appropriate for GLP-1 therapy",
      "Clients who want monthly check-ins — not mail-order alone",
      "Those ready for weekly injections and lifestyle partnership",
      "Anyone who wants honest candidacy screening before paying",
    ],
    downtime: "No downtime — mild nausea possible early as dose titrates (we manage it).",
    treatmentPlan: "Weekly self-injection · monthly NP visits · typical programs run 6–12+ months with maintenance planning.",
    pricingNote: "Programs from $195/month (lowest injectable GLP-1 dose) — intake & labs quoted separately.",
  },
  "biote-hormone-therapy-oswego": {
    helpsWith: [
      "Low energy, brain fog, poor sleep, and mood changes",
      "Low libido, weight gain, and muscle loss in menopause or andropause",
      "Hot flashes, night sweats, and hormone-related fatigue",
      "Testosterone or estrogen optimization when labs support it",
    ],
    idealFor: [
      "Men and women with symptoms that match lab findings",
      "Clients frustrated with 'normal' labs but not normal quality of life",
      "Those who want pellet therapy with in-person follow-up",
      "Anyone seeking NP-directed hormone care — not a telehealth-only script",
    ],
    downtime: "Minimal — small insertion site for pellets; avoid heavy lower-body exercise 48 hours.",
    treatmentPlan: "Pellets every 3–6 months depending on metabolism · labs at baseline and follow-up.",
    pricingNote: "Consult and labs quoted upfront — treatment plan customized to your levels.",
  },
};

export function getServiceConversionProfile(slug: string): ServiceConversionProfile | null {
  if (slug in SERVICE_CONVERSION_PROFILES) {
    return SERVICE_CONVERSION_PROFILES[slug as PriorityConversionSlug];
  }
  return null;
}

export function slugFromMenuPath(path: string): string {
  return path.replace(/^\//, "");
}
