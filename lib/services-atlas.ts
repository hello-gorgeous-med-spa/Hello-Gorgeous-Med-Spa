import { SERVICES, type Service } from "./seo";
import type { PersonaId } from "./personas/types";

// Service Atlas - Organized clusters of services for easy navigation

export type ServiceAtlasClusterId = 
  | "injectables" 
  | "skin-treatments" 
  | "body-wellness" 
  | "regenerative";

export type DiscoveryOptionId = 
  | "aging-prevention"
  | "volume-restoration"
  | "skin-clarity"
  | "wellness-optimization"
  | "just-exploring";

export interface ServiceAtlasCluster {
  id: ServiceAtlasClusterId;
  title: string;
  description: string;
  icon: string;
  services: string[]; // slugs
  personaDefault: PersonaId;
}

export interface DiscoveryOption {
  id: DiscoveryOptionId;
  label: string;
  description: string;
  whyThisExists: string;
  clusters: ServiceAtlasClusterId[];
  personaHandOff: PersonaId;
}

export interface AtlasService {
  slug: string;
  name: string;
  plainLanguage: string;
  commonlyHelpsWith: string[];
  oftenFor: string[];
  mayNotBeFor: string[];
  intensity: string;
  commitment: string;
  defaultPersona: PersonaId;
  cluster: ServiceAtlasClusterId;
}

export interface Comparison {
  id: string;
  title: string;
  disclaimer: string;
  columns: string[];
  rows: { label: string; values: string[] }[];
}

export interface CarePathway {
  id: string;
  title: string;
  description: string;
  steps: { label: string; cluster: ServiceAtlasClusterId; notes: string }[];
  disclaimer: string;
}

export const ATLAS_CLUSTERS: ServiceAtlasCluster[] = [
  {
    id: "injectables",
    title: "Injectables & Fillers",
    description: "Smooth wrinkles, restore volume, and enhance your natural beauty with precision injectables administered by expert providers.",
    icon: "💉",
    services: ["botox-dysport-jeuveau", "dermal-fillers", "lip-filler", "kybella"],
    personaDefault: "filla-grace",
  },
  {
    id: "skin-treatments",
    title: "Skin Treatments & Facials",
    description: "Advanced skin rejuvenation therapies designed to reveal your healthiest, most radiant complexion.",
    icon: "✨",
    services: [
      "rf-microneedling",
      "chemical-peels", 
      "hydra-facial",
      "geneo-facial",
      "ipl-photofacial",
      "laser-hair-removal",
      "salmon-dna-glass-facial",
    ],
    personaDefault: "peppi",
  },
  {
    id: "body-wellness",
    title: "Body & Wellness",
    description: "Medical-grade wellness solutions for weight management, hormone optimization, and total vitality support.",
    icon: "⚡",
    services: [
      "weight-loss-therapy",
      "biote-hormone-therapy",
      "trt-replacement-therapy",
      "sermorelin-growth-peptide",
      "iv-therapy",
      "vitamin-injections",
    ],
    personaDefault: "peppi",
  },
  {
    id: "regenerative",
    title: "Regenerative Aesthetics",
    description: "Harness your body's natural healing power with cutting-edge PRP and PRF treatments for lasting rejuvenation.",
    icon: "🧬",
    services: ["ez-prf-gel", "prp", "prp-facial", "prp-joint-injections", "prf-prp"],
    personaDefault: "peppi",
  },
];

export const DISCOVERY_OPTIONS: DiscoveryOption[] = [
  {
    id: "aging-prevention",
    label: "I want to prevent or slow signs of aging",
    description: "Explore options for maintaining youthful skin and preventing fine lines before they deepen.",
    whyThisExists: "Many people start their journey wanting to be proactive. These clusters focus on prevention and early intervention.",
    clusters: ["injectables", "skin-treatments"],
    personaHandOff: "filla-grace",
  },
  {
    id: "volume-restoration",
    label: "I've noticed volume loss or deeper lines",
    description: "Learn about restoring lost volume in cheeks, lips, or other areas that have changed over time.",
    whyThisExists: "Volume loss is natural with age. These services help restore balance and harmony to your face.",
    clusters: ["injectables", "regenerative"],
    personaHandOff: "filla-grace",
  },
  {
    id: "skin-clarity",
    label: "I want clearer, healthier-looking skin",
    description: "Explore facials, peels, and treatments designed to improve texture, tone, and radiance.",
    whyThisExists: "Skin health is foundational. These treatments address concerns like acne, dullness, and uneven texture.",
    clusters: ["skin-treatments", "regenerative"],
    personaHandOff: "peppi",
  },
  {
    id: "wellness-optimization",
    label: "I want to feel better overall (energy, weight, hormones)",
    description: "Learn about medical wellness options for weight management, hormone balance, and vitality.",
    whyThisExists: "Wellness is about more than aesthetics. These services support how you feel from the inside out.",
    clusters: ["body-wellness"],
    personaHandOff: "peppi",
  },
  {
    id: "just-exploring",
    label: "I'm just exploring — show me everything",
    description: "No specific concern? Browse all available services and clusters at your own pace.",
    whyThisExists: "Curiosity is a valid starting point. Explore freely with no pressure to book.",
    clusters: ["injectables", "skin-treatments", "body-wellness", "regenerative"],
    personaHandOff: "peppi",
  },
];

// Build ATLAS_SERVICES from SERVICES with additional metadata
export const ATLAS_SERVICES: AtlasService[] = SERVICES.map((service) => {
  const cluster = getClusterForServiceSlug(service.slug);
  return {
    slug: service.slug,
    name: service.name,
    plainLanguage: service.short,
    commonlyHelpsWith: getCommonlyHelpsWith(service),
    oftenFor: getOftenFor(service),
    mayNotBeFor: getMayNotBeFor(service),
    intensity: getIntensity(service),
    commitment: getCommitment(service),
    defaultPersona: getDefaultPersona(service),
    cluster: cluster?.id || "injectables",
  };
});

export const COMPARISONS: Comparison[] = [
  {
    id: "botox-vs-dysport-vs-jeuveau",
    title: "Botox vs. Dysport vs. Jeuveau (Neuromodulators)",
    disclaimer: "This comparison is for educational purposes only. Individual results and suitability vary. Consult with a provider for personalized recommendations.",
    columns: ["Botox", "Dysport", "Jeuveau"],
    rows: [
      { label: "Onset", values: ["3-5 days", "2-3 days", "2-3 days"] },
      { label: "Duration", values: ["3-4 months", "3-4 months", "3-4 months"] },
      { label: "Spread", values: ["Precise", "More diffuse", "Precise"] },
      { label: "Best for", values: ["Most areas", "Larger areas", "Glabellar lines"] },
      { label: "FDA approved since", values: ["2002", "2009", "2019"] },
    ],
  },
  {
    id: "ha-fillers-vs-biostimulators",
    title: "HA Fillers vs. Biostimulators",
    disclaimer: "Results depend on individual factors. This is not medical advice. A consultation is required for recommendations.",
    columns: ["HA Fillers", "Biostimulators"],
    rows: [
      { label: "How it works", values: ["Adds instant volume with hyaluronic acid", "Stimulates collagen over time"] },
      { label: "Results seen", values: ["Immediately", "Gradually (2-3 months)"] },
      { label: "Duration", values: ["6-18 months", "2+ years"] },
      { label: "Reversible", values: ["Yes (with hyaluronidase)", "No"] },
      { label: "Best for", values: ["Lips, cheeks, nasolabial folds", "Overall facial rejuvenation"] },
    ],
  },
  {
    id: "prp-vs-prf",
    title: "PRP vs. PRF",
    disclaimer: "These are regenerative treatments using your own blood. Individual results vary. Consult a provider.",
    columns: ["PRP", "PRF"],
    rows: [
      { label: "Processing", values: ["Higher spin speed", "Lower spin speed"] },
      { label: "Contains", values: ["Platelets, plasma", "Platelets, fibrin, white blood cells"] },
      { label: "Growth factor release", values: ["Immediate burst", "Sustained release"] },
      { label: "Texture", values: ["Liquid", "Gel-like (can be injected)"] },
      { label: "Longevity of effects", values: ["Shorter", "Longer-lasting"] },
    ],
  },
];

export const CARE_PATHWAYS: CarePathway[] = [
  {
    id: "prevention-pathway",
    title: "Prevention-Focused Journey",
    description: "For those in their 20s-30s wanting to maintain youthful skin proactively.",
    steps: [
      { label: "Start", cluster: "skin-treatments", notes: "Begin with a quality skincare routine and occasional facials" },
      { label: "Add", cluster: "injectables", notes: "Consider preventative Botox for areas with early movement lines" },
      { label: "Maintain", cluster: "skin-treatments", notes: "Regular treatments to maintain results over time" },
    ],
    disclaimer: "This pathway is conceptual. Your actual journey should be guided by a provider based on your individual needs.",
  },
  {
    id: "restoration-pathway",
    title: "Restoration & Rejuvenation",
    description: "For those noticing changes and wanting to restore a refreshed appearance.",
    steps: [
      { label: "Assess", cluster: "injectables", notes: "Start with neuromodulators to soften existing lines" },
      { label: "Restore", cluster: "injectables", notes: "Add fillers for lost volume in cheeks, lips, or under-eyes" },
      { label: "Enhance", cluster: "skin-treatments", notes: "Improve texture with microneedling or laser treatments" },
    ],
    disclaimer: "Individual journeys vary significantly. This is for educational illustration only.",
  },
  {
    id: "wellness-pathway",
    title: "Total Wellness Approach",
    description: "For those wanting to optimize how they feel, not just how they look.",
    steps: [
      { label: "Foundation", cluster: "body-wellness", notes: "Address hormones, energy, or weight concerns first" },
      { label: "Support", cluster: "body-wellness", notes: "Add IV therapy or vitamin support as needed" },
      { label: "Complement", cluster: "skin-treatments", notes: "Once you feel good inside, enhance your glow outside" },
    ],
    disclaimer: "Wellness treatments require medical evaluation. This pathway is for conceptual understanding only.",
  },
];

// Helper functions

function getClusterForServiceSlug(slug: string): ServiceAtlasCluster | undefined {
  return ATLAS_CLUSTERS.find((c) => c.services.includes(slug));
}

// Check if a slug is a category
export function maybeCategorySlug(slug: string): slug is ServiceAtlasClusterId {
  return ATLAS_CLUSTERS.some((c) => c.id === slug);
}

// Get services for a cluster
export function servicesForCluster(clusterId: ServiceAtlasClusterId): AtlasService[] {
  return ATLAS_SERVICES.filter((s) => s.cluster === clusterId);
}

// Get the cluster a service belongs to
export function getClusterForService(serviceSlug: string): ServiceAtlasCluster | null {
  return ATLAS_CLUSTERS.find((c) => c.services.includes(serviceSlug)) || null;
}

function getCommonlyHelpsWith(service: Service): string[] {
  const defaults: Record<string, string[]> = {
    "botox-dysport-jeuveau": ["Forehead lines", "Frown lines (11s)", "Crow's feet", "Bunny lines"],
    "dermal-fillers": ["Cheek volume loss", "Nasolabial folds", "Marionette lines", "Jawline definition"],
    "lip-filler": ["Thin lips", "Asymmetry", "Lost volume", "Undefined lip border"],
    "kybella": ["Submental fullness (double chin)", "Jawline definition"],
    "weight-loss-therapy": ["Weight management", "Appetite control", "Metabolic support"],
    "biote-hormone-therapy": ["Fatigue", "Mood changes", "Sleep issues", "Weight fluctuations"],
    "iv-therapy": ["Dehydration", "Low energy", "Immune support", "Recovery"],
    "rf-microneedling": ["Skin texture", "Pore size", "Mild laxity", "Acne scars"],
    "chemical-peels": ["Dullness", "Uneven texture", "Hyperpigmentation", "Acne"],
  };
  return defaults[service.slug] || ["Varies by individual", "Consult for specifics"];
}

function getOftenFor(service: Service): string[] {
  switch (service.category) {
    case "Injectables":
      return ["Adults seeking natural-looking enhancement", "Those wanting to prevent or treat visible aging", "People who value subtle, expert results"];
    case "Wellness":
      return ["Adults seeking improved energy and vitality", "Those with specific health optimization goals", "People committed to lifestyle changes"];
    case "Regenerative":
      return ["Those seeking natural rejuvenation", "People interested in using their body's own healing", "Adults wanting progressive improvement"];
    default:
      return ["Those seeking improved skin health", "People wanting a refreshed appearance", "Adults who value self-care"];
  }
}

function getMayNotBeFor(service: Service): string[] {
  const common = ["Pregnant or nursing individuals (for most treatments)", "Those with certain medical conditions (consult required)"];
  switch (service.category) {
    case "Injectables":
      return [...common, "Those with unrealistic expectations", "People with certain allergies"];
    case "Wellness":
      return [...common, "Those who cannot commit to ongoing protocols", "People with contraindicated conditions"];
    default:
      return [...common, "Specific exclusions vary by treatment"];
  }
}

function getIntensity(service: Service): string {
  switch (service.category) {
    case "Injectables":
      return "Low-Medium";
    case "Wellness":
      return "Medium";
    case "Regenerative":
      return "Medium";
    case "Aesthetics":
      return service.slug.includes("laser") || service.slug.includes("rf") 
        ? "Medium-High" 
        : "Low-Medium";
    default:
      return "Varies";
  }
}

function getCommitment(service: Service): string {
  switch (service.category) {
    case "Injectables":
      return "Single session, maintenance every 3-12 months";
    case "Wellness":
      return "Ongoing program";
    case "Regenerative":
      return "Series recommended";
    case "Aesthetics":
      return service.slug.includes("facial") 
        ? "Single or series" 
        : "Series for best results";
    default:
      return "Consult for plan";
  }
}

function getDefaultPersona(service: Service): PersonaId {
  switch (service.category) {
    case "Injectables":
      return "filla-grace";
    default:
      return "peppi";
  }
}
