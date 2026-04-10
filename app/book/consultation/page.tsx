// ============================================================
// Free consult booking → trusted external scheduler (same as /book).
// ============================================================

import { redirect } from "next/navigation";
import { BOOKING_URL } from "@/lib/flows";

export default function ConsultationBookRedirect() {
  redirect(BOOKING_URL);
}
