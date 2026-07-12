#!/usr/bin/env node
/**
 * Assign Square appointment staff by Hello Gorgeous provider rules.
 *
 * Routing (owner-defined):
 *   Marissa  — spa (lash, brow, skin, IV, vitamins) — NOT medical / botox / fillers / laser / FlowWave
 *   Ryan     — medical, botox, fillers, weight loss, BHRT, peptides, laser, microneedling,
 *              InMode, PRP, trigger point, FlowWave
 *   Danielle — everything EXCEPT botox & fillers
 *   Michelle + Laura — FlowWave / Recovery Stack only
 *
 * USAGE:
 *   node --env-file=.env.local scripts/assign-square-staff-by-rules.mjs --dry-run
 *   node --env-file=.env.local scripts/assign-square-staff-by-rules.mjs --apply
 */

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run") || !args.includes("--apply");

const envName = (process.env.SQUARE_ENVIRONMENT || process.env.SQUARE_ENV || "production").toLowerCase();
const HOST =
  envName === "sandbox" ? "https://connect.squareupsandbox.com" : "https://connect.squareup.com";
const TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const SQUARE_VERSION = "2025-04-16";

/** Hello Gorgeous Med Spa RX — production team member IDs */
export const TEAM = {
  ryan: "TM1IptWCrgxkY4p7",
  danielle: "TMqnS9cNU-3s3lUR",
  marissa: "TMjZzrkoSsBocyWm",
  michelle: "TMqy8tRlmyMRkQ25",
  laura: "TMxkWb1md-cZHvkq",
};

const NAMES = {
  [TEAM.ryan]: "Ryan",
  [TEAM.danielle]: "Danielle",
  [TEAM.marissa]: "Marissa",
  [TEAM.michelle]: "Michelle",
  [TEAM.laura]: "Laura",
};

if (!TOKEN || TOKEN.length < 10) {
  console.error("❌ Missing SQUARE_ACCESS_TOKEN");
  process.exit(1);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function norm(s) {
  return String(s || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function idsEqual(a, b) {
  if (a.length !== b.length) return false;
  const sa = [...a].sort();
  const sb = [...b].sort();
  return sa.every((id, i) => id === sb[i]);
}

function labelIds(ids) {
  return ids.map((id) => NAMES[id] || id).join(", ");
}

/**
 * Resolve staff for a service from category + name.
 * Order matters: more specific rules first.
 */
function resolveStaff(serviceName, categoryNames) {
  const n = norm(serviceName);
  const cats = categoryNames.map(norm).join(" | ");
  const hay = `${n} ${cats}`;

  // ── FlowWave / Recovery Stack → Michelle, Laura, Ryan (+ Danielle for coverage) ──
  if (
    /flowwave|shockwave|recovery stack/.test(hay) ||
    cats.includes("flowwave")
  ) {
    return {
      ids: [TEAM.michelle, TEAM.laura, TEAM.ryan, TEAM.danielle],
      rule: "FlowWave / Recovery Stack → Michelle, Laura, Ryan, Danielle",
    };
  }

  // ── Botox / neuromodulators → Ryan only ──
  if (
    /\bbotox\b|jeuveau|dysport|neuromodulator|lip flip/.test(hay) ||
    cats.includes("botox")
  ) {
    // Baby Tox + microneedling is a combo — Ryan + Danielle (Danielle does MN)
    if (/baby tox|micro.?tox|microneedl/.test(n) && !/lip flip|special \$10|\/ unit|per unit/.test(n)) {
      return {
        ids: [TEAM.ryan, TEAM.danielle],
        rule: "Baby Tox / MicroTox combo → Ryan + Danielle",
      };
    }
    return {
      ids: [TEAM.ryan],
      rule: "Botox / neuromodulators → Ryan only",
    };
  }

  // ── Dermal fillers → Ryan only (Danielle excluded) ──
  if (
    /filler|hylanex|lip dissolver|per syringe/.test(hay) ||
    cats.includes("dermal fillers")
  ) {
    return {
      ids: [TEAM.ryan],
      rule: "Dermal fillers → Ryan only",
    };
  }

  // ── Weight loss / GLP-1 → Ryan only ──
  if (
    /semaglutide|tirzepatide|retatrutide|weight loss|glp.?1|wegovy|ozempic|mounjaro|zepbound|prepaid injection/.test(
      hay,
    ) ||
    cats.includes("weight loss injections")
  ) {
    return {
      ids: [TEAM.ryan],
      rule: "Weight loss / GLP-1 → Ryan only",
    };
  }

  // ── BHRT / peptides / hormone labs → Ryan only ──
  if (
    /pellet|hormone|peptide|bhrt|bioidentical/.test(hay) ||
    cats.includes("bioidentical hormone therapy (bhrt)")
  ) {
    return {
      ids: [TEAM.ryan],
      rule: "BHRT / peptides / hormones → Ryan only",
    };
  }

  // ── Medical consult / trigger point → Ryan only ──
  if (
    /medical visit|trigger point|consultation with ryan/.test(hay) ||
    cats.includes("medical consultations") ||
    cats.includes("trigger point injections")
  ) {
    return {
      ids: [TEAM.ryan],
      rule: "Medical / trigger point → Ryan only",
    };
  }

  // ── PRP injections (medical) → Ryan only ──
  if (/prp|prf|vampire|joint/.test(hay) || cats.includes("prp injections")) {
    // Topical PRP + microneedling can include Danielle
    if (/topical|microneedl|facial/.test(n)) {
      return {
        ids: [TEAM.ryan, TEAM.danielle],
        rule: "PRP facial / topical microneedling → Ryan + Danielle",
      };
    }
    return {
      ids: [TEAM.ryan],
      rule: "PRP / PRF injections → Ryan only",
    };
  }

  // ── Laser hair → Ryan only ──
  if (/laser hair|brazilian laser/.test(hay)) {
    return {
      ids: [TEAM.ryan],
      rule: "Laser hair removal → Ryan only",
    };
  }

  // ── InMode / Morpheus8 / Solaria / Quantum RF / microneedling → Ryan + Danielle ──
  if (
    /morpheus|solaria|quantum rf|microneedl|nano needl|anteage|carbon laser|the trifecta|dani.?fix me|inmode/.test(
      hay,
    ) ||
    cats.includes("exclusive model specials") ||
    cats.includes("inmode advanced face & body resurfacing") ||
    cats.includes("anteage skin regeneration") ||
    cats.includes("anteage  the future of skin regeneration is here")
  ) {
    return {
      ids: [TEAM.ryan, TEAM.danielle],
      rule: "InMode / microneedling / AnteAGE → Ryan + Danielle",
    };
  }

  // ── Body contouring (non-laser spa) → Danielle + Marissa ──
  if (/body contouring/.test(hay) || (cats.includes("body spa") && !/laser/.test(hay))) {
    return {
      ids: [TEAM.danielle, TEAM.marissa],
      rule: "Body Spa (non-laser) → Danielle + Marissa",
    };
  }

  // ── Lash Spa → Marissa (+ Danielle for coverage) ──
  if (/lash|eyelash|korean lash/.test(hay) || cats.includes("lash spa")) {
    return {
      ids: [TEAM.marissa, TEAM.danielle],
      rule: "Lash Spa → Marissa + Danielle",
    };
  }

  // ── Brow Spa / microblading → Marissa + Danielle ──
  if (
    /brow|microblad|wax.?lip|henna/.test(hay) ||
    cats.includes("brow spa")
  ) {
    return {
      ids: [TEAM.marissa, TEAM.danielle],
      rule: "Brow Spa / microblading → Marissa + Danielle",
    };
  }

  // ── GlowTox signature → Danielle + Marissa ──
  if (/glowtox|glass glow/.test(hay) || cats.includes("glowtox facial")) {
    return {
      ids: [TEAM.danielle, TEAM.marissa],
      rule: "GlowTox → Danielle + Marissa",
    };
  }

  // ── Skin Spa / facials → Marissa + Danielle ──
  if (
    /facial|hydra|geneo|chemical peel|photofacial|ipl|dermaplan|high frequency|salmon dna|vi peel|oxygen|diamond|signature facial|microderm/.test(
      hay,
    ) ||
    cats.includes("skin spa")
  ) {
    return {
      ids: [TEAM.marissa, TEAM.danielle],
      rule: "Skin Spa / facials → Marissa + Danielle",
    };
  }

  // ── IV drips → Marissa + Danielle ──
  if (/iv drip|myers|hangover|jet lag|b lean|nad\+/.test(hay) || cats.includes("iv drip package deals")) {
    return {
      ids: [TEAM.marissa, TEAM.danielle],
      rule: "IV drips → Marissa + Danielle",
    };
  }

  // ── Vitamin injections → Marissa + Danielle ──
  if (
    /vitamin|b12|b complex|glutathione|mic.?lipo|injection bar/.test(hay) ||
    cats.includes("vitamin injections")
  ) {
    return {
      ids: [TEAM.marissa, TEAM.danielle],
      rule: "Vitamin injections → Marissa + Danielle",
    };
  }

  // ── Spring specials — route by name keywords already handled; fallback spa ──
  if (cats.includes("spring specials")) {
    return {
      ids: [TEAM.ryan, TEAM.danielle],
      rule: "Spring specials fallback → Ryan + Danielle",
    };
  }

  // ── Default spa coverage (Danielle + Marissa) — never Michelle/Laura outside FlowWave ──
  return {
    ids: [TEAM.danielle, TEAM.marissa],
    rule: "Default spa coverage → Danielle + Marissa",
  };
}

async function squareFetch(method, path, body) {
  const res = await fetch(`${HOST}/v2${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Square-Version": SQUARE_VERSION,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await res.json().catch(() => ({}));
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
      limit: 100,
      ...(cursor ? { cursor } : {}),
    });
    out.push(...(data.objects || []));
    cursor = data.cursor;
  } while (cursor);
  return out;
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
  console.log("\n═══════════════════════════════════════════════════");
  console.log(" Square staff-by-rules assignment");
  console.log("═══════════════════════════════════════════════════");
  console.log(` Mode: ${DRY_RUN ? "DRY-RUN" : "APPLY"}`);
  console.log("");

  // Warn if Laura isn't bookable yet
  const book = await squareFetch("GET", "/bookings/team-member-booking-profiles");
  const bookable = new Set(
    (book.team_member_booking_profiles || [])
      .filter((p) => p.is_bookable)
      .map((p) => p.team_member_id),
  );
  for (const [key, id] of Object.entries(TEAM)) {
    const ok = bookable.has(id);
    console.log(`  ${ok ? "✓" : "⚠"} ${NAMES[id].padEnd(10)} ${id}  ${ok ? "bookable" : "NOT bookable — enable in Square Dashboard → Team"}`);
  }
  console.log("");

  const objects = await listCatalogObjects(["ITEM", "CATEGORY"]);
  const catById = new Map();
  for (const c of objects.filter((o) => o.type === "CATEGORY" && !o.is_deleted)) {
    catById.set(c.id, c.category_data?.name || "");
  }

  const items = objects.filter(
    (o) => o.type === "ITEM" && !o.is_deleted && o.item_data?.product_type === "APPOINTMENTS_SERVICE",
  );

  const plan = [];
  const byRule = new Map();

  for (const item of items) {
    const name = item.item_data?.name || "";
    const catIds = [
      ...(item.item_data?.category_id ? [item.item_data.category_id] : []),
      ...((item.item_data?.categories || []).map((c) => c.id) || []),
    ];
    const catNames = [...new Set(catIds.map((id) => catById.get(id)).filter(Boolean))];
    const { ids, rule } = resolveStaff(name, catNames);

    byRule.set(rule, (byRule.get(rule) || 0) + 1);

    for (const variation of item.item_data?.variations || []) {
      if (variation.is_deleted) continue;
      const current = variation.item_variation_data?.team_member_ids || [];
      if (idsEqual(current, ids)) continue;
      plan.push({
        item,
        variation,
        name,
        catNames,
        ids,
        rule,
        current,
        object: buildVariationUpdate(item, variation, ids),
      });
    }
  }

  console.log(` Appointment services: ${items.length}`);
  console.log(` Need update:          ${plan.length}`);
  console.log(` Already correct:      ${items.length - new Set(plan.map((p) => p.item.id)).size}`);
  console.log("\n── Rules breakdown ──");
  for (const [rule, count] of [...byRule.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(count).padStart(3)}  ${rule}`);
  }

  if (plan.length) {
    console.log("\n── Sample changes (first 20) ──");
    for (const row of plan.slice(0, 20)) {
      console.log(`  ${row.name}`);
      console.log(`      ${labelIds(row.current) || "(none)"} → ${labelIds(row.ids)}`);
      console.log(`      [${row.rule}]`);
    }
    if (plan.length > 20) console.log(`  … +${plan.length - 20} more`);
  }

  if (DRY_RUN) {
    console.log("\nRe-run with --apply to push staff assignments to Square.");
    return;
  }

  console.log("\n🔧 Applying…");
  let ok = 0;
  let failed = 0;
  for (let i = 0; i < plan.length; i++) {
    const row = plan[i];
    try {
      await squareFetch("POST", "/catalog/object", {
        idempotency_key: `hg-staff-rules-${row.object.id}-${Date.now()}-${i}`.slice(0, 128),
        object: row.object,
      });
      ok++;
      if (ok <= 15 || ok % 25 === 0) {
        console.log(`  ✓ ${row.name} → ${labelIds(row.ids)}`);
      }
      await sleep(90);
    } catch (e) {
      failed++;
      console.log(`  ✕ ${row.name}: ${e.message}`);
    }
  }

  console.log(`\n✅ Done — updated ${ok}, failed ${failed}`);
  if (!bookable.has(TEAM.laura)) {
    console.log(
      "\n⚠ Laura is assigned to FlowWave but is NOT enabled for online booking yet.",
    );
    console.log("  Square Dashboard → Team → Laura Witt → enable Appointments / Bookable.");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
