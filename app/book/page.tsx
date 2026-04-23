// ============================================================
// Public booking (Model B) → Fresha. Forwards allowlisted query
// params (utm_*, gclid, …) — see lib/booking/merge-fresha-redirect-url.ts
// ============================================================

import { redirect } from "next/navigation";
import { BOOKING_URL } from "@/lib/flows";
import { mergeBookRedirectUrl } from "@/lib/booking/merge-fresha-redirect-url";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function BookPageRedirect({ searchParams }: Props) {
  const sp = await searchParams;
  const dest = mergeBookRedirectUrl(BOOKING_URL, sp);
  redirect(dest);
}
