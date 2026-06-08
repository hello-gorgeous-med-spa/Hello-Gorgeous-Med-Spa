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

/** Create a minimal client + user for first-time app sign-up (email verified via magic link). */
export async function provisionPortalClientForEmail(
  supabase: SupabaseClient,
  opts: {
    emailNorm: string;
    firstName: string;
    lastName?: string;
    phone?: string;
  },
): Promise<PortalClientRow | null> {
  const existing = await findPortalClientByEmail(supabase, opts.emailNorm);
  if (existing) {
    if (existing.is_blocked) return null;
    return existing;
  }

  const firstName = opts.firstName.trim();
  const lastName = (opts.lastName ?? "").trim();
  const phoneDigits = opts.phone?.replace(/\D/g, "") || null;

  const { data: newUser, error: userError } = await supabase
    .from("users")
    .insert({
      email: opts.emailNorm,
      first_name: firstName,
      last_name: lastName,
      phone: phoneDigits,
      role: "client",
    })
    .select("id")
    .single();

  if (userError || !newUser) {
    if (userError?.code === "23505") {
      return findPortalClientByEmail(supabase, opts.emailNorm);
    }
    console.error("[portal-auth] provision user failed", userError);
    return null;
  }

  const { data: newClient, error: clientError } = await supabase
    .from("clients")
    .insert({
      user_id: newUser.id,
      email: opts.emailNorm,
      first_name: firstName,
      last_name: lastName,
      phone: phoneDigits,
      referral_source: "app_self_register",
      is_new_client: true,
      accepts_email_marketing: true,
    })
    .select("id, email, first_name, last_name, is_blocked")
    .single();

  if (clientError || !newClient) {
    console.error("[portal-auth] provision client failed", clientError);
    return null;
  }

  return newClient as PortalClientRow;
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
