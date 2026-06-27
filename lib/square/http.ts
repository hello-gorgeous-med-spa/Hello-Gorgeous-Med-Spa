import "server-only";

import { getAccessToken } from "@/lib/square/oauth";

export const SQUARE_API_VERSION = "2025-04-16";

export function getSquareApiHost(): string {
  const env = (process.env.SQUARE_ENVIRONMENT ?? process.env.SQUARE_ENV ?? "sandbox").toLowerCase();
  return env === "production"
    ? "https://connect.squareup.com"
    : "https://connect.squareupsandbox.com";
}

/** OAuth token from DB, else static SQUARE_ACCESS_TOKEN env fallback. */
export async function resolveSquareAccessToken(): Promise<string | null> {
  const oauth = await getAccessToken();
  if (oauth) return oauth;
  return process.env.SQUARE_ACCESS_TOKEN?.trim() || null;
}

export async function squareApiFetch<T>(
  path: string,
  init: RequestInit & { token?: string } = {},
): Promise<{ ok: true; data: T } | { ok: false; status: number; error: string }> {
  const token = init.token ?? (await resolveSquareAccessToken());
  if (!token) {
    return { ok: false, status: 401, error: "Square not connected — link account in Settings → Payments" };
  }

  const { token: _t, ...rest } = init;
  const res = await fetch(`${getSquareApiHost()}${path}`, {
    ...rest,
    headers: {
      Authorization: `Bearer ${token}`,
      "Square-Version": SQUARE_API_VERSION,
      Accept: "application/json",
      ...(rest.headers as Record<string, string> | undefined),
    },
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = (data as { errors?: { detail?: string; code?: string }[] })?.errors?.[0];
    return { ok: false, status: res.status, error: err?.detail || err?.code || "Square API error" };
  }

  return { ok: true, data: data as T };
}
