#!/usr/bin/env node
/**
 * Put the live website policies on Square:
 *   hellogorgeousmedspa.com/service-policy
 *   hellogorgeousmedspa.com/cancellation-policy
 *
 * Updates the location profile + every bookable appointment description.
 * Square's checkout policy box is read-only on the public API — this script
 * prints the text to paste in Dashboard → Appointments → Settings → Policies.
 *
 *   node --env-file=.env.local scripts/square-sync-booking-policies.mjs --dry-run
 *   node --env-file=.env.local scripts/square-sync-booking-policies.mjs --apply
 */

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run") || !args.includes("--apply");

const envName = (process.env.SQUARE_ENVIRONMENT || process.env.SQUARE_ENV || "production").toLowerCase();
const HOST = envName === "sandbox" ? "https://connect.squareupsandbox.com" : "https://connect.squareup.com";
const TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const SQUARE_VERSION = "2025-04-16";
const LOCATION_ID = process.env.SQUARE_LOCATION_ID || "L3QDRS4DX9ZE4";

if (!TOKEN || TOKEN.length < 10) {
  console.error("Missing SQUARE_ACCESS_TOKEN");
  process.exit(1);
}

const SERVICE_URL = "https://www.hellogorgeousmedspa.com/service-policy";
const CANCEL_URL = "https://www.hellogorgeousmedspa.com/cancellation-policy";
const FOOTER =
  "Policies: hellogorgeousmedspa.com/service-policy · hellogorgeousmedspa.com/cancellation-policy — 24-hour cancel (48 hours for CO₂ / Morpheus8). Late cancel $50 or 50%. No-show $100 or 100%.";
const LOCATION_BLOCK = `Booking policies: ${SERVICE_URL} · ${CANCEL_URL}
24-hour notice to cancel (48 hours for CO₂ / Morpheus8). Late cancel $50 or 50%. No-show $100 or 100%.`;

const PASTE_TEXT = `Hello Gorgeous Med Spa — Cancellation, No-Show & Service Policy

By booking you agree to:
${CANCEL_URL}
${SERVICE_URL}

CANCEL OR RESCHEDULE
• Standard treatments (injectables, facials, laser, body, IV Hour, telehealth): 24 hours notice.
• Extended / advanced services (CO₂, Morpheus8 / RF, longer bookings): 48 hours notice.
• Cancel by phone at (630) 636-6193 or through your Square booking confirmation.

LATE CANCEL & NO-SHOW
• Late cancel / reschedule under the required notice: $50 or 50% of the service price, whichever is greater.
• No-show (missed appointment, no contact): $100 or 100% of the service price, whichever is greater.
• More than 15 minutes late may be treated as a late cancellation.
• Fees may be charged to the card on file. Genuine emergencies may be waived once at our discretion.

DEPOSITS
• A $50 deposit or card on file may be required for new clients, advanced treatments, and longer bookings.
• Refundable / transferable with required notice. Forfeited on late cancel or no-show.

SERVICE & REFUNDS (full policy: ${SERVICE_URL})
• Botox / neuromodulators: results take 7–14 days. Complimentary asymmetry touch-up through day 21. No refunds once injected. Pre-purchased units expire in 6 months.
• Filler: priced by syringe. Complimentary true-asymmetry correction at 2-week follow-up. No refunds once injected. Dissolving by request is a separate paid service.
• Facials, lasers, RF, microneedling, body, IV, weight-loss visits: non-refundable once rendered. Clinical concerns are addressed at a complimentary follow-up.
• Packages valid 18 months. Retail: unopened only, 14 days, exchange or store credit.

RX / RE GEN
• Telehealth follows the same notice and no-show terms.
• Prescription and compounded medication are non-refundable once filled or shipped. Items not approved in review are refunded. Shipping is non-refundable once shipped.

If we cancel, we will not charge you. Deposits apply to the new visit or are refunded in full.

Questions: (630) 636-6193
`;

async function square(pathname, { method = "GET", body } = {}) {
  const res = await fetch(`${HOST}${pathname}`, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Square-Version": SQUARE_VERSION,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`${method} ${pathname}: ${JSON.stringify(data.errors || data).slice(0, 500)}`);
  }
  return data;
}

async function listCatalog(type) {
  const out = [];
  let cursor;
  do {
    const qs = new URLSearchParams({ types: type });
    if (cursor) qs.set("cursor", cursor);
    const json = await square(`/v2/catalog/list?${qs}`);
    out.push(...(json.objects || []));
    cursor = json.cursor;
  } while (cursor);
  return out;
}

function withFooter(description) {
  const current = (description || "").trim();
  if (current.includes("hellogorgeousmedspa.com/service-policy")) {
    return current.replace(
      /Policies:[\s\S]*?100%\./,
      FOOTER,
    );
  }
  return current ? `${current}\n\n${FOOTER}` : FOOTER;
}

async function main() {
  console.log(`\nSquare booking policies ${DRY_RUN ? "(DRY RUN)" : "(APPLY)"}\n`);

  const loc = (await square(`/v2/locations/${LOCATION_ID}`)).location;
  const desc = loc.description || "";
  let nextDesc = desc;
  if (!desc.includes("hellogorgeousmedspa.com/service-policy")) {
    nextDesc = `${desc.replace(/\s+$/, "")}\n\n${LOCATION_BLOCK}\n`;
  } else if (!desc.includes(LOCATION_BLOCK.split("\n")[0])) {
    nextDesc = desc.replace(/Booking policies:[\s\S]*?100%\./, LOCATION_BLOCK);
  }

  console.log("Location profile:");
  console.log(nextDesc.slice(-320));

  if (!DRY_RUN && nextDesc !== desc) {
    await square(`/v2/locations/${LOCATION_ID}`, {
      method: "PUT",
      body: { location: { description: nextDesc } },
    });
    console.log("  ✓ location description updated");
  }

  const items = (await listCatalog("ITEM")).filter((o) => o.item_data?.product_type === "APPOINTMENTS_SERVICE");
  let updated = 0;
  for (const item of items) {
    const bookable = (item.item_data?.variations || []).some((v) => v.item_variation_data?.available_for_booking);
    if (!bookable) continue;
    const name = item.item_data?.name || "";
    const before = item.item_data?.description || "";
    const after = withFooter(before);
    if (after === before) continue;
    console.log(`  • ${name}`);
    updated++;
    if (DRY_RUN) continue;
    item.item_data.description = after;
    await square("/v2/catalog/object", {
      method: "POST",
      body: { idempotency_key: `hg-policy-${item.id}-${Date.now()}`, object: item },
    });
  }
  console.log(`\nService descriptions ${DRY_RUN ? "would update" : "updated"}: ${updated}`);

  const profile = await square("/v2/bookings/business-booking-profile");
  const currentBox =
    profile.business_booking_profile?.business_appointment_settings?.cancellation_policy_text || "";
  const boxLive = currentBox.includes("hellogorgeousmedspa.com/service-policy") && !currentBox.includes("Placeholder");
  console.log(`\nSquare checkout policy box: ${boxLive ? "already live" : "STILL THE OLD DRAFT (API cannot write this)"}`);
  if (!boxLive) {
    console.log("\nPaste this in Square Dashboard → Appointments → Settings → Policies:\n");
    console.log(PASTE_TEXT);
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
