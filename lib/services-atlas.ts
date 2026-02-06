import { SERVICES, type Service } from "./seo";

// Service Atlas - Organized clusters of services for easy navigation

export type ServiceAtlasClusterId = 
  | "injectables" 
  | "skin-treatments" 
  | "body-wellness" 
  | "regenerative";

export interface ServiceAtlasCluster {
  id: ServiceAtlasClusterId;
  title: string;
  description: string;
  icon: string;
  services: string[]; // slugs
}

export const ATLAS_CLUSTERS: ServiceAtlasCluster[] = [
  {
    id: "injectables",
    title: "Injectables & Fillers",
    description: "Smooth wrinkles, restore volume, and enhance your natural beauty with precision injectables administered by expert providers.",
    icon: "💉",
    services: ["botox-dysport-jeuveau", "dermal-fillers", "lip-filler", "kybella"],
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
  },
  {
    id: "regenerative",
    title: "Regenerative Aesthetics",
    description: "Harness your body's natural healing power with cutting-edge PRP and PRF treatments for lasting rejuvenation.",
    icon: "🧬",
    services: ["ez-prf-gel", "prp", "prp-facial", "prp-joint-injections", "prf-prp"],
  },
];

// Check if a slug is a category
export function maybeCategorySlug(slug: string): slug is ServiceAtlasClusterId {
  return ATLAS_CLUSTERS.some((c) => c.id === slug);
}

// Get services for a cluster
export function servicesForCluster(clusterId: ServiceAtlasClusterId): (Service & { 
  intensity: string; 
  commitment: string; 
  plainLanguage: string;
})[] {
  const cluster = ATLAS_CLUSTERS.find((c) => c.id === clusterId);
  if (!cluster) return [];

  return cluster.services
    .map((slug) => {
      const service = SERVICES.find((s) => s.slug === slug);
      if (!service) return null;

      // Add intensity/commitment/plainLanguage based on category
      const intensity = getIntensity(service);
      const commitment = getCommitment(service);
      const plainLanguage = service.short;

      return { ...service, intensity, commitment, plainLanguage };
    })
    .filter((s): s is NonNullable<typeof s> => s !== null);
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
      return "Single session, maintenance every 3-12mo";
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

// Get the cluster a service belongs to
export function getClusterForService(serviceSlug: string): ServiceAtlasCluster | null {
  return ATLAS_CLUSTERS.find((c) => c.services.includes(serviceSlug)) || null;
}
