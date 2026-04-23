"use client";

import { useEffect, useRef } from "react";
import { CONTOUR_LIFT_EVENTS, pushContourLiftEvent, trackMetaLead } from "@/lib/contour-lift-analytics";
import { CONTOUR_LIFT_INQUIRY_OK_KEY } from "@/lib/utm-session";

/** Meta Lead + thank-you event only after successful form (sessionStorage gate). */
export function ContourLiftThankYouTrack() {
  const once = useRef(false);

  useEffect(() => {
    if (once.current) return;
    once.current = true;
    let ok = false;
    try {
      ok = sessionStorage.getItem(CONTOUR_LIFT_INQUIRY_OK_KEY) === "1";
      if (ok) {
        sessionStorage.removeItem(CONTOUR_LIFT_INQUIRY_OK_KEY);
      }
    } catch {
      ok = false;
    }
    if (!ok) return;
    pushContourLiftEvent(CONTOUR_LIFT_EVENTS.thankyouView, { funnel_step: "post_inquiry" });
    trackMetaLead();
  }, []);

  return null;
}
