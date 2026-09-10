import { NextResponse } from "next/server";

import {
  REGEN_TELEHEALTH_BOOKING_URL,
  REGEN_TELEHEALTH_PATH,
} from "@/lib/regen/telehealth-consult";

/**
 * Old $99 Stripe + fake time-slot consult. Retired.
 * Consults now go through /contact. `url` is kept so a cached form still leaves this site.
 */
export async function POST() {
  return NextResponse.json(
    {
      retired: true,
      error: "Consults now start at /contact.",
      url: REGEN_TELEHEALTH_BOOKING_URL,
      page: REGEN_TELEHEALTH_PATH,
    },
    { status: 410 },
  );
}
