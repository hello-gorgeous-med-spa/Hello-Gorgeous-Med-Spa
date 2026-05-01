// ============================================================
// GET /api/seo/google-callback — OAuth callback for Search Console
// ============================================================
// Exchanges the authorization code for tokens, then immediately
// validates the new refresh token by:
//   1. Listing Search Console sites the token can manage
//   2. Submitting our sitemap.xml to the matching property
//   3. Inspecting the three premium SEO landing pages
// Renders an HTML report with the refresh token displayed in a
// copy-friendly input so the user can paste it into Vercel env vars.
// ============================================================

import { NextRequest, NextResponse } from "next/server";

import {
  defaultSitemapUrl,
  inspectUrl,
  listSites,
  pickPropertyForSite,
  submitSitemap,
} from "@/lib/seo/search-console";

const PREMIUM_URLS = [
  "https://www.hellogorgeousmedspa.com/services/botox",
  "https://www.hellogorgeousmedspa.com/services/microneedling-rf",
  "https://www.hellogorgeousmedspa.com/services/weight-loss-therapy",
];

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const errorParam = request.nextUrl.searchParams.get("error");
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    request.nextUrl?.origin ||
    "https://www.hellogorgeousmedspa.com";
  const redirectUri = `${baseUrl.replace(/\/$/, "")}/api/seo/google-callback`;

  if (errorParam) {
    return htmlResponse(
      "Google denied the request",
      `<p>Google returned <code>${escapeHtml(errorParam)}</code>. Try again from <a href="/api/seo/google-connect">/api/seo/google-connect</a>.</p>`,
      400,
    );
  }
  if (!code) {
    return htmlResponse(
      "Missing authorization code",
      `<p>No <code>code</code> query parameter was received from Google.</p>
       <p><a href="/api/seo/google-connect">Restart authorization</a></p>`,
      400,
    );
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return htmlResponse(
      "Configuration missing",
      `<p>GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set in Vercel.</p>`,
      500,
    );
  }

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  const tokenData = (await tokenRes.json()) as {
    access_token?: string;
    refresh_token?: string;
    scope?: string;
    error?: string;
    error_description?: string;
  };

  if (tokenData.error || !tokenData.access_token) {
    return htmlResponse(
      "Token exchange failed",
      `<p>Google returned: <code>${escapeHtml(tokenData.error_description || tokenData.error || "unknown error")}</code>.</p>
       <p>Most common cause: the redirect URI <code>${escapeHtml(redirectUri)}</code> is not in your Google Cloud Console OAuth client. See <a href="https://github.com/hello-gorgeous-med-spa/Hello-Gorgeous-Med-Spa/blob/main/docs/GOOGLE_SEARCH_CONSOLE_SETUP.md">setup docs</a>.</p>`,
      400,
    );
  }

  const accessToken = tokenData.access_token;
  const refreshToken = tokenData.refresh_token || "";
  const grantedScopes = tokenData.scope || "(none)";

  const reportSections: string[] = [];
  reportSections.push(
    `<p><strong>Granted scopes:</strong> <code>${escapeHtml(grantedScopes)}</code></p>`,
  );

  let sitesReportOk = false;
  let pickedSiteUrl = "";
  try {
    const sites = await listSites(accessToken);
    const picked = pickPropertyForSite(sites);

    reportSections.push(`<h3>1) Search Console properties</h3>`);
    if (sites.length === 0) {
      reportSections.push(
        `<p style="color:#b91c1c">No verified properties on this Google account. Verify <code>https://www.hellogorgeousmedspa.com/</code> in Search Console first, then re-run.</p>`,
      );
    } else {
      reportSections.push(
        `<ul>${sites
          .map(
            (s) =>
              `<li><code>${escapeHtml(s.siteUrl)}</code> — ${escapeHtml(s.permissionLevel)}${
                picked && picked.siteUrl === s.siteUrl ? " <strong>← matched</strong>" : ""
              }</li>`,
          )
          .join("")}</ul>`,
      );
      if (!picked) {
        reportSections.push(
          `<p style="color:#b91c1c">No property matched <code>https://www.hellogorgeousmedspa.com/</code>. Verify the property in Search Console.</p>`,
        );
      } else {
        sitesReportOk = true;
        pickedSiteUrl = picked.siteUrl;
      }
    }
  } catch (e) {
    reportSections.push(
      `<p style="color:#b91c1c">Error listing properties: ${escapeHtml(String(e instanceof Error ? e.message : e))}</p>`,
    );
  }

  if (sitesReportOk && pickedSiteUrl) {
    const sitemap = defaultSitemapUrl();
    reportSections.push(`<h3>2) Sitemap submission</h3>`);
    try {
      const sub = await submitSitemap(accessToken, pickedSiteUrl, sitemap);
      if (sub.ok) {
        reportSections.push(
          `<p style="color:#15803d">✓ Submitted <code>${escapeHtml(sitemap)}</code> to <code>${escapeHtml(pickedSiteUrl)}</code>. Google will fetch & process within 24h.</p>`,
        );
      } else {
        reportSections.push(
          `<p style="color:#b91c1c">Submission failed (HTTP ${sub.status}): <pre>${escapeHtml(sub.body)}</pre></p>`,
        );
      }
    } catch (e) {
      reportSections.push(
        `<p style="color:#b91c1c">Submission error: ${escapeHtml(String(e instanceof Error ? e.message : e))}</p>`,
      );
    }

    reportSections.push(`<h3>3) URL inspection — premium pages</h3>`);
    reportSections.push(`<ul>`);
    for (const url of PREMIUM_URLS) {
      try {
        const r = await inspectUrl(accessToken, pickedSiteUrl, url);
        const verdict = r.indexStatusResult?.verdict || "(no verdict)";
        const coverage = r.indexStatusResult?.coverageState || "(unknown)";
        const lastCrawl = r.indexStatusResult?.lastCrawlTime || "(never crawled)";
        reportSections.push(
          `<li><strong>${escapeHtml(url)}</strong><br>
           Verdict: <code>${escapeHtml(verdict)}</code> · Coverage: <code>${escapeHtml(coverage)}</code> · Last crawl: <code>${escapeHtml(lastCrawl)}</code></li>`,
        );
      } catch (e) {
        reportSections.push(
          `<li><strong>${escapeHtml(url)}</strong>: <span style="color:#b91c1c">${escapeHtml(String(e instanceof Error ? e.message : e))}</span></li>`,
        );
      }
    }
    reportSections.push(`</ul>`);
  }

  reportSections.push(`<h3>Save this refresh token in Vercel</h3>`);
  reportSections.push(
    `<p>Add to your environment as <code>GOOGLE_SEARCH_CONSOLE_REFRESH_TOKEN</code> (Vercel → Project → Settings → Environment Variables) and redeploy. Then visit <a href="/admin/seo/google-search-console">/admin/seo/google-search-console</a> to re-submit on demand.</p>`,
  );
  reportSections.push(
    `<div style="margin:12px 0">
       <label style="display:block;font-weight:600;margin-bottom:4px">GOOGLE_SEARCH_CONSOLE_REFRESH_TOKEN</label>
       <input type="text" readonly value="${escapeHtml(refreshToken || "(no refresh token returned — try ?prompt=consent)")}"
              style="width:100%;padding:8px;font-size:12px;font-family:ui-monospace,Menlo,Consolas,monospace"
              onclick="this.select()" />
     </div>`,
  );

  return htmlResponse(
    "Search Console connected",
    reportSections.join("\n"),
    200,
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function htmlResponse(title: string, body: string, status: number): NextResponse {
  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeHtml(title)} — Search Console</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 840px; margin: 32px auto; padding: 0 20px; color: #111; }
    h1 { color: #E6007E; }
    h3 { margin-top: 24px; border-top: 2px solid #000; padding-top: 16px; }
    a { color: #E6007E; }
    code, pre { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-family: ui-monospace,Menlo,Consolas,monospace; font-size: 12px; }
    pre { padding: 12px; overflow:auto; white-space: pre-wrap; word-break: break-all; }
    ul { line-height: 1.6; }
  </style>
</head>
<body>
  <h1>${escapeHtml(title)}</h1>
  ${body}
</body>
</html>`;
  return new NextResponse(html, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
