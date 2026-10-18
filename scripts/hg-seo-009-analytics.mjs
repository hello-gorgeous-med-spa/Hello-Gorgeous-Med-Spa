#!/usr/bin/env node
/**
 * HG-SEO-009 — Accurate Search Console analytics with proper aggregation.
 * Run: node --env-file=.env.local scripts/hg-seo-009-analytics.mjs
 */

const SITE_URL = "https://www.hellogorgeousmedspa.com/";

async function getAccessToken() {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_SEARCH_CONSOLE_REFRESH_TOKEN } = process.env;
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_SEARCH_CONSOLE_REFRESH_TOKEN) {
    throw new Error("Missing Google credentials");
  }
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      refresh_token: GOOGLE_SEARCH_CONSOLE_REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
  });
  const data = await res.json();
  if (!data.access_token) throw new Error(`Token refresh failed: ${JSON.stringify(data)}`);
  return data.access_token;
}

function isoDaysAgo(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

async function querySearchAnalytics(token, property, options) {
  const body = {
    startDate: options.startDate,
    endDate: options.endDate,
    dimensions: options.dimensions || ["query"],
    rowLimit: options.rowLimit || 1000,
    aggregationType: options.aggregationType || "auto", // "byPage" or "byProperty" or "auto"
  };
  
  if (options.filters?.length > 0) {
    body.dimensionFilterGroups = [{ filters: options.filters }];
  }
  
  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(property)}/searchAnalytics/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) throw new Error(`Search Analytics failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.rows || [];
}

async function main() {
  console.log("🔍 HG-SEO-009 — Accurate Search Console Report\n");
  console.log("━━━ Configuration ━━━");
  console.log("Property: https://www.hellogorgeousmedspa.com/");
  console.log("Search type: Web");
  console.log("Country: All (no filter)");
  console.log("Device: All (no filter)");
  
  const startDate = isoDaysAgo(28);
  const endDate = isoDaysAgo(0);
  console.log(`Date range: ${startDate} → ${endDate} (28 days)\n`);
  
  const token = await getAccessToken();
  const property = SITE_URL;
  
  // 1. Morpheus8 Naperville page specifically
  console.log("━━━ 1. /morpheus8-naperville-il Performance ━━━\n");
  const m8napRows = await querySearchAnalytics(token, property, {
    startDate, endDate,
    dimensions: ["query"],
    filters: [{ dimension: "page", operator: "equals", expression: "https://www.hellogorgeousmedspa.com/morpheus8-naperville-il" }],
  });
  
  const m8napTotal = m8napRows.reduce((acc, r) => ({
    impressions: acc.impressions + r.impressions,
    clicks: acc.clicks + r.clicks,
  }), { impressions: 0, clicks: 0 });
  
  console.log(`Page: /morpheus8-naperville-il`);
  console.log(`Total impressions: ${m8napTotal.impressions}`);
  console.log(`Total clicks: ${m8napTotal.clicks}`);
  console.log(`CTR: ${m8napTotal.impressions > 0 ? ((m8napTotal.clicks / m8napTotal.impressions) * 100).toFixed(2) : 0}%`);
  console.log(`\nTop queries:`);
  m8napRows.sort((a, b) => b.impressions - a.impressions).slice(0, 5).forEach(r => {
    console.log(`  "${r.keys[0]}" — ${r.impressions} imp, ${r.clicks} clicks, pos ${r.position.toFixed(1)}`);
  });
  
  // 2. New canonical Quantum RF page
  console.log("\n━━━ 2. /services/quantum-rf Performance (NEW CANONICAL) ━━━\n");
  const qrfCanonRows = await querySearchAnalytics(token, property, {
    startDate, endDate,
    dimensions: ["query"],
    filters: [{ dimension: "page", operator: "equals", expression: "https://www.hellogorgeousmedspa.com/services/quantum-rf" }],
  });
  
  const qrfCanonTotal = qrfCanonRows.reduce((acc, r) => ({
    impressions: acc.impressions + r.impressions,
    clicks: acc.clicks + r.clicks,
  }), { impressions: 0, clicks: 0 });
  
  console.log(`Page: /services/quantum-rf`);
  console.log(`Total impressions: ${qrfCanonTotal.impressions}`);
  console.log(`Total clicks: ${qrfCanonTotal.clicks}`);
  if (qrfCanonRows.length > 0) {
    console.log(`Top queries:`);
    qrfCanonRows.sort((a, b) => b.impressions - a.impressions).slice(0, 5).forEach(r => {
      console.log(`  "${r.keys[0]}" — ${r.impressions} imp, ${r.clicks} clicks, pos ${r.position.toFixed(1)}`);
    });
  } else {
    console.log(`(No query data yet for new canonical page)`);
  }
  
  // 3. Old Quantum RF pages (historical)
  console.log("\n━━━ 3. Old Quantum RF Pages (HISTORICAL — now redirecting) ━━━\n");
  
  const oldPages = [
    "https://www.hellogorgeousmedspa.com/quantum-rf-oswego",
    "https://www.hellogorgeousmedspa.com/quantum-rf-oswego-il",
  ];
  
  for (const pageUrl of oldPages) {
    const rows = await querySearchAnalytics(token, property, {
      startDate, endDate,
      dimensions: ["query"],
      filters: [{ dimension: "page", operator: "equals", expression: pageUrl }],
    });
    
    const total = rows.reduce((acc, r) => ({
      impressions: acc.impressions + r.impressions,
      clicks: acc.clicks + r.clicks,
    }), { impressions: 0, clicks: 0 });
    
    const shortUrl = pageUrl.replace("https://www.hellogorgeousmedspa.com", "");
    console.log(`${shortUrl}: ${total.impressions} imp, ${total.clicks} clicks`);
  }
  
  // 4. Solaria CO2 page
  console.log("\n━━━ 4. /services/solaria-co2 Performance ━━━\n");
  const solariaRows = await querySearchAnalytics(token, property, {
    startDate, endDate,
    dimensions: ["query"],
    filters: [{ dimension: "page", operator: "equals", expression: "https://www.hellogorgeousmedspa.com/services/solaria-co2" }],
  });
  
  const solariaTotal = solariaRows.reduce((acc, r) => ({
    impressions: acc.impressions + r.impressions,
    clicks: acc.clicks + r.clicks,
  }), { impressions: 0, clicks: 0 });
  
  console.log(`Page: /services/solaria-co2`);
  console.log(`Total impressions: ${solariaTotal.impressions}`);
  console.log(`Total clicks: ${solariaTotal.clicks}`);
  
  // 5. /services/morpheus8 page
  console.log("\n━━━ 5. /services/morpheus8 Performance ━━━\n");
  const m8Rows = await querySearchAnalytics(token, property, {
    startDate, endDate,
    dimensions: ["query"],
    filters: [{ dimension: "page", operator: "equals", expression: "https://www.hellogorgeousmedspa.com/services/morpheus8" }],
  });
  
  const m8Total = m8Rows.reduce((acc, r) => ({
    impressions: acc.impressions + r.impressions,
    clicks: acc.clicks + r.clicks,
  }), { impressions: 0, clicks: 0 });
  
  console.log(`Page: /services/morpheus8`);
  console.log(`Total impressions: ${m8Total.impressions}`);
  console.log(`Total clicks: ${m8Total.clicks}`);
  
  console.log("\n✅ Report complete — data is page-specific, not combined");
}

main().catch(e => {
  console.error("Error:", e.message);
  process.exit(1);
});
