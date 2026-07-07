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
  return "Formulation Rx";
}

export function vendorPortalUrl(key: PharmacyVendorKey): string | null {
  if (key === "formulation") return "https://formulationrx.com";
  if (key === "boomrx") return "https://wellsync.boomrx.com";
  if (key === "olympia") return "https://olympiapharmacy.drscriptportal.com";
  return null;
}
