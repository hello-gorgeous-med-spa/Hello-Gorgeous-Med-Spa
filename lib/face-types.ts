/**
 * HG Face Blueprint™ – types for API and AI output.
 * No prompts or pricing logic. Server-side only for AI.
 */

export type FaceIntensityLevel = "subtle" | "balanced" | "dramatic";

/** Phase 1 services (match API enum; no hardcoded limits in frontend) */
export type FaceServiceId =
  | "botox_smoothing"
  | "lip_filler_volume"
  | "chin_projection"
  | "jawline_contour"
  | "undereye_correction"
  | "co2_texture_smoothing";

export type FaceConversionStatus = "generated" | "emailed" | "booked";

export interface FaceBlueprintAIOutput {
  aesthetic_summary: string;
  recommended_priority_order: string[];
  estimated_investment_range: string;
  confidence_message: string;
}

export interface FaceSessionRow {
  id: string;
  created_at: string;
  user_id: string | null;
  roadmap_id: string | null;
  selected_services: FaceServiceId[];
  intensity_level: FaceIntensityLevel;
  consent_given: boolean;
  image_hash: string | null;
  ai_summary: FaceBlueprintAIOutput | null;
  conversion_status: FaceConversionStatus;
}
