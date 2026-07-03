import type { RxCategoryHubId } from "@/lib/rx-category-hubs";

export type CategoryMascot = {
  name: string;
  role: string;
  avatar: string;
  /** Short professional blurb — not a chat greeting */
  blurb: string;
};

/** Compact mascot accents for category lander Q&A (weight loss, peptides, hormones only). */
const CATEGORY_MASCOTS: Partial<Record<RxCategoryHubId, CategoryMascot>> = {
  "weight-loss": {
    name: "Slim-T",
    role: "GLP-1 & metabolic wellness",
    avatar: "/images/mascots/slim-t.png",
    blurb:
      "Questions about semaglutide, tirzepatide, or what to expect? Our NP reviews every protocol — mascots are here to orient you, not replace medical advice.",
  },
  peptides: {
    name: "Peppy",
    role: "Peptide therapy educator",
    avatar: "/images/mascots/peppy-avatar.png",
    blurb:
      "Recovery, longevity, and GH-axis peptides are nuanced. Read the FAQs below, then shop when you're ready — Ryan Kent, FNP-BC approves every order.",
  },
  hormones: {
    name: "Harmony",
    role: "Hormone balance guide",
    avatar: "/images/mascots/harmony.png",
    blurb:
      "TRT, HRT, and lab-guided dosing work best with clear expectations. These answers cover the basics; your intake captures what makes your case unique.",
  },
};

export function getCategoryMascot(hubId: RxCategoryHubId): CategoryMascot | null {
  return CATEGORY_MASCOTS[hubId] ?? null;
}
