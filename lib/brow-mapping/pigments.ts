import type { TinaDaviesPigment, TinaDaviesPigmentId } from "@/data/brow-mapping-intelligence";

export type EnrichedPigment = TinaDaviesPigment & {
  undertone: string;
  bestFor: string;
  caution: string;
  modifier: string;
};

/** Tina Davies I ❤️ INK — consultation preview swatches (verify with supplier). */
export const TINA_DAVIES_PIGMENTS: EnrichedPigment[] = [
  {
    id: "blonde",
    name: "Blonde",
    line: "I ❤️ INK",
    hex: "#b8956a",
    use: "Fair · light hair · build at touch-up",
    undertone: "Warm golden blonde",
    bestFor: "Fair clients with blonde or light hair",
    caution: "Can disappear on oily skin — build at touch-up",
    modifier: "Add warm modifier if client heals ashy",
  },
  {
    id: "soft-brown",
    name: "Soft Brown",
    line: "I ❤️ INK",
    hex: "#9a7b5a",
    use: "Fair–medium · soft natural heal",
    undertone: "Neutral-warm brown",
    bestFor: "Fair to medium skin with light brown hair",
    caution: "May read slightly cool on very fair pink undertones",
    modifier: "Warm modifier if gray heal tendency",
  },
  {
    id: "medium-brown",
    name: "Medium Brown",
    line: "I ❤️ INK",
    hex: "#6b4f3a",
    use: "HG workhorse · medium brunette",
    undertone: "Neutral brown",
    bestFor: "Medium brunette clients",
    caution: "May heal slightly cool on some skin types",
    modifier: "Warm modifier if client heals ashy",
  },
  {
    id: "bombshell",
    name: "Bombshell",
    line: "I ❤️ INK",
    hex: "#5c4033",
    use: "Light–medium brunette · neutral",
    undertone: "Neutral with soft warmth",
    bestFor: "Light to medium brunettes wanting defined brows",
    caution: "Avoid over-saturating on fair skin first pass",
    modifier: "Neutral path — document heal at 4–6 weeks",
  },
  {
    id: "dark-brown",
    name: "Dark Brown",
    line: "I ❤️ INK",
    hex: "#3d2914",
    use: "Deep brunette · avoid jet",
    undertone: "Cool-neutral deep brown",
    bestFor: "Dark brown hair clients",
    caution: "Never substitute for jet black — can heal blue-gray",
    modifier: "Measured warmth if cool-pull risk",
  },
  {
    id: "espresso",
    name: "Espresso",
    line: "I ❤️ INK",
    hex: "#2e1f14",
    use: "Rich cool-brown base",
    undertone: "Cool deep brown",
    bestFor: "Deep brunette to black hair",
    caution: "High contrast on medium skin — go conservative",
    modifier: "Warm modifier sparingly on deep warm skin",
  },
  {
    id: "ash-brown",
    name: "Ash Brown",
    line: "I ❤️ INK",
    hex: "#5a5348",
    use: "Olive/warm fade counter · modifier",
    undertone: "Ash / olive counter",
    bestFor: "Olive undertones or orange fade correction",
    caution: "Not a standalone base on fair cool skin",
    modifier: "Use as modifier — 10–20% mix max",
  },
  {
    id: "warm-brown",
    name: "Warm Brown",
    line: "I ❤️ INK",
    hex: "#7a5230",
    use: "Fair cool skin · prevents gray heal",
    undertone: "Warm brown",
    bestFor: "Fair cool undertones that heal gray",
    caution: "Can read orange if overused on warm skin",
    modifier: "Primary warm modifier for ash heal tendency",
  },
  {
    id: "golden-sunrise",
    name: "Golden Sunrise",
    line: "Modifier",
    hex: "#c4956a",
    use: "Warm modifier — use sparingly",
    undertone: "Golden warm modifier",
    bestFor: "Correcting cool/ash heal on fair skin",
    caution: "Never use undiluted — orange drift risk",
    modifier: "5–15% modifier only — log mix ratio",
  },
];

export const TINA_PIGMENT_BY_ID = Object.fromEntries(TINA_DAVIES_PIGMENTS.map((p) => [p.id, p])) as Record<
  TinaDaviesPigmentId,
  EnrichedPigment
>;

export const PIGMENT_PREVIEW_DISCLAIMER =
  "Digital pigment preview is for consultation only. Final healed color depends on skin type, undertone, technique, previous pigment, aftercare, and healing response.";

export const CLINICAL_DISCLAIMER =
  "For consultation and design visualization only. This tool does not guarantee healed pigment color, shape retention, symmetry, or final result. Final design should be confirmed by the licensed provider using professional mapping, client anatomy, skin type, consent, and clinical judgment.";

export const PRIVACY_NOTICE =
  "Client photo stays on this device during the consultation unless you manually export or save. No image data is sent to our servers or third parties.";
