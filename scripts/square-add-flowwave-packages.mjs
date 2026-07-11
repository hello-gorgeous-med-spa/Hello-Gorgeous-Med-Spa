// One-off: add FlowWave shockwave services + July Recovery Stack packages
// to the Hello Gorgeous Med Spa RX Square account.
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
const MIN45 = 45 * 60 * 1000;

const SERVICES = [
  {
    key: "fw-intro",
    name: "FlowWave Shockwave — Intro First Session (Any Area)",
    price: 4900,
    duration: MIN30,
    desc: "First focused shockwave session on any area — NP-screened, non-invasive, drug-free. 3–10 minutes of treatment per area, zero downtime.",
  },
  {
    key: "fw-single",
    name: "FlowWave Shockwave — Single Session",
    price: 17500,
    duration: MIN30,
    desc: "One focused shockwave session, any single area. NP-directed care.",
  },
  {
    key: "fw-6",
    name: "FlowWave Shockwave — 6-Session Package",
    price: 87000,
    duration: MIN30,
    desc: "6 focused shockwave sessions — $145/session, mix & match areas, save $180 vs. single sessions.",
  },
  {
    key: "fw-12",
    name: "FlowWave Shockwave — 12-Session Package",
    price: 150000,
    duration: MIN30,
    desc: "12 focused shockwave sessions — $125/session, mix & match areas, priority booking. Most popular.",
  },
  {
    key: "fw-24",
    name: "FlowWave Shockwave — 24-Session Package",
    price: 237600,
    duration: MIN30,
    desc: "24 focused shockwave sessions — as low as $99/session, whole-body coverage, lowest per-session rate.",
  },
  {
    key: "fw-mens-6",
    name: "FlowWave Men's Wellness — 6-Session Program",
    price: 180000,
    duration: MIN45,
    desc: "Private, provider-directed men's wellness shockwave program — 6 sessions, full confidentiality.",
  },
  {
    key: "fw-mens-12",
    name: "FlowWave Men's Wellness — 12-Session Program",
    price: 300000,
    duration: MIN45,
    desc: "Private, provider-directed men's wellness shockwave program — 12 sessions at the best per-session rate.",
  },
  {
    key: "fw-stack-1mo",
    name: "Recovery Stack — 1 Month (5 Shockwave Sessions + 1 Month BPC-157)",
    price: 89900,
    duration: MIN45,
    desc: "July dual promotion: 5 focused shockwave sessions plus 1 month of RE GEN BPC-157 peptide support. Pain relief, recovery support, mobility. NP-directed, medically screened, no downtime. Save $251+.",
  },
  {
    key: "fw-stack-3mo",
    name: "Recovery Stack — 3 Month (10 Shockwave Sessions + 3 Months BPC-157)",
    price: 179900,
    duration: MIN45,
    desc: "July dual promotion: 10 focused shockwave sessions plus 3 months of RE GEN BPC-157 peptide support. Two powerful treatments, one complete recovery plan. NP-directed, medically screened. Save $601+.",
  },
];

(async () => {
  // Skip anything already in the catalog by exact name
  let existing = [], cursor = "";
  do {
    const r = await fetch(
      "https://connect.squareup.com/v2/catalog/list?types=ITEM" + (cursor ? "&cursor=" + cursor : ""),
      { headers },
    );
    const j = await r.json();
    existing = existing.concat(j.objects || []);
    cursor = j.cursor || "";
  } while (cursor);
  const existingNames = new Set(existing.map((i) => i.item_data?.name));

  const objects = SERVICES.filter((s) => !existingNames.has(s.name)).map((s) => ({
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

  if (!objects.length) {
    console.log("All services already exist — nothing to add.");
    return;
  }

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
  for (const o of j.objects || []) {
    const v = o.item_data?.variations?.[0]?.item_variation_data;
    console.log("CREATED:", o.item_data?.name, "· $" + (v?.price_money?.amount / 100));
  }
})();
