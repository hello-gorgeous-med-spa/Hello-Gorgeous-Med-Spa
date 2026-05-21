// ============================================================
// /book/[slug] → Fresha (service deep link when mapped in fresha-service-slugs)
// ============================================================

import { redirect } from "next/navigation";
import { BOOKING_URL } from "@/lib/flows";
import { mergeBookRedirectUrl } from "@/lib/booking/merge-fresha-redirect-url";
import { freshaBookingUrlForService } from "@/lib/booking/fresha-booking-url";
import { resolveFreshaServiceIdForSlug } from "@/lib/booking/fresha-service-slugs";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function BookSlugRedirect({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const freshaServiceId = await resolveFreshaServiceIdForSlug(slug);
  const baseUrl = freshaBookingUrlForService(freshaServiceId);
  const dest = mergeBookRedirectUrl(baseUrl, sp);
  redirect(dest);
}
