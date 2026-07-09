"use client";

import { RegenCatalogPortal } from "@/components/regen/catalog/RegenCatalogPortal";

export function RegenCatalogClient({ initialGoalSlug }: { initialGoalSlug?: string }) {
  return <RegenCatalogPortal initialGoalSlug={initialGoalSlug} />;
}
