export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";

async function getClientFromSession(request: NextRequest): Promise<string | null> {
  const supabase = createAdminSupabaseClient();
  if (!supabase) return null;
  const token = request.cookies.get("portal_session")?.value;
  if (!token) return null;
  const { data } = await supabase
    .from("client_sessions")
    .select("client_id")
    .eq("session_token", token)
    .is("revoked_at", null)
    .gt("expires_at", new Date().toISOString())
    .single();
  return data?.client_id ?? null;
}

export async function GET(request: NextRequest) {
  const supabase = createAdminSupabaseClient();
  if (!supabase) return NextResponse.json({ authenticated: false });

  const clientId = await getClientFromSession(request);
  if (!clientId) return NextResponse.json({ authenticated: false });

  const now = new Date().toISOString();

  const [clientRes, nextRes, lastRes, walletRes] = await Promise.all([
    supabase
      .from("clients")
      .select("first_name, last_name")
      .eq("id", clientId)
      .single(),

    // Next upcoming appointment
    supabase
      .from("appointments")
      .select("id, starts_at, status, service:services(name)")
      .eq("client_id", clientId)
      .in("status", ["pending", "confirmed", "checked_in"])
      .gte("starts_at", now)
      .order("starts_at", { ascending: true })
      .limit(1)
      .single(),

    // Most recent completed appointment
    supabase
      .from("appointments")
      .select("id, starts_at, status, service:services(name)")
      .eq("client_id", clientId)
      .eq("status", "completed")
      .lt("starts_at", now)
      .order("starts_at", { ascending: false })
      .limit(1)
      .single(),

    supabase
      .from("patient_wallet")
      .select("reward_points, credit_balance")
      .eq("client_id", clientId)
      .single(),
  ]);

  const client = clientRes.data;
  const next = nextRes.data;
  const last = lastRes.data;
  const wallet = walletRes.data;

  let daysSinceLast: number | null = null;
  if (last?.starts_at) {
    daysSinceLast = Math.floor(
      (Date.now() - new Date(last.starts_at).getTime()) / (1000 * 60 * 60 * 24)
    );
  }

  // Pull service name from joined relation (Supabase returns it as object or array)
  function serviceName(appt: typeof next | typeof last): string | null {
    if (!appt) return null;
    const s = appt.service;
    if (!s) return null;
    if (Array.isArray(s)) return (s[0] as { name: string })?.name ?? null;
    return (s as { name: string }).name ?? null;
  }

  return NextResponse.json({
    authenticated: true,
    firstName: client?.first_name ?? null,
    nextAppointment: next
      ? {
          id: next.id,
          startsAt: next.starts_at,
          serviceName: serviceName(next),
        }
      : null,
    lastAppointment: last
      ? {
          id: last.id,
          startsAt: last.starts_at,
          serviceName: serviceName(last),
          daysSince: daysSinceLast,
        }
      : null,
    rewardPoints: wallet?.reward_points ?? 0,
    creditBalance: wallet?.credit_balance ?? 0,
  });
}
