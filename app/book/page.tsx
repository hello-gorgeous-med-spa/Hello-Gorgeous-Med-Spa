// ============================================================
// Public booking → Square Appointments scheduler. Forwards allowlisted query
// params (utm_*, gclid, …) — see lib/booking/merge-fresha-redirect-url.ts
//
// Supports `?service=<slug>` for deep-linking into a specific Square service.
// Slugs are mapped in lib/square/service-slugs.ts. Unknown / missing slugs
// fall back to the generic services list, so links never break.
// ============================================================

import { redirect } from "next/navigation";
import { BOOKING_URL } from "@/lib/flows";
import { mergeBookRedirectUrl } from "@/lib/booking/merge-fresha-redirect-url";
import { bookingUrlForService } from "@/lib/square/booking-url";
import { resolveServiceIdForSlug } from "@/lib/square/service-slugs";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function BookPageRedirect({ searchParams }: Props) {
  const sp = await searchParams;
  const slugParam = sp["service"];
  const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam;

  let baseUrl = BOOKING_URL;
  if (slug) {
    const serviceId = await resolveServiceIdForSlug(slug);
    if (serviceId) baseUrl = bookingUrlForService(serviceId);
  }

  // Strip `service` from forwarded params so it doesn't leak into Square's URL.
  const forwarded: Record<string, string | string[] | undefined> = { ...sp };
  delete forwarded["service"];

  const dest = mergeBookRedirectUrl(baseUrl, forwarded);
  redirect(dest);
}
