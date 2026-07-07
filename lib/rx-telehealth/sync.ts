import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { ensureRxDispatchForSubmission } from "@/lib/rx-dispatch-auto";
import {
  applyRegenFulfillmentAction,
  fetchRegenFulfillmentOrder,
} from "@/lib/regen/order-fulfillment";
import { logRxOpsAudit } from "@/lib/rx-ops/audit";
import { isRxConsultServiceName } from "@/lib/rx-telehealth/requirement";
import type { RxOpsRequestKind } from "@/lib/rx-ops/types";

export type FreshaAppointmentSyncInput = {
  freshaAppointmentId: string;
  appointmentId?: string | null;
  clientId?: string | null;
  clientEmail?: string | null;
  clientPhone?: string | null;
  serviceName?: string | null;
  status: string;
  startTime?: string | null;
};

export type FreshaSyncResult = {
  matched: number;
  scheduled: number;
  completed: number;
  targets: string[];
};

function normalizePhone(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const digits = raw.replace(/\D/g, "");
  if (digits.length >= 10) return digits.slice(-10);
  return null;
}

function isScheduledStatus(status: string): boolean {
  const s = status.toLowerCase();
  return s === "confirmed" || s === "checked_in" || s === "checked-in";
}

function isCompletedStatus(status: string): boolean {
  const s = status.toLowerCase();
  return s === "completed" || s === "finished";
}

async function logTelehealthEvent(
  admin: SupabaseClient,
  input: {
    clientId?: string | null;
    requestKind?: string | null;
    requestId?: string | null;
    freshaAppointmentId: string;
    source?: string;
  },
): Promise<void> {
  const { error } = await admin.from("hg_rx_telehealth_events").insert({
    client_id: input.clientId,
    request_kind: input.requestKind,
    request_id: input.requestId,
    fresha_appointment_id: input.freshaAppointmentId,
    source: input.source ?? "fresha",
  });
  if (error?.code === "23505") return;
  if (error && error.code !== "42P01") {
    console.warn("[rx-telehealth/sync] event insert:", error.message);
  }
}

async function syncRegenOrders(
  admin: SupabaseClient,
  input: FreshaAppointmentSyncInput,
): Promise<FreshaSyncResult> {
  const result: FreshaSyncResult = { matched: 0, scheduled: 0, completed: 0, targets: [] };
  const email = String(input.clientEmail || "").trim().toLowerCase();
  const phone = normalizePhone(input.clientPhone);

  let query = admin
    .from("regen_orders")
    .select("reference, telehealth_required, telehealth_completed_at, paid_at, intake_completed_at")
    .not("status", "eq", "cancelled")
    .order("created_at", { ascending: false })
    .limit(5);

  if (email) query = query.ilike("customer_email", email);
  else if (phone) query = query.ilike("customer_phone", `%${phone}`);
  else return result;

  const { data: orders } = await query;
  for (const order of orders ?? []) {
    if (order.telehealth_required === false) continue;
    if (!order.paid_at || !order.intake_completed_at) continue;
    if (order.telehealth_completed_at && isScheduledStatus(input.status)) continue;

    result.matched += 1;
    const ref = String(order.reference);
    result.targets.push(`regen:${ref}`);

    const patch: Record<string, unknown> = {
      fresha_appointment_id: input.freshaAppointmentId,
      updated_at: new Date().toISOString(),
    };

    if (isScheduledStatus(input.status) && input.startTime) {
      patch.telehealth_scheduled_at = new Date(input.startTime).toISOString();
      const { error } = await admin.from("regen_orders").update(patch).eq("reference", ref);
      if (!error) result.scheduled += 1;
    }

    if (isCompletedStatus(input.status)) {
      const action = await applyRegenFulfillmentAction(ref, { type: "telehealth_complete" });
      if (action.ok) {
        result.completed += 1;
        await admin
          .from("regen_orders")
          .update({ fresha_appointment_id: input.freshaAppointmentId })
          .eq("reference", ref);
        await logTelehealthEvent(admin, {
          clientId: input.clientId,
          requestKind: "regen",
          requestId: ref,
          freshaAppointmentId: input.freshaAppointmentId,
        });
      }
    }
  }

  return result;
}

async function syncIntakeDispatch(
  admin: SupabaseClient,
  input: FreshaAppointmentSyncInput,
): Promise<FreshaSyncResult> {
  const result: FreshaSyncResult = { matched: 0, scheduled: 0, completed: 0, targets: [] };
  if (!input.clientId) return result;

  const { data: dispatchRows } = await admin
    .from("hg_rx_dispatch")
    .select(
      "submission_id, telehealth_required, telehealth_completed_at, status",
    )
    .eq("telehealth_required", true)
    .is("telehealth_completed_at", null)
    .order("updated_at", { ascending: false })
    .limit(10);

  if (!dispatchRows?.length) return result;

  const submissionIds = dispatchRows.map((d) => d.submission_id as string);
  const { data: subs } = await admin
    .from("hg_form_submissions")
    .select("id, client_id")
    .in("id", submissionIds)
    .eq("client_id", input.clientId);

  const subSet = new Set((subs ?? []).map((s) => String(s.id)));

  for (const dispatch of dispatchRows) {
    if (!subSet.has(String(dispatch.submission_id))) continue;

    result.matched += 1;
    const submissionId = String(dispatch.submission_id);
    result.targets.push(`intake:${submissionId}`);

    const patch: Record<string, unknown> = {
      fresha_appointment_id: input.freshaAppointmentId,
      updated_at: new Date().toISOString(),
      updated_by: "fresha:webhook",
    };

    if (isScheduledStatus(input.status) && input.startTime) {
      patch.telehealth_scheduled_at = new Date(input.startTime).toISOString();
      const { error } = await admin
        .from("hg_rx_dispatch")
        .update(patch)
        .eq("submission_id", submissionId);
      if (!error) result.scheduled += 1;
    }

    if (isCompletedStatus(input.status)) {
      patch.telehealth_completed_at = new Date().toISOString();
      if (dispatch.status === "new") patch.status = "reviewed";
      const { error } = await admin
        .from("hg_rx_dispatch")
        .update(patch)
        .eq("submission_id", submissionId);
      if (!error) {
        result.completed += 1;
        await logTelehealthEvent(admin, {
          clientId: input.clientId,
          requestKind: "intake",
          requestId: submissionId,
          freshaAppointmentId: input.freshaAppointmentId,
        });
      }
    }
  }

  return result;
}

/** HGRX-060 — link Fresha appointment lifecycle to open RX requests. */
export async function syncFreshaAppointmentToRx(
  input: FreshaAppointmentSyncInput,
  client?: SupabaseClient | null,
): Promise<FreshaSyncResult> {
  if (!isRxConsultServiceName(input.serviceName)) {
    return { matched: 0, scheduled: 0, completed: 0, targets: [] };
  }

  const admin = client ?? getSupabaseAdminClient();
  if (!admin) return { matched: 0, scheduled: 0, completed: 0, targets: [] };

  const regen = await syncRegenOrders(admin, input);
  const intake = await syncIntakeDispatch(admin, input);

  return {
    matched: regen.matched + intake.matched,
    scheduled: regen.scheduled + intake.scheduled,
    completed: regen.completed + intake.completed,
    targets: [...regen.targets, ...intake.targets],
  };
}

export async function markRxTelehealthComplete(
  input: {
    kind: RxOpsRequestKind;
    id: string;
    actorEmail: string;
    freshaAppointmentId?: string | null;
  },
  client?: SupabaseClient | null,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const admin = client ?? getSupabaseAdminClient();
  if (!admin) return { ok: false, error: "Database unavailable" };

  const now = new Date().toISOString();

  if (input.kind === "regen") {
    const order = await fetchRegenFulfillmentOrder(admin, input.id);
    if (!order) return { ok: false, error: "Order not found" };
    const result = await applyRegenFulfillmentAction(input.id, { type: "telehealth_complete" });
    if (!result.ok) return { ok: false, error: result.error || "Could not update order" };
    if (input.freshaAppointmentId) {
      await admin
        .from("regen_orders")
        .update({ fresha_appointment_id: input.freshaAppointmentId })
        .eq("reference", input.id);
    }
    await logRxOpsAudit({
      requestKind: "regen",
      requestId: input.id,
      action: "telehealth_completed",
      actorEmail: input.actorEmail,
    });
    return { ok: true };
  }

  if (input.kind === "intake") {
    await ensureRxDispatchForSubmission(admin, input.id);

    const { data: sub } = await admin
      .from("hg_form_submissions")
      .select("client_id")
      .eq("id", input.id)
      .maybeSingle();

    const { error } = await admin
      .from("hg_rx_dispatch")
      .update({
        telehealth_completed_at: now,
        telehealth_required: true,
        fresha_appointment_id: input.freshaAppointmentId ?? null,
        status: "reviewed",
        updated_at: now,
        updated_by: input.actorEmail,
      })
      .eq("submission_id", input.id);

    if (error) return { ok: false, error: error.message };

    await logTelehealthEvent(admin, {
      clientId: sub?.client_id ? String(sub.client_id) : null,
      requestKind: "intake",
      requestId: input.id,
      freshaAppointmentId: input.freshaAppointmentId || `manual:${input.id}`,
      source: "staff",
    });

    await logRxOpsAudit({
      requestKind: "intake",
      requestId: input.id,
      action: "telehealth_completed",
      actorEmail: input.actorEmail,
    });
    return { ok: true };
  }

  return { ok: false, error: "Clinic encounters do not require telehealth sync" };
}
