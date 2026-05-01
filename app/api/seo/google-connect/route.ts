// ============================================================
// GET /api/seo/google-connect — Redirect to Google OAuth for Search Console
// ============================================================
// Use the same Google Cloud Console OAuth client that powers the GBP
// integration, but request the `webmasters` scope so we can submit
// sitemaps and inspect URLs in Google Search Console.
// One-time setup: add the redirect URI below to the OAuth client's
// "Authorized redirect URIs" in Google Cloud Console.
// See docs/GOOGLE_SEARCH_CONSOLE_SETUP.md for the full walkthrough.
// ============================================================

import { NextRequest, NextResponse } from "next/server";

const SCOPE = "https://www.googleapis.com/auth/webmasters";

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      {
        error:
          "GOOGLE_CLIENT_ID not set. Add it in Vercel and the redirect URI in Google Cloud Console first (see docs/GOOGLE_SEARCH_CONSOLE_SETUP.md).",
      },
      { status: 500 },
    );
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    request.nextUrl?.origin ||
    "https://www.hellogorgeousmedspa.com";
  const redirectUri = `${baseUrl.replace(/\/$/, "")}/api/seo/google-callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: SCOPE,
    access_type: "offline",
    prompt: "consent",
    include_granted_scopes: "true",
  });

  const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  return NextResponse.redirect(url);
}
