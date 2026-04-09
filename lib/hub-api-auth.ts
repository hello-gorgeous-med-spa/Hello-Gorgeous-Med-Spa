import { NextRequest, NextResponse } from "next/server";
import {
  hubPasswordGateEnabled,
  verifyHubSessionToken,
  HUB_SESSION_COOKIE_NAME,
  type HubUser,
} from "@/lib/hub-session";

export function hubUserFromQuery(req: NextRequest, bodyUser?: string | null): HubUser {
  const q = (req.nextUrl.searchParams.get("user") || bodyUser || "dani").toLowerCase();
  return q === "ryan" ? "ryan" : "dani";
}

/** Hub JSON APIs: when password gate is on, a valid session is required; `user` selects Dani vs Ryan data (shared Command Center). */
export async function requireHubApi(
  req: NextRequest,
  body?: { user?: string } | null
): Promise<{ userKey: HubUser } | NextResponse> {
  const requested = hubUserFromQuery(req, body?.user);
  if (!hubPasswordGateEnabled()) {
    return { userKey: requested };
  }
  const sessionUser = await verifyHubSessionToken(req.cookies.get(HUB_SESSION_COOKIE_NAME)?.value);
  if (!sessionUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return { userKey: requested };
}

/** Routes without a user param (e.g. Square summary) — require a valid hub session when gate is on */
export async function requireHubSessionOrOpen(
  req: NextRequest
): Promise<{ ok: true } | NextResponse> {
  if (!hubPasswordGateEnabled()) return { ok: true };
  const u = await verifyHubSessionToken(req.cookies.get(HUB_SESSION_COOKIE_NAME)?.value);
  if (!u) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return { ok: true };
}
