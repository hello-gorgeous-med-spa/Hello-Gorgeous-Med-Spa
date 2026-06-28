/**
 * Unified RX refill cadence — clinic encounters + shipped online intakes.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

import { RX_INTAKE_SLUGS, intakeTrackFromSlug } from "@/lib/rx-dispatch";
import {
  REFILL_DUE_SOON_DAYS,
  buildRefillDueItem,
  clientHasOpenClinicSale,
  computeNextRefillDue,
  daysUntilDue,
  listDueClinicRefills,
  pickLastRefillableEncounter,
  refillUrgencyForDue,
  supplyCycleDays,
  type RefillDueItem,
  type RefillUrgency,
} from "@/lib/rx-clinic-refill";
import {
  listClinicEncountersWithClient,
  type RxClinicEncounterRow,
} from "@/lib/rx-clinic-encounter";
import { GLP1_REFILL_PATH, PEPTIDE_REQUEST_PATH } from "@/lib/flows";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { parseRxSupplyCycle, type RxSupplyCycleId } from "@/lib/rx-supply-cycle";

export type RxRefillCadenceSource = "clinic" | "intake";

export type RxRefillCadenceItem = {
  source: RxRefillCadenceSource;
  sourceId: string;
  clientId: string;
  clientName: string | null;
  clientPhone: string | null;
  clientEmail: string | null;
  medication: string;
  doseLabel: string | null;
  supplyCycle: RxSupplyCycleId;
  track: "glp1" | "peptide" | "unknown";
  anchorAt: string;
  dueAt: string;
  urgency: RefillUrgency;
  daysUntilDue: number;
  reorderHref: string;
};

export type RxRefillCadenceCounts = {
  overdue: number;
  dueSoon: number;
};

const RX_SLUG_SET = new Set<string>(RX_INTAKE_SLUGS);

function reorderHrefForTrack(track: "glp1" | "peptide" | "unknown"): string {
  if (track === "peptide") return PEPTIDE_REQUEST_PATH;
  return GLP1_REFILL_PATH;
}

function titleFromIntakeResponses(
  slug: string,
  responses: Record<string, unknown>,
): { medication: string; doseLabel: string | null } {
  if (slug.includes("glp1")) {
    const med = String(responses.current_medication || responses.medication || "GLP-1");
    const tier = String(responses.refill_dose_tier || responses.dose_tier || "").trim();
    return { medication: med, doseLabel: tier || null };
  }
  const peptides = responses.selected_peptides || responses.peptides;
  if (Array.isArray(peptides) && peptides.length) {
    return { medication: String(peptides[0]), doseLabel: null };
  }
  return { medication: "Peptide protocol", doseLabel: null };
}

type IntakeShippedRow = {
  submission_id: string;
  updated_at: string;
  submission: {
    id: string;
    client_id: string | null;
    signer_name: string | null;
    client_phone: string | null;
    responses_json: Record<string, unknown> | null;
    template: { slug: string } | null;
  };
};

function intakeCadenceFromRow(row: IntakeShippedRow, now = new Date()): RxRefillCadenceItem | null {
  const sub = row.submission;
  const slug = sub.template?.slug ?? "";
  if (!slug || !RX_SLUG_SET.has(slug)) return null;
  if (!sub.client_id) return null;

  const responses = sub.responses_json ?? {};
  const supplyCycle = parseRxSupplyCycle(responses.supply_cycle || responses.supplyCycle);
  const anchor = new Date(row.updated_at);
  if (Number.isNaN(anchor.getTime())) return null;

  const due = new Date(anchor);
  due.setDate(due.getDate() + supplyCycleDays(supplyCycle));
  const urgency = refillUrgencyForDue(due, now);
  if (urgency === "ok") return null;

  const track = intakeTrackFromSlug(slug);
  const { medication, doseLabel } = titleFromIntakeResponses(slug, responses);
  const email = String(responses.email || "").trim() || null;

  return {
    source: "intake",
    sourceId: sub.id,
    clientId: sub.client_id,
    clientName: sub.signer_name,
    clientPhone: sub.client_phone,
    clientEmail: email,
    medication,
    doseLabel,
    supplyCycle,
    track,
    anchorAt: anchor.toISOString(),
    dueAt: due.toISOString(),
    urgency,
    daysUntilDue: daysUntilDue(due, now),
    reorderHref: reorderHrefForTrack(track),
  };
}

export async function listIntakeRefillCadence(
  admin: SupabaseClient,
  opts?: { urgency?: RefillUrgency | "all"; limit?: number },
): Promise<{ items: RxRefillCadenceItem[]; tableReady: boolean }> {
  const { data: templates, error: tmplErr } = await admin
    .from("hg_form_templates")
    .select("id, slug")
    .in("slug", [...RX_INTAKE_SLUGS]);

  if (tmplErr) {
    if (tmplErr.code === "42P01") return { items: [], tableReady: false };
    throw new Error(tmplErr.message);
  }

  const slugById = new Map((templates ?? []).map((t) => [t.id as string, t.slug as string]));
  const templateIds = [...slugById.keys()];
  if (!templateIds.length) return { items: [], tableReady: true };

  const { data: dispatchRows, error } = await admin
    .from("hg_rx_dispatch")
    .select("submission_id, updated_at")
    .eq("status", "sent")
    .order("updated_at", { ascending: false })
    .limit(200);

  if (error) {
    if (error.code === "42P01") return { items: [], tableReady: false };
    throw new Error(error.message);
  }

  const submissionIds = (dispatchRows ?? []).map((d) => d.submission_id as string);
  if (!submissionIds.length) return { items: [], tableReady: true };

  const dispatchBySub = new Map(
    (dispatchRows ?? []).map((d) => [d.submission_id as string, d]),
  );

  const { data: subs, error: subErr } = await admin
    .from("hg_form_submissions")
    .select("id, client_id, signer_name, client_phone, responses_json, template_id")
    .in("id", submissionIds)
    .not("client_id", "is", null);

  if (subErr) throw new Error(subErr.message);

  const now = new Date();
  const byClient = new Map<string, RxRefillCadenceItem>();

  for (const sub of subs ?? []) {
    const dispatch = dispatchBySub.get(sub.id as string);
    if (!dispatch) continue;
    const slug = slugById.get(sub.template_id as string) ?? "";
    const row: IntakeShippedRow = {
      submission_id: sub.id as string,
      updated_at: String(dispatch.updated_at),
      submission: {
        id: sub.id as string,
        client_id: sub.client_id as string,
        signer_name: sub.signer_name as string | null,
        client_phone: sub.client_phone as string | null,
        responses_json: (sub.responses_json as Record<string, unknown>) ?? {},
        template: slug ? { slug } : null,
      },
    };

    const item = intakeCadenceFromRow(row, now);
    if (!item) continue;
    if (opts?.urgency && opts.urgency !== "all" && item.urgency !== opts.urgency) continue;

    const prev = byClient.get(item.clientId);
    if (!prev || new Date(item.anchorAt) > new Date(prev.anchorAt)) {
      byClient.set(item.clientId, item);
    }
  }

  const items = [...byClient.values()].sort((a, b) => {
    if (a.urgency === "overdue" && b.urgency !== "overdue") return -1;
    if (b.urgency === "overdue" && a.urgency !== "overdue") return 1;
    return a.daysUntilDue - b.daysUntilDue;
  });

  const limit = Math.min(100, opts?.limit ?? 50);
  return { items: items.slice(0, limit), tableReady: true };
}

export function clinicCadenceToItem(row: RefillDueItem): RxRefillCadenceItem {
  return {
    source: "clinic",
    sourceId: row.encounterId,
    clientId: row.clientId,
    clientName: row.clientName,
    clientPhone: row.clientPhone,
    clientEmail: row.clientEmail,
    medication: row.medication,
    doseLabel: row.doseLabel,
    supplyCycle: row.supplyCycle,
    track: "glp1",
    anchorAt: row.anchorAt,
    dueAt: row.dueAt,
    urgency: row.urgency,
    daysUntilDue: row.daysUntilDue,
    reorderHref: GLP1_REFILL_PATH,
  };
}

export async function listAllRefillCadence(
  admin?: SupabaseClient | null,
  opts?: { urgency?: RefillUrgency | "all"; limit?: number },
): Promise<{ items: RxRefillCadenceItem[]; counts: RxRefillCadenceCounts; tableReady: boolean }> {
  const client = admin ?? getSupabaseAdminClient();
  if (!client) {
    return { items: [], counts: { overdue: 0, dueSoon: 0 }, tableReady: false };
  }

  const [clinicRes, intakeRes] = await Promise.all([
    listDueClinicRefills({ urgency: opts?.urgency ?? "all", limit: opts?.limit ?? 50 }, client),
    listIntakeRefillCadence(client, opts),
  ]);

  const tableReady = clinicRes.tableReady && intakeRes.tableReady;
  const merged = new Map<string, RxRefillCadenceItem>();

  for (const c of clinicRes.items) {
    merged.set(c.clientId, clinicCadenceToItem(c));
  }
  for (const i of intakeRes.items) {
    const prev = merged.get(i.clientId);
    if (!prev || new Date(i.anchorAt) > new Date(prev.anchorAt)) {
      merged.set(i.clientId, i);
    }
  }

  const items = [...merged.values()].sort((a, b) => {
    if (a.urgency === "overdue" && b.urgency !== "overdue") return -1;
    if (b.urgency === "overdue" && a.urgency !== "overdue") return 1;
    return a.daysUntilDue - b.daysUntilDue;
  });

  const counts: RxRefillCadenceCounts = { overdue: 0, dueSoon: 0 };
  for (const item of items) {
    if (item.urgency === "overdue") counts.overdue += 1;
    if (item.urgency === "due_soon") counts.dueSoon += 1;
  }

  const limit = Math.min(100, opts?.limit ?? 50);
  return { items: items.slice(0, limit), counts, tableReady };
}

/** Best refill-due for a single client (portal dashboard). */
export async function pickClientRefillCadence(
  admin: SupabaseClient,
  clientId: string,
  clientEmail?: string,
): Promise<RxRefillCadenceItem | null> {
  const { rows } = await listClinicEncountersWithClient({ clientId, limit: 50 }, admin);
  if (rows.length && !clientHasOpenClinicSale(rows)) {
    const last = pickLastRefillableEncounter(rows);
    if (last) {
      const withClient = rows.find((r) => r.id === last.id) ?? last;
      const dueItem = buildRefillDueItem(withClient, rows);
      if (dueItem) return clinicCadenceToItem(dueItem);
    }
  }

  const { data: dispatchRows } = await admin
    .from("hg_rx_dispatch")
    .select("submission_id, updated_at, status")
    .eq("status", "sent")
    .order("updated_at", { ascending: false })
    .limit(30);

  const submissionIds = (dispatchRows ?? []).map((d) => d.submission_id as string);
  if (!submissionIds.length) return null;

  const { data: subs } = await admin
    .from("hg_form_submissions")
    .select("id, client_id, signer_name, client_phone, responses_json, template_id, submitted_at")
    .in("id", submissionIds)
    .eq("client_id", clientId);

  const { data: templates } = await admin
    .from("hg_form_templates")
    .select("id, slug")
    .in("slug", [...RX_INTAKE_SLUGS]);
  const slugById = new Map((templates ?? []).map((t) => [t.id as string, t.slug as string]));

  let best: RxRefillCadenceItem | null = null;
  for (const sub of subs ?? []) {
    const dispatch = (dispatchRows ?? []).find((d) => d.submission_id === sub.id);
    if (!dispatch) continue;
    const slug = slugById.get(sub.template_id as string) ?? "";
    const row: IntakeShippedRow = {
      submission_id: sub.id as string,
      updated_at: String(dispatch.updated_at),
      submission: {
        id: sub.id as string,
        client_id: sub.client_id as string,
        signer_name: sub.signer_name as string | null,
        client_phone: sub.client_phone as string | null,
        responses_json: (sub.responses_json as Record<string, unknown>) ?? {},
        template: slug ? { slug } : null,
      },
    };
    const item = intakeCadenceFromRow(row);
    if (!item) continue;
    if (!best || new Date(item.anchorAt) > new Date(best.anchorAt)) best = item;
  }

  if (best) return best;

  if (clientEmail) {
    const emailNorm = clientEmail.trim().toLowerCase();
    for (const sub of subs ?? []) {
      const formEmail = String((sub.responses_json as Record<string, unknown>)?.email || "")
        .trim()
        .toLowerCase();
      if (formEmail && formEmail === emailNorm) {
        const dispatch = (dispatchRows ?? []).find((d) => d.submission_id === sub.id);
        if (!dispatch) continue;
        const slug = slugById.get(sub.template_id as string) ?? "";
        const item = intakeCadenceFromRow({
          submission_id: sub.id as string,
          updated_at: String(dispatch.updated_at),
          submission: {
            id: sub.id as string,
            client_id: clientId,
            signer_name: sub.signer_name as string | null,
            client_phone: sub.client_phone as string | null,
            responses_json: (sub.responses_json as Record<string, unknown>) ?? {},
            template: slug ? { slug } : null,
          },
        });
        if (item && (!best || new Date(item.anchorAt) > new Date(best.anchorAt))) best = item;
      }
    }
  }

  return best;
}

/** Portal-facing refill due from clinic encounter row (legacy helper). */
export function portalRefillDueFromEncounter(
  encounters: RxClinicEncounterRow[],
): RxRefillCadenceItem | null {
  const last = pickLastRefillableEncounter(encounters);
  if (!last) return null;
  const due = computeNextRefillDue(last);
  if (!due) return null;
  const urgency = refillUrgencyForDue(due);
  if (urgency === "ok") return null;
  return {
    source: "clinic",
    sourceId: last.id,
    clientId: last.client_id,
    clientName: null,
    clientPhone: null,
    clientEmail: null,
    medication: last.medication,
    doseLabel: last.dose_label,
    supplyCycle: last.supply_cycle,
    track: "glp1",
    anchorAt: (last.shipped_at || last.paid_at || last.created_at) as string,
    dueAt: due.toISOString(),
    urgency,
    daysUntilDue: daysUntilDue(due),
    reorderHref: GLP1_REFILL_PATH,
  };
}

export { REFILL_DUE_SOON_DAYS };
