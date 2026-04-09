import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  HUB_SESSION_COOKIE_NAME,
  hubPasswordGateEnabled,
  verifyHubSessionToken,
} from "@/lib/hub-session";

/** Redirect to /hub/login when gate is on and cookie is missing/invalid (Node runtime — sees Vercel env). */
export async function requireHubPageSession(nextPath: string): Promise<void> {
  if (!hubPasswordGateEnabled()) return;
  const store = await cookies();
  const token = store.get(HUB_SESSION_COOKIE_NAME)?.value;
  if (!(await verifyHubSessionToken(token))) {
    redirect(`/hub/login?next=${encodeURIComponent(nextPath)}`);
  }
}
