import type { SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";
import { logRxPatientAccess } from "@/lib/rx-patients/audit";
import {
  clientEmail,
  clientPhone,
  displayName,
  initialsFromName,
  loadClientWithUser,
  normalizeEmail,
  normalizePhone,
} from "@/lib/rx-patients/resolve";
import type { RxPatientSummary } from "@/lib/rx-patients/types";

async function collectRxActiveClientIds(admin: SupabaseClient): Promise<Set<string>> {
  const ids = new Set<string>();

  const tables = [
    { table: "hg_rx_refill_plans", col: "client_id" },
    { table: "hg_rx_message_threads", col: "client_id" },
    { table: "hg_form_submissions", col: "client_id" },
    { table: "hg_rx_clinic_encounters", col: "client_id" },
    { table: "hg_rx_payment_ledger", col: "client_id" },
  ] as const;

  for (const { table, col } of tables) {
    const { data, error } = await admin.from(table).select(col).not(col, "is", null).limit(400);
    if (error?.code === "42P01") continue;
    for (const row of data ?? []) {
      const id = (row as Record<string, unknown>)[col];
      if (id) ids.add(String(id));
    }
  }

  return ids;
}

export async function searchRxPatients(
  input: { query?: string; limit?: number; actorEmail: string },
  client?: SupabaseClient | null,
): Promise<RxPatientSummary[]> {
  const admin = client ?? getSupabaseAdminClient();
  if (!admin) return [];

  const limit = Math.min(80, Math.max(1, input.limit ?? 40));
  const q = input.query?.trim().toLowerCase() ?? "";
  const rxActiveIds = await collectRxActiveClientIds(admin);

  let query = admin.from("clients").select("*").order("created_at", { ascending: false }).limit(limit);

  if (q) {
    query = query.or(
      `first_name.ilike.%${q}%,last_name.ilike.%${q}%,full_name.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%`,
    );
  } else if (rxActiveIds.size > 0) {
    query = admin
      .from("clients")
      .select("*")
      .in("id", [...rxActiveIds].slice(0, limit))
      .order("updated_at", { ascending: false });
  }

  const { data: clients, error } = await query;
  if (error?.code === "42P01") return [];
  if (error) {
    console.warn("[rx-patients/search]", error.message);
    return [];
  }

  const userIds = [...new Set((clients ?? []).map((c) => c.user_id).filter(Boolean))] as string[];
  const userMap = new Map<string, Record<string, unknown>>();
  if (userIds.length) {
    const { data: users } = await admin
      .from("users")
      .select("id, first_name, last_name, email, phone")
      .in("id", userIds);
    for (const u of users ?? []) userMap.set(String(u.id), u);
  }

  const emailIndex = new Map<string, string>();
  const summaries: RxPatientSummary[] = [];

  for (const row of clients ?? []) {
    const user = row.user_id ? userMap.get(String(row.user_id)) : null;
    const name = displayName(row, user as Parameters<typeof displayName>[1]);
    const email = clientEmail(row, user as Parameters<typeof clientEmail>[1]);
    const phone = clientPhone(row, user as Parameters<typeof clientPhone>[1]);
    const normEmail = normalizeEmail(email);

    let duplicateOf: string | null = null;
    if (normEmail && emailIndex.has(normEmail)) {
      duplicateOf = emailIndex.get(normEmail) ?? null;
    } else if (normEmail) {
      emailIndex.set(normEmail, String(row.id));
    }

    summaries.push({
      id: String(row.id),
      name,
      initials: initialsFromName(name),
      email,
      phone,
      state: (row.state as string | null) ?? null,
      since: String(row.created_at || ""),
      rxActive: rxActiveIds.has(String(row.id)),
      duplicateOf,
    });
  }

  await logRxPatientAccess(
    {
      clientId: "list",
      action: "patient_list",
      actorEmail: input.actorEmail,
      detail: { query: q, count: summaries.length },
    },
    admin,
  );

  return summaries.sort((a, b) => {
    if (a.rxActive !== b.rxActive) return a.rxActive ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
}

export async function findDuplicatePatients(
  admin: SupabaseClient,
  clientId: string,
  email: string | null,
  phone: string | null,
): Promise<Array<{ id: string; name: string; email: string | null }>> {
  const normEmail = normalizeEmail(email);
  const normPhone = normalizePhone(phone);
  const dupes: Array<{ id: string; name: string; email: string | null }> = [];

  if (normEmail) {
    const { data } = await admin
      .from("clients")
      .select("id, first_name, last_name, full_name, email, user_id")
      .neq("id", clientId)
      .ilike("email", normEmail)
      .limit(5);
    for (const row of data ?? []) {
      const loaded = await loadClientWithUser(admin, String(row.id));
      if (!loaded) continue;
      dupes.push({
        id: String(row.id),
        name: displayName(loaded.client, loaded.user),
        email: clientEmail(loaded.client, loaded.user),
      });
    }
  }

  if (normPhone && dupes.length === 0) {
    const { data } = await admin
      .from("clients")
      .select("id, phone")
      .neq("id", clientId)
      .ilike("phone", `%${normPhone}%`)
      .limit(5);
    for (const row of data ?? []) {
      const loaded = await loadClientWithUser(admin, String(row.id));
      if (!loaded) continue;
      dupes.push({
        id: String(row.id),
        name: displayName(loaded.client, loaded.user),
        email: clientEmail(loaded.client, loaded.user),
      });
    }
  }

  return dupes;
}
