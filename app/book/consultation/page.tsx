// ============================================================
// Free consult booking → trusted external scheduler (same as /book).
// ============================================================

import { redirect } from "next/navigation";
import { PROGRAM_CONSULT_BOOKING_URL } from "@/lib/flows";

export default function ConsultationBookRedirect() {
  redirect(PROGRAM_CONSULT_BOOKING_URL);
}
