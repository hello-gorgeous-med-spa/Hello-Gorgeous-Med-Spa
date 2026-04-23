"use client";

import { useEffect, useRef } from "react";
import { CONTOUR_LIFT_EVENTS, pushContourLiftEvent } from "@/lib/contour-lift-analytics";

const SECTION_ID = "contour-lift-videos";

/** Fires when the video block is ~50% visible (retargeting: “saw procedure video”). */
export function QuantumRFVideoEngagement() {
  const seen = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;
    const el = document.getElementById(SECTION_ID);
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && e.intersectionRatio >= 0.4 && !seen.current) {
            seen.current = true;
            pushContourLiftEvent(CONTOUR_LIFT_EVENTS.videoSection, { milestone: "section_50_visible" });
            obs.disconnect();
          }
        }
      },
      { threshold: [0, 0.4, 0.5, 0.6] }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return null;
}
