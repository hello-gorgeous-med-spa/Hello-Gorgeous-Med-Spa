#!/usr/bin/env node
/**
 * Submit sitemap + inspect priority URLs in Google Search Console.
 * Reads GOOGLE_* from .env.local (same as scripts/seo-index-audit.py).
 *
 *   node scripts/seo-boost-recent-content.mjs
 */

import { readFileSync } from "fs";
import { resolve } from "path";

const REPO = resolve(import.meta.dirname, "..");
const ENV_PATH = resolve(REPO, ".env.local");
const SITE_URL = "https://www.hellogorgeousmedspa.com/";
const SITEMAP_URL = "https://www.hellogorgeousmedspa.com/sitemap.xml";

const PRIORITY_URLS = [
  `${SITE_URL.replace(/\/$/, "")}/blog/salmon-dna-sculptra-ipl-oswego-il-med-spa-guide`,
  `${SITE_URL.replace(/\/$/, "")}/services/sculptra-biostimulator`,
  `${SITE_URL.replace(/\/$/, "")}/services/salmon-dna-glass-facial`,
  `${SITE_URL.replace(/\/$/, "")}/services/ipl-photofacial`,
  `${SITE_URL.replace(/\/$/, "")}/sculptra-oswego-il`,
  `${SITE_URL.replace(/\/$/, "")}/salmon-dna-oswego-il`,
  `${SITE_URL.replace(/\/$/, "")}/ipl-photofacial-oswego-il`,
  `${SITE_URL.replace(/\/$/, "")}/blog/founder-letter-morpheus8-solaria-oswego-il`,
  `${SITE_URL.replace(/\/$/, "")}/blog/we-arent-just-a-botox-clinic-hello-gorgeous-oswego-il`,
  `${SITE_URL.replace(/\/$/, "")}/blog/what-makes-hello-gorgeous-different-oswego-il`,
  `${SITE_URL.replace(/\/$/, "")}/blog/male-female-practitioners-med-spa-advantage-oswego-il`,
  `${SITE_URL.replace(/\/$/, "")}/blog/botox-vs-dysport-vs-jeuveau-faq-oswego`,
  `${SITE_URL.replace(/\/$/, "")}/blog/aesthetic-injectables-anteage-pearl-oswego-il`,
  `${SITE_URL.replace(/\/$/, "")}/gallery`,
  `${SITE_URL.replace(/\/$/, "")}/about`,
  `${SITE_URL.replace(/\/$/, "")}/quantum-rf-oswego-il`,
  `${SITE_URL.replace(/\/$/, "")}/solaria-co2-laser-oswego-il`,
  `${SITE_URL.replace(/\/$/, "")}/morpheus8-burst-oswego-il`,
  `${SITE_URL.replace(/\/$/, "")}/specials`,
];

function loadEnv() {
  const env = {};
  try {
    for (const line of readFileSync(ENV_PATH, "utf8").split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#") || !t.includes("=")) continue;
      const i = t.indexOf("=");
      const k = t.slice(0, i).trim();
      let v = t.slice(i + 1).trim();
      if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
        v = v.slice(1, -1);
      }
      env[k] = v;
    }
  } catch {
    /* ignore */
  }
  return env;
}

async function getAccessToken(env) {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_SEARCH_CONSOLE_REFRESH_TOKEN } = env;
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_SEARCH_CONSOLE_REFRESH_TOKEN) {
    throw new Error("Missing GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, or GOOGLE_SEARCH_CONSOLE_REFRESH_TOKEN in .env.local");
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
  const want = SITE_URL;
  const host = new URL(want).hostname;
  return (
    sites.find((s) => s.siteUrl === want) ||
    sites.find((s) => s.siteUrl === `sc-domain:${host}`) ||
    sites.find((s) => s.siteUrl?.includes(host))
  );
}

async function submitSitemap(token, property, sitemap) {
  const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(property)}/sitemaps/${encodeURIComponent(sitemap)}`;
  const res = await fetch(url, { method: "PUT", headers: { Authorization: `Bearer ${token}` } });
  return { ok: res.status === 200 || res.status === 204, status: res.status, body: await res.text() };
}

async function inspectUrl(token, property, inspectionUrl) {
  const res = await fetch("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inspectionUrl,
      siteUrl: property,
      languageCode: "en-US",
    }),
  });
  const data = await res.json();
  if (!res.ok) return { url: inspectionUrl, error: JSON.stringify(data) };
  const r = data.inspectionResult?.indexStatusResult;
  return {
    url: inspectionUrl,
    verdict: r?.verdict,
    coverage: r?.coverageState,
    lastCrawl: r?.lastCrawlTime,
  };
}

async function main() {
  const env = loadEnv();
  console.log("SEO boost — Hello Gorgeous\n");

  const token = await getAccessToken(env);
  const sites = await listSites(token);
  const picked = pickProperty(sites);
  if (!picked) {
    console.error("No Search Console property found for", SITE_URL);
    console.error("Sites:", sites.map((s) => s.siteUrl).join(", ") || "(none)");
    process.exit(1);
  }
  console.log("Property:", picked.siteUrl);

  const sub = await submitSitemap(token, picked.siteUrl, SITEMAP_URL);
  console.log(sub.ok ? `✓ Sitemap submitted: ${SITEMAP_URL}` : `✗ Sitemap submit failed (${sub.status}): ${sub.body}`);

  console.log("\nURL inspection (index status):\n");
  for (const url of PRIORITY_URLS) {
    const r = await inspectUrl(token, picked.siteUrl, url);
    const path = url.replace(SITE_URL.replace(/\/$/, ""), "") || "/";
    if (r.error) {
      console.log(`✗ ${path}\n  ${r.error.slice(0, 120)}`);
    } else {
      console.log(`${r.verdict === "PASS" ? "✓" : "○"} ${path}`);
      console.log(`  verdict: ${r.verdict || "—"} · coverage: ${r.coverage || "—"}`);
      if (r.lastCrawl) console.log(`  last crawl: ${r.lastCrawl}`);
    }
    await new Promise((r) => setTimeout(r, 400));
  }

  console.log("\nNote: Google does not offer API “request indexing” for all sites.");
  console.log("Sitemap resubmit + social/GBP posts help discovery; rankings follow over 2–8 weeks.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
