/**
 * Handoff from Start Here → full peptide request intake.
 * Stored in sessionStorage (one-time read on /peptide-request).
 */

export const RX_START_PREFILL_KEY = "hg-rx-start-prefill";

export type RxStartPrefill = {
  peptideId: string;
  peptideName: string;
  requestType: "new" | "refill";
  pregnant?: string;
  existingPatient?: string;
  lastVisitWithin12mo?: string;
  verifiedAt: string;
};

export function saveRxStartPrefill(data: Omit<RxStartPrefill, "verifiedAt">): void {
  if (typeof window === "undefined") return;
  const payload: RxStartPrefill = { ...data, verifiedAt: new Date().toISOString() };
  sessionStorage.setItem(RX_START_PREFILL_KEY, JSON.stringify(payload));
}

export function readRxStartPrefill(): RxStartPrefill | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(RX_START_PREFILL_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as RxStartPrefill;
    if (!parsed.peptideId || !parsed.requestType) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearRxStartPrefill(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(RX_START_PREFILL_KEY);
}

export function requestTypeLabel(type: "new" | "refill"): string {
  return type === "refill" ? "Refill of existing protocol" : "New peptide protocol";
}
