// ============================================================
// GET /api/social/google-callback — Google redirects here with ?code=
// We exchange code for tokens, fetch account + location IDs, show copyable result.
// ============================================================

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl?.origin || "https://www.hellogorgeousmedspa.com";
  const redirectUri = `${baseUrl.replace(/\/$/, "")}/api/social/google-callback`;

  if (!code) {
    return htmlResponse(
      "Missing code",
      "<p>Google did not send a code. Try <a href='/admin/marketing/post-social'>Post to social</a> and click Connect Google again.</p>",
      400
    );
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return htmlResponse(
      "Config missing",
      "<p>GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set in your environment (e.g. Vercel).</p>",
      500
    );
  }

  // Exchange code for tokens
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
    error?: string;
    error_description?: string;
  };

  if (tokenData.error || !tokenData.access_token) {
    return htmlResponse(
      "Token error",
      `<p>Could not get tokens: ${tokenData.error_description || tokenData.error || "unknown"}.</p>
       <p><a href="/admin/marketing/post-social">Back to Post to social</a></p>`,
      400
    );
  }

  const accessToken = tokenData.access_token;
  const refreshToken = tokenData.refresh_token || "";

  // Fetch accounts
  const accountsRes = await fetch("https://mybusinessaccountmanagement.googleapis.com/v1/accounts", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const accountsData = (await accountsRes.json()) as { accounts?: { name: string }[]; error?: { message: string } };

  let accountId = "";
  let locationId = "";

  if (accountsData.error) {
    return htmlResponse(
      "Accounts error",
      `<p>Could not list accounts: ${accountsData.error.message}. You still have a refresh token below — use it in Vercel. Get Account ID and Location ID manually (see docs).</p>
       ${copySection(refreshToken, "", "")}`,
      200
    );
  }

  const accounts = accountsData.accounts || [];
  if (accounts.length === 0) {
    return htmlResponse(
      "No accounts",
      "<p>No Business Profile accounts found for this Google account. Add the refresh token below to Vercel and get Account/Location IDs from business.google.com or the API.</p>" +
        copySection(refreshToken, "", ""),
      200
    );
  }

  // First account: name is "accounts/1234567890"
  const firstAccount = accounts[0];
  accountId = firstAccount.name?.replace("accounts/", "")?.trim() || "";

  // Fetch locations for this account
  const locationsRes = await fetch(
    `https://mybusinessbusinessinformation.googleapis.com/v1/accounts/${accountId}/locations`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  const locationsData = (await locationsRes.json()) as {
    locations?: { name: string }[];
    error?: { message: string };
  };

  if (!locationsData.error && locationsData.locations?.length) {
    const firstLocation = locationsData.locations[0];
    const name = firstLocation.name || "";
    const match = name.match(/\/locations\/(.+)$/);
    locationId = match ? match[1].trim() : "";
  }

  return htmlResponse(
    "Google connected — copy to Vercel",
    `<p><strong>Add these 5 environment variables in Vercel</strong>, then redeploy.</p>
     <p>You already have <code>GOOGLE_CLIENT_ID</code> and <code>GOOGLE_CLIENT_SECRET</code>. Add the three below:</p>
     ${copySection(refreshToken, accountId, locationId)}
     <p><a href="/admin/marketing/post-social">Back to Post to social</a></p>`,
    200
  );
}

function copySection(refreshToken: string, accountId: string, locationId: string): string {
  return `
  <div style="font-family: system-ui; max-width: 600px; margin: 20px 0;">
    <div style="margin: 12px 0;">
      <label style="display: block; font-weight: 600; margin-bottom: 4px;">GOOGLE_REFRESH_TOKEN</label>
      <input type="text" readonly value="${escapeHtml(refreshToken)}" style="width: 100%; padding: 8px; font-size: 12px;" onclick="this.select()" />
    </div>
    <div style="margin: 12px 0;">
      <label style="display: block; font-weight: 600; margin-bottom: 4px;">GOOGLE_BUSINESS_ACCOUNT_ID</label>
      <input type="text" readonly value="${escapeHtml(accountId)}" style="width: 100%; padding: 8px;" onclick="this.select()" />
    </div>
    <div style="margin: 12px 0;">
      <label style="display: block; font-weight: 600; margin-bottom: 4px;">GOOGLE_BUSINESS_LOCATION_ID</label>
      <input type="text" readonly value="${escapeHtml(locationId)}" style="width: 100%; padding: 8px;" onclick="this.select()" />
    </div>
  </div>`;
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
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 640px; margin: 40px auto; padding: 0 20px; }
    a { color: #ec4899; }
    code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; }
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
