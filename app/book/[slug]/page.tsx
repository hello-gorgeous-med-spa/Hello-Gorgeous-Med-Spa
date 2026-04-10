// ============================================================
// Legacy /book/[slug] URLs → trusted external booking (Fresha / Square).
// ============================================================

import { redirect } from "next/navigation";
import { BOOKING_URL } from "@/lib/flows";

export default function BookSlugRedirect() {
  redirect(BOOKING_URL);
}
