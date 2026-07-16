import type { SupabaseClient } from "@supabase/supabase-js";

import {
  buildRegenPatientStatus,
  regenOrderSquareSettled,
  regenOrderTitle,
  type RegenOrderRecord,
} from "@/lib/regen/order-patient-status";
import {
  HG_RX_TELEHEALTH_BOOKING_URL,
  regenCheckoutCompleteUrl,
  regenCheckoutIntakeUrl,
} from "@/lib/flows";

export type RegenPublicOrderStatus = {
  reference: string;
  title: string;
  track: string;
  paid: boolean;
  intakeComplete: boolean;
  telehealthRequired: boolean;
  telehealthScheduledAt: string | null;
  telehealthCompletedAt: boolean;
  shipped: boolean;
  nextAction: {
    label: string;
    href: string;
    external?: boolean;
  } | null;
  telehealthVisit: {
    startsAt: string;
    serviceName: string;
    providerName: string | null;
    status: string;
    source: "appointment" | "order";
  } | null;
  steps: Array<{ id: string; label: string; status: string; detail?: string }>;
};

const REGEN_ORDER_SELECT =
  "reference, created_at, status, customer_name, customer_email, customer_phone, goal, items, subtotal_usd, shipping_usd, paid_at, payment_id, intake_completed_at, telehealth_required, telehealth_scheduled_at, telehealth_completed_at, np_approved_at, shipped_at, tracking_number, fresha_appointment_id";

async function loadLinkedTelehealthVisit(
  admin: SupabaseClient,
  order: RegenOrderRecord & { fresha_appointment_id?: string | null; telehealth_scheduled_at?: string | null },
): Promise<RegenPublicOrderStatus["telehealthVisit"]> {
  if (order.fresha_appointment_id) {
    const { data: apt } = await admin
      .from("appointments")
      .select(
        "starts_at, status, service:services(name), provider:providers(display_name, first_name, last_name)",
      )
      .eq("fresha_appointment_id", order.fresha_appointment_id)
      .maybeSingle();

    if (apt?.starts_at) {
      const service = apt.service;
      const serviceName = Array.isArray(service)
        ? (service[0] as { name?: string })?.name
        : (service as { name?: string } | null)?.name;
      const provider = apt.provider;
      const providerRow = Array.isArray(provider) ? provider[0] : provider;
      const providerName =
        (providerRow as { display_name?: string })?.display_name ||
        [(providerRow as { first_name?: string })?.first_name, (providerRow as { last_name?: string })?.last_name]
          .filter(Boolean)
          .join(" ") ||
        null;

      return {
        startsAt: apt.starts_at,
        serviceName: serviceName || "NP telehealth visit",
        providerName,
        status: String(apt.status || "confirmed"),
        source: "appointment",
      };
    }
  }

  if (order.telehealth_scheduled_at) {
    return {
      startsAt: order.telehealth_scheduled_at,
      serviceName: "NP telehealth visit",
      providerName: "Ryan Kent, FNP-BC",
      status: "scheduled",
      source: "order",
    };
  }

  return null;
}

function resolveNextAction(
  order: RegenOrderRecord & { telehealth_scheduled_at?: string | null },
  status: ReturnType<typeof buildRegenPatientStatus>,
): RegenPublicOrderStatus["nextAction"] {
  const paid = regenOrderSquareSettled(order);
  if (!paid) return null;
  if (!order.intake_completed_at) {
    return {
      label: "Complete health intake",
      href: regenCheckoutIntakeUrl(order.reference),
    };
  }
  if (order.telehealth_required !== false && !order.telehealth_completed_at) {
    if (order.telehealth_scheduled_at) {
      return {
        label: "View order & visit details",
        href: regenCheckoutCompleteUrl(order.reference),
      };
    }
    return {
      label: "Book telehealth on Square",
      href: HG_RX_TELEHEALTH_BOOKING_URL,
      external: true,
    };
  }
  return {
    label: "Track your order",
    href: regenCheckoutCompleteUrl(order.reference),
  };
}

export async function loadRegenPublicOrderStatus(
  admin: SupabaseClient,
  orderRef: string,
): Promise<RegenPublicOrderStatus | null> {
  const ref = orderRef.trim();
  if (!ref) return null;

  const { data: order } = await admin
    .from("regen_orders")
    .select(REGEN_ORDER_SELECT)
    .eq("reference", ref)
    .maybeSingle();

  if (!order) return null;

  const record = order as RegenOrderRecord & {
    fresha_appointment_id?: string | null;
    telehealth_scheduled_at?: string | null;
  };

  const patientStatus = buildRegenPatientStatus(record);
  const telehealthVisit = await loadLinkedTelehealthVisit(admin, record);

  return {
    reference: record.reference,
    title: regenOrderTitle(record),
    track: patientStatus.track,
    paid: regenOrderSquareSettled(record),
    intakeComplete: Boolean(record.intake_completed_at),
    telehealthRequired: record.telehealth_required !== false,
    telehealthScheduledAt: record.telehealth_scheduled_at ?? telehealthVisit?.startsAt ?? null,
    telehealthCompletedAt: Boolean(record.telehealth_completed_at),
    shipped: Boolean(record.shipped_at),
    nextAction: resolveNextAction(record, patientStatus),
    telehealthVisit,
    steps: patientStatus.steps.map((s) => ({
      id: s.id,
      label: s.label,
      status: s.status,
      detail: s.detail,
    })),
  };
}
