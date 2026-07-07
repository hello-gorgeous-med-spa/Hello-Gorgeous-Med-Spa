#!/usr/bin/env npx tsx
/**
 * Create a Square $-off discount (Catalog API) for POS / Bestie-style promos.
 *
 * Usage:
 *   npm run square:discount-code:local
 *   npm run square:discount-code:local -- --code=BESTIE100 --amount=100
 *
 * Env: SQUARE_ACCESS_TOKEN, optional SQUARE_ENVIRONMENT=production|sandbox
 */

import { createSquareFixedAmountDiscount } from "../lib/square/discount-codes";

function arg(name: string): string | undefined {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.split("=").slice(1).join("=") : undefined;
}

const DRY_RUN = process.argv.includes("--dry-run");
const code = (arg("code") || "BESTIE100").toUpperCase();
const amountUsd = Number(arg("amount") || "100");
const name = arg("name") || `$${amountUsd} Off Bestie Program`;

async function main() {
  if (!process.env.SQUARE_ACCESS_TOKEN) {
    console.error("Missing SQUARE_ACCESS_TOKEN — set in .env.local");
    process.exit(1);
  }

  const env = process.env.SQUARE_ENVIRONMENT || process.env.SQUARE_ENV || "sandbox";
  console.log(`Square environment: ${env}`);
  console.log(`Creating discount ${code} ($${amountUsd.toFixed(2)} off)…\n`);

  if (DRY_RUN) {
    console.log(JSON.stringify({ code, name, amountUsd, dryRun: true }, null, 2));
    return;
  }

  const result = await createSquareFixedAmountDiscount({ code, name, amountUsd });

  console.log("✅ Square discount created\n");
  console.log(`  Code label:     ${result.code}`);
  console.log(`  POS name:       ${result.name}`);
  console.log(`  Amount off:     $${result.amountUsd.toFixed(2)}`);
  console.log(`  Discount ID:    ${result.discountId}`);
  console.log(`  Pricing rule:   ${result.pricingRuleId}`);
  console.log(`\n  POS: ${result.posInstructions}`);
  console.log(`\n  Online code: ${result.dashboardInstructions}`);
}

main().catch((e) => {
  console.error("\n❌", e instanceof Error ? e.message : e);
  process.exit(1);
});
