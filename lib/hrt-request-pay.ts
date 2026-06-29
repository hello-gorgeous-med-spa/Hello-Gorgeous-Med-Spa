/** Client-side HRT medication pre-pay (Square Payment Link return). */

import { HRT_REQUEST_PATH } from "@/lib/flows";

const PAID_REFS_KEY = "hg-hrt-request-paid-refs";
const PENDING_SUCCESS_KEY = "hg-hrt-request-pending-success";

export type PendingHrtRequestSuccess = {
  kind: "qualified";
  reference: string;
  submissionId?: string;
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
  sessionStorage.setItem(PAID_REFS_KEY, JSON.stringify([...refs]));
}

export function markHrtRequestPaid(reference: string) {
  if (!reference) return;
  const refs = readPaidRefs();
  refs.add(reference);
  writePaidRefs(refs);
}

export function isHrtRequestPaid(reference: string): boolean {
  if (!reference) return false;
  return readPaidRefs().has(reference);
}

export function savePendingHrtRequestSuccess(result: PendingHrtRequestSuccess) {
  sessionStorage.setItem(PENDING_SUCCESS_KEY, JSON.stringify(result));
}

export function readPendingHrtRequestSuccess(): PendingHrtRequestSuccess | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(PENDING_SUCCESS_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as PendingHrtRequestSuccess;
    if (data?.kind !== "qualified" || !data.reference) return null;
    return data;
  } catch {
    return null;
  }
}

export async function startHrtRequestCheckout(input: {
  reference: string;
  submissionId?: string;
  templateId: string;
  amountUsd: number;
  supplyCycle?: string;
  lineLabel?: string;
}): Promise<{ error?: string }> {
  try {
    const res = await fetch("/api/hrt-request/checkout", {
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

export function cleanHrtRequestReturnUrl(): string {
  if (typeof window === "undefined") return HRT_REQUEST_PATH;
  const url = new URL(window.location.href);
  url.searchParams.delete("paid");
  url.searchParams.delete("ref");
  return `${url.pathname}${url.search}`;
}
