// ============================================================
// GET /api/auth/session — Admin/staff session from hgos_session cookie
// Single source of truth for portal role (client UI syncs from here).
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import {
  parseHgosSessionCookie,
  resolveSessionRole,
} from "@/lib/hgos-session";

export async function GET(request: NextRequest) {
  try {
    const raw = request.cookies.get("hgos_session")?.value;
    const parsed = parseHgosSessionCookie(raw);
    if (!parsed?.userId) {
      return NextResponse.json({ role: null, userId: null, email: null, isOwner: false });
    }

    const email = typeof parsed.email === "string" ? parsed.email : null;
    const role = resolveSessionRole(parsed.role, email);
    const userId = parsed.userId ?? null;

    return NextResponse.json({
      role,
      userId,
      email,
      isOwner: role === "owner" || role === "admin",
    });
  } catch {
    return NextResponse.json({ role: null, userId: null, email: null, isOwner: false });
  }
}
