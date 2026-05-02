"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { buildBookQueryFromStored } from "@/lib/utm-session";

type Props = {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  "data-cl-event"?: string;
  "data-cl-placement"?: string;
  /** Default true: do not double-fire generic book_now_click */
  "data-cl-only"?: boolean;
  "data-book-now"?: boolean;
  /**
   * Optional Square service slug — passes `?service=<slug>` so /book deep-links
   * into the matching Square service. See lib/square/service-slugs.ts.
   */
  service?: string;
};

/**
 * /book with persisted UTM + default contour campaign (merged on client after mount).
 */
export function ContourBookLink({
  className,
  style,
  children,
  "data-cl-event": dataClEvent = "contour_lift_book_click",
  "data-cl-placement": dataClPlacement,
  "data-cl-only": dataClOnly = true,
  "data-book-now": dataBookNow,
  service,
}: Props) {
  const initial = service ? `/book?service=${encodeURIComponent(service)}` : "/book";
  const [href, setHref] = useState(initial);

  useEffect(() => {
    const q = buildBookQueryFromStored();
    const serviceParam = service ? `service=${encodeURIComponent(service)}` : "";
    const defaultUtm = "utm_campaign=contour_lift&utm_medium=website";
    const parts = [serviceParam, q || defaultUtm].filter(Boolean);
    setHref(parts.length ? `/book?${parts.join("&")}` : "/book");
  }, [service]);

  return (
    <Link
      href={href}
      className={className}
      style={style}
      scroll
      data-cl-event={dataClEvent}
      data-cl-placement={dataClPlacement}
      {...(dataClOnly ? { "data-cl-only": true } : {})}
      {...(dataBookNow ? { "data-book-now": true } : {})}
    >
      {children}
    </Link>
  );
}
