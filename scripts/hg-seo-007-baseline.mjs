#!/usr/bin/env node
/**
 * HG-SEO-007 — Capture Search Console baseline for priority InMode pages.
 * Run: node --env-file=.env.local scripts/hg-seo-007-baseline.mjs
 */

const SITE_URL = "https://www.hellogorgeousmedspa.com/";

const PRIORITY_PAGES = [
  "https://www.hellogorgeousmedspa.com/services/quantum-rf",
  "https://www.hellogorgeousmedspa.com/services/morpheus8",
  "https://www.hellogorgeousmedspa.com/services/solaria-co2",
];

async function getAccessToken() {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_SEARCH_CONSOLE_REFRESH_TOKEN } = process.env;
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_SEARCH_CONSOLE_REFRESH_TOKEN) {
    throw new Error("Missing GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, or GOOGLE_SEARCH_CONSOLE_REFRESH_TOKEN");
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

async function listSites(token) {
  const res = await fetch("https://www.googleapis.com/webmasters/v3/sites", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return data.siteEntry || [];
}

function pickProperty(sites) {
  const wantHost = "hellogorgeousmedspa.com";
  const verified = sites.filter(s => ["siteOwner", "siteFullUser", "siteRestrictedUser"].includes(s.permissionLevel));
  const pool = verified.length > 0 ? verified : sites;
  return (
    pool.find(s => s.siteUrl === SITE_URL) ||
    pool.find(s => s.siteUrl === `sc-domain:${wantHost}`) ||
    pool.find(s => s.siteUrl.includes(wantHost))
  );
}

async function inspectUrl(token, property, url) {
  const res = await fetch("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inspectionUrl: url,
      siteUrl: property,
      languageCode: "en-US",
    }),
  });
  if (!res.ok) {
    return { url, error: `${res.status}: ${await res.text()}` };
  }
  const data = await res.json();
  const r = data.inspectionResult?.indexStatusResult || {};
  return {
    url,
    verdict: r.verdict,
    coverage: r.coverageState,
    indexing: r.indexingState,
    lastCrawl: r.lastCrawlTime,
    robotsTxt: r.robotsTxtState,
    canonical: r.googleCanonical,
  };
}

function isoDaysAgo(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

async function querySearchAnalytics(token, property) {
  const startDate = isoDaysAgo(28);
  const endDate = isoDaysAgo(0);
  
  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(property)}/searchAnalytics/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        startDate,
        endDate,
        dimensions: ["query"],
        rowLimit: 500,
      }),
    }
  );
  if (!res.ok) throw new Error(`Search Analytics failed: ${res.status}`);
  const data = await res.json();
  return { startDate, endDate, rows: data.rows || [] };
}

async function main() {
  console.log("🔍 HG-SEO-007 — Search Console Baseline\n");
  
  const token = await getAccessToken();
  console.log("✓ Access token obtained\n");
  
  const sites = await listSites(token);
  const property = pickProperty(sites);
  if (!property) {
    console.error("❌ No verified Search Console property found");
    process.exit(1);
  }
  console.log(`✓ Property: ${property.siteUrl}\n`);
  
  // URL Inspection
  console.log("━━━ URL Inspection (Priority Pages) ━━━\n");
  for (const url of PRIORITY_PAGES) {
    const r = await inspectUrl(token, property.siteUrl, url);
    const shortUrl = url.replace("https://www.hellogorgeousmedspa.com", "");
    console.log(`${shortUrl}`);
    if (r.error) {
      console.log(`  ❌ Error: ${r.error}`);
    } else {
      console.log(`  Verdict: ${r.verdict || "—"}`);
      console.log(`  Coverage: ${r.coverage || "—"}`);
      console.log(`  Indexing: ${r.indexing || "—"}`);
      console.log(`  Last crawl: ${r.lastCrawl || "—"}`);
      console.log(`  Robots.txt: ${r.robotsTxt || "—"}`);
    }
    console.log("");
  }
  
  // Search Analytics
  console.log("━━━ Search Analytics (28-day) ━━━\n");
  const analytics = await querySearchAnalytics(token, property.siteUrl);
  console.log(`Period: ${analytics.startDate} → ${analytics.endDate}`);
  console.log(`Total queries: ${analytics.rows.length}\n`);
  
  // Filter for InMode-related queries
  const inmodeQueries = analytics.rows.filter(r => {
    const q = (r.keys?.[0] || "").toLowerCase();
    return q.includes("quantum") || q.includes("morpheus") || q.includes("solaria") || 
           q.includes("skin tight") || q.includes("body contour") || q.includes("rf microneedling") ||
           q.includes("co2 laser");
  });
  
  console.log("Top InMode-related queries:");
  inmodeQueries
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 15)
    .forEach((r, i) => {
      console.log(`  ${i + 1}. "${r.keys[0]}" — pos ${r.position.toFixed(1)}, ${r.impressions} imp, ${r.clicks} clicks`);
    });
  
  // Summary stats
  const totalImp = inmodeQueries.reduce((s, r) => s + r.impressions, 0);
  const totalClicks = inmodeQueries.reduce((s, r) => s + r.clicks, 0);
  console.log(`\nInMode totals: ${totalImp} impressions, ${totalClicks} clicks`);
  
  console.log("\n✅ Baseline captured — compare in 30 days");
}

main().catch(e => {
  console.error("Error:", e.message);
  process.exit(1);
});
