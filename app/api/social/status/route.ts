// ============================================================
// GET /api/social/status — Which channels are configured (no secrets)
// ============================================================

import { NextResponse } from "next/server";

export async function GET() {
  const pageId = process.env.META_PAGE_ID || process.env.FACEBOOK_PAGE_ID;
  const pageToken =
    process.env.META_PAGE_ACCESS_TOKEN || process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  const facebook = !!(pageId && pageToken);
  const igAccountId =
    process.env.META_INSTAGRAM_BUSINESS_ACCOUNT_ID ||
    process.env.META_IG_ACCOUNT_ID;
  const instagram = !!(igAccountId && pageToken);
  const google = !!(
    process.env.GOOGLE_CLIENT_ID &&
    process.env.GOOGLE_CLIENT_SECRET &&
    process.env.GOOGLE_REFRESH_TOKEN &&
    process.env.GOOGLE_BUSINESS_ACCOUNT_ID &&
    process.env.GOOGLE_BUSINESS_LOCATION_ID
  );
  return NextResponse.json({
    facebook: { configured: facebook },
    instagram: { configured: instagram, note: "Requires an image URL for each post" },
    google: { configured: google, note: "Uses OAuth (refresh token). See docs/SOCIAL_POSTING_SETUP.md" },
  });
}
