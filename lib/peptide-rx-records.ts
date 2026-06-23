/**
 * Client-side Hello Gorgeous RX™ request records (PWA / app).
 * Full access tokens are stored locally after submit — like a receipt link.
 */

export const PEPTIDE_RX_RECORDS_KEY = "hg-peptide-rx-records";

export type StoredRxRecord = {
  recordToken: string;
  reference: string;
  peptideNames: string[];
  requestType: "new" | "refill";
  submittedAt: string;
  qualified: boolean;
};

export type RxRecordSummary = StoredRxRecord & {
  statusLabel: string;
};

function readAll(): StoredRxRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PEPTIDE_RX_RECORDS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredRxRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(records: StoredRxRecord[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PEPTIDE_RX_RECORDS_KEY, JSON.stringify(records.slice(0, 50)));
}

export function getStoredRxRecords(): StoredRxRecord[] {
  return readAll().sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
  );
}

export function savePeptideRxRecord(record: StoredRxRecord): void {
  const existing = readAll();
  if (existing.some((r) => r.recordToken === record.recordToken)) return;
  writeAll([record, ...existing]);
}

export function removePeptideRxRecord(recordToken: string): void {
  writeAll(readAll().filter((r) => r.recordToken !== recordToken));
}

export function statusLabelForRecord(r: StoredRxRecord): string {
  if (!r.qualified) return "Needs clinical review";
  return r.requestType === "refill" ? "Refill submitted — book telehealth" : "Submitted — book telehealth";
}

export function recordsToSummaries(records: StoredRxRecord[]): RxRecordSummary[] {
  return records.map((r) => ({ ...r, statusLabel: statusLabelForRecord(r) }));
}
