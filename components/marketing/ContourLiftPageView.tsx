"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { CONTOUR_LIFT_EVENTS, pushContourLiftEvent } from "@/lib/contour-lift-analytics";

type PageLocation = "home" | "quantum_rf" | "inquiry" | "model_experience" | "thank_you";

function mapPath(pathname: string | null): PageLocation | null {
  if (!pathname) return null;
  if (pathname === "/") return "home";
  if (pathname === "/services/quantum-rf" || pathname.startsWith("/services/quantum-rf/")) return "quantum_rf";
  if (pathname === "/contour-lift/inquiry" || pathname.startsWith("/contour-lift/inquiry")) return "inquiry";
  if (pathname === "/contour-lift/model-experience" || pathname.startsWith("/contour-lift/model-experience/"))
    return "model_experience";
  if (pathname === "/contour-lift/thank-you" || pathname.startsWith("/contour-lift/thank-you")) return "thank_you";
  return null;
}

/** Fires contour_lift_page_view once per page load for funnel / retargeting audiences. */
export function ContourLiftPageView() {
  const pathname = usePathname();
  const fired = useRef<string | null>(null);

  useEffect(() => {
    const loc = mapPath(pathname);
    if (!loc) return;
    const key = `${loc}:${pathname}`;
    if (fired.current === key) return;
    fired.current = key;
    pushContourLiftEvent(CONTOUR_LIFT_EVENTS.pageView, { page_location: loc });
  }, [pathname]);

  return null;
}
