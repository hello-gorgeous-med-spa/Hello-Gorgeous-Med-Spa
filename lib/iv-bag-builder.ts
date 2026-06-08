/**
 * BUILD YOUR IV BAG — Hello Gorgeous client app
 *
 * Base IV + Olympia-sourced add-ons aligned with our Vitamin Bar menu & iv-therapy page.
 * Owner: edit sizes, add-on prices, and presets here.
 */

export type IvBagSizeId = "500ml" | "1000ml";

export type IvAddonCategory = "hydration" | "energy" | "immune" | "beauty" | "recovery" | "longevity" | "rx";

export type IvBagSize = {
  id: IvBagSizeId;
  name: string;
  volumeLabel: string;
  fluid: string;
  /** Base price before add-ons (USD whole dollars). */
  basePrice: number;
  duration: string;
  blurb: string;
};

export type IvBagAddon = {
  id: string;
  name: string;
  benefit: string;
  price: number;
  category: IvAddonCategory;
  /** Matches Vitamin Bar / website offering where applicable. */
  source: "olympia" | "hg-menu";
  tags: string[];
  consultFirst?: boolean;
  maxPerBag?: number;
};

export type IvBagPreset = {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  sizeId: IvBagSizeId;
  addonIds: string[];
};

/** Sweet spot for custom bags — shown in the app as a guide. */
export const IV_BAG_TARGET_RANGE = { min: 150, max: 199 } as const;

export const IV_BAG_SIZES: IvBagSize[] = [
  {
    id: "500ml",
    name: "Standard Bag",
    volumeLabel: "500 mL",
    fluid: "Normal Saline or Lactated Ringer's",
    basePrice: 89,
    duration: "30–45 min",
    blurb: "Our most popular size — perfect for hydration plus a few boosters.",
  },
  {
    id: "1000ml",
    name: "Large Bag",
    volumeLabel: "1 Liter (1000 mL)",
    fluid: "Normal Saline or Lactated Ringer's",
    basePrice: 109,
    duration: "45–60 min",
    blurb: "Extra volume for deep hydration, recovery, or multiple add-ons.",
  },
];

/**
 * Add-on pricing is kept modest so most custom bags land in the $150–$199 range
 * on top of the $89 / $109 base.
 */
export const IV_BAG_ADDONS: IvBagAddon[] = [
  {
    id: "b12",
    name: "B12 (Methylcobalamin)",
    benefit: "Energy, metabolism & mood — same as our Vitamin Bar shot.",
    price: 15,
    category: "energy",
    source: "olympia",
    tags: ["ENERGY", "MOOD"],
  },
  {
    id: "b-complex",
    name: "B-Complex",
    benefit: "Full-spectrum B vitamins for all-day vitality.",
    price: 18,
    category: "energy",
    source: "olympia",
    tags: ["VITALITY"],
  },
  {
    id: "vitamin-c",
    name: "Vitamin C (Immune Dose)",
    benefit: "High-dose antioxidant & immune support.",
    price: 22,
    category: "immune",
    source: "olympia",
    tags: ["IMMUNE", "ANTIOXIDANT"],
  },
  {
    id: "zinc",
    name: "Zinc",
    benefit: "Immune defense & skin support.",
    price: 15,
    category: "immune",
    source: "olympia",
    tags: ["IMMUNE"],
  },
  {
    id: "tri-immune",
    name: "Tri-Immune Boost",
    benefit: "Glutathione + Vitamin C + Zinc — our shot blend, IV strength.",
    price: 32,
    category: "immune",
    source: "hg-menu",
    tags: ["IMMUNE", "DEFENSE"],
    maxPerBag: 1,
  },
  {
    id: "glutathione",
    name: "Glutathione",
    benefit: "Master antioxidant — brighten, detox, glow.",
    price: 28,
    category: "beauty",
    source: "olympia",
    tags: ["GLOW", "DETOX"],
  },
  {
    id: "biotin",
    name: "Biotin",
    benefit: "Hair, skin & nail support from within.",
    price: 18,
    category: "beauty",
    source: "olympia",
    tags: ["BEAUTY"],
  },
  {
    id: "magnesium",
    name: "Magnesium",
    benefit: "Muscle relaxation, recovery & headache support.",
    price: 20,
    category: "recovery",
    source: "olympia",
    tags: ["RECOVERY", "RELAX"],
  },
  {
    id: "mic-lipo",
    name: "MIC / Lipotropic",
    benefit: "Metabolism & fat-burning support — pairs with weight goals.",
    price: 25,
    category: "energy",
    source: "hg-menu",
    tags: ["METABOLISM"],
  },
  {
    id: "amino-blend",
    name: "Amino Blend",
    benefit: "Recovery, stamina & lean-muscle support.",
    price: 25,
    category: "recovery",
    source: "olympia",
    tags: ["RECOVERY", "PERFORMANCE"],
  },
  {
    id: "taurine",
    name: "Taurine",
    benefit: "Focus, endurance & recovery amino acid.",
    price: 15,
    category: "recovery",
    source: "olympia",
    tags: ["FOCUS", "ENDURANCE"],
  },
  {
    id: "vitamin-d",
    name: "Vitamin D3",
    benefit: "Mood, bone & immune support.",
    price: 18,
    category: "immune",
    source: "olympia",
    tags: ["MOOD", "IMMUNE"],
  },
  {
    id: "nad-boost",
    name: "NAD+ Boost (250 mg)",
    benefit: "Cellular energy & clarity — provider screening required.",
    price: 49,
    category: "longevity",
    source: "olympia",
    tags: ["LONGEVITY", "CLARITY"],
    consultFirst: true,
    maxPerBag: 1,
  },
  {
    id: "zofran",
    name: "Zofran (Anti-Nausea)",
    benefit: "Fast nausea relief — Rx add-on, provider approval.",
    price: 22,
    category: "rx",
    source: "olympia",
    tags: ["ANTI-NAUSEA", "RX"],
    consultFirst: true,
    maxPerBag: 1,
  },
];

export const IV_BAG_PRESETS: IvBagPreset[] = [
  {
    id: "glow",
    name: "Glow Bag",
    emoji: "✨",
    tagline: "Brighten & detox",
    sizeId: "500ml",
    addonIds: ["glutathione", "biotin", "vitamin-c"],
  },
  {
    id: "energy",
    name: "Energy Bag",
    emoji: "⚡",
    tagline: "Pick-me-up classic",
    sizeId: "500ml",
    addonIds: ["b12", "b-complex", "taurine"],
  },
  {
    id: "immunity",
    name: "Immunity Bag",
    emoji: "🛡️",
    tagline: "Shield season support",
    sizeId: "500ml",
    addonIds: ["vitamin-c", "zinc", "tri-immune"],
  },
  {
    id: "recovery",
    name: "Recovery Bag",
    emoji: "💪",
    tagline: "Post-workout or hangover",
    sizeId: "1000ml",
    addonIds: ["magnesium", "amino-blend", "b-complex"],
  },
  {
    id: "myers-lite",
    name: "Myers-Style",
    emoji: "⭐",
    tagline: "Wellness classic",
    sizeId: "500ml",
    addonIds: ["b-complex", "b12", "magnesium", "vitamin-c", "zinc"],
  },
];

export const IV_ADDON_CATEGORY_LABELS: Record<IvAddonCategory, string> = {
  hydration: "Hydration",
  energy: "Energy & Metabolism",
  immune: "Immune Support",
  beauty: "Beauty & Glow",
  recovery: "Recovery",
  longevity: "Longevity",
  rx: "Rx Add-Ons",
};

export function getIvBagSize(id: IvBagSizeId): IvBagSize {
  return IV_BAG_SIZES.find((s) => s.id === id) ?? IV_BAG_SIZES[0];
}

export function getIvAddon(id: string): IvBagAddon | undefined {
  return IV_BAG_ADDONS.find((a) => a.id === id);
}

export function addonsByCategory(): { category: IvAddonCategory; label: string; addons: IvBagAddon[] }[] {
  const order: IvAddonCategory[] = ["energy", "immune", "beauty", "recovery", "longevity", "rx"];
  return order
    .map((category) => ({
      category,
      label: IV_ADDON_CATEGORY_LABELS[category],
      addons: IV_BAG_ADDONS.filter((a) => a.category === category),
    }))
    .filter((g) => g.addons.length > 0);
}

export type IvBagQuote = {
  size: IvBagSize;
  addons: IvBagAddon[];
  basePrice: number;
  addonsTotal: number;
  total: number;
  inTargetRange: boolean;
  belowTarget: boolean;
  aboveTarget: boolean;
  needsConsult: boolean;
};

export function calculateIvBagQuote(sizeId: IvBagSizeId, addonIds: string[]): IvBagQuote {
  const size = getIvBagSize(sizeId);
  const addons = addonIds.map((id) => getIvAddon(id)).filter(Boolean) as IvBagAddon[];
  const addonsTotal = addons.reduce((sum, a) => sum + a.price, 0);
  const total = size.basePrice + addonsTotal;

  return {
    size,
    addons,
    basePrice: size.basePrice,
    addonsTotal,
    total,
    inTargetRange: total >= IV_BAG_TARGET_RANGE.min && total <= IV_BAG_TARGET_RANGE.max,
    belowTarget: total < IV_BAG_TARGET_RANGE.min,
    aboveTarget: total > IV_BAG_TARGET_RANGE.max,
    needsConsult: addons.some((a) => a.consultFirst),
  };
}

export function buildIvBagBookingNote(quote: IvBagQuote): string {
  const lines = [
    "Custom IV Bag (Hello Gorgeous App)",
    `Size: ${quote.size.volumeLabel} — ${quote.size.fluid}`,
    `Add-ons: ${quote.addons.length ? quote.addons.map((a) => a.name).join(", ") : "Base hydration only"}`,
    `Estimated total: $${quote.total}`,
  ];
  if (quote.needsConsult) lines.push("Note: Rx / NAD add-ons — screening required.");
  return lines.join("\n");
}

export function toggleAddonSelection(selected: string[], addonId: string): string[] {
  const addon = getIvAddon(addonId);
  if (!addon) return selected;

  if (selected.includes(addonId)) {
    return selected.filter((id) => id !== addonId);
  }

  if (addon.maxPerBag === 1 && selected.includes(addonId)) {
    return selected;
  }

  return [...selected, addonId];
}
