import { SITE } from "@/lib/seo";

/** Build-your-bag base (500 mL) — matches client app IV builder. */
export const IV_CUSTOM_BAG_BASE_USD = 89;
export const IV_CUSTOM_BAG_LARGE_USD = 109;
export const IV_CUSTOM_BAG_TARGET_LABEL = "$150–199";
/** Signature named drips — competitive vs flat $185 menus elsewhere. */
export const IV_SIGNATURE_DRIP_FROM_USD = 169;

export type IvDripMenuItem = {
  id: string;
  name: string;
  /** Shown as "Ingredient • Ingredient • …" */
  ingredients: string[];
  description: string;
  priceUsd: number;
};

export function formatIvDripPrice(usd: number): string {
  return `$${usd}`;
}

/** Olympia-sourced signature IV drips — matches in-spa menu & app. */
export const IV_DRIP_MENU: IvDripMenuItem[] = [
  {
    id: "recovery",
    name: "Recovery Drip",
    ingredients: ["Mineral Blend", "L-Glutamine", "Ascorbic Acid"],
    description:
      "Pre-competition prep and post-event recovery. Metabolic boost and cellular resilience.",
    priceUsd: IV_SIGNATURE_DRIP_FROM_USD,
  },
  {
    id: "energy",
    name: "Energy Drip",
    ingredients: ["Mineral Blend", "L-Carnitine", "Methylcobalamin"],
    description:
      "Mid-week fatigue, jet lag, immune defense, hangover recovery, and faster workout repair.",
    priceUsd: IV_SIGNATURE_DRIP_FROM_USD,
  },
  {
    id: "immune",
    name: "Immune Drip",
    ingredients: ["Ascorbic Acid", "Zinc", "Vita Complex"],
    description: "Supporting mitochondrial efficacy, reducing oxidative stress, and fast recovery.",
    priceUsd: IV_SIGNATURE_DRIP_FROM_USD,
  },
  {
    id: "glow",
    name: "Glow Drip",
    ingredients: ["Ascorbic Acid", "Biotin", "Methylcobalamin"],
    description:
      "Glowing, hydrated skin. Stronger hair and nails. Collagen support and anti-aging defense.",
    priceUsd: IV_SIGNATURE_DRIP_FROM_USD,
  },
  {
    id: "brain",
    name: "Brain Drip",
    ingredients: ["Vita Complex", "Taurine", "L-Carnitine"],
    description: "Stress and tension relief. Nervous system reset. Deeper, more restorative recovery.",
    priceUsd: IV_SIGNATURE_DRIP_FROM_USD,
  },
  {
    id: "detox",
    name: "Detox Drip",
    ingredients: ["Vita Complex", "Glutathione", "Ascorbic Acid"],
    description:
      "Flush toxins, support liver function, and restore cellular balance with this powerful detox blend.",
    priceUsd: IV_SIGNATURE_DRIP_FROM_USD,
  },
  {
    id: "fitness",
    name: "Fitness Drip",
    ingredients: ["Amino Blend", "L-Carnitine", "Taurine"],
    description:
      "Engineered for peak physical performance, endurance, and accelerated muscle recovery.",
    priceUsd: IV_SIGNATURE_DRIP_FROM_USD,
  },
  {
    id: "vitality",
    name: "Vitality Drip",
    ingredients: ["Mineral Complex", "Taurine", "L-Glutamine"],
    description: "Replenish essential minerals, restore energy, and support whole-body vitality.",
    priceUsd: IV_SIGNATURE_DRIP_FROM_USD,
  },
  {
    id: "myers",
    name: "Myers Cocktail",
    ingredients: ["Mineral Blend", "Amino Blend", "Vita Complex"],
    description: "The classic IV formula. A full-spectrum blend for immunity, energy, and overall wellness.",
    priceUsd: IV_SIGNATURE_DRIP_FROM_USD,
  },
];

export const IV_THERAPY_SERVICE_PATH = "/services/iv-therapy" as const;

export function ivDripMenuItemListJsonLd(pageUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Hello Gorgeous IV Therapy Menu",
    description: "Signature IV drip formulations at Hello Gorgeous Med Spa, Oswego IL.",
    url: pageUrl,
    numberOfItems: IV_DRIP_MENU.length,
    itemListElement: IV_DRIP_MENU.map((drip, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name: drip.name,
        description: drip.description,
        provider: { "@type": "MedicalBusiness", name: SITE.name, telephone: SITE.phone },
        areaServed: "Oswego, Naperville, Aurora, Plainfield, Illinois",
      },
    })),
  };
}

export function ivBagBuilderUrl(options?: { utmMedium?: string }): string {
  const url = new URL("/app", SITE.url);
  url.searchParams.set("iv", "build");
  url.searchParams.set("utm_source", "website");
  url.searchParams.set("utm_medium", options?.utmMedium ?? "iv_therapy_page");
  url.searchParams.set("utm_campaign", "build_iv_bag");
  return url.toString();
}
