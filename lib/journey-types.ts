/**
 * HG Roadmap™ – types for journey intake and AI output.
 * Kept in sync with Supabase enums and API contract.
 */

export type DesiredChangeLevel = "subtle" | "balanced" | "dramatic";
export type ExperienceLevel = "first_time" | "experienced";
export type TimelinePreference = "immediate" | "flexible";
export type DowntimePreference = "minimal" | "okay_with_downtime";
export type DecisionStyle = "cautious" | "ready_now";
export type ConversionStatus = "generated" | "emailed" | "booked";

export interface JourneyIntake {
  primary_concern: string;
  desired_change_level: DesiredChangeLevel;
  experience_level: ExperienceLevel;
  timeline_preference: TimelinePreference;
  downtime_preference: DowntimePreference;
  decision_style: DecisionStyle;
}

export interface RecommendedServiceItem {
  service: string;
  reason: string;
  priority_order: number;
}

export interface RoadmapAIOutput {
  roadmap_title: string;
  recommended_services: RecommendedServiceItem[];
  estimated_sessions: string;
  timeline_estimate: string;
  estimated_cost_range: string;
  maintenance_plan: string;
  confidence_message: string;
}

export interface JourneySessionRow {
  id: string;
  created_at: string;
  user_id: string | null;
  primary_concern: string | null;
  desired_change_level: string | null;
  experience_level: string | null;
  timeline_preference: string | null;
  downtime_preference: string | null;
  decision_style: string | null;
  uploaded_image_url: string | null;
  ai_summary: RoadmapAIOutput | null;
  recommended_services: RecommendedServiceItem[] | null;
  estimated_cost_range: string | null;
  recommended_timeline: string | null;
  conversion_status: ConversionStatus;
}

export interface ServicePricingRow {
  service_name: string;
  min_price_cents: number;
  max_price_cents: number;
  avg_sessions: number;
}
