export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/hgos/supabase";
import { loadRegenPublicOrderStatus } from "@/lib/regen/order-status-public";

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

  const [clientRes, walletRes, referralRes] = await Promise.all([
    supabase
      .from("clients")
      .select("first_name, last_name, date_of_birth, total_visits, email")
      .eq("id", clientId)
      .single(),

    supabase
      .from("patient_wallet")
      .select("reward_points, credit_balance")
      .eq("client_id", clientId)
      .single(),

    supabase
      .from("referral_codes")
      .select("code, uses, credits_earned")
      .eq("client_id", clientId)
      .maybeSingle(),
  ]);

  const client = clientRes.data;
  const wallet = walletRes.data;
  const clientEmail = client?.email?.trim() || null;

  // Match appointments across duplicate client rows that share the same email (Fresha vs portal).
  let clientIds = [clientId];
  if (clientEmail) {
    const { data: siblings } = await supabase
      .from("clients")
      .select("id")
      .ilike("email", clientEmail);
    if (siblings?.length) {
      clientIds = [...new Set(siblings.map((c) => c.id))];
    }
  }

  const [nextRes, lastRes] = await Promise.all([
    supabase
      .from("appointments")
      .select("id, starts_at, status, type, service:services(name)")
      .in("client_id", clientIds)
      .in("status", ["pending", "confirmed", "checked_in"])
      .gte("starts_at", now)
      .order("starts_at", { ascending: true })
      .limit(1)
      .maybeSingle(),

    supabase
      .from("appointments")
      .select("id, starts_at, status, service:services(name)")
      .in("client_id", clientIds)
      .eq("status", "completed")
      .lt("starts_at", now)
      .order("starts_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  let next = nextRes.data;
  const last = lastRes.data;

  // Active RE GEN orders for this email — powers telehealth visibility in the app.
  let regenOrders: Awaited<ReturnType<typeof loadRegenPublicOrderStatus>>[] = [];
  if (clientEmail) {
    const { data: orderRows } = await supabase
      .from("regen_orders")
      .select("reference")
      .ilike("customer_email", clientEmail)
      .not("status", "eq", "cancelled")
      .order("created_at", { ascending: false })
      .limit(3);

    regenOrders = (
      await Promise.all(
        (orderRows ?? []).map((row) => loadRegenPublicOrderStatus(supabase, String(row.reference))),
      )
    ).filter((o): o is NonNullable<typeof o> => Boolean(o));
  }

  const activeRegenOrder =
    regenOrders.find((o) => o.paid && !o.shipped && (!o.telehealthCompletedAt || !o.intakeComplete)) ??
    regenOrders[0] ??
    null;

  // If Fresha appointment isn't linked to portal client_id yet, surface RE GEN telehealth time.
  if (!next && activeRegenOrder?.telehealthVisit && !activeRegenOrder.telehealthCompletedAt) {
    next = {
      id: `regen-${activeRegenOrder.reference}`,
      starts_at: activeRegenOrder.telehealthVisit.startsAt,
      status: "confirmed",
      type: "telehealth",
      service: { name: activeRegenOrder.telehealthVisit.serviceName },
    };
  }

  let referral = referralRes.data;
  if (!referral) {
    const code = `HG${clientId.replace(/-/g, "").slice(0, 7).toUpperCase()}`;
    const { data: newRef } = await supabase
      .from("referral_codes")
      .upsert({ client_id: clientId, code }, { onConflict: "client_id" })
      .select("code, uses, credits_earned")
      .maybeSingle();
    referral = newRef;
  }

  const totalVisits = client?.total_visits ?? 0;

  let daysSinceLast: number | null = null;
  if (last?.starts_at) {
    daysSinceLast = Math.floor(
      (Date.now() - new Date(last.starts_at).getTime()) / (1000 * 60 * 60 * 24),
    );
  }

  function serviceName(appt: typeof next | typeof last): string | null {
    if (!appt) return null;
    const s = appt.service;
    if (!s) return null;
    if (Array.isArray(s)) return (s[0] as { name: string })?.name ?? null;
    return (s as { name: string }).name ?? null;
  }

  let birthdayInDays: number | null = null;
  let isBirthday = false;
  if (client?.date_of_birth) {
    const today = new Date();
    const dob = new Date(client.date_of_birth);
    const nextBday = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
    if (nextBday < today) nextBday.setFullYear(today.getFullYear() + 1);
    birthdayInDays = Math.ceil((nextBday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    isBirthday = birthdayInDays === 0 || birthdayInDays === 365;
  }

  const nextIsTelehealth =
    Boolean(next && String((next as { type?: string }).type || "").toLowerCase().includes("telehealth")) ||
    Boolean(activeRegenOrder?.telehealthVisit && next?.id === `regen-${activeRegenOrder.reference}`);

  return NextResponse.json({
    authenticated: true,
    clientId,
    firstName: client?.first_name ?? null,
    totalVisits,
    birthdayInDays,
    isBirthday,
    referralCode: referral?.code ?? null,
    referralUses: referral?.uses ?? 0,
    referralCreditsEarned: referral?.credits_earned ?? 0,
    nextAppointment: next
      ? {
          id: next.id,
          startsAt: next.starts_at,
          serviceName: serviceName(next),
          isTelehealth: nextIsTelehealth,
          regenOrderRef: next.id.startsWith("regen-") ? next.id.replace("regen-", "") : null,
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
    activeRegenOrder,
    regenOrders: regenOrders.map((o) => ({
      reference: o.reference,
      title: o.title,
      telehealthScheduledAt: o.telehealthScheduledAt,
      telehealthCompletedAt: o.telehealthCompletedAt,
      nextAction: o.nextAction,
    })),
    rewardPoints: wallet?.reward_points ?? 0,
    creditBalance: wallet?.credit_balance ?? 0,
  });
}
