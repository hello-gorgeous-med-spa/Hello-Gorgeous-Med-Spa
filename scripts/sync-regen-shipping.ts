#!/usr/bin/env npx tsx
/**
 * Backfill RE GEN shipping address from Square for paid orders missing ship-to.
 *
 *   npx tsx scripts/sync-regen-shipping.ts --ref=RG-MR4B66VT
 *   npx tsx scripts/sync-regen-shipping.ts --all-missing
 */

import { getSupabaseAdminClient } from "../lib/hgos/supabase-admin";
import { syncRegenOrderShippingFromSquare } from "../lib/regen/order-square-sync";
import { formatSquareShippingAddress } from "../lib/square/order-shipping";

async function main() {
  const refArg = process.argv.find((a) => a.startsWith("--ref="))?.split("=")[1];
  const allMissing = process.argv.includes("--all-missing");

  const admin = getSupabaseAdminClient();
  if (!admin) {
    console.error("Supabase admin not configured");
    process.exit(1);
  }

  let refs: string[] = [];

  if (refArg) {
    refs = [refArg.trim()];
  } else if (allMissing) {
    const { data, error } = await admin
      .from("regen_orders")
      .select("reference")
      .not("status", "eq", "pending_payment")
      .is("shipping_address", null)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error(error);
      process.exit(1);
    }
    refs = (data ?? []).map((r) => r.reference as string);
  } else {
    console.error("Usage:");
    console.error("  npx tsx scripts/sync-regen-shipping.ts --ref=RG-XXXX");
    console.error("  npx tsx scripts/sync-regen-shipping.ts --all-missing");
    process.exit(1);
  }

  if (!refs.length) {
    console.log("No orders to sync.");
    return;
  }

  let ok = 0;
  for (const ref of refs) {
    console.log(`\n── ${ref}`);
    const result = await syncRegenOrderShippingFromSquare(admin, ref);
    if (result.ok && result.shippingAddress) {
      ok++;
      console.log(formatSquareShippingAddress(result.shippingAddress));
    } else {
      console.log("  ✗ No shipping found (square_order_id may be missing — check Square Dashboard)");
    }
  }

  console.log(`\nDone. ${ok}/${refs.length} synced.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
