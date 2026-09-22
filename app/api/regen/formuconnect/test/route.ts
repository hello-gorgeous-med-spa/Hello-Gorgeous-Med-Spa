import { NextRequest, NextResponse } from "next/server";
import { requireProviderAreaAccess } from "@/lib/api-auth";
import {
  isFormuConnectConfigured,
  isFormuConnectLiveSubmitEnabled,
  testFormuConnectConnection,
} from "@/lib/formuconnect";

/**
 * GET /api/regen/formuconnect/test
 * Staff/provider only — pings GET /products with the clinic key.
 */
export async function GET(request: NextRequest) {
  const auth = requireProviderAreaAccess(request);
  if ("error" in auth) return auth.error;

  if (!isFormuConnectConfigured()) {
    return NextResponse.json(
      {
        success: false,
        configured: false,
        liveSubmit: false,
        message: "FormuConnect API key not configured in environment",
      },
      { status: 503 },
    );
  }

  const result = await testFormuConnectConnection();

  return NextResponse.json(
    {
      ...result,
      configured: true,
      liveSubmit: isFormuConnectLiveSubmitEnabled(),
      timestamp: new Date().toISOString(),
    },
    { status: result.success ? 200 : 500 },
  );
}
