// ============================================================
// /portal/book → Fresha (same as public /book)
// ============================================================

import { redirect } from "next/navigation";
import { BOOKING_URL } from "@/lib/flows";
import { mergeBookRedirectUrl } from "@/lib/booking/merge-fresha-redirect-url";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function PortalBookRedirect({ searchParams }: Props) {
  const sp = await searchParams;
  redirect(mergeBookRedirectUrl(BOOKING_URL, sp));
}
