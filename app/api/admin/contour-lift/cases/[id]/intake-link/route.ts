import { NextRequest, NextResponse } from "next/server";
import { withAnyPermission } from "@/lib/api-auth";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";
import { signClIntakeToken, isIntakeHmacConfigured } from "@/lib/contour-clinical/intake-hmac";

type RouteContext = { params: Promise<{ id: string }> };

const DEFAULT_TTL_SEC = 60 * 60 * 24 * 30; // 30 days

/**
 * GET — build signed public intake URL for this case.
 */
export async function GET(request: NextRequest, context: RouteContext) {
  const auth = withAnyPermission(request, ["clients.edit"]);
  if ("error" in auth) return auth.error;

  if (!isIntakeHmacConfigured()) {
    return NextResponse.json(
      { error: "Set CLINIC_INTAKE_HMAC_SECRET in production to generate secure intake links." },
      { status: 503 }
    );
  }

  const { id } = await context.params;
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  const { data: row, error } = await supabase
    .from("cl_quantum_cases")
    .select("id")
    .eq("id", id)
    .maybeSingle();
  if (error || !row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const ttl = Math.min(
    60 * 60 * 24 * 90,
    Math.max(60 * 60, Number(new URL(request.url).searchParams.get("ttl")) || DEFAULT_TTL_SEC)
  );
  const exp = Math.floor(Date.now() / 1000) + Math.floor(ttl);
  const sig = signClIntakeToken(id, exp);

  const u = new URL("/contour-lift/intake", requestOriginFromHeaders(request));
  u.searchParams.set("case", id);
  u.searchParams.set("exp", String(exp));
  u.searchParams.set("sig", sig);

  return NextResponse.json({
    url: u.toString(),
    expiresAt: new Date(exp * 1000).toISOString(),
  });
}

function requestOriginFromHeaders(request: NextRequest): string {
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const rawProto = request.headers.get("x-forwarded-proto");
  const nextProto = request.nextUrl?.protocol
    ? request.nextUrl.protocol.replace(":", "")
    : "https";
  const proto = (rawProto || nextProto).split(",")[0]?.trim() || "https";
  if (host) return `${proto}://${host.split(",")[0].trim()}`;
  return "http://localhost:3000";
}
