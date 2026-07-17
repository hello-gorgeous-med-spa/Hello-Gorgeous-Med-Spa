import type { PersonaId } from "@/lib/personas/types";
import { SERVICES } from "@/lib/seo";

import type {
  DiscoveryOption,
  ServiceAtlasCard,
  ServiceAtlasCluster,
  ServiceAtlasClusterId,
} from "./types";

function pickPersonaForSlug(slug: string): PersonaId {
  const s = slug.toLowerCase();
  if (/(botox|dysport|jeuveau)/i.test(s)) return "beau-tox";
  if (/(filler|lip)/i.test(s)) return "filla-grace";
  if (/(weight|glp|semag|tirzep|reta)/i.test(s)) return "ryan";
  if (/(hormone|trt|peptide)/i.test(s)) return "ryan";
  return "peppi";
}

export const ATLAS_CLUSTERS: readonly ServiceAtlasCluster[] = [
  {
    id: "aesthetics-injectables",
    title: "Aesthetics & Injectables",
    description:
      "Subtle, confidence-building refinement—education-first and never pressured. We focus on natural movement, balance, and clear expectations.",
    personaDefault: "peppi",
    serviceSlugs: [
      "botox-dysport-jeuveau",
      "dermal-fillers",
      "sculptra-biostimulator",
      "lip-filler",
      "kybella",
      "alle-botox-rewards",
    ],
  },
  {
    id: "weight-loss-metabolic-care",
    title: "Weight Loss & Metabolic Care",
    description:
      "A clinician-guided, safety-first approach to sustainable progress. Education here; individualized decisions happen in consultation.",
    personaDefault: "ryan",
    serviceSlugs: ["weight-loss-therapy"],
  },
  {
    id: "hormones-wellness",
    title: "Hormones & Wellness",
    description:
      "High-level education on evaluation, monitoring, and safety principles. Hormone care is individualized and requires an in-person consult.",
    personaDefault: "ryan",
    serviceSlugs: [
      "biote-hormone-therapy",
      "trt-replacement-therapy",
      "sermorelin-growth-peptide",
    ],
  },
  {
    id: "skin-regeneration",
    title: "Skin Regeneration",
    description:
      "Skin quality over time—texture, tone, and glow support. We lead with education, realistic timelines, and gentle guidance.",
    personaDefault: "peppi",
    serviceSlugs: [
      "rf-microneedling",
      "chemical-peels",
      "hydra-facial",
      "geneo-facial",
      "ipl-photofacial",
      "salmon-dna-glass-facial",
      "prf-prp",
      "prp",
      "prp-facial",
      "ez-prf-gel",
    ],
  },
  {
    id: "iv-therapy-recovery",
    title: "IV Therapy & Recovery",
    description:
      "Hydration and wellness support with screening and clinical oversight. We prioritize safety and appropriate escalation when needed.",
    personaDefault: "ryan",
    serviceSlugs: ["iv-therapy", "vitamin-injections"],
  },
  {
    id: "hair-restoration",
    title: "Hair Restoration",
    description:
      "AnteAGE MDX® Biosome / exosome scalp protocols, PRF hair restoration, and Rx-aware plans — education first, then a clear next step in person.",
    personaDefault: "ryan",
    serviceSlugs: ["hair-restoration-exosomes", "prp"],
  },
  {
    id: "pain-recovery",
    title: "Pain / Recovery",
    description:
      "High-level education for recovery-oriented goals. Medical evaluation is required for individualized decisions.",
    personaDefault: "ryan",
    serviceSlugs: ["prp-joint-injections"],
  },
  {
    id: "lashes-brows-beauty",
    title: "Lashes, Brows & Beauty",
    description:
      "Beauty services that support your day-to-day confidence. If you don’t see what you need here, contact us and we’ll guide you.",
    personaDefault: "peppi",
    serviceSlugs: [],
  },
  {
    id: "medical-visits-consultations",
    title: "Medical Visits & Consultations",
    description:
      "Not sure what to book? Start with a consult. We’ll focus on clarity, safety, and realistic expectations.",
    personaDefault: "peppi",
    serviceSlugs: [],
  },
] as const;

export const DISCOVERY_OPTIONS: readonly DiscoveryOption[] = [
  {
    id: "confidence-aesthetics",
    label: "Confidence / Aesthetics",
    description: "Refresh, soften, balance, and feel like yourself again (education-first).",
    clusters: ["aesthetics-injectables", "skin-regeneration"],
    personaHandOff: "peppi",
    whyThisExists:
      "Many people don’t want a “new face”—they want to feel refreshed. This path helps you explore options without pressure.",
  },
  {
    id: "weight-loss",
    label: "Weight Loss",
    description: "Safety-first education on metabolic care and next steps.",
    clusters: ["weight-loss-metabolic-care"],
    personaHandOff: "ryan",
    whyThisExists:
      "Metabolic care is personal. We start with education and safety, then guide you to an appropriate consult if you choose.",
  },
  {
    id: "hormones-energy",
    label: "Hormones & Energy",
    description: "Education on evaluation, monitoring, and clinical decision-making.",
    clusters: ["hormones-wellness"],
    personaHandOff: "ryan",
    whyThisExists:
      "Hormone care requires thoughtful screening and follow-up. This path sets expectations before you book.",
  },
  {
    id: "skin-health",
    label: "Skin Health",
    description: "Texture, tone, glow, and long-term skin confidence.",
    clusters: ["skin-regeneration"],
    personaHandOff: "peppi",
    whyThisExists:
      "Skin improves through consistency. We’ll help you understand what changes—and what doesn’t—without making promises.",
  },
  {
    id: "hair-restoration",
    label: "Hair Restoration",
    description: "Education-first hair goals support (add inventory here as needed).",
    clusters: ["hair-restoration"],
    personaHandOff: "ryan",
    whyThisExists:
      "Hair goals are nuanced. Education helps you ask the right questions before an in-person evaluation.",
  },
  {
    id: "pain-recovery",
    label: "Pain / Recovery",
    description: "Education-first recovery pathways and safe escalation.",
    clusters: ["pain-recovery"],
    personaHandOff: "ryan",
    whyThisExists:
      "When pain is involved, safety matters most. We can educate at a high level and guide you to the right next step.",
  },
  {
    id: "iv-wellness",
    label: "IV Therapy & Wellness",
    description: "Hydration and wellness support with screening.",
    clusters: ["iv-therapy-recovery"],
    personaHandOff: "ryan",
    whyThisExists:
      "Wellness support should still be safe. We’ll keep this educational and guide you to screening and booking when ready.",
  },
  {
    id: "lashes-brows-beauty",
    label: "Lashes, Brows & Beauty",
    description: "Everyday beauty services (inventory can be added from your catalog).",
    clusters: ["lashes-brows-beauty"],
    personaHandOff: "peppi",
    whyThisExists:
      "Sometimes what you want is simple: a confidence boost. This path keeps exploration easy and pressure-free.",
  },
  {
    id: "not-sure",
    label: "I’m not sure yet",
    description: "That’s welcome here. Start with clarity.",
    clusters: ["medical-visits-consultations", "aesthetics-injectables", "skin-regeneration"],
    personaHandOff: "peppi",
    whyThisExists:
      "You don’t need perfect words to begin. We’ll start with what you’re feeling and help you find the safest next step.",
  },
] as const;

export const ATLAS_SERVICES: readonly ServiceAtlasCard[] = SERVICES.map((s) => {
  const defaultPersona = pickPersonaForSlug(s.slug);
  const base: ServiceAtlasCard = {
    slug: s.slug,
    name: s.name,
    plainLanguage: s.short,
    commonlyHelpsWith: [
      "Clarity about what to expect",
      "A plan that fits your comfort level",
      "Education-first decision-making",
    ],
    oftenFor: [
      "People who want natural-looking results",
      "People who value safety and clear expectations",
      "People who prefer a consult-first approach",
    ],
    mayNotBeFor: [
      "Anyone needing diagnosis or medical clearance online",
      "Anyone seeking a guaranteed result",
    ],
    intensity: s.category === "Wellness" ? "Advanced" : s.category === "Regenerative" ? "Moderate" : "Gentle",
    commitment: s.category === "Wellness" ? "Program-based" : "Maintenance",
    defaultPersona,
  };
  return base;
});

export const CATEGORY_SLUGS: readonly ServiceAtlasClusterId[] = ATLAS_CLUSTERS.map((c) => c.id);

export function getCluster(id: ServiceAtlasClusterId) {
  return ATLAS_CLUSTERS.find((c) => c.id === id) ?? ATLAS_CLUSTERS[0];
}

export function getServiceCard(slug: string) {
  return ATLAS_SERVICES.find((s) => s.slug === slug);
}

export function servicesForCluster(id: ServiceAtlasClusterId) {
  const cluster = getCluster(id);
  const set = new Set(cluster.serviceSlugs);
  return ATLAS_SERVICES.filter((s) => set.has(s.slug));
}

export function clusterTitleFromSlug(slug: ServiceAtlasClusterId) {
  return getCluster(slug).title;
}

export function maybeCategorySlug(slug: string): slug is ServiceAtlasClusterId {
  return (CATEGORY_SLUGS as readonly string[]).includes(slug);
}

export function clusterForServiceSlug(serviceSlug: string): ServiceAtlasClusterId | null {
  for (const c of ATLAS_CLUSTERS) if (c.serviceSlugs.includes(serviceSlug)) return c.id;
  return null;
}

