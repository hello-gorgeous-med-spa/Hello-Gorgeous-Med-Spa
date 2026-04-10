// ============================================================
// Public booking uses Fresha (through May 2026) → Square next.
// Custom in-site booking is disabled; /book redirects to trusted URL.
// ============================================================

import { redirect } from "next/navigation";
import { BOOKING_URL } from "@/lib/flows";

export default function BookPageRedirect() {
  redirect(BOOKING_URL);
}
