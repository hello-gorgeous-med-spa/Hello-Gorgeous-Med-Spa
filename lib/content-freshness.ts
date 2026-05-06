export type FreshnessAsset = {
  id: string;
  name: string;
  updateCadence: "weekly" | "biweekly" | "monthly";
  owner: string;
  sourcePath: string;
  purpose: string;
};

export const CONTENT_FRESHNESS_ASSETS: FreshnessAsset[] = [
  {
    id: "hub-pages",
    name: "Treatment hubs",
    updateCadence: "weekly",
    owner: "clinical + content",
    sourcePath: "lib/treatment-hubs.ts",
    purpose: "Update hub FAQs, local intent notes, related links, and provider commentary.",
  },
  {
    id: "concern-pages",
    name: "Concern pages",
    updateCadence: "weekly",
    owner: "content",
    sourcePath: "lib/concern-pages.ts",
    purpose: "Refresh concern language, option comparisons, and consultation FAQs.",
  },
  {
    id: "video-library",
    name: "Video transcripts and metadata",
    updateCadence: "weekly",
    owner: "content + social",
    sourcePath: "lib/video-library.ts",
    purpose: "Add new clips, transcript updates, category tags, and related service links.",
  },
  {
    id: "testimonial-system",
    name: "Tagged testimonial pipeline",
    updateCadence: "biweekly",
    owner: "operations",
    sourcePath: "lib/testimonial-system.ts",
    purpose: "Approve and tag reviews by treatment, concern, provider, and device.",
  },
  {
    id: "ai-graph",
    name: "AI visibility graph",
    updateCadence: "monthly",
    owner: "seo",
    sourcePath: "public/llms.txt + public/llms-full.txt + app/api/public/ai-profile/route.ts",
    purpose: "Keep assistants/search systems aligned with current authority pages and relationships.",
  },
];
