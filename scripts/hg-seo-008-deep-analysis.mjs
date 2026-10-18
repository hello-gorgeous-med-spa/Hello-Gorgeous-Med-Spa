#!/usr/bin/env node
/**
 * HG-SEO-008 — Deep analysis of InMode impressions by page + query.
 * Run: node --env-file=.env.local scripts/hg-seo-008-deep-analysis.mjs
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

async function querySearchAnalytics(token, property, dimensions, filters = []) {
  const startDate = isoDaysAgo(28);
  const endDate = isoDaysAgo(0);
  
  const body = {
    startDate,
    endDate,
    dimensions,
    rowLimit: 1000,
  };
  
  if (filters.length > 0) {
    body.dimensionFilterGroups = [{ filters }];
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
  return { startDate, endDate, rows: data.rows || [] };
}

async function main() {
  console.log("🔍 HG-SEO-008 — Deep Search Console Analysis\n");
  
  const token = await getAccessToken();
  const property = SITE_URL;
  
  // 1. Query with both query + page dimensions for InMode terms
  console.log("━━━ 1. All InMode queries with pages ━━━\n");
  const queryPage = await querySearchAnalytics(token, property, ["query", "page"]);
  
  const inmodeRows = queryPage.rows.filter(r => {
    const q = (r.keys?.[0] || "").toLowerCase();
    return q.includes("quantum") || q.includes("morpheus") || q.includes("solaria") || 
           q.includes("skin tight") || q.includes("body contour") || q.includes("rf microneedling") ||
           q.includes("co2 laser");
  });
  
  const totalImp = inmodeRows.reduce((s, r) => s + r.impressions, 0);
  const totalClicks = inmodeRows.reduce((s, r) => s + r.clicks, 0);
  console.log(`InMode query+page rows: ${inmodeRows.length}`);
  console.log(`Total impressions: ${totalImp}`);
  console.log(`Total clicks: ${totalClicks}\n`);
  
  // 2. Specific query: "best morpheus8 naperville"
  console.log('━━━ 2. "best morpheus8 naperville" — which pages? ━━━\n');
  const morpheusNap = await querySearchAnalytics(token, property, ["page"], [
    { dimension: "query", operator: "contains", expression: "morpheus" },
    { dimension: "query", operator: "contains", expression: "naperville" },
  ]);
  morpheusNap.rows.sort((a, b) => b.impressions - a.impressions).forEach(r => {
    const page = r.keys[0].replace("https://www.hellogorgeousmedspa.com", "");
    console.log(`  ${page}`);
    console.log(`    pos ${r.position.toFixed(1)} | ${r.impressions} imp | ${r.clicks} clicks\n`);
  });
  
  // 3. Specific query: "quantum rf near me"
  console.log('━━━ 3. "quantum rf near me" — which pages? ━━━\n');
  const quantumNear = await querySearchAnalytics(token, property, ["page"], [
    { dimension: "query", operator: "contains", expression: "quantum rf" },
  ]);
  quantumNear.rows.sort((a, b) => b.impressions - a.impressions).forEach(r => {
    const page = r.keys[0].replace("https://www.hellogorgeousmedspa.com", "");
    console.log(`  ${page}`);
    console.log(`    pos ${r.position.toFixed(1)} | ${r.impressions} imp | ${r.clicks} clicks\n`);
  });
  
  // 4. All pages with InMode impressions
  console.log("━━━ 4. Pages receiving InMode impressions ━━━\n");
  const pageAgg = {};
  inmodeRows.forEach(r => {
    const page = r.keys[1] || "";
    if (!pageAgg[page]) pageAgg[page] = { impressions: 0, clicks: 0, queries: [] };
    pageAgg[page].impressions += r.impressions;
    pageAgg[page].clicks += r.clicks;
    pageAgg[page].queries.push(r.keys[0]);
  });
  
  Object.entries(pageAgg)
    .sort((a, b) => b[1].impressions - a[1].impressions)
    .slice(0, 10)
    .forEach(([page, data]) => {
      const shortPage = page.replace("https://www.hellogorgeousmedspa.com", "");
      console.log(`${shortPage}`);
      console.log(`  ${data.impressions} imp | ${data.clicks} clicks`);
      console.log(`  Queries: ${data.queries.slice(0, 3).join(", ")}${data.queries.length > 3 ? "..." : ""}\n`);
    });
  
  console.log("✅ Analysis complete");
}

main().catch(e => {
  console.error("Error:", e.message);
  process.exit(1);
});
