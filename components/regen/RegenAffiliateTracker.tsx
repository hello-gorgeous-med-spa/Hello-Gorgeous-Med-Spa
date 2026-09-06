"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

import { AFFILIATE_COOKIE, AFFILIATE_COOKIE_DAYS } from "@/lib/regen-affiliates";

function TrackerInner() {
  const searchParams = useSearchParams();
  const pathname = usePathname() || "";
  const code = (searchParams.get("ref") || searchParams.get("aff") || "").trim().toUpperCase();

  useEffect(() => {
    if (!code || code.length < 3) return;
    const existing = document.cookie.match(new RegExp(`(?:^|; )${AFFILIATE_COOKIE}=([^;]+)`));
    if (existing) return;
    const maxAge = AFFILIATE_COOKIE_DAYS * 24 * 60 * 60;
    document.cookie = `${AFFILIATE_COOKIE}=${encodeURIComponent(code)}; path=/; max-age=${maxAge}; samesite=lax`;
    fetch("/api/regen/affiliates/click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, path: pathname, source: searchParams.get("utm_source") || "" }),
    }).catch(() => undefined);
  }, [code, pathname, searchParams]);

  return null;
}

export function RegenAffiliateTracker() {
  return (
    <Suspense fallback={null}>
      <TrackerInner />
    </Suspense>
  );
}

export function readAffiliateCodeClient(): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(new RegExp(`(?:^|; )${AFFILIATE_COOKIE}=([^;]+)`));
  return match ? decodeURIComponent(match[1]).toUpperCase() : "";
}
