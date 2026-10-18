#!/usr/bin/env node
/**
 * HG-SEO-011 — Solaria CO2 Search Console analysis.
 * Run: node --env-file=.env.local scripts/hg-seo-011-solaria-analysis.mjs
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
  console.log("🔍 HG-SEO-011 — Solaria CO2 Search Console Analysis\n");
  
  const startDate = isoDaysAgo(28);
  const endDate = isoDaysAgo(0);
  console.log(`Period: ${startDate} → ${endDate}\n`);
  
  const token = await getAccessToken();
  const property = SITE_URL;
  
  // 1. All Solaria/CO2/laser resurfacing queries
  console.log("━━━ 1. Solaria/CO2/Laser Resurfacing Queries ━━━\n");
  const allRows = await querySearchAnalytics(token, property, {
    startDate, endDate,
    dimensions: ["query"],
    rowLimit: 500,
  });
  
  const solariaRows = allRows.filter(r => {
    const q = (r.keys?.[0] || "").toLowerCase();
    return q.includes("solaria") || q.includes("co2") || q.includes("laser resurfacing") ||
           q.includes("skin resurfacing") || q.includes("fractional laser");
  });
  
  console.log(`Total Solaria/CO2 queries: ${solariaRows.length}`);
  const totalImp = solariaRows.reduce((s, r) => s + r.impressions, 0);
  const totalClicks = solariaRows.reduce((s, r) => s + r.clicks, 0);
  console.log(`Total impressions: ${totalImp}`);
  console.log(`Total clicks: ${totalClicks}\n`);
  
  console.log("Top queries:");
  solariaRows.sort((a, b) => b.impressions - a.impressions).slice(0, 15).forEach((r, i) => {
    console.log(`  ${i + 1}. "${r.keys[0]}" — pos ${r.position.toFixed(1)}, ${r.impressions} imp, ${r.clicks} clicks`);
  });
  
  // 2. /services/solaria-co2 specific performance
  console.log("\n━━━ 2. /services/solaria-co2 Page Performance ━━━\n");
  const pageRows = await querySearchAnalytics(token, property, {
    startDate, endDate,
    dimensions: ["query"],
    filters: [{ dimension: "page", operator: "equals", expression: "https://www.hellogorgeousmedspa.com/services/solaria-co2" }],
  });
  
  const pageTotal = pageRows.reduce((acc, r) => ({
    impressions: acc.impressions + r.impressions,
    clicks: acc.clicks + r.clicks,
  }), { impressions: 0, clicks: 0 });
  
  console.log(`Page: /services/solaria-co2`);
  console.log(`Impressions: ${pageTotal.impressions}`);
  console.log(`Clicks: ${pageTotal.clicks}`);
  console.log(`CTR: ${pageTotal.impressions > 0 ? ((pageTotal.clicks / pageTotal.impressions) * 100).toFixed(2) : 0}%\n`);
  
  if (pageRows.length > 0) {
    console.log("Top queries for this page:");
    pageRows.sort((a, b) => b.impressions - a.impressions).slice(0, 10).forEach(r => {
      console.log(`  "${r.keys[0]}" — pos ${r.position.toFixed(1)}, ${r.impressions} imp, ${r.clicks} clicks`);
    });
  }
  
  // 3. High-opportunity queries (impressions but low/no clicks)
  console.log("\n━━━ 3. High-Opportunity Queries (impressions, few clicks) ━━━\n");
  const opportunities = solariaRows
    .filter(r => r.impressions >= 3 && r.clicks === 0)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 10);
  
  if (opportunities.length > 0) {
    opportunities.forEach(r => {
      console.log(`  "${r.keys[0]}" — pos ${r.position.toFixed(1)}, ${r.impressions} imp, 0 clicks`);
    });
  } else {
    console.log("  (No high-opportunity queries found)");
  }
  
  // 4. City-specific queries
  console.log("\n━━━ 4. City-Specific Searches ━━━\n");
  const cities = ["oswego", "naperville", "aurora", "plainfield", "yorkville", "montgomery"];
  for (const city of cities) {
    const cityRows = solariaRows.filter(r => r.keys[0].toLowerCase().includes(city));
    if (cityRows.length > 0) {
      const imp = cityRows.reduce((s, r) => s + r.impressions, 0);
      const clicks = cityRows.reduce((s, r) => s + r.clicks, 0);
      console.log(`  ${city}: ${imp} imp, ${clicks} clicks`);
    }
  }
  
  console.log("\n✅ Analysis complete");
}

main().catch(e => {
  console.error("Error:", e.message);
  process.exit(1);
});
