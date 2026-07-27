import { getAccessToken } from "@/lib/square/oauth";

export const HUB_SQUARE_API_VERSION = "2024-11-20";

export function hubSquareApiBase(): string {
  return process.env.SQUARE_ENVIRONMENT === "production"
    ? "https://connect.squareup.com"
    : "https://connect.squareupsandbox.com";
}

export type HubSquareTokenOk = { token: string; connection: "oauth" | "env" };
export type HubSquareTokenErr = { error: string; setupPath: string };

export async function resolveHubSquareToken(): Promise<HubSquareTokenOk | HubSquareTokenErr> {
  try {
    const oauth = await getAccessToken();
    if (oauth) {
      return { token: oauth, connection: "oauth" };
    }
  } catch (e) {
    console.error("[hub/square] getAccessToken:", e);
  }

  const envToken = process.env.SQUARE_ACCESS_TOKEN || process.env.SQUARE_TOKEN;
  if (envToken) {
    return { token: envToken, connection: "env" };
  }

  return {
    error:
      "Square is not connected. Use Admin → Settings → Payments → Connect Square, or set SQUARE_ACCESS_TOKEN.",
    setupPath: "/admin/settings/payments",
  };
}

/**
 * Bookings/Appointments need seller-level APPOINTMENTS_ALL_READ.
 * OAuth connections often lack that scope and return an empty list (not an error).
 * Prefer env personal access token when present; otherwise OAuth.
 */
export async function resolveHubSquareBookingsToken(): Promise<HubSquareTokenOk | HubSquareTokenErr> {
  const envToken = process.env.SQUARE_ACCESS_TOKEN || process.env.SQUARE_TOKEN;
  if (envToken) {
    return { token: envToken, connection: "env" };
  }

  try {
    const oauth = await getAccessToken();
    if (oauth) {
      return { token: oauth, connection: "oauth" };
    }
  } catch (e) {
    console.error("[hub/square] getAccessToken (bookings):", e);
  }

  return {
    error:
      "Square Bookings needs a token with Appointments read access. Set SQUARE_ACCESS_TOKEN in Vercel, or reconnect Square OAuth with Appointments scopes.",
    setupPath: "/admin/settings/payments",
  };
}

/** If primary token returns 0 bookings, try the other source once. */
export async function resolveHubSquareBookingsTokenFallback(
  used: HubSquareTokenOk,
): Promise<HubSquareTokenOk | null> {
  if (used.connection === "env") {
    try {
      const oauth = await getAccessToken();
      if (oauth) return { token: oauth, connection: "oauth" };
    } catch {
      /* ignore */
    }
    return null;
  }
  const envToken = process.env.SQUARE_ACCESS_TOKEN || process.env.SQUARE_TOKEN;
  return envToken ? { token: envToken, connection: "env" } : null;
}
