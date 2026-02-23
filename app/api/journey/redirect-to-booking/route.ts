/**
 * GET /api/journey/redirect-to-booking?session_id=xxx
 * Sets a cookie with session_id and redirects to the booking URL.
 * When the user returns to our site (e.g. /book/thank-you), confirm-booking can read the cookie
 * and set conversion_status = 'booked'.
 */
import { NextRequest, NextResponse } from "next/server";
import { BOOKING_URL } from "@/lib/flows";

const COOKIE_NAME = "hg_roadmap_session";
const COOKIE_MAX_AGE = 3600; // 1 hour

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("session_id");
  const redirectUrl = new URL(BOOKING_URL);

  const res = NextResponse.redirect(redirectUrl, 302);

  if (sessionId?.trim()) {
    res.cookies.set(COOKIE_NAME, sessionId.trim(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });
  }

  return res;
}
