import type { SupabaseClient } from "@supabase/supabase-js";

type ClientRow = Record<string, unknown>;
type UserRow = { first_name?: string | null; last_name?: string | null; email?: string | null; phone?: string | null };

export function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function displayName(client: ClientRow, user?: UserRow | null): string {
  const fromUser = `${user?.first_name || ""} ${user?.last_name || ""}`.trim();
  const fromClient = `${client.first_name || ""} ${client.last_name || ""}`.trim();
  const full = String(client.full_name || "").trim();
  return fromUser || fromClient || full || "Patient";
}

export function clientEmail(client: ClientRow, user?: UserRow | null): string | null {
  return (user?.email as string | null) ?? (client.email as string | null) ?? null;
}

export function clientPhone(client: ClientRow, user?: UserRow | null): string | null {
  return (user?.phone as string | null) ?? (client.phone as string | null) ?? null;
}

export async function loadClientWithUser(
  admin: SupabaseClient,
  clientId: string,
): Promise<{ client: ClientRow; user: UserRow | null } | null> {
  const { data: client, error } = await admin.from("clients").select("*").eq("id", clientId).maybeSingle();
  if (error || !client) return null;

  let user: UserRow | null = null;
  if (client.user_id) {
    const { data } = await admin
      .from("users")
      .select("first_name, last_name, email, phone")
      .eq("id", client.user_id)
      .maybeSingle();
    user = data;
  }

  return { client: client as ClientRow, user };
}

export function normalizeEmail(email: string | null | undefined): string | null {
  const v = email?.trim().toLowerCase();
  return v && v.includes("@") ? v : null;
}

export function normalizePhone(phone: string | null | undefined): string | null {
  const digits = (phone || "").replace(/\D/g, "");
  return digits.length >= 10 ? digits.slice(-10) : null;
}
