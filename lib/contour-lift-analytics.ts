/**
 * Hello Gorgeous Contour Lift™ — unified dataLayer + GA4 gtag + Meta trackCustom.
 * Event names are stable for GTM triggers and Meta custom conversions.
 */

export const CONTOUR_LIFT_EVENTS = {
  pageView: "contour_lift_page_view",
  homeCta: "contour_lift_home_cta_click",
  bookClick: "contour_lift_book_click",
  smsClick: "contour_lift_sms_click",
  leadSubmit: "contour_lift_lead_submit",
  thankyouView: "contour_lift_thankyou_view",
  thankyouExplore: "contour_lift_thankyou_explore",
  utmPersist: "contour_lift_utm_persist",
  videoSection: "contour_lift_video_section_view",
  videoEngage: "contour_lift_video_engagement",
  candidateCta: "contour_lift_candidate_cta_click",
  /** Fires on successful clinical intake (no PII; procedure + boolean flags only). */
  clinicalIntakeSubmit: "contour_lift_clinical_intake_submit",
} as const;

export function pushContourLiftEvent(
  eventName: string,
  params?: Record<string, string | number | boolean | undefined>
) {
  if (typeof window === "undefined") return;
  const flat: Record<string, string | number | boolean> = { procedure: "contour_lift" };
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v === undefined) continue;
      flat[k] = v;
    }
  }
  const w = window as unknown as {
    dataLayer?: unknown[];
    gtag?: (cmd: string, target: string, name: string, p?: Record<string, unknown>) => void;
    fbq?: (action: string, name: string, p?: Record<string, unknown>) => void;
  };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event: eventName, ...flat });
  if (w.gtag) {
    w.gtag("event", eventName, flat);
  }
  if (w.fbq) {
    w.fbq("trackCustom", eventName, flat);
  }
}

/** Meta standard Lead — use on thank-you page only to avoid duplicates. */
export function trackMetaLead(params?: Record<string, string>) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { fbq?: (action: string, name: string, p?: Record<string, unknown>) => void };
  if (!w.fbq) return;
  w.fbq("track", "Lead", {
    content_name: "Contour Lift Inquiry",
    ...params,
  });
}
