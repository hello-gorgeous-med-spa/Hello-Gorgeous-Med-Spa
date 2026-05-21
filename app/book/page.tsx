// ============================================================
// Public booking — /book → Fresha (merges UTM / ad click IDs)
// ============================================================

import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BOOKING_URL } from "@/lib/flows";
import { pageMetadata } from "@/lib/seo";
import { mergeBookRedirectUrl } from "@/lib/booking/merge-fresha-redirect-url";
import { freshaBookingUrlForService } from "@/lib/booking/fresha-booking-url";
import { resolveFreshaServiceIdForSlug } from "@/lib/booking/fresha-service-slugs";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Book Consultation | Hello Gorgeous Med Spa",
    description:
      "Book your consultation at Hello Gorgeous Med Spa in Oswego, IL. Schedule injectables, Morpheus8, Quantum RF, Solaria CO2, medical weight loss, and wellness visits.",
    path: "/book",
  }),
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default async function BookPage({ searchParams }: Props) {
  const sp = await searchParams;
  const slugParam = sp["service"];
  const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam;

  let baseUrl = BOOKING_URL;
  if (slug) {
    const freshaServiceId = await resolveFreshaServiceIdForSlug(slug);
    baseUrl = freshaBookingUrlForService(freshaServiceId);
  }

  const forwarded: Record<string, string | string[] | undefined> = { ...sp };
  delete forwarded["service"];

  const dest = mergeBookRedirectUrl(baseUrl, forwarded);
  redirect(dest);
}
