import { NextRequest, NextResponse } from "next/server";
import { HUB_SESSION_COOKIE_NAME, hubPasswordGateEnabled, verifyHubSessionToken } from "@/lib/hub-session";

export async function GET(req: NextRequest) {
  if (!hubPasswordGateEnabled()) {
    return NextResponse.json({ user: null, gate: false });
  }
  const user = await verifyHubSessionToken(req.cookies.get(HUB_SESSION_COOKIE_NAME)?.value);
  return NextResponse.json({ user, gate: true });
}
