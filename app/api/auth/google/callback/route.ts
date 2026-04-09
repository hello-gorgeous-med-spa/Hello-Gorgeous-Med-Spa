import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) return NextResponse.json({ error: "Missing code" }, { status: 400 });

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) return NextResponse.json({ error: "Google OAuth env missing" }, { status: 500 });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl.origin;
  const redirectUri = `${baseUrl.replace(/\/$/, "")}/api/auth/google/callback`;

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

  const token = await tokenRes.json();
  if (!tokenRes.ok || !token.access_token) {
    return NextResponse.json({ error: token.error_description || token.error || "Token exchange failed" }, { status: 400 });
  }

  const accessToken = token.access_token as string;
  const refreshToken = (token.refresh_token as string | undefined) || "";

  const accountsRes = await fetch("https://mybusinessaccountmanagement.googleapis.com/v1/accounts", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const accountsData = await accountsRes.json();

  let accountId = "";
  let locationId = "";
  if (accountsData?.accounts?.[0]?.name) {
    accountId = String(accountsData.accounts[0].name).replace("accounts/", "");
    const locationsRes = await fetch(
      `https://mybusinessbusinessinformation.googleapis.com/v1/accounts/${accountId}/locations`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const locationsData = await locationsRes.json();
    const first = locationsData?.locations?.[0]?.name || "";
    const match = String(first).match(/\/locations\/(.+)$/);
    locationId = match?.[1] || "";
  }

  const supabase = getSupabaseAdminClient();
  if (supabase) {
    await supabase.from("hg_oauth_tokens").upsert(
      {
        provider: "google_business_profile",
        access_token: accessToken,
        refresh_token: refreshToken || null,
        scope: token.scope || null,
        account_id: accountId || null,
        location_id: locationId || null,
        expires_at: token.expires_in
          ? new Date(Date.now() + Number(token.expires_in) * 1000).toISOString()
          : null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "provider" }
    );
  }

  const html = `<!doctype html><html><body style="font-family:system-ui;padding:24px;max-width:680px;margin:0 auto"><h1>Google Business connected</h1><p>Token saved to Supabase table <code>hg_oauth_tokens</code>.</p><p><strong>Account ID:</strong> ${accountId || "(not found)"}</p><p><strong>Location ID:</strong> ${locationId || "(not found)"}</p><p><a href="/hub">Back to Hub</a></p></body></html>`;
  return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
