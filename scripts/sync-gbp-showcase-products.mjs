/**
 * Merge flagship showcase names onto the Google Business Profile service list.
 * Does not replace existing services. Products photo grid is still UI-only.
 *
 *   node --env-file=.env.local scripts/sync-gbp-showcase-products.mjs
 */
import { GBP_SHOWCASE_CATEGORY, GBP_SHOWCASE_PRODUCTS } from "../lib/gbp-showcase-products.ts";

async function googleAccessToken() {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
  });
  const data = await res.json();
  if (!data.access_token) {
    throw new Error(data.error_description || data.error || "Google token refresh failed");
  }
  return data.access_token;
}

function alreadyListed(existingNames, name) {
  const needle = name.toLowerCase();
  return existingNames.some((n) => n === needle);
}

function toServiceItem(product) {
  const item = {
    freeFormServiceItem: {
      category: GBP_SHOWCASE_CATEGORY,
      label: {
        displayName: product.name,
        description: product.description.slice(0, 250),
        languageCode: "en",
      },
    },
  };
  if (product.priceUsd != null) {
    item.price = { currencyCode: "USD", units: String(product.priceUsd) };
  }
  return item;
}

async function main() {
  const locationId = process.env.GOOGLE_BUSINESS_LOCATION_ID;
  if (!locationId) throw new Error("GOOGLE_BUSINESS_LOCATION_ID missing");

  const access = await googleAccessToken();
  const getUrl = `https://mybusinessbusinessinformation.googleapis.com/v1/locations/${locationId}?readMask=serviceItems`;
  const currentRes = await fetch(getUrl, { headers: { Authorization: `Bearer ${access}` } });
  const current = await currentRes.json();
  if (!currentRes.ok) {
    throw new Error(current.error?.message || `GET services failed ${currentRes.status}`);
  }

  const existing = current.serviceItems || [];
  const existingNames = existing.map((item) => {
    const free = item.freeFormServiceItem?.label?.displayName;
    const structured = item.structuredServiceItem?.serviceTypeId;
    return String(free || structured || "").toLowerCase();
  });

  const added = [];
  const skipped = [];
  const next = [...existing];

  for (const product of GBP_SHOWCASE_PRODUCTS) {
    if (alreadyListed(existingNames, product.name)) {
      skipped.push(product.name);
      continue;
    }
    next.push(toServiceItem(product));
    existingNames.push(product.name.toLowerCase());
    added.push(product.name);
  }

  if (!added.length) {
    console.log(JSON.stringify({ ok: true, added: [], skipped, total: next.length }, null, 2));
    return;
  }

  const patchRes = await fetch(
    `https://mybusinessbusinessinformation.googleapis.com/v1/locations/${locationId}?updateMask=serviceItems`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${access}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ serviceItems: next }),
    },
  );
  const patched = await patchRes.json();
  if (!patchRes.ok) {
    throw new Error(patched.error?.message || `PATCH services failed ${patchRes.status}`);
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        added,
        skipped,
        total: (patched.serviceItems || next).length,
      },
      null,
      2,
    ),
  );
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
