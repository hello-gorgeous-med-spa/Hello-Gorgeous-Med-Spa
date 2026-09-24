/**
 * Make the Google Business photo grid look like a clinic:
 * remove the old uncategorized pile, add storefront + medical director.
 *
 *   node --env-file=.env.local scripts/polish-gbp-photos.mjs
 */
import fs from "fs";
import path from "path";

const KEEP_FROM = "2026-09-19T00:00:00Z";
const SITE = "https://www.hellogorgeousmedspa.com";
const STOREFRONT = path.resolve(
  "public/images/marketing/hello-gorgeous-storefront-windows-2026.png",
);

async function token() {
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
  if (!data.access_token) throw new Error(data.error_description || "token failed");
  return data.access_token;
}

function parent(accessEnv) {
  return `accounts/${accessEnv.acc}/locations/${accessEnv.loc}`;
}

async function listMedia(access, acc, loc) {
  const res = await fetch(
    `https://mybusiness.googleapis.com/v4/accounts/${acc}/locations/${loc}/media?pageSize=100`,
    { headers: { Authorization: `Bearer ${access}` } },
  );
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "list failed");
  return data.mediaItems || [];
}

async function deleteMedia(access, name) {
  const res = await fetch(`https://mybusiness.googleapis.com/v4/${name}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${access}` },
  });
  if (res.status === 204 || res.ok) return { ok: true };
  const data = await res.json().catch(() => ({}));
  return { ok: false, error: data.error?.message || `HTTP ${res.status}` };
}

async function uploadLocal(access, acc, loc, filePath, category) {
  const startRes = await fetch(
    `https://mybusiness.googleapis.com/v4/accounts/${acc}/locations/${loc}/media:startUpload`,
    { method: "POST", headers: { Authorization: `Bearer ${access}`, "Content-Type": "application/json" }, body: "{}" },
  );
  const start = await startRes.json();
  const resourceName = start.resourceName || start.dataRef?.resourceName;
  if (!startRes.ok || !resourceName) {
    return { ok: false, error: start.error?.message || "startUpload failed", step: "start" };
  }

  const bytes = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = ext === ".png" ? "image/png" : "image/jpeg";
  const uploadUrls = [
    `https://mybusiness.googleapis.com/upload/v1/media/${encodeURIComponent(resourceName)}?uploadType=media`,
    `https://www.googleapis.com/upload/mybusiness/v4/media/${encodeURIComponent(resourceName)}?uploadType=media`,
  ];

  let uploaded = false;
  let lastErr = null;
  for (const url of uploadUrls) {
    const up = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${access}`, "Content-Type": contentType },
      body: bytes,
    });
    if (up.ok) {
      uploaded = true;
      break;
    }
    const t = await up.text();
    lastErr = t.slice(0, 240);
  }
  if (!uploaded) return { ok: false, error: lastErr || "bytes upload failed", step: "bytes" };

  const create = await fetch(
    `https://mybusiness.googleapis.com/v4/accounts/${acc}/locations/${loc}/media`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${access}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        mediaFormat: "PHOTO",
        locationAssociation: { category },
        dataRef: { resourceName },
      }),
    },
  );
  const created = await create.json();
  if (!create.ok) return { ok: false, error: created.error?.message || "create failed", step: "create" };
  return { ok: true, category, name: created.name };
}

async function uploadUrl(access, acc, loc, sourceUrl, category) {
  const res = await fetch(
    `https://mybusiness.googleapis.com/v4/accounts/${acc}/locations/${loc}/media`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${access}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        mediaFormat: "PHOTO",
        locationAssociation: { category },
        sourceUrl,
      }),
    },
  );
  const data = await res.json();
  return { ok: res.ok, category, error: data.error?.message || null };
}

async function main() {
  const access = await token();
  const acc = process.env.GOOGLE_BUSINESS_ACCOUNT_ID;
  const loc = process.env.GOOGLE_BUSINESS_LOCATION_ID;
  const items = await listMedia(access, acc, loc);

  const toDelete = items.filter((m) => {
    if (m.name?.endsWith("/media/profile")) return false;
    if (m.locationAssociation?.category === "COVER") return false;
    if ((m.createTime || "") >= KEEP_FROM) return false;
    return true;
  });

  const deleted = [];
  const deleteFailed = [];
  for (const item of toDelete) {
    const result = await deleteMedia(access, item.name);
    if (result.ok) deleted.push(item.name.split("/").pop());
    else deleteFailed.push(result.error);
    await new Promise((r) => setTimeout(r, 150));
  }

  const extras = [];
  extras.push(await uploadUrl(access, acc, loc, `${SITE}/images/providers/dr-mukesh-arora.jpg`, "TEAMS"));
  extras.push(await uploadUrl(access, acc, loc, `${SITE}/images/logo-full.png`, "ADDITIONAL"));
  extras.push(await uploadUrl(access, acc, loc, `${SITE}/images/storefront/md-oversight-sign.png`, "INTERIOR"));

  let storefront = { ok: false, error: "file missing" };
  if (fs.existsSync(STOREFRONT)) {
    storefront = await uploadLocal(access, acc, loc, STOREFRONT, "EXTERIOR");
    if (storefront.ok) {
      extras.push(await uploadLocal(access, acc, loc, STOREFRONT, "COVER"));
    }
  }

  const after = await listMedia(access, acc, loc);
  console.log(
    JSON.stringify(
      {
        deleted: deleted.length,
        deleteFailed,
        storefront,
        extras,
        remaining: after.length,
        remainingCats: after.reduce((acc, m) => {
          const c = m.locationAssociation?.category || "NONE";
          acc[c] = (acc[c] || 0) + 1;
          return acc;
        }, {}),
      },
      null,
      2,
    ),
  );
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
