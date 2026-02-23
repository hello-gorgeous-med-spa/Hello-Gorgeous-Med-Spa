/**
 * Analytics events for HG Face Blueprint™.
 * Payload: { session_id } where applicable.
 */
declare global {
  interface Window {
    gtag?: (command: string, action: string, params?: Record<string, unknown>) => void;
  }
}

export type FaceAnalyticsEvent =
  | "face_upload_started"
  | "face_landmarks_detected"
  | "face_simulation_generated"
  | "face_blueprint_saved"
  | "face_blueprint_booked";

export function trackFaceEvent(
  event: FaceAnalyticsEvent,
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
