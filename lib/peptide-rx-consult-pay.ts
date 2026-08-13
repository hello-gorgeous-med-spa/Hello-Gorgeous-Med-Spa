/** Client-side consult pre-pay state (Square Payment Link return + session persistence). */

const PAID_REFS_KEY = "hg-rx-consult-paid-refs";
const PENDING_SUCCESS_KEY = "hg-rx-pending-success";
const PENDING_SCREENER_KEY = "hg-rx-pending-screener";

/**
 * Screener answers held while the client is away at Square paying the $49
 * consult fee, so the rest of the intake resumes instead of restarting.
 */
export type PendingRxScreener = {
  reference: string;
  data: Record<string, unknown>;
};

export function newConsultReference(): string {
  const stamp = Date.now().toString(36).toUpperCase().slice(-6);
  const rand = Math.random().toString(36).toUpperCase().slice(2, 6);
  return `HGP${stamp}${rand}`;
}

export type PendingRxSuccess = {
  kind: "qualified";
  reference: string;
  requestType: "new" | "refill";
  recordToken?: string;
};

function readPaidRefs(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = sessionStorage.getItem(PAID_REFS_KEY);
    if (!raw) return new Set();
    const list = JSON.parse(raw) as string[];
    return new Set(Array.isArray(list) ? list : []);
  } catch {
    return new Set();
  }
}

function writePaidRefs(refs: Set<string>) {
  sessionStorage.setItem(PAID_REFS_KEY, JSON.stringify([...refs]));
}

export function markConsultPaid(reference: string) {
  if (!reference) return;
  const refs = readPaidRefs();
  refs.add(reference);
  writePaidRefs(refs);
}

export function isConsultPaid(reference: string): boolean {
  if (!reference) return false;
  return readPaidRefs().has(reference);
}

export function savePendingRxSuccess(result: PendingRxSuccess) {
  sessionStorage.setItem(PENDING_SUCCESS_KEY, JSON.stringify(result));
}

export function readPendingRxSuccess(): PendingRxSuccess | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(PENDING_SUCCESS_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as PendingRxSuccess;
    if (data?.kind !== "qualified" || !data.reference) return null;
    return data;
  } catch {
    return null;
  }
}

export function clearPendingRxSuccess() {
  sessionStorage.removeItem(PENDING_SUCCESS_KEY);
}

export function savePendingScreener(pending: PendingRxScreener) {
  try {
    sessionStorage.setItem(PENDING_SCREENER_KEY, JSON.stringify(pending));
  } catch {
    /* private browsing — client can still re-enter the screener */
  }
}

export function readPendingScreener(): PendingRxScreener | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(PENDING_SCREENER_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as PendingRxScreener;
    if (!data?.reference || typeof data.data !== "object" || data.data === null) return null;
    return data;
  } catch {
    return null;
  }
}

export function clearPendingScreener() {
  try {
    sessionStorage.removeItem(PENDING_SCREENER_KEY);
  } catch {
    /* ignore */
  }
}

/** Square Payment Link — same pattern as Vitamin Bar pre-pay. */
export async function startConsultCheckout(
  reference: string,
  returnTo: "form" | "app" = "form",
): Promise<{ error?: string }> {
  try {
    const res = await fetch("/api/peptide-request/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reference, returnTo }),
    });
    const data = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
    if (!res.ok || !data.url) {
      return { error: data.error || "Could not start payment. Call 630-636-6193 to pay by phone." };
    }
    window.location.href = data.url;
    return {};
  } catch {
    return { error: "Network error starting payment." };
  }
}
