import type { SupabaseClient } from "@supabase/supabase-js";

import { RYAN_FULL_NAME } from "@/lib/founder-credentials";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import {
  applyRegenFulfillmentAction,
  fetchRegenFulfillmentOrder,
} from "@/lib/regen/order-fulfillment";
import { assertRxLicensingGate } from "@/lib/rx-compliance/licensing";
import { logRxOpsAudit } from "@/lib/rx-ops/audit";
import {
  mapCatalogPharmacyToClinic,
  mapCatalogPharmacyToDispatch,
  mapCatalogPharmacyToRegenSource,
} from "@/lib/rx-ops/pharmacy-map";
import { recordRxPrescription } from "@/lib/rx-ops/prescriptions";
import type { ClinicalAction } from "@/lib/rx-ops/state-machine";
import { assertClinicalActionAllowed } from "@/lib/rx-ops/state-machine";
import type { RxOpsRequest, RxOpsRequestKind } from "@/lib/rx-ops/types";
import { enqueuePharmacyShipment } from "@/lib/rx-pharmacy-fulfillment/shipments";
import { getClinicEncounter, updateClinicEncounter } from "@/lib/rx-clinic-encounter";
import type { RxDispatchStatus } from "@/lib/rx-dispatch";

const SIGNER_DISPLAY = RYAN_FULL_NAME;

export type ClinicalActionInput = {
  kind: RxOpsRequestKind;
  id: string;
  request: RxOpsRequest;
  action: ClinicalAction;
  pharmacySource?: string | null;
  npNotes?: string | null;
  actorEmail: string;
};

export type ClinicalActionResult =
  | { ok: true; prescriptionId?: string; message: string }
  | { ok: false; error: string };

function auditAction(action: ClinicalAction): "clinical_approve" | "clinical_decline" | "clinical_info_requested" {
  if (action === "approve") return "clinical_approve";
  if (action === "decline") return "clinical_decline";
  return "clinical_info_requested";
}

function staffNotePrefix(action: ClinicalAction): string {
  if (action === "decline") return "DECLINED";
  if (action === "info") return "INFO REQUESTED";
  return "";
}

async function upsertIntakeDispatch(
  admin: SupabaseClient,
  submissionId: string,
  patch: Record<string, unknown>,
): Promise<{ error?: string }> {
  const { error } = await admin
    .from("hg_rx_dispatch")
    .upsert(
      {
        submission_id: submissionId,
        updated_at: new Date().toISOString(),
        ...patch,
      },
      { onConflict: "submission_id" },
    );

  if (error) {
    if (error.code === "42P01") {
      return { error: "RX Dispatch table not installed" };
    }
    return { error: error.message };
  }
  return {};
}

async function queuePharmacyShipmentAfterApprove(
  input: ClinicalActionInput,
  pharmacyLabel: string,
  sig: string | null,
  prescriptionId?: string,
): Promise<void> {
  await enqueuePharmacyShipment({
    requestKind: input.kind,
    requestId: input.id,
    prescriptionId,
    patientName: input.request.patientName,
    patientEmail: input.request.email,
    patientPhone: input.request.phone,
    pharmacyLabel,
    productLabel: input.request.product,
    compound: input.request.compound,
    sig,
  });
}

export async function applyClinicalAction(
  input: ClinicalActionInput,
): Promise<ClinicalActionResult> {
  const gate = assertClinicalActionAllowed(input.request.stage, input.action);
  if (!gate.ok) return { ok: false, error: gate.error };

  const admin = getSupabaseAdminClient();
  if (!admin) return { ok: false, error: "Database unavailable" };

  const sig = input.npNotes?.trim() || null;
  const pharmacyLabel = input.pharmacySource?.trim() || null;
  const notePrefix = staffNotePrefix(input.action);
  const staffNotes = notePrefix && sig ? `${notePrefix}: ${sig}` : notePrefix || sig;

  if (input.action === "approve" && !pharmacyLabel) {
    return { ok: false, error: "Select a pharmacy before approving" };
  }

  if (input.action === "approve") {
    const licenseGate = await assertRxLicensingGate({
      kind: input.kind,
      id: input.id,
      compound: input.request.compound,
      action: "approve",
    });
    if (!licenseGate.ok) return { ok: false, error: licenseGate.error };
  }

  if (input.kind === "regen") {
    if (input.action === "approve") {
      const result = await applyRegenFulfillmentAction(input.id, {
        type: "approve",
        npNotes: sig ?? undefined,
        pharmacySource: mapCatalogPharmacyToRegenSource(pharmacyLabel),
      });
      if (!result.ok) return { ok: false, error: result.error };

      const rx = await recordRxPrescription({
        requestKind: "regen",
        requestId: input.id,
        patientName: input.request.patientName,
        compound: input.request.compound,
        productLabel: input.request.product,
        pharmacy: mapCatalogPharmacyToRegenSource(pharmacyLabel),
        sig,
        action: "approve",
        signedByName: SIGNER_DISPLAY,
        signedByEmail: input.actorEmail,
      });
      if ("error" in rx) return { ok: false, error: rx.error };

      await logRxOpsAudit({
        requestKind: "regen",
        requestId: input.id,
        action: "clinical_approve",
        actorEmail: input.actorEmail,
        detail: { pharmacy: pharmacyLabel, prescriptionId: rx.id },
      });

      await queuePharmacyShipmentAfterApprove(input, pharmacyLabel!, sig, rx.id);

      return {
        ok: true,
        prescriptionId: rx.id,
        message: `Approved — routed to ${mapCatalogPharmacyToRegenSource(pharmacyLabel)}`,
      };
    }

    const order = await fetchRegenFulfillmentOrder(admin, input.id);
    if (!order) return { ok: false, error: "Order not found" };

    if (input.action === "decline") {
      const { error } = await admin
        .from("regen_orders")
        .update({
          status: "cancelled",
          np_notes: staffNotes,
          updated_at: new Date().toISOString(),
        })
        .eq("reference", input.id);

      if (error) return { ok: false, error: error.message };
    } else {
      const { error } = await admin
        .from("regen_orders")
        .update({
          np_notes: staffNotes,
          updated_at: new Date().toISOString(),
        })
        .eq("reference", input.id);

      if (error) return { ok: false, error: error.message };
    }

    const rx = await recordRxPrescription({
      requestKind: "regen",
      requestId: input.id,
      patientName: input.request.patientName,
      compound: input.request.compound,
      productLabel: input.request.product,
      pharmacy: null,
      sig,
      action: input.action,
      signedByName: SIGNER_DISPLAY,
      signedByEmail: input.actorEmail,
    });
    if ("error" in rx && input.action === "approve") {
      return { ok: false, error: rx.error };
    }

    await logRxOpsAudit({
      requestKind: "regen",
      requestId: input.id,
      action: auditAction(input.action),
      actorEmail: input.actorEmail,
      detail: { staffNotes },
    });

    return {
      ok: true,
      prescriptionId: "error" in rx ? undefined : rx.id,
      message: input.action === "decline" ? "Request declined" : "Info requested — patient will be contacted",
    };
  }

  if (input.kind === "intake") {
    let status: RxDispatchStatus;
    if (input.action === "approve") status = "approved";
    else if (input.action === "decline") status = "declined";
    else status = "info_requested";

    const dispatchPharmacy = mapCatalogPharmacyToDispatch(pharmacyLabel);
    const patch: Record<string, unknown> = {
      status,
      updated_by: input.actorEmail,
    };
    if (input.action === "approve") {
      if (!dispatchPharmacy) {
        return { ok: false, error: "Selected pharmacy is not routable for intake dispatch" };
      }
      patch.pharmacy = dispatchPharmacy;
      patch.sig = sig;
    }
    if (staffNotes) patch.staff_notes = staffNotes;

    const upsert = await upsertIntakeDispatch(admin, input.id, patch);
    if (upsert.error) return { ok: false, error: upsert.error };

    const rx = await recordRxPrescription({
      requestKind: "intake",
      requestId: input.id,
      patientName: input.request.patientName,
      compound: input.request.compound,
      productLabel: input.request.product,
      pharmacy: pharmacyLabel,
      sig,
      action: input.action,
      signedByName: SIGNER_DISPLAY,
      signedByEmail: input.actorEmail,
    });
    if ("error" in rx && input.action === "approve") {
      return { ok: false, error: rx.error };
    }

    await logRxOpsAudit({
      requestKind: "intake",
      requestId: input.id,
      action: auditAction(input.action),
      actorEmail: input.actorEmail,
      detail: { status, pharmacy: dispatchPharmacy },
    });

    if (input.action === "approve" && pharmacyLabel) {
      await queuePharmacyShipmentAfterApprove(
        input,
        pharmacyLabel,
        sig,
        "error" in rx ? undefined : rx.id,
      );
    }

    const msg =
      input.action === "approve"
        ? `Approved — routed to ${dispatchPharmacy}`
        : input.action === "decline"
          ? "Request declined"
          : "Info requested — patient will be contacted";

    return {
      ok: true,
      prescriptionId: "error" in rx ? undefined : rx.id,
      message: msg,
    };
  }

  // clinic
  const encounter = await getClinicEncounter(input.id, admin);
  if (!encounter) return { ok: false, error: "Encounter not found" };

  if (input.action === "approve") {
    const clinicPharmacy = mapCatalogPharmacyToClinic(pharmacyLabel);
    if (!clinicPharmacy) {
      return { ok: false, error: "Selected pharmacy is not routable for clinic dispatch" };
    }

    const update = await updateClinicEncounter(
      input.id,
      {
        pharmacy: clinicPharmacy,
        sig,
        dispatchStatus: "reviewed",
        status: encounter.status === "paid" ? "ready_to_ship" : encounter.status,
        staffNotes: staffNotes ?? encounter.staff_notes,
      },
      admin,
    );
    if ("error" in update) return { ok: false, error: update.error };

    const rx = await recordRxPrescription({
      requestKind: "clinic",
      requestId: input.id,
      patientName: input.request.patientName,
      compound: input.request.compound,
      productLabel: input.request.product,
      pharmacy: pharmacyLabel,
      sig,
      action: "approve",
      signedByName: SIGNER_DISPLAY,
      signedByEmail: input.actorEmail,
    });
    if ("error" in rx) return { ok: false, error: rx.error };

    await logRxOpsAudit({
      requestKind: "clinic",
      requestId: input.id,
      action: "clinical_approve",
      actorEmail: input.actorEmail,
      detail: { pharmacy: clinicPharmacy, prescriptionId: rx.id },
    });

    await queuePharmacyShipmentAfterApprove(input, pharmacyLabel!, sig, rx.id);

    return {
      ok: true,
      prescriptionId: rx.id,
      message: `Approved — clinic encounter ready to ship via ${clinicPharmacy}`,
    };
  }

  if (input.action === "decline") {
    const update = await updateClinicEncounter(
      input.id,
      {
        status: "cancelled",
        staffNotes: staffNotes ?? encounter.staff_notes,
      },
      admin,
    );
    if ("error" in update) return { ok: false, error: update.error };
  } else {
    const update = await updateClinicEncounter(
      input.id,
      { staffNotes: staffNotes ?? encounter.staff_notes },
      admin,
    );
    if ("error" in update) return { ok: false, error: update.error };
  }

  const rx = await recordRxPrescription({
    requestKind: "clinic",
    requestId: input.id,
    patientName: input.request.patientName,
    compound: input.request.compound,
    productLabel: input.request.product,
    pharmacy: null,
    sig,
    action: input.action,
    signedByName: SIGNER_DISPLAY,
    signedByEmail: input.actorEmail,
  });

  await logRxOpsAudit({
    requestKind: "clinic",
    requestId: input.id,
    action: auditAction(input.action),
    actorEmail: input.actorEmail,
  });

  return {
    ok: true,
    prescriptionId: "error" in rx ? undefined : rx.id,
    message:
      input.action === "decline"
        ? "Clinic encounter cancelled"
        : "Info requested — patient will be contacted",
  };
}
