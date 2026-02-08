/**
 * Fix What Bothers Me — map client concern text to suggested services.
 * Used on submit and in admin to show recommendations.
 */

export type ConcernServiceSuggestion = {
  slug: string;
  name: string;
  reason: string;
};

// Keyword patterns (lowercase) → service slug + short reason
const CONCERN_MAP: Array<{
  keywords: RegExp;
  slug: string;
  name: string;
  reason: string;
}> = [
  // Weight
  {
    keywords: /\b(weight|overweight|lbs|pounds|diet|obese|bmi|glp|semaglutide|ozempic|tirzepatide|wegovy|mounjaro|weight loss|lose weight)\b/i,
    slug: "weight-loss-therapy",
    name: "Weight Loss (GLP-1)",
    reason: "Weight or metabolism concerns",
  },
  // Pigmentation / dark spots
  {
    keywords: /\b(pigment|dark spots|sun spots|sun damage|melasma|uneven tone|discoloration|brown spots|age spots|hyperpigmentation)\b/i,
    slug: "chemical-peels",
    name: "Chemical Peels",
    reason: "Pigmentation or uneven tone",
  },
  {
    keywords: /\b(ipl|photofacial|redness|broken capillaries|sun damage|brown spots)\b/i,
    slug: "ipl-photofacial",
    name: "IPL Photofacial",
    reason: "Sun damage or redness",
  },
  // Lines / wrinkles
  {
    keywords: /\b(wrinkle|lines|forehead|11s|frown|crow'?s? feet|expression|dynamic lines)\b/i,
    slug: "botox-dysport-jeuveau",
    name: "Botox, Dysport & Jeuveau",
    reason: "Lines and expression wrinkles",
  },
  {
    keywords: /\b(deep lines|texture|scars|acne scars|pore|microneedl|collagen|tighten)\b/i,
    slug: "rf-microneedling",
    name: "RF Microneedling",
    reason: "Texture, scars, or deeper lines",
  },
  // Volume / lips
  {
    keywords: /\b(volume|hollow|cheek|cheeks|thin lip|lips|lip filler|juvederm|restylane)\b/i,
    slug: "dermal-fillers",
    name: "Dermal Fillers",
    reason: "Volume or contour",
  },
  {
    keywords: /\b(lip|lips|fuller lip)\b/i,
    slug: "lip-filler",
    name: "Lip Filler",
    reason: "Lip enhancement",
  },
  // Acne / texture
  {
    keywords: /\b(acne|breakout|oil|texture|pore|blackhead)\b/i,
    slug: "hydra-facial",
    name: "HydraFacial",
    reason: "Acne or congestion",
  },
  {
    keywords: /\b(peel|exfoliat|resurfac)\b/i,
    slug: "chemical-peels",
    name: "Chemical Peels",
    reason: "Resurfacing or exfoliation",
  },
  // Hair
  {
    keywords: /\b(hair removal|unwanted hair|laser hair|bikini|underarm|leg hair)\b/i,
    slug: "laser-hair-removal",
    name: "Laser Hair Removal",
    reason: "Unwanted hair",
  },
  // Chin / jaw
  {
    keywords: /\b(double chin|chin fat|submental|kybella)\b/i,
    slug: "kybella",
    name: "Kybella",
    reason: "Under-chin fullness",
  },
  // Energy / hormones
  {
    keywords: /\b(tired|fatigue|energy|hormone|menopause|testosterone|low t|libido|sleep|mood)\b/i,
    slug: "biote-hormone-therapy",
    name: "BioTE Hormone Therapy",
    reason: "Energy or hormone concerns",
  },
  {
    keywords: /\b(iv|hydration|hangover|energy drip|myers)\b/i,
    slug: "iv-therapy",
    name: "IV Therapy",
    reason: "Energy or hydration",
  },
  {
    keywords: /\b(vitamin b12|b12|biotin|glutathione|injection)\b/i,
    slug: "vitamin-injections",
    name: "Vitamin Injections",
    reason: "Vitamin or energy boost",
  },
  // Skin quality / glow
  {
    keywords: /\b(glow|dull|rejuvenat|facial|hydra|geneo)\b/i,
    slug: "hydra-facial",
    name: "HydraFacial",
    reason: "Glow and hydration",
  },
  {
    keywords: /\b(prp|prf|platelet|hair loss|thinning hair|rejuvenat)\b/i,
    slug: "prf-prp",
    name: "PRP / PRF",
    reason: "PRP or regenerative",
  },
  {
    keywords: /\b(joint|knee|shoulder|pain)\b/i,
    slug: "prp-joint-injections",
    name: "PRP Joint Injections",
    reason: "Joint or pain",
  },
];

/**
 * From free-text concern message, return suggested services (slug, name, reason).
 * Deduplicated by slug, order preserved by first match.
 */
export function suggestServicesFromConcern(message: string): ConcernServiceSuggestion[] {
  if (!message?.trim()) return [];

  const seen = new Set<string>();
  const out: ConcernServiceSuggestion[] = [];

  for (const { keywords, slug, name, reason } of CONCERN_MAP) {
    if (seen.has(slug)) continue;
    if (keywords.test(message)) {
      seen.add(slug);
      out.push({ slug, name, reason });
    }
  }

  // If nothing matched, suggest a general consult
  if (out.length === 0) {
    out.push({
      slug: "quiz",
      name: "Find My Treatment (Quiz)",
      reason: "We’ll match you with the right options",
    });
  }

  return out;
}

/**
 * Get unique slugs only (for storage / booking links).
 */
export function suggestedSlugsFromConcern(message: string): string[] {
  return suggestServicesFromConcern(message).map((s) => s.slug);
}

// ============================================================
// HOMEPAGE HERO FEATURE — Visual concern slider
// ============================================================

export type FeaturedConcern = {
  key: string;
  label: string;
  icon: string;
};

export const FEATURED_CONCERNS: FeaturedConcern[] = [
  { key: "lines", label: "Lines & Wrinkles", icon: "✨" },
  { key: "volume", label: "Volume / Lips", icon: "💋" },
  { key: "pigmentation", label: "Pigmentation", icon: "🎯" },
  { key: "weight", label: "Weight Loss", icon: "⚖️" },
  { key: "hormones", label: "Hormones / Energy", icon: "🌿" },
  { key: "glow", label: "Glow & Skin Quality", icon: "💧" },
  { key: "acne", label: "Acne / Texture", icon: "💆" },
  { key: "hair", label: "Hair (Loss or Removal)", icon: "💇" },
];

const PREFILL_BY_KEY: Record<string, string> = {
  lines: "I'm bothered by lines and wrinkles — forehead, between my brows, or around my eyes. I'd love to know what options could help.",
  volume: "I'd like more volume or definition — my lips, cheeks, or somewhere else. I'm not sure where to start.",
  pigmentation: "I have pigmentation, dark spots, or uneven skin tone I'd like to address.",
  weight: "I've been struggling with my weight and would like to learn about options that could help.",
  hormones: "My energy, mood, or sleep isn't where I want it. I'm curious about hormone or wellness options.",
  glow: "I want my skin to look healthier and more glowing — not sure which treatment is right for me.",
  acne: "I'm dealing with acne, texture, or congestion and would like to see what could help.",
  hair: "I'm interested in hair removal or have concerns about thinning hair.",
};

/**
 * Pre-fill text for the Fix What Bothers Me form when user clicks a concern card.
 */
export function getPrefillForConcern(key: string | null): string {
  if (!key) return "";
  return PREFILL_BY_KEY[key] ?? "";
}
