// ============================================================
// LOGIN API ROUTE
// Server-side authentication — owner env creds + Supabase staff accounts
// Sets session cookie for middleware authentication
// ============================================================

import { NextRequest, NextResponse } from "next/server";

import type { AuthUser } from "@/lib/hgos/auth";
import { auditAuthLogin } from "@/lib/audit/middleware";
import {
  authenticateEnvCredentials,
  authenticateStaffWithSupabase,
} from "@/lib/staff-auth";

export const maxDuration = 15;

function createAuthResponse(user: AuthUser, session: { access_token?: string; expires_at: number }) {
  const response = NextResponse.json({
    success: true,
    user,
    session,
  });

  const cookieValue = JSON.stringify({
    userId: user.id,
    role: user.role,
    email: user.email,
  });

  const expiresAt = new Date(session.expires_at * 1000);
  const isProduction = process.env.NODE_ENV === "production";

  response.cookies.set("hgos_session", encodeURIComponent(cookieValue), {
    path: "/",
    expires: expiresAt,
    httpOnly: false,
    secure: isProduction,
    sameSite: "lax",
  });

  return response;
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const envAuth = authenticateEnvCredentials(normalizedEmail, password);
    if (envAuth) {
      auditAuthLogin(envAuth.user.id, envAuth.user.email, true, request).catch(() => {});
      return createAuthResponse(envAuth.user, envAuth.session);
    }

    const staffAuth = await authenticateStaffWithSupabase(normalizedEmail, password);
    if (staffAuth) {
      auditAuthLogin(staffAuth.user.id, staffAuth.user.email, true, request).catch(() => {});
      return createAuthResponse(staffAuth.user, staffAuth.session);
    }

    auditAuthLogin("unknown", normalizedEmail, false, request).catch(() => {});

    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
