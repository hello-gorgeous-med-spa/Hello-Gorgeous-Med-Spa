// ============================================================
// Public booking — /book → Square Appointments start URL (merges UTM / ad click IDs)
// ============================================================

import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { mergeBookRedirectUrl } from "@/lib/booking/merge-fresha-redirect-url";
import { BOOKING_URL } from "@/lib/flows";
import { pageMetadata } from "@/lib/seo";

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

export default async function BookPage({ searchParams }: Props) {
  const sp = await searchParams;
  const forwarded: Record<string, string | string[] | undefined> = { ...sp };
  delete forwarded["service"];

  redirect(mergeBookRedirectUrl(BOOKING_URL, forwarded));
}
