import type { PharmacyVendorKey } from "@/lib/rx-pharmacy-fulfillment/types";

/** Map catalog / ops pharmacy label → vendor adapter key (HGRX-040–042). */
export function pharmacyLabelToVendorKey(pharmacyLabel: string | null | undefined): PharmacyVendorKey {
  const n = String(pharmacyLabel || "").toLowerCase();
  if (n.includes("boom")) return "boomrx";
  if (n.includes("olympia")) return "olympia";
  return "formulation";
}

export function vendorKeyToDisplayName(key: PharmacyVendorKey): string {
  if (key === "boomrx") return "BoomRx";
  if (key === "olympia") return "Olympia";
  return "FormuConnect";
}

/** Staff login / place-order deep-links for each compounding pharmacy. */
export function vendorPortalUrl(key: PharmacyVendorKey): string | null {
  if (key === "formulation") {
    return (
      process.env.NEXT_PUBLIC_FORMULATION_PORTAL_URL?.trim() ||
      "https://portal.formuconnect.com/login"
    );
  }
  if (key === "boomrx") {
    return (
      process.env.NEXT_PUBLIC_BOOMRX_PORTAL_URL?.trim() ||
      "https://hub.wellsync.com/en-US/boomrx/auth/login?redirect_url=https%3A%2F%2Fportal.boomrx.com%2Fen-US%2Fboomrx&mode=login"
    );
  }
  if (key === "olympia") {
    return (
      process.env.NEXT_PUBLIC_OLYMPIA_PORTAL_URL?.trim() ||
      "https://olympiapharmacy.drscriptportal.com"
    );
  }
  return null;
}
