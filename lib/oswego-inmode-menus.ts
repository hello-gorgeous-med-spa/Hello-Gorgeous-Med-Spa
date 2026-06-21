import { buildOswegoMenu } from "@/lib/oswego-injectable-menus";

const INMODE_SECONDARY = { label: "InMode Trifecta packages", href: "/specials" };

export const MORPHEUS8_BURST_OSWEGO_MENU = buildOswegoMenu("morpheus8-burst-oswego", {
  eyebrow: "Oswego, IL · Verified InMode Provider",
  titleBefore: "Morpheus8 Burst in Oswego, IL —",
  titleAccent: "From $850/session",
  secondaryCta: INMODE_SECONDARY,
  pricingTitle: "Morpheus8 Burst pricing",
  pricingHighlights: [
    "Face sessions from $850 — larger areas priced higher",
    "Series of 3 typical · 4–6 weeks apart",
    "Package pricing brings per-session cost down",
    "Customizable depth 0.5mm–7mm — face, neck & body",
    "Safe for all skin tones — energy delivered below pigment layer",
  ],
  pricingRows: [
    { label: "Morpheus8 Burst — face", price: "From $850", note: "Per session" },
    { label: "Face + neck / body areas", price: "Consult", note: "Quoted by area at consult" },
    { label: "Series of 3 package", price: "Consult", note: "Meaningful per-session savings" },
    { label: "InMode Trifecta packages", price: "Specials →", href: "/specials" },
  ],
  pricingBadge: "INMODE",
  howItWorksHighlights: [
    "Microneedling + RF energy in one pass",
    "Pulsed 'Burst' delivery — deeper results, less downtime",
    "Laxity · acne scars · stretch marks · jowls · neck",
    "Collagen rebuilds for 3–6 months after treatment",
    "Remodels deep tissue — not just surface resurfacing",
  ],
  howItWorksLinks: [
    { label: "Solaria CO₂ — surface resurfacing partner", price: "Compare →", href: "/solaria-co2-oswego" },
    { label: "Quantum RF — fat layer & body contouring", price: "Compare →", href: "/quantum-rf-oswego" },
  ],
  howItWorksLearnMore: "/services/microneedling",
  careGuideHref: "/pre-post-care/morpheus8-burst",
  treatmentTime: "30–60 min",
  whatToExpectDescription:
    "Free consult, generous topical numbing for 45–60 minutes, treatment in sections with breaks as needed, then a written recovery plan and check-ins while you heal.",
  whyRows: [
    { label: "Free consultation", price: "Always", note: "Honest fit assessment — sometimes Solaria is the answer" },
    { label: "2-week check-in", price: "Included", note: "Recovery reviewed against plan" },
    { label: "Social downtime", price: "2–3 days", note: "Redness & pinpoint dots fade in 24–48h" },
  ],
  relatedDescription:
    "The InMode Trifecta — Morpheus8 Burst remodels deep tissue, Solaria CO₂ resurfaces, Quantum RF contours the fat layer. Many clients combine them.",
  relatedHighlights: [
    "Solaria CO₂ for tone, sun damage & surface scars",
    "Quantum RF when fat reduction is the goal",
    "Classic microneedling for lighter texture work",
    "Trifecta packages on the specials menu",
  ],
});

export const SOLARIA_CO2_OSWEGO_MENU = buildOswegoMenu("solaria-co2-oswego", {
  eyebrow: "Oswego, IL · Only Solaria CO₂ in the western suburbs",
  titleBefore: "Solaria CO₂ Laser in Oswego, IL —",
  titleAccent: "From $1,200/session",
  secondaryCta: INMODE_SECONDARY,
  pricingTitle: "Solaria CO₂ pricing",
  pricingHighlights: [
    "From $1,200 per session — varies by area & depth",
    "Most clients see ideal results from a single session",
    "Deeper resurfacing may benefit from 2–3 sessions",
    "Face, neck, décolleté & hands addressable",
    "Exact pricing at your free consultation — no upsells",
  ],
  pricingRows: [
    { label: "Solaria CO₂ — single session", price: "From $1,200", note: "Area & depth dependent" },
    { label: "Series of 2–3 (aggressive resurfacing)", price: "Consult", note: "Spaced 3–4 months apart" },
    { label: "InMode Trifecta packages", price: "Specials →", href: "/specials" },
  ],
  pricingBadge: "EXCLUSIVE",
  howItWorksHighlights: [
    "Fractional CO₂ — controlled microcolumns of laser energy",
    "Surface skin sloughs over 5–7 days, new skin underneath",
    "Sun damage · deep lines · acne scars · stretch marks · pores · tone",
    "Collagen remodeling continues up to 6 months",
    "Dramatically shorter downtime than old full-field CO₂",
  ],
  howItWorksLinks: [
    { label: "Morpheus8 Burst — deep remodeling partner", price: "Compare →", href: "/morpheus8-burst-oswego" },
    { label: "Chemical peels for lighter resurfacing", price: "Menu →", href: "/services/facials-and-peels" },
  ],
  howItWorksLearnMore: "/services/facials-and-peels",
  careGuideHref: "/pre-post-care/solaria-co2",
  treatmentTime: "20–45 min",
  whatToExpectDescription:
    "Free consult, 30–45 minutes of topical numbing, a 20–45 minute treatment, then a complete post-care kit and a complimentary day-14 check-in while collagen rebuilds.",
  whyRows: [
    { label: "Free consultation", price: "Always", note: "We never recommend a treatment you don't need" },
    { label: "Day-14 check-in", price: "Included", note: "Healing reviewed · plan adjusted" },
    { label: "Social downtime", price: "5–7 days", note: "Full post-care kit sent home with you" },
  ],
  relatedDescription:
    "Solaria resurfaces the surface; Morpheus8 Burst remodels beneath it. Together they're the most complete skin overhaul in the western suburbs.",
  relatedHighlights: [
    "Morpheus8 Burst for laxity & deep texture",
    "Body stretch marks & postpartum skin refinement",
    "Classic microneedling between laser sessions",
    "Chemical peels for maintenance after resurfacing",
    "Fitzpatrick I–IV skin tones typically best suited",
  ],
});

export const QUANTUM_RF_OSWEGO_MENU = buildOswegoMenu("quantum-rf-oswego", {
  eyebrow: "Oswego, IL · Only Quantum RF in the western suburbs",
  titleBefore: "Quantum RF Body Contouring —",
  titleAccent: "Neck $2,499 · Abdomen $3,999",
  secondaryCta: INMODE_SECONDARY,
  pricingTitle: "Quantum RF pricing",
  pricingHighlights: [
    "Neck package — $2,499 · includes FREE Morpheus8 Burst",
    "Abdomen package — $3,999 · includes FREE Morpheus8 Burst",
    "One treatment session · local anesthesia only",
    "5–7 day recovery · results build up to 6 months",
    "Cherry financing available — as low as 0% APR",
  ],
  pricingRows: [
    { label: "Neck Quantum RF package", price: "$2,499", note: "FREE Morpheus8 Burst included" },
    { label: "Abdomen Quantum RF package", price: "$3,999", note: "FREE Morpheus8 Burst included" },
    { label: "InMode Trifecta packages", price: "Specials →", href: "/specials" },
  ],
  pricingBadge: "EXCLUSIVE",
  howItWorksHighlights: [
    "Dual-zone RF heats fat to destruction temperature",
    "Simultaneous collagen stimulation tightens skin",
    "Body clears fat cells over the following weeks",
    "Results begin ~week 4 · build for 3–6 months",
    "No surgery, no anesthesia, no significant downtime",
  ],
  howItWorksLinks: [
    { label: "Morpheus8 Burst — skin-layer remodeling", price: "Compare →", href: "/morpheus8-burst-oswego" },
    { label: "GLP-1 weight loss when volume is the issue", price: "Learn →", href: "/glp-1-weight-loss-oswego" },
  ],
  howItWorksLearnMore: "/morpheus8-burst-oswego",
  careGuideHref: "/pre-post-care/quantum-rf",
  treatmentTime: "30–45 min/area",
  whatToExpectDescription:
    "Free consult with baseline photos and measurements, a warm hot-stone-massage-like session per area, and same-day return to normal activity — results build from week 4.",
  whyRows: [
    { label: "Free consultation", price: "Always", note: "Baseline photos & honest candidacy check" },
    { label: "Downtime", price: "None significant", note: "Back to work & light exercise same day" },
    { label: "Not a weight loss treatment", price: "Contouring", note: "Best within range of goal weight" },
  ],
  relatedDescription:
    "Quantum RF contours the fat layer; Morpheus8 tightens skin above it; GLP-1 programs handle overall weight. We map the right combination at consult.",
  relatedHighlights: [
    "Morpheus8 Burst for skin laxity & texture",
    "GLP-1 medical weight loss for systemic goals",
    "Solaria CO₂ for facial resurfacing",
    "CoolSculpting alternative — tightens as it slims",
  ],
});
