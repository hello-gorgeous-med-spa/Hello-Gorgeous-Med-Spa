// ============================================================
// /book/[slug] → Square Appointments (org booking site)
// ============================================================

import { redirect } from "next/navigation";
import { BOOKING_URL } from "@/lib/flows";
import { mergeBookRedirectUrl } from "@/lib/booking/merge-fresha-redirect-url";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function BookSlugRedirect({ params, searchParams }: Props) {
  await params; // slug reserved for future Square service deep links
  const sp = await searchParams;
  const dest = mergeBookRedirectUrl(BOOKING_URL, sp);
  redirect(dest);
}
