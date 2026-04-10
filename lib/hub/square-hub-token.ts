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
