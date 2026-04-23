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
}: Props) {
  const [href, setHref] = useState("/book");

  useEffect(() => {
    const q = buildBookQueryFromStored();
    setHref(q ? `/book?${q}` : "/book?utm_campaign=contour_lift&utm_medium=website");
  }, []);

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
