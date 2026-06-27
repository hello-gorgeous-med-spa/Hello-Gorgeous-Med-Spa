/** Client-side GLP-1 refill payment state (Square Payment Link return + session persistence). */

import { GLP1_REFILL_PATH } from "@/lib/flows";

const PAID_REFS_KEY = "hg-glp1-refill-paid-refs";
const PENDING_SUCCESS_KEY = "hg-glp1-refill-pending-success";

export type PendingGlp1RefillSuccess = {
  kind: "qualified";
  reference: string;
  submissionId?: string;
  priceLabel?: string;
  lineLabel?: string;
  priceUsd?: number;
  invoiceTemplateId?: string;
  medication?: string;
  supplyCycle?: string;
  savingsNote?: string;
  addon?: {
    id: string;
    shortLabel: string;
    monthlyUsd: number;
    invoiceTemplateId: string;
    lineLabel: string;
  } | null;
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

export function markGlp1RefillPaid(reference: string) {
  if (!reference) return;
  const refs = readPaidRefs();
  refs.add(reference);
  writePaidRefs(refs);
}

export function isGlp1RefillPaid(reference: string): boolean {
  if (!reference) return false;
  return readPaidRefs().has(reference);
}

export function savePendingGlp1RefillSuccess(result: PendingGlp1RefillSuccess) {
  sessionStorage.setItem(PENDING_SUCCESS_KEY, JSON.stringify(result));
}

export function readPendingGlp1RefillSuccess(): PendingGlp1RefillSuccess | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(PENDING_SUCCESS_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as PendingGlp1RefillSuccess;
    if (data?.kind !== "qualified" || !data.reference) return null;
    return data;
  } catch {
    return null;
  }
}

export function clearPendingGlp1RefillSuccess() {
  sessionStorage.removeItem(PENDING_SUCCESS_KEY);
}

export async function startGlp1RefillCheckout(
  input: {
    reference: string;
    submissionId?: string;
    templateId: string;
    amountUsd?: number;
    supplyCycle?: string;
  },
): Promise<{ error?: string }> {
  try {
    const res = await fetch("/api/glp1-refill/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
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

export async function startGlp1RefillAutopay(
  input: {
    reference: string;
    submissionId?: string;
    templateId: string;
    amountUsd?: number;
    lineLabel?: string;
    supplyCycle?: string;
  },
): Promise<{ error?: string; mode?: string }> {
  try {
    const res = await fetch("/api/glp1-refill/autopay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = (await res.json().catch(() => ({}))) as {
      url?: string;
      error?: string;
      mode?: string;
    };
    if (!res.ok || !data.url) {
      return { error: data.error || "Could not start auto-pay setup. Call 630-636-6193." };
    }
    window.location.href = data.url;
    return { mode: data.mode };
  } catch {
    return { error: "Network error starting auto-pay." };
  }
}

/** Strip Square return params after restoring success state. */
export function cleanGlp1RefillReturnUrl() {
  const url = new URL(window.location.href);
  url.searchParams.delete("paid");
  url.searchParams.delete("autopay");
  url.searchParams.delete("ref");
  const clean = `${GLP1_REFILL_PATH}${url.search || ""}`;
  window.history.replaceState({}, "", clean);
}
