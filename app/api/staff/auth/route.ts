import { NextRequest, NextResponse } from "next/server";

import {
  STAFF_SESSION_COOKIE_NAME,
  getStaffPortalPin,
  pinMatches,
  signStaffSession,
  staffPortalGateEnabled,
} from "@/lib/staff-session";

export async function POST(req: NextRequest) {
  if (!staffPortalGateEnabled()) {
    return NextResponse.json({ error: "Staff PIN is not configured" }, { status: 503 });
  }

  let body: { pin?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const pin = String(body?.pin ?? body?.password ?? "");
  const expected = getStaffPortalPin();
  if (!expected || !pinMatches(pin, expected)) {
    return NextResponse.json({ error: "Invalid PIN" }, { status: 401 });
  }

  const token = await signStaffSession();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(STAFF_SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(STAFF_SESSION_COOKIE_NAME, "", { path: "/", maxAge: 0 });
  return res;
}
