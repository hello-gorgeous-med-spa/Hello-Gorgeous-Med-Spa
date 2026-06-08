import { SITE } from "@/lib/seo";

export type IvDripMenuItem = {
  id: string;
  name: string;
  /** Shown as "Ingredient • Ingredient • …" */
  ingredients: string[];
  description: string;
};

/** Olympia-sourced signature IV drips — matches in-spa menu & app. */
export const IV_DRIP_MENU: IvDripMenuItem[] = [
  {
    id: "recovery",
    name: "Recovery Drip",
    ingredients: ["Mineral Blend", "L-Glutamine", "Ascorbic Acid"],
    description:
      "Pre-competition prep and post-event recovery. Metabolic boost and cellular resilience.",
  },
  {
    id: "energy",
    name: "Energy Drip",
    ingredients: ["Mineral Blend", "L-Carnitine", "Methylcobalamin"],
    description:
      "Mid-week fatigue, jet lag, immune defense, hangover recovery, and faster workout repair.",
  },
  {
    id: "immune",
    name: "Immune Drip",
    ingredients: ["Ascorbic Acid", "Zinc", "Vita Complex"],
    description: "Supporting mitochondrial efficacy, reducing oxidative stress, and fast recovery.",
  },
  {
    id: "glow",
    name: "Glow Drip",
    ingredients: ["Ascorbic Acid", "Biotin", "Methylcobalamin"],
    description:
      "Glowing, hydrated skin. Stronger hair and nails. Collagen support and anti-aging defense.",
  },
  {
    id: "brain",
    name: "Brain Drip",
    ingredients: ["Vita Complex", "Taurine", "L-Carnitine"],
    description: "Stress and tension relief. Nervous system reset. Deeper, more restorative recovery.",
  },
  {
    id: "detox",
    name: "Detox Drip",
    ingredients: ["Vita Complex", "Glutathione", "Ascorbic Acid"],
    description:
      "Flush toxins, support liver function, and restore cellular balance with this powerful detox blend.",
  },
  {
    id: "fitness",
    name: "Fitness Drip",
    ingredients: ["Amino Blend", "L-Carnitine", "Taurine"],
    description:
      "Engineered for peak physical performance, endurance, and accelerated muscle recovery.",
  },
  {
    id: "vitality",
    name: "Vitality Drip",
    ingredients: ["Mineral Complex", "Taurine", "L-Glutamine"],
    description: "Replenish essential minerals, restore energy, and support whole-body vitality.",
  },
  {
    id: "myers",
    name: "Myers Cocktail",
    ingredients: ["Mineral Blend", "Amino Blend", "Vita Complex"],
    description: "The classic IV formula. A full-spectrum blend for immunity, energy, and overall wellness.",
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
