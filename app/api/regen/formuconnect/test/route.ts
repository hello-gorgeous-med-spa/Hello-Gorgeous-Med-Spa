import { NextResponse } from 'next/server';
import { isFormuConnectConfigured, testFormuConnectConnection } from '@/lib/formuconnect';

/**
 * GET /api/regen/formuconnect/test
 * Test the FormuConnect API connection
 */
export async function GET() {
  // Check if API key is configured
  if (!isFormuConnectConfigured()) {
    return NextResponse.json({
      success: false,
      configured: false,
      message: 'FormuConnect API key not configured in environment',
    }, { status: 503 });
  }

  // Test the connection
  const result = await testFormuConnectConnection();

  return NextResponse.json({
    ...result,
    configured: true,
    timestamp: new Date().toISOString(),
  }, { status: result.success ? 200 : 500 });
}
