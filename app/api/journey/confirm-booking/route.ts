/**
 * GET /api/journey/confirm-booking
 * Reads session_id from cookie (hg_roadmap_session) or query param.
 * Sets journey_sessions.conversion_status = 'booked', clears cookie, redirects to thank-you.
 *
 * POST /api/journey/confirm-booking
 * Same but returns 200 JSON (no redirect). Used when booking completes on our own /book
 * so we mark the journey as booked without leaving the confirmation screen.
 */
import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase-server";

const COOKIE_NAME = "hg_roadmap_session";
const THANK_YOU_PATH = "/book/thank-you";

async function markSessionBooked(sessionId: string | null): Promise<boolean> {
  if (!sessionId) return false;
  const supabase = getSupabase();
  if (!supabase) return false;
  const { error } = await supabase
    .from("journey_sessions")
    .update({ conversion_status: "booked" })
    .eq("id", sessionId);
  if (error) {
    console.error("journey confirm-booking update error", error);
    return false;
  }
  return true;
}

export async function GET(request: NextRequest) {
  const sessionId =
    request.cookies.get(COOKIE_NAME)?.value?.trim() ||
    request.nextUrl.searchParams.get("session_id")?.trim();

  const redirectRes = NextResponse.redirect(
    new URL(THANK_YOU_PATH, request.url),
    302
  );
  redirectRes.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  await markSessionBooked(sessionId);
  return redirectRes;
}

export async function POST(request: NextRequest) {
  const sessionId =
    request.cookies.get(COOKIE_NAME)?.value?.trim() ||
    request.nextUrl.searchParams.get("session_id")?.trim();

  const updated = await markSessionBooked(sessionId);

  const res = NextResponse.json({ ok: updated, booked: updated });
  res.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return res;
}
