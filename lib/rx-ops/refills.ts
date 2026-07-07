import type { SupabaseClient } from "@supabase/supabase-js";

import { refillUrgencyForDue } from "@/lib/rx-clinic-refill";
import { GLP1_REFILL_PATH, PEPTIDE_REQUEST_PATH } from "@/lib/flows";
import { listRefillPlans, syncRefillPlansFromCadence } from "@/lib/rx-refill-plans/plans";
import type { RxOpsRefillRow } from "@/lib/rx-ops/types";
import { getTelehealthRecheckStatus } from "@/lib/rx-telehealth/recheck";

function reorderHref(track: string): string {
  if (track === "peptide") return PEPTIDE_REQUEST_PATH;
  return GLP1_REFILL_PATH;
}

function money(n: number | null): string | null {
  if (n == null || Number.isNaN(n)) return null;
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export async function buildRxOpsRefillsPayload(
  admin?: SupabaseClient | null,
): Promise<{ refills: RxOpsRefillRow[]; tableReady: boolean }> {
  await syncRefillPlansFromCadence(admin);
  const { rows, tableReady } = await listRefillPlans({ status: "all", limit: 50 }, admin);
  if (!tableReady) return { refills: [], tableReady: false };

  const recheckCache = new Map<string, boolean>();
  const refills: RxOpsRefillRow[] = [];

  for (const plan of rows) {
    let telehealthRecheckDue = false;
    if (plan.client_id) {
      let cached = recheckCache.get(plan.client_id);
      if (cached === undefined) {
        const recheck = await getTelehealthRecheckStatus(plan.client_id, admin);
        cached = recheck.due;
        recheckCache.set(plan.client_id, cached);
      }
      telehealthRecheckDue = cached;
    }

    const due = new Date(plan.next_refill_at);
    const urgency = refillUrgencyForDue(due);
    const nextSoon = urgency === "due_soon" || urgency === "overdue";

    let displayStatus: RxOpsRefillRow["status"] = "Active";
    if (plan.status === "paused") displayStatus = "Paused";
    else if (telehealthRecheckDue || urgency === "overdue") displayStatus = "Due";

    refills.push({
      id: plan.id,
      patientName: plan.client_name || "Client",
      plan: `${plan.medication}${plan.dose_label ? ` · ${plan.dose_label}` : ""}`,
      pharmacy: plan.pharmacy || "—",
      cadence: plan.supply_cycle,
      nextRefill: due.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      nextSoon,
      price: money(plan.price_usd),
      status: displayStatus,
      planStatus: plan.status,
      telehealthRecheckDue,
      draftLedgerId: plan.draft_ledger_id,
      reorderHref: reorderHref(plan.track),
    });
  }

  return { refills, tableReady: true };
}
