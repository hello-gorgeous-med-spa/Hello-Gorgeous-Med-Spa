import type { RxRefillCadenceItem } from "@/lib/rx-refill-cadence";
import type { RxSupplyCycleId } from "@/lib/rx-supply-cycle";

export type RxRefillPlanStatus = "active" | "paused" | "cancelled";

export type RxRefillPlanRow = {
  id: string;
  client_id: string;
  status: RxRefillPlanStatus;
  source_kind: "clinic" | "intake";
  source_id: string;
  track: string;
  medication: string;
  dose_label: string | null;
  supply_cycle: RxSupplyCycleId;
  pharmacy: string | null;
  anchor_at: string;
  next_refill_at: string;
  price_usd: number | null;
  autopay_ledger_id: string | null;
  draft_ledger_id: string | null;
  last_reminder_at: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type RxRefillPlanWithClient = RxRefillPlanRow & {
  client_name: string | null;
  client_phone: string | null;
  client_email: string | null;
};

export function cadenceToPlanSeed(item: RxRefillCadenceItem, extras?: {
  pharmacy?: string | null;
  priceUsd?: number | null;
  autopayLedgerId?: string | null;
}): Omit<RxRefillPlanRow, "id" | "created_at" | "updated_at" | "draft_ledger_id" | "last_reminder_at" | "metadata"> & {
  metadata?: Record<string, unknown>;
} {
  return {
    client_id: item.clientId,
    status: "active",
    source_kind: item.source,
    source_id: item.sourceId,
    track: item.track,
    medication: item.medication,
    dose_label: item.doseLabel,
    supply_cycle: item.supplyCycle,
    pharmacy: extras?.pharmacy ?? null,
    anchor_at: item.anchorAt,
    next_refill_at: item.dueAt,
    price_usd: extras?.priceUsd ?? null,
    autopay_ledger_id: extras?.autopayLedgerId ?? null,
    metadata: extras ? {} : {},
  };
}
