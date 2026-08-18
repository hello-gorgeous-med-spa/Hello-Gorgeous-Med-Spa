import { NextResponse } from "next/server";

import { getConsentFormCatalog } from "@/lib/hgos/consent-forms";
import { KIOSK_CORE_FORM_IDS } from "@/lib/kiosk/start-visit";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    forms: getConsentFormCatalog(),
    coreIds: KIOSK_CORE_FORM_IDS,
  });
}
