import { getSupabaseAdminClient } from "@/lib/hgos/supabase-admin";

const BUFFER_MS = 5 * 60 * 1000;

export type GoogleBusinessTokenRow = {
  access_token: string;
  refresh_token: string | null;
  expires_at: string | null;
  account_id: string | null;
  location_id: string | null;
};

export async function loadGoogleBusinessTokenRow(): Promise<GoogleBusinessTokenRow | null> {
  const supabase = getSupabaseAdminClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("hg_oauth_tokens")
    .select("access_token, refresh_token, expires_at, account_id, location_id")
    .eq("provider", "google_business_profile")
    .maybeSingle();

  if (error || !data?.access_token) return null;
  return data as GoogleBusinessTokenRow;
}

/** Valid access token; refreshes OAuth and persists to hg_oauth_tokens when near expiry. */
export async function getGoogleBusinessAccessToken(row: GoogleBusinessTokenRow): Promise<string | null> {
  const exp = row.expires_at ? new Date(row.expires_at).getTime() : 0;
  if (exp && exp - Date.now() > BUFFER_MS) {
    return row.access_token;
  }

  const refresh = row.refresh_token?.trim();
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!refresh || !clientId || !clientSecret) {
    return row.access_token;
  }

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      refresh_token: refresh,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token",
    }),
  });

  const token = (await tokenRes.json()) as {
    access_token?: string;
    expires_in?: number;
    error?: string;
  };

  if (!tokenRes.ok || !token.access_token) {
    console.error("[google-business] refresh failed:", token.error || token);
    return row.access_token;
  }

  const expiresAt = token.expires_in
    ? new Date(Date.now() + Number(token.expires_in) * 1000).toISOString()
    : null;

  const supabase = getSupabaseAdminClient();
  if (supabase) {
    await supabase
      .from("hg_oauth_tokens")
      .update({
        access_token: token.access_token,
        expires_at: expiresAt,
        updated_at: new Date().toISOString(),
      })
      .eq("provider", "google_business_profile");
  }

  return token.access_token;
}

export async function resolveAccountAndLocationIds(
  accessToken: string,
  storedAccountId: string | null,
  storedLocationId: string | null
): Promise<{ accountId: string; locationId: string } | null> {
  if (storedAccountId && storedLocationId) {
    return { accountId: storedAccountId, locationId: storedLocationId };
  }

  const accountsRes = await fetch("https://mybusinessaccountmanagement.googleapis.com/v1/accounts", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const accountsData = (await accountsRes.json()) as { accounts?: { name?: string }[] };
  const firstAcc = accountsData?.accounts?.[0]?.name;
  if (!firstAcc) return null;
  const accountId = String(firstAcc).replace(/^accounts\//, "");

  const locationsRes = await fetch(
    `https://mybusinessbusinessinformation.googleapis.com/v1/accounts/${accountId}/locations`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  const locationsData = (await locationsRes.json()) as { locations?: { name?: string }[] };
  const firstLoc = locationsData?.locations?.[0]?.name || "";
  const match = String(firstLoc).match(/\/locations\/(.+)$/);
  const locationId = match?.[1] || "";
  if (!accountId || !locationId) return null;

  const supabase = getSupabaseAdminClient();
  if (supabase) {
    await supabase
      .from("hg_oauth_tokens")
      .update({ account_id: accountId, location_id: locationId, updated_at: new Date().toISOString() })
      .eq("provider", "google_business_profile");
  }

  return { accountId, locationId };
}
