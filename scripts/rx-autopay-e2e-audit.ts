/**
 * Read-only + optional simulated renewal audit for Phase 4A.
 * Usage:
 *   npx tsx --env-file=.env.local scripts/rx-autopay-e2e-audit.ts
 *   npx tsx --env-file=.env.local scripts/rx-autopay-e2e-audit.ts --execute
 */

import { randomBytes } from "crypto";

import { buildRxE2eReport } from "@/lib/rx-e2e-checklist";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { findHgClientForSquareCustomer } from "@/lib/hg-rewards/credit-from-square-payment";
import { loadSubmissionById } from "@/lib/rx-submission-context";
import {
  processRxAutopayRenewalFromSquarePayment,
  type SquareRxPayment,
} from "@/lib/rx-autopay-renewal";

const execute = process.argv.includes("--execute");

function section(title: string) {
  console.log(`\n=== ${title} ===`);
}

async function main() {
  const admin = getSupabaseAdminClient();
  if (!admin) {
    console.error("FAIL: Supabase admin client unavailable (.env.local?)");
    process.exit(1);
  }

  section("A. Pipeline health (E2E checklist)");
  const report = await buildRxE2eReport(admin);
  for (const c of report.checks) {
    console.log(`  [${c.status.toUpperCase()}] ${c.label}: ${c.detail}`);
  }
  console.log(`  READY: ${report.ready ? "yes" : "no"}`);

  section("B. Auto-pay enrollments in ledger");
  const { data: autopayRows, error: autopayErr } = await admin
    .from("hg_rx_payment_ledger")
    .select(
      "id, source, payment_status, amount_usd, intake_ref, client_id, client_name, submission_id, paid_at, metadata, square_payment_id",
    )
    .in("source", ["glp1_autopay", "clinic_autopay"])
    .order("paid_at", { ascending: false })
    .limit(20);

  if (autopayErr) {
    console.error("  Query error:", autopayErr.message);
  } else if (!autopayRows?.length) {
    console.log("  No glp1_autopay / clinic_autopay ledger rows yet.");
  } else {
    for (const r of autopayRows) {
      const meta = (r.metadata as Record<string, unknown>) ?? {};
      console.log(
        `  • ${r.intake_ref || r.id.slice(0, 8)} | ${r.source} | ${r.payment_status} | $${r.amount_usd} | enrollment=${meta.autopay_enrollment ?? "pending"} | ${r.client_name}`,
      );
    }
  }

  const active = (autopayRows ?? []).filter(
    (r) =>
      r.payment_status === "paid" &&
      (r.metadata as Record<string, unknown>)?.autopay_enrollment === "active",
  );

  section("C. Active enrollments — renewal readiness");
  if (!active.length) {
    console.log("  No active auto-pay enrollments. Renewal path untested in prod until first patient completes auto-pay setup.");
  }

  for (const enrollment of active) {
    console.log(`\n  Enrollment: ${enrollment.intake_ref} (${enrollment.source})`);
    const meta = (enrollment.metadata as Record<string, unknown>) ?? {};
    const squareCustomerId = String(meta.square_customer_id || "");

    const { data: client } = enrollment.client_id
      ? await admin.from("clients").select("id, email, square_customer_id").eq("id", enrollment.client_id).maybeSingle()
      : { data: null };

    console.log(`    client square_customer_id: ${client?.square_customer_id || "(none)"}`);
    console.log(`    ledger square_customer_id: ${squareCustomerId || "(none)"}`);

    const lookupId = client?.square_customer_id || squareCustomerId;
    if (lookupId) {
      const hg = await findHgClientForSquareCustomer(admin, { squareCustomerId: lookupId });
      console.log(`    findHgClientForSquareCustomer: ${hg ? `OK (${hg.email})` : "FAIL — renewal would stop"}`);
    } else {
      console.log(`    findHgClientForSquareCustomer: SKIP — no square customer id`);
    }

    if (enrollment.source === "glp1_autopay") {
      if (!enrollment.submission_id) {
        console.log(`    clone intake: FAIL — enrollment missing submission_id`);
      } else {
        const ctx = await loadSubmissionById(admin, enrollment.submission_id);
        console.log(
          `    source submission: ${ctx ? `OK slug=${ctx.slug} ref=${ctx.intakeRef}` : "FAIL — cannot clone"}`,
        );
      }
    }

    if (enrollment.source === "clinic_autopay") {
      const encId = String(meta.clinicEncounterId || "");
      console.log(`    clinic encounter id: ${encId || "(none in metadata)"}`);
    }
  }

  section("D. Recent RX dispatch queue");
  const { data: dispatchRows } = await admin
    .from("hg_rx_dispatch")
    .select("submission_id, status, patient_name, updated_at, updated_by, staff_notes")
    .order("updated_at", { ascending: false })
    .limit(8);

  if (!dispatchRows?.length) {
    console.log("  No dispatch rows.");
  } else {
    for (const d of dispatchRows) {
      console.log(
        `  • ${d.status} | ${d.patient_name || "?"} | by ${d.updated_by || "?"} | ${d.updated_at?.slice(0, 10)}`,
      );
    }
  }

  section("E. Simulated Square renewal payment (logic only)");
  const mockPayment: SquareRxPayment = {
    id: `SIM_${randomBytes(8).toString("hex")}`,
    status: "COMPLETED",
    customer_id: "SIM_CUSTOMER_NO_MATCH",
    order_id: null,
    amount_money: { amount: 99900, currency: "USD" },
    total_money: { amount: 99900, currency: "USD" },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const sim = await processRxAutopayRenewalFromSquarePayment(admin, mockPayment);
  console.log(`  Mock payment (no real customer): processed=${sim.processed} reason=${sim.reason}`);

  if (active.length) {
    const enc = active[0];
    const { data: clientRow } = await admin
      .from("clients")
      .select("square_customer_id")
      .eq("id", enc.client_id)
      .maybeSingle();
    const meta = (enc.metadata as Record<string, unknown>) ?? {};
    const custId = clientRow?.square_customer_id || String(meta.square_customer_id || "");

    if (!custId) {
      console.log(`  Skipped realistic mock — active enrollment missing square_customer_id.`);
    } else if (execute) {
      section("F. EXECUTE — live renewal simulation on first active enrollment");
      const amountCents = Math.round(Number(enc.amount_usd) * 100);
      const realistic: SquareRxPayment = {
        id: `SIM_${randomBytes(8).toString("hex")}`,
        status: "COMPLETED",
        customer_id: custId,
        order_id: null,
        amount_money: { amount: amountCents, currency: "USD" },
        total_money: { amount: amountCents, currency: "USD" },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      console.log(`  Payment id: ${realistic.id}`);
      const result = await processRxAutopayRenewalFromSquarePayment(admin, realistic);
      console.log(`  Result:`, JSON.stringify(result, null, 2));

      if (result.processed) {
        const { data: newLedger } = await admin
          .from("hg_rx_payment_ledger")
          .select("id, intake_ref, payment_status, metadata")
          .eq("square_payment_id", realistic.id)
          .maybeSingle();
        console.log(`  New ledger:`, newLedger);
        if (result.intakeRef) {
          console.log(`  Dispatch: /admin/rx-dispatch?ref=${result.intakeRef}`);
        }
      }
    } else {
      console.log(
        `  Would renew for ${enc.client_name} at $${enc.amount_usd} when Square charges customer ${custId.slice(0, 12)}…`,
      );
      console.log(`  Preconditions look OK — pass --execute to create a test renewal row.`);
    }
  }

  section("G. Summary");
  console.log(`  E2E ready: ${report.ready}`);
  console.log(`  Auto-pay ledger rows: ${autopayRows?.length ?? 0}`);
  console.log(`  Active enrollments: ${active.length}`);
  console.log(
    execute
      ? "  Mode: EXECUTE (wrote test renewal if processed=true above)"
      : "  Mode: READ-ONLY audit (no DB writes except idempotency checks)",
  );

  section("H. Full RX pipeline snapshot");
  const { data: ledgerAll } = await admin
    .from("hg_rx_payment_ledger")
    .select("payment_status, source, amount_usd, intake_ref, client_name, created_at")
    .order("created_at", { ascending: false })
    .limit(15);
  if (!ledgerAll?.length) {
    console.log("  No RX ledger rows at all.");
  } else {
    for (const r of ledgerAll) {
      console.log(
        `  • ${r.payment_status} | ${r.source} | $${r.amount_usd} | ${r.intake_ref || "-"} | ${r.client_name || "?"}`,
      );
    }
  }

  const { data: tmplRows } = await admin
    .from("hg_form_templates")
    .select("id, slug")
    .or("slug.ilike.%glp1%,slug.ilike.%peptide%");
  const tmplIds = tmplRows?.map((t) => t.id) ?? [];
  if (tmplIds.length) {
    const { count: subCount } = await admin
      .from("hg_form_submissions")
      .select("id", { count: "exact", head: true })
      .in("template_id", tmplIds);
    const { data: subs } = await admin
      .from("hg_form_submissions")
      .select("signer_name, submitted_at, access_token, client_id")
      .in("template_id", tmplIds)
      .order("submitted_at", { ascending: false })
      .limit(5);
    console.log(`  RX form submissions total: ${subCount ?? 0}`);
    for (const s of subs ?? []) {
      console.log(
        `    ${s.submitted_at?.slice(0, 10) || "?"} | ${s.signer_name || "?"} | ${String(s.access_token).slice(0, 8)}…`,
      );
    }
  }

  const { count: encCount } = await admin
    .from("hg_rx_clinic_encounters")
    .select("id", { count: "exact", head: true });
  const { count: reminderCount } = await admin
    .from("hg_rx_refill_reminders")
    .select("id", { count: "exact", head: true });
  console.log(`  Clinic encounters: ${encCount ?? 0}`);
  console.log(`  Refill reminder log rows: ${reminderCount ?? 0}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
