/**
 * Harmony AI™ analytics events.
 */
declare global {
  interface Window {
    gtag?: (command: string, action: string, params?: Record<string, unknown>) => void;
  }
}

export type HormoneAnalyticsEvent =
  | "hormone_assessment_started"
  | "hormone_blueprint_generated"
  | "hormone_blueprint_emailed"
  | "hormone_blueprint_booked";

export function trackHarmonyEvent(
  event: HormoneAnalyticsEvent,
  params?: Record<string, unknown>
) {
  if (typeof window === "undefined") return;
  try {
    if (window.gtag) {
      window.gtag("event", event, params ?? {});
    }
  } catch {
    // no-op
  }
}
