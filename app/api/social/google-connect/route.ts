// ============================================================
// GET /api/social/google-connect — Redirect to Google OAuth
// User clicks "Connect Google" → we send them to Google to sign in and allow.
// ============================================================

import { NextRequest, NextResponse } from "next/server";

const SCOPE = "https://www.googleapis.com/auth/business.manage";

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      { error: "GOOGLE_CLIENT_ID not set. Add it in Vercel (and the callback URL in Google Cloud) first." },
      { status: 500 }
    );
  }
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || request.nextUrl?.origin || "https://www.hellogorgeousmedspa.com";
  const redirectUri = `${baseUrl.replace(/\/$/, "")}/api/social/google-callback`;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: SCOPE,
    access_type: "offline",
    prompt: "consent",
  });
  const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  return NextResponse.redirect(url);
}
