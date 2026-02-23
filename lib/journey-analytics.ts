/**
 * Analytics events for HG Roadmap™ journey.
 * Fires: journey_started, roadmap_generated, roadmap_emailed, roadmap_booked (on Book CTA click)
 */
declare global {
  interface Window {
    gtag?: (command: string, action: string, params?: Record<string, unknown>) => void;
  }
}

export type JourneyAnalyticsEvent =
  | "journey_started"
  | "roadmap_generated"
  | "roadmap_emailed"
  | "roadmap_booked";

export function trackJourneyEvent(
  event: JourneyAnalyticsEvent,
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
