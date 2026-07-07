import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { fetchRegenFulfillmentOrder } from "@/lib/regen/order-fulfillment";
import { buildRxOpsConsolePayload } from "@/lib/rx-ops/console-data";
import { loadRxOpsFormulary, routingForCompound } from "@/lib/rx-ops/formulary";
import {
  defaultSigSuggestion,
  intakePairsFromResponses,
  screeningForClinic,
  screeningForIntakeSlug,
  screeningForRegen,
} from "@/lib/rx-ops/screening";
import { allowedClinicalActions } from "@/lib/rx-ops/state-machine";
import type { RxOpsRequestDetail, RxOpsRequestKind } from "@/lib/rx-ops/types";
import { getClinicEncounter } from "@/lib/rx-clinic-encounter";
import { RX_INTAKE_SLUGS } from "@/lib/rx-dispatch";
import { HG_RX_TELEHEALTH_BOOKING_URL } from "@/lib/flows";
import { formatSquareShippingAddress } from "@/lib/square/order-shipping";

export async function buildRxOpsRequestDetail(
  kind: RxOpsRequestKind,
  id: string,
): Promise<RxOpsRequestDetail | null> {
  const payload = await buildRxOpsConsolePayload();
  const request = payload.requests.find((r) => r.id === `${kind}:${id}`);
  if (!request) return null;

  const formulary = loadRxOpsFormulary();
  const routing = routingForCompound(request.compound, formulary);
  const allowedActions = allowedClinicalActions(request.stage);

  const admin = getSupabaseAdminClient();
  let screening: RxOpsRequestDetail["screening"] = [];
  let intake: RxOpsRequestDetail["intake"] = [];
  let npNotes: string | null = null;
  let shipTo: string | null = null;

  let telehealthScheduledAt: string | null = null;
  let telehealthCompletedAt: string | null = null;

  if (kind === "regen" && admin) {
    const order = await fetchRegenFulfillmentOrder(admin, id);
    if (order) {
      npNotes = order.np_notes ?? null;
      telehealthScheduledAt = order.telehealth_scheduled_at ?? null;
      telehealthCompletedAt = order.telehealth_completed_at ?? null;
      const intakeData = (order.intake_data ?? {}) as Record<string, unknown>;
      intake = intakePairsFromResponses(intakeData, 16);
      screening = screeningForRegen(order.goal, intakeData, {
        allergies: order.allergies,
        intakeComplete: Boolean(order.intake_completed_at),
        telehealthRequired: order.telehealth_required !== false,
        telehealthComplete: Boolean(order.telehealth_completed_at),
        paid: Boolean(order.paid_at),
      });
      shipTo = formatSquareShippingAddress(
        order.shipping_address as Parameters<typeof formatSquareShippingAddress>[0],
      );
    }
  }

  if (kind === "intake" && admin) {
    const detail = await loadIntakeDetail(admin, id);
    if (detail) {
      screening = detail.screening;
      intake = detail.intake;
      npNotes = detail.npNotes;
      shipTo = detail.shipTo;
      telehealthScheduledAt = detail.telehealthScheduledAt;
      telehealthCompletedAt = detail.telehealthCompletedAt;
    }
  }

  if (kind === "clinic" && admin) {
    const encounter = await getClinicEncounter(id, admin);
    if (encounter) {
      npNotes = encounter.staff_notes;
      screening = screeningForClinic(encounter.clinical, encounter.status === "paid" || Boolean(encounter.paid_at));
      const lines = [
        encounter.ship_address_line1,
        encounter.ship_address_line2,
        [encounter.ship_city, encounter.ship_state, encounter.ship_zip].filter(Boolean).join(", "),
      ].filter(Boolean);
      if (lines.length) shipTo = lines.join("\n");
      intake = [
        { q: "Medication", a: encounter.medication || "—" },
        { q: "Dose", a: encounter.dose_label || "—" },
        { q: "Supply cycle", a: encounter.supply_cycle },
        { q: "Encounter type", a: encounter.encounter_type.replace(/_/g, " ") },
      ];
    }
  }

  if (screening.length === 0) {
    screening = [{ icon: "✓", ok: true, text: "Awaiting provider review" }];
  }

  return {
    request,
    screening,
    intake,
    routing,
    suggestedNote: defaultSigSuggestion(request.product, request.compound),
    npNotes,
    shipTo,
    allowedActions,
    telehealthBookingUrl: HG_RX_TELEHEALTH_BOOKING_URL,
    telehealthScheduledAt,
    telehealthCompletedAt,
  };
}

async function loadIntakeDetail(
  admin: SupabaseClient,
  submissionId: string,
): Promise<{
  screening: RxOpsRequestDetail["screening"];
  intake: RxOpsRequestDetail["intake"];
  npNotes: string | null;
  shipTo: string | null;
  telehealthScheduledAt: string | null;
  telehealthCompletedAt: string | null;
} | null> {
  const { data: sub } = await admin
    .from("hg_form_submissions")
    .select("responses_json, template:hg_form_templates(slug)")
    .eq("id", submissionId)
    .maybeSingle();

  if (!sub) return null;

  const slug = (sub as { template?: { slug?: string } }).template?.slug ?? "";
  if (!RX_INTAKE_SLUGS.includes(slug as (typeof RX_INTAKE_SLUGS)[number])) {
    return null;
  }

  const responses = (sub.responses_json ?? {}) as Record<string, unknown>;
  const screening = screeningForIntakeSlug(slug, responses);
  const intake = intakePairsFromResponses(responses, 16);

  const { data: dispatch } = await admin
    .from("hg_rx_dispatch")
    .select(
      "staff_notes, address_line1, address_line2, city, state, zip, telehealth_required, telehealth_scheduled_at, telehealth_completed_at",
    )
    .eq("submission_id", submissionId)
    .maybeSingle();

  const shipLines = [
    dispatch?.address_line1,
    dispatch?.address_line2,
    [dispatch?.city, dispatch?.state, dispatch?.zip].filter(Boolean).join(", "),
  ].filter(Boolean);

  const responseShip = [
    responses.shipping_street || responses.address_line1,
    responses.shipping_city,
    [responses.shipping_state, responses.shipping_zip].filter(Boolean).join(" "),
  ].filter(Boolean);

  if (dispatch?.telehealth_required) {
    if (!dispatch.telehealth_completed_at) {
      screening.push({ icon: "!", ok: false, text: "NP telehealth visit pending — book on Fresha" });
    } else {
      screening.push({ icon: "✓", ok: true, text: "Telehealth complete" });
    }
  }

  return {
    screening,
    intake,
    npNotes: (dispatch?.staff_notes as string | null) ?? null,
    shipTo:
      shipLines.length > 0
        ? shipLines.join("\n")
        : responseShip.length > 0
          ? responseShip.map(String).join("\n")
          : null,
    telehealthScheduledAt: (dispatch?.telehealth_scheduled_at as string | null) ?? null,
    telehealthCompletedAt: (dispatch?.telehealth_completed_at as string | null) ?? null,
  };
}
