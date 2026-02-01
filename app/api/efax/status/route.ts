// ============================================================
// EFAX STATUS API
// Check if eFax API is configured
// ============================================================

import { NextResponse } from 'next/server';

export async function GET() {
  // Check if eFax credentials are configured
  const efaxAccountId = process.env.EFAX_ACCOUNT_ID;
  const efaxApiKey = process.env.EFAX_API_KEY;
  
  const configured = !!(
    efaxAccountId && 
    efaxApiKey && 
    efaxAccountId !== 'placeholder' &&
    efaxApiKey !== 'placeholder'
  );

  return NextResponse.json({
    configured,
    provider: 'efax',
    portalUrl: 'https://myportal.efax.com/login',
  });
}
