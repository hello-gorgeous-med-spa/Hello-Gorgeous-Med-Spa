import { NextResponse } from 'next/server';
import { isFullscriptConfigured, testFullscriptConnection } from '@/lib/fullscript/client';

/**
 * GET /api/regen/fullscript/test
 * Test the Fullscript API connection
 */
export async function GET() {
  // Check what's configured
  const envStatus = {
    FULLSCRIPT_PUBLIC_KEY: !!process.env.FULLSCRIPT_PUBLIC_KEY,
    FULLSCRIPT_SECRET_KEY: !!process.env.FULLSCRIPT_SECRET_KEY,
    FULLSCRIPT_SECRET_CHALLENGE_TOKEN: !!process.env.FULLSCRIPT_SECRET_CHALLENGE_TOKEN,
    FULLSCRIPT_SIGNATURE_KEY: !!process.env.FULLSCRIPT_SIGNATURE_KEY,
    FULLSCRIPT_SIGNATURE_SECRETKEY: !!process.env.FULLSCRIPT_SIGNATURE_SECRETKEY,
    FULLSCRIPT_CHALLENGE_TOKEN: !!process.env.FULLSCRIPT_CHALLENGE_TOKEN,
  };

  // Check if API key is configured
  if (!isFullscriptConfigured()) {
    return NextResponse.json({
      success: false,
      configured: false,
      message: 'Fullscript API key not configured',
      envStatus,
    }, { status: 503 });
  }

  // Test the connection
  const result = await testFullscriptConnection();

  return NextResponse.json({
    ...result,
    configured: true,
    envStatus,
    timestamp: new Date().toISOString(),
  }, { status: result.success ? 200 : 500 });
}
