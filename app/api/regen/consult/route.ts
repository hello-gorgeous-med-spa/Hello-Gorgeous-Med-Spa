import { NextResponse } from "next/server";

import {
  REGEN_TELEHEALTH_BOOKING_URL,
  REGEN_TELEHEALTH_PATH,
} from "@/lib/regen/telehealth-consult";

/**
 * Old $99 Stripe + fake time-slot consult. Retired.
 * Clients book Ryan on Square. `url` is kept so a cached form still leaves this site.
 */
export async function POST() {
  return NextResponse.json(
    {
      retired: true,
      error: "Consults now book on Ryan's Square calendar.",
      url: REGEN_TELEHEALTH_BOOKING_URL,
      page: REGEN_TELEHEALTH_PATH,
    },
    { status: 410 },
  );
}
