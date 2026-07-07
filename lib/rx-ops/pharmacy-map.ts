import type { RxClinicPharmacy } from "@/lib/rx-clinic-encounter";
import type { RxPharmacy } from "@/lib/rx-dispatch";

/** Map catalog pharmacy label → intake/clinic dispatch pharmacy id. */
export function mapCatalogPharmacyToDispatch(
  pharmacy: string | null | undefined,
): RxPharmacy | null {
  if (!pharmacy?.trim()) return null;
  const n = pharmacy.toLowerCase();
  if (n.includes("formulation")) return "formulation";
  if (n.includes("boom")) return "boomrx";
  return null;
}

export function mapCatalogPharmacyToClinic(
  pharmacy: string | null | undefined,
): RxClinicPharmacy | null {
  return mapCatalogPharmacyToDispatch(pharmacy);
}

/** RE GEN fulfillment stores the catalog label (Formulation Rx, BoomRx, Olympia). */
export function mapCatalogPharmacyToRegenSource(pharmacy: string | null | undefined): string {
  const trimmed = pharmacy?.trim();
  if (!trimmed) return "Formulation Rx";
  if (trimmed.toLowerCase().includes("boom")) return "BoomRx";
  if (trimmed.toLowerCase().includes("olympia")) return "Olympia";
  if (trimmed.toLowerCase().includes("formulation")) return "Formulation Rx";
  return trimmed;
}
