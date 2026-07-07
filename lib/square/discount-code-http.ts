/**
 * Square HTTP helpers for scripts (no server-only oauth dependency).
 */

export const SQUARE_API_VERSION = "2025-04-16";

export function getSquareApiHost(): string {
  const env = (process.env.SQUARE_ENVIRONMENT ?? process.env.SQUARE_ENV ?? "sandbox").toLowerCase();
  return env === "production"
    ? "https://connect.squareup.com"
    : "https://connect.squareupsandbox.com";
}

export function dollarsToCents(dollars: number): number {
  return Math.round(dollars * 100);
}

export async function squareApiFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<{ ok: true; data: T } | { ok: false; status: number; error: string }> {
  const token = process.env.SQUARE_ACCESS_TOKEN?.trim();
  if (!token) {
    return { ok: false, status: 401, error: "SQUARE_ACCESS_TOKEN is not set" };
  }

  const res = await fetch(`${getSquareApiHost()}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Square-Version": SQUARE_API_VERSION,
      Accept: "application/json",
      ...(init.headers as Record<string, string> | undefined),
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = (data as { errors?: { detail?: string; code?: string }[] })?.errors?.[0];
    return {
      ok: false,
      status: res.status,
      error: err?.detail || err?.code || JSON.stringify(data),
    };
  }

  return { ok: true, data: data as T };
}
