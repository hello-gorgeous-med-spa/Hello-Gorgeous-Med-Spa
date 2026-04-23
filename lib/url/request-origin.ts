import type { NextRequest } from "next/server";

/** Origin for the current request (works on Vercel and local dev). */
export function originFromRequest(request: NextRequest): string {
  try {
    return new URL(request.url).origin;
  } catch {
    return (process.env.NEXT_PUBLIC_APP_URL || "https://www.hellogorgeousmedspa.com").replace(
      /\/$/,
      "",
    );
  }
}
