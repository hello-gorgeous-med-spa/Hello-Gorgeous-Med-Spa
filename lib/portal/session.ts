import type { NextRequest } from "next/server";

import { createAdminSupabaseClient } from "@/lib/hgos/supabase";

export type PortalClientSession = {
  clientId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
};

export async function getPortalClientSession(
  request: NextRequest,
): Promise<PortalClientSession | null> {
  const sessionToken = request.cookies.get("portal_session")?.value;
  if (!sessionToken) return null;

  const supabase = createAdminSupabaseClient();
  if (!supabase) return null;

  const { data: session } = await supabase
    .from("client_sessions")
    .select("client_id, client:clients(id, email, first_name, last_name, phone)")
    .eq("session_token", sessionToken)
    .is("revoked_at", null)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();

  const client = session?.client as
    | {
        id: string;
        email: string | null;
        first_name: string | null;
        last_name: string | null;
        phone: string | null;
      }
    | null
    | undefined;

  if (!session?.client_id || !client?.id) return null;

  return {
    clientId: client.id,
    email: client.email?.trim() || "",
    firstName: client.first_name,
    lastName: client.last_name,
    phone: client.phone,
  };
}
