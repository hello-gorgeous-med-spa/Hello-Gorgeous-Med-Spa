/** Client-side peptide refill payment (Square Payment Link return). */

import { PEPTIDE_REQUEST_PATH } from "@/lib/flows";

const PAID_REFS_KEY = "hg-peptide-refill-paid-refs";
const PENDING_SUCCESS_KEY = "hg-peptide-refill-pending-success";

export type PendingPeptideRefillSuccess = {
  kind: "qualified";
  reference: string;
  submissionId?: string;
  requestType: "refill";
  priceLabel?: string;
  lineLabel?: string;
  priceUsd?: number;
  invoiceTemplateId?: string;
  supplyCycle?: string;
  savingsNote?: string;
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
  sessionStorage.setItem(PAID_REFS_KEY, JSON.stringify(Array.from(refs)));
}

export function markPeptideRefillPaid(reference: string) {
  if (!reference) return;
  const refs = readPaidRefs();
  refs.add(reference);
  writePaidRefs(refs);
}

export function isPeptideRefillPaid(reference: string): boolean {
  if (!reference) return false;
  return readPaidRefs().has(reference);
}

export function savePendingPeptideRefillSuccess(result: PendingPeptideRefillSuccess) {
  sessionStorage.setItem(PENDING_SUCCESS_KEY, JSON.stringify(result));
}

export function readPendingPeptideRefillSuccess(): PendingPeptideRefillSuccess | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(PENDING_SUCCESS_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as PendingPeptideRefillSuccess;
    if (data?.kind !== "qualified" || !data.reference) return null;
    return data;
  } catch {
    return null;
  }
}

export async function startPeptideRefillCheckout(input: {
  reference: string;
  submissionId?: string;
  templateId: string;
  amountUsd: number;
  supplyCycle?: string;
  lineLabel?: string;
}): Promise<{ error?: string }> {
  try {
    const res = await fetch("/api/peptide-refill/checkout", {
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

export async function startPeptideRefillAutopay(input: {
  reference: string;
  submissionId?: string;
  templateId: string;
  amountUsd?: number;
  lineLabel?: string;
  supplyCycle?: string;
}): Promise<{ error?: string; mode?: string }> {
  try {
    const res = await fetch("/api/peptide-refill/autopay", {
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

export function cleanPeptideRefillReturnUrl() {
  const url = new URL(window.location.href);
  url.searchParams.delete("refill_paid");
  url.searchParams.delete("autopay");
  url.searchParams.delete("ref");
  const clean = `${PEPTIDE_REQUEST_PATH}${url.search || ""}`;
  window.history.replaceState({}, "", clean);
}
