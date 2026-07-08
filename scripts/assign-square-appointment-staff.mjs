#!/usr/bin/env node
/**
 * Assign bookable team members to all Square APPOINTMENTS_SERVICE variations.
 *
 * After bulk catalog rebuild, services exist but online booking shows zero until
 * each variation has team_member_ids set (Square Catalog API requirement).
 *
 * USAGE:
 *   node --env-file=.env.local scripts/assign-square-appointment-staff.mjs --dry-run
 *   node --env-file=.env.local scripts/assign-square-appointment-staff.mjs --apply
 *
 * Optional:
 *   --team-ids=id1,id2   Override auto-detected bookable staff IDs
 */

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run") || !args.includes("--apply");
const getArg = (name) => {
  const hit = args.find((a) => a.startsWith(`${name}=`));
  return hit ? hit.slice(name.length + 1) : null;
};

const envName = (process.env.SQUARE_ENVIRONMENT || process.env.SQUARE_ENV || "production").toLowerCase();
const HOST =
  envName === "sandbox" ? "https://connect.squareupsandbox.com" : "https://connect.squareup.com";
const TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const SQUARE_VERSION = "2025-04-16";

if (!TOKEN || TOKEN.length < 10) {
  console.error("❌ Missing SQUARE_ACCESS_TOKEN");
  process.exit(1);
}

async function squareFetch(method, path, body) {
  const res = await fetch(`${HOST}/v2${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Square-Version": SQUARE_VERSION,
      "Content-Type": "application/json",
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await res.json();
  if (!res.ok) {
    const msg = data.errors?.map((e) => e.detail || e.code).join("; ") || res.statusText;
    throw new Error(msg);
  }
  return data;
}

async function listCatalogObjects(types) {
  const out = [];
  let cursor;
  do {
    const data = await squareFetch("POST", "/catalog/search", {
      object_types: types,
      ...(cursor ? { cursor } : {}),
    });
    out.push(...(data.objects || []));
    cursor = data.cursor;
  } while (cursor);
  return out;
}

async function getBookableTeamMemberIds() {
  const override = getArg("--team-ids");
  if (override) {
    return override.split(",").map((s) => s.trim()).filter(Boolean);
  }
  const data = await squareFetch("GET", "/bookings/team-member-booking-profiles");
  return (data.team_member_booking_profiles || [])
    .filter((p) => p.is_bookable)
    .map((p) => p.team_member_id);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function variationNeedsAssignment(variation, teamIds) {
  const ids = variation.item_variation_data?.team_member_ids || [];
  if (!ids.length) return true;
  const want = new Set(teamIds);
  return teamIds.some((id) => !ids.includes(id));
}

function buildVariationUpdate(item, variation, teamIds) {
  const vd = variation.item_variation_data || {};
  return {
    type: "ITEM_VARIATION",
    id: variation.id,
    version: variation.version,
    present_at_all_locations: variation.present_at_all_locations ?? true,
    item_variation_data: {
      item_id: vd.item_id || item.id,
      name: vd.name ?? "Regular",
      ordinal: vd.ordinal ?? 0,
      pricing_type: vd.pricing_type ?? "VARIABLE_PRICING",
      ...(vd.price_money ? { price_money: vd.price_money } : {}),
      ...(vd.service_duration != null ? { service_duration: vd.service_duration } : {}),
      available_for_booking: vd.available_for_booking ?? true,
      team_member_ids: teamIds,
      ...(vd.sellable != null ? { sellable: vd.sellable } : {}),
      ...(vd.stockable != null ? { stockable: vd.stockable } : {}),
      ...(vd.channels ? { channels: vd.channels } : {}),
    },
  };
}

async function main() {
  console.log("═══════════════════════════════════════════════════");
  console.log(" Assign bookable staff → Square appointment services");
  console.log("═══════════════════════════════════════════════════");
  console.log(` Env:  ${envName}`);
  console.log(` Mode: ${DRY_RUN ? "DRY-RUN" : "APPLY"}`);
  console.log("");

  const teamIds = await getBookableTeamMemberIds();
  if (!teamIds.length) {
    console.error("❌ No bookable team members found (check booking profiles or pass --team-ids=)");
    process.exit(1);
  }
  console.log(` Bookable staff (${teamIds.length}): ${teamIds.join(", ")}`);

  console.log("\n📥 Loading appointment catalog…");
  const items = (await listCatalogObjects(["ITEM"])).filter(
    (o) => !o.is_deleted && o.item_data?.product_type === "APPOINTMENTS_SERVICE",
  );

  const toUpdate = [];
  let alreadyOk = 0;
  let notBookable = 0;

  for (const item of items) {
    for (const variation of item.item_data?.variations || []) {
      if (variation.is_deleted) continue;
      const bookable = variation.item_variation_data?.available_for_booking;
      if (!bookable) {
        notBookable++;
        continue;
      }
      if (variationNeedsAssignment(variation, teamIds)) {
        toUpdate.push({ item, variation, object: buildVariationUpdate(item, variation, teamIds) });
      } else {
        alreadyOk++;
      }
    }
  }

  console.log(`   Appointment items:     ${items.length}`);
  console.log(`   Variations OK:         ${alreadyOk}`);
  console.log(`   Not online-bookable:   ${notBookable}`);
  console.log(`   Need staff assignment: ${toUpdate.length}`);

  if (!toUpdate.length) {
    console.log("\n✅ All bookable variations already have team members assigned.");
    return;
  }

  if (DRY_RUN) {
    console.log("\nSample (first 5):");
    for (const row of toUpdate.slice(0, 5)) {
      console.log(`  • ${row.item.item_data?.name}`);
    }
    console.log("\nRe-run with --apply to update Square.");
    return;
  }

  console.log("\n🔧 Updating variations…");
  let ok = 0;
  let failed = 0;

  for (let i = 0; i < toUpdate.length; i++) {
    const { item, object } = toUpdate[i];
    try {
      await squareFetch("POST", "/catalog/object", {
        idempotency_key: `hg-assign-staff-${object.id}-${Date.now()}-${i}`.slice(0, 128),
        object,
      });
      ok++;
      if (ok <= 10 || ok % 20 === 0) {
        console.log(`  ✓ ${item.item_data?.name}`);
      }
      await sleep(80);
    } catch (e) {
      failed++;
      console.log(`  ✕ ${item.item_data?.name}: ${e.message}`);
    }
  }

  console.log("\n✅ Staff assignment complete");
  console.log(`   Updated: ${ok}`);
  console.log(`   Failed:  ${failed}`);
  console.log("\nVerify: Square Dashboard → Online booking, or open your /book embed.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
