/**
 * Lip Studio analytics — event-level only. No image or landmark data.
 */
import { trackEvent } from "@/components/GoogleAnalytics";

export function trackLipStudioUploadInitiated() {
  trackEvent("lip_studio_upload_initiated", {});
}

export function trackLipStudioSimulationSelected(level: string) {
  trackEvent("lip_studio_simulation_selected", { level });
}

export function trackLipStudioCTAClick(source: "primary" | "peak_emotion") {
  trackEvent("lip_studio_cta_click", { source });
}

export function trackLipStudioTimeSpent(seconds: number) {
  trackEvent("lip_studio_time_spent", { seconds: Math.round(seconds) });
}
