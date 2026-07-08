// ============================================================
// /book/[slug] → Square Appointments booking page
// ============================================================

import { redirect } from "next/navigation";
import { BOOKING_URL } from "@/lib/flows";
import { mergeBookRedirectUrl } from "@/lib/booking/merge-fresha-redirect-url";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function BookSlugRedirect({ params, searchParams }: Props) {
  await params; // reserved for future Square service deep links
  const sp = await searchParams;
  // Keep branded /book as embed home; deep links open Square start URL
  const dest = mergeBookRedirectUrl(BOOKING_URL, sp);
  redirect(dest);
}
