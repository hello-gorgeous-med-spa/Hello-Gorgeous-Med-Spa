// ============================================================
// POST /api/seo/auto-verify-www — End-to-end verification of www
// ============================================================
// Owner / admin / staff only. Drives the full Site Verification API
// flow:
//   1. Request a META verification token for
//      https://www.hellogorgeousmedspa.com/
//   2. Verify (Google fetches the URL and reads the meta tag)
//   3. Submit the sitemap once verification succeeds
//   4. Inspect the three premium SEO landing pages
// ============================================================
//
// Pre-conditions:
//   - GOOGLE_SEARCH_CONSOLE_REFRESH_TOKEN must be a token issued for
//     BOTH `webmasters` and `siteverification` scopes.
//   - The verification meta tag must already be deployed in the
//     site's <head> (we write GOOGLE_SITE_VERIFICATION fallback into
//     lib/seo.ts before the operator can call this — see flow in
//     docs/GOOGLE_SEARCH_CONSOLE_SETUP.md).
//
// Operator-friendly: GET endpoint just returns the meta tag value
// you'd need to paste into env if you wanted to do it manually.
// ============================================================

import { NextResponse } from "next/server";

import { getAiConciergeStaffSession } from "@/lib/ai-concierge/admin-auth";
import {
  defaultSitemapUrl,
  getAccessToken,
  getSiteVerificationToken,
  inspectUrl,
  listSites,
  pickPropertyForSite,
  submitSitemap,
  verifySite,
} from "@/lib/seo/search-console";
import { SITE } from "@/lib/seo";

export const dynamic = "force-dynamic";

const TARGET_SITE = `${SITE.url.replace(/\/$/, "")}/`;

const PREMIUM_URLS = [
  `${SITE.url.replace(/\/$/, "")}/services/botox`,
  `${SITE.url.replace(/\/$/, "")}/services/microneedling-rf`,
  `${SITE.url.replace(/\/$/, "")}/services/weight-loss-therapy`,
];

export async function GET() {
  const session = await getAiConciergeStaffSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const accessToken = await getAccessToken();
    const tokenResult = await getSiteVerificationToken(
      accessToken,
      TARGET_SITE,
      "META",
    );
    return NextResponse.json({
      ok: true,
      site: TARGET_SITE,
      method: "META",
      metaTag: tokenResult.token,
      hint: "Set GOOGLE_SITE_VERIFICATION env var (or commit as fallback in lib/seo.ts) so the meta tag renders on the homepage.",
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}

export async function POST() {
  const session = await getAiConciergeStaffSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let accessToken: string;
  try {
    accessToken = await getAccessToken();
  } catch (e) {
    return NextResponse.json(
      { ok: false, stage: "auth", error: e instanceof Error ? e.message : String(e) },
      { status: 401 },
    );
  }

  // 1) Ask Google for the verification token (idempotent — same value as long
  // as the OAuth account stays the same).
  let token: string;
  try {
    const res = await getSiteVerificationToken(accessToken, TARGET_SITE, "META");
    token = res.token;
  } catch (e) {
    return NextResponse.json(
      { ok: false, stage: "token", error: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }

  // 2) Verify the site. Will succeed only if the meta tag with `token` is
  // already live on TARGET_SITE.
  const verifyResult = await verifySite(accessToken, TARGET_SITE, "META");
  if (!verifyResult.ok) {
    return NextResponse.json(
      {
        ok: false,
        stage: "verify",
        site: TARGET_SITE,
        metaTag: token,
        verifyStatus: verifyResult.status,
        verifyBody: verifyResult.body,
        hint:
          "Make sure the verification meta tag is deployed in the site's <head> on the live URL (it should match GOOGLE_SITE_VERIFICATION). Then re-run.",
      },
      { status: 412 },
    );
  }

  // 3) Submit the sitemap.
  const sites = await listSites(accessToken);
  const picked = pickPropertyForSite(sites);
  if (!picked) {
    return NextResponse.json(
      {
        ok: false,
        stage: "list-sites",
        sites,
        error: "No matching property after verification. Wait 30s and retry.",
      },
      { status: 500 },
    );
  }

  const sitemap = defaultSitemapUrl();
  const sub = await submitSitemap(accessToken, picked.siteUrl, sitemap);
  if (!sub.ok) {
    return NextResponse.json(
      {
        ok: false,
        stage: "submit",
        property: picked.siteUrl,
        sitemap,
        submitStatus: sub.status,
        submitBody: sub.body,
      },
      { status: 500 },
    );
  }

  // 4) Inspect premium URLs.
  const inspections = [];
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
      inspections.push({ url, error: e instanceof Error ? e.message : String(e) });
    }
  }

  return NextResponse.json({
    ok: true,
    verified: TARGET_SITE,
    metaTag: token,
    property: picked.siteUrl,
    sitemap,
    submitted: true,
    inspections,
  });
}
