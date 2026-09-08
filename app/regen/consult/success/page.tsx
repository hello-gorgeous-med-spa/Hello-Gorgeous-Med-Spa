import { redirect } from "next/navigation";

import { REGEN_TELEHEALTH_PATH } from "@/lib/regen/telehealth-consult";

/** Old $99 Stripe consult checkout landed here. That flow is retired. */
export default function ConsultSuccessPage() {
  redirect(REGEN_TELEHEALTH_PATH);
}
