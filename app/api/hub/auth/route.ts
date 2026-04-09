import { NextRequest, NextResponse } from "next/server";
import { HUB_SESSION_COOKIE_NAME, hubPasswordGateEnabled, signHubSession, type HubUser } from "@/lib/hub-session";

export async function POST(req: NextRequest) {
  if (!hubPasswordGateEnabled()) {
    return NextResponse.json({ error: "Hub passwords are not configured" }, { status: 503 });
  }
  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const password = String(body?.password || "");
  const dani = process.env.HUB_PASSWORD_DANI?.trim();
  const ryan = process.env.HUB_PASSWORD_RYAN?.trim();
  let user: HubUser | null = null;
  if (dani && password === dani) user = "dani";
  else if (ryan && password === ryan) user = "ryan";
  if (!user) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }
  const token = await signHubSession(user);
  const res = NextResponse.json({ ok: true, user });
  res.cookies.set(HUB_SESSION_COOKIE_NAME, token, {
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
  res.cookies.set(HUB_SESSION_COOKIE_NAME, "", { path: "/", maxAge: 0 });
  return res;
}
