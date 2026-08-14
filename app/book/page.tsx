// ============================================================
// Public booking — /book → Square Appointments start URL (merges UTM / ad click IDs)
// ============================================================

import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { mergeBookRedirectUrl } from "@/lib/booking/merge-fresha-redirect-url";
import { BOOKING_URL, squareAppointmentServiceUrl } from "@/lib/flows";
import { pageMetadata } from "@/lib/seo";
import { resolveServiceVariationIdForSlug } from "@/lib/square/service-slugs";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Book Consultation | Hello Gorgeous Med Spa",
    description:
      "Book your consultation at Hello Gorgeous Med Spa in Oswego, IL. Schedule injectables, Morpheus8, Quantum RF, Solaria CO2, medical weight loss, and wellness visits online with Square.",
    path: "/book",
  }),
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

function firstParam(v: string | string[] | undefined): string | null {
  if (v == null) return null;
  const s = Array.isArray(v) ? v[0] : v;
  return typeof s === "string" && s.trim() ? s.trim() : null;
}

export default async function BookPage({ searchParams }: Props) {
  const sp = await searchParams;
  const forwarded: Record<string, string | string[] | undefined> = { ...sp };
  const serviceSlug = firstParam(forwarded["service"]);
  delete forwarded["service"];

  let dest = BOOKING_URL;
  if (serviceSlug) {
    const variationId = await resolveServiceVariationIdForSlug(serviceSlug);
    if (variationId) dest = squareAppointmentServiceUrl(variationId);
  }

  redirect(mergeBookRedirectUrl(dest, forwarded));
}
