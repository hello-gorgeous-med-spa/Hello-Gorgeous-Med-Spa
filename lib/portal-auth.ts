import type { SupabaseClient } from "@supabase/supabase-js";

export type PortalClientRow = {
  id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  is_blocked?: boolean | null;
};

/** Resolve a portal client by email (clients, user_profiles, users → clients). */
export async function findPortalClientByEmail(
  supabase: SupabaseClient,
  emailNorm: string,
): Promise<PortalClientRow | null> {
  const select = "id, email, first_name, last_name, is_blocked";

  const { data: byClientEmail } = await supabase
    .from("clients")
    .select(select)
    .ilike("email", emailNorm)
    .maybeSingle();
  if (byClientEmail) return byClientEmail as PortalClientRow;

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("client_id")
    .ilike("email", emailNorm)
    .not("client_id", "is", null)
    .maybeSingle();

  if (profile?.client_id) {
    const { data: byProfile } = await supabase
      .from("clients")
      .select(select)
      .eq("id", profile.client_id)
      .maybeSingle();
    if (byProfile) return byProfile as PortalClientRow;
  }

  const { data: user } = await supabase
    .from("users")
    .select("id")
    .ilike("email", emailNorm)
    .maybeSingle();

  if (user?.id) {
    const { data: byUserId } = await supabase
      .from("clients")
      .select(select)
      .eq("user_id", user.id)
      .maybeSingle();
    if (byUserId) return byUserId as PortalClientRow;
  }

  return null;
}

export function safePortalRedirect(raw: unknown): string {
  if (typeof raw !== "string" || !raw.startsWith("/") || raw.startsWith("//")) {
    return "/portal";
  }
  if (raw.startsWith("/portal/login") || raw.startsWith("/portal/verify")) {
    return "/portal";
  }
  return raw;
}
