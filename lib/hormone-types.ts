/**
 * Harmony AI™ – types for hormone intake and AI blueprint output.
 */

export interface HormoneIntake {
  age_range: string;
  biological_sex: string;
  menopause_status: string;
  top_symptoms: string[];
  sleep_quality: string;
  energy_level: string;
  weight_change: string;
  stress_level: string;
  prior_hormone_therapy: boolean;
}

export interface ProtocolItem {
  therapy: string;
  reason: string;
}

export interface HormoneBlueprintOutput {
  blueprint_title: string;
  likely_patterns: string[];
  severity_score: number;
  recommended_labs: string[];
  recommended_protocol: ProtocolItem[];
  timeline_expectation: string;
  estimated_investment_range: string;
  confidence_message: string;
}
