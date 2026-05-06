import { NextResponse } from "next/server";
import { deriveRecommendationSeeds, emptyPersonalizationContext } from "@/lib/personalization-hooks";

export async function GET() {
  const context = emptyPersonalizationContext();
  const recommendationSeeds = deriveRecommendationSeeds(context);
  return NextResponse.json({
    context,
    recommendationSeeds,
    note: "Scaffolding endpoint for future returning-visitor personalization.",
  });
}
