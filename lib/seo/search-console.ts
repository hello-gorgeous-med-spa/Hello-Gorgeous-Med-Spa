// ============================================================
// Google Search Console API helper
// ============================================================
// Wraps the OAuth refresh-token flow and the three operations we
// actually need:
//   1. listSites()       — verify which properties this token can manage
//   2. submitSitemap()   — push the sitemap.xml to Search Console
//   3. inspectUrl()      — check whether a given URL is indexed
//
// Required env vars:
//   GOOGLE_CLIENT_ID
//   GOOGLE_CLIENT_SECRET
//   GOOGLE_SEARCH_CONSOLE_REFRESH_TOKEN  (token issued with the
//                                         `webmasters` scope)
// ============================================================

import { SITE } from "@/lib/seo";

const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const WEBMASTERS_BASE = "https://www.googleapis.com/webmasters/v3";
const SC_BASE = "https://searchconsole.googleapis.com/v1";

export interface SearchConsoleConfig {
  clientId?: string;
  clientSecret?: string;
  refreshToken?: string;
}

export interface SearchConsoleSite {
  siteUrl: string;
  permissionLevel: string;
}

export interface SitemapStatus {
  path: string;
  lastSubmitted?: string;
  lastDownloaded?: string;
  isPending?: boolean;
  isSitemapsIndex?: boolean;
  errors?: number;
  warnings?: number;
  contents?: Array<{ type: string; submitted?: string; indexed?: string }>;
}

export interface UrlInspectionResult {
  url: string;
  inspectionResultLink?: string;
  indexStatusResult?: {
    verdict?: string;
    coverageState?: string;
    robotsTxtState?: string;
    indexingState?: string;
    lastCrawlTime?: string;
    pageFetchState?: string;
    googleCanonical?: string;
    userCanonical?: string;
    crawledAs?: string;
    referringUrls?: string[];
    sitemap?: string[];
  };
  error?: string;
}

function loadConfig(override?: SearchConsoleConfig): SearchConsoleConfig {
  return {
    clientId: override?.clientId ?? process.env.GOOGLE_CLIENT_ID,
    clientSecret: override?.clientSecret ?? process.env.GOOGLE_CLIENT_SECRET,
    refreshToken:
      override?.refreshToken ?? process.env.GOOGLE_SEARCH_CONSOLE_REFRESH_TOKEN,
  };
}

export async function getAccessToken(
  override?: SearchConsoleConfig,
): Promise<string> {
  const cfg = loadConfig(override);
  if (!cfg.clientId || !cfg.clientSecret) {
    throw new Error(
      "Missing GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET in environment.",
    );
  }
  if (!cfg.refreshToken) {
    throw new Error(
      "Missing GOOGLE_SEARCH_CONSOLE_REFRESH_TOKEN. Visit /api/seo/google-connect to grant the webmasters scope and capture a token.",
    );
  }

  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: cfg.clientId,
      client_secret: cfg.clientSecret,
      refresh_token: cfg.refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token refresh failed (${res.status}): ${text}`);
  }
  const json = (await res.json()) as { access_token?: string; error?: string };
  if (!json.access_token) {
    throw new Error(`Token refresh returned no access_token: ${JSON.stringify(json)}`);
  }
  return json.access_token;
}

export async function listSites(
  accessToken: string,
): Promise<SearchConsoleSite[]> {
  const res = await fetch(`${WEBMASTERS_BASE}/sites`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`listSites failed (${res.status}): ${text}`);
  }
  const json = (await res.json()) as {
    siteEntry?: Array<{ siteUrl: string; permissionLevel: string }>;
  };
  return (json.siteEntry ?? []).map((s) => ({
    siteUrl: s.siteUrl,
    permissionLevel: s.permissionLevel,
  }));
}

/**
 * Pick the best Search Console property URL for our site.
 * Prefers the URL-prefix property matching SITE.url, then a Domain
 * property, then anything containing the bare hostname.
 */
export function pickPropertyForSite(
  sites: SearchConsoleSite[],
  siteUrl = SITE.url,
): SearchConsoleSite | undefined {
  const wantHttps = siteUrl.replace(/\/?$/, "/");
  const wantHost = new URL(siteUrl).hostname.replace(/^www\./, "");
  return (
    sites.find((s) => s.siteUrl === wantHttps) ||
    sites.find((s) => s.siteUrl === `sc-domain:${wantHost}`) ||
    sites.find((s) => s.siteUrl.includes(wantHost))
  );
}

export async function submitSitemap(
  accessToken: string,
  siteUrl: string,
  sitemapUrl: string,
): Promise<{ ok: true } | { ok: false; status: number; body: string }> {
  const url = `${WEBMASTERS_BASE}/sites/${encodeURIComponent(siteUrl)}/sitemaps/${encodeURIComponent(sitemapUrl)}`;
  const res = await fetch(url, {
    method: "PUT",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (res.status === 200 || res.status === 204) {
    return { ok: true };
  }
  const body = await res.text();
  return { ok: false, status: res.status, body };
}

export async function getSitemapStatus(
  accessToken: string,
  siteUrl: string,
  sitemapUrl: string,
): Promise<SitemapStatus | null> {
  const url = `${WEBMASTERS_BASE}/sites/${encodeURIComponent(siteUrl)}/sitemaps/${encodeURIComponent(sitemapUrl)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`getSitemapStatus failed (${res.status}): ${text}`);
  }
  return (await res.json()) as SitemapStatus;
}

export async function inspectUrl(
  accessToken: string,
  siteUrl: string,
  inspectionUrl: string,
): Promise<UrlInspectionResult> {
  const res = await fetch(`${SC_BASE}/urlInspection/index:inspect`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inspectionUrl,
      siteUrl,
      languageCode: "en-US",
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    return { url: inspectionUrl, error: `${res.status}: ${text}` };
  }

  const json = (await res.json()) as {
    inspectionResult?: {
      inspectionResultLink?: string;
      indexStatusResult?: UrlInspectionResult["indexStatusResult"];
    };
  };
  return {
    url: inspectionUrl,
    inspectionResultLink: json.inspectionResult?.inspectionResultLink,
    indexStatusResult: json.inspectionResult?.indexStatusResult,
  };
}

/** Default sitemap URL for this property. */
export function defaultSitemapUrl(): string {
  return `${SITE.url.replace(/\/$/, "")}/sitemap.xml`;
}
