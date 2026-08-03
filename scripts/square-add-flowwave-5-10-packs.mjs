// One-off: add FlowWave 5-pack ($749) and 10-pack ($1,199) services
// to the Hello Gorgeous Med Spa Square account.
//
// Usage:
//   node scripts/square-add-flowwave-5-10-packs.mjs           # dry-run
//   node scripts/square-add-flowwave-5-10-packs.mjs --apply   # create items
//
import { readFileSync } from "node:fs";
import crypto from "node:crypto";

const env = {};
for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].replace(/^"|"$/g, "");
}

const headers = {
  Authorization: `Bearer ${env.SQUARE_ACCESS_TOKEN}`,
  "Square-Version": "2025-01-23",
  "Content-Type": "application/json",
};

const DANIELLE = "TMqnS9cNU-3s3lUR";
const RYAN = "TM1IptWCrgxkY4p7";
const MIN30 = 30 * 60 * 1000;

const SERVICES = [
  {
    key: "fw-5",
    name: "FlowWave Shockwave — 5-Session Package",
    price: 74900, // $749
    duration: MIN30,
    desc: "5 focused shockwave sessions — $150/session, mix & match areas. Save 14% vs. single sessions.",
  },
  {
    key: "fw-10",
    name: "FlowWave Shockwave — 10-Session Package",
    price: 119900, // $1,199
    duration: MIN30,
    desc: "10 focused shockwave sessions — $120/session, mix & match areas. Save 31% vs. single sessions.",
  },
];

const DRY_RUN = !process.argv.includes("--apply");

(async () => {
  console.log(DRY_RUN ? "[DRY RUN] Checking existing catalog...\n" : "[APPLY] Creating items...\n");

  // List existing FlowWave items to avoid duplicates
  let existing = [];
  let cursor = "";
  do {
    const r = await fetch(
      "https://connect.squareup.com/v2/catalog/list?types=ITEM" + (cursor ? "&cursor=" + cursor : ""),
      { headers }
    );
    const j = await r.json();
    existing = existing.concat(j.objects || []);
    cursor = j.cursor || "";
  } while (cursor);

  const flowWaveItems = existing.filter((i) =>
    i.item_data?.name?.toLowerCase().includes("flowwave")
  );

  console.log("Existing FlowWave items in catalog:");
  for (const item of flowWaveItems) {
    const v = item.item_data?.variations?.[0]?.item_variation_data;
    const price = v?.price_money?.amount ? `$${(v.price_money.amount / 100).toFixed(2)}` : "N/A";
    console.log(`  - ${item.item_data?.name} · ${price} · ID: ${item.id}`);
  }
  console.log("");

  const existingNames = new Set(existing.map((i) => i.item_data?.name?.toLowerCase()));

  const toCreate = SERVICES.filter(
    (s) => !existingNames.has(s.name.toLowerCase())
  );

  if (!toCreate.length) {
    console.log("All FlowWave 5-pack and 10-pack items already exist. Nothing to create.");
    return;
  }

  console.log(`Will create ${toCreate.length} new item(s):`);
  for (const s of toCreate) {
    console.log(`  - ${s.name} · $${(s.price / 100).toFixed(2)}`);
  }
  console.log("");

  if (DRY_RUN) {
    console.log("Run with --apply to actually create these items.");
    return;
  }

  const objects = toCreate.map((s) => ({
    type: "ITEM",
    id: `#${s.key}`,
    present_at_all_locations: true,
    item_data: {
      name: s.name,
      description: s.desc,
      product_type: "APPOINTMENTS_SERVICE",
      variations: [
        {
          type: "ITEM_VARIATION",
          id: `#${s.key}-std`,
          present_at_all_locations: true,
          item_variation_data: {
            name: "Standard",
            pricing_type: "FIXED_PRICING",
            price_money: { amount: s.price, currency: "USD" },
            service_duration: s.duration,
            available_for_booking: true,
            team_member_ids: [DANIELLE, RYAN],
          },
        },
      ],
    },
  }));

  const res = await fetch("https://connect.squareup.com/v2/catalog/batch-upsert", {
    method: "POST",
    headers,
    body: JSON.stringify({
      idempotency_key: crypto.randomUUID(),
      batches: [{ objects }],
    }),
  });
  const j = await res.json();

  if (!res.ok) {
    console.error("FAILED:", res.status, JSON.stringify(j.errors || j).slice(0, 600));
    process.exit(1);
  }

  console.log("Created items:");
  for (const o of j.objects || []) {
    const v = o.item_data?.variations?.[0]?.item_variation_data;
    console.log(
      `  CREATED: ${o.item_data?.name} · $${(v?.price_money?.amount / 100).toFixed(2)} · ID: ${o.id}`
    );
  }
})();
