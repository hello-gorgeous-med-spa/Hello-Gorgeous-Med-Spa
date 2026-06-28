/**
 * Patient portal RX dashboard — all active orders & refill due for a logged-in client.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

import { GLP1_REFILL_PATH, HG_RX_TELEHEALTH_BOOKING_URL, PEPTIDE_REQUEST_PATH } from "@/lib/flows";
import { normalizePatientEmail } from "@/lib/rx-secure-messages";
import { defaultDispatchFromIntake, RX_INTAKE_SLUGS } from "@/lib/rx-dispatch";
import { pickClientRefillCadence } from "@/lib/rx-refill-cadence";
import type { RefillUrgency } from "@/lib/rx-clinic-refill";
import type { RxClinicEncounterRow } from "@/lib/rx-clinic-encounter";
import {
  getLatestLedgerForIntakeRef,
  getLatestLedgerForSubmission,
} from "@/lib/rx-payment-ledger";
import { buildRxPatientStatus, rxStatusHrefWithToken, type RxPatientStatus } from "@/lib/rx-patient-status";
import { intakeRefFromToken } from "@/lib/rx-submission-context";

export type RxPortalOrder = {
  kind: "intake" | "clinic";
  id: string;
  title: string;
  track: RxPatientStatus["track"];
  submittedAt: string;
  status: RxPatientStatus | null;
  statusHref: string;
  paymentUrl: string | null;
  isActive: boolean;
};

export type RxPortalRefillDue = {
  medication: string;
  doseLabel: string | null;
  supplyCycle: string;
  dueAt: string;
  daysUntilDue: number;
  urgency: RefillUrgency;
  reorderHref: string;
};

export type RxPortalDashboard = {
  orders: RxPortalOrder[];
  refillDue: RxPortalRefillDue | null;
  links: {
    glp1Refill: string;
    peptideRequest: string;
    careHub: string;
    telehealth: string;
  };
};

const RX_SLUG_SET = new Set<string>(RX_INTAKE_SLUGS);

function orderTitle(slug: string | null, responses: Record<string, unknown>): string {
  if (slug?.includes("glp1")) {
    const med = String(responses.medication || "GLP-1");
    const tier = String(responses.refill_dose_tier || responses.dose_tier || "");
    return tier ? `${med} refill` : `${med} refill`;
  }
  if (slug?.includes("peptide")) {
    const peptides = responses.selected_peptides || responses.peptides;
    if (Array.isArray(peptides) && peptides.length) {
      return `Peptide refill · ${peptides.slice(0, 2).join(", ")}`;
    }
    return "Peptide protocol refill";
  }
  return "RX refill request";
}

function isActiveOrder(status: RxPatientStatus | null): boolean {
  if (!status) return true;
  if (status.dispatchStatus === "sent") return false;
  if (status.payment?.status === "paid" && status.dispatchStatus === "sent") return false;
  return true;
}

export async function loadRxPortalDashboard(
  admin: SupabaseClient,
  clientId: string,
  clientEmail: string,
): Promise<RxPortalDashboard> {
  const emailNorm = normalizePatientEmail(clientEmail);

  const { data: templates } = await admin
    .from("hg_form_templates")
    .select("id, slug")
    .in("slug", [...RX_INTAKE_SLUGS]);
  const templateById = new Map((templates ?? []).map((t) => [t.id, t.slug as string]));
  const templateIds = [...templateById.keys()];

  type SubRow = {
    id: string;
    submitted_at: string;
    signer_name: string | null;
    client_phone: string | null;
    client_id: string | null;
    access_token: string | null;
    responses_json: Record<string, unknown> | null;
    template_id: string;
  };

  const submissions: SubRow[] = [];

  if (templateIds.length) {
    const { data: byClient } = await admin
      .from("hg_form_submissions")
      .select(
        "id, submitted_at, signer_name, client_phone, client_id, access_token, responses_json, template_id",
      )
      .in("template_id", templateIds)
      .eq("client_id", clientId)
      .order("submitted_at", { ascending: false })
      .limit(20);

    submissions.push(...((byClient ?? []) as SubRow[]));

    if (emailNorm) {
      const { data: byEmail } = await admin
        .from("hg_form_submissions")
        .select(
          "id, submitted_at, signer_name, client_phone, client_id, access_token, responses_json, template_id",
        )
        .in("template_id", templateIds)
        .is("client_id", null)
        .order("submitted_at", { ascending: false })
        .limit(30);

      for (const row of (byEmail ?? []) as SubRow[]) {
        const formEmail = normalizePatientEmail(String(row.responses_json?.email || ""));
        if (formEmail === emailNorm && !submissions.some((s) => s.id === row.id)) {
          submissions.push(row);
        }
      }
    }
  }

  submissions.sort(
    (a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime(),
  );

  const orders: RxPortalOrder[] = [];

  for (const row of submissions.slice(0, 12)) {
    const slug = templateById.get(row.template_id) ?? null;
    if (!slug || !RX_SLUG_SET.has(slug)) continue;

    const responses = row.responses_json ?? {};
    const intakeRef = intakeRefFromToken(row.access_token);

    const [ledger, dispatchRes] = await Promise.all([
      getLatestLedgerForSubmission(row.id, admin).then(
        (r) => r ?? getLatestLedgerForIntakeRef(intakeRef, admin),
      ),
      admin.from("hg_rx_dispatch").select("*").eq("submission_id", row.id).maybeSingle(),
    ]);

    const dispatchDefaults = defaultDispatchFromIntake({
      slug,
      signerName: row.signer_name,
      responses,
    });
    const dispatch = dispatchRes.data
      ? { ...dispatchDefaults, ...dispatchRes.data, submission_id: row.id }
      : { ...dispatchDefaults, submission_id: row.id };

    const submission = {
      submissionId: row.id,
      intakeRef,
      accessToken: row.access_token,
      clientId: row.client_id,
      clientName: row.signer_name,
      clientEmail: String(responses.email || "").trim() || null,
      clientPhone: row.client_phone,
      slug,
      responses,
      submittedAt: row.submitted_at,
    };

    const status = buildRxPatientStatus({
      submission,
      ledger: ledger ?? null,
      dispatch,
    });

    orders.push({
      kind: "intake",
      id: row.id,
      title: orderTitle(slug, responses),
      track: status.track,
      submittedAt: row.submitted_at,
      status,
      statusHref: rxStatusHrefWithToken(row.access_token ?? undefined, intakeRef, clientEmail),
      paymentUrl:
        ledger?.payment_status === "pending" ? ledger.payment_url : null,
      isActive: isActiveOrder(status),
    });
  }

  const { data: clinicRows } = await admin
    .from("hg_rx_clinic_encounters")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false })
    .limit(10);

  const encounters = (clinicRows ?? []) as RxClinicEncounterRow[];

  for (const enc of encounters.filter((r) => !["cancelled", "draft"].includes(r.status)).slice(0, 5)) {
    orders.push({
      kind: "clinic",
      id: enc.id,
      title: `${enc.medication}${enc.dose_label ? ` · ${enc.dose_label}` : ""}`,
      track: "glp1",
      submittedAt: enc.created_at,
      status: null,
      statusHref: GLP1_REFILL_PATH,
      paymentUrl: null,
      isActive: !["complete", "shipped"].includes(enc.status),
    });
  }

  orders.sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime(),
  );

  let refillDue: RxPortalRefillDue | null = null;
  const cadence = await pickClientRefillCadence(admin, clientId, clientEmail);
  if (cadence && cadence.urgency !== "ok") {
    refillDue = {
      medication: cadence.medication,
      doseLabel: cadence.doseLabel,
      supplyCycle: cadence.supplyCycle,
      dueAt: cadence.dueAt,
      daysUntilDue: cadence.daysUntilDue,
      urgency: cadence.urgency,
      reorderHref: cadence.reorderHref,
    };
  }

  return {
    orders,
    refillDue,
    links: {
      glp1Refill: GLP1_REFILL_PATH,
      peptideRequest: PEPTIDE_REQUEST_PATH,
      careHub: "/rx/care",
      telehealth: HG_RX_TELEHEALTH_BOOKING_URL,
    },
  };
}
