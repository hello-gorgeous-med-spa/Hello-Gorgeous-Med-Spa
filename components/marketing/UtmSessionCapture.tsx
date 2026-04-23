"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { captureUtmFromUrl, getStoredUtm, inferLeadSourceBucket } from "@/lib/utm-session";
import { CONTOUR_LIFT_EVENTS, pushContourLiftEvent } from "@/lib/contour-lift-analytics";

function isNoTrackPath(pathname: string | null): boolean {
  if (!pathname) return false;
  return pathname.startsWith("/admin") || pathname.startsWith("/portal") || pathname.startsWith("/login");
}

function UtmSessionCaptureInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastKey = useRef<string>("");

  useEffect(() => {
    if (isNoTrackPath(pathname)) return;
    const qs = searchParams?.toString() ?? "";
    const key = `${pathname}?${qs}`;
    if (key === lastKey.current) return;
    lastKey.current = key;

    const changed = captureUtmFromUrl();
    if (changed) {
      const utm = getStoredUtm();
      pushContourLiftEvent(CONTOUR_LIFT_EVENTS.utmPersist, {
        lead_source_bucket: inferLeadSourceBucket(
          utm,
          typeof document !== "undefined" ? document.referrer : undefined
        ),
        utm_source: utm.utm_source,
        utm_medium: utm.utm_medium,
        utm_campaign: utm.utm_campaign,
      });
    }
  }, [pathname, searchParams]);

  return null;
}

/** Captures UTM + click IDs from URL into sessionStorage on every navigation. */
export function UtmSessionCapture() {
  return (
    <Suspense fallback={null}>
      <UtmSessionCaptureInner />
    </Suspense>
  );
}
