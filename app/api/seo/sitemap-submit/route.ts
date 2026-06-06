// ============================================================
// POST /api/seo/sitemap-submit — Re-submit sitemap to Search Console
// GET  /api/seo/sitemap-submit — Read current sitemap status
// ============================================================
// Owner / admin / staff only. Uses
// GOOGLE_SEARCH_CONSOLE_REFRESH_TOKEN to mint an access token at
// runtime and call the Search Console API. Safe to call repeatedly —
// re-submitting an already-submitted sitemap is idempotent and bumps
// the lastSubmitted timestamp Google uses for crawl prioritization.
// ============================================================

import { NextResponse } from "next/server";

import { getAiConciergeStaffSession } from "@/lib/ai-concierge/admin-auth";
import {
  defaultSitemapUrl,
  getAccessToken,
  getSitemapStatus,
  inspectUrl,
  listSites,
  pickPropertyForSite,
  submitSitemap,
} from "@/lib/seo/search-console";

export const dynamic = "force-dynamic";

const PREMIUM_URLS = [
  "https://www.hellogorgeousmedspa.com/blog/salmon-dna-sculptra-ipl-oswego-il-med-spa-guide",
  "https://www.hellogorgeousmedspa.com/services/sculptra-biostimulator",
  "https://www.hellogorgeousmedspa.com/services/salmon-dna-glass-facial",
  "https://www.hellogorgeousmedspa.com/services/ipl-photofacial",
  "https://www.hellogorgeousmedspa.com/sculptra-oswego-il",
  "https://www.hellogorgeousmedspa.com/salmon-dna-oswego-il",
  "https://www.hellogorgeousmedspa.com/blog/we-arent-just-a-botox-clinic-hello-gorgeous-oswego-il",
  "https://www.hellogorgeousmedspa.com/blog/male-female-practitioners-med-spa-advantage-oswego-il",
  "https://www.hellogorgeousmedspa.com/gallery",
  "https://www.hellogorgeousmedspa.com/best-botox-oswego-il",
  "https://www.hellogorgeousmedspa.com/tirzepatide-program",
  "https://www.hellogorgeousmedspa.com/botox-oswego",
  "https://www.hellogorgeousmedspa.com/botox-naperville-il",
  "https://www.hellogorgeousmedspa.com/services/botox",
  "https://www.hellogorgeousmedspa.com/services/microneedling-rf",
  "https://www.hellogorgeousmedspa.com/services/weight-loss-therapy",
  "https://www.hellogorgeousmedspa.com/quantum-rf-oswego-il",
  "https://www.hellogorgeousmedspa.com/solaria-co2-laser-oswego-il",
  "https://www.hellogorgeousmedspa.com/morpheus8-burst-oswego-il",
];

interface SubmitReport {
  ok: boolean;
  property?: string;
  sitemap?: string;
  submitted?: boolean;
  status?: unknown;
  inspections?: Array<{
    url: string;
    verdict?: string;
    coverage?: string;
    lastCrawl?: string;
    error?: string;
  }>;
  error?: string;
  hint?: string;
}

async function buildReport(includeInspections: boolean): Promise<SubmitReport> {
  let accessToken: string;
  try {
    accessToken = await getAccessToken();
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return {
      ok: false,
      error: msg,
      hint: msg.includes("GOOGLE_SEARCH_CONSOLE_REFRESH_TOKEN")
        ? "Visit /api/seo/google-connect to authorize and capture a token."
        : undefined,
    };
  }

  const sites = await listSites(accessToken);
  const picked = pickPropertyForSite(sites);
  if (!picked) {
    return {
      ok: false,
      error: `No verified Search Console property matched. Found: ${sites.map((s) => s.siteUrl).join(", ") || "(none)"}`,
      hint: "Verify https://www.hellogorgeousmedspa.com/ as a URL-prefix property in Search Console.",
    };
  }

  const sitemap = defaultSitemapUrl();
  const submitResult = await submitSitemap(accessToken, picked.siteUrl, sitemap);
  if (!submitResult.ok) {
    return {
      ok: false,
      property: picked.siteUrl,
      sitemap,
      error: `submit failed (${submitResult.status}): ${submitResult.body}`,
    };
  }

  const status = await getSitemapStatus(accessToken, picked.siteUrl, sitemap);

  const inspections: SubmitReport["inspections"] = [];
  if (includeInspections) {
    for (const url of PREMIUM_URLS) {
      try {
        const r = await inspectUrl(accessToken, picked.siteUrl, url);
        inspections.push({
          url,
          verdict: r.indexStatusResult?.verdict,
          coverage: r.indexStatusResult?.coverageState,
          lastCrawl: r.indexStatusResult?.lastCrawlTime,
        });
      } catch (e) {
        inspections.push({
          url,
          error: e instanceof Error ? e.message : String(e),
        });
      }
    }
  }

  return {
    ok: true,
    property: picked.siteUrl,
    sitemap,
    submitted: true,
    status,
    inspections,
  };
}

export async function POST() {
  const session = await getAiConciergeStaffSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const report = await buildReport(true);
  return NextResponse.json(report, { status: report.ok ? 200 : 500 });
}

export async function GET() {
  const session = await getAiConciergeStaffSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const report = await buildReport(false);
  return NextResponse.json(report, { status: report.ok ? 200 : 500 });
}
