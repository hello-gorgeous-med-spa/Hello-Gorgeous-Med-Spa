/**
 * iPad desk hub: phone + picked forms → HG client + walk-in visit + packets + kiosk URL.
 * Does not use Hub / Square.
 */
import crypto from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";

import { findClientsByPhoneLoose, phoneLast10 } from "@/lib/checkin-lookup";
import {
  getConsentForm,
  type ConsentFormType,
} from "@/lib/hgos/consent-forms";
import { createKioskConsentSession } from "@/lib/kiosk/create-kiosk-session";
import { normalizeToE164 } from "@/lib/phone-e164";

export const KIOSK_CORE_FORM_IDS: ConsentFormType[] = [
  "hipaa_authorization",
  "arbitration_agreement",
  "liability_waiver",
  "general_consent",
];

export type KioskStartVisitOk = {
  ok: true;
  path: string;
  token: string;
  expiresAt: string;
  clientName: string;
  clientId: string;
  appointmentId: string;
  packetsCreated: number;
  outstandingCount: number;
  skippedAlreadySigned: string[];
};

export type KioskStartVisitErr = {
  ok: false;
  status: number;
  error: string;
  matches?: { id: string; name: string }[];
};

export async function startKioskVisit(
  admin: SupabaseClient,
  opts: {
    phone: string;
    formIds: string[];
    firstName?: string;
    lastName?: string;
    clientId?: string;
  },
): Promise<KioskStartVisitOk | KioskStartVisitErr> {
  const last10 = phoneLast10(opts.phone);
  if (!last10) {
    return { ok: false, status: 400, error: "Enter a valid 10-digit mobile number." };
  }

  const uniqueIds = [...new Set(opts.formIds.map((id) => id.trim()).filter(Boolean))];
  const forms = uniqueIds
    .map((id) => getConsentForm(id as ConsentFormType))
    .filter((f): f is NonNullable<typeof f> => !!f);
  if (!forms.length) {
    return { ok: false, status: 400, error: "Pick at least one consent form." };
  }

  let clientId = opts.clientId?.trim() || "";
  let clientName = "";

  if (clientId) {
    const { data: row } = await admin
      .from("clients")
      .select("id, first_name, last_name")
      .eq("id", clientId)
      .maybeSingle();
    if (!row?.id) {
      return { ok: false, status: 404, error: "Client not found." };
    }
    clientId = row.id;
    clientName = [row.first_name, row.last_name].filter(Boolean).join(" ") || "Guest";
  } else {
    const matches = await findClientsByPhoneLoose(admin, opts.phone);
    if (matches.length > 1) {
      return {
        ok: false,
        status: 409,
        error: "More than one chart uses this number. Pick the right client.",
        matches: matches.map((m) => ({
          id: m.id,
          name: [m.first_name, m.last_name].filter(Boolean).join(" ") || "Guest",
        })),
      };
    }
    if (matches.length === 1) {
      clientId = matches[0].id;
      clientName =
        [matches[0].first_name, matches[0].last_name].filter(Boolean).join(" ") || "Guest";
    } else {
      const first = (opts.firstName || "").trim();
      const last = (opts.lastName || "").trim();
      if (!first) {
        return {
          ok: false,
          status: 404,
          error: "No chart for this number. Enter first and last name to start a new client.",
        };
      }
      const phoneStore = normalizeToE164(opts.phone) || last10;
      const baseClient = {
        first_name: first,
        last_name: last || null,
        phone: phoneStore,
      };
      let created: { id: string; first_name: string | null; last_name: string | null } | null = null;
      let error = null as { message?: string } | null;
      {
        const res = await admin
          .from("clients")
          .insert({ ...baseClient, source: "kiosk", referral_source: "kiosk_ipad" })
          .select("id, first_name, last_name")
          .single();
        created = res.data;
        error = res.error;
        if (error?.message && /source|referral_source/i.test(error.message)) {
          const retry = await admin.from("clients").insert(baseClient).select("id, first_name, last_name").single();
          created = retry.data;
          error = retry.error;
        }
      }
      if (error || !created) {
        return {
          ok: false,
          status: 500,
          error: error?.message || "Could not create client chart.",
        };
      }
      clientId = created.id;
      clientName = [created.first_name, created.last_name].filter(Boolean).join(" ") || first;
    }
  }

  const now = new Date();
  const end = new Date(now.getTime() + 30 * 60 * 1000);
  const aptPayload = {
    client_id: clientId,
    starts_at: now.toISOString(),
    ends_at: end.toISOString(),
    status: "confirmed",
    booking_source: "kiosk",
    client_notes: "iPad consent visit",
    consent_signed: false,
  };
  let apt: { id: string } | null = null;
  let aptErr: { message?: string } | null = null;
  {
    const res = await admin.from("appointments").insert(aptPayload).select("id").single();
    apt = res.data;
    aptErr = res.error;
    if (aptErr?.message && /booking_source/i.test(aptErr.message)) {
      const { booking_source: _drop, ...rest } = aptPayload;
      const retry = await admin.from("appointments").insert(rest).select("id").single();
      apt = retry.data;
      aptErr = retry.error;
    }
  }

  if (aptErr || !apt) {
    return {
      ok: false,
      status: 500,
      error: aptErr?.message || "Could not open today's visit.",
    };
  }

  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  const { data: signed } = await admin
    .from("consent_packets")
    .select("template_name, signed_at")
    .eq("client_id", clientId)
    .eq("status", "signed")
    .gte("signed_at", oneYearAgo.toISOString());
  const signedNames = new Set((signed || []).map((s) => (s.template_name || "").toLowerCase()));

  const wizardToken = crypto.randomBytes(32).toString("base64url");
  const wizardExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const skippedAlreadySigned: string[] = [];
  const toCreate = [];

  for (const form of forms) {
    if (signedNames.has(form.name.toLowerCase())) {
      skippedAlreadySigned.push(form.shortName || form.name);
      continue;
    }
    toCreate.push({
      client_id: clientId,
      appointment_id: apt.id,
      template_id: null,
      template_name: form.name,
      template_version: Number.parseInt(String(form.version), 10) || 1,
      template_content: {
        formId: form.id,
        content: form.content,
        name: form.name,
      },
      status: "draft",
      wizard_token: wizardToken,
      wizard_expires_at: wizardExpiresAt.toISOString(),
    });
  }

  if (toCreate.length) {
    const { data: inserted, error: packErr } = await admin
      .from("consent_packets")
      .insert(toCreate)
      .select("id");
    if (packErr) {
      return { ok: false, status: 500, error: packErr.message || "Could not create forms." };
    }
    for (const packet of inserted || []) {
      await admin.from("consent_events").insert({
        packet_id: packet.id,
        event: "created",
        actor_type: "staff",
        meta: { source: "kiosk_ipad", appointment_id: apt.id },
      });
    }
  }

  const session = await createKioskConsentSession(admin, apt.id, {
    staffUserId: null,
    source: "staff",
  });

  if (!session.ok) {
    if (session.code === "no_outstanding") {
      return {
        ok: false,
        status: 409,
        error:
          skippedAlreadySigned.length > 0
            ? `Already on file this year: ${skippedAlreadySigned.join(", ")}. Nothing new to sign.`
            : session.message,
      };
    }
    return { ok: false, status: 500, error: session.message };
  }

  return {
    ok: true,
    path: session.path,
    token: session.token,
    expiresAt: session.expiresAt,
    clientName,
    clientId,
    appointmentId: apt.id,
    packetsCreated: toCreate.length,
    outstandingCount: session.outstandingCount,
    skippedAlreadySigned,
  };
}
