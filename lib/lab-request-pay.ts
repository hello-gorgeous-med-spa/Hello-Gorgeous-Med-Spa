/** Client-side lab panel pre-pay (Square Payment Link return). */

import { LAB_REQUEST_PATH } from "@/lib/flows";

const PAID_REFS_KEY = "hg-lab-request-paid-refs";
const PENDING_SUCCESS_KEY = "hg-lab-request-pending-success";

export type PendingLabRequestSuccess = {
  kind: "qualified";
  reference: string;
  submissionId?: string;
  priceLabel?: string;
  lineLabel?: string;
  priceUsd?: number;
  invoiceTemplateId?: string;
  panelId?: string;
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

export function markLabRequestPaid(reference: string) {
  if (!reference) return;
  const refs = readPaidRefs();
  refs.add(reference);
  writePaidRefs(refs);
}

export function isLabRequestPaid(reference: string): boolean {
  if (!reference) return false;
  return readPaidRefs().has(reference);
}

export function savePendingLabRequestSuccess(result: PendingLabRequestSuccess) {
  sessionStorage.setItem(PENDING_SUCCESS_KEY, JSON.stringify(result));
}

export function readPendingLabRequestSuccess(): PendingLabRequestSuccess | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(PENDING_SUCCESS_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as PendingLabRequestSuccess;
    if (data?.kind !== "qualified" || !data.reference) return null;
    return data;
  } catch {
    return null;
  }
}

export async function startLabRequestCheckout(input: {
  reference: string;
  submissionId?: string;
  templateId: string;
  amountUsd: number;
  lineLabel?: string;
  panelId?: string;
}): Promise<{ error?: string }> {
  try {
    const res = await fetch("/api/lab-request/checkout", {
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

export function cleanLabRequestReturnUrl(): string {
  if (typeof window === "undefined") return LAB_REQUEST_PATH;
  const url = new URL(window.location.href);
  url.searchParams.delete("paid");
  url.searchParams.delete("ref");
  return `${url.pathname}${url.search}`;
}
