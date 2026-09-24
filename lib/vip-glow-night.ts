/** VIP Glow Night — public RSVP lander at /vip-glow */

export const VIP_GLOW_PATH = "/vip-glow";
export const VIP_GLOW_CAMPAIGN = "vip_glow_night";
export const VIP_GLOW_SHORT_URL = "https://hellogorgeousmedspa.com/vip-glow";
export const VIP_GLOW_FLYER = "/images/marketing/vip-glow-night.jpg";

export const VIP_GLOW_SMS_TEXT = [
  "Gorgeous! ✨ VIP GLOW NIGHT — jammies, champagne, $450 Solaria, $399 Morpheus8, $7 Botox, $399 Microblading incl touch-up. One night only!",
  `Tap to RSVP + tell us what YOU want + what your friend wants so we can prep IV bags: ${VIP_GLOW_SHORT_URL}`,
].join(" ");

export const VIP_GLOW_SEO = {
  title: "VIP Glow Night RSVP | Hello Gorgeous | Oswego, IL",
  description:
    "RSVP for VIP Glow Night in Oswego — Solaria $450, Botox $7/unit, Morpheus8 $399, IV $79, filler $399, microblading $399 incl. 6-week touch-up. Tell us what you want and what your friend wants.",
  ogAlt: "VIP Glow Night invite — Hello Gorgeous Med Spa, Oswego",
} as const;

export const VIP_GLOW_SLOTS = [
  "5:00 PM",
  "5:30 PM",
  "6:00 PM",
  "6:30 PM",
  "7:00 PM",
  "7:30 PM",
  "8:00 PM",
  "8:30 PM",
  "9:00 PM",
  "9:30 PM",
] as const;

export type VipGlowTreatmentId =
  | "solaria"
  | "vitamin"
  | "botox"
  | "morpheus8"
  | "iv"
  | "filler"
  | "microblading";

export const VIP_GLOW_TREATMENTS: Array<{
  id: VipGlowTreatmentId;
  name: string;
  price: string;
  blurb: string;
  sub?: string;
  badge?: string;
}> = [
  { id: "solaria", name: "Solaria / CO₂ Laser", price: "$450", blurb: "Brightening resurfacing" },
  { id: "vitamin", name: "Vitamin Injection", price: "$15", blurb: "Quick glow boost" },
  { id: "botox", name: "Botox", price: "$7 / unit", blurb: "Smooth & soften" },
  { id: "morpheus8", name: "Morpheus8", price: "$399", blurb: "Tighten + contour" },
  { id: "iv", name: "IV Therapy", price: "$79", blurb: "Hydration glow" },
  { id: "filler", name: "Dermal Filler", price: "$399", blurb: "Lift & restore" },
  {
    id: "microblading",
    name: "Microblading",
    price: "$399",
    sub: "incl. 6 week touch-up",
    badge: "NEW",
    blurb: "Dream brows",
  },
];

export const VIP_GLOW_EXPECT = [
  {
    id: "solaria",
    title: "Solaria / CO₂",
    numb: "45 min numb + 15 min glow",
    proc: "Tiny dots, resurfacing",
    down: "Typical 3–7 day downtime",
    tip: "No actives 3 days prior. Arrive early so we can numb you properly.",
  },
  {
    id: "botox",
    title: "Botox $7/unit",
    numb: "Ice, no numbing needed",
    proc: "About 10 min",
    down: "No gym / lying flat 4 hrs",
    tip: "Typical results 3–7 days. Bring your usual unit range.",
  },
  {
    id: "iv",
    title: "IV Therapy $79",
    numb: "None",
    proc: "30–45 min lounge infusion",
    down: "None. Hydrated + energized",
    tip: "Custom bag like you want — Energy, Glow, Immunity, Myers, Recovery.",
  },
  {
    id: "vitamin",
    title: "Vitamin Injection $15",
    numb: "None",
    proc: "About 2 min",
    down: "Mild tenderness possible",
    tip: "10 options — pick your shot so we can draw it before you sit.",
  },
  {
    id: "morpheus8",
    title: "Morpheus8 $399",
    numb: "45 min numb + 15 min treatment",
    proc: "Stamping + FREE Shockwave",
    down: "Typical 1–3 days redness",
    tip: "Often chosen for laxity, texture, and jawline. Makeup next day for most guests.",
  },
  {
    id: "filler",
    title: "Dermal Filler $399",
    numb: "About 20 min numbing",
    proc: "Instant volume",
    down: "Mild swelling 2–3 days possible",
    tip: "Lips, cheeks, chin, smile lines, under-eye — pick your area so we can prep.",
  },
  {
    id: "microblading",
    title: "Microblading $399",
    numb: "Numbed after mapping",
    proc: "About 2 hr mapping + strokes",
    down: "Typical 7–10 day flake",
    tip: "6-week perfection touch-up included. Natural Hair Stroke, Soft Powder, or Combo.",
  },
] as const;

export const VIP_GLOW_IV_BLENDS = [
  "Energy",
  "Glow",
  "Immunity",
  "Myers",
  "Recovery",
  "Not sure",
] as const;

export const VIP_GLOW_VITAMINS = [
  "B12 Energy",
  "Vitamin D3",
  "Biotin Beauty",
  "Lipo-Mino Fat Burn",
  "Tri-Immune",
  "Skinny Shot",
  "B-Complex",
  "Glutathione Glow",
  "Vitamin C",
  "MIC / Lipo",
  "Not sure",
] as const;

export const VIP_GLOW_FILLER_AREAS = [
  "Lips",
  "Cheeks",
  "Chin",
  "Jawline",
  "Smile Lines",
  "Under Eye",
  "Not sure",
] as const;

export const VIP_GLOW_BROW_STYLES = [
  "Natural Hair Stroke",
  "Soft Powder",
  "Combo",
  "Not sure",
] as const;

export type VipGlowDetails = {
  botoxUnits: string;
  ivChoice: string;
  vitaminChoice: string;
  fillerArea: string;
  browStyle: string;
};

export const EMPTY_VIP_GLOW_DETAILS: VipGlowDetails = {
  botoxUnits: "",
  ivChoice: "",
  vitaminChoice: "",
  fillerArea: "",
  browStyle: "",
};

export function treatmentLabel(id: string): string {
  return VIP_GLOW_TREATMENTS.find((t) => t.id === id)?.name ?? id;
}

export function formatGlowGoals(
  treatments: string[],
  details: Partial<VipGlowDetails> | null | undefined,
): string {
  const d = details ?? {};
  return treatments
    .map((id) => {
      if (id === "botox" && d.botoxUnits) return `Botox ${d.botoxUnits}u`;
      if (id === "iv" && d.ivChoice) return `IV ${d.ivChoice}`;
      if (id === "vitamin" && d.vitaminChoice) return `Vitamin ${d.vitaminChoice}`;
      if (id === "filler" && d.fillerArea) return `Filler ${d.fillerArea}`;
      if (id === "microblading" && d.browStyle) return `Brows ${d.browStyle}`;
      return treatmentLabel(id);
    })
    .join(" · ");
}

export function countIvBags(clientTreatments: string[], guestTreatments?: string[]): number {
  return (clientTreatments.includes("iv") ? 1 : 0) + (guestTreatments?.includes("iv") ? 1 : 0);
}

export function smsInviteHref(): string {
  return `sms:?&body=${encodeURIComponent(VIP_GLOW_SMS_TEXT)}`;
}
