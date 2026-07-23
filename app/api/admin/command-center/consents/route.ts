import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireMarketingAccess } from "@/lib/api-auth";
import { businessDayToISOBounds } from "@/lib/business-timezone";
import { chicagoTodayYmd } from "@/lib/command-center";
import { getSupabase } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export type CcConsentBoardStatus = "missing" | "sent" | "signed";

function noDb() {
  return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
}

function packetsToBoard(
  packets: { status: string; template_name?: string | null }[],
): { status: CcConsentBoardStatus; form: string } {
  if (!packets.length) {
    return { status: "missing", form: "Treatment consent" };
  }
  const form =
    packets.map((p) => p.template_name).filter(Boolean)[0] || "Treatment consent";
  if (packets.every((p) => p.status === "signed")) {
    return { status: "signed", form };
  }
  if (packets.some((p) => p.status === "sent" || p.status === "viewed" || p.status === "signed")) {
    return { status: "sent", form };
  }
  return { status: "missing", form };
}

function formatApptTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString("en-US", {
      timeZone: "America/Chicago",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export async function GET(request: NextRequest) {
  const auth = requireMarketingAccess(request);
  if ("error" in auth) return auth.error;

  const db = getSupabase();
  if (!db) return noDb();

  const day = chicagoTodayYmd();
  const { startISO, endISO } = businessDayToISOBounds(day);

  const { data: plain, error: plainErr } = await db
    .from("appointments")
    .select("id, starts_at, status, client_id, service:services(name)")
    .gte("starts_at", startISO)
    .lt("starts_at", endISO)
    .not("status", "eq", "cancelled")
    .order("starts_at", { ascending: true })
    .limit(100);

  if (plainErr) {
    return NextResponse.json({ error: plainErr.message }, { status: 500 });
  }

  const ids = (plain || []).map((a) => a.id);
  const clientIds = [
    ...new Set((plain || []).map((a) => a.client_id).filter(Boolean) as string[]),
  ];

  const [{ data: packets }, { data: board }, { data: clients }] = await Promise.all([
    ids.length
      ? db
          .from("consent_packets")
          .select("appointment_id, status, template_name")
          .in("appointment_id", ids)
      : Promise.resolve({
          data: [] as { appointment_id: string; status: string; template_name?: string }[],
        }),
    ids.length
      ? db.from("hg_cc_consent_board").select("*").eq("day", day).in("appointment_id", ids)
      : Promise.resolve({
          data: [] as { appointment_id: string; status: string; form_label?: string }[],
        }),
    clientIds.length
      ? db.from("clients").select("id, users(first_name, last_name)").in("id", clientIds)
      : Promise.resolve({
          data: [] as {
            id: string;
            users?: { first_name?: string; last_name?: string } | { first_name?: string; last_name?: string }[];
          }[],
        }),
  ]);

  const clientMap = new Map<string, string>();
  for (const c of clients || []) {
    const u = Array.isArray(c.users) ? c.users[0] : c.users;
    clientMap.set(
      c.id,
      `${u?.first_name || ""} ${u?.last_name || ""}`.trim() || "Client",
    );
  }

  const boardMap = new Map(
    (board || []).map((b) => [b.appointment_id, b]),
  );
  const packetsByAppt = new Map<string, { status: string; template_name?: string | null }[]>();
  for (const p of packets || []) {
    const list = packetsByAppt.get(p.appointment_id) || [];
    list.push(p);
    packetsByAppt.set(p.appointment_id, list);
  }

  let signed = 0;
  const items = (plain || []).map((a) => {
    const fromPackets = packetsToBoard(packetsByAppt.get(a.id) || []);
    const ov = boardMap.get(a.id);
    const status = (ov?.status as CcConsentBoardStatus) || fromPackets.status;
    if (status === "signed") signed++;
    const svc = Array.isArray(a.service) ? a.service[0] : a.service;
    return {
      id: a.id,
      client: clientMap.get(a.client_id || "") || "Client",
      time: formatApptTime(a.starts_at),
      form: ov?.form_label || fromPackets.form || (svc?.name ? `${svc.name} consent` : "Treatment consent"),
      status,
    };
  });

  return NextResponse.json({
    day,
    signed,
    total: items.length,
    items,
    source: "appointments",
  });
}

const patchSchema = z.object({
  appointmentId: z.string().uuid(),
  action: z.enum(["prepare", "mark_signed"]),
});

export async function PATCH(request: NextRequest) {
  const auth = requireMarketingAccess(request);
  if ("error" in auth) return auth.error;

  const db = getSupabase();
  if (!db) return noDb();

  const body = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid update" }, { status: 400 });
  }

  const day = chicagoTodayYmd();
  const status: CcConsentBoardStatus =
    parsed.data.action === "prepare" ? "sent" : "signed";

  const { data: appt } = await db
    .from("appointments")
    .select("id, service:services(name)")
    .eq("id", parsed.data.appointmentId)
    .maybeSingle();

  if (!appt) {
    return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
  }

  const svc = Array.isArray(appt.service) ? appt.service[0] : appt.service;
  const formLabel = svc?.name ? `${svc.name} consent` : "Treatment consent";

  const { error } = await db.from("hg_cc_consent_board").upsert(
    {
      appointment_id: parsed.data.appointmentId,
      day,
      status,
      form_label: formLabel,
      updated_at: new Date().toISOString(),
      updated_by: auth.user.email || auth.user.id,
    },
    { onConflict: "appointment_id" },
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (parsed.data.action === "prepare") {
    try {
      const origin = request.nextUrl.origin;
      await fetch(`${origin}/api/consents/auto-send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          cookie: request.headers.get("cookie") || "",
        },
        body: JSON.stringify({ appointmentId: parsed.data.appointmentId }),
      });
    } catch {
      /* board still saved */
    }
  }

  return NextResponse.json({
    appointmentId: parsed.data.appointmentId,
    status,
  });
}
